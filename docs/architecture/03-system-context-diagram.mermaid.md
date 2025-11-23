# 系統上下文圖 (System Context Diagram)

> 🎯 展示系統與外部實體的互動邊界 - 採用 C4 Model Level 1

**最後更新**: 2025-11-17
**用途**: AI Agent 理解系統邊界與外部依賴

- --

```mermaid
C4Context
    title 系統上下文圖 - 工地管理系統 (Construction Management System)

    %% ==================== 用戶角色 ====================
    Person(pm, "專案經理", "規劃藍圖、指派任務、審核 PR")
    Person(supervisor, "工地主任", "日報、現場管理、協調")
    Person(worker, "施工人員", "執行任務、回報進度")
    Person(qc, "品管人員", "驗收、開立問題")
    Person(observer, "觀察者", "唯讀查看")

    %% ==================== 核心系統 ====================
    System(cms, "工地管理系統", "Git-like 分支模型<br/>任務管理 | 品質驗收<br/>問題追蹤 | 協作溝通<br/>13 維度任務 | 51 表架構")

    %% ==================== 外部系統 ====================
    System_Ext(supabase, "Supabase Platform", "PostgreSQL 15 + Auth<br/>Storage + Realtime<br/>Edge Functions + PostgREST")

    System_Ext(weather, "天氣 API", "OpenWeather | WeatherAPI<br/>工地天氣資訊")

    System_Ext(email, "郵件服務", "SendGrid | AWS SES<br/>通知郵件發送")

    System_Ext(oauth, "OAuth 提供商", "Google | GitHub<br/>第三方登入")

    System_Ext(cdn, "CDN 服務", "Cloudflare<br/>檔案加速分發")

    System_Ext(backup, "備份服務", "AWS S3<br/>定期資料備份")

    %% ==================== 關係定義 ====================
    Rel(pm, cms, "管理藍圖、審核 PR", "HTTPS/WSS")
    Rel(supervisor, cms, "提交日報、協調問題", "HTTPS/WSS")
    Rel(worker, cms, "執行任務、上傳照片", "HTTPS/WSS")
    Rel(qc, cms, "品質驗收、追蹤問題", "HTTPS/WSS")
    Rel(observer, cms, "查看進度報表", "HTTPS")

    Rel(cms, supabase, "資料存取 + 即時通訊", "PostgreSQL/REST/WSS")
    Rel(cms, weather, "查詢天氣 (Edge Function)", "HTTPS/REST")
    Rel(cms, email, "發送通知 (Edge Function)", "SMTP/API")
    Rel(cms, oauth, "第三方登入驗證", "OAuth 2.0")

    Rel(supabase, cdn, "檔案快取分發", "HTTPS")
    Rel(supabase, backup, "定期備份", "S3 Protocol")

    UpdateLayoutConfig($c4ShapeInRow="4", $c4BoundaryInRow="2")
```

- --

## 🔑 關鍵要點

### 系統定位
- **13 維度任務管理**: 任務本體、時間、關聯、空間、資源、進度、成本、品質、風險、安全、文件、溝通、變更
- **Git-like 分支模型**: 主分支(擁有者) + 組織分支(協作) + PR 機制
- **51 張表 / 11 模組**: 帳戶、協作、權限、藍圖、任務、驗收、問題、溝通、分析、機器人、系統
- **技術棧**: Angular 20.3 + NG-ZORRO 20.3 + NG-ALAIN 20.1 + Supabase

### 外部依賴
- **Supabase**: 核心後端平台 (Database + Auth + Storage + Realtime + Edge Functions)
- **天氣 API**: Edge Function 調用 + weather_cache 快取
- **郵件服務**: 任務通知、問題通知、驗收結果
- **OAuth**: Google/GitHub 登入
- **CDN**: Storage 檔案加速
- **備份**: 每日增量 + 每週完整

### 用戶角色
- **專案經理**: 建立藍圖、管理權限、審核 PR
- **工地主任**: 日報、現場協調
- **施工人員**: 執行任務、回報進度
- **品管人員**: 驗收檢查、開立問題
- **觀察者**: 唯讀查看
