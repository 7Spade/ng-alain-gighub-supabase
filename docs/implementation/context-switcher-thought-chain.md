# 上下文切換器現代化 - 思考鏈任務文件

## Context Switcher Modernization - Thought Chain Task Document

**版本**: 1.0  
**日期**: 2025-11-26  
**目的**: 提供逐步執行的思考鏈，確保每個步驟都有明確的推理過程

---

## 思考鏈概述 (Thought Chain Overview)

```
問題定義 → 現狀分析 → 方案探索 → 決策推理 → 步驟分解 → 執行驗證
```

---

## Step 1: 問題定義 (Problem Definition)

### 🤔 思考過程

1. **觀察到的現象**：
   - 登入後「新增藍圖」按鈕不顯示
   - Console 有認證成功日誌，但 UI 不更新

2. **問題陳述**：
   ```
   為什麼在認證成功後，依賴 hasValidContext() 的 UI 元素不顯示？
   ```

3. **假設列表**：
   - H1: `hasValidContext()` 返回 false
   - H2: Signal 更新未觸發 UI 重新渲染
   - H3: 初始化時序問題導致狀態不一致

### ✅ 驗證點
- [ ] 確認 `hasValidContext()` 的返回值
- [ ] 確認 `contextId()` 是否有有效值
- [ ] 確認 `ready` 狀態是否為 true

---

## Step 2: 現狀分析 (Current State Analysis)

### 🤔 思考過程

1. **追蹤 hasValidContext 依賴鏈**：
   ```typescript
   hasValidContext = computed(() => {
     const state = this._contextState();
     return !!state.id && state.ready;
   });
   ```
   - 依賴：`_contextState.id` 和 `_contextState.ready`

2. **追蹤狀態設置流程**：
   ```
   onAuthStateChange → initializeWorkspace → loadWorkspaceData → restoreContext → setDefaultContext
   ```

3. **發現問題點**：
   - `setDefaultContext()` 使用 `currentUser?.['id']`
   - 如果 Account 表查詢失敗，`currentUser` 為 null
   - 導致 `id` 無法設置，`hasValidContext()` 返回 false

### ✅ 驗證點
- [x] 確認 Account 表查詢可能返回 null ✅
- [x] 確認無備用方案處理此情況 ✅

---

## Step 3: 方案探索 (Solution Exploration)

### 🤔 思考過程

1. **方案 A：修復 Account 查詢**
   - 優點：根本解決問題
   - 缺點：需要資料庫變更
   - 風險：高

2. **方案 B：新增備用方案**
   - 優點：快速修復，不需資料庫變更
   - 缺點：可能產生不一致的 ID
   - 風險：低

3. **方案 C：統一認證架構**
   - 優點：長期解決方案
   - 缺點：工作量大
   - 風險：中

### ✅ 決策
選擇 **方案 B + C**：
- 立即實施方案 B 作為快速修復
- 逐步實施方案 C 作為長期解決方案

---

## Step 4: 決策推理 (Decision Reasoning)

### 🤔 思考過程

1. **為什麼選擇 Auth User ID 作為備用？**
   - Supabase Auth User ID 是唯一且穩定的
   - 與 Account 表的 `auth_user_id` 關聯
   - 即使 Account 記錄不存在，仍可作為有效上下文

2. **為什麼移除 ContextType.APP？**
   - APP 上下文從未被正確使用
   - 增加了不必要的判斷邏輯
   - 移除可簡化代碼

3. **為什麼使用 onAuthStateChange 而非 effect()？**
   - Angular effect() 不適合 async 操作
   - onAuthStateChange 是 Supabase 推薦的方式
   - 提供更精確的事件控制

### ✅ 驗證點
- [x] Auth User ID 可作為有效的上下文 ID ✅
- [x] 移除 APP 不影響現有功能 ✅
- [x] onAuthStateChange 可正確觸發初始化 ✅

---

## Step 5: 步驟分解 (Step Decomposition)

### Phase 1: AuthContextService 核心 ✅

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 1.1 | 建立 AuthContextService 檔案 | 檔案存在 | ✅ |
| 1.2 | 定義私有 signals | TypeScript 編譯通過 | ✅ |
| 1.3 | 定義 computed signals | 無 lint 錯誤 | ✅ |
| 1.4 | 實作 onAuthStateChange 監聽 | 日誌輸出正確 | ✅ |
| 1.5 | 更新 BlueprintListComponent | Build 通過 | ✅ |

### Phase 2: 移除 ContextType.APP ✅

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 2.1 | 從 enum 移除 APP | 無編譯錯誤 | ✅ |
| 2.2 | 移除 switchToApp() | 無引用錯誤 | ✅ |
| 2.3 | 移除 isAppContext() | 無引用錯誤 | ✅ |
| 2.4 | 更新 switch 分支 | Build 通過 | ✅ |
| 2.5 | 更新 UI 元件 | Lint 通過 | ✅ |

### Phase 3: 修復初始化問題 ✅

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 3.1 | 移除 async effect() | 無 effect() 使用 async | ✅ |
| 3.2 | 新增 INITIAL_SESSION 處理 | 日誌顯示事件 | ✅ |
| 3.3 | 新增 checkCurrentSession() | 頁面刷新正常 | ✅ |
| 3.4 | 新增 Auth User ID 備用 | 無 Account 時仍可運作 | ✅ |

### Phase 4: 遷移元件 ✅

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 4.1 | 遷移 LayoutBasicComponent | 無編譯錯誤 | ✅ |
| 4.2 | 遷移 HeaderContextSwitcherComponent | 無編譯錯誤 | ✅ |
| 4.3 | 遷移 HeaderUserComponent | 無編譯錯誤 | ✅ |
| 4.4 | 遷移 Blueprint 相關元件 | Build 通過 | ✅ |
| 4.5 | 遷移 Dashboard 元件 | Build 通過 | ✅ |
| 4.6 | 遷移 Settings 元件 | Build 通過 | ✅ |
| 4.7 | 遷移 BaseContextAwareComponent | Build 通過 | ✅ |

### Phase 5: 清理舊服務 🔄

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 5.1 | 確認無引用 WorkspaceContextService | 搜索無結果 | ⏳ |
| 5.2 | 移除 WorkspaceContextService | Build 通過 | ⏳ |
| 5.3 | 確認無引用 WorkspaceContextFacade | 搜索無結果 | ⏳ |
| 5.4 | 移除 WorkspaceContextFacade | Build 通過 | ⏳ |
| 5.5 | 更新 barrel exports | Lint 通過 | ⏳ |

### Phase 6: 脫離 DA_SERVICE_TOKEN ⏳

| 步驟 | 任務 | 驗證 | 狀態 |
|------|------|------|------|
| 6.1 | 列出所有 DA_SERVICE_TOKEN 使用點 | 清單完整 | ⏳ |
| 6.2 | 建立獨立 TokenStorageService | 無編譯錯誤 | ⏳ |
| 6.3 | 逐一替換 tokenService.get() | Build 通過 | ⏳ |
| 6.4 | 移除 @delon/auth 依賴 | package.json 更新 | ⏳ |
| 6.5 | 驗證所有功能正常 | E2E 測試通過 | ⏳ |

---

## Step 6: 執行驗證 (Execution Verification)

### 每個步驟的驗證清單

#### 驗證 1: 編譯檢查
```bash
yarn build
# 預期：無錯誤
```

#### 驗證 2: Lint 檢查
```bash
yarn lint
# 預期：無新增錯誤（可接受既有警告）
```

#### 驗證 3: 功能測試
```bash
# 手動測試步驟
1. 清除 localStorage
2. 開啟瀏覽器 DevTools Console
3. 登入帳戶 ac7x@pm.me
4. 前往藍圖頁面
5. 確認「新增藍圖」按鈕顯示
```

#### 驗證 4: 日誌檢查
```
預期日誌：
[AuthContextService] 🔄 Auth event: INITIAL_SESSION
[AuthContextService] 🚀 Initializing workspace for: xxx
[AuthContextService] 📊 Loading workspace data for: xxx
[AuthContextService] ✅ Workspace data loaded
[AuthContextService] 👤 Setting default context: { accountId, authUserId, finalUserId }
[BlueprintList] 📍 Context changed: { contextType, contextId, isReady: true }
[BlueprintList] ✅ Valid context detected, loading blueprints...
```

---

## 問題排查指南 (Troubleshooting Guide)

### 問題 1: 按鈕仍不顯示

**檢查步驟**：
1. Console 是否有錯誤？
2. `hasValidContext()` 返回什麼？
3. `contextId()` 是否有值？
4. `isReady()` 是否為 true？

**可能原因**：
- Account 和 Auth User 都無法取得 ID
- `ready` 狀態未正確設置

### 問題 2: 上下文切換後菜單不更新

**檢查步驟**：
1. `switchContext()` 是否被調用？
2. `contextType()` 是否正確更新？
3. MenuService 是否接收到更新？

### 問題 3: 頁面刷新後上下文丟失

**檢查步驟**：
1. localStorage 中是否有 `auth_context_state`？
2. `restoreContext()` 是否被調用？
3. 保存的上下文格式是否正確？

---

## 思考鏈總結 (Thought Chain Summary)

```
┌─────────────────────────────────────────────────────────────────┐
│                        思考鏈流程圖                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. 問題定義                                                     │
│     │                                                           │
│     ▼                                                           │
│  2. 現狀分析 ──────► 發現：Account 查詢可能返回 null             │
│     │                                                           │
│     ▼                                                           │
│  3. 方案探索 ──────► 選擇：Auth User ID 備用 + 統一架構          │
│     │                                                           │
│     ▼                                                           │
│  4. 決策推理 ──────► 確認：方案可行且風險可控                    │
│     │                                                           │
│     ▼                                                           │
│  5. 步驟分解 ──────► 6 個 Phase，每個有具體任務                  │
│     │                                                           │
│     ▼                                                           │
│  6. 執行驗證 ──────► 每步驟都有明確的驗證標準                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 附錄：代碼參考 (Code Reference)

### setDefaultContext 修復

```typescript
/**
 * 設定預設上下文（用戶上下文）
 */
private setDefaultContext(): void {
  // 優先使用 Account 表的 ID
  const accountId = this._workspaceData().currentUser?.['id'];
  // 備用：使用 Auth 用戶的 ID
  const authUserId = this._authState().user?.id;
  
  const userId = accountId || authUserId;
  console.log('[AuthContextService] 👤 Setting default context:', { 
    accountId, 
    authUserId, 
    finalUserId: userId 
  });

  if (userId) {
    this.switchToUser(userId as string);
  } else {
    // 標記為準備就緒，即使沒有用戶（未登入情況）
    this._contextState.update(state => ({
      ...state,
      ready: true
    }));
  }
}
```

### hasValidContext 定義

```typescript
/**
 * 是否有有效的工作區上下文
 * 核心檢查：有有效 ID 且系統準備就緒
 */
readonly hasValidContext = computed(() => {
  const state = this._contextState();
  return !!state.id && state.ready;
});
```

---

## 相關文件

- [實施文件](./context-switcher-modernization.md)
- [AuthContextService 源碼](/src/app/core/services/auth-context.service.ts)
- [BlueprintListComponent 源碼](/src/app/features/blueprint/ui/blueprint-list/blueprint-list.component.ts)
