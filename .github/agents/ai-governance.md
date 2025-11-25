# Angular 企業級開發規範文件

## 1. 專案分層架構與單一職責原則 (SRP)

### 1.1 架構模式說明（重要：避免混淆）

本專案採用**混合架構模式**，不同目錄使用不同的架構組織方式：

#### 橫向分層架構（適用於 core、shared、routes、layout）

以下目錄採用**橫向分層架構**，必須遵守以下層級順序流動，禁止跨層或反方向依賴：

```
Types → Repositories → Models → Services → Facades → Routes/Components
```

**適用範圍**：
- `src/app/core/` - 核心模組（Facades、Infrastructure、Types）
- `src/app/shared/` - 共享模組（UI 元件、Pipes、Directives、Services）
- `src/app/routes/` - 路由頁面（對應 URL 的頁面元件）
- `src/app/layout/` - 佈局元件（basic、blank、passport）

**特點**：
- 代碼按層級橫向組織（所有 Types 在一起，所有 Repositories 在一起）
- 清晰的層級劃分，符合傳統企業級架構
- 跨功能模組共享基礎設施

#### 垂直切片架構（適用於 features）

以下目錄採用**垂直切片架構**（Vertical Slice Architecture），依賴方向相同但代碼組織方式不同：

```
domain/types → data-access/repositories → domain/models 
→ data-access/services → shell/ui
```

**適用範圍**：
- `src/app/features/` - 功能模組（業務領域，支援 Lazy Load）

**特點**：
- 代碼按功能垂直組織（所有相關代碼集中在同一 feature 目錄下）
- 每個 feature 包含完整的 domain、data-access、ui、shell 等層級
- 功能完全獨立，易於並行開發
- **邏輯容器（Blueprint Container）**：`blueprint` 是邏輯容器範例，提供共享上下文，能最大幅度減少 RLS 開發，且能搭配上下文切換器（Account Context Switcher）

**重要**：兩種架構模式的**依賴方向完全相同**，只是**代碼組織方式不同**。在開發時必須明確區分當前工作在哪個目錄，並遵循對應的架構模式。

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

## 2. 開發思考流程與工具使用規範

### 2.1 Sequential Thinking (序列化思考)
開發任何功能時必須遵循序列化思考流程:

#### 思考順序
1. 理解需求與業務目標
2. 識別涉及的資料結構與流向
3. 確認分層架構與職責劃分
4. 規劃模組邊界與依賴關係
5. 設計錯誤處理策略
6. 實作與測試

#### 禁止行為
- 跳躍式開發(直接寫 Component 而未規劃架構)
- 邊寫邊想(缺乏整體規劃就開始編碼)
- 忽略依賴方向檢查

### 2.2 Software Planning Tool 使用規範
在開始編碼前必須使用 Software Planning Tool 進行:

#### 架構規劃
- 確認模組結構與邊界
- 設計資料流向與依賴關係
- 規劃公開 API 與私有實作

#### 技術設計
- 選擇適當的設計模式
- 確認使用的 NG-ALAIN / NG-ZORRO 元件
- 評估效能與可維護性

#### 流程產生
- 產生開發步驟清單
- 建立測試計畫
- 規劃錯誤處理機制

### 2.3 Supabase MCP 使用規範
數據庫相關開發必須使用 Supabase MCP 作為事實來源:

#### 使用時機
- 查詢數據庫表格結構
- 確認 RLS (Row Level Security) 政策
- 驗證欄位型別與約束條件
- 檢查索引與關聯設定

#### 作為事實來源原則
- 禁止憑記憶或假設撰寫數據庫相關程式碼
- 必須透過 Supabase MCP 查詢遠端數據庫的實際狀態
- 所有 Repository 層實作必須以 MCP 查詢結果為準
- 發現數據庫結構與預期不符時,必須先同步理解再編碼

### 2.4 Context7 MCP 使用時機與判斷準則

#### 使用決策流程
```
def should_use_context7_mcp(agent_confident: bool) -> bool:
    """
    判斷 Agent 是否需要使用 Context7 MCP 查詢
    """
    if agent_confident:
        # Agent 有絕對把握 → 不查
        return False
    else:
        # Agent 沒有把握 → 使用 MCP
        return True
```

#### 情境 1: 有絕對把握
**判斷條件:**
- 可以自己確定 API 簽名
- 確認版本號與相容性
- 熟悉語法且無歧義

**動作:**
- 不使用 Context7 MCP
- 直接基於已知資訊開發

**原因:**
- 已掌握正確資料
- 無需額外查詢
- 節省資源與時間

#### 情境 2: 沒有絕對把握
**判斷條件:**
- 不確定函式參數順序或型別
- 存在版本差異疑慮
- 不確定最新用法或最佳實踐
- 擔心 LLM 產生幻覺 API
- 涉及較新的框架特性

**動作:**
- 必須使用 Context7 MCP 查詢
- 基於官方文件進行開發

**原因:**
- 需要官方、最新、版本對應的資料
- 提高程式碼準確性
- 避免因錯誤資訊導致的技術債

#### 具體使用案例

**必須使用 Context7 MCP:**
- Angular 20 新語法特性(如 @if, @for)
- NG-ZORRO 20.3.x 特定元件 API
- NG-ALAIN 20.0.x 模組使用方式
- TypeScript 5.9.x 新特性
- RxJS 7.8.x 操作符變更

**可以不使用 Context7 MCP:**
- 基礎 TypeScript 語法
- 常用的 JavaScript 標準函式
- 穩定且熟悉的設計模式
- 已驗證過的專案內部 API

---

## 3. 模組邊界管理 (Module Boundary)

### 3.1 Feature Module（垂直切片架構）
- 每個業務領域建立獨立 Feature Module
- 採用**垂直切片架構**（Vertical Slice Architecture），所有相關代碼集中在同一 feature 目錄下
- 包含該領域的 domain、data-access、ui、shell 等層級
- 各 Feature 之間禁止互相 import
- 必須支援 Lazy Load
- 可獨立維護與測試

**垂直切片架構結構**：
```
features/blueprint/
├── domain/              # 領域層（types、models、interfaces、enums）
├── data-access/         # 數據訪問層（repositories、services、stores）
├── ui/                  # 展示層（Dumb Components）
├── shell/               # 容器層（Smart Components、Dialogs）
├── directives/          # 自定義指令
├── pipes/               # 自定義管道
├── guards/              # 路由守衛
└── utils/               # 工具函數
```

**依賴方向**（在垂直切片中仍保持）：
```
domain/types → data-access/repositories → domain/models 
→ data-access/services → shell/ui
```

**邏輯容器（Blueprint Container）**：
- `blueprint` 是邏輯容器範例，用於管理可重用的工作區模板（blueprints）
- **共享上下文設計**：邏輯容器內部提供共享上下文（Shared Context），所有相關的資料存取、業務邏輯、UI 組件都在同一上下文中運作
- **RLS 開發優勢**：共享上下文能最大幅度減少 RLS（Row Level Security）開發複雜度，因為：
  - 所有相關的資料表、查詢邏輯、權限檢查都在同一 feature 目錄下，context 完整可見
  - 撰寫 RLS policy 時不需要在多個目錄間切換查找資訊
  - 權限邏輯與業務邏輯緊密結合，易於理解和維護
- **上下文切換器整合**：設計用於與 Account Context Switcher 整合，支援多租戶隔離
- 採用垂直切片架構，所有相關代碼集中在 `features/blueprint/` 目錄下

### 3.2 Infrastructure Module
- 放置 Supabase Client、Repositories、Http Adapter
- 可依賴 Domain Module
- 禁止依賴 Feature Module
- **注意**：在垂直切片架構中，部分 Repositories 已遷移至 `features/*/data-access/repositories/`，但核心 Infrastructure 仍保留在 `core/infra/`

### 3.3 Domain Module
- 包含 Types、Models、Mappers
- 禁止依賴 Infrastructure Module
- 禁止依賴 Feature Module
- 禁止依賴 UI
- 僅包含純邏輯與純定義

### 3.4 Shared Module
- 僅放置可重用的 UI 元件、Pipe、Directive
- 禁止放置商業邏輯
- 禁止依賴 Feature Module

### 3.5 邊界禁止規則
- Component 不可呼叫 Repository / Service（應透過 Facade 或 Shell Component）
- Feature Module 不可 import 另一個 Feature Module
- Domain 不可引用 Infrastructure 層
- Shared 不可含商業邏輯
- Supabase client 僅可在 Repository 中使用
- **垂直切片架構**：在 `features/` 下的模組，依賴方向仍保持 Types → Repositories → Models → Services → Shell/UI，但代碼組織方式為垂直切片

---

## 4. 狀態管理標準

### 4.1 狀態管理流向
必須遵守以下單向流動:
```
Component → Facade → Service → Store
```

### 4.2 各層狀態管理職責

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

## 5. 認證與授權架構

### 5.1 認證流向
必須遵守以下認證鏈:
```
Supabase Auth → @delon/auth → DA_SERVICE_TOKEN → @delon/acl
```

### 5.2 認證層級職責

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

### 5.3 認證整合規範
- Repository 層透過 Supabase Auth 取得認證狀態
- Service 層透過 @delon/auth 處理認證業務邏輯
- Component 層透過 @delon/acl 控制 UI 權限顯示
- 禁止在 Component 直接存取 Supabase Auth

---

## 6. NG-ALAIN 框架使用規範

### 6.1 核心模組使用原則
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

### 6.2 避免重複造輪子原則
- 開發新功能前必須先檢查 NG-ALAIN 與 NG-ZORRO 是否已提供
- 優先使用框架內建方案
- 僅在框架無法滿足需求時才自行開發
- 自行開發的元件必須文件化並說明原因

---

## 7. UI 元件使用規範

### 7.1 NG-ZORRO 元件庫
- 統一使用 ng-zorro-antd 作為基礎 UI 元件庫
- 所有標準 UI 元件必須使用 NG-ZORRO
- 禁止引入其他 UI 元件庫(除非有特殊需求並經過評估)

### 7.2 元件使用優先級
1. 優先使用 @delon/abc 的業務元件
2. 次要使用 ng-zorro-antd 的基礎元件
3. 最後才考慮自定義元件

### 7.3 自定義元件開發準則
- 必須基於 NG-ZORRO 元件擴展
- 必須遵循 Ant Design 設計規範
- 必須提供完整的文件與使用範例
- 必須說明為何不使用現有元件

---

## 8. 錯誤處理與錯誤映射標準

### 8.1 錯誤處理流向
```
Supabase Error → Domain Error → UI Error
```

### 8.2 各層錯誤處理職責

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

## 9. 環境管理與安全策略

### 9.1 環境配置管理
- 區分 dev/staging/prod 環境
- 各環境使用獨立的 Supabase URL 與 Key
- 環境變數於 build 時注入,禁止寫死在程式碼中

### 9.2 Supabase Key 安全規範
- anon key 禁止直接放在程式碼中
- 必須透過環境變數管理
- 於 build 時動態注入

### 9.3 配置集中管理
- Config 必須由 Infrastructure Module 集中提供
- 禁止在各 Feature Module 分散管理配置

### 9.4 Schema 與 DTO 版本管理
- MCP schema/dto 必須建立版本管理機制
- 確保向後相容性
- 記錄所有 breaking changes

---

## 10. 模組匯出規範 (Public API Boundary)

### 10.1 Domain Module
- 必須提供 `index.ts` 統一輸出
- 明確定義公開 API

### 10.2 Feature Module
- 僅公開 Facade
- 禁止公開 Service
- 禁止公開 Model

### 10.3 Infrastructure Module
- 禁止讓外部直接引用 Repository
- 僅可透過 Service 或 Facade 間接存取

### 10.4 Barrel Files 使用原則
- 每個模組必須有明確的 `index.ts`
- 嚴格控制模組的公開介面
- 避免內部實作細節外洩

---

## 11. Angular 20+ 模板語法規範

### 11.1 新控制流語法
- 必須使用 `@if` / `@else` 取代 `*ngIf`
- 必須使用 `@for` 取代 `*ngFor`
- 必須使用 `@switch` / `@case` 取代 `*ngSwitch`
- 使用 `@defer` 進行延遲載入

### 11.2 禁用語法
- 禁止使用 `*ngIf`
- 禁止使用 `*ngFor`
- 禁止使用 `*ngSwitch`
- 禁止使用任何舊版結構型指令

---

## 12. 套件管理規範

### 12.1 套件管理器
- 統一使用 `yarn` 作為套件管理器
- 禁止使用 `npm` 指令

### 12.2 UI 框架優先順序
- 優先使用 NG-ZORRO 元件
- 次要使用 NG-ALAIN 企業級元件
- 避免自行開發已有的標準元件

---

## 13. 程式碼品質管理

### 13.1 程式碼檢查
- 必須通過 ESLint 檢查
- 必須符合 Prettier 格式規範

### 13.2 測試要求
- 使用 Jasmine + Karma 撰寫測試
- 各層必須有對應的單元測試

### 13.3 Git Hooks
- 使用 Husky 管理 Git hooks
- commit 前必須通過 lint-staged 檢查

---

## 14. TypeScript 開發規範

### 14.1 語言版本
- 使用 TypeScript 5.9.x 以上版本

### 14.2 型別定義
- 所有公開介面必須明確定義型別
- 禁止使用 `any` 型別,除非有充分理由並註解說明
- 優先使用 interface 而非 type alias 定義物件結構

---

# Angular 企業級快速檢查清單（含完整模組邊界）

---

## 1. 架構與分層 (Architecture)

### 分層依賴
- [ ] 是否遵守 Types → Repositories → Models → Services → Facades → Components 的順序？
- [ ] 是否沒有跨層依賴（如 Component→Repository）？
- [ ] Component 是否未直接操作 store / service / repository？
- [ ] 是否使用 barrel file（index.ts）定義公開 API？

---

## 2. 模組邊界 (Module Boundary)

