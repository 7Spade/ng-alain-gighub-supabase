# 開發環境設置

## 前置需求

### 必需軟體

- **Node.js**: v20.x 或更高版本
  - 建議使用 [nvm](https://github.com/nvm-sh/nvm) 管理 Node.js 版本
  - 專案使用 `.nvmrc` 檔案指定版本
- **npm**: v10.x 或更高版本（隨 Node.js 安裝）
- **Git**: 最新穩定版本

### 推薦工具

- **IDE**: Visual Studio Code（推薦）
  - 安裝推薦的擴展套件（見 `.vscode/extensions.json`）
- **終端機**: 支援 UTF-8 編碼的現代終端機
- **瀏覽器**: Chrome 或 Edge（用於開發與測試）

## 專案初始化

### 1. 克隆儲存庫

```bash
git clone https://github.com/7Spade/ng-alain-gighub-supabase.git
cd ng-alain-gighub-supabase
```

### 2. 設置 Node.js 版本

如果使用 nvm：

```bash
nvm use
```

### 3. 安裝依賴

```bash
npm install
```

### 4. 環境變數配置

複製環境變數範本：

```bash
cp .env.example .env
```

編輯 `.env` 檔案，填入必要的配置：

```env
# Supabase 配置
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 應用配置
NODE_ENV=development
PORT=4200
```

## 開發服務器

### 啟動開發服務器

```bash
npm start
```

應用程式將在 `http://localhost:4200/` 啟動，並自動開啟瀏覽器。

### 啟動 HMR（Hot Module Replacement）模式

```bash
npm run hmr
```

### 啟動 SSR 開發服務器

1. 先建構應用：

```bash
npm run build
```

2. 啟動 SSR 服務器：

```bash
npm run serve:ssr:ng-alain
```

## 常見問題排解

### 依賴安裝失敗

1. 清除 npm 快取：

```bash
npm cache clean --force
```

2. 刪除 `node_modules` 和 `package-lock.json`：

```bash
rm -rf node_modules package-lock.json
npm install
```

### 建構錯誤

1. 確保使用正確的 Node.js 版本
2. 檢查是否有衝突的全域套件
3. 查看詳細錯誤日誌

### 端口被佔用

如果 4200 端口被佔用，可以指定其他端口：

```bash
ng serve --port 4300
```

## 下一步

- 閱讀 [開發指南](../development/getting-started.md)
- 了解 [專案架構](../architecture/overview.md)
- 查看 [編碼規範](../standards/coding-standards.md)
