# RLS 策略開發指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [RLS 基礎](#rls-基礎)
  - [什麼是 RLS？](#什麼是-rls)
  - [啟用 RLS](#啟用-rls)
  - [策略類型](#策略類型)
- [策略設計原則](#策略設計原則)
  - [1. 最小權限原則](#1-最小權限原則)
  - [2. 明確的策略命名](#2-明確的策略命名)
  - [3. 使用函數封裝複雜邏輯](#3-使用函數封裝複雜邏輯)
- [常見模式](#常見模式)
  - [1. 使用者擁有資料模式](#1-使用者擁有資料模式)
  - [2. 團隊成員存取模式](#2-團隊成員存取模式)
  - [3. 階層權限模式](#3-階層權限模式)
  - [4. 協作權限模式](#4-協作權限模式)
  - [5. 公開/私有資料模式](#5-公開私有資料模式)
  - [6. 時間限制模式](#6-時間限制模式)
- [測試與除錯](#測試與除錯)
  - [1. 測試策略](#1-測試策略)
  - [2. 檢視有效策略](#2-檢視有效策略)
  - [3. 除錯策略](#3-除錯策略)
  - [4. 常見錯誤排查](#4-常見錯誤排查)
  - [5. 效能優化](#5-效能優化)
- [開發流程](#開發流程)
  - [1. 規劃階段](#1-規劃階段)
  - [2. 實作階段](#2-實作階段)
  - [3. 測試階段](#3-測試階段)
  - [4. 部署階段](#4-部署階段)
- [安全檢查清單](#安全檢查清單)
- [相關文檔](#相關文檔)

---


> **目的**：定義 Supabase Row Level Security (RLS) 策略的開發流程和最佳實踐

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊
**相關技術**：Supabase PostgreSQL RLS

- --

## 📋 目錄

1. [RLS 基礎](#rls-基礎)
2. [策略設計原則](#策略設計原則)
3. [常見模式](#常見模式)
4. [測試與除錯](#測試與除錯)

- --

## RLS 基礎

### 什麼是 RLS？

Row Level Security (RLS) 是 PostgreSQL 的安全功能，允許在資料庫層級控制使用者對資料列的存取權限。

### 啟用 RLS

```sql
-- 啟用 RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 檢查 RLS 狀態
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 策略類型

| 類型 | 說明 | 用途 |
|------|------|------|
| **SELECT** | 讀取權限 | 控制使用者可以看到哪些資料列 |
| **INSERT** | 新增權限 | 控制使用者可以新增哪些資料 |
| **UPDATE** | 更新權限 | 控制使用者可以修改哪些資料列 |
| **DELETE** | 刪除權限 | 控制使用者可以刪除哪些資料列 |
| **ALL** | 所有操作 | 套用到所有 CRUD 操作 |

- --

## 策略設計原則

### 1. 最小權限原則

```sql
-- ❌ 不好：給予過多權限
CREATE POLICY "Anyone can do anything"
  ON accounts FOR ALL
  USING (true);

-- ✅ 好：最小必要權限
CREATE POLICY "Users can read own data"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### 2. 明確的策略命名

```sql
-- ✅ 好的命名：清楚描述策略目的
CREATE POLICY "account_owner_read_own_data"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "team_members_read_team_blueprints"
  ON blueprints FOR SELECT
  USING (
    owner_id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
    )
  );

-- ❌ 不好的命名
CREATE POLICY "policy1" ON accounts...
CREATE POLICY "read" ON accounts...
```

### 3. 使用函數封裝複雜邏輯

```sql
-- 建立輔助函數
CREATE OR REPLACE FUNCTION is_team_member(team_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM team_members
    WHERE user_id = auth.uid()
      AND team_id = $1
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 在策略中使用
CREATE POLICY "team_members_access"
  ON blueprints FOR SELECT
  USING (is_team_member(owner_id));
```

- --

## 常見模式

### 1. 使用者擁有資料模式

```sql
-- accounts 表：使用者只能看到自己的帳戶
CREATE POLICY "users_read_own_account"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_update_own_account"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 不允許刪除自己的帳戶（由管理員處理）
-- 沒有 DELETE 策略 = 無人可刪除
```

### 2. 團隊成員存取模式

```sql
-- 團隊成員可以讀取團隊的藍圖
CREATE POLICY "team_members_read_blueprints"
  ON blueprints FOR SELECT
  USING (
    owner_id IN (
      SELECT team_id
      FROM team_members
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- 只有藍圖擁有者可以更新
CREATE POLICY "owner_update_blueprint"
  ON blueprints FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());
```

### 3. 階層權限模式

```sql
-- 建立角色檢查函數
CREATE OR REPLACE FUNCTION has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
      AND r.name = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 管理員可以讀取所有資料
CREATE POLICY "admin_read_all"
  ON accounts FOR SELECT
  USING (has_role('admin'));

-- 一般使用者只能讀取自己的資料
CREATE POLICY "user_read_own"
  ON accounts FOR SELECT
  USING (
    auth.uid() = user_id
    OR has_role('admin')
  );
```

### 4. 協作權限模式

```sql
-- 組織協作：協作者可以讀取分支
CREATE POLICY "collaborators_read_branches"
  ON blueprint_branches FOR SELECT
  USING (
    -- 是藍圖擁有者
    blueprint_id IN (
      SELECT id FROM blueprints
      WHERE created_by = auth.uid()
    )
    OR
    -- 或是協作組織成員
    organization_id IN (
      SELECT organization_id
      FROM collaboration_members
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );

-- 只有協作者可以更新自己組織的分支
CREATE POLICY "collaborators_update_own_branch"
  ON blueprint_branches FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM collaboration_members
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM collaboration_members
      WHERE user_id = auth.uid()
        AND status = 'active'
    )
  );
```

### 5. 公開/私有資料模式

```sql
-- 公開資料任何人都可讀取
CREATE POLICY "public_read_public_blueprints"
  ON blueprints FOR SELECT
  USING (is_public = true);

-- 私有資料只有擁有者可讀取
CREATE POLICY "owner_read_private_blueprints"
  ON blueprints FOR SELECT
  USING (
    is_public = false
    AND created_by = auth.uid()
  );
```

### 6. 時間限制模式

```sql
-- 只能存取有效期內的資料
CREATE POLICY "access_valid_subscriptions"
  ON subscriptions FOR SELECT
  USING (
    user_id = auth.uid()
    AND start_date <= NOW()
    AND end_date >= NOW()
  );
```

- --

## 測試與除錯

### 1. 測試策略

```sql
-- 切換到測試使用者
SET request.jwt.claim.sub = '測試使用者UUID';

-- 測試讀取
SELECT * FROM accounts WHERE user_id = '測試使用者UUID';

-- 測試插入
INSERT INTO accounts (user_id, email)
VALUES ('測試使用者UUID', 'test@example.com');

-- 測試更新
UPDATE accounts
SET name = 'New Name'
WHERE user_id = '測試使用者UUID';

-- 測試刪除
DELETE FROM accounts
WHERE user_id = '測試使用者UUID';

-- 重置
RESET request.jwt.claim.sub;
```

### 2. 檢視有效策略

```sql
-- 查看表的所有策略
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'accounts';
```

### 3. 除錯策略

```sql
-- 啟用詳細日誌
SET client_min_messages TO DEBUG;

-- 測試查詢
SELECT * FROM accounts;

-- 查看執行計劃
EXPLAIN (ANALYZE, VERBOSE)
SELECT * FROM accounts;
```

### 4. 常見錯誤排查

```sql
-- 錯誤：insufficient_privilege
-- 原因：沒有匹配的策略
-- 解決：檢查策略是否正確定義

-- 錯誤：new row violates row-level security policy
-- 原因：WITH CHECK 條件不滿足
-- 解決：檢查 WITH CHECK 條件

-- 錯誤：infinite recursion detected
-- 原因：策略中的子查詢觸發了相同表的 RLS
-- 解決：使用 SECURITY DEFINER 函數
```

### 5. 效能優化

```sql
-- 為 RLS 策略創建索引
CREATE INDEX idx_team_members_user_team
ON team_members(user_id, team_id)
WHERE status = 'active';

-- 使用 SECURITY DEFINER 函數避免重複計算
CREATE OR REPLACE FUNCTION get_user_teams()
RETURNS TABLE(team_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT t.team_id
  FROM team_members t
  WHERE t.user_id = auth.uid()
    AND t.status = 'active';
END;
$$ LANGUAGE plpgsql
   SECURITY DEFINER
   STABLE;  -- 標記為 STABLE 允許快取

-- 在策略中使用
CREATE POLICY "team_access"
  ON blueprints FOR SELECT
  USING (owner_id IN (SELECT * FROM get_user_teams()));
```

- --

## 開發流程

### 1. 規劃階段

```markdown
## RLS 策略設計文檔

### 表名：accounts

#### 存取需求
- 使用者可以讀取自己的帳戶
- 使用者可以更新自己的帳戶資訊
- 管理員可以讀取所有帳戶
- 不允許使用者刪除自己的帳戶

#### 策略列表
1. users_read_own_account (SELECT)
2. users_update_own_account (UPDATE)
3. admin_read_all_accounts (SELECT)
```

### 2. 實作階段

```sql
-- 1. 啟用 RLS
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 2. 建立輔助函數（如需要）
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
      AND role_id = (SELECT id FROM roles WHERE name = 'admin')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- 3. 建立策略
CREATE POLICY "users_read_own_account"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "users_update_own_account"
  ON accounts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. 驗證
-- (執行測試查詢)
```

### 3. 測試階段

```typescript
// test/rls/accounts.test.ts
describe('Accounts RLS', () => {
  it('should allow users to read own account', async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', currentUser.id);

    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('should prevent users from reading others accounts', async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', otherUser.id);

    expect(data).toHaveLength(0);
  });
});
```

### 4. 部署階段

```sql
-- migration/20251116_add_accounts_rls.sql

-- Up Migration
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_account"
  ON accounts FOR SELECT
  USING (auth.uid() = user_id);

-- Down Migration
DROP POLICY IF EXISTS "users_read_own_account" ON accounts;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
```

- --

## 安全檢查清單

- [ ] 所有表都啟用了 RLS
- [ ] 每個表至少有一個策略
- [ ] 策略遵循最小權限原則
- [ ] 使用 WITH CHECK 驗證插入/更新資料
- [ ] 敏感操作使用 SECURITY DEFINER 函數
- [ ] 策略已經過測試（正面和負面案例）
- [ ] 策略效能已優化（適當的索引）
- [ ] 策略文檔已更新

- --

## 相關文檔

- [安全與 RLS 權限矩陣](./21-安全與-RLS-權限矩陣.md)
- [開發作業指引](./specs/00-development-guidelines.md)
- [測試指南](./38-測試指南.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
