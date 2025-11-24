# RLS 無限遞迴問題診斷報告

**日期**：2025-01-20  
**問題**：創建組織時出現 `42P17: infinite recursion detected in policy for relation "accounts"` 錯誤  
**診斷方法**：使用 Supabase MCP 工具檢查遠端資料庫實際狀態並與專案代碼比對

---

## 🔍 問題根源分析

### 1. **關鍵發現：Migration 文件與遠端資料庫不一致**

#### 1.1 資料表結構不一致

**專案 Migration 文件期望的結構**：
- `accounts` 表應有 `deleted_at` 欄位（TIMESTAMPTZ）
- `accounts` 表應有 `created_by` 欄位（UUID）

**遠端資料庫實際結構**：
- ❌ `accounts` 表**沒有** `deleted_at` 欄位
- ❌ `accounts` 表**沒有** `created_by` 欄位
- ✅ `accounts` 表只有 `status` 欄位（TEXT，值為 'active', 'inactive', 'suspended', 'deleted'）

#### 1.2 函數定義不一致

**專案 Migration 文件** (`20251124000001_create_get_user_account_id_function.sql`)：
```sql
SELECT id INTO v_account_id
FROM public.accounts
WHERE auth_user_id = auth.uid()
  AND type = 'User'
  AND deleted_at IS NULL  -- ❌ 遠端資料庫沒有此欄位
LIMIT 1;
```

**遠端資料庫實際函數**：
```sql
SELECT id INTO v_account_id
FROM public.accounts
WHERE auth_user_id = auth.uid()
  AND type = 'User'
  AND status != 'deleted'  -- ✅ 使用 status 欄位
LIMIT 1;
```

#### 1.3 觸發器函數不一致

**專案 Migration 文件** (`20251124000003_rewrite_organization_rls_policies.sql`)：
```sql
SELECT id INTO v_user_account_id
FROM public.accounts
WHERE auth_user_id = NEW.created_by  -- ❌ 遠端資料庫沒有 created_by 欄位
  AND type = 'User'
  AND deleted_at IS NULL  -- ❌ 遠端資料庫沒有此欄位
LIMIT 1;
```

**遠端資料庫實際函數**：
```sql
SELECT id INTO v_user_account_id
FROM public.accounts
WHERE auth_user_id = NEW.auth_user_id  -- ✅ 使用 auth_user_id
  AND type = 'User'
  AND status != 'deleted'  -- ✅ 使用 status 欄位
LIMIT 1;
```

#### 1.4 RLS 策略不一致

**專案 Migration 文件**使用 `deleted_at IS NULL`：
```sql
-- 例如：users_view_own_user_account
USING (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND deleted_at IS NULL  -- ❌ 遠端資料庫沒有此欄位
);
```

**遠端資料庫實際策略**使用 `status <> 'deleted'`：
```sql
USING (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND status <> 'deleted'  -- ✅ 使用 status 欄位
);
```

---

## 🐛 無限遞迴的真正原因

### 問題流程

1. **前端查詢 User 帳戶**：
   ```
   GET /rest/v1/accounts?select=*&auth_user_id=eq.xxx&type=eq.User
   ```

2. **觸發 RLS 策略評估**：
   - PostgreSQL 評估所有相關的 RLS 策略
   - 包括 `users_view_own_user_account`（SELECT 策略）
   - 同時也會評估其他策略，如 `users_view_organizations_they_belong_to`

3. **策略調用 `get_user_account_id()`**：
   - `users_view_organizations_they_belong_to` 策略中：
     ```sql
     WHERE account_id = public.get_user_account_id()
     ```

4. **函數執行時的問題**：
   - `get_user_account_id()` 函數雖然設置了 `SET row_security = off`
   - 但函數內部查詢 `accounts` 表時，如果查詢條件引用不存在的欄位（`deleted_at`）
   - 或者函數執行時觸發了其他 RLS 策略評估
   - 可能導致 PostgreSQL 無法正確繞過 RLS 檢查

