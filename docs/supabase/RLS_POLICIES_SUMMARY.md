# RLS 策略總覽

## 概述
本文檔整理所有資料表的 Row Level Security (RLS) 策略，確保數據訪問安全且無循環依賴。

## 核心原則

1. **避免循環依賴**：helper functions 使用 `SET row_security = off`
2. **直接檢查 auth_user_id**：優先使用 `auth.uid()` 而非 JOIN accounts 表
3. **最小權限原則**：只授予必要的訪問權限
4. **類型隔離**：不同 account type 使用不同策略

---

## accounts 表 RLS 策略

### SELECT 策略

#### 1. 用戶查看自己的 User 帳戶
```sql
CREATE POLICY "users_view_own_user_account" ON accounts FOR SELECT
USING (
  type = 'User' 
  AND auth_user_id = auth.uid() 
  AND status <> 'deleted'
);
```

#### 2. 用戶查看所屬組織
```sql
CREATE POLICY "users_view_organizations_they_belong_to" ON accounts FOR SELECT
USING (
  type = 'Organization' 
  AND status <> 'deleted' 
  AND (
    auth_user_id = auth.uid()  -- 創建者
    OR
    id IN (  -- 或成員
      SELECT organization_id
      FROM organization_members
      WHERE account_id = get_user_account_id()
    )
  )
);
```

#### 3. 用戶查看自己創建的 Bot
```sql
CREATE POLICY "users_view_bots_they_created" ON accounts FOR SELECT
USING (
  type = 'Bot' 
  AND status <> 'deleted' 
  AND auth_user_id = auth.uid()
);
```

#### 4. 用戶查看團隊中的 Bot
```sql
CREATE POLICY "users_view_bots_in_their_teams" ON accounts FOR SELECT
USING (
  type = 'Bot' 
  AND status <> 'deleted' 
  AND id IN (
    SELECT tb.bot_id
    FROM team_bots tb
    JOIN team_members tm ON tm.team_id = tb.team_id
    WHERE tm.account_id = get_user_account_id()
  )
);
```

---

## organization_members 表 RLS 策略

### SELECT 策略 ⭐ 關鍵修復

```sql
CREATE POLICY "Users can view organization members" ON organization_members FOR SELECT
USING (
  auth_user_id = auth.uid()  -- ✅ 允許查詢自己的成員關係
  OR
  is_org_member(organization_id)  -- 允許查看已是成員的組織
);
```

**修復說明**：
- **問題**：原策略只有 `is_org_member()` 檢查，導致用戶無法發現自己屬於哪些組織（循環依賴）
- **解決**：添加 `auth_user_id = auth.uid()` 條件，允許用戶直接查詢自己的成員關係
- **影響**：修復組織列表無法顯示的問題

### INSERT 策略

```sql
-- 首次創建組織時添加 owner
CREATE POLICY "Allow initial organization owner on creation" ON organization_members FOR INSERT
WITH CHECK (
  role = 'owner'
  AND auth_user_id = auth.uid()
  AND NOT organization_has_members(organization_id)
);

-- 組織 owner 添加其他成員
CREATE POLICY "Organization owners can add members" ON organization_members FOR INSERT
WITH CHECK (
  is_org_owner(organization_id)
);
```

---

## Helper Functions

### get_user_account_id()
```sql
CREATE OR REPLACE FUNCTION get_user_account_id()
RETURNS uuid
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET row_security TO 'off'
AS $$
BEGIN
  SELECT id INTO v_account_id
  FROM accounts
  WHERE auth_user_id = auth.uid()
    AND type = 'User'
    AND status != 'deleted'
  LIMIT 1;
  
  RETURN v_account_id;
END;
$$;
```

### is_org_member(organization_id)
```sql
CREATE OR REPLACE FUNCTION is_org_member(target_org_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM organization_members
    WHERE organization_id = target_org_id
      AND auth_user_id = auth.uid()
  );
END;
$$;
```

---

## 常見問題修復

### 問題 1：HTTP 406 錯誤
**症狀**：查詢 accounts 表返回 406
**原因**：缺少 `type` 過濾條件，導致 RLS 策略無法評估
**解決**：查詢時必須指定 `type='User'` 或其他 type

### 問題 2：循環依賴
**症狀**：無法查詢自己的組織成員關係
**原因**：SELECT 策略只檢查 `is_org_member()`，導致無法發現自己屬於哪些組織
**解決**：添加 `auth_user_id = auth.uid()` 條件

### 問題 3：snake_case vs camelCase
**症狀**：`invalid input syntax for type uuid: "undefined"`
**原因**：資料庫返回 `organization_id`，代碼讀取 `organizationId`
**解決**：使用 `organization_id` 讀取資料

---

## 遷移文件

- `20251124000001_create_get_user_account_id_function.sql` - 創建 helper function
- `20251124000002_rewrite_user_rls_policies.sql` - User RLS 策略
- `20251124000003_rewrite_organization_rls_policies.sql` - Organization RLS 策略
- `20251124000006_fix_membership_rls_policies.sql` - 成員關係 RLS + helper functions
- `20251124000011_fix_org_members_select_circular_dependency.sql` - ⭐ **修復循環依賴**

---

**最後更新**：2025-11-24  
**狀態**：✅ 所有策略已修復並測試通過

