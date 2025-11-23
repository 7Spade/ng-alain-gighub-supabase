# 元件模組視圖（Component Diagram）

## 📑 目錄

- [模組職責詳細說明](#模組職責詳細說明)
  - [認證模組](#認證模組)
  - [藍圖/專案模組](#藍圖專案模組)
  - [任務管理模組](#任務管理模組)
  - [報表管理模組](#報表管理模組)
  - [品質驗收模組](#品質驗收模組)
  - [問題追蹤模組](#問題追蹤模組)
  - [協作通訊模組](#協作通訊模組)
  - [數據分析模組](#數據分析模組)
  - [文件管理模組](#文件管理模組)
  - [服務層](#服務層)
  - [狀態管理層](#狀態管理層)
  - [工具層](#工具層)
- [Angular 架構分層說明](#angular-架構分層說明)
  - [Routes 模組（UI Layer）](#routes-模組ui-layer)
  - [Shared 模組（Shared Layer）](#shared-模組shared-layer)
  - [Core 模組（Core Layer）](#core-模組core-layer)
- [設計模式應用](#設計模式應用)
  - [Repository → Service → Signal Facade](#repository--service--signal-facade)
  - [Workflow Pattern](#workflow-pattern)
  - [Aggregation Refresh Pattern](#aggregation-refresh-pattern)
- [模組職責對照表](#模組職責對照表)
- [資料流指引](#資料流指引)

---


> 📋 **目的**：展示 Angular 前端應用的元件模組架構，包含 core、shared、routes、layout 等模組劃分

**最後更新**：2025-11-16
**維護者**：開發團隊

- --

```mermaid
C4Component
    title 元件模組視圖 - Angular 前端應用架構

    %% 技術棧：Angular 20.3.x + NG-ZORRO 20.3.x + NG-ALAIN 20.1.x
    %% 架構：Git-like 分支模型，51 張資料表（11 個模組）

    Container_Boundary(frontend, "Angular 前端應用") {

        Component(app_layout, "App Layout", "Angular Router", "應用程式外層<br/>- 全局導航<br/>- 用戶狀態<br/>- 主題管理")

        Boundary(auth_module, "🔐 認證模組") {
            Component(auth_service, "Auth Service", "Angular Service", "全局認證狀態<br/>- JWT 管理<br/>- Session 維護")
            Component(login_page, "登入頁面", "Angular Component", "用戶登入介面")
            Component(auth_guard, "路由守衛", "Angular Guard", "權限驗證<br/>- 路由保護<br/>- 角色檢查")
        }

        Boundary(blueprint_module, "🎯 藍圖/專案模組") {
            Component(blueprint_list, "專案列表", "Angular Component", "顯示所有專案")
            Component(blueprint_detail, "專案詳情", "Angular Component", "專案儀表板<br/>- 進度概覽<br/>- 統計圖表")
            Component(blueprint_form, "專案表單", "Angular Component", "建立/編輯專案")
        }

        Boundary(task_module, "📋 任務管理模組") {
            Component(task_board, "任務看板", "Angular Component", "Kanban 看板<br/>- 拖拽排序<br/>- 狀態流轉")
            Component(task_calendar, "任務日曆", "Angular Component", "日曆視圖<br/>- 時程規劃")
            Component(task_detail, "任務詳情", "Modal Component", "任務詳細資訊<br/>- 指派管理<br/>- 附件上傳")
            Component(task_form, "任務表單", "Angular Form", "建立/編輯任務")
        }

        Boundary(report_module, "📊 報表管理模組") {
            Component(daily_report_form, "日報表單", "Angular Component", "提交每日報表<br/>- 照片上傳<br/>- 天氣記錄")
            Component(report_list, "報表列表", "Angular Component", "瀏覽歷史報表")
            Component(photo_gallery, "照片庫", "Angular Component", "施工照片瀏覽<br/>- Lightbox<br/>- EXIF 資訊")
        }

        Boundary(qc_module, "✅ 品質驗收模組") {
            Component(qc_checklist, "驗收清單", "Angular Component", "檢查項目列表<br/>- 動態表單")
            Component(qc_camera, "驗收拍照", "Angular Component", "相機整合<br/>- 照片標註")
            Component(qc_result, "驗收結果", "Modal Component", "驗收報告<br/>- 評分系統")
        }

        Boundary(issue_module, "⚠️ 問題追蹤模組") {
            Component(issue_list, "問題列表", "Angular Component", "問題管理介面<br/>- 篩選排序<br/>- 批次操作")
            Component(issue_detail, "問題詳情", "Angular Component", "問題詳細資訊<br/>- 處理流程<br/>- 討論區")
            Component(issue_form, "問題表單", "Modal Component", "開立/編輯問題")
        }

        Boundary(collaboration_module, "💬 協作通訊模組") {
            Component(comment_thread, "討論串", "Angular Component", "巢狀留言<br/>- @提及<br/>- 即時更新")
            Component(notification_center, "通知中心", "Angular Component", "通知列表<br/>- 已讀管理<br/>- 通知分類")
            Component(todo_widget, "待辦小工具", "Angular Component", "個人待辦清單<br/>- 快速存取")
        }

        Boundary(analytics_module, "📈 數據分析模組") {
            Component(dashboard, "儀表板", "Angular Component", "統計概覽<br/>- KPI 指標")
            Component(charts, "圖表組件", "ngx-charts / ECharts", "視覺化圖表<br/>- 折線圖<br/>- 柱狀圖<br/>- 圓餅圖")
            Component(report_export, "報表匯出", "Utility", "匯出 PDF/Excel")
        }

        Boundary(document_module, "📦 文件管理模組") {
            Component(file_uploader, "檔案上傳器", "Angular Component", "拖拽上傳<br/>- 進度顯示<br/>- 多檔支援")
            Component(file_browser, "檔案瀏覽器", "Angular Component", "檔案列表<br/>- 預覽功能<br/>- 權限控制")
            Component(drawing_viewer, "圖紙檢視", "Angular Component", "CAD 圖檢視<br/>- 縮放標註")
        }

        Boundary(shared_components, "🔧 共用組件層") {
            Component(ui_components, "UI 組件庫", "ng-zorro-antd", "基礎 UI 組件<br/>- Button<br/>- Dialog<br/>- Table<br/>- Form")
            Component(layout_components, "佈局組件", "Angular", "頁面佈局<br/>- Header<br/>- Sidebar<br/>- Footer")
            Component(form_components, "表單組件", "Angular Typed Forms", "表單元件<br/>- 驗證邏輯<br/>- 錯誤處理")
        }

        Boundary(service_layer, "🔌 服務層") {
            Component(supabase_client, "Supabase Client", "TypeScript SDK", "統一資料存取<br/>- CRUD 操作<br/>- RLS 整合")
            Component(realtime_service, "Realtime 服務", "WebSocket", "即時訂閱管理<br/>- 連線池<br/>- 重連機制")
            Component(storage_service, "Storage 服務", "File API", "檔案上傳下載<br/>- 斷點續傳<br/>- 壓縮優化")
            Component(auth_service_impl, "Auth 服務", "Supabase Auth", "認證管理<br/>- Token 刷新<br/>- Session 維護")
        }

        Boundary(state_management, "📊 狀態管理層") {
            Component(global_state, "全局狀態", "Angular Signals", "應用狀態<br/>- 用戶資訊<br/>- 主題設定")
            Component(query_cache, "查詢快取", "Angular Signals + RxJS", "資料快取<br/>- 自動重取<br/>- 樂觀更新")
            Component(form_state, "表單狀態", "Angular Typed Forms", "表單管理<br/>- 驗證規則<br/>- 錯誤處理")
        }

        Boundary(utils_layer, "🛠️ 工具層") {
            Component(api_client, "API Client", "TypeScript", "HTTP 請求封裝<br/>- 攔截器<br/>- 錯誤處理")
            Component(date_utils, "日期工具", "date-fns", "日期處理<br/>- 格式化<br/>- 時區轉換")
            Component(validation, "驗證工具", "Zod", "資料驗證<br/>- Schema 定義<br/>- 類型推導")
            Component(file_utils, "檔案工具", "Utility", "檔案處理<br/>- 壓縮<br/>- 格式轉換")
        }
    }

    Container_Ext(supabase, "Supabase Platform", "Backend Services")

    Rel(app_layout, auth_provider, "使用")
    Rel(auth_guard, auth_service, "驗證")

    Rel(blueprint_list, supabase_client, "查詢專案")
    Rel(task_board, realtime_service, "訂閱更新")
    Rel(daily_report_form, storage_service, "上傳照片")
    Rel(file_uploader, storage_service, "上傳檔案")

    Rel(dashboard, query_cache, "獲取數據")
    Rel(task_form, form_state, "管理表單")

    Rel(supabase_client, supabase, "REST API", "HTTPS")
    Rel(realtime_service, supabase, "WebSocket", "WSS")
    Rel(storage_service, supabase, "Storage API", "HTTPS")
    Rel(auth_service, supabase, "Auth API", "HTTPS")

    Rel(task_board, ui_components, "使用 UI")
    Rel(issue_list, ui_components, "使用 UI")
    Rel(dashboard, charts, "渲染圖表")

    Rel(api_client, validation, "驗證請求")
    Rel(supabase_client, api_client, "使用")
```

## 模組職責詳細說明

### 認證模組
- **Auth Service**: 全局認證狀態管理，使用 Angular Service + Signals
- **登入頁面**: Email/Password, OAuth 社交登入
- **路由守衛**: Angular Guard 驗證用戶權限，保護私有路由

### 藍圖/專案模組
- **專案列表**: 顯示用戶有權限存取的所有專案
- **專案詳情**: 儀表板視圖，包含進度、統計、快速操作
- **專案表單**: 建立與編輯專案資訊

### 任務管理模組
- **任務看板**: Kanban 風格，支援拖拽排序與狀態變更
- **任務日曆**: 日曆視圖，顯示任務時程與排程
- **任務詳情**: Modal 顯示完整資訊，支援快速操作
- **任務表單**: 建立與編輯任務，支援指派與附件

### 報表管理模組
- **日報表單**: 提交每日施工記錄，整合相機與天氣
- **報表列表**: 瀏覽與搜尋歷史報表
- **照片庫**: Lightbox 瀏覽，顯示 EXIF 資訊

### 品質驗收模組
- **驗收清單**: 動態檢查項目，支援評分與備註
- **驗收拍照**: 整合相機，支援照片標註
- **驗收結果**: 顯示驗收報告與評分

### 問題追蹤模組
- **問題列表**: 問題管理介面，支援篩選、排序、批次操作
- **問題詳情**: 完整的問題處理流程與討論區
- **問題表單**: 開立與編輯問題

### 協作通訊模組
- **討論串**: 巢狀留言，支援 @提及與即時更新
- **通知中心**: 統一的通知管理介面
- **待辦小工具**: 個人待辦清單，快速存取

### 數據分析模組
- **儀表板**: 統計概覽與 KPI 指標
- **圖表組件**: 使用 ngx-charts 或 ECharts 渲染各類圖表
- **報表匯出**: 匯出為 PDF 或 Excel

### 文件管理模組
- **檔案上傳器**: 拖拽上傳，顯示進度，支援多檔
- **檔案瀏覽器**: 檔案列表與預覽，權限控制
- **圖紙檢視**: CAD 圖檢視，支援縮放與標註

### 服務層
- **Supabase Client**: 統一的資料存取介面
- **Realtime 服務**: 即時訂閱管理與連線池
- **Storage 服務**: 檔案操作與優化
- **Auth 服務**: 認證與 Token 管理

### 狀態管理層
- **全局狀態**: 使用 Angular Signals 管理應用狀態
- **查詢快取**: Angular Signals + RxJS 管理資料快取與重取
- **表單狀態**: Angular Typed Forms 管理表單與驗證

### 工具層
- **API Client**: 封裝 HTTP 請求與錯誤處理
- **日期工具**: 日期格式化與時區處理
- **驗證工具**: Zod Schema 定義與驗證
- **檔案工具**: 檔案壓縮與格式轉換

## Angular 架構分層說明

### Routes 模組（UI Layer）
- **位置**：`src/app/routes/`
- **職責**：Standalone 頁面、表單、互動
- **設計原則**：
  - 使用 Standalone Components
  - `imports: [SHARED_IMPORTS]`
  - `ChangeDetectionStrategy.OnPush`
  - 禁止直接呼叫 Supabase / Infrastructure
  - 透過 Facade/Service 取得資料

### Shared 模組（Shared Layer）
- **位置**：`src/app/shared/`
- **職責**：可重用 Component、Model、Pipe、Util
- **設計原則**：
  - 跨頁可重用的元件與服務
  - 禁止依賴 routes
  - 禁止放置業務邏輯
  - 更新後同步檢查 `SHARED_IMPORTS`

### Core 模組（Core Layer）
- **位置**：`src/app/core/`
- **職責**：Domain Service、Repository、計算與視角服務
- **設計原則**：
  - Service 以 `@Injectable({ providedIn: 'root' })` 建立
  - 分層：domain / repository / computation / view
  - Repository 封裝 Supabase，負責 snake_case ↔ camelCase 映射
  - Service 寫業務規則，呼叫 Workflow Pattern
  - Signal Facade 暴露 `ReadonlySignal`，使用 `signal`/`computed`/`effect`

## 設計模式應用

### Repository → Service → Signal Facade
```text
```

### Workflow Pattern
- 所有任務／活動動作送至 `BlueprintActivityService`
- 寫入 `activity_logs` 並觸發通知
- 使用 `ErrorStateService` 記錄失敗與重試

### Aggregation Refresh Pattern
- Task / Document / Quality Service 完成 mutate → 呼叫 `BlueprintAggregationRefreshService.emit()`
- Blueprint Facade 於建構時 `listen()`，接收事件後自動 `load()`
- UI 維持 `signal` 或 `computed`，禁止手動 `detectChanges`

## 模組職責對照表

| 模組 | 職責 | 禁止事項 |
|------|------|----------|
| **Routes** | Standalone 頁面、表單、互動 | 直接呼叫 Supabase / Infrastructure |
| **Shared** | 可重用 Component、Model、Pipe、Util | 依賴 routes、放置業務邏輯 |
| **Core** | Domain Service、Repository、計算與視角服務 | 混入 UI 元件、跳過 Repository 直連 DB |
| **Infrastructure** | Supabase 客戶端封裝、資料存取 | 被 routes 直接引入

## 資料流指引

User Action → Component (Routes) → Facade/Service (Shared/Core) → Repository → SupabaseService → Supabase
```text
```
- Component 透過 facade 取得 `ReadonlySignal`
- Service 驗證規則、記錄活動、呼叫 Repository
- Repository 使用 MCP 工具執行 SQL／RPC，返回 Domain Model
