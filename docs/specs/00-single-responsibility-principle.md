# SRP (Single Responsibility Principle) 規範

> **目的**: 本文檔定義單一職責原則（SRP）在 ng-alain-gighub 專案中的應用，以及企業級架構的十大核心原則，確保程式碼可維護性、可測試性和可擴展性。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- 架構師
- AI Agents

## 核心原則

**Component**：只處理 UI → 單一職責

**Service**：只處理邏輯 → 單一職責

**Repository**：只處理 API/資料存取 → 單一職責

**Pipe**：只處理轉換 → 單一職責

**Directive**：只處理 DOM 行為 → 單一職責

**Facade**：只處理狀態與 UI 溝通 → 單一職責

## 企業級 Angular 規範

👉 Component 禁止放業務邏輯

👉 Service 不可同時處理 API + domain logic

👉 Repository 不能做 UI model mapping

👉 Facade 不能做 API mapping 或 UI 轉換

## 企業級架構十大原則

### 1. 封裝與界限（Clear Boundaries / Encapsulation）

必須明確隔離：

- UI
- Domain（商業邏輯）
- Infrastructure（API、持久層）
- State
- Shared（跨 domain 的純工具）

👉 目的是避免跨層依賴、耦合與難以維護。
👉 這是 DDD（企業級架構）最重要的原則之一。

### 2. 可組合性（Composability）

企業級架構要求功能可以自由組合，拆解後仍能運作：

- UI 小組件
- 小的 domain service
- 小的 repo
- 小的 directives
- pure utils
- composable signals

👉 React、Angular Signals、Vue Composition API 都朝這個方向。

### 3. 一致性（Consistency）

一致性是企業級規範最重要的原則之一：

- 一致的程式碼風格
- 一致的 API 格式
- 一致的命名
- 一致的 component 架構
- 一致的 error handling
- 一致的 UX 行為

👉 一致性比「聰明」更重要。

### 4. 明確的依賴方向（Dependency Direction / Stability）

企業級規範要求：

- Domain 不依賴 UI
- Facade 不依賴 repository
- Shared 永不依賴 domain
- Feature 不依賴其他 feature

👉 方向錯誤會把全部 domain 黏在一起，造成「蜘蛛網架構」，會毀掉專案。

### 5. 低耦合、高內聚（Low Coupling & High Cohesion）

- **High Cohesion**：功能相近的邏輯放在一起
- **Low Coupling**：不同領域彼此弱依賴

這是限制草率依賴與避免複雜度失控的核心原則。

### 6. 可測試性（Testability）

企業級要求：

- 小而乾淨的 function
- 低耦合 → 易 mock
- SRP → 易測試
- 分層 → UI 與邏輯可分開測試

👉 架構沒有為「測試」設計，就不是企業級架構。

### 7. 可維護性（Maintainability）

包括：

- 嚴格型別
- 嚴格 lint
- 嚴格架構規範
- 可閱讀的檔案結構
- 避免 fat component / fat service
- 低複雜度的 code

👉 你今天能維護，三年後，你的同事也要能維護。

### 8. 可替換性（Replaceability / Abstraction）

企業級架構要能：

- 替換後端（API）
- 替換 Auth provider（ex: Supabase → Cognito）
- 替換 UI Library
- 替換 domain rule
- 替換 repository

👉 這是為什麼 Angular 20 的 `inject()` + `injectFn` + Repository layer 很重要。

### 9. 漸進式演進（Incremental / Evolvable Architecture）

企業級不允許「一次性重建」。

所以架構必須：

- 可部分重構
- 可逐步遷移
- 可無痛引入新功能
- 可平行存在新舊流程

例如：

- NgModule → Standalone（可分階段）
- RxJS → Signals（可逐步）
- CSR → SSR Hydration（可漸進）

👉 若不能漸進演進，它就不叫企業級架構。

### 10. 單一職責原則（Single Responsibility Principle）

每個模組、類別、函數都應該只有一個改變的理由：

- **Component**：只處理 UI
- **Service**：只處理業務邏輯
- **Repository**：只處理資料存取
- **Facade**：只處理狀態與 UI 溝通

👉 違反 SRP 會導致高耦合、難以測試、難以維護。

- --

**最後更新**：2025-01-20
**維護者**：開發團隊