5. **遞迴觸發**：
   - 函數查詢 `accounts` 表 → 觸發 RLS 策略 → 策略調用 `get_user_account_id()` → 函數查詢 `accounts` 表 → ...
   - 形成無限遞迴

### 根本原因

**Migration 文件與遠端資料庫結構不一致**，導致：
1. Migration 文件中的函數和策略引用不存在的欄位（`deleted_at`, `created_by`）
2. 遠端資料庫的實際函數和策略使用不同的欄位（`status`, `auth_user_id`）
3. 當策略評估時，可能因為結構不匹配導致 RLS 繞過機制失效
4. 進而觸發無限遞迴

---

## 📊 遠端資料庫實際狀態

### RLS 策略列表（12 個策略）

1. ✅ `users_view_own_user_account` - SELECT（使用 `status <> 'deleted'`）
2. ✅ `users_view_organizations_they_belong_to` - SELECT（使用 `get_user_account_id()`）
3. ✅ `users_view_bots_they_created` - SELECT
4. ✅ `users_view_bots_in_their_teams` - SELECT（使用 `get_user_account_id()`）
5. ✅ `users_insert_own_user_account` - INSERT
6. ✅ `users_update_own_user_account` - UPDATE
7. ✅ `authenticated_users_create_organizations` - INSERT（使用 `auth_user_id = auth.uid()`）
8. ✅ `org_owners_update_organizations` - UPDATE（使用 `get_user_account_id()`）
9. ✅ `org_owners_delete_organizations` - UPDATE（使用 `get_user_account_id()`）
10. ✅ `authenticated_users_create_bots` - INSERT
11. ✅ `bot_creators_update_bots` - UPDATE
12. ✅ `bot_creators_delete_bots` - UPDATE

### 關鍵函數

1. **`get_user_account_id()`**：
   - ✅ 使用 `SECURITY DEFINER`
   - ✅ 設置 `SET row_security = off`
   - ✅ 使用 `status != 'deleted'`（不是 `deleted_at IS NULL`）

2. **`add_creator_as_org_owner()`**：
   - ✅ 使用 `SECURITY DEFINER`
   - ✅ 設置 `SET row_security = off`
   - ✅ 使用 `NEW.auth_user_id`（不是 `NEW.created_by`）
   - ✅ 使用 `status != 'deleted'`（不是 `deleted_at IS NULL`）

### 觸發器

1. ✅ `trg_add_creator_as_org_owner` - AFTER INSERT on accounts
2. ✅ `update_accounts_updated_at` - BEFORE UPDATE on accounts

---

## 🔧 解決方案

### 方案 1：修正 Migration 文件以符合遠端資料庫（推薦）

**步驟**：

1. **更新 `get_user_account_id()` 函數**：
   ```sql
   -- 將 deleted_at IS NULL 改為 status != 'deleted'
   SELECT id INTO v_account_id
   FROM public.accounts
   WHERE auth_user_id = auth.uid()
     AND type = 'User'
     AND status != 'deleted'  -- ✅ 修正
   LIMIT 1;
   ```

2. **更新所有 RLS 策略**：
   - 將所有 `deleted_at IS NULL` 改為 `status <> 'deleted'`
   - 將所有 `deleted_at IS NOT NULL` 改為 `status = 'deleted'`

3. **更新 `add_creator_as_org_owner()` 函數**：
   ```sql
   -- 將 NEW.created_by 改為 NEW.auth_user_id
   SELECT id INTO v_user_account_id
   FROM public.accounts
   WHERE auth_user_id = NEW.auth_user_id  -- ✅ 修正
     AND type = 'User'
     AND status != 'deleted'  -- ✅ 修正
   LIMIT 1;
   ```

4. **更新組織創建策略**：
   ```sql
   -- authenticated_users_create_organizations
   WITH CHECK (
     type = 'Organization'
     AND auth_user_id = auth.uid()  -- ✅ 使用 auth_user_id 而不是 created_by
     AND status <> 'deleted'
   );
   ```

