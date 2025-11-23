# 容器圖 (Container Diagram)

> 🎯 展示系統容器級架構 - 採用 C4 Model Level 2

**最後更新**: 2025-11-17
**用途**: AI Agent 理解系統內部容器與職責

- --

```mermaid
C4Container
    title 容器圖 - 工地管理系統容器架構

    Person(user, "系統用戶", "PM/主任/施工/品管")

    System_Boundary(app, "應用層") {
        Container(web, "Web 應用", "Angular 20.3<br/>NG-ZORRO 20.3<br/>NG-ALAIN 20.1", "Standalone Components<br/>Signals 響應式<br/>PWA 支援")

        Container(mobile, "移動應用", "PWA", "離線支援<br/>相機整合<br/>推送通知")
    }

    System_Boundary(supabase, "Supabase 平台") {
        ContainerDb(db, "PostgreSQL 15", "Database", "51 張表<br/>RLS 權限<br/>Triggers<br/>Materialized Views")

        Container(auth, "Supabase Auth", "GoTrue", "JWT Token<br/>OAuth 整合<br/>Session 管理")

        Container(storage, "Storage", "S3-compatible", "images/ bucket<br/>documents/ bucket<br/>drawings/ bucket<br/>CDN 加速")

        Container(realtime, "Realtime", "WebSocket", "Database 變更訂閱<br/>Broadcast 廣播<br/>Presence 狀態")

        Container(edge, "Edge Functions", "Deno Runtime", "weather-api<br/>notification-handler<br/>progress-calculator<br/>analytics-processor<br/>report-generator")

        Container(postgrest, "PostgREST", "REST API", "自動 CRUD<br/>RLS 整合<br/>JWT 驗證")
    }

    System_Ext(weather, "天氣 API", "OpenWeather")
    System_Ext(email, "SMTP", "SendGrid")
    System_Ext(oauth_ext, "OAuth", "Google/GitHub")
    System_Ext(cdn_ext, "CDN", "Cloudflare")
    ContainerDb_Ext(redis, "Redis", "快取層 (可選)")

    Rel(user, web, "HTTPS/WSS")
    Rel(user, mobile, "HTTPS/PWA")

    Rel(web, auth, "身份驗證", "HTTPS/REST")
    Rel(web, postgrest, "資料存取", "HTTPS/REST+JWT")
    Rel(web, storage, "檔案操作", "HTTPS/REST")
    Rel(web, realtime, "即時訂閱", "WSS")
    Rel(web, edge, "調用函數", "HTTPS")

    Rel(mobile, auth, "HTTPS/REST")
    Rel(mobile, postgrest, "HTTPS/REST+JWT")
    Rel(mobile, storage, "HTTPS/REST")
    Rel(mobile, realtime, "WSS")

    Rel(auth, db, "SQL")
    Rel(auth, oauth_ext, "OAuth 2.0")

    Rel(postgrest, db, "SQL+RLS")

    Rel(storage, db, "SQL")
    Rel(storage, cdn_ext, "HTTPS")

    Rel(realtime, db, "Logical Replication")

    Rel(edge, db, "SQL")
    Rel(edge, weather, "HTTPS/REST")
    Rel(edge, email, "SMTP/API")
    Rel(edge, redis, "Redis Protocol")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="2")
```

- --

## 🔑 容器職責

### 應用層

#### Web 應用 (Angular 20.3)
- **架構**: Standalone Components + Signals
- **UI**: NG-ZORRO 20.3 + NG-ALAIN 20.1
- **狀態**: Angular Signals + RxJS 7.8
- **特性**:
  - 新控制流語法 (@if/@for/@switch/@defer)
  - Typed Forms 型別安全
  - Lazy Loading 模組
  - PWA 離線支援

#### 移動應用 (PWA)
- **技術**: Progressive Web App
- **能力**:
  - 離線優先 (Service Worker)
  - 相機 API (拍照上傳)
  - 推送通知 (Web Push)
  - 安裝到主畫面

### Supabase 平台

#### PostgreSQL 15
- **資料**: 51 張表 / 11 模組
- **安全**: Row Level Security (RLS)
- **效能**:
  - B-Tree/GiST 索引
  - Materialized Views (進度聚合)
  - Triggers (自動化)
- **擴展**: pgvector, postgis

#### Supabase Auth
- **認證**: Email/Password, OAuth, Magic Link
- **授權**: JWT Token + Claims
- **整合**: RLS 無縫整合

#### Storage
- **架構**: S3-compatible Object Storage
- **Buckets**: images/, documents/, drawings/
- **功能**:
  - RLS 權限控制
  - 圖片轉換 (WebP)
  - CDN 加速
  - 版本管理

#### Realtime
- **協議**: WebSocket
- **功能**:
  - Database Changes (INSERT/UPDATE/DELETE)
  - Broadcast (自訂訊息)
  - Presence (線上狀態)
- **應用**:
  - 任務即時更新
  - 通知推送
  - 討論區訊息

#### Edge Functions
- **運行時**: Deno Runtime
- **函數**:
  - `weather-api`: 天氣整合 + 快取
  - `notification-handler`: 通知邏輯
  - `progress-calculator`: 進度計算
  - `analytics-processor`: 數據分析
  - `report-generator`: 報表生成

#### PostgREST
- **功能**: PostgreSQL → REST API
- **特性**:
  - 自動 CRUD 端點
  - 複雜查詢 (filter/order/join)
  - RLS 自動應用
  - JWT 驗證

### 外部服務

#### Redis (可選)
- **用途**: 天氣快取、Session、熱點資料
- **優勢**: 減少 DB 查詢壓力

#### 天氣 API
- **服務**: OpenWeather / WeatherAPI.com
- **調用**: Edge Function 封裝
- **快取**: weather_cache 表 (TTL: 6h)

#### SMTP 服務
- **服務**: SendGrid / AWS SES
- **用途**: 任務通知、問題通知、驗收結果

#### OAuth 提供商
- **支援**: Google, GitHub
- **整合**: Supabase Auth 配置

#### CDN
- **服務**: Cloudflare CDN
- **快取**: Storage 檔案加速

- --

## 🔄 資料流

```text
                  ↓
            Edge Functions ← 第三方 API
                  ↓
            Realtime → WebSocket 推送
                  ↓
            Storage → CDN 分發
```

## 🧪 開發環境

- **測試**: Playwright E2E
- **CI/CD**: GitHub Actions
- **品質**: ESLint + Prettier (零警告)
- **部署**: Supabase Hosting / Cloudflare Pages
