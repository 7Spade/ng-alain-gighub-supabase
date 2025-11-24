# Angular 企業級開發規範文件

## 1. 專案分層架構與單一職責原則 (SRP)

### 1.1 分層順序
所有功能必須依照以下層級順序流動,禁止跨層或反方向依賴:
```
Types → Repositories → Models → Services → Facades → Routes/Components
```

### 1.2 各層職責定義

#### Types 層
- 僅定義資料結構 (Domain Types / DTO Types)
- 禁止包含任何邏輯

#### Repositories 層
- 純後端存取操作 (Supabase CRUD)
- 處理 RLS 驗證錯誤
- 禁止包含業務邏輯

#### Models 層
- 負責資料轉換 (DTO → Domain Model → View Model)
- 純資料映射職責

#### Services 層
- 實作業務邏輯與流程控制 (use cases)
- 禁止接觸 UI 層

#### Facades 層
- 提供 UI 專用的統一 API
- 封裝 service/store
- 禁止包含商業邏輯

#### Routes/Components 層
- 僅負責 UI 呈現與事件觸發
- 禁止直接操作 store、service、repository

---

## 2. 模組邊界管理 (Module Boundary)

### 2.1 Feature Module
- 每個業務領域建立獨立 Feature Module
- 包含該領域的 Facade、Service、UI
- 各 Feature 之間禁止互相 import
- 必須支援 Lazy Load
- 可獨立維護與測試

### 2.2 Infrastructure Module
- 放置 Supabase Client、Repositories、Http Adapter
- 可依賴 Domain Module
- 禁止依賴 Feature Module

### 2.3 Domain Module
- 包含 Types、Models、Mappers
- 禁止依賴 Infrastructure Module
- 禁止依賴 Feature Module
- 禁止依賴 UI
- 僅包含純邏輯與純定義

### 2.4 Shared Module
- 僅放置可重用的 UI 元件、Pipe、Directive
- 禁止放置商業邏輯
- 禁止依賴 Feature Module

### 2.5 邊界禁止規則
- Component 不可呼叫 Repository / Service
- Feature Module 不可 import 另一個 Feature Module
- Domain 不可引用 Infrastructure 層
- Shared 不可含商業邏輯
- Supabase client 僅可在 Repository 中使用

---

## 3. 狀態管理標準

### 3.1 狀態管理流向
必須遵守以下單向流動:
```
Component → Facade → Service → Store
```

### 3.2 各層狀態管理職責

#### Component 層
- 禁止直接操作 store
- 禁止使用 `.select()`
- 禁止使用 `.dispatch()`
- 禁止使用 `.update()`
- 僅可綁定 UI 與呼叫 facade 方法

#### Facade 層
- 唯一可操作 Store 的層級
- 暴露 Observable / Signal 給 Component
- 提供事件方法供 Component 呼叫
- 統一管理 Store 的讀寫

#### Service 層
- 僅執行業務邏輯
- 禁止直接控制 Store
- 可呼叫 Repository 取得資料後回傳給 Facade

#### Repository 層
- 純資料來源存取
- 不涉及狀態管理

---

## 4. 認證與授權架構

### 4.1 認證流向
必須遵守以下認證鏈:
```
Supabase Auth → @delon/auth → DA_SERVICE_TOKEN → @delon/acl
```

### 4.2 認證層級職責

#### Supabase Auth
- 作為底層認證提供者
- 處理使用者登入/登出/註冊
- 管理 Session 與 Token

#### @delon/auth
- 封裝 Supabase Auth 的認證邏輯
- 統一認證介面
- 管理認證狀態

#### DA_SERVICE_TOKEN
- 提供認證服務的注入 Token
- 確保認證服務的單一實例

#### @delon/acl
- 處理權限控制邏輯
- 管理使用者角色與權限
- 提供路由守衛與元件級權限控制

### 4.3 認證整合規範
- Repository 層透過 Supabase Auth 取得認證狀態
- Service 層透過 @delon/auth 處理認證業務邏輯
- Component 層透過 @delon/acl 控制 UI 權限顯示
- 禁止在 Component 直接存取 Supabase Auth

---

## 5. NG-ALAIN 框架使用規範

### 5.1 核心模組使用原則
本專案基於 NG-ALAIN 企業級框架,必須優先使用以下模組以減少重複開發:

#### @delon/theme
- 統一使用此模組管理主題配置
- 包含佈局、樣式、主題切換
- 禁止自行實作主題系統

#### @delon/abc
- 優先使用內建的業務元件
- 包含常用的企業級 UI 模式
- 減少自定義元件開發

#### @delon/cache
- 統一使用此模組處理快取邏輯
- 支援記憶體快取與持久化快取
- 禁止自行實作快取機制

#### @delon/form
- 優先使用動態表單方案
- 透過 JSON Schema 定義表單
- 減少重複的表單程式碼

#### @delon/util
- 使用內建的工具函數
- 包含常用的輔助方法
- 避免重複實作工具函數

#### @delon/chart
- 統一使用此模組處理圖表需求
- 支援多種圖表類型
- 禁止引入其他圖表庫(除非有特殊需求)

### 5.2 避免重複造輪子原則
- 開發新功能前必須先檢查 NG-ALAIN 與 NG-ZORRO 是否已提供
- 優先使用框架內建方案
- 僅在框架無法滿足需求時才自行開發
- 自行開發的元件必須文件化並說明原因

---

## 6. UI 元件使用規範

