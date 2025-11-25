# Workspace Switcher 現代化修復計劃

## 📋 目錄

- [問題分析](#問題分析)
- [解決方案](#解決方案)
- [實施步驟](#實施步驟)
- [技術決策](#技術決策)
- [驗證標準](#驗證標準)

---

## 問題分析

### 發現的錯誤

#### 1. Facade 名稱不一致 🔴

**問題**：
- 實際類名：`WorkspaceFacade`（在 `workspace-context.facade.ts` 中）
- 所有使用的地方期望：`WorkspaceContextFacade`
- 導致編譯錯誤：`'"@core"' 沒有任何名稱為 'WorkspaceContextFacade' 的已匯出成員`

**影響範圍**：
- `base-context-aware.component.ts`
- `context-switcher.component.ts`
- `basic.component.ts`
- 其他使用 WorkspaceContextFacade 的組件

#### 2. ContextType 導入路徑錯誤 🔴

**問題**：
- `workspace-context.facade.ts` 使用 `@core/enums`（不存在）
- 應該使用 `@core`（ContextType 在 `core/infra/types/account` 中）

**正確路徑**：
```typescript
// ❌ 錯誤
import { ContextType } from '@core/enums';

// ✅ 正確
import { ContextType } from '@core';
```

#### 3. Service API 不匹配 🔴

**問題**：
- Facade 期望的 API：
  - `currentUser`
  - `organizations`
  - `teams`
  - `loading`

- 實際 WorkspaceDataService 提供的 API：
  - `currentUserAccount`
  - `createdOrganizations`
  - `joinedOrganizations`
  - `userTeams`
  - `loadingOrganizations`
  - `loadingTeams`

**影響**：Facade 無法正確代理 Service 的狀態

#### 4. 方法可見性問題 🔴

**問題**：
- `WorkspaceContextService.restoreContext()` 是 private
- `WorkspaceContextService.switchContext()` 是 private
- 但 Facade 需要調用這些方法

#### 5. 類型錯誤 🟡

**問題**：
- `base-context-aware.component.ts` 中 `ContextConfigMap` 的類型索引問題
- `context-switcher.component.ts` 中多處 `unknown` 類型錯誤

---

## 解決方案

### 方案 1：統一 Facade 命名

**決策**：將 `WorkspaceFacade` 重命名為 `WorkspaceContextFacade`

**理由**：
- 符合現有代碼的使用習慣
- 更描述性的名稱
- 與其他 Facade 命名一致（如 `UserFacade`, `OrganizationFacade`）

### 方案 2：修復導入路徑

**決策**：統一使用 `@core` 導入 ContextType

**理由**：
- ContextType 已在 `core/infra/types/account` 中定義
- 通過 `core/infra/index.ts` 和 `core/index.ts` 統一導出
- 符合架構規範（Core 層的類型定義）

### 方案 3：統一 Service API

**選項 A**：調整 WorkspaceDataService 提供統一的 API（推薦）

**優點**：
- Facade 可以簡單代理
- API 更清晰
- 符合 Facade 模式的設計

**選項 B**：調整 Facade 適配現有 API

**缺點**：
- Facade 需要做數據轉換
- 增加複雜度

**決策**：採用選項 A，在 WorkspaceDataService 中添加 computed signals 提供統一 API

### 方案 4：調整方法可見性

**決策**：將 `restoreContext()` 和 `switchContext()` 改為 public

**理由**：
- Facade 需要調用這些方法
- 這些方法屬於 Service 的公共 API

### 方案 5：修復類型錯誤

**決策**：
1. 修復 `ContextConfigMap` 類型定義（使用 Partial 或類型守衛）
2. 修復 `context-switcher.component.ts` 的類型斷言

---

## 實施步驟

### 步驟 1：修復 Facade 命名和導入（P0）

1. **重命名類**：
   ```typescript
   // workspace-context.facade.ts
   export class WorkspaceContextFacade { // 從 WorkspaceFacade 改為 WorkspaceContextFacade
   ```

2. **修復導入**：
   ```typescript
   // workspace-context.facade.ts
   import { ContextType } from '@core'; // 從 @core/enums 改為 @core
   ```

### 步驟 2：統一 Service API（P0）

1. **在 WorkspaceDataService 中添加 computed signals**：
   ```typescript
   // 統一 API
   readonly currentUser = this.currentUserAccount;
   readonly organizations = computed(() => [
     ...this.createdOrganizations(),
     ...this.joinedOrganizations()
   ]);
   readonly teams = this.userTeams;
   readonly loading = computed(() => 
     this.loadingOrganizations() || this.loadingTeams()
   );
   ```

2. **更新 Facade 使用統一 API**

### 步驟 3：調整方法可見性（P0）

1. **修改 WorkspaceContextService**：
   ```typescript
   // 從 private 改為 public
   public restoreContext(): void { ... }
   public switchContext(type: ContextType, id: string | null): void { ... }
   ```

### 步驟 4：修復類型錯誤（P1）

1. **修復 base-context-aware.component.ts**：
   ```typescript
   // 使用 Partial 或類型守衛
   type ContextConfigMap = Partial<{
     [K in ContextType]: ContextConfig;
   }>;
   ```

2. **修復 context-switcher.component.ts**：
   - 添加類型斷言
   - 使用類型守衛

### 步驟 5：確認子組件結構（P1）

1. **檢查是否需要保持子組件分離**
2. **如果需要，修復導入問題**

### 步驟 6：驗證和文檔（P2）

1. **運行 lint 檢查**
2. **運行類型檢查**
3. **更新相關文檔**

---

## 技術決策

### ContextType 位置決策

**問題**：是否需要在 `src/app/shared/enums` 建立 ContextType？

**決策**：❌ **不需要**

**理由**：
1. **架構規範**：
   - ContextType 屬於 Core 層的基礎設施類型
   - 不應該放在 Shared 層

2. **當前結構**：
   - ContextType 已在 `core/infra/types/account/index.ts` 中定義
   - 通過 `core/infra/index.ts` → `core/index.ts` 統一導出
   - 使用 `@core` 即可導入

3. **依賴方向**：
   - Shared 層可以依賴 Core 層
   - 但 Core 層不應該依賴 Shared 層
   - 如果放在 Shared，會違反依賴方向

**結論**：
- ✅ ContextType 保持在 `core/infra/types/account`
- ✅ 通過 `@core` 統一導入
- ❌ 不需要 `shared/enums`

---

## 驗證標準

### 編譯驗證

- [ ] 所有 TypeScript 類型錯誤已修復
- [ ] 所有導入路徑正確
- [ ] 所有方法可見性正確

### Lint 驗證

- [ ] ESLint 檢查通過
- [ ] 無類型錯誤
- [ ] 無未使用的導入

### 功能驗證

- [ ] Facade 可以正確注入
- [ ] Service API 正常工作
- [ ] 組件可以正確使用 Facade

### 架構驗證

- [ ] 符合依賴方向（Types → Services → Facades → Components）
- [ ] 符合命名規範
- [ ] 符合可見性規範

---

## 相關文檔

- [Workspace Switcher 重構報告](./workspace-switcher-refactoring-report.md)
- [Workspace Switcher 企業標準規劃](./workspace-switcher-enterprise-standards-plan.md)
- [Workspace Switcher 問題分析](./workspace-switcher-issues-analysis.md)

---

**創建日期**：2025-01-20  
**狀態**：待實施

