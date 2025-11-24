# RLS 策略測試指南

## 概述

本文件說明如何測試 RLS (Row Level Security) 策略，確保無無限遞迴錯誤，並驗證租戶隔離正確。

## 測試前準備

### 1. 應用 Migrations

確保所有 RLS migrations 已應用到資料庫：

```bash
# 如果使用 Supabase CLI
supabase db push

# 或者手動執行 SQL 文件（按順序）
# 1. 20251124012800_create_security_definer_function.sql
# 2. 20251124012900_rewrite_user_rls_policies.sql
# 3. 20251124013000_rewrite_organization_rls_policies.sql
# 4. 20251124013100_rewrite_bot_rls_policies.sql
```

### 2. 準備測試用戶

創建至少兩個測試用戶帳號：

- User A: `user-a@example.com`
- User B: `user-b@example.com`

## 測試場景

### 測試 1: User Account RLS - 自己可見自己

**目標**: 驗證用戶可以查看和更新自己的 User account

**步驟**:

1. 以 User A 登入
2. 查詢自己的 User account:
   ```sql
   SELECT * FROM accounts WHERE type = 'User' AND auth_user_id = auth.uid();
   ```
3. 預期結果: 返回 User A 的帳號

**驗證點**:
- ✅ 無無限遞迴錯誤
- ✅ 可以查詢到自己的帳號
- ✅ 無法查詢到其他用戶的帳號

### 測試 2: User Account RLS - 租戶隔離

**目標**: 驗證用戶無法查看其他用戶的 User account

**步驟**:

1. 以 User A 登入
2. 嘗試查詢所有 User accounts:
   ```sql
   SELECT * FROM accounts WHERE type = 'User';
   ```
3. 預期結果: 只返回 User A 自己的帳號

**驗證點**:
- ✅ User A 無法看到 User B 的帳號
- ✅ 租戶隔離正確

### 測試 3: Organization RLS - 創建組織流程

**目標**: 驗證用戶可以創建組織，且無無限遞迴錯誤

**步驟**:

1. 以 User A 登入
2. 創建新組織:
   ```sql
   INSERT INTO accounts (type, name, created_by)
   VALUES ('Organization', 'Test Org', auth.uid())
   RETURNING *;
   ```
3. 查詢剛創建的組織:
   ```sql
   SELECT * FROM accounts 
   WHERE type = 'Organization' 
   AND created_by = auth.uid();
   ```

**驗證點**:
- ✅ 創建成功，無錯誤
- ✅ 無無限遞迴錯誤
- ✅ 可以查詢到剛創建的組織

### 測試 4: Organization RLS - 成員可見性

**目標**: 驗證組織成員可以查看組織

**步驟**:

1. 以 User A 登入，創建組織 Org1
2. 將 User B 加入 Org1 作為成員:
   ```sql
   INSERT INTO organization_members (organization_id, account_id, role)
   VALUES (
     '<Org1 ID>',
     (SELECT id FROM accounts WHERE auth_user_id = '<User B auth_uid>' AND type = 'User'),
     'Member'
   );
   ```
3. 以 User B 登入
4. 查詢組織:
   ```sql
   SELECT * FROM accounts WHERE type = 'Organization';
   ```

**驗證點**:
- ✅ User B 可以查看 Org1
- ✅ User B 無法查看其他組織
- ✅ 無無限遞迴錯誤

### 測試 5: Organization RLS - 更新權限

**目標**: 驗證只有組織擁有者可以更新組織

**步驟**:

1. 以 User A 登入，創建組織 Org1
2. 將 User B 加入 Org1 作為普通成員 (Member)
3. 以 User B 登入
4. 嘗試更新 Org1:
   ```sql
   UPDATE accounts 
   SET name = 'Updated Name'
   WHERE id = '<Org1 ID>';
   ```

**驗證點**:
- ✅ User B (普通成員) 無法更新組織
- ✅ 將 User B 角色改為 Owner 後可以更新

### 測試 6: Bot RLS - 創建和查看

**目標**: 驗證用戶可以創建和查看自己的 Bot

**步驟**:

1. 以 User A 登入
2. 創建新 Bot:
   ```sql
   INSERT INTO accounts (type, name, created_by)
   VALUES ('Bot', 'Test Bot', auth.uid())
   RETURNING *;
   ```
3. 查詢自己創建的 Bot:
   ```sql
   SELECT * FROM accounts 
   WHERE type = 'Bot' 
   AND created_by = auth.uid();
   ```

**驗證點**:
- ✅ 創建成功
- ✅ 可以查詢到自己創建的 Bot
- ✅ 無無限遞迴錯誤

### 測試 7: Bot RLS - 團隊 Bot 可見性

