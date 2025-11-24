# Supabase 架構設計 | Supabase Architecture Design

> **目的**: 本目錄包含 Supabase 系統架構設計文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 架構師
- 技術主管
- 資深開發者

---

## 📚 文檔清單

- **overview.md** ⭐⭐⭐⭐⭐ - 整體架構概覽
  - 系統架構
  - 服務組成
  - 整合策略

- **database.md** ⭐⭐⭐⭐⭐ - 資料庫架構設計
  - 資料庫設計原則
  - 表結構設計
  - 索引策略
  - 遷移管理

- **auth.md** ⭐⭐⭐⭐ - 認證與授權架構
  - 認證流程
  - 授權模型
  - Session 管理
  - 第三方登入

- **storage.md** ⭐⭐⭐⭐ - 儲存服務架構
  - Storage Bucket 設計
  - 檔案上傳流程
  - 權限控制
  - CDN 整合

- **realtime.md** ⭐⭐⭐⭐ - Real-time 功能架構
  - 訂閱機制
  - 頻道設計
  - 訊息傳遞
  - 效能考量

---

## 🏗️ 架構概覽

### 核心服務

- **PostgreSQL** - 主要資料庫
- **Auth** - 身份驗證服務
- **Storage** - 檔案儲存服務
- **Realtime** - 即時通訊服務
- **Edge Functions** - 無伺服器函數

詳見：**overview.md**

---

## 📖 相關文檔

- [../../architecture/](../architecture/) - 專案架構文檔
- [../development/](../development/) - 開發指南

---

**最後更新**: 2025-01-20  
**維護者**: 架構團隊