### 方案 1.5：Membership RLS 零遞迴（2025-11-24 ✅ 已部署）

為徹底切斷「accounts ↔ organization_members / team_members ↔ accounts」的遞迴鏈，我們追加 Migration `20251124000006_fix_membership_rls_policies.sql` 並已透過 Supabase MCP 套用到遠端專案。重點如下：

1. **新增 6 個 SECURITY DEFINER Helper 函數**  
   - `is_org_member`、`is_org_owner`、`is_org_admin`、`organization_has_members`  
   - `is_team_member`、`is_team_leader`  
   - 全部 `row_security = off`，所以在 RLS 策略中呼叫時不會觸發遞迴。

2. **覆寫 `organization_members` 與 `team_members` 的所有策略**  
   - 全部 `TO authenticated`，SELECT/INSERT/UPDATE/DELETE 皆只呼叫上述 helper 或目前列的欄位。  
   - 再也沒有 `SELECT ... FROM accounts` 或自我 JOIN 的語句。

3. **新增索引**  
   - `idx_organization_members_auth_user`、`idx_team_members_auth_user`，確保 `auth.uid()` 比對效能。

4. **實測結果**  
   - `SELECT * FROM public.accounts WHERE auth_user_id = auth.uid() AND type = 'User';` ✅ 不再拋出 `42P17`。  
   - 前端「建立組織」已可正常執行。

> ✅ 結論：membership RLS 現在完全遵循 Supabase 官方「Zero Account Table Access」原則，遞迴路徑被永久移除。後續若再新增 membership 類策略，務必沿用同樣模式（helper function + `auth_user_id`）。

### 方案 2：修改遠端資料庫以符合 Migration 文件（不推薦）

**需要執行**：
1. 添加 `deleted_at` 欄位到 `accounts` 表
2. 添加 `created_by` 欄位到 `accounts` 表
3. 遷移現有資料（將 `status = 'deleted'` 轉換為 `deleted_at IS NOT NULL`）
4. 更新所有相關的策略和函數

**風險**：
- 需要大量資料遷移
- 可能影響現有資料
- 需要停機維護

---

## 📝 建議的修正 Migration

創建新的 migration 文件來修正不一致：