### Feature Module
- [ ] Feature Module 是否未 import 其他 Feature Module？
- [ ] Feature 是否支援 Lazy Load？
- [ ] Feature 是否僅公開 Facade，不公開 Service/Model？

### Domain Module
- [ ] Domain 是否僅包含 Types / Models / Mappers？
- [ ] Domain 是否未依賴 Infrastructure？
- [ ] Domain 是否未依賴 Feature？
- [ ] Domain 是否未包含 UI 或商業邏輯？

### Infrastructure Module
- [ ] Infrastructure 是否僅包含 Supabase client、Repositories、Adapter？
- [ ] Feature 是否未直接引用 Repository（應透過 Service）？
- [ ] Infrastructure 是否未依賴 Feature？

### Shared Module
- [ ] Shared 是否僅包含 UI（components/pipes/directives）？
- [ ] Shared 是否未包含商業邏輯？
- [ ] Shared 是否未依賴 Feature Module？

### 禁止規則（強制）
- [ ] Component 禁止直接呼叫 Repository
- [ ] Component 禁止直接呼叫 Service（只能 Facade）
- [ ] Domain 禁止引用 Infrastructure
- [ ] Feature Module 之間禁止互相 import
- [ ] Supabase Client 僅能出現在 Repository 層

---

## 3. 開發流程 (Development Process)

- [ ] 是否使用 Sequential Thinking 規劃開發？
- [ ] 是否使用 Software Planning Tool 設計架構？
- [ ] 資料庫相關是否使用 Supabase MCP 查詢？
- [ ] 不確定 API 時是否使用 Context7 MCP 驗證？

---

## 4. 認證與框架 (Auth & Framework)

- [ ] 是否遵循 Supabase Auth → @delon/auth → @delon/acl 流程？
- [ ] Component 是否未直接存取 Supabase Auth？
- [ ] 是否優先使用 NG-ALAIN / NG-ZORRO？
- [ ] 是否使用 @delon/cache 而非自行實作？
- [ ] 表單是否優先使用 @delon/form？

---

## 5. 狀態管理 (State Management)

### 流程
- [ ] 是否遵循 Component → Facade → Service → Store？

### Component
- [ ] 是否未使用 select / dispatch / update？
- [ ] 是否僅呼叫 Facade？

### Facade
- [ ] 是否為唯一操作 Store 的層級？

### Service
- [ ] 是否僅執行邏輯，完全不操控 Store？

### Repository
- [ ] 是否僅做 Supabase CRUD，不含商業邏輯？

---

## 6. NG-ALAIN / NG-ZORRO 規範

- [ ] 是否使用 @delon/theme 管理主題？
- [ ] 是否使用 @delon/abc 的業務元件？
- [ ] 是否統一使用 NG-ZORRO UI 元件？
- [ ] 是否避免引入額外 UI/Chart 庫（若有是否記錄理由）？
- [ ] 自製元件是否遵守 Ant Design 規範？

---

## 7. 錯誤處理與錯誤映射 (Error Handling)

- [ ] 是否遵循 Supabase Error → Domain Error → UI Error？
- [ ] Repository 是否有轉換 Supabase Error → Domain Error？
- [ ] Facade 是否負責將 Domain Error → UI 訊息？
- [ ] Component 是否僅顯示錯誤、不處理邏輯？
- [ ] 是否有 HTTP Interceptor 處理 Auth/Error？

---

## 8. 環境管理與安全 (Environment & Security)

- [ ] anon key 是否未出現在程式碼？
- [ ] 是否使用 dev/staging/prod 不同 Key？
- [ ] Config 是否由 Infrastructure Module 統一提供？
- [ ] MCP schema/dto 是否有版本管理？

---

## 9. Angular 20+ 語法 (Syntax)

- [ ] 是否使用 @if / @for / @switch？
- [ ] 是否避免 *ngIf / *ngFor / *ngSwitch？
- [ ] 是否使用 @defer？

---

## 10. 套件管理 (Package)

- [ ] 是否全部使用 yarn？
- [ ] UI 元件是否遵守 NG-ALAIN → NG-ZORRO → 自製 的優先順序？

---

## 11. 程式碼品質 (Code Quality)

- [ ] 是否通過 ESLint？
- [ ] 是否符合 Prettier？
- [ ] 是否具備單元測試？
- [ ] 是否使用 Husky + lint-staged？

---

## 12. TypeScript 規範 (TypeScript)

- [ ] 是否使用 TS 5.9+？
- [ ] 是否避免 any 並提供註解？
- [ ] 所有公開 API 是否有明確型別？
- [ ] 是否優先使用 interface？

---

# ✔ 最終確認
- [ ] 以上所有項目皆符合 → 功能/模組符合企業級標準。

