# 部署基礎設施視圖（Deployment Diagram）

## 📑 目錄

- [部署架構詳細說明](#部署架構詳細說明)
  - [前端部署層](#前端部署層)
    - [Hosting Platform (Supabase Hosting / CDN)](#hosting-platform-supabase-hosting--cdn)
    - [CDN 邊緣節點](#cdn-邊緣節點)
  - [後端部署層 (Supabase Cloud)](#後端部署層-supabase-cloud)
    - [Database 叢集](#database-叢集)
    - [Auth 服務](#auth-服務)
    - [Storage 叢集](#storage-叢集)
    - [Realtime 叢集](#realtime-叢集)
    - [Edge Functions](#edge-functions)
  - [備份與災難復原](#備份與災難復原)
    - [備份策略](#備份策略)
    - [災難復原 (DR)](#災難復原-dr)
  - [監控與可觀測性](#監控與可觀測性)
    - [監控堆疊](#監控堆疊)
    - [儀表板](#儀表板)
  - [外部服務整合](#外部服務整合)
    - [天氣 API](#天氣-api)
    - [郵件服務](#郵件服務)
    - [OAuth 服務](#oauth-服務)
  - [網路與安全](#網路與安全)
    - [SSL/TLS](#ssltls)
    - [DDoS 防護](#ddos-防護)
    - [網路隔離](#網路隔離)
  - [擴展策略](#擴展策略)
    - [水平擴展](#水平擴展)
    - [垂直擴展](#垂直擴展)
    - [效能優化](#效能優化)
- [部署環境](#部署環境)
  - [開發環境](#開發環境)
  - [測試環境](#測試環境)
  - [生產環境](#生產環境)
- [部署流程](#部署流程)
  - [前置檢查](#前置檢查)
  - [Supabase 遷移](#supabase-遷移)
  - [部署步驟](#部署步驟)
- [客戶端裝置](#客戶端裝置)
- [災難恢復路徑](#災難恢復路徑)
- [監控指標](#監控指標)
- [維護作業](#維護作業)

---


> 📋 **目的**：展示系統的部署架構，包含 Vercel 前端部署、Supabase 後端服務等基礎設施配置

**最後更新**：2025-11-16
**維護者**：開發團隊

- --

```mermaid
C4Deployment
    title 部署基礎設施視圖 - 工地管理系統

    Deployment_Node(client, "客戶端裝置", "User Devices") {
        Container(browser, "Web 瀏覽器", "Chrome/Safari/Firefox", "存取 Web 應用")
        Container(mobile, "移動裝置", "iOS/Android", "PWA 應用")
    }

    Deployment_Node(cdn_edge, "CDN 邊緣節點", "Cloudflare/Supabase CDN") {
        Container(edge_cache, "邊緣快取", "CDN Cache", "靜態資源<br/>圖片優化<br/>Angular 應用快取")
    }

    Deployment_Node(hosting_platform, "Hosting Platform", "Supabase/CDN") {
        Deployment_Node(angular_app, "Angular 應用", "Static Site") {
            Container(angular_app, "Web 應用", "Angular 20.3.x", "- Standalone Components<br/>- Signals<br/>- Static Site<br/>- CDN 部署")
        }

        Container(hosting_analytics, "Analytics", "Monitoring", "效能監控<br/>錯誤追蹤")
    }

    Deployment_Node(supabase_cloud, "Supabase Cloud", "Multi-Region") {
        Deployment_Node(db_cluster, "Database 叢集", "PostgreSQL HA") {
            ContainerDb(primary_db, "主資料庫", "PostgreSQL 15", "讀寫操作<br/>RLS Policy<br/>Triggers")
            ContainerDb(replica_db, "只讀副本", "PostgreSQL 15", "讀取分流<br/>查詢優化")
        }

        Deployment_Node(auth_service, "Auth 服務", "GoTrue Cluster") {
            Container(auth_primary, "Auth Server", "GoTrue", "JWT 簽發<br/>Session 管理")
            Container(auth_replica, "Auth Replica", "GoTrue", "負載均衡")
        }

        Deployment_Node(storage_cluster, "Storage 叢集", "S3-Compatible") {
            Container(storage_bucket, "Object Storage", "Buckets", "images/<br/>documents/<br/>drawings/")
            Container(storage_cdn, "Storage CDN", "CDN", "全球加速<br/>圖片轉換")
        }

        Deployment_Node(realtime_cluster, "Realtime 叢集", "WebSocket Cluster") {
            Container(realtime_server, "Realtime Server", "Phoenix", "WebSocket 連線<br/>訂閱管理")
            Container(presence_server, "Presence Server", "Phoenix", "線上狀態")
        }

        Deployment_Node(edge_function_runtime, "Edge Functions", "Deno Deploy") {
            Container(weather_func, "天氣函數", "Deno", "天氣 API 整合")
            Container(notification_func, "通知函數", "Deno", "郵件/推送通知")
            Container(analytics_func, "分析函數", "Deno", "數據處理")
        }

        Container(postgrest_api, "PostgREST", "REST Gateway", "自動 API<br/>RLS 整合")
    }

    Deployment_Node(backup_infra, "備份基礎設施", "AWS/GCP") {
        ContainerDb(backup_storage, "備份儲存", "S3/GCS", "每日備份<br/>週期歸檔<br/>災難復原")
        Container(backup_scheduler, "備份排程", "Cron", "自動備份任務")
    }

    Deployment_Node(monitoring_stack, "監控堆疊", "Observability") {
        Container(metrics, "指標收集", "Prometheus", "系統指標<br/>業務指標")
        Container(logs, "日誌聚合", "Grafana Loki", "集中式日誌")
        Container(traces, "鏈路追蹤", "OpenTelemetry", "請求追蹤")
        Container(alerts, "告警系統", "Alertmanager", "異常告警")
    }

    Deployment_Node(external_services, "外部服務", "Third Party") {
        Container(weather_api_service, "天氣 API", "OpenWeather", "天氣資料")
        Container(email_service, "郵件服務", "SendGrid", "通知郵件")
        Container(oauth_services, "OAuth 服務", "Google/GitHub", "社交登入")
    }

    Rel(browser, edge_cache, "HTTPS", "訪問應用")
    Rel(mobile, edge_cache, "HTTPS", "訪問應用")

    Rel(edge_cache, angular_app, "未命中", "動態內容")

    Rel(angular_app, postgrest_api, "資料請求", "HTTPS/REST + JWT")
    Rel(angular_app, auth_primary, "認證請求", "HTTPS")
    Rel(angular_app, storage_bucket, "檔案操作", "HTTPS")
    Rel(browser, realtime_server, "即時連線", "WebSocket")
    Rel(mobile, realtime_server, "即時連線", "WebSocket")

    Rel(postgrest_api, primary_db, "查詢", "SQL")
    Rel(postgrest_api, replica_db, "讀取", "SQL")

    Rel(auth_primary, primary_db, "用戶資料", "SQL")
    Rel(auth_primary, oauth_services, "OAuth", "HTTPS")

    Rel(realtime_server, primary_db, "訂閱變更", "Logical Replication")

    Rel(weather_func, weather_api_service, "API 調用", "HTTPS")
    Rel(notification_func, email_service, "發送郵件", "SMTP/API")
    Rel(weather_func, primary_db, "快取寫入", "SQL")

    Rel(primary_db, replica_db, "複製", "Streaming Replication")

    Rel(backup_scheduler, primary_db, "備份", "pg_dump")
    Rel(backup_scheduler, storage_bucket, "備份", "S3 Protocol")
    Rel(backup_scheduler, backup_storage, "儲存", "S3 Protocol")

    Rel(metrics, supabase_cloud, "收集指標", "Prometheus Protocol")
    Rel(logs, supabase_cloud, "收集日誌", "Log Shipper")
    Rel(traces, angular_app, "追蹤", "OTLP")
    Rel(alerts, metrics, "告警規則", "HTTP")

    Rel(storage_cdn, storage_bucket, "回源", "HTTPS")
    Rel(edge_cache, storage_cdn, "圖片", "HTTPS")
```

## 部署架構詳細說明

### 前端部署層

#### Hosting Platform (Supabase Hosting / CDN)
- **地理分佈**: 全球 CDN 節點
- **Angular 應用**:
  - 建置: 靜態網站 (Static Site)
  - Angular 20.3.x Standalone Components
  - NG-ZORRO 20.3.x + NG-ALAIN 20.1.x
  - Signals 響應式狀態
  - CDN 加速部署
- **部署策略**:
  - Git 整合自動部署
  - Preview Deployments (PR 預覽)
  - 生產部署 (main branch)
  - 回滾機制 (Rollback)

#### CDN 邊緣節點
- **服務商**: Cloudflare / Supabase CDN
- **功能**:
  - 靜態資源快取 (CSS, JS, 圖片)
  - HTML 頁面快取
  - Angular 應用快取
  - DDoS 防護
- **快取策略**:
  - 靜態資源: 長期快取 (1 年)
  - Angular 應用: 長期快取 (1 年)
  - API 回應: 不快取

### 後端部署層 (Supabase Cloud)

#### Database 叢集
- **架構**: PostgreSQL 高可用性叢集
- **組件**:
  - **主資料庫**: 處理所有寫入與讀取操作
  - **只讀副本**: 分流讀取查詢，減輕主庫壓力
- **複製**: Streaming Replication (同步/非同步)
- **容量**:
  - 儲存: 100GB+ (可擴展)
  - 連線數: 1000+ 並發連線
  - IOPS: 10000+

#### Auth 服務
- **引擎**: GoTrue (Go 語言)
- **部署**: 多實例負載均衡
- **功能**:
  - JWT Token 簽發與驗證
  - Session 管理
  - OAuth 整合
- **效能**:
  - 回應時間: <50ms
  - 吞吐量: 10000+ req/s

#### Storage 叢集
- **儲存**: S3-Compatible Object Storage
- **Buckets**:
  - `images/`: 施工與驗收照片 (公開讀取)
  - `documents/`: 合約與報表 (私有)
  - `drawings/`: 圖紙檔案 (私有)
- **CDN**: 全球 CDN 加速
- **轉換**: 自動圖片優化 (WebP, 縮圖)

#### Realtime 叢集
- **引擎**: Phoenix Framework (Elixir)
- **協議**: WebSocket
- **功能**:
  - Database 變更訂閱
  - Broadcast 廣播
  - Presence 線上狀態
- **擴展**: 水平擴展，支援數萬並發連線

#### Edge Functions
- **運行時**: Deno Deploy
- **部署**: 全球邊緣節點
- **函數**:
  - `weather-api`: 天氣整合 (每 6 小時緩存)
  - `notification-handler`: 通知邏輯
  - `progress-calculator`: 進度計算
  - `analytics-processor`: 數據分析
- **冷啟動**: <100ms

### 備份與災難復原

#### 備份策略
- **資料庫備份**:
  - 每日完整備份 (Full Backup)
  - 每小時增量備份 (Incremental)
  - 保留 30 天
  - Point-in-Time Recovery (PITR)
- **Storage 備份**:
  - 異地複製 (Cross-Region Replication)
  - 版本控制 (Versioning)
  - 保留 90 天

#### 災難復原 (DR)
- **RTO** (Recovery Time Objective): 1 小時
- **RPO** (Recovery Point Objective): 15 分鐘
- **恢復流程**:
  1. 啟動備用資料庫
  2. 恢復最新備份
  3. 重放 WAL 日誌
  4. DNS 切換

### 監控與可觀測性

#### 監控堆疊
- **指標收集**: Prometheus
  - 系統指標 (CPU, Memory, Disk)
  - 應用指標 (Request Rate, Latency, Error Rate)
  - 業務指標 (任務數, 問題數, 活躍用戶)
- **日誌聚合**: Grafana Loki
  - 集中式日誌收集
  - 全文搜尋
  - 日誌關聯
- **鏈路追蹤**: OpenTelemetry
  - 分散式追蹤
  - 請求鏈路可視化
  - 效能瓶頸分析
- **告警系統**: Alertmanager
  - 閾值告警 (CPU > 80%)
  - 異常告警 (Error Rate > 1%)
  - 通知渠道 (Email, Slack, PagerDuty)

#### 儀表板
- **Grafana**: 統一監控儀表板
- **Angular Analytics**: 前端效能監控
- **Supabase Dashboard**: 資料庫與 API 監控

### 外部服務整合

#### 天氣 API
- **服務商**: OpenWeather API
- **調用**: 透過 Edge Function
- **限流**: 1000 calls/day
- **快取**: weather_cache 表 (6 小時)

#### 郵件服務
- **服務商**: SendGrid
- **用途**: 系統通知郵件
- **限流**: 100 emails/day (可升級)
- **模板**: 預設郵件模板

#### OAuth 服務
- **Google OAuth**: 社交登入
- **GitHub OAuth**: 開發者登入
- **配置**: Supabase Auth 整合

### 網路與安全

#### SSL/TLS
- **憑證**: Let's Encrypt (自動續期)
- **協議**: TLS 1.3
- **HSTS**: 強制 HTTPS

#### DDoS 防護
- **CDN 層**: Cloudflare DDoS 防護
- **應用層**: Rate Limiting (Supabase)

#### 網路隔離
- **VPC**: 資料庫與 Storage 在私有網路
- **Firewall**: 僅允許 Supabase 內部通訊

### 擴展策略

#### 水平擴展
- **前端**: CDN 自動擴展
- **Realtime**: 增加 WebSocket 節點
- **Edge Functions**: Deno Deploy 自動擴展

#### 垂直擴展
- **資料庫**: 升級實例規格 (CPU/Memory)
- **Storage**: 無限擴展 (Pay-as-you-go)

#### 效能優化
- **資料庫索引**: 優化查詢效能
- **Materialized Views**: 預計算複雜查詢
- **CDN 快取**: 減少源站負載
- **連線池**: 複用資料庫連線

## 部署環境

### 開發環境
- **前端**：本地開發伺服器（`yarn start`）
- **後端**：Supabase 開發專案
- **資料庫**：開發資料庫（與生產隔離）
- **Storage**：開發 Storage Bucket

### 測試環境
- **前端**：測試部署（可選）
- **後端**：Supabase 測試專案
- **資料庫**：測試資料庫（與生產隔離）
- **Storage**：測試 Storage Bucket

### 生產環境
- **前端**：靜態網站託管（Supabase Hosting 或 CDN）
- **後端**：Supabase 生產專案
- **資料庫**：PostgreSQL 生產資料庫
- **Storage**：生產 Storage Bucket

## 部署流程

### 前置檢查
1. `yarn type-check` → 型別檢查
2. `yarn lint` → 程式碼品質檢查
3. `yarn test` → 單元測試
4. `yarn build --configuration production` → 建置生產版本

### Supabase 遷移
1. 使用 `@SUPABASE` MCP 工具比對資料庫結構
2. 匯出 SQL 遷移腳本
3. 套用遷移至目標環境
4. 以 `information_schema`、`pg_indexes` 驗證

### 部署步驟
1. 建置 Angular 應用：`yarn build --configuration production`
2. 部署前端：上傳至 Supabase Hosting 或 CDN
3. 執行資料庫遷移：透過 Supabase Dashboard 或 MCP 工具
4. 驗證部署：執行 smoke test（任務列表、詳情、變更流程）

## 客戶端裝置

- **瀏覽器**：Chrome、Firefox、Safari、Edge（現代瀏覽器）
- **行動裝置**：響應式設計，支援行動瀏覽器
- **離線支援**：Service Worker（可選）

## 災難恢復路徑

1. 從備援（S3/Object Storage Snapshot）還原檔案
2. 透過 `supabase.storage.listBuckets()` 核對設定與 RLS
3. 執行資料庫還原：從 Supabase Dashboard 選擇備份點
4. 驗證恢復：執行 smoke test 確認功能正常

## 監控指標

- **效能指標**：LCP <2.5s、FID/INP <100ms、CLS <0.1
- **錯誤率**：追蹤前端錯誤、API 錯誤
- **資源使用**：資料庫配額、Storage 配額、Edge Functions 執行時間

## 維護作業

- **定期更新**：依賴套件更新、安全修補
- **效能優化**：資料庫索引優化、快取策略調整
- **容量規劃**：監控配額使用率，適時擴充
