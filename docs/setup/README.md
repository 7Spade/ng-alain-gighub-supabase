# 設置文檔 | Setup Documentation

> **目的**: 本目錄包含 ng-alain-gighub 專案的環境設置與配置文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 新成員
- 開發者
- 系統管理員
- DevOps 工程師

---

## 📚 文檔清單

### 環境設置

- **environment.md** ⭐⭐⭐⭐⭐ - 開發環境設置指南
  - 前置需求
  - 專案初始化
  - 環境變數配置
  - 驗證安裝

- **supabase.md** ⭐⭐⭐⭐⭐ - Supabase 設置指南
  - Supabase 專案創建
  - 環境變數配置
  - 資料庫設置
  - 本地開發設置

---

## 🚀 快速開始

### 新成員設置流程

1. **閱讀環境設置指南**
   - 查看 **environment.md** 了解系統需求
   - 安裝必要軟體（Node.js, Git 等）
   - 克隆專案儲存庫

2. **配置開發環境**
   - 設置 Node.js 版本
   - 安裝專案依賴
   - 配置環境變數

3. **設置 Supabase**
   - 查看 **supabase.md** 了解 Supabase 設置
   - 創建 Supabase 專案（如需要）
   - 配置 Supabase 環境變數

4. **驗證設置**
   - 啟動開發伺服器
   - 確認應用程式正常運行
   - 測試資料庫連線

---

## 📖 詳細指南

### 環境設置 (environment.md)

涵蓋內容：
- 系統要求（Node.js, npm, Git）
- 專案初始化步驟
- 環境變數配置
- IDE 設置建議
- 常見問題排解

### Supabase 設置 (supabase.md)

涵蓋內容：
- Supabase 專案創建
- 環境變數配置
- 資料庫遷移
- 本地開發環境
- Supabase CLI 使用

---

## 🔗 相關文檔

### 開發指南

- [development/getting-started.md](../development/getting-started.md) - 開發入門指南
- [guides/getting-started.md](../guides/getting-started.md) - 快速開始指南

### Supabase 開發

- [supabase/development/setup.md](../supabase/development/setup.md) - Supabase 開發環境設置
- [supabase/README.md](../supabase/README.md) - Supabase 整合文件總覽

### 部署

- [deployment/DEPLOYMENT.md](../deployment/DEPLOYMENT.md) - 部署指南

---

## ⚙️ 環境變數

### 必需環境變數

```bash
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 應用程式
APP_ENV=development
API_URL=your-api-url
```

詳見各設置文檔中的環境變數說明。

---

## 🛠️ 常用命令

### 環境設置

```bash
# 安裝依賴
npm install
# 或
yarn install

# 設置 Node.js 版本（使用 nvm）
nvm use

# 驗證安裝
node --version
npm --version
```

### Supabase CLI

```bash
# 安裝 Supabase CLI
npm install -g supabase

# 登入 Supabase
supabase login

# 初始化本地專案
supabase init

# 啟動本地開發環境
supabase start
```

---

## ❓ 常見問題

### Node.js 版本問題

**Q: 應該使用哪個 Node.js 版本？**  
A: 專案要求 Node.js >= 20.x，建議使用 20.11.0+。使用 nvm 管理版本。

### 環境變數問題

**Q: 環境變數應該放在哪裡？**  
A: 創建 `.env` 文件在專案根目錄，參考 `.env.example`。

### Supabase 連線問題

**Q: 無法連線到 Supabase？**  
A: 檢查環境變數是否正確設置，確認 Supabase 專案狀態。

詳見各設置文檔的「常見問題」章節。

---

## 📊 系統要求

### 開發環境

- **Node.js**: >= 20.x (推薦 20.11.0+)
- **npm**: >= 10.x 或 **Yarn**: >= 4.x
- **Git**: >= 2.30.0
- **作業系統**: Windows 10+, macOS 12+, Linux (Ubuntu 20.04+)

### 推薦工具

- **IDE**: Visual Studio Code
- **終端機**: 支援 UTF-8 的現代終端機
- **瀏覽器**: Chrome 或 Edge（開發與測試）

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊

