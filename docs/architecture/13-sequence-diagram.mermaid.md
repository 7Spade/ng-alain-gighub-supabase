# 序列圖（Sequence Diagram）

> 📋 **目的**：展示系統關鍵流程的時序交互，包含用戶操作、服務調用、資料庫查詢等步驟

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

```mermaid
sequenceDiagram
    actor User as 👤 用戶
    participant App as 📱 前端應用
    participant Auth as 🔐 Supabase Auth
    participant DB as 🗄️ PostgreSQL
    participant RLS as 🔒 RLS / Branch Roles
    participant RT as ⚡ Realtime
    participant Edge as ⚙️ Edge Function
    participant Storage as 📦 Storage

    %% ==================== 登入流程 ====================
    rect rgb(200, 230, 255)
    note right of User: 登入驗證流程
    User->>App: 輸入帳號密碼
    App->>Auth: signIn(email, password)
    Auth->>Auth: 驗證憑證
    Auth-->>App: JWT Token + User Data
    App->>DB: 查詢用戶資料 (accounts)
    DB->>RLS: 檢查角色 + branch_roles
    RLS-->>DB: JWT Claims 注入 (role, branch scope)
    DB-->>App: 返回用戶完整資料
    App-->>User: 顯示儀表板
    end

    %% ==================== Git-like 分支流程 ====================
    rect rgb(255, 248, 220)
    note right of User: Fork / PR / Merge
    User->>App: Fork 任務
    App->>DB: INSERT branch_forks
    DB-->>App: Fork 建立完成
    App->>DB: INSERT blueprint_branches
    DB-->>App: 分支 ID

    User->>App: 邀請協作組織
    App->>DB: INSERT organization_collaborations
    DB-->>App: 等待回覆

    User->>App: 提交 Pull Request
    App->>DB: INSERT pull_requests
    DB->>RT: 廣播 PR 建立
    RT-->>App: 擁有者收到通知

    Reviewer->>App: 審查 PR
    App->>DB: INSERT pull_request_reviews
    App->>Edge: 呼叫 branch-merge 函數 (若 approved)
    Edge->>DB: UPDATE blueprint 主分支欄位
    Edge->>RT: 推送合併結果
    end

    %% ==================== 建立任務並即時通知 ====================
    rect rgb(255, 240, 200)
    note right of User: 任務建立與通知
    User->>App: 建立新任務
    App->>DB: INSERT INTO tasks
    DB->>DB: TRIGGER: 記錄到 activity_logs
    DB->>RT: 廣播任務建立事件
    RT-->>App: Realtime 推送更新

    App->>DB: INSERT INTO notifications
    DB->>RT: 廣播通知事件
    RT-->>App: 推送給被指派人員
    App-->>User: 顯示任務建立成功
    end

    %% ==================== 暫存區 + 每日報表流程 ====================
    rect rgb(200, 255, 230)
    note right of User: 暫存 48h + 每日報表
    User->>App: 提交施工成果
    App->>DB: INSERT INTO staging_submissions
    DB-->>App: 回傳暫存 ID (48h 可撤回)
    alt 48h 內撤回
        User->>App: 撤回提交
        App->>DB: UPDATE staging_submissions (recalled=true)
        DB-->>App: 撤回成功
    else 確認提交
        App->>DB: UPDATE staging_submissions (finalized=true)
        User->>App: 上傳施工照片
    end

    App->>Storage: 上傳到 images/ bucket
    Storage-->>App: 返回檔案 URL

    App->>Edge: 調用天氣 API
    Edge->>Edge: 查詢第三方天氣服務
    Edge->>DB: 快取天氣資料 (weather_cache)
    Edge-->>App: 返回天氣資訊

    App->>DB: INSERT INTO daily_reports
    DB->>DB: TRIGGER: activity_logs
    DB->>RT: 廣播報表提交事件
    RT-->>App: 即時更新給相關人員
    App-->>User: 報表提交成功
    end

    %% ==================== 品質驗收流程 ====================
    rect rgb(255, 230, 240)
    note right of User: 品質驗收檢查
    User->>App: 提交驗收申請
    App->>DB: INSERT INTO quality_checks
    DB->>RT: 通知驗收人員
    RT-->>App: 推送給品管人員

    User->>App: 上傳驗收照片
    App->>Storage: 上傳到 images/ bucket
    Storage-->>App: 返回照片 URL

    App->>DB: UPDATE quality_checks (status='completed')

    alt 驗收不合格
        DB->>DB: INSERT INTO issues (自動開立問題)
        DB->>Edge: 觸發通知邏輯
        Edge->>DB: INSERT INTO notifications
        DB->>RT: 廣播問題事件
        RT-->>App: 推送給相關人員
    else 驗收合格
        DB->>Edge: 觸發進度計算
        Edge->>Edge: 計算專案完成度
        Edge->>DB: UPDATE progress_tracking
        DB->>RT: 廣播進度更新
        RT-->>App: 即時更新儀表板
    end

    App-->>User: 顯示驗收結果
    end

    %% ==================== 問題追蹤流程 ====================
    rect rgb(255, 220, 200)
    note right of User: 問題處理流程
    User->>App: 開立新問題
    App->>DB: INSERT INTO issues
    DB->>DB: INSERT INTO issue_assignments

    DB->>Edge: 觸發通知邏輯
    Edge->>Edge: 判斷通知對象與內容
    Edge->>DB: INSERT INTO notifications
    DB->>RT: 廣播問題開立事件
    RT-->>App: 推送給處理人員

    User->>App: 在討論區留言
    App->>DB: INSERT INTO comments
    DB->>RT: 即時廣播留言
    RT-->>App: 其他人即時收到訊息

    User->>App: 上傳處理照片
    App->>Storage: 上傳檔案
    Storage-->>App: 返回 URL
    App->>DB: UPDATE issues (attach photo URL)

    User->>App: 關閉問題
    App->>DB: UPDATE issues (status='closed')
    DB->>Edge: 觸發結案通知
    Edge->>DB: INSERT INTO notifications
    DB->>RT: 廣播問題關閉事件
    RT-->>App: 通知相關人員
    App-->>User: 問題已結案
    end

    %% ==================== 數據分析查詢 ====================
    rect rgb(230, 230, 255)
    note right of User: 數據分析報表
    User->>App: 請求統計報表
    App->>Edge: 調用分析函數
    Edge->>DB: 查詢 Materialized Views
    DB-->>Edge: 返回聚合數據
    Edge->>Edge: 計算統計指標
    Edge-->>App: 返回分析結果
    App-->>User: 顯示圖表與報表
    end

    %% ==================== Realtime 訂閱機制 ====================
    rect rgb(240, 255, 240)
    note right of User: Realtime 持續訂閱
    App->>RT: 訂閱 tasks 表變更
    App->>RT: 訂閱 issues 表變更
    App->>RT: 訂閱 comments 表變更
    App->>RT: 訂閱 notifications 表變更

    loop 持續監聽
        RT-->>App: 推送資料變更事件
        App-->>User: 即時更新 UI
    end
    end
