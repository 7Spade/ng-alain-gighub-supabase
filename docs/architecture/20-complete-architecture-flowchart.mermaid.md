# 完整架構流程圖

> 📋 **目的**：展示系統的完整架構流程，包含 Git-like 分支模型、51 張資料表、11 個業務模組的整體設計

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

```mermaid
flowchart TD
    %% ==================== Account 層 ====================
    subgraph AccountLayer["🔐 帳戶層 Account Layer"]
        direction TB
        Account["帳戶 Account<br/>(統一身份抽象)"]

        subgraph AccountTypes["帳戶類型"]
            direction LR
            User["👤 用戶 User<br/>(type: User)"]
            Bot["🤖 機器人 Bot<br/>(type: Bot)"]
            Org["🏢 組織 Organization<br/>(type: Organization)"]
        end

        Account -- type: User --> User
        Account -- type: Bot --> Bot
        Account -- type: Organization --> Org

        Team["👥 團隊 Team"]
        Org --> Team

        %% 組織層級功能
        OrgSchedule["📅 排班管理<br/>(跨藍圖成員調派)"]
        OrgCollab["🤝 組織協作<br/>(跨組織藍圖協作)"]
        Org --> OrgSchedule
        Org --> OrgCollab
    end

    %% ==================== 藍圖層 ====================
    subgraph BlueprintMgmt["🎯 藍圖管理 (Git-like 分支模型)"]
        direction TB
        CreateBlueprint["➕ 建立藍圖"]
        MainBranch["🌿 主分支 Main Branch<br/>(擁有者組織)<br/>控制：任務結構"]
        BlueprintConfig["⚙️ 藍圖設定<br/>(基本資訊/範圍)"]

        %% Fork 與分支機制
        subgraph BranchSystem["🔀 分支系統 (承攬模式)"]
            direction TB
            Fork["Fork 任務<br/>(1:1 承攬關係)"]
            OrgBranch1["🌿 組織分支 A<br/>(只能操作承攬欄位)"]
            OrgBranch2["🌿 組織分支 B<br/>(只能操作承攬欄位)"]
            BranchNote["註：分支只能填寫執行數據<br/>不可修改任務結構"]

            Fork --> OrgBranch1
            Fork --> OrgBranch2
            Fork -.說明.-> BranchNote
        end

        %% 合併機制
        subgraph MergeSystem["🔄 合併機制 (更新承攬欄位)"]
            direction LR
            PullRequest["Pull Request<br/>(提交執行數據)"]
            Review["審查變更<br/>(擁有者審核)"]
            Merge["合併到主分支<br/>(更新欄位數據)"]

            PullRequest --> Review
            Review -->|通過| Merge
        end

        CreateBlueprint -->|初始化| MainBranch
        MainBranch --> BlueprintConfig
        MainBranch -.Fork 任務給協作組織.-> Fork
        OrgBranch1 -.提交執行數據.-> PullRequest
        OrgBranch2 -.提交執行數據.-> PullRequest
        Merge -.更新承攬欄位.-> MainBranch
    end

    %% Account 到 Blueprint 的擁有關係
    User -.直接擁有/建立.-> CreateBlueprint
    Bot -.直接擁有/建立.-> CreateBlueprint
    Org -.直接擁有/建立 Main.-> CreateBlueprint
    Team -.透過組織權限.-> CreateBlueprint

    %% 組織協作到分支
    OrgCollab -.Fork 分支.-> Fork
    OrgCollab -.管理 PR.-> PullRequest

    %% 組織間協作關係
    Org -.協作邀請.-> OrgCollab
    OrgCollab -.多組織共同參與.-> Org

    %% 排班系統與藍圖的關係
    OrgSchedule -.調派成員至 Main.-> MainBranch
    OrgSchedule -.調派成員至分支.-> OrgBranch1
    OrgSchedule -.調派成員至分支.-> OrgBranch2

    %% ==================== 任務執行流程模組 ====================
    subgraph Execution["📋 任務執行流程"]
        direction TB

        %% 任務建立流程
        CreateTask["➕ 建立任務<br/>(僅藍圖擁有者)"]

        %% 任務樹狀結構
        subgraph TaskTree["🌳 任務樹狀結構 (無層級限制)"]
            direction TB
            ParentTask["父任務<br/>(Phase/Milestone)"]
            SubTask1["└─ 子任務 1"]
            SubTask2["└─ 子任務 2"]
            SubSubTask["&nbsp;&nbsp;&nbsp;&nbsp;└─ 子子任務"]

            ParentTask --> SubTask1
            ParentTask --> SubTask2
            SubTask2 --> SubSubTask
        end

        CreateTask -->|建立| TaskTree

        %% 任務執行流程
        TaskAssign["📌 任務指派<br/>(個人/團隊/組織/承攬)"]
        TaskList["📋 任務列表<br/>(按指派對象分類)"]
        TaskSubmit["✅ 提交完成<br/>(被指派者提交)"]
        StagingArea["📦 暫存區<br/>(48h 可撤回)"]

        %% 同步分支
        DailyReport["📝 施工日誌<br/>(自動同步)"]
        QualityMgmt["🔍 品質管理<br/>(品管檢查)"]

        Inspection["✔️ 驗收<br/>(最終驗收/責任切割)"]
        Progress["📊 進度追蹤<br/>(視覺化儀表板)"]

        TaskTree --> TaskAssign
        TaskAssign -->|加入待辦| TaskList
        TaskList -->|開始執行| TaskSubmit
        TaskSubmit -->|先進暫存| StagingArea
        StagingArea -->|確認提交/同步1| DailyReport
        StagingArea -->|確認提交/同步2| QualityMgmt
        QualityMgmt -->|品管通過| Inspection
        Inspection -->|驗收通過| Progress
    end

    %% ==================== 異常處理模組 ====================
    subgraph Exception["⚠️ 異常處理 (同步至主分支)"]
        direction TB
        IssueTrack["問題追蹤<br/>(施工異常)"]
        Issue1["問題開立"]
        Issue2["指派處理"]
        Issue3["狀態追蹤"]
        Issue4["問題關閉"]
        IssueSyncNote["註：所有分支問題<br/>即時同步至主分支"]

        IssueTrack --> Issue1 --> Issue2 --> Issue3 --> Issue4
        IssueTrack -.說明.-> IssueSyncNote
    end

    %% ==================== 協作溝通模組 ====================
    subgraph Collaboration["💬 協作溝通"]
        direction TB
        Discussion["討論區"]

        subgraph NotifySystem["🔔 通知系統"]
            direction LR
            Notify["通知中心"]
            NotifyRule["通知規則<br/>(站內/Email/推播)"]
            Notify --> NotifyRule
        end

        subgraph TodoCenter["📌 待辦中心"]
            direction TB
            PersonalTodo["個人待辦中心"]
            TodoStatus["任務狀態分類"]
            TodoStatus1["🟦 待執行"]
            TodoStatus2["🟨 暫存中"]
            TodoStatus3["🟧 品管中"]
            TodoStatus4["🟥 驗收中"]
            TodoStatus5["⚠️ 問題追蹤"]

            PersonalTodo --> TodoStatus
            TodoStatus --> TodoStatus1
            TodoStatus --> TodoStatus2
            TodoStatus --> TodoStatus3
            TodoStatus --> TodoStatus4
            TodoStatus --> TodoStatus5
        end
    end

    %% ==================== 資料與分析模組 ====================
    subgraph DataLayer["📊 資料層"]
        direction TB

        subgraph FileSystem["📁 文件管理系統"]
            direction TB
            FileManager["文件管理"]
            FileUpload["⬆️ 檔案上傳介面"]
            FileStorage["💾 檔案儲存"]
            FileVersion["📜 版本控制"]
            FileThumbnail["🖼️ 圖片縮圖"]
            FileDelete["🗑️ 軟刪除 (30天)"]

            FileManager --> FileUpload
            FileManager --> FileStorage
            FileStorage --> FileVersion
            FileStorage --> FileThumbnail
            FileStorage --> FileDelete
        end

        subgraph LogSystem["📋 活動記錄 (集中主分支)"]
            direction LR
            ActivityLog["活動記錄"]
            LogNote["所有操作統一記錄<br/>擁有者全局掌控"]
            ActivityLog -.說明.-> LogNote
        end

        subgraph AnalyticsSystem["📈 數據分析"]
            direction TB
            Analytics["數據分析"]
            AnalyticsMain["主分支報表"]
            AnalyticsBranch["分支報表"]
            AnalyticsTotal["跨分支總覽"]

            Analytics --> AnalyticsMain
            Analytics --> AnalyticsBranch
            Analytics --> AnalyticsTotal
        end
    end

    %% ==================== 系統管理模組 ====================
    subgraph SystemMgmt["⚙️ 系統管理"]
        direction TB
        RoleMgmt["角色權限"]
        SystemConfig["系統設定"]
        WeatherAPI["🌤️ 天氣預報 API<br/>(中央氣象局)"]

        subgraph BotSystem["🤖 機器人系統 (基礎功能)"]
            direction LR
            BotSchedule["定期報表機器人"]
            BotNotify["通知機器人"]
            BotBackup["備份機器人"]
        end
    end

    %% ==================== 藍圖連接各模組群 ====================
    MainBranch --> Execution
    MainBranch --> Exception
    MainBranch --> Collaboration
    MainBranch --> DataLayer
    MainBranch --> SystemMgmt

    %% 分支也有自己的執行環境
    OrgBranch1 -.獨立執行環境.-> Execution
    OrgBranch2 -.獨立執行環境.-> Execution

    %% ==================== 權限控制層 ====================
    subgraph PermissionLayer["🔒 權限控制層"]
        direction TB
        RoleSystem["角色系統"]
        PermissionMatrix["權限矩陣"]

        subgraph BranchPermission["分支權限規則"]
            direction LR
            BP1["擁有者：全權控制"]
            BP2["協作組織：僅操作承攬欄位"]
            BP3["查看者：唯讀"]
        end

        RoleSystem --> PermissionMatrix
        PermissionMatrix --> BranchPermission
    end

    %% Account 層透過權限系統控制模組存取
    AccountLayer -.權限驗證.-> PermissionLayer
    PermissionLayer -.控制存取.-> BranchSystem
    PermissionLayer -.控制存取.-> MergeSystem
    PermissionLayer -.控制存取.-> Execution
    PermissionLayer -.控制存取.-> Exception
    PermissionLayer -.控制存取.-> Collaboration
    PermissionLayer -.控制存取.-> DataLayer
    PermissionLayer -.控制存取.-> SystemMgmt

    %% ==================== 跨模組關聯 ====================

    %% 任務流程調用文件管理
    CreateTask -.上傳圖片.-> FileManager
    TaskAssign -.上傳圖片.-> FileManager
    TaskList -.查看任務詳情.-> TaskTree
    TaskSubmit -.上傳圖片.-> FileManager
    StagingArea -.暫存圖片.-> FileManager

    %% 日誌與品管調用文件
    DailyReport -.查看任務圖片.-> FileManager
    DailyReport -.調用 API 記錄天氣.-> WeatherAPI
    QualityMgmt -.查看任務圖片.-> FileManager
    QualityMgmt -.記錄品管照片.-> FileManager
    Inspection -.記錄驗收照片.-> FileManager

    %% 異常處理
    TaskSubmit -.發現問題.-> IssueTrack
    StagingArea -.發現問題.-> IssueTrack
    QualityMgmt -.發現品管問題.-> IssueTrack
    Inspection -.發現驗收問題.-> IssueTrack
    IssueTrack -.附加照片.-> FileManager

    %% 討論功能
    TaskAssign -.任務討論.-> Discussion
    IssueTrack -.問題討論.-> Discussion

    %% 排班系統使用天氣（僅組織內部排班）
    OrgSchedule -.調用 API 參考天氣.-> WeatherAPI

    %% 活動記錄
    ActivityLog -.記錄操作.-> CreateTask
    ActivityLog -.記錄操作.-> TaskAssign
    ActivityLog -.記錄操作.-> TaskSubmit
    ActivityLog -.記錄操作.-> StagingArea
    ActivityLog -.記錄操作.-> DailyReport
    ActivityLog -.記錄操作.-> QualityMgmt
    ActivityLog -.記錄操作.-> Inspection
    ActivityLog -.記錄操作.-> IssueTrack

    %% 數據分析範圍
    AnalyticsMain -.分析主分支.-> DailyReport
    AnalyticsMain -.分析主分支.-> QualityMgmt
    AnalyticsMain -.分析主分支.-> Inspection
    AnalyticsMain -.分析主分支.-> IssueTrack
    AnalyticsMain -.分析主分支.-> Progress

    AnalyticsBranch -.分析分支數據.-> OrgBranch1
    AnalyticsBranch -.分析分支數據.-> OrgBranch2

    AnalyticsTotal -.聚合所有數據.-> AnalyticsMain
    AnalyticsTotal -.聚合所有數據.-> AnalyticsBranch

    %% 通知系統規則
    Notify -.任務指派通知.-> TaskAssign
    Notify -.任務提交通知.-> TaskList
    Notify -.提交確認通知.-> TaskSubmit
    Notify -.暫存提醒.-> StagingArea
    Notify -.品管結果通知.-> QualityMgmt
    Notify -.驗收結果通知.-> Inspection
    Notify -.問題通知.-> IssueTrack
    Notify -.PR狀態通知.-> PullRequest

    %% 個人待辦中心聚合
    TaskList -.待執行.-> TodoStatus1
    StagingArea -.暫存中.-> TodoStatus2
    QualityMgmt -.品管中.-> TodoStatus3
    Inspection -.驗收中.-> TodoStatus4
    IssueTrack -.問題追蹤.-> TodoStatus5
    User -.查看.-> PersonalTodo
    Team -.查看團隊待辦.-> PersonalTodo

    %% 活動記錄監聽 Account 操作
    AccountLayer -.所有操作.-> ActivityLog

    %% 樣式定義
    classDef accountStyle fill:#E91E63,stroke:#880E4F,color:#fff,stroke-width:3px
    classDef collabStyle fill:#FF4081,stroke:#C51162,color:#fff,stroke-width:2px
    classDef blueprintStyle fill:#F44336,stroke:#C62828,color:#fff,stroke-width:4px
    classDef branchStyle fill:#FF7043,stroke:#D84315,color:#fff,stroke-width:2px
    classDef mergeStyle fill:#FFA726,stroke:#EF6C00,color:#fff,stroke-width:2px
    classDef executionStyle fill:#4CAF50,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef taskTreeStyle fill:#81C784,stroke:#388E3C,color:#fff,stroke-width:2px
    classDef flowStyle fill:#66BB6A,stroke:#2E7D32,color:#fff,stroke-width:2px
    classDef stagingStyle fill:#AED581,stroke:#689F38,color:#000,stroke-width:2px
    classDef exceptionStyle fill:#FF9800,stroke:#E65100,color:#fff,stroke-width:2px
    classDef discussStyle fill:#2196F3,stroke:#1565C0,color:#fff
    classDef notifyStyle fill:#42A5F5,stroke:#1976D2,color:#fff
    classDef todoStyle fill:#64B5F6,stroke:#1E88E5,color:#fff
    classDef dataStyle fill:#9C27B0,stroke:#6A1B9A,color:#fff
    classDef fileStyle fill:#BA68C8,stroke:#7B1FA2,color:#fff,stroke-width:2px
    classDef logStyle fill:#AB47BC,stroke:#8E24AA,color:#fff
    classDef analyticsStyle fill:#CE93D8,stroke:#9C27B0,color:#fff
    classDef systemStyle fill:#607D8B,stroke:#37474F,color:#fff
    classDef botStyle fill:#78909C,stroke:#455A64,color:#fff
    classDef permissionStyle fill:#FFC107,stroke:#F57F17,color:#000,stroke-width:2px
    classDef bpStyle fill:#FFD54F,stroke:#F9A825,color:#000

    class Account,User,Bot,Org,Team,OrgSchedule accountStyle
    class OrgCollab collabStyle
    class CreateBlueprint,MainBranch,BlueprintConfig blueprintStyle
    class Fork,OrgBranch1,OrgBranch2,BranchNote branchStyle
    class PullRequest,Review,Merge mergeStyle
    class CreateTask executionStyle
    class ParentTask,SubTask1,SubTask2,SubSubTask taskTreeStyle
    class TaskAssign,TaskList,TaskSubmit,DailyReport,QualityMgmt,Inspection,Progress flowStyle
    class StagingArea stagingStyle
    class IssueTrack,Issue1,Issue2,Issue3,Issue4,IssueSyncNote exceptionStyle
    class Discussion discussStyle
    class Notify,NotifyRule notifyStyle
    class PersonalTodo,TodoStatus,TodoStatus1,TodoStatus2,TodoStatus3,TodoStatus4,TodoStatus5 todoStyle
    class ActivityLog,LogNote logStyle
    class Analytics,AnalyticsMain,AnalyticsBranch,AnalyticsTotal analyticsStyle
    class FileManager,FileUpload,FileStorage,FileVersion,FileThumbnail,FileDelete fileStyle
    class RoleMgmt,SystemConfig,WeatherAPI systemStyle
    class BotSchedule,BotNotify,BotBackup botStyle
    class RoleSystem,PermissionMatrix permissionStyle
    class BP1,BP2,BP3 bpStyle