**目標**: 驗證團隊成員可以查看團隊的 Bot

**步驟**:

1. 以 User A 登入，創建 Bot1
2. 創建 Team1，將 Bot1 關聯到 Team1
3. 將 User B 加入 Team1
4. 以 User B 登入
5. 查詢 Bot:
   ```sql
   SELECT * FROM accounts WHERE type = 'Bot';
   ```

**驗證點**:
- ✅ User B 可以查看 Team1 的 Bot1
- ✅ User B 無法查看其他 Bot
- ✅ 無無限遞迴錯誤

### 測試 8: get_user_account_id() 函數

**目標**: 驗證 `get_user_account_id()` 函數正常運作

**步驟**:

1. 以 User A 登入
2. 執行函數:
   ```sql
   SELECT get_user_account_id();
   ```
3. 預期結果: 返回 User A 的 account ID (UUID)

**驗證點**:
- ✅ 函數返回正確的 account ID
- ✅ 對於不同用戶返回不同的 ID
- ✅ 無錯誤

## 效能測試

### 測試 9: 查詢效能

**目標**: 確保 RLS 策略不影響查詢效能

**步驟**:

1. 插入大量測試數據 (1000+ organizations, users, bots)
2. 執行各種查詢並測量時間:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM accounts WHERE type = 'Organization';
   ```

**驗證點**:
- ✅ 查詢時間在可接受範圍內 (<100ms)
- ✅ 使用適當的索引
- ✅ 無全表掃描

## 錯誤場景測試

### 測試 10: 無限遞迴檢測

**目標**: 確保舊的 RLS 策略問題已修復

**步驟**:

1. 嘗試觸發可能導致無限遞迴的操作
2. 創建組織時同時查詢 accounts 表

**驗證點**:
- ✅ 無 "infinite recursion detected in policy" 錯誤
- ✅ 所有操作正常完成

## 自動化測試腳本

可以使用以下 TypeScript 測試腳本：

```typescript
// test/rls-policies.spec.ts
import { createClient } from '@supabase/supabase-js';

describe('RLS Policies', () => {
  let supabaseA, supabaseB;

  beforeAll(async () => {
    // 創建兩個不同用戶的 Supabase 客戶端
    supabaseA = createClient(/* User A credentials */);
    supabaseB = createClient(/* User B credentials */);
  });

  it('should allow user to view own account', async () => {
    const { data, error } = await supabaseA
      .from('accounts')
      .select('*')
      .eq('type', 'User');
    
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
  });

  it('should prevent user from viewing other users accounts', async () => {
    const { data, error } = await supabaseB
      .from('accounts')
      .select('*')
      .eq('type', 'User');
    
    expect(error).toBeNull();
    expect(data).toHaveLength(1); // 只能看到自己
  });

  it('should allow user to create organization', async () => {
    const { data, error } = await supabaseA
      .from('accounts')
      .insert({
        type: 'Organization',
        name: 'Test Org'
      })
      .select();
    
    expect(error).toBeNull();
    expect(data[0].name).toBe('Test Org');
  });

  // 更多測試案例...
});
```

## 檢查清單

完成所有測試後，確認以下項目：

- [ ] User RLS 策略正常運作
- [ ] Organization RLS 策略正常運作
- [ ] Bot RLS 策略正常運作
- [ ] 無無限遞迴錯誤
- [ ] 租戶隔離正確
- [ ] 創建組織流程正常
- [ ] 查詢效能可接受
- [ ] get_user_account_id() 函數正常運作
- [ ] 所有邊界情況處理正確

## 常見問題排查

### Q1: 仍然出現無限遞迴錯誤

**檢查**:
- 確認 `get_user_account_id()` 函數已創建
- 確認函數有 `SET row_security = off`
- 確認所有 RLS 策略已更新

### Q2: 用戶無法查看應該可見的組織

**檢查**:
- 確認 `organization_members` 表有正確的記錄
- 確認 `get_user_account_id()` 返回正確的 account ID
- 檢查 RLS 策略中的 JOIN 條件

### Q3: 查詢效能下降

**檢查**:
- 確認相關欄位有索引 (auth_user_id, type, created_by)
- 使用 EXPLAIN ANALYZE 檢查查詢計劃
- 考慮優化 RLS 策略條件

## 結論

完成所有測試後，RLS 策略應該：

1. ✅ 無無限遞迴錯誤
2. ✅ 正確實現租戶隔離
3. ✅ 允許合法的數據訪問
4. ✅ 拒絕非法的數據訪問
5. ✅ 維持可接受的查詢效能

如有任何問題，請參考 Supabase 文檔或聯繫開發團隊。
