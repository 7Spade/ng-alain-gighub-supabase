# 19-元件模組視圖（補充）— 元件清單與落地說明

目的
- 補齊 docs/19 的缺口，使其能直接支援開發與測試的交付。
- 提供「可追蹤的元件 -> 檔案 -> service -> API」映射，確保前後端整合與測試的可執行性。

使用說明
- 每完成一個元件的實作，請依 COMPONENT-DOC-TEMPLATE 填寫對應節點。
- 專案管理者或模組負責人應每日或每次 PR 都更新本清單狀態（狀態欄位：設計/待實作/實作中/完成/測試中/已驗收）。

一、目前已列入檢查但需補齊細節的元件（示例）
- App Layout
  - 建議補充：檔案路徑、CSS 主題 token、HeaderUserMenu selector、全局事件（themeChange、logout）
- Auth Module
  - login-page: selector、form fields、validation schema（Zod）
  - auth_guard: 所依賴的 TokenService 行為、RLS claim 檢查點
- Blueprint / Project
  - blueprint_list, blueprint_detail, blueprint_form：補入 blueprintFacade 主要 API（loadList、create、update、fork、createBranch）
- Task Module
  - 任務看板：task_board -> 需列出 drag/drop 的事件（onDrop, onMove）、所用的 TaskFacade 方法
  - task_detail: 上傳附件的 storage_service 調用點、task repository 方法簽名
- QC Module
  - qc_camera: 裁切/標註元件使用的 file_utils、photo metadata 流程
- Issue Module
  - issue_list, issue_detail, issue_form：指定 issueRepository 主要方法（openIssue、assign、close、addComment）
- Shared Components（需完整列出）
  - Button, ConfirmModal, TableWrapper, PaginatedTable, FilterPanel, AvatarWithMenu, TagPill, LoadingSkeleton
- Facades / Logic components（非常重要）
  - BlueprintFacade, TaskFacade, AccountFacade, AuthFacade, RealtimeFacade, StorageFacade（列方法與事件）
- Infra / Repositories
  - SupabaseClient wrapper、Query helpers、RPC/Edge Function 呼叫入口

二、優先補齊項目（請逐項完成）
1. Component Inventory（路徑 + selector + brief responsibilities）
2. Component Documentation（用 template 填寫）
3. API ↔ Repository ↔ Facade 映射
4. Signals / State 流程圖（主要頁面：主儀表板、任務看板、任務詳情、報表、文件上傳）
5. 測試與 Storybook 範例（每頁面或複雜元件至少 1 個 story & 1 組 unit test）

三、元件缺失範例清單（建議立刻在 repo 中建立 issue/任務）
- Atomic UI: ConfirmModal, IconButton, TableWrapper, EmptyState
- Task: TaskCard、TaskTreeView、AssigneeSelector、AttachmentList
- Blueprint: BranchSelector、PullRequestPanel、ForkDialog
- QC: PhotoAnnotator、CameraCaptureService
- Collaboration: MentionAutocomplete、CommentEditor、RealtimeSubscriptionManager
- Services: BlueprintAggregationRefreshService、ErrorStateService、ActivityLoggerService

（後續請依 COMPONENT-DOC-TEMPLATE 逐件填入，便於 triage 與分工)