### 6.1 NG-ZORRO 元件庫
- 統一使用 ng-zorro-antd 作為基礎 UI 元件庫
- 所有標準 UI 元件必須使用 NG-ZORRO
- 禁止引入其他 UI 元件庫(除非有特殊需求並經過評估)

### 6.2 元件使用優先級
1. 優先使用 @delon/abc 的業務元件
2. 次要使用 ng-zorro-antd 的基礎元件
3. 最後才考慮自定義元件

### 6.3 自定義元件開發準則
- 必須基於 NG-ZORRO 元件擴展
- 必須遵循 Ant Design 設計規範
- 必須提供完整的文件與使用範例
- 必須說明為何不使用現有元件

---

## 7. 錯誤處理與錯誤映射標準

### 7.1 錯誤處理流向
```
Supabase Error → Domain Error → UI Error
```

### 7.2 各層錯誤處理職責

#### Global ErrorHandler
- 處理不可預期的全域錯誤
- 提供統一的錯誤攔截機制

#### HTTP Interceptor
- 攔截並標準化 HTTP 錯誤
- 統一處理認證與授權錯誤

#### Repository 層
- 將 Supabase Error 轉換為 Domain Error
- 處理 RLS 錯誤並分類

#### Facade 層
- 決定 UI 呈現方式
- 將 Domain Error 轉換為使用者友善訊息

#### Component 層
- 僅負責顯示錯誤訊息
- 禁止處理邏輯錯誤

---

## 8. 環境管理與安全策略

### 8.1 環境配置管理
- 區分 dev/staging/prod 環境
- 各環境使用獨立的 Supabase URL 與 Key
- 環境變數於 build 時注入,禁止寫死在程式碼中

### 8.2 Supabase Key 安全規範
- anon key 禁止直接放在程式碼中
- 必須透過環境變數管理
- 於 build 時動態注入

### 8.3 配置集中管理
- Config 必須由 Infrastructure Module 集中提供
- 禁止在各 Feature Module 分散管理配置

### 8.4 Schema 與 DTO 版本管理
- MCP schema/dto 必須建立版本管理機制
- 確保向後相容性
- 記錄所有 breaking changes

---

## 9. 模組匯出規範 (Public API Boundary)

### 9.1 Domain Module
- 必須提供 `index.ts` 統一輸出
- 明確定義公開 API

### 9.2 Feature Module
- 僅公開 Facade
- 禁止公開 Service
- 禁止公開 Model

### 9.3 Infrastructure Module
- 禁止讓外部直接引用 Repository
- 僅可透過 Service 或 Facade 間接存取

### 9.4 Barrel Files 使用原則
- 每個模組必須有明確的 `index.ts`
- 嚴格控制模組的公開介面
- 避免內部實作細節外洩

---

## 10. Angular 20+ 模板語法規範

### 10.1 新控制流語法
- 必須使用 `@if` / `@else` 取代 `*ngIf`
- 必須使用 `@for` 取代 `*ngFor`
- 必須使用 `@switch` / `@case` 取代 `*ngSwitch`
- 使用 `@defer` 進行延遲載入

### 10.2 禁用語法
- 禁止使用 `*ngIf`
- 禁止使用 `*ngFor`
- 禁止使用 `*ngSwitch`
- 禁止使用任何舊版結構型指令

---

## 11. 套件管理規範

### 11.1 套件管理器
- 統一使用 `yarn` 作為套件管理器
- 禁止使用 `npm` 指令

### 11.2 UI 框架優先順序
- 優先使用 NG-ZORRO 元件
- 次要使用 NG-ALAIN 企業級元件
- 避免自行開發已有的標準元件

---

## 12. 程式碼品質管理

### 12.1 程式碼檢查
- 必須通過 ESLint 檢查
- 必須符合 Prettier 格式規範

### 12.2 測試要求
- 使用 Jasmine + Karma 撰寫測試
- 各層必須有對應的單元測試

### 12.3 Git Hooks
- 使用 Husky 管理 Git hooks
- commit 前必須通過 lint-staged 檢查

---

## 13. TypeScript 開發規範

### 13.1 語言版本
- 使用 TypeScript 5.9.x 以上版本

### 13.2 型別定義
- 所有公開介面必須明確定義型別
- 禁止使用 `any` 型別,除非有充分理由並註解說明
- 優先使用 interface 而非 type alias 定義物件結構

---

## 附錄: 快速檢查清單

- [ ] 是否遵守分層順序且無跨層依賴?
- [ ] Component 是否未直接操作 store/service/repository?
- [ ] Feature Module 之間是否無互相 import?
- [ ] 是否所有錯誤都經過適當的層級轉換?
- [ ] 環境變數是否正確管理且未寫死在程式碼中?
- [ ] 模組是否有明確的 public API (index.ts)?
- [ ] 是否使用 Angular 20+ 新控制流語法?
- [ ] 是否使用 yarn 進行套件管理?
- [ ] 程式碼是否通過 ESLint 與 Prettier 檢查?
- [ ] 是否有適當的單元測試覆蓋率?
- [ ] 認證流程是否遵循 Supabase Auth → @delon/auth → @delon/acl?
- [ ] 是否優先使用 NG-ALAIN 與 NG-ZORRO 現有元件?
- [ ] 新開發的元件是否確認無法使用現有方案?
- [ ] 是否使用 @delon/cache 處理快取而非自行實作?
- [ ] 表單是否優先考慮使用 @delon/form 動態表單?