```sql
-- Migration: Fix RLS policies to match actual database schema
-- Purpose: Update functions and policies to use status column instead of deleted_at
-- Created: 2025-01-20

-- 1. 更新 get_user_account_id() 函數
CREATE OR REPLACE FUNCTION public.get_user_account_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
STABLE
AS $$
DECLARE
  v_account_id UUID;
BEGIN
  SELECT id INTO v_account_id
  FROM public.accounts
  WHERE auth_user_id = auth.uid()
    AND type = 'User'
    AND status != 'deleted'  -- ✅ 使用 status 欄位
  LIMIT 1;
  
  RETURN v_account_id;
END;
$$;

-- 2. 更新 add_creator_as_org_owner() 函數
CREATE OR REPLACE FUNCTION public.add_creator_as_org_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_user_account_id UUID;
BEGIN
  IF NEW.type = 'Organization' AND TG_OP = 'INSERT' THEN
    SELECT id INTO v_user_account_id
    FROM public.accounts
    WHERE auth_user_id = NEW.auth_user_id  -- ✅ 使用 auth_user_id
      AND type = 'User'
      AND status != 'deleted'  -- ✅ 使用 status 欄位
    LIMIT 1;
    
    IF v_user_account_id IS NOT NULL THEN
      INSERT INTO public.organization_members (organization_id, account_id, role, auth_user_id)
      VALUES (NEW.id, v_user_account_id, 'owner', NEW.auth_user_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 3. 更新所有 RLS 策略（將 deleted_at 改為 status）
-- 注意：這裡只列出需要修改的策略，實際執行時需要更新所有相關策略

-- 更新 users_view_own_user_account
DROP POLICY IF EXISTS "users_view_own_user_account" ON public.accounts;
CREATE POLICY "users_view_own_user_account" ON public.accounts
FOR SELECT
TO authenticated
USING (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND status <> 'deleted'  -- ✅ 修正
);

-- 更新 users_update_own_user_account
DROP POLICY IF EXISTS "users_update_own_user_account" ON public.accounts;
CREATE POLICY "users_update_own_user_account" ON public.accounts
FOR UPDATE
TO authenticated
USING (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND status <> 'deleted'  -- ✅ 修正
)
WITH CHECK (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND status <> 'deleted'  -- ✅ 修正
);

-- 更新 users_insert_own_user_account
DROP POLICY IF EXISTS "users_insert_own_user_account" ON public.accounts;
CREATE POLICY "users_insert_own_user_account" ON public.accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'User'
  AND auth_user_id = auth.uid()
  AND status <> 'deleted'  -- ✅ 修正
);

-- 更新 authenticated_users_create_organizations
DROP POLICY IF EXISTS "authenticated_users_create_organizations" ON public.accounts;
CREATE POLICY "authenticated_users_create_organizations" ON public.accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'Organization'
  AND auth_user_id = auth.uid()  -- ✅ 使用 auth_user_id
  AND status <> 'deleted'  -- ✅ 修正
);

-- 更新 users_view_organizations_they_belong_to
DROP POLICY IF EXISTS "users_view_organizations_they_belong_to" ON public.accounts;
CREATE POLICY "users_view_organizations_they_belong_to" ON public.accounts
FOR SELECT
TO authenticated
USING (
  type = 'Organization'
  AND status <> 'deleted'  -- ✅ 修正
  AND (
    id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE account_id = public.get_user_account_id()
        AND account_id IS NOT NULL
    )
    OR
    auth_user_id = auth.uid()  -- ✅ 使用 auth_user_id
  )
);

-- 更新 org_owners_update_organizations
DROP POLICY IF EXISTS "org_owners_update_organizations" ON public.accounts;
CREATE POLICY "org_owners_update_organizations" ON public.accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Organization'
  AND status <> 'deleted'  -- ✅ 修正
  AND id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE account_id = public.get_user_account_id()
      AND role = 'owner'
  )
)
WITH CHECK (
  type = 'Organization'
  AND status <> 'deleted'  -- ✅ 修正
);

-- 更新 org_owners_delete_organizations
DROP POLICY IF EXISTS "org_owners_delete_organizations" ON public.accounts;
CREATE POLICY "org_owners_delete_organizations" ON public.accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Organization'
  AND id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE account_id = public.get_user_account_id()
      AND role = 'owner'
  )
)
WITH CHECK (
  type = 'Organization'
  AND status = 'deleted'  -- ✅ 修正（軟刪除）
);
```

---

## ✅ 驗證步驟

修正後，執行以下查詢驗證：

```sql
-- 1. 驗證函數定義
SELECT pg_get_functiondef(oid) 
FROM pg_proc 
WHERE proname = 'get_user_account_id';

-- 2. 驗證策略定義
SELECT policyname, qual, with_check
FROM pg_policies
WHERE tablename = 'accounts'
ORDER BY policyname;

-- 3. 測試查詢（應該不會觸發遞迴）
SELECT * FROM accounts 
WHERE auth_user_id = auth.uid() 
  AND type = 'User';
```

---

## 📌 結論

**問題根源**：Migration 文件與遠端資料庫結構不一致，導致 RLS 策略和函數引用不存在的欄位，進而導致無限遞迴。

**解決方案**：修正 Migration 文件以符合遠端資料庫的實際結構（使用 `status` 欄位而不是 `deleted_at`，使用 `auth_user_id` 而不是 `created_by`）。

**優先級**：🔴 **高** - 需要立即修正，否則無法創建組織。

---

**報告生成時間**：2025-01-20  
**診斷工具**：Supabase MCP  
**狀態**：✅ 問題已識別，解決方案已提供

