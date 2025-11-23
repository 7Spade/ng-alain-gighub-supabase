# 04-業務流程圖

## 📑 目錄

- [認證架構說明](#認證架構說明)
  - [認證流程](#認證流程)
- [業務流程圖](#業務流程圖)
- [流程說明](#流程說明)
  - [1. 身份認證層](#1-身份認證層)
  - [2. 專案藍圖層](#2-專案藍圖層)
  - [3. 任務執行流程](#3-任務執行流程)
  - [4. 品質驗收流程](#4-品質驗收流程)
  - [5. 異常處理流程](#5-異常處理流程)
  - [6. 協作溝通](#6-協作溝通)
  - [7. 數據分析](#7-數據分析)
  - [8. 文件管理](#8-文件管理)
- [相關文件](#相關文件)

---


> **目的**:展示系統核心業務流程,包含身份認證、專案管理、任務執行、品質驗收、異常處理等完整流程

**最後更新**:2025-01-15
**版本**:v3.0(基於 Git-like 分支模型)
**狀態**:✅ 與系統架構思維導圖完全對齊
**狀態圖對齊**:✅ 與 14-狀態圖.mermaid.md v2.0 完全對齊

- --

## 認證架構說明

本系統採用 **Supabase Auth** 作為底層認證服務,並透過 **SupabaseSessionAdapter** 將 Session 同步至 **@delon/auth** 的 TokenService,實現兩個認證系統的無縫整合。

### 認證流程
1. 用戶透過 Supabase Auth 進行登入/註冊
2. SupabaseSessionAdapter 將 Supabase Session 轉換為 @delon/auth Token 格式
3. 同步至 TokenService,供 @delon 系統使用(路由守衛、HTTP 攔截器等)
4. 從 accounts 表載入用戶完整資料(Account 模型)
5. 透過 RLS 策略驗證權限

- --

## 業務流程圖

```mermaid
flowchart TD
    %% ==================== 身份認證層 ====================
    Start([👤 用戶訪問系統]) --> AuthCheck{Supabase Auth<br/>身份驗證}

    AuthCheck -->|未登入| LoginPage[🔐 登入頁面]
    LoginPage --> LoginMethod{選擇登入方式}
    LoginMethod -->|Email/Password| EmailLogin[Email 登入]
    LoginMethod -->|OAuth| OAuthLogin[OAuth 登入<br/>Google/GitHub]
    LoginMethod -->|Magic Link| MagicLink[Magic Link]

    EmailLogin --> SessionSync
    OAuthLogin --> SessionSync
    MagicLink --> SessionSync

    AuthCheck -->|已登入| SessionSync[Session 同步<br/>Supabase → @delon/auth<br/>SupabaseSessionAdapter]

    SessionSync --> LoadAccount[載入帳戶資料<br/>DB: accounts<br/>JWT Claims]
    LoadAccount --> CheckAccountType{帳戶類型?}

    CheckAccountType -->|User| UserDashboard[👤 個人儀表板]
    CheckAccountType -->|Bot| BotDashboard[🤖 機器人控制台]
    CheckAccountType -->|Organization| OrgDashboard[🏢 組織儀表板]

    UserDashboard --> SelectBlueprint
    BotDashboard --> BotTasks[執行自動化任務]
    OrgDashboard --> OrgManagement[組織管理]

    OrgManagement --> TeamManagement[👥 團隊管理<br/>DB: teams]
    OrgManagement --> OrgSchedule[📅 組織排班<br/>DB: organization_schedules]
    OrgManagement --> SelectBlueprint

    %% ==================== 專案藍圖層 ====================
    SelectBlueprint{選擇/建立專案藍圖}
    SelectBlueprint -->|建立新藍圖| CreateBlueprint[➕ 建立藍圖<br/>DB: blueprints<br/>owner: Organization/User]
    SelectBlueprint -->|選擇現有藍圖| ExistingBlueprint[📋 現有藍圖列表]

    CreateBlueprint --> BlueprintConfig[⚙️ 藍圖設定<br/>工作日曆<br/>通知規則<br/>自訂欄位]
    BlueprintConfig --> MainBranch[🌿 主分支 Main Branch<br/>完全控制權]

    ExistingBlueprint --> CheckBranchRole{檢查分支角色<br/>DB: branch_permissions}
    CheckBranchRole -->|擁有者| MainBranch
    CheckBranchRole -->|協作組織| CollabBranch[🌿 協作分支<br/>僅操作承攬欄位]
    CheckBranchRole -->|查看者| ViewOnlyBranch[👁️ 唯讀模式]

    MainBranch --> SelectAction{選擇操作}
    CollabBranch --> SelectAction
    ViewOnlyBranch --> ViewData[查看數據]

    %% ==================== Fork 與協作流程 ====================
    SelectAction -->|Fork 任務| ForkFlow[🔀 建立 Fork<br/>DB: branch_forks<br/>1:1 承攬關係]
    ForkFlow --> CreateOrgBranch[🌿 建立組織分支<br/>DB: blueprint_branches]
    CreateOrgBranch --> InviteCollab[🤝 協作邀請<br/>DB: organization_collaborations]
    InviteCollab --> CollabAccept{協作組織接受?}
    CollabAccept -->|是| BranchActive([✅ 分支啟用])
    CollabAccept -->|否| InviteExpire([⏱️ 邀請過期])

    %% ==================== Pull Request 流程 ====================
    SelectAction -->|提交 PR| PRSubmit[📮 建立 Pull Request<br/>DB: pull_requests<br/>提交執行數據]
    PRSubmit --> PRReview[🔎 審查變更<br/>DB: pull_request_reviews<br/>擁有者審核]
    PRReview --> PRDecision{審查結果?}
    PRDecision -->|通過| PRMerge[✅ 合併主分支<br/>Edge Function: branch-merge<br/>更新承攬欄位]
    PRDecision -->|拒絕| PRReject[❌ 拒絕 PR<br/>附加審查意見]
    PRDecision -->|需修改| PRRevise[🔄 請求修改]

    PRMerge --> SyncMain[同步至主分支<br/>Realtime 更新]
    PRReject --> CollabBranch
    PRRevise --> CollabBranch

    %% ==================== 任務管理流程 ====================
    SelectAction -->|建立任務| CreateTask[📋 建立任務<br/>DB: tasks<br/>僅藍圖擁有者]
    CreateTask --> TaskStructure[🌳 任務樹狀結構<br/>無層級限制<br/>父子關係]
    TaskStructure --> AssignTask[📌 指派任務]

    AssignTask --> AssignType{指派類型?}
    AssignType -->|個人| AssignUser[指派給用戶]
    AssignType -->|團隊| AssignTeam[指派給團隊]
    AssignType -->|組織| AssignOrg[指派給組織]
    AssignType -->|承攬| AssignSubcontract[指派給協作組織<br/>承攬模式]

    AssignUser --> NotifyAssigned
    AssignTeam --> NotifyAssigned
    AssignOrg --> NotifyAssigned
    AssignSubcontract --> NotifyAssigned

    NotifyAssigned[⚡ Realtime 通知<br/>DB: notifications] --> TodoCenter[📌 待辦中心<br/>DB: personal_todos<br/>狀態:🟦 待執行]

    %% ==================== 任務執行流程 ====================
    TodoCenter --> StartWork{開始執行?}
    StartWork -->|是| WorkInProgress[👷 執行中<br/>狀態更新]
    StartWork -->|否| TodoCenter

    WorkInProgress --> SubmitComplete[✅ 提交完成]
    SubmitComplete --> StagingArea[📦 暫存區<br/>DB: task_staging<br/>狀態:🟨 暫存中<br/>48小時可撤回]

    StagingArea --> RecallDecision{48h 內撤回?}
    RecallDecision -->|是| TodoCenter
    RecallDecision -->|否| ConfirmSubmit[確認提交]

    %% ==================== 每日報表流程 ====================
    ConfirmSubmit --> DailyReport[📝 每日報表<br/>DB: daily_reports]
    DailyReport --> ReportContent[工作摘要<br/>工作時數<br/>工人數量]
    ReportContent --> UploadPhoto[📷 上傳施工照片<br/>Storage: images/<br/>EXIF 資料]
    UploadPhoto --> RecordWeather[☁️ 記錄天氣<br/>Edge Function: 天氣API<br/>DB: weather_cache]
    RecordWeather --> SaveDailyReport[💾 儲存日報<br/>Trigger: activity_logs]

    SaveDailyReport --> QualityCheck[🔍 品質驗收<br/>DB: quality_checks<br/>狀態:🟧 品管中]

    %% ==================== 品質驗收流程 ====================
    QualityCheck --> QCInspector[👷 驗收人員檢查]
    QCInspector --> QCChecklist[✅ 檢查項目 Checklist<br/>評分標準]
    QCChecklist --> QCPhoto[📷 拍攝驗收照片<br/>Storage: images/<br/>前中後對比]
    QCPhoto --> QCResult{驗收結果?}

    QCResult -->|不合格| AutoIssue[⚠️ 自動開立問題<br/>DB: issues<br/>狀態:⚠️ 問題追蹤]
    QCResult -->|合格| UpdateProgress[✅ 更新進度<br/>DB: progress_tracking<br/>Edge Function: 計算進度]

    UpdateProgress --> FinalInspection{需最終驗收?}
    FinalInspection -->|是| Inspection[✔️ 最終驗收<br/>DB: inspections<br/>狀態:🟥 驗收中<br/>責任切割]
    FinalInspection -->|否| TaskComplete

    Inspection --> InspectionType[驗收類型:<br/>初步驗收<br/>最終驗收<br/>保固驗收<br/>移交驗收]
    InspectionType --> InspectionResult{驗收通過?}
    InspectionResult -->|是| ResponsibilityTransfer[📝 責任轉移記錄]
    InspectionResult -->|否| AutoIssue

    ResponsibilityTransfer --> TaskComplete[✅ 任務完成<br/>⚡ Realtime 通知]
    TaskComplete --> UpdateDashboard[📊 更新儀表板<br/>完成率統計<br/>Materialized Views]

    %% ==================== 問題處理流程 ====================
    SelectAction -->|回報問題| ManualIssue[⚠️ 手動回報問題]
    ManualIssue --> AutoIssue

    AutoIssue --> IssueSeverity[設定嚴重程度:<br/>低/中/高/緊急]
    IssueSeverity --> IssueAssign[📌 指派處理人員<br/>DB: issue_assignments<br/>Edge Function: 通知]
    IssueAssign --> IssueNotify[⚡ Realtime 推送<br/>通知處理人員]

    IssueNotify --> IssueHandle[👷 處理問題]
    IssueHandle --> IssuePhoto[📷 上傳處理照片<br/>Storage: images/]
    IssuePhoto --> IssueDiscuss[💬 問題討論<br/>DB: comments<br/>Realtime 訂閱]
    IssueDiscuss --> IssueStatus[狀態流轉:<br/>新建→指派→處理中<br/>→已解決→已關閉]

    IssueStatus --> IssueResolve{問題解決?}
    IssueResolve -->|否| IssueHandle
    IssueResolve -->|是| CloseIssue[✅ 關閉問題<br/>Edge Function: 結案通知]

    CloseIssue --> IssueSyncMain[🔄 同步至主分支<br/>DB: issue_sync_logs<br/>Realtime 更新<br/>所有分支可見]
    IssueSyncMain --> IssueComplete([問題結案])

    %% ==================== 討論協作流程 ====================
    SelectAction -->|討論協作| OpenDiscussion[💬 開啟討論區<br/>DB: comments]
    OpenDiscussion --> DiscussType{討論類型?}
    DiscussType -->|任務討論| TaskDiscuss[任務相關討論]
    DiscussType -->|問題討論| IssueDiscussThread[問題相關討論]
    DiscussType -->|PR 討論| PRDiscuss[PR 審查討論]
    DiscussType -->|驗收討論| InspectionDiscuss[驗收相關討論]
    DiscussType -->|一般討論| GeneralDiscuss[一般討論]

    TaskDiscuss --> PostComment
    IssueDiscussThread --> PostComment
    PRDiscuss --> PostComment
    InspectionDiscuss --> PostComment
    GeneralDiscuss --> PostComment

    PostComment[📝 發布留言<br/>巢狀回覆<br/>@提及功能] --> RealtimeBroadcast[⚡ Realtime 廣播<br/>已讀狀態]
    RealtimeBroadcast --> NotifyMentioned[🔔 通知被提及者]

    %% ==================== 通知中心流程 ====================
    NotifyMentioned --> NotificationCenter[🔔 通知中心<br/>DB: notifications]
    NotificationCenter --> NotifyRules[📋 通知規則<br/>DB: notification_rules<br/>站內/Email/推播]
    NotifyRules --> NotifyPush[推送機制:<br/>Realtime 推送<br/>Email(Edge Function)<br/>瀏覽器推播]
    NotifyPush --> ReadStatus[已讀管理]

    %% ==================== 數據分析流程 ====================
    SelectAction -->|查看報表| AnalyzeData[📊 數據分析<br/>Edge Function: 統計計算]
    AnalyzeData --> QueryScope{分析範圍?}
    QueryScope -->|主分支| MainBranchAnalytics[主分支報表<br/>DB: Materialized Views]
    QueryScope -->|單一分支| BranchAnalytics[分支報表]
    QueryScope -->|跨分支總覽| CrossBranchAnalytics[跨分支總覽<br/>聚合分析]

    MainBranchAnalytics --> GenerateChart
    BranchAnalytics --> GenerateChart
    CrossBranchAnalytics --> GenerateChart

    GenerateChart[📈 生成圖表<br/>前端渲染<br/>互動式圖表] --> AnalyticsCache[快取報表<br/>DB: analytics_cache<br/>預計算結果]
    AnalyticsCache --> ExportReport[📄 匯出報表]

    %% ==================== 文件管理流程 ====================
    SelectAction -->|上傳文件| UploadDoc[📦 上傳文件]
    UploadDoc --> DocType{文件類型?}
    DocType -->|圖片| UploadImage[Storage: images/]
    DocType -->|文件| UploadDocument[Storage: documents/]
    DocType -->|圖檔| UploadDrawing[Storage: drawings/]

    UploadImage --> SaveDocMeta
    UploadDocument --> SaveDocMeta
    UploadDrawing --> SaveDocMeta

    SaveDocMeta[💾 儲存文件元資料<br/>DB: documents] --> DocVersion[📜 版本控制<br/>DB: document_versions]
    DocVersion --> Thumbnail{需要縮圖?}
    Thumbnail -->|是| GenThumbnail[生成縮圖<br/>DB: document_thumbnails<br/>多尺寸快取]
    Thumbnail -->|否| DocPermission
    GenThumbnail --> DocPermission

    DocPermission[🔒 權限控制<br/>RLS Policy] --> DocComplete([文件上傳完成])

    %% ==================== 活動記錄 ====================
    TaskComplete -.DB Trigger.-> ActivityLog
    IssueComplete -.DB Trigger.-> ActivityLog
    SaveDailyReport -.DB Trigger.-> ActivityLog
    QCResult -.DB Trigger.-> ActivityLog
    PRMerge -.DB Trigger.-> ActivityLog

    ActivityLog[📋 活動記錄<br/>DB: activity_logs<br/>集中記錄至主分支<br/>擁有者全局掌控]

    %% 樣式定義
    classDef startEnd fill:#4CAF50,stroke:#2E7D32,color:#fff,stroke-width:3px
    classDef auth fill:#3F51B5,stroke:#1A237E,color:#fff,stroke-width:2px
    classDef account fill:#E91E63,stroke:#880E4F,color:#fff,stroke-width:2px
    classDef blueprint fill:#F44336,stroke:#C62828,color:#fff,stroke-width:2px
    classDef branch fill:#FF7043,stroke:#D84315,color:#fff,stroke-width:2px
    classDef task fill:#66BB6A,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef staging fill:#AED581,stroke:#689F38,color:#000,stroke-width:2px
    classDef quality fill:#FFA726,stroke:#EF6C00,color:#fff,stroke-width:2px
    classDef issue fill:#FF5722,stroke:#BF360C,color:#fff,stroke-width:2px
    classDef discuss fill:#2196F3,stroke:#1565C0,color:#fff,stroke-width:2px
    classDef notify fill:#42A5F5,stroke:#1976D2,color:#fff,stroke-width:2px
    classDef analytics fill:#9C27B0,stroke:#6A1B9A,color:#fff,stroke-width:2px
    classDef storage fill:#78909C,stroke:#455A64,color:#fff,stroke-width:2px
    classDef decision fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:2px

    class Start,BranchActive,InviteExpire,IssueComplete,DocComplete,TaskComplete startEnd
    class AuthCheck,LoginPage,LoginMethod,EmailLogin,OAuthLogin,MagicLink,SessionSync,LoadAccount auth
    class CheckAccountType,UserDashboard,BotDashboard,OrgDashboard,TeamManagement,OrgSchedule account
    class SelectBlueprint,CreateBlueprint,BlueprintConfig,MainBranch,CheckBranchRole,ViewOnlyBranch blueprint
    class ForkFlow,CreateOrgBranch,InviteCollab,CollabBranch,PRSubmit,PRReview,PRMerge,PRReject,PRRevise,SyncMain branch
    class CreateTask,TaskStructure,AssignTask,AssignType,AssignUser,AssignTeam,AssignOrg,AssignSubcontract,NotifyAssigned,TodoCenter,StartWork,WorkInProgress,SubmitComplete task
    class StagingArea,RecallDecision,ConfirmSubmit staging
    class DailyReport,ReportContent,UploadPhoto,RecordWeather,SaveDailyReport,QualityCheck,QCInspector,QCChecklist,QCPhoto,UpdateProgress,FinalInspection,Inspection,InspectionType,InspectionResult,ResponsibilityTransfer,UpdateDashboard quality
    class ManualIssue,AutoIssue,IssueSeverity,IssueAssign,IssueNotify,IssueHandle,IssuePhoto,IssueDiscuss,IssueStatus,CloseIssue,IssueSyncMain issue
    class OpenDiscussion,DiscussType,TaskDiscuss,IssueDiscussThread,PRDiscuss,InspectionDiscuss,GeneralDiscuss,PostComment,RealtimeBroadcast,NotifyMentioned discuss
    class NotificationCenter,NotifyRules,NotifyPush,ReadStatus notify
    class AnalyzeData,QueryScope,MainBranchAnalytics,BranchAnalytics,CrossBranchAnalytics,GenerateChart,AnalyticsCache,ExportReport analytics
    class UploadDoc,DocType,UploadImage,UploadDocument,UploadDrawing,SaveDocMeta,DocVersion,Thumbnail,GenThumbnail,DocPermission storage
    class SelectAction,CollabAccept,PRDecision,QCResult,IssueResolve decision
```

- --

## 流程說明

### 1. 身份認證層
- 整合 Supabase Auth 與 @delon/auth
- 支援多種登入方式(Email/OAuth/Magic Link)
- Session 自動同步與權限驗證

### 2. 專案藍圖層
- Git-like 分支模型
- 主分支擁有者完全控制
- 協作組織僅操作承攬欄位
- Pull Request 審查與合併機制

### 3. 任務執行流程
- 樹狀結構,無層級限制
- 多種指派類型(個人/團隊/組織/承攬)
- 暫存區 48 小時可撤回機制
- 每日報表自動記錄天氣與照片

### 4. 品質驗收流程
- Checklist 評分標準
- 驗收照片前中後對比
- 自動觸發問題開立
- 最終驗收責任切割

### 5. 異常處理流程
- 問題即時同步至主分支
- 嚴重程度分級管理
- Realtime 通知與討論
- 完整狀態流轉追蹤

### 6. 協作溝通
- 多類型討論區(任務/問題/PR/驗收/一般)
- 巢狀回覆與 @提及功能
- Realtime 廣播與已讀狀態
- 通知規則自訂(站內/Email/推播)

### 7. 數據分析
- 主分支/單一分支/跨分支分析
- Materialized Views 效能優化
- 預計算報表快取
- 互動式圖表前端渲染

### 8. 文件管理
- 三種 Storage Buckets(images/documents/drawings)
- 版本控制與變更描述
- 自動生成多尺寸縮圖
- RLS 權限控制

- --

## 相關文件

- 系統架構思維導圖:`01-系統架構思維導圖.mermaid.md`
- 狀態圖:`14-狀態圖.mermaid.md` - 狀態流轉視覺化
- 狀態枚舉值定義:`36-狀態枚舉值定義.md` - 狀態定義單一真實來源
- 帳戶層流程圖:`05-帳戶層流程圖.mermaid.md`
- Supabase 架構圖:`17-Supabase架構流程圖.mermaid.md`
- 專案結構流程圖:`02-專案結構流程圖.mermaid.md`
