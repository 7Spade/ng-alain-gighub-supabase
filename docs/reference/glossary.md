# 詞彙表

## 📑 目錄

- [📋 目錄](#-目錄)
- [專案術語](#專案術語)
  - [核心概念](#核心概念)
  - [資料模型](#資料模型)
- [技術縮寫](#技術縮寫)
  - [前端技術](#前端技術)
  - [後端技術](#後端技術)
  - [開發工具](#開發工具)
  - [效能相關](#效能相關)
- [技術名詞對照](#技術名詞對照)
  - [資料庫相關](#資料庫相關)
  - [前端相關](#前端相關)
  - [狀態管理](#狀態管理)
  - [API 相關](#api-相關)
- [業務術語](#業務術語)
  - [工程管理](#工程管理)
  - [任務狀態](#任務狀態)
  - [優先級](#優先級)
  - [專案狀態](#專案狀態)
- [命名規範](#命名規範)
  - [資料庫命名](#資料庫命名)
  - [TypeScript 命名](#typescript-命名)
  - [檔案命名](#檔案命名)
- [相關文檔](#相關文檔)
- [🎯 Git-like 分支模型術語](#-git-like-分支模型術語)

---


> 📋 **目的**：定義專案專用術語、縮寫和技術名詞，確保團隊成員理解一致

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [專案術語](#專案術語)
- [技術縮寫](#技術縮寫)
- [技術名詞對照](#技術名詞對照)
- [業務術語](#業務術語)

- --

## 專案術語

### 核心概念

| 術語 | 英文 | 說明 |
|------|------|------|
| **藍圖** | Blueprint | 專案/工程專案，包含任務、文件、成員等。採用 Git-like 分支模型 |
| **主分支** | Main Branch | 藍圖主分支（`blueprints` 表），由擁有者組織全權控制任務結構 |
| **組織分支** | Organization Branch | 協作組織的 Fork 分支（`blueprint_branches` 表），只能填寫承攬欄位 |
| **Pull Request (PR)** | Pull Request | 協作組織提交執行數據的請求（`pull_requests` 表），擁有者審核後合併 |
| **承攬欄位** | Contractor Fields | 只有承攬商可以填寫的執行數據欄位（`tasks.contractor_fields`） |
| **任務** | Task | 工程任務，包含多個維度（Identity, Time, Location, Resource 等）。支援無限層級嵌套 |
| **暫存區** | Staging Area | 任務提交後的 48 小時緩衝區（`task_staging` 表），可撤回修正 |
| **每日報表** | Daily Report | 施工日誌（`daily_reports` 表），記錄每日工作內容、進度、天氣等，自動同步到主分支 |
| **品質驗收** | Quality Check | 品質檢查記錄（`quality_checks` 表），包含檢查項目、評分、照片等 |
| **驗收** | Inspection | 最終驗收記錄（`inspections` 表），明確責任切割點 |
| **問題** | Issue | 問題追蹤（`issues` 表），記錄問題狀態、優先級、負責人等。所有分支問題即時同步至主分支 |
| **帳戶** | Account | 統一身份抽象（`accounts` 表），可以是 User、Bot 或 Organization |
| **組織** | Organization | 組織單位（存儲在 `accounts` 表中，`type = 'Organization'`） |
| **團隊** | Team | 組織下的團隊（`teams` 表），可包含多個成員 |
| **待辦中心** | Personal Todos | 個人待辦事項聚合（`personal_todos` 表），包含五種狀態分類 |

### 資料模型

| 術語 | 英文 | 說明 |
|------|------|------|
| **實體** | Entity | 資料庫中的表或 TypeScript 中的介面 |
| **模型** | Model | TypeScript 介面定義，對應資料庫表結構 |
| **Repository** | Repository | 資料存取層，封裝資料庫操作 |
| **Service** | Service | 業務邏輯層，處理業務規則 |
| **Facade** | Facade | 狀態管理層，管理組件狀態 |

- --

## 技術縮寫

### 前端技術

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **Angular** | - | Google 開發的前端框架 |
| **TS** | TypeScript | JavaScript 的超集，提供類型系統 |
| **RxJS** | Reactive Extensions for JavaScript | 響應式程式設計庫 |
| **Signal** | - | Angular 20 的響應式狀態管理 |
| **DI** | Dependency Injection | 依賴注入 |
| **CD** | Change Detection | 變更檢測 |
| **OnPush** | - | 變更檢測策略，僅在輸入變更時檢測 |

### 後端技術

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **RLS** | Row Level Security | 資料列層級安全，PostgreSQL 的安全機制 |
| **JWT** | JSON Web Token | 用於認證的 Token 格式 |
| **REST** | Representational State Transfer | RESTful API 架構風格 |
| **PostgREST** | - | 自動生成 REST API 的工具 |
| **SQL** | Structured Query Language | 結構化查詢語言 |
| **UUID** | Universally Unique Identifier | 通用唯一識別碼 |

### 開發工具

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **CLI** | Command Line Interface | 命令列介面 |
| **API** | Application Programming Interface | 應用程式介面 |
| **SDK** | Software Development Kit | 軟體開發工具包 |
| **IDE** | Integrated Development Environment | 整合開發環境 |
| **E2E** | End-to-End | 端對端測試 |
| **CI/CD** | Continuous Integration/Continuous Deployment | 持續整合/持續部署 |

### 效能相關

| 縮寫 | 全名 | 說明 |
|------|------|------|
| **LCP** | Largest Contentful Paint | 最大內容繪製，Core Web Vitals 指標 |
| **FID** | First Input Delay | 首次輸入延遲，Core Web Vitals 指標 |
| **INP** | Interaction to Next Paint | 互動到下次繪製，Core Web Vitals 指標 |
| **CLS** | Cumulative Layout Shift | 累積版面配置位移，Core Web Vitals 指標 |
| **TTI** | Time to Interactive | 可互動時間 |
| **FCP** | First Contentful Paint | 首次內容繪製 |

- --

## 技術名詞對照

### 資料庫相關

| 中文 | 英文 | 說明 |
|------|------|------|
| **資料表** | Table | 資料庫中的表 |
| **欄位** | Column/Field | 表中的欄位 |
| **主鍵** | Primary Key (PK) | 唯一識別記錄的欄位 |
| **外鍵** | Foreign Key (FK) | 關聯到其他表的欄位 |
| **索引** | Index | 加速查詢的資料結構 |
| **遷移** | Migration | 資料庫結構變更腳本 |
| **種子資料** | Seed Data | 初始資料 |

### 前端相關

| 中文 | 英文 | 說明 |
|------|------|------|
| **組件** | Component | Angular 組件 |
| **服務** | Service | Angular 服務 |
| **路由** | Route | 路由定義 |
| **守衛** | Guard | 路由守衛 |
| **攔截器** | Interceptor | HTTP 攔截器 |
| **管道** | Pipe | 資料轉換管道 |
| **指令** | Directive | 結構指令或屬性指令 |
| **模組** | Module | Angular 模組（已棄用，改用 Standalone） |
| **獨立組件** | Standalone Component | 不依賴 NgModule 的組件 |

### 狀態管理

| 中文 | 英文 | 說明 |
|------|------|------|
| **狀態** | State | 應用程式狀態 |
| **Signal** | Signal | Angular 20 的響應式狀態 |
| **Computed** | Computed Signal | 計算衍生狀態 |
| **Effect** | Effect | 副作用處理 |
| **Facade** | Facade | 狀態管理外觀模式 |

### API 相關

| 中文 | 英文 | 說明 |
|------|------|------|
| **端點** | Endpoint | API 端點 |
| **請求** | Request | HTTP 請求 |
| **回應** | Response | HTTP 回應 |
| **認證** | Authentication | 身份驗證 |
| **授權** | Authorization | 權限授權 |
| **分頁** | Pagination | 分頁查詢 |
| **排序** | Sorting | 排序查詢 |
| **篩選** | Filtering | 篩選查詢 |

- --

## 業務術語

### 工程管理

| 術語 | 英文 | 說明 |
|------|------|------|
| **專案經理** | Project Manager | 專案負責人 |
| **工地主任** | Site Supervisor | 現場管理人員 |
| **品管人員** | Quality Controller | 品質檢查人員 |
| **施工人員** | Worker | 執行施工的人員 |
| **觀察者** | Viewer | 僅有查看權限的人員 |

### 任務狀態

根據 `docs/30-0-完整SQL表結構定義.md` 和 `docs/43-狀態枚舉值定義.md`：

| 狀態 | 英文 | 說明 |
|------|------|------|
| **待處理** | Pending | 任務已建立但未開始 |
| **已指派** | Assigned | 任務已指派給負責人 |
| **進行中** | In Progress | 任務正在執行 |
| **暫存中** | Staging | 任務已提交，進入 48 小時暫存區（可撤回） |
| **品管中** | In QA | 任務進入品質檢查流程 |
| **驗收中** | In Inspection | 任務進入驗收流程 |
| **已完成** | Completed | 任務已完成 |
| **已取消** | Cancelled | 任務已取消 |

### 優先級

| 優先級 | 英文 | 說明 |
|--------|------|------|
| **低** | Low | 低優先級 |
| **中** | Medium | 中等優先級 |
| **高** | High | 高優先級 |
| **緊急** | Urgent | 緊急優先級 |

### 專案狀態

根據 `docs/30-0-完整SQL表結構定義.md`：

| 狀態 | 英文 | 說明 |
|------|------|------|
| **規劃中** | Planning | 專案規劃階段 |
| **進行中** | Active | 專案進行中 |
| **暫停** | On Hold | 專案暫停（注意：使用 `on_hold` 而非 `paused`） |
| **已完成** | Completed | 專案已完成 |
| **已歸檔** | Archived | 專案已歸檔 |

- --

## 命名規範

### 資料庫命名

| 類型 | 規範 | 範例 |
|------|------|------|
| **表名** | snake_case，複數 | `blueprints`, `task_assignments` |
| **欄位名** | snake_case | `user_id`, `created_at` |
| **主鍵** | `id` | `id` |
| **外鍵** | `{table}_id` | `blueprint_id`, `account_id` |
| **時間戳記** | `created_at`, `updated_at` | `created_at`, `updated_at` |

### TypeScript 命名

| 類型 | 規範 | 範例 |
|------|------|------|
| **介面** | PascalCase，單數 | `Blueprint`, `TaskAssignment` |
| **類別** | PascalCase | `BlueprintService`, `TaskRepository` |
| **變數/函數** | camelCase | `blueprintId`, `getBlueprints()` |
| **常數** | UPPER_SNAKE_CASE | `MAX_ITEMS`, `API_BASE_URL` |
| **類型別名** | PascalCase | `BlueprintStatus`, `TaskPriority` |

### 檔案命名

| 類型 | 規範 | 範例 |
|------|------|------|
| **組件** | kebab-case.component.ts | `blueprint-list.component.ts` |
| **服務** | kebab-case.service.ts | `blueprint.service.ts` |
| **模型** | kebab-case.model.ts | `blueprint.model.ts` |
| **路由** | kebab-case.routes.ts | `blueprint.routes.ts` |

- --

## 相關文檔

- [文檔索引](./README.md) - 文檔導航
- [開發作業指引](./specs/00-development-guidelines.md)
- [資料模型對照表](./34-資料模型對照表.md)
- [狀態枚舉值定義](./43-狀態枚舉值定義.md) - 狀態定義單一真實來源
- [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md)

- --

- --

## 🎯 Git-like 分支模型術語

根據 `27-完整架構流程圖.mermaid.md` 和 `28-架構審查報告.md`：

| 術語 | 英文 | 說明 |
|------|------|------|
| **Fork** | Fork | 將任務 Fork 給協作組織，建立組織分支 |
| **分支權限** | Branch Permission | 分支層級的權限控制（`branch_permissions` 表） |
| **擁有者** | Owner | 藍圖擁有者，全權控制任務結構 |
| **協作組織** | Collaborator | 協作組織，只能填寫承攬欄位，不能修改任務結構 |
| **查看者** | Viewer | 唯讀權限，無法修改任何內容 |
| **問題同步** | Issue Sync | 所有分支問題即時同步至主分支（`issue_sync_logs` 表） |
| **活動記錄** | Activity Log | 所有操作統一記錄至主分支（`activity_logs` 表） |

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**對齊版本**：30-0-完整SQL表結構定義.md v2.0（51 張資料表）


