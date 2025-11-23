# 05-帳戶層流程圖

## 📑 目錄

- [認證架構整合](#認證架構整合)
  - [🔐 Supabase Auth + @delon/auth 協作模式](#-supabase-auth--delonauth-協作模式)
  - [整合流程](#整合流程)
- [帳戶層架構圖](#帳戶層架構圖)
- [架構說明](#架構說明)
  - [1. 認證系統層](#1-認證系統層)
  - [2. 帳戶層](#2-帳戶層)
  - [3. 權限控制層](#3-權限控制層)
  - [4. 專案藍圖層](#4-專案藍圖層)
  - [5. 任務執行模組](#5-任務執行模組)
  - [6. 異常處理模組](#6-異常處理模組)
  - [7. 協作溝通模組](#7-協作溝通模組)
  - [8. 資料分析模組](#8-資料分析模組)
  - [9. 系統管理模組](#9-系統管理模組)
- [資料表關聯](#資料表關聯)
  - [核心資料表](#核心資料表)
  - [藍圖與分支](#藍圖與分支)
  - [任務執行](#任務執行)
  - [異常處理](#異常處理)
  - [協作溝通](#協作溝通)
  - [資料分析](#資料分析)
  - [權限控制](#權限控制)
  - [系統管理](#系統管理)
- [相關文件](#相關文件)

---


> **目的**:展示帳戶層架構,包含認證系統、帳戶類型、組織管理、權限控制等核心功能

**最後更新**:2025-11-17
**版本**:v3.0(基於系統架構思維導圖)
**狀態**:✅ 與系統架構完全對齊

- --

## 認證架構整合

### 🔐 Supabase Auth + @delon/auth 協作模式

本系統整合了兩個認證框架:
1. **Supabase Auth**:底層認證服務(JWT、Session 管理)
2. **@delon/auth**:前端認證框架(TokenService、路由守衛、HTTP 攔截器)

### 整合流程

```mermaid
  ↓
Supabase Auth 驗證
  ↓
SupabaseSessionAdapter 轉換
  ↓
@delon/auth TokenService 同步
  ↓
載入 Account 資料(accounts 表)
  ↓
設定用戶狀態(AuthStateService)
  ↓
RLS 權限驗證(基於 JWT Claims)
```

- --

## 帳戶層架構圖

```mermaid
flowchart TD
    %% ==================== 認證系統層 ====================
    subgraph AuthLayer["🔐 認證系統層 (Supabase Auth + @delon/auth)"]
        direction TB

        subgraph SupabaseAuth["Supabase Auth (底層認證服務)"]
            direction TB
            AuthMethods["認證方式"]
            EmailPwd["Email/Password"]
            OAuth["OAuth (Google/GitHub)"]
            MagicLink["Magic Link"]
            SessionMgmt["Session 管理"]
            JWTToken["JWT Token 驗證"]

            AuthMethods --> EmailPwd
            AuthMethods --> OAuth
            AuthMethods --> MagicLink
            EmailPwd --> SessionMgmt
            OAuth --> SessionMgmt
            MagicLink --> SessionMgmt
            SessionMgmt --> JWTToken
        end

        subgraph Adapter["SupabaseSessionAdapter (Session 轉換層)"]
            direction LR
            Convert["Session → Token 格式轉換"]
            Sync["同步至 TokenService"]
            Refresh["Session 刷新處理"]

            Convert --> Sync --> Refresh
        end

        subgraph DelonAuth["@delon/auth (前端認證框架)"]
            direction LR
            TokenService["TokenService (Token 儲存)"]
            AuthGuard["authSimpleCanActivate (路由守衛)"]
            AuthInterceptor["authSimpleInterceptor (HTTP 攔截器)"]

            TokenService --> AuthGuard
            TokenService --> AuthInterceptor
        end

        subgraph AuthBusiness["AuthService (業務層)"]
            direction LR
            SignIn["signIn() 登入"]
            SignUp["signUp() 註冊"]
            SignOut["signOut() 登出"]
            GetUser["getCurrentUser() 獲取用戶"]
        end

        SupabaseAuth --> Adapter
        Adapter --> DelonAuth
        AuthBusiness -.使用.-> SupabaseAuth
        AuthBusiness -.使用.-> Adapter
    end

    %% ==================== Account 層 ====================
    subgraph AccountLayer["👥 帳戶層 (Account Layer)"]
        direction TB

        AccountModel["帳戶 Account<br/>📊 Table: accounts<br/>統一身份抽象"]

        subgraph AccountTypes["帳戶類型 (type: Enum)"]
            direction LR
            TypeUser["👤 User<br/>type='user'<br/>個人用戶"]
            TypeBot["🤖 Bot<br/>type='bot'<br/>機器人帳戶"]
            TypeOrg["🏢 Organization<br/>type='organization'<br/>組織帳戶"]
        end

        AccountModel --> AccountTypes

        subgraph UserFeatures["User 專屬功能"]
            direction TB
            UserProfile["個人資料"]
            UserPreferences["個人偏好"]
            UserBlueprints["個人專案"]
        end

        subgraph BotFeatures["Bot 專屬功能"]
            direction TB
            BotTasks["定期任務<br/>📊 Table: bot_tasks"]
            BotExecLogs["執行日誌<br/>📊 Table: bot_execution_logs"]
            BotSchedule["排程設定"]
            BotTypes["機器人類型:<br/>定期報表機器人<br/>通知機器人<br/>備份機器人"]
        end

        subgraph OrgFeatures["Organization 專屬功能"]
            direction TB
            TeamMgmt["團隊管理<br/>📊 Table: teams"]
            OrgSchedule["組織排班<br/>📊 Table: organization_schedules<br/>跨藍圖成員調派<br/>天氣資訊整合"]
            OrgBlueprints["組織專案"]
            OrgCollab["組織協作<br/>📊 Table: organization_collaborations<br/>1:1 承攬關係<br/>協作邀請<br/>協作成員管理"]
        end

        TypeUser --> UserFeatures
        TypeBot --> BotFeatures
        TypeOrg --> OrgFeatures
    end

    %% 認證系統到帳戶層的連接
    JWTToken -->|auth_user_id 關聯| AccountModel
    GetUser -->|載入帳戶資料| AccountModel

    %% ==================== 權限控制層 ====================
    subgraph PermissionLayer["🔒 權限控制層 (RLS + Roles)"]
        direction TB

        subgraph RLS["Row Level Security (PostgreSQL RLS)"]
            direction LR
            RLSPolicies["RLS Policies"]
            JWTClaims["基於 JWT Claims"]
            FineGrained["細粒度存取控制"]

            RLSPolicies --> JWTClaims --> FineGrained
        end

        subgraph RoleSystem["角色系統"]
            direction TB
            DefaultRoles["預設角色"]
            CustomRoles["自訂角色"]

            subgraph DefaultRoleList["預設角色列表"]
                direction LR
                ProjectManager["專案經理"]
                SiteDirector["工地主任"]
                Worker["施工人員"]
                QAStaff["品管人員"]
                Observer["觀察者"]
            end

            DefaultRoles --> DefaultRoleList
        end

        subgraph PermissionMatrix["權限矩陣"]
            direction LR
            ResourcePerms["資源權限"]
            PermRead["讀取 Read"]
            PermWrite["寫入 Write"]
            PermDelete["刪除 Delete"]
            PermAdmin["管理 Admin"]

            ResourcePerms --> PermRead
            ResourcePerms --> PermWrite
            ResourcePerms --> PermDelete
            ResourcePerms --> PermAdmin
        end

        subgraph BranchPermissions["分支權限 (branch_permissions)"]
            direction LR
            BPOwner["擁有者:全權控制<br/>任務結構完全控制"]
            BPCollab["協作組織:僅操作承攬欄位<br/>不可修改任務結構"]
            BPViewer["查看者:唯讀"]

            BPOwner -.優先級最高.-> BPCollab
            BPCollab -.優先級高於.-> BPViewer
        end
    end

    %% Account 層透過 JWT 驗證權限
    JWTToken -->|JWT Claims| RLS
    AccountModel -->|權限驗證| PermissionMatrix

    %% ==================== 專案藍圖層 ====================
    subgraph BlueprintLayer["🎯 專案藍圖層 (Git-like Branch Model)"]
        direction TB

        subgraph BlueprintMgmt["藍圖管理"]
            direction TB
            CreateBlueprint["建立藍圖<br/>📊 Table: blueprints"]
            BlueprintOwner["藍圖擁有者<br/>owner_id: FK accounts"]
            BlueprintConfig["藍圖設定<br/>工作日曆<br/>通知規則<br/>自訂欄位"]

            CreateBlueprint --> BlueprintOwner
            BlueprintOwner --> BlueprintConfig
        end

        subgraph BranchSystem["分支系統 (承攬模式)"]
            direction TB
            MainBranch["🌿 主分支 Main Branch<br/>擁有者組織控制<br/>任務結構完全控制"]
            Fork["Fork 任務<br/>📊 Table: branch_forks<br/>1:1 承攬關係"]
            OrgBranch["🌿 組織分支<br/>📊 Table: blueprint_branches<br/>只能操作承攬欄位<br/>不可修改任務結構"]

            MainBranch -->|Fork 給協作組織| Fork
            Fork --> OrgBranch
        end

        subgraph PRSystem["Pull Request 機制"]
            direction LR
            PRSubmit["提交 PR<br/>📊 Table: pull_requests<br/>提交執行數據"]
            PRReview["審查變更<br/>📊 Table: pull_request_reviews<br/>擁有者審核"]
            PRMerge["合併主分支<br/>Edge Function: branch-merge<br/>更新承攬欄位"]

            PRSubmit --> PRReview
            PRReview -->|通過| PRMerge
            PRMerge -->|更新| MainBranch
        end

        OrgBranch -->|提交執行數據| PRSubmit
    end

    %% Account 到 Blueprint 的擁有關係
    TypeUser -.建立/擁有.-> CreateBlueprint
    TypeBot -.建立/擁有.-> CreateBlueprint
    TypeOrg -.建立/擁有.-> CreateBlueprint
    TeamMgmt -.透過組織權限.-> CreateBlueprint

    %% 組織協作到分支
    OrgCollab -.Fork 分支.-> Fork
    OrgCollab -.管理 PR.-> PRSubmit

    %% 權限控制分支存取
    BranchPermissions -->|控制存取| BranchSystem
    BranchPermissions -->|控制操作| PRSystem

    %% ==================== 任務執行模組 ====================
    subgraph TaskExecution["📋 任務執行模組"]
        direction TB

        subgraph TaskMgmt["任務管理 (tasks)"]
            direction TB
            TaskCreate["任務建立<br/>僅藍圖擁有者<br/>樹狀結構<br/>無層級限制"]
            TaskAssign["任務指派<br/>個人/團隊/組織/承攬<br/>Realtime 通知"]
            TaskList["任務列表<br/>按指派對象分類<br/>待辦中心聚合"]
            TaskStaging["暫存區<br/>📊 Table: task_staging<br/>48 小時可撤回<br/>分階段確認"]
            TaskStatus["狀態追蹤<br/>待處理/進行中/暫存中<br/>品管中/驗收中<br/>已完成/已取消"]

            TaskCreate --> TaskAssign
            TaskAssign --> TaskList
            TaskList --> TaskStaging
            TaskStaging --> TaskStatus
        end

        subgraph DailyReports["每日報表 (daily_reports)"]
            direction LR
            ReportSummary["工作摘要<br/>工作時數<br/>工人數量"]
            ReportPhoto["施工照片<br/>Storage 儲存<br/>EXIF 資料"]
            ReportWeather["天氣記錄<br/>Edge Function API<br/>快取機制"]

            ReportSummary --> ReportPhoto
            ReportPhoto --> ReportWeather
        end

        subgraph QualityChecks["品質驗收 (quality_checks)"]
            direction LR
            QCChecklist["檢查項目<br/>Checklist<br/>評分標準"]
            QCProcess["驗收流程<br/>待驗收/檢查中<br/>通過/不通過"]
            QCPhoto["驗收照片<br/>前中後對比<br/>缺陷記錄"]
            QCAutoIssue["自動觸發<br/>開立問題<br/>更新進度"]

            QCChecklist --> QCProcess
            QCProcess --> QCPhoto
            QCPhoto --> QCAutoIssue
        end

        subgraph FinalInspection["最終驗收 (inspections)"]
            direction LR
            InspectionType["驗收類型<br/>初步驗收<br/>最終驗收<br/>保固驗收<br/>移交驗收"]
            InspectionResp["責任切割<br/>責任轉移記錄"]

            InspectionType --> InspectionResp
        end

        subgraph ProgressDashboard["進度儀表板"]
            direction LR
            ProgressChart["視覺化圖表<br/>完成率統計"]
            ProgressCalc["Edge Function 計算<br/>Materialized Views"]

            ProgressChart --> ProgressCalc
        end

        TaskStatus --> DailyReports
        DailyReports --> QualityChecks
        QualityChecks --> FinalInspection
        FinalInspection --> ProgressDashboard
    end

    %% 藍圖連接任務執行
    MainBranch -->|擁有者管理| TaskMgmt
    OrgBranch -->|協作組織執行| TaskMgmt

    %% ==================== 異常處理模組 ====================
    subgraph IssueTracking["⚠️ 異常處理模組"]
        direction TB

        subgraph IssueCreate["問題追蹤 (issues)"]
            direction TB
            IssueSource["問題開立來源:<br/>手動回報<br/>驗收不合格<br/>系統檢測"]
            IssueSeverity["嚴重程度:<br/>低/中/高/緊急"]

            IssueSource --> IssueSeverity
        end

        subgraph IssueProcess["處理流程"]
            direction LR
            IssueAssign["問題指派<br/>處理人員<br/>審核人員<br/>Edge Function 通知"]
            IssueFlow["處理流程<br/>新建→指派→處理中<br/>→已解決→已關閉<br/>→重新開啟"]
            IssuePhoto["問題照片<br/>Storage 儲存<br/>問題追蹤"]

            IssueAssign --> IssueFlow
            IssueFlow --> IssuePhoto
        end

        subgraph IssueSync["跨分支同步 (issue_sync_logs)"]
            direction LR
            SyncMain["即時同步至主分支<br/>所有分支問題統一可見"]
            SyncRealtime["Realtime 訂閱<br/>即時更新"]

            SyncMain --> SyncRealtime
        end

        IssueCreate --> IssueProcess
        IssueProcess --> IssueSync
    end

    %% 任務執行觸發問題
    QCAutoIssue -.自動開立.-> IssueCreate

    %% ==================== 協作溝通模組 ====================
    subgraph Collaboration["💬 協作溝通模組"]
        direction TB

        subgraph Discussion["討論區 (comments)"]
            direction LR
            DiscussReply["留言功能<br/>巢狀回覆<br/>@提及功能"]
            DiscussRealtime["即時訊息<br/>Realtime 廣播<br/>已讀狀態"]
            DiscussContext["關聯實體<br/>任務討論<br/>問題討論<br/>PR 討論<br/>驗收討論<br/>一般討論"]

            DiscussReply --> DiscussRealtime
            DiscussRealtime --> DiscussContext
        end

        subgraph NotificationCenter["通知中心 (notifications)"]
            direction TB
            NotifyTypes["通知類型<br/>任務通知<br/>問題通知<br/>留言通知<br/>PR 狀態通知<br/>系統通知"]
            NotifyRules["通知規則<br/>📊 Table: notification_rules<br/>站內/Email/推播<br/>用戶自訂規則<br/>通知訂閱"]
            NotifyPush["推送機制<br/>Realtime 推送<br/>Email 通知 (Edge Function)<br/>瀏覽器推送"]
            NotifyRead["已讀管理"]

            NotifyTypes --> NotifyRules
            NotifyRules --> NotifyPush
            NotifyPush --> NotifyRead
        end

        subgraph PersonalTodos["待辦中心 (personal_todos)"]
            direction TB
            TodoList["個人待辦"]
            TodoStates["五種狀態分類<br/>🟦 待執行<br/>🟨 暫存中<br/>🟧 品管中<br/>🟥 驗收中<br/>⚠️ 問題追蹤"]
            TodoRelation["任務關聯<br/>問題關聯<br/>優先級管理"]
            TodoHistory["狀態追蹤歷史<br/>Realtime 同步"]

            TodoList --> TodoStates
            TodoStates --> TodoRelation
            TodoRelation --> TodoHistory
        end
    end

    %% 任務與問題連接討論
    TaskMgmt -.任務討論.-> Discussion
    IssueProcess -.問題討論.-> Discussion
    PRSystem -.PR 討論.-> Discussion

    %% 通知連接各模組
    TaskAssign -.任務通知.-> NotifyTypes
    IssueAssign -.問題通知.-> NotifyTypes
    PRReview -.PR 通知.-> NotifyTypes
    DiscussReply -.留言通知.-> NotifyTypes

    %% 待辦中心聚合
    TaskList -.待執行.-> TodoStates
    TaskStaging -.暫存中.-> TodoStates
    QualityChecks -.品管中.-> TodoStates
    FinalInspection -.驗收中.-> TodoStates
    IssueProcess -.問題追蹤.-> TodoStates

    %% ==================== 資料分析模組 ====================
    subgraph DataAnalytics["📊 資料分析模組"]
        direction TB

        subgraph FileManagement["文件管理"]
            direction TB
            StorageBuckets["Storage Buckets<br/>images/ (施工照片/驗收照片/問題照片)<br/>documents/ (合約文件/工程圖/報表文件)<br/>drawings/ (CAD 圖檔/施工圖)"]
            DocMetadata["文件元資料<br/>📊 Table: documents<br/>檔案資訊<br/>上傳者<br/>權限控制<br/>軟刪除 (30天)"]
            DocVersion["版本控制<br/>📊 Table: document_versions<br/>版本歷史<br/>變更描述"]
            DocThumbnail["圖片縮圖<br/>📊 Table: document_thumbnails<br/>自動生成<br/>多尺寸快取"]

            StorageBuckets --> DocMetadata
            DocMetadata --> DocVersion
            DocMetadata --> DocThumbnail
        end

        subgraph ActivityLogs["活動記錄 (activity_logs)"]
            direction LR
            LogAuto["自動記錄<br/>Database Triggers<br/>所有操作"]
            LogCentral["集中記錄<br/>所有分支同步到主分支<br/>擁有者全局掌控"]
            LogContent["記錄內容<br/>操作類型<br/>變更內容<br/>時間戳記<br/>IP/User Agent"]
            LogAudit["審計追蹤"]

            LogAuto --> LogCentral
            LogCentral --> LogContent
            LogContent --> LogAudit
        end

        subgraph DataAnalysis["數據分析"]
            direction TB
            AnalyticsReports["統計報表<br/>主分支報表<br/>分支報表<br/>跨分支總覽<br/>Edge Function 計算<br/>複雜聚合"]
            AnalyticsCache["分析快取<br/>📊 Table: analytics_cache<br/>預計算報表<br/>多層級聚合<br/>快取過期策略"]
            AnalyticsChart["圖表視覺化<br/>前端渲染<br/>互動式圖表"]
            AnalyticsOptimize["效能優化<br/>Materialized Views<br/>定期更新<br/>快取策略"]

            AnalyticsReports --> AnalyticsCache
            AnalyticsCache --> AnalyticsChart
            AnalyticsChart --> AnalyticsOptimize
        end
    end

    %% 任務執行連接文件管理
    ReportPhoto -.儲存.-> StorageBuckets
    QCPhoto -.儲存.-> StorageBuckets
    IssuePhoto -.儲存.-> StorageBuckets

    %% 所有操作觸發活動記錄
    TaskMgmt -.DB Trigger.-> LogAuto
    IssueProcess -.DB Trigger.-> LogAuto
    PRSystem -.DB Trigger.-> LogAuto

    %% 數據分析查詢各模組
    AnalyticsReports -.查詢.-> DailyReports
    AnalyticsReports -.查詢.-> QualityChecks
    AnalyticsReports -.查詢.-> IssueProcess
    AnalyticsReports -.查詢.-> ProgressDashboard

    %% ==================== 系統管理模組 ====================
    subgraph SystemManagement["⚙️ 系統管理模組"]
        direction TB

        subgraph Settings["系統設定 (settings)"]
            direction LR
            GlobalSettings["全域設定"]
            ProjectSettings["專案設定"]
            PersonalPreferences["個人偏好"]

            GlobalSettings --> ProjectSettings
            ProjectSettings --> PersonalPreferences
        end

        subgraph FeatureFlags["功能開關 (feature_flags)"]
            direction LR
            GrayRelease["灰度發布"]
            ABTest["A/B 測試"]
            TargetAccount["目標帳戶/組織"]

            GrayRelease --> ABTest
            ABTest --> TargetAccount
        end

        subgraph WeatherIntegration["天氣整合"]
            direction LR
            WeatherAPI["第三方 API<br/>Edge Function 調用"]
            WeatherCache["資料快取<br/>📊 Table: weather_cache<br/>減少 API 調用"]
            WeatherDisplay["顯示整合<br/>日報天氣<br/>工地環境"]

            WeatherAPI --> WeatherCache
            WeatherCache --> WeatherDisplay
        end

        subgraph BotSystem["機器人系統 (bots)"]
            direction LR
            BotReport["定期報表機器人"]
            BotNotify["通知機器人"]
            BotBackup["備份機器人"]
            BotQueue["任務佇列<br/>📊 Table: bot_tasks"]
            BotLogs["執行日誌<br/>📊 Table: bot_execution_logs"]

            BotReport --> BotQueue
            BotNotify --> BotQueue
            BotBackup --> BotQueue
            BotQueue --> BotLogs
        end

        subgraph BackupRestore["備份還原"]
            direction LR
            PGBackup["PostgreSQL 備份"]
            StorageBackup["Storage 備份"]
            AutoBackup["自動化備份"]

            PGBackup --> AutoBackup
            StorageBackup --> AutoBackup
        end
    end

    %% Bot 帳戶連接機器人系統
    TypeBot -.執行.-> BotSystem

    %% 天氣整合連接日報
    ReportWeather -.調用.-> WeatherIntegration

    %% ==================== 跨模組關聯樣式 ====================
    classDef authLayerStyle fill:#1A237E,stroke:#0D47A1,color:#fff,stroke-width:3px
    classDef supabaseStyle fill:#3F51B5,stroke:#1A237E,color:#fff,stroke-width:2px
    classDef adapterStyle fill:#5C6BC0,stroke:#3F51B5,color:#fff,stroke-width:2px
    classDef delonStyle fill:#7986CB,stroke:#5C6BC0,color:#fff,stroke-width:2px
    classDef authBusinessStyle fill:#9FA8DA,stroke:#7986CB,color:#000,stroke-width:2px
    classDef accountStyle fill:#E91E63,stroke:#880E4F,color:#fff,stroke-width:3px
    classDef accountTypeStyle fill:#F06292,stroke:#C2185B,color:#fff,stroke-width:2px
    classDef permissionStyle fill:#FFC107,stroke:#F57F17,color:#000,stroke-width:3px
    classDef rlsStyle fill:#FFD54F,stroke:#FFA000,color:#000,stroke-width:2px
    classDef blueprintStyle fill:#F44336,stroke:#C62828,color:#fff,stroke-width:3px
    classDef branchStyle fill:#FF7043,stroke:#D84315,color:#fff,stroke-width:2px
    classDef taskStyle fill:#4CAF50,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef issueStyle fill:#FF5722,stroke:#BF360C,color:#fff,stroke-width:2px
    classDef collabStyle fill:#2196F3,stroke:#1565C0,color:#fff,stroke-width:2px
    classDef dataStyle fill:#9C27B0,stroke:#6A1B9A,color:#fff,stroke-width:2px
    classDef systemStyle fill:#607D8B,stroke:#37474F,color:#fff,stroke-width:2px

    class AuthMethods,EmailPwd,OAuth,MagicLink,SessionMgmt,JWTToken supabaseStyle
    class Convert,Sync,Refresh adapterStyle
    class TokenService,AuthGuard,AuthInterceptor delonStyle
    class SignIn,SignUp,SignOut,GetUser authBusinessStyle
    class AccountModel,UserFeatures,BotFeatures,OrgFeatures accountStyle
    class TypeUser,TypeBot,TypeOrg,UserProfile,UserPreferences,UserBlueprints,TeamMgmt,OrgSchedule,OrgBlueprints,OrgCollab accountTypeStyle
    class RLSPolicies,JWTClaims,FineGrained rlsStyle
    class DefaultRoles,CustomRoles,ProjectManager,SiteDirector,Worker,QAStaff,Observer,ResourcePerms,PermRead,PermWrite,PermDelete,PermAdmin permissionStyle
    class BPOwner,BPCollab,BPViewer branchStyle
    class CreateBlueprint,BlueprintOwner,BlueprintConfig,MainBranch,Fork,OrgBranch,PRSubmit,PRReview,PRMerge blueprintStyle
    class TaskCreate,TaskAssign,TaskList,TaskStaging,TaskStatus,ReportSummary,ReportPhoto,ReportWeather,QCChecklist,QCProcess,QCPhoto,QCAutoIssue,InspectionType,InspectionResp,ProgressChart,ProgressCalc taskStyle
    class IssueSource,IssueSeverity,IssueAssign,IssueFlow,IssuePhoto,SyncMain,SyncRealtime issueStyle
    class DiscussReply,DiscussRealtime,DiscussContext,NotifyTypes,NotifyRules,NotifyPush,NotifyRead,TodoList,TodoStates,TodoRelation,TodoHistory collabStyle
    class StorageBuckets,DocMetadata,DocVersion,DocThumbnail,LogAuto,LogCentral,LogContent,LogAudit,AnalyticsReports,AnalyticsCache,AnalyticsChart,AnalyticsOptimize dataStyle
    class GlobalSettings,ProjectSettings,PersonalPreferences,GrayRelease,ABTest,TargetAccount,WeatherAPI,WeatherCache,WeatherDisplay,BotReport,BotNotify,BotBackup,BotQueue,BotLogs,PGBackup,StorageBackup,AutoBackup systemStyle
```

- --

## 架構說明

### 1. 認證系統層
- **Supabase Auth**: JWT Token、Session 管理、多種登入方式
- **SupabaseSessionAdapter**: Session 轉換橋接層
- **@delon/auth**: 前端認證框架(路由守衛、HTTP 攔截器)
- **AuthService**: 業務層封裝(signIn/signUp/signOut/getCurrentUser)

### 2. 帳戶層
- **Account 統一身份抽象**: 三種帳戶類型(User/Bot/Organization)
- **User**: 個人用戶,擁有個人專案與偏好設定
- **Bot**: 機器人帳戶,執行自動化任務(定期報表/通知/備份)
- **Organization**: 組織帳戶,管理團隊、排班、協作關係

### 3. 權限控制層
- **RLS (Row Level Security)**: PostgreSQL 原生權限控制,基於 JWT Claims
- **角色系統**: 預設角色與自訂角色
- **權限矩陣**: Read/Write/Delete/Admin 四級權限
- **分支權限**: 擁有者全權控制,協作組織僅操作承攬欄位,查看者唯讀

### 4. 專案藍圖層
- **Git-like 分支模型**: 主分支與組織分支的 Fork 機制
- **主分支**: 擁有者完全控制任務結構
- **組織分支**: 1:1 承攬關係,僅操作承攬欄位
- **Pull Request**: 提交執行數據,擁有者審核後合併

### 5. 任務執行模組
- **任務管理**: 樹狀結構無層級限制,多種指派類型
- **暫存區**: 48 小時可撤回機制
- **每日報表**: 施工照片、天氣記錄、工作摘要
- **品質驗收**: Checklist 評分、前中後對比照片
- **最終驗收**: 責任切割與轉移記錄
- **進度儀表板**: Materialized Views 效能優化

### 6. 異常處理模組
- **問題追蹤**: 手動回報/驗收不合格/系統檢測
- **嚴重程度**: 低/中/高/緊急四級分類
- **跨分支同步**: 所有分支問題即時同步至主分支
- **Realtime 訂閱**: 即時通知與狀態更新

### 7. 協作溝通模組
- **討論區**: 巢狀回覆、@提及、關聯實體(任務/問題/PR/驗收/一般)
- **通知中心**: 多類型通知、自訂規則(站內/Email/推播)
- **待辦中心**: 五種狀態分類(待執行/暫存中/品管中/驗收中/問題追蹤)

### 8. 資料分析模組
- **文件管理**: 三種 Storage Buckets、版本控制、自動縮圖、軟刪除
- **活動記錄**: Database Triggers 自動記錄,集中至主分支
- **數據分析**: 主分支/分支/跨分支報表,預計算快取,Materialized Views

### 9. 系統管理模組
- **系統設定**: 全域/專案/個人三層設定
- **功能開關**: 灰度發布、A/B 測試、目標帳戶
- **天氣整合**: Edge Function 調用第三方 API,快取機制
- **機器人系統**: 定期報表/通知/備份機器人,任務佇列與執行日誌
- **備份還原**: PostgreSQL 與 Storage 自動化備份

- --

## 資料表關聯

### 核心資料表
- `accounts`: 帳戶統一抽象(User/Bot/Organization)
- `teams`: 團隊管理(FK: organization_id)
- `organization_schedules`: 組織排班(FK: organization_id)
- `organization_collaborations`: 組織協作關係(FK: organization_id, collaborator_id)

### 藍圖與分支
- `blueprints`: 專案藍圖(FK: owner_id → accounts)
- `branch_forks`: Fork 記錄(FK: blueprint_id, forked_to_org_id)
- `blueprint_branches`: 分支記錄(FK: blueprint_id, organization_id)
- `pull_requests`: PR 記錄(FK: branch_id, reviewer_id)
- `pull_request_reviews`: PR 審查記錄(FK: pull_request_id, reviewer_id)

### 任務執行
- `tasks`: 任務管理(FK: blueprint_id, parent_task_id, assigned_to_id)
- `task_staging`: 暫存區(FK: task_id)
- `daily_reports`: 每日報表(FK: task_id, created_by_id)
- `quality_checks`: 品質驗收(FK: task_id, inspector_id)
- `inspections`: 最終驗收(FK: task_id, inspector_id)
- `progress_tracking`: 進度追蹤(FK: blueprint_id)

### 異常處理
- `issues`: 問題追蹤(FK: task_id, created_by_id)
- `issue_assignments`: 問題指派(FK: issue_id, assigned_to_id)
- `issue_sync_logs`: 跨分支同步日誌(FK: issue_id, branch_id)

### 協作溝通
- `comments`: 討論區(FK: entity_id, author_id)
- `notifications`: 通知中心(FK: user_id)
- `notification_rules`: 通知規則(FK: user_id)
- `personal_todos`: 待辦中心(FK: user_id, task_id, issue_id)

### 資料分析
- `documents`: 文件元資料(FK: uploaded_by_id)
- `document_versions`: 版本控制(FK: document_id)
- `document_thumbnails`: 圖片縮圖(FK: document_id)
- `activity_logs`: 活動記錄(FK: account_id, blueprint_id)
- `analytics_cache`: 分析快取(FK: blueprint_id)

### 權限控制
- `roles`: 角色定義
- `permissions`: 權限定義
- `user_roles`: 用戶角色關聯(FK: account_id, role_id)
- `role_permissions`: 角色權限關聯(FK: role_id, permission_id)
- `branch_permissions`: 分支權限(FK: branch_id, account_id)

### 系統管理
- `settings`: 系統設定
- `feature_flags`: 功能開關
- `weather_cache`: 天氣快取
- `bot_tasks`: 機器人任務(FK: bot_id)
- `bot_execution_logs`: 執行日誌(FK: bot_id, task_id)

- --

## 相關文件

- 系統架構思維導圖: `01-系統架構思維導圖.mermaid.md`
- 業務流程圖: `04-業務流程圖.mermaid.md`
- Supabase 架構圖: `17-Supabase架構流程圖.mermaid.md`
- 專案結構流程圖: `02-專案結構流程圖.mermaid.md`
