# Supabase 架構流程圖

> 📋 **目的**：展示 Supabase 核心服務架構，包含認證、資料庫、Storage、Edge Functions 等組件的互動關係

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

```mermaid
flowchart TD
    %% ==================== Supabase 核心服務 ====================
    subgraph SupabaseCore["☁️ Supabase 核心服務"]
        direction TB
        Auth["🔐 Supabase Auth<br/>(身份認證)"]
        DB["🗄️ PostgreSQL Database<br/>(資料儲存)"]
        Storage["📦 Supabase Storage<br/>(檔案儲存)"]
        Realtime["⚡ Realtime<br/>(即時訂閱)"]
        EdgeFunc["⚙️ Edge Functions<br/>(無伺服器運算)"]
    end

    %% ==================== Account 層 ====================
    subgraph AccountLayer["🔐 帳戶層 (Supabase Auth + DB)"]
        direction TB
        Account["帳戶 Account<br/>📊 Table: accounts<br/>🔐 Auth.users"]

        subgraph AccountTypes["帳戶類型 (DB Enum)"]
            direction LR
            User["👤 User<br/>type='user'"]
            Bot["🤖 Bot<br/>type='bot'"]
            Org["🏢 Organization<br/>type='organization'"]
        end

        Account --> AccountTypes
        Team["👥 Team<br/>📊 Table: teams"]
        Org --> Team
    end

    Auth -.JWT Token.-> AccountLayer
    DB -.存儲.-> Account
    DB -.存儲.-> Team

    %% ==================== 藍圖層 ====================
    Blueprint["🎯 藍圖 Blueprint<br/>📊 Table: blueprints<br/>(owner_id: FK accounts)"]

    subgraph Branching["🔀 Git-like Branch / PR 流程"]
        direction TB
        BranchFork["Fork 任務<br/>📊 Table: branch_forks"]
        OrgBranch["組織分支<br/>📊 Table: blueprint_branches"]
        CollaborationInvite["協作邀請<br/>📊 Table: organization_collaborations"]
        PullRequestTbl["Pull Requests<br/>📊 Table: pull_requests"]
        ReviewTbl["審查紀錄<br/>📊 Table: pull_request_reviews"]
        MergeFunc["Edge Function: branch-merge<br/>⚙️ 合併承攬欄位"]
    end

    Blueprint --> BranchFork
    BranchFork --> OrgBranch
    CollaborationInvite --> BranchFork
    OrgBranch --> PullRequestTbl
    PullRequestTbl --> ReviewTbl
    ReviewTbl --> MergeFunc

    DB -.存儲.-> Blueprint
    DB -.存儲.-> Branching
    EdgeFunc -.PR Merge.-> MergeFunc
    AccountLayer -.外鍵關聯.-> Blueprint

    %% ==================== 任務執行流程模組 ====================
    subgraph Execution["📋 任務執行流程 (DB Tables + Realtime)"]
        direction TB
        B["任務管理<br/>📊 Table: tasks<br/>⚡ Realtime 訂閱"]
        E["每日報表<br/>📊 Table: daily_reports<br/>📦 Storage: 照片"]
        J["品質管理<br/>📊 Table: quality_checks<br/>📦 Storage: 驗收照片"]
        D["進度追蹤<br/>📊 Table: progress_tracking<br/>⚙️ Edge Function: 計算進度"]

        B -->|狀態更新| E
        E -->|提交驗收| J
        J -->|通過| D
    end

    DB -.存儲.-> Execution
    Realtime -.即時更新.-> B
    Storage -.檔案儲存.-> E
    Storage -.檔案儲存.-> J
    EdgeFunc -.進度計算.-> D

    %% ==================== 異常處理模組 ====================
    subgraph Exception["⚠️ 異常處理 (DB Tables + Realtime)"]
        direction TB
        C["問題追蹤<br/>📊 Table: issues<br/>⚡ Realtime 訂閱"]
        C1["問題開立<br/>⚙️ Edge Function: 通知"]
        C2["指派處理<br/>📊 Table: issue_assignments"]
        C3["狀態追蹤<br/>⚡ Realtime 狀態變更"]
        C4["問題關閉<br/>⚙️ Edge Function: 結案通知"]

        C --> C1 --> C2 --> C3 --> C4
    end

    DB -.存儲.-> Exception
    Realtime -.即時通知.-> C
    EdgeFunc -.通知邏輯.-> C1
    EdgeFunc -.結案邏輯.-> C4

    %% ==================== 協作溝通模組 ====================
    subgraph Collaboration["💬 協作溝通 (DB + Realtime)"]
        direction LR
        G["討論區<br/>📊 Table: comments<br/>⚡ Realtime 訂閱"]
        Notify["通知中心<br/>📊 Table: notifications<br/>⚡ Realtime 推送"]
        M["待辦事項<br/>📊 Table: todos<br/>⚡ Realtime 同步"]
    end

    DB -.存儲.-> Collaboration
    Realtime -.即時訊息.-> G
    Realtime -.即時通知.-> Notify
    Realtime -.即時同步.-> M

    %% ==================== 資料與分析模組 ====================
    subgraph DataLayer["📊 資料層 (Storage + DB + Edge Functions)"]
        direction LR
        H["文件管理<br/>📦 Storage Buckets:<br/>- images/*<br/>- documents/*<br/>- drawings/*"]
        F["活動記錄<br/>📊 Table: activity_logs<br/>(自動觸發器)"]
        N["數據分析<br/>⚙️ Edge Function: 統計<br/>📊 Materialized Views"]
    end

    Storage -.檔案儲存.-> H
    DB -.存儲+觸發器.-> F
    EdgeFunc -.分析運算.-> N
    DB -.物化視圖.-> N

    %% ==================== 系統管理模組 ====================
    subgraph SystemMgmt["⚙️ 系統管理 (DB + Edge Functions)"]
        direction LR
        R["角色權限<br/>📊 Table: roles<br/>📊 Table: permissions<br/>🔐 RLS Policies"]
        L["系統設定<br/>📊 Table: settings"]
        K["天氣預報<br/>⚙️ Edge Function: API 整合<br/>📊 Table: weather_cache"]
        BranchPolicy["分支權限<br/>📊 Table: branch_roles<br/>📊 Table: branch_permissions"]
    end

    DB -.存儲+RLS.-> R
    DB -.存儲.-> L
    EdgeFunc -.第三方API.-> K
    DB -.快取.-> K
    DB -.存儲.-> BranchPolicy

    %% ==================== 權限控制層 ====================
    subgraph PermissionLayer["🔒 權限控制層 (RLS + DB)"]
        direction TB
        RLS["Row Level Security<br/>(PostgreSQL RLS)"]
        RoleSystem["角色系統<br/>📊 Table: user_roles"]
        PermissionMatrix["權限矩陣<br/>📊 Table: role_permissions"]

        RLS --> RoleSystem
        RoleSystem --> PermissionMatrix
    end

    DB -.RLS 策略.-> PermissionLayer
    Auth -.JWT Claims.-> RLS

    %% ==================== 連接關係 ====================
    Blueprint --> Execution
    Blueprint --> Exception
    Blueprint --> Collaboration
    Blueprint --> DataLayer
    Blueprint --> SystemMgmt

    AccountLayer -.權限驗證.-> PermissionLayer
    PermissionLayer -.RLS 控制.-> Execution
    PermissionLayer -.RLS 控制.-> Exception
    PermissionLayer -.RLS 控制.-> Collaboration
    PermissionLayer -.RLS 控制.-> DataLayer
    PermissionLayer -.RLS 控制.-> SystemMgmt
    PermissionLayer -.RLS 控制.-> Branching

    %% ==================== 跨模組關聯 ====================
    B -.FK.-> C
    E -.Storage Path.-> H
    E -.FK.-> K
    J -.Storage Path.-> H
    J -.觸發器.-> C
    C -.Storage Path.-> H
    B -.FK.-> G
    C -.FK.-> G

    F -.DB Trigger.-> B
    F -.DB Trigger.-> E
    F -.DB Trigger.-> J
    F -.DB Trigger.-> C

    N -.Query.-> E
    N -.Query.-> J
    N -.Query.-> C
    N -.Query.-> D

    Notify -.Trigger.-> B
    Notify -.Trigger.-> J
    Notify -.Trigger.-> C

    AccountLayer -.所有操作觸發.-> F

    %% 樣式定義
    classDef supabaseCore fill:#3ECF8E,stroke:#1a8754,color:#000,stroke-width:4px
    classDef accountStyle fill:#E91E63,stroke:#880E4F,color:#fff,stroke-width:3px
    classDef blueprintStyle fill:#F44336,stroke:#C62828,color:#fff,stroke-width:4px
    classDef executionStyle fill:#4CAF50,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef exceptionStyle fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:2px
    classDef collabStyle fill:#2196F3,stroke:#1565C0,color:#fff
    classDef dataStyle fill:#9C27B0,stroke:#6A1B9A,color:#fff
    classDef systemStyle fill:#607D8B,stroke:#37474F,color:#fff
    classDef permissionStyle fill:#FFC107,stroke:#F57F17,color:#000,stroke-width:2px

    class Auth,DB,Storage,Realtime,EdgeFunc supabaseCore
    class Account,User,Bot,Org,Team accountStyle
    class Blueprint,Branching blueprintStyle
    class B,E,J,D executionStyle
    class C,C1,C2,C3,C4 exceptionStyle
    class G,Notify,M collabStyle
    class H,F,N dataStyle
    class R,L,K systemStyle
    class RLS,RoleSystem,PermissionMatrix permissionStyle
