# 狀態圖（State Diagram）

> 📋 **目的**：展示系統各實體的狀態轉換流程，包含任務、品質檢查、問題等核心業務對象的狀態機

**最後更新**：2025-01-15
**維護者**：開發團隊
**版本**：v2.0（補充 PR、協作、待辦狀態機）

- --

```mermaid
stateDiagram-v2
    %% ==================== 任務狀態流轉 ====================
    [*] --> TaskPending: 建立任務<br/>(DB: tasks)

    state "任務狀態機" as TaskStateMachine {
        TaskPending: 📝 待處理 (pending)
        TaskAssigned: 👤 已指派 (assigned)
        TaskInProgress: 🔨 進行中 (in_progress)
        TaskStaging: 📦 暫存中 (staging)<br/>48小時可撤回
        TaskInQA: 🔍 品管中 (in_qa)
        TaskInInspection: ✔️ 驗收中 (in_inspection)
        TaskCompleted: ✅ 已完成 (completed)
        TaskCancelled: ❌ 已取消 (cancelled)

        TaskPending --> TaskAssigned: 指派負責人<br/>(Realtime 通知)
        TaskAssigned --> TaskInProgress: 開始施工
        TaskInProgress --> TaskStaging: 提交完成<br/>(進入暫存區)
        TaskStaging --> TaskInQA: 確認提交<br/>(48小時內可撤回)
        TaskInQA --> TaskInInspection: 品管通過
        TaskInInspection --> TaskCompleted: 驗收通過
        TaskInProgress --> TaskCancelled: 取消任務
        TaskAssigned --> TaskCancelled: 取消任務
        TaskStaging --> TaskInProgress: 撤回修正<br/>(48小時內)
        TaskInQA --> TaskInProgress: 品管不通過<br/>(返工)
        TaskInInspection --> TaskInProgress: 驗收不通過<br/>(返工)
        TaskCompleted --> [*]: 驗收通過<br/>(更新進度)
        TaskCancelled --> [*]: 任務終止

        TaskInProgress --> TaskInProgress: 提交日報<br/>(Storage 照片 + Edge Function 天氣)
    }

    %% ==================== 品質驗收狀態流轉 ====================
    TaskInQA --> QCPending: 提交品質檢查

    state "品質檢查狀態機" as QualityCheckStateMachine {
        QCPending: 🔍 待檢查 (pending)
        QCInProgress: 👁️ 檢查中 (in_progress)
        QCPassed: ✅ 通過 (passed)
        QCFailed: ❌ 不通過 (failed)
        QCConditionalPass: ⚠️ 條件通過 (conditional_pass)

        QCPending --> QCInProgress: 開始檢查
        QCInProgress --> QCPassed: 檢查合格<br/>(拍攝檢查照片到 Storage)
        QCInProgress --> QCFailed: 發現問題
        QCInProgress --> QCConditionalPass: 條件通過
        QCPassed --> InspectionPending: 進入驗收流程
        QCFailed --> IssueOpen: 自動開立問題<br/>(Edge Function 觸發)
        QCFailed --> TaskInProgress: 返工重做
        QCConditionalPass --> InspectionPending: 進入驗收流程
    }

    %% ==================== 驗收狀態流轉 ====================
    state "驗收狀態機" as InspectionStateMachine {
        InspectionPending: 🔍 待驗收 (pending)
        InspectionInProgress: 👁️ 驗收中 (in_progress)
        InspectionAccepted: ✅ 已接受 (accepted)<br/>責任轉移
        InspectionRejected: ❌ 已拒絕 (rejected)
        InspectionConditionalAccept: ⚠️ 條件接受 (conditional_accept)

        InspectionPending --> InspectionInProgress: 開始驗收
        InspectionInProgress --> InspectionAccepted: 驗收通過<br/>(責任轉移 = TRUE)
        InspectionInProgress --> InspectionRejected: 驗收不通過
        InspectionInProgress --> InspectionConditionalAccept: 條件接受
        InspectionAccepted --> [*]: 更新進度<br/>(Edge Function 計算)
        InspectionRejected --> TaskInProgress: 返工重做
        InspectionConditionalAccept --> [*]: 更新進度<br/>(條件完成)
    }

    %% ==================== 問題追蹤狀態流轉 ====================
    state "問題追蹤狀態機" as IssueStateMachine {
        IssueOpen: 🆕 開啟 (open)
        IssueInProgress: 🔧 處理中 (in_progress)
        IssueResolved: ✅ 已解決 (resolved)
        IssueClosed: 🔒 已關閉 (closed)
        IssueWontFix: ⚠️ 不修復 (wont_fix)

        [*] --> IssueOpen: 開立問題<br/>(Edge Function 發送通知<br/>即時同步至主分支)
        IssueOpen --> IssueInProgress: 開始處理<br/>(DB: issue_assignments)
        IssueInProgress --> IssueResolved: 完成修復
        IssueResolved --> IssueClosed: 確認關閉<br/>(Edge Function 結案通知)
        IssueInProgress --> IssueWontFix: 決定不修復
        IssueWontFix --> IssueClosed: 關閉問題
        IssueClosed --> [*]: 問題結案<br/>(activity_logs)

        IssueInProgress --> IssueInProgress: 討論溝通<br/>(DB: comments + Storage 照片 + Realtime 廣播)

        note right of IssueStateMachine
            所有分支問題即時同步至主分支
            (issue_sync_logs 表)
        end note
    }

    %% ==================== 每日報表狀態 ====================
    state "每日報表狀態機" as ReportStateMachine {
        ReportDraft: 📝 草稿 (draft)
        ReportSubmitted: 📤 已提交 (submitted)
        ReportReviewed: ✅ 已審核 (reviewed)

        [*] --> ReportDraft: 建立報表<br/>(DB: daily_reports)
        ReportDraft --> ReportSubmitted: 提交報表
        ReportSubmitted --> ReportReviewed: 主管審核
        ReportReviewed --> [*]: 完成歸檔

        ReportDraft --> ReportDraft: 上傳照片到 Storage<br/>記錄天氣 (Edge Function)
    }

    %% ==================== 通知狀態 ====================
    state "通知狀態機" as NotificationStateMachine {
        NotifUnread: 📬 未讀 (is_read = false)
        NotifRead: 📭 已讀 (is_read = true)

        [*] --> NotifUnread: 推送通知<br/>(Realtime 推送<br/>DB: notifications)
        NotifUnread --> NotifRead: 用戶查看<br/>(read_at = NOW())
        NotifRead --> [*]: 通知保留

        note right of NotificationStateMachine
            使用布林值 is_read 而非枚舉
            read_at 記錄已讀時間
        end note
    }

    %% ==================== 專案藍圖狀態 ====================
    state "專案藍圖狀態機" as BlueprintStateMachine {
        BPPlanning: 📋 規劃中 (planning)
        BPActive: 🔨 進行中 (active)
        BPOnHold: ⏸️ 暫停 (on_hold)
        BPCompleted: ✅ 已完成 (completed)
        BPArchived: 📦 已歸檔 (archived)

        [*] --> BPPlanning: 建立專案
        BPPlanning --> BPActive: 開工
        BPActive --> BPOnHold: 暫停施工
        BPOnHold --> BPActive: 恢復施工
        BPActive --> BPCompleted: 專案竣工<br/>(進度 100%)
        BPCompleted --> BPArchived: 專案歸檔
        BPArchived --> [*]: 歸檔完成

        note right of BlueprintStateMachine
            注意：使用 on_hold 而非 paused
            (對齊 30-0-完整SQL表結構定義.md 定義)
        end note
    }

    %% ==================== 進度追蹤狀態 ====================
    state "進度追蹤狀態機" as ProgressStateMachine {
        ProgressInitialized: 🎯 已初始化 (initialized)
        ProgressUpdating: 🔄 更新中 (updating)
        ProgressComplete: ✅ 已完成 (complete)

        [*] --> ProgressInitialized: 初始化進度<br/>(Edge Function 計算)
        ProgressInitialized --> ProgressUpdating: 進度更新<br/>(任務完成/驗收通過/問題關閉觸發)
        ProgressUpdating --> ProgressUpdating: 重新計算<br/>(快取到 DB: progress_tracking)
        ProgressUpdating --> ProgressComplete: 100% 完成
        ProgressComplete --> [*]: 專案完成

        note right of ProgressStateMachine
            Realtime 廣播確保所有
            在線用戶即時看到進度更新
        end note
    }

    %% ==================== 文件狀態 ====================
    state "文件管理狀態機" as DocumentStateMachine {
        DocUploading: 📤 上傳中 (uploading)
        DocActive: ✅ 可用 (active)
        DocArchived: 📦 已歸檔 (archived)

        [*] --> DocUploading: 開始上傳<br/>(Storage 上傳中)
        DocUploading --> DocActive: 上傳完成<br/>(驗證檔案 + 儲存元資料到 DB: documents + RLS Policy)
        DocActive --> DocArchived: 歸檔文件
        DocArchived --> [*]: 保留記錄

        DocActive --> DocActive: 下載/分享
    }

    %% ==================== 用戶 Session 狀態 ====================
    state "用戶會話狀態機" as SessionStateMachine {
        SessionLogin: 🔓 已登入 (authenticated)
        SessionActive: ⚡ 活躍中 (active)
        SessionIdle: 😴 閒置中 (idle)
        SessionExpired: ⏰ 已過期 (expired)

        [*] --> SessionLogin: JWT 驗證通過<br/>(Supabase Auth + 載入 DB: accounts + RLS 權限檢查)
        SessionLogin --> SessionActive: 用戶操作<br/>(訂閱 Realtime)
        SessionActive --> SessionIdle: 無操作 15 分鐘
        SessionIdle --> SessionActive: 恢復操作
        SessionIdle --> SessionExpired: 超時 2 小時
        SessionActive --> SessionExpired: Token 過期
        SessionExpired --> [*]: 需重新登入
    }

    %% ==================== Pull Request 狀態 ====================
    state "Pull Request 狀態機" as PRStateMachine {
        PROpen: 📮 打開 (open)
        PRReviewing: 🔎 審核中 (reviewing)
        PRApproved: ✅ 已批准 (approved)
        PRRejected: ❌ 已拒絕 (rejected)
        PRMerged: 🔀 已合併 (merged)
        PRClosed: 🔒 已關閉 (closed)

        [*] --> PROpen: 建立 PR<br/>(DB: pull_requests<br/>提交執行數據)
        PROpen --> PRReviewing: 開始審查<br/>(DB: pull_request_reviews<br/>擁有者審核)
        PRReviewing --> PRApproved: 審查通過
        PRReviewing --> PRRejected: 審查拒絕<br/>(附加審查意見)
        PRReviewing --> PROpen: 請求修改
        PRApproved --> PRMerged: 合併主分支<br/>(Edge Function: branch-merge<br/>更新承攬欄位)
        PRRejected --> PROpen: 修改後重新提交
        PRMerged --> [*]: 合併完成<br/>(同步至主分支<br/>Realtime 更新)
        PROpen --> PRClosed: 關閉 PR
        PRRejected --> PRClosed: 關閉 PR

        note right of PRStateMachine
            PR 合併時：
            1. 更新 tasks.contractor_fields
            2. 調用 Edge Function branch-merge
            3. 同步至主分支 (Realtime)
            4. 記錄到 activity_logs
        end note
    }

    %% ==================== 協作者邀請狀態 ====================
    state "協作者邀請狀態機" as InvitationStateMachine {
        InvPending: 📬 待處理 (pending)
        InvAccepted: ✅ 已接受 (accepted)
        InvRejected: ❌ 已拒絕 (rejected)
        InvExpired: ⏰ 已過期 (expired)

        [*] --> InvPending: 發送協作邀請<br/>(DB: collaboration_invitations<br/>1:1 承攬關係)
        InvPending --> InvAccepted: 協作組織接受<br/>(分支啟用)
        InvPending --> InvRejected: 協作組織拒絕
        InvPending --> InvExpired: 邀請過期<br/>(自動過期處理)
        InvAccepted --> [*]: 建立協作關係<br/>(DB: organization_collaborations)
        InvRejected --> [*]: 邀請終止
        InvExpired --> [*]: 邀請失效

        note right of InvitationStateMachine
            邀請流程：
            1. 建立 Fork (branch_forks)
            2. 建立組織分支 (blueprint_branches)
            3. 發送協作邀請
            4. 接受後建立協作關係
        end note
    }

    %% ==================== 協作者關係狀態 ====================
    state "協作者關係狀態機" as CollaborationStateMachine {
        CollabPending: ⏳ 待處理 (pending)
        CollabActive: ✅ 活躍 (active)
        CollabSuspended: ⏸️ 已暫停 (suspended)
        CollabEnded: 🔒 已結束 (ended)

        [*] --> CollabPending: 建立協作關係<br/>(DB: organization_collaborations)
        CollabPending --> CollabActive: 協作啟用<br/>(分支啟用)
        CollabActive --> CollabSuspended: 暫停協作
        CollabSuspended --> CollabActive: 恢復協作
        CollabActive --> CollabEnded: 結束協作<br/>(合約到期或手動結束)
        CollabSuspended --> CollabEnded: 結束協作
        CollabEnded --> [*]: 協作終止

        note right of CollaborationStateMachine
            協作類型：
            - contractor (承攬)
            - subcontractor (分包)
            - consultant (顧問)
            - partner (合作夥伴)
        end note
    }

    %% ==================== 待辦中心狀態 ====================
    state "待辦中心狀態機" as TodoStateMachine {
        TodoPending: 🟦 待執行 (pending)
        TodoInProgress: 🔨 進行中 (in_progress)
        TodoStaging: 🟨 暫存中 (staging)
        TodoInQA: 🟧 品管中 (in_qa)
        TodoInInspection: 🟥 驗收中 (in_inspection)
        TodoCompleted: ✅ 已完成 (completed)
        TodoCancelled: ❌ 已取消 (cancelled)

        [*] --> TodoPending: 建立待辦<br/>(DB: personal_todos<br/>來自 tasks/issues/review_pr/qa_check/inspection)
        TodoPending --> TodoInProgress: 開始執行
        TodoInProgress --> TodoStaging: 提交完成<br/>(進入暫存區)
        TodoStaging --> TodoInQA: 確認提交<br/>(48小時內可撤回)
        TodoInQA --> TodoInInspection: 品管通過
        TodoInInspection --> TodoCompleted: 驗收通過
        TodoInProgress --> TodoCancelled: 取消待辦
        TodoPending --> TodoCancelled: 取消待辦
        TodoStaging --> TodoInProgress: 撤回修正<br/>(48小時內)
        TodoInQA --> TodoInProgress: 品管不通過<br/>(返工)
        TodoInInspection --> TodoInProgress: 驗收不通過<br/>(返工)
        TodoCompleted --> [*]: 待辦完成
        TodoCancelled --> [*]: 待辦終止

        note right of TodoStateMachine
            待辦類型 (todo_type)：
            - task (任務)
            - issue (問題)
            - review_pr (PR 審查)
            - qa_check (品質檢查)
            - inspection (驗收)
            - custom (自訂)

            待辦狀態追蹤：
            DB: todo_status_tracking
        end note
    }

    %% ==================== 狀態機之間的關聯 ====================
    TaskStateMachine --> QualityCheckStateMachine: 任務提交後進入品質檢查
    QualityCheckStateMachine --> InspectionStateMachine: 品質檢查通過後進入驗收
    InspectionStateMachine --> IssueStateMachine: 驗收不通過開立問題
    TaskStateMachine --> ReportStateMachine: 施工中提交日報
    TaskStateMachine --> ProgressStateMachine: 任務狀態變更觸發進度更新
    QualityCheckStateMachine --> ProgressStateMachine: 品質檢查通過觸發進度更新
    InspectionStateMachine --> ProgressStateMachine: 驗收通過觸發進度更新
    IssueStateMachine --> ProgressStateMachine: 問題關閉觸發進度更新
    TaskStateMachine --> NotificationStateMachine: 狀態變更產生通知
    QualityCheckStateMachine --> NotificationStateMachine: 品質檢查結果通知
    InspectionStateMachine --> NotificationStateMachine: 驗收結果通知
    IssueStateMachine --> NotificationStateMachine: 問題處理通知
    PRStateMachine --> NotificationStateMachine: PR 狀態變更通知
    InvitationStateMachine --> NotificationStateMachine: 邀請狀態變更通知
    CollaborationStateMachine --> NotificationStateMachine: 協作關係變更通知
    TaskStateMachine --> TodoStateMachine: 任務狀態同步到待辦中心
    IssueStateMachine --> TodoStateMachine: 問題狀態同步到待辦中心
    PRStateMachine --> TodoStateMachine: PR 審查同步到待辦中心
    QualityCheckStateMachine --> TodoStateMachine: 品質檢查同步到待辦中心
    InspectionStateMachine --> TodoStateMachine: 驗收同步到待辦中心
    PRStateMachine --> ProgressStateMachine: PR 合併觸發進度更新
    InvitationStateMachine --> CollaborationStateMachine: 邀請接受後建立協作關係

    note right of TaskStateMachine
        所有狀態變更都會：
        1. 觸發 DB Trigger 記錄到 activity_logs
        2. 透過 Realtime 廣播給訂閱者
        3. 產生對應的 notifications
    end note

    note right of QualityCheckStateMachine
        品質檢查不通過時：
        1. 自動開立 Issue (Edge Function)
        2. 透過 Edge Function 發送通知
        3. 任務狀態回退到 in_progress
        4. 檢查照片儲存到 Storage
    end note

    note right of InspectionStateMachine
        驗收不通過時：
        1. 任務狀態回退到 in_progress
        2. 責任轉移標記為 FALSE
        3. 驗收照片儲存到 Storage
        4. 通知相關人員
    end note

    note right of IssueStateMachine
        問題處理過程中：
        1. 可在 comments 表討論
        2. 可上傳處理照片到 Storage
        3. 所有變更即時同步 Realtime
        4. Edge Function 處理通知邏輯
    end note

    note right of ProgressStateMachine
        進度更新觸發時機：
        1. 任務完成 (TaskCompleted)
        2. 品質檢查通過 (QCPassed)
        3. 驗收通過 (InspectionAccepted)
        4. 問題關閉 (IssueClosed)
        5. PR 合併 (PRMerged)
        6. Edge Function 計算並快取
        7. Realtime 即時廣播
    end note

    note right of PRStateMachine
        PR 審查流程：
        1. 協作組織提交 PR (提交執行數據)
        2. 擁有者審查變更
        3. 批准後合併到主分支
        4. 更新 tasks.contractor_fields
        5. 同步至主分支 (Realtime)
    end note

    note right of InvitationStateMachine
        協作邀請流程：
        1. 建立 Fork (1:1 承攬關係)
        2. 建立組織分支
        3. 發送協作邀請
        4. 協作組織接受/拒絕
        5. 接受後建立協作關係
    end note

    note right of CollaborationStateMachine
        協作關係管理：
        1. 支援多種協作類型
        2. 可暫停和恢復協作
        3. 合約期限管理
        4. 協作狀態追蹤
    end note

    note right of TodoStateMachine
        待辦中心聚合：
        1. 聚合多種來源的待辦事項
        2. 狀態與來源實體同步
        3. 支援狀態追蹤歷史
        4. 五種狀態分類對應不同階段
    end note
```
