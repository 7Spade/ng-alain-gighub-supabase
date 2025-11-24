# 組織上下文切換器修復報告

## 問題描述
用戶登入後，左側邊欄的上下文切換器無法顯示組織列表。

## 根本原因分析

### 問題 1：AccountRepository.findByAuthUserId() 缺少 type 過濾
**症狀**：HTTP 406 錯誤
**原因**：查詢 accounts 表時沒有指定 `type='User'`，導致 RLS 策略無法正確評估
**修復**：`src/app/core/infra/repositories/account/index.ts` 第 77 行

```typescript
// 修復前
findByAuthUserId(authUserId: string): Observable<Account | null> {
  return this.findOne({ authUserId });
}

// 修復後
findByAuthUserId(authUserId: string): Observable<Account | null> {
  return this.findOne({ authUserId, type: AccountType.USER });
}
```

### 問題 2：OrganizationService 讀取錯誤的欄位名稱
**症狀**：`invalid input syntax for type uuid: "undefined"`
**原因**：資料庫返回 `organization_id` (snake_case)，代碼讀取 `organizationId` (camelCase)
**修復**：`src/app/shared/services/account/organization.service.ts` 第 74、92 行

```typescript
// 修復前
const organizationIds = ownerMemberships.map(m => (m as any).organizationId);

// 修復後
const organizationIds = ownerMemberships.map(m => (m as any).organization_id).filter(id => id);
```

### 問題 3：organization_members RLS SELECT 策略循環依賴
**症狀**：無法查詢自己的組織成員關係
**原因**：SELECT 策略只允許 `is_org_member()` 檢查，導致無法發現自己屬於哪些組織
**修復**：遷移 `20251124000011_fix_org_members_select_circular_dependency.sql`

```sql
-- 修復前
USING (public.is_org_member(organization_id))

-- 修復後
USING (
  auth_user_id = auth.uid()  -- 允許查詢自己的成員關係
  OR
  public.is_org_member(organization_id)  -- 或查看已是成員的組織
)
```

### 問題 4：UI 模板結構複雜化
**症狀**：組織列表藏在子菜單中，不直觀
**原因**：使用了多層子菜單結構（個人帳戶 > 組織帳戶 > 團隊帳戶）
**修復**：改為扁平顯示，組織下直接顯示團隊

## 修復文件清單

### 代碼修改
1. `src/app/core/infra/repositories/account/index.ts` - 添加 type 過濾
2. `src/app/shared/services/account/organization.service.ts` - 修正欄位名稱
3. `src/app/layout/basic/widgets/context-switcher.component.ts` - 扁平化 UI

### 資料庫遷移
1. `supabase/migrations/20251124000011_fix_org_members_select_circular_dependency.sql` - 修復 RLS 循環依賴

## 驗證結果

### Supabase API Logs
✅ `GET /rest/v1/accounts?auth_user_id=eq.xxx&type=eq.User` => 200 OK
✅ 創建的組織：7 個
✅ 加入的組織：7 個

### 瀏覽器測試
✅ 左側邊欄上下文切換器正確顯示 7 個組織
✅ 扁平結構，一目了然
✅ 組織下可嵌套顯示團隊（當有團隊時）

## 最終架構

```
切換工作區
├── ac7x@pm.me (個人)
├── 11111 (組織)
├── 6666 (組織)
├── 66665 (組織)
├── 66666 (組織)
├── 456456 (組織)
├── 55555 (組織)
└── 456 (組織)
```

---
**修復日期**：2025-11-24
**測試狀態**：✅ 通過
**遷移狀態**：✅ 已應用

