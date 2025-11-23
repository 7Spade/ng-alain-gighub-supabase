# 系統架構思維導圖

> 📋 **目的**：展示系統整體架構的思維導圖，包含身份認證、資料庫架構、業務模組等核心組件

**最後更新**：2025-01-15
**維護者**：開發團隊
**狀態圖對齊**：✅ 與 14-狀態圖.mermaid.md v2.0 完全對齊

- --

```mermaid
mindmap
  root((🏗️ 工地管理系統<br/>Supabase Architecture))
    🔐 **身份認證層**
      Supabase Auth
        JWT Token 驗證
        多種登入方式
          Email/Password
          OAuth (Google, GitHub)
          Magic Link
        Session 管理
      帳戶系統 (accounts)
        統一身份抽象
          用戶 User
          機器人 Bot
          組織 Organization
        組織管理
          團隊 Team
            成員管理
            角色分配
          組織排班 (organization_schedules)
            跨藍圖成員調派
            天氣資訊整合
        組織協作 (organization_collaborations)
          1:1 承攬關係
          協作邀請
          協作成員管理

    🔒 **權限控制層**
      Row Level Security
        PostgreSQL RLS Policies
        基於 JWT Claims
        細粒度存取控制
      角色系統
        預設角色
          專案經理
          工地主任
          施工人員
          品管人員
          觀察者
        自訂角色
      權限矩陣
        資源權限
          讀取 Read
          寫入 Write
          刪除 Delete
          管理 Admin
        分支權限 (branch_permissions)
          擁有者：全權控制
          協作組織：僅操作承攬欄位
          查看者：唯讀

    🎯 **專案藍圖層 (Git-like 分支模型)**
      藍圖 Blueprints
        主分支 Main Branch
          擁有者組織控制
          任務結構完全控制
          專案資訊管理
          狀態管理
        組織分支 Organization Branch
          Fork 機制
          1:1 承攬關係
          只能操作承攬欄位
          不可修改任務結構
        Pull Request
          提交執行數據
          擁有者審核
          合併更新承攬欄位
        專案設定
          工作日曆
          通知規則
          自訂欄位
        擁有權
          個人專案
          組織專案
          團隊協作

    📋 **任務執行模組**
      任務管理 (tasks)
        任務建立
          僅藍圖擁有者
          樹狀結構
          無層級限制
          標題/描述
          優先級
          預估工時
        任務指派
          個人/團隊/組織/承攬
          負責人
          協作人員
          Realtime 通知
        任務列表
          按指派對象分類
          待辦中心聚合
        暫存區 (task_staging)
          48 小時可撤回
          分階段確認
        狀態追蹤
          待處理
          進行中
          暫存中
          品管中
          驗收中
          已完成
          已取消
      每日報表 (daily_reports)
        工作摘要
        工作時數
        工人數量
        施工照片
          Storage 儲存
          EXIF 資料
        天氣記錄
          Edge Function API
          快取機制
      品質驗收 (quality_checks)
        檢查項目
          Checklist
          評分標準
        驗收流程
          待驗收
          檢查中
          通過/不通過
        驗收照片
          前/中/後對比
          缺陷記錄
        自動觸發
          開立問題
          更新進度
      最終驗收 (inspections)
        責任切割
        驗收類型
          初步驗收
          最終驗收
          保固驗收
          移交驗收
        責任轉移記錄
      進度儀表板
        視覺化圖表
        完成率統計
        Edge Function 計算
        Materialized Views

    ⚠️ **異常處理模組**
      問題追蹤 (issues)
        問題開立
          來源
            手動回報
            驗收不合格
            系統檢測
          嚴重程度
            低/中/高/緊急
        問題指派
          處理人員
          審核人員
          Edge Function 通知
        處理流程
          新建
          指派
          處理中
          已解決
          已關閉
          重新開啟
        問題照片
          Storage 儲存
          問題追蹤
        跨分支同步 (issue_sync_logs)
          即時同步至主分支
          所有分支問題統一可見
          Realtime 訂閱
          即時更新

    💬 **協作溝通模組**
      討論區 (comments)
        留言功能
          巢狀回覆
          @提及功能
        即時訊息
          Realtime 廣播
          已讀狀態
        關聯實體
          任務討論
          問題討論
          PR 討論
          驗收討論
          一般討論
      通知中心 (notifications)
        通知類型
          任務通知
          問題通知
          留言通知
          PR 狀態通知
          系統通知
        通知規則 (notification_rules)
          站內/Email/推播
          用戶自訂規則
          通知訂閱
        推送機制
          Realtime 推送
          Email 通知 (Edge Function)
          瀏覽器推送
        已讀管理
      待辦中心 (personal_todos)
        個人待辦
        五種狀態分類
          🟦 待執行
          🟨 暫存中
          🟧 品管中
          🟥 驗收中
          ⚠️ 問題追蹤
        任務關聯
        問題關聯
        優先級管理
        狀態追蹤歷史
        Realtime 同步

    📊 **資料分析模組**
      文件管理
        Storage Buckets
          images/
            施工照片
            驗收照片
            問題照片
          documents/
            合約文件
            工程圖
            報表文件
          drawings/
            CAD 圖檔
            施工圖
        文件元資料 (documents)
          檔案資訊
          上傳者
          權限控制
          軟刪除 (30天)
        版本控制 (document_versions)
          版本歷史
          變更描述
        圖片縮圖 (document_thumbnails)
          自動生成
          多尺寸快取
      活動記錄 (activity_logs)
        自動記錄
          Database Triggers
          所有操作
        集中記錄
          所有分支同步到主分支
          擁有者全局掌控
        記錄內容
          操作類型
          變更內容
          時間戳記
          IP/User Agent
        審計追蹤
      數據分析
        統計報表
          主分支報表
          分支報表
          跨分支總覽
          Edge Function 計算
          複雜聚合
        分析快取 (analytics_cache)
          預計算報表
          多層級聚合
          快取過期策略
        圖表視覺化
          前端渲染
          互動式圖表
        效能優化
          Materialized Views
          定期更新
          快取策略

    ⚙️ **系統管理模組**
      系統設定 (settings)
        全域設定
        專案設定
        個人偏好
      功能開關 (feature_flags)
        灰度發布
        A/B 測試
        目標帳戶/組織
      天氣整合
        第三方 API
          Edge Function 調用
        資料快取
          weather_cache 表
          減少 API 調用
        顯示整合
          日報天氣
          工地環境
      機器人系統 (bots)
        定期報表機器人
        通知機器人
        備份機器人
        任務佇列 (bot_tasks)
        執行日誌 (bot_execution_logs)
      備份還原
        PostgreSQL 備份
        Storage 備份
        自動化備份

    ⚡ **Supabase 核心服務**
      PostgreSQL Database
        關聯式資料庫
        ACID 保證
        索引優化
        Foreign Keys
        Database Triggers
        Materialized Views
      Supabase Storage
        物件儲存
        Bucket 管理
        存取控制
        CDN 加速
      Realtime
        WebSocket 連接
        Database 變更訂閱
        Broadcast 廣播
        Presence 狀態
      Edge Functions
        Deno Runtime
        無伺服器運算
        第三方 API 整合
        複雜業務邏輯
        背景任務
      Row Level Security
        PostgreSQL 原生
        政策定義
        JWT 整合
        多租戶支援
```

- --

## 相關文檔

- [狀態圖](./14-狀態圖.mermaid.md) - 狀態流轉視覺化
- [狀態枚舉值定義](./36-狀態枚舉值定義.md) - 狀態定義單一真實來源
- [業務流程圖](./04-業務流程圖.mermaid.md) - 業務流程視覺化
- [領域事件時間軸圖](./15-領域事件時間軸圖.mermaid.md) - 領域事件時間軸
