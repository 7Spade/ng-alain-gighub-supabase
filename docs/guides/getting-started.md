# 快速開始指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [環境準備](#環境準備)
  - [必要軟體](#必要軟體)
    - [1. Node.js](#1-nodejs)
    - [2. Yarn](#2-yarn)
    - [3. Git](#3-git)
    - [4. Supabase CLI（可選，用於本地開發）](#4-supabase-cli可選用於本地開發)
  - [開發工具建議](#開發工具建議)
- [安裝步驟](#安裝步驟)
  - [1. 複製專案](#1-複製專案)
  - [2. 安裝依賴](#2-安裝依賴)
  - [3. 驗證安裝](#3-驗證安裝)
- [環境變數配置](#環境變數配置)
  - [1. 複製環境變數範例](#1-複製環境變數範例)
  - [2. 配置 Supabase](#2-配置-supabase)
  - [3. 配置 CWA API Key（可選）](#3-配置-cwa-api-key可選)
- [資料庫設定](#資料庫設定)
  - [1. 建立 Supabase 專案](#1-建立-supabase-專案)
  - [2. 執行資料庫遷移](#2-執行資料庫遷移)
  - [3. 驗證資料庫連線](#3-驗證資料庫連線)
- [啟動開發伺服器](#啟動開發伺服器)
  - [1. 啟動開發伺服器](#1-啟動開發伺服器)
  - [2. 使用 HMR（熱模組替換）](#2-使用-hmr熱模組替換)
  - [3. 驗證啟動成功](#3-驗證啟動成功)
- [驗證安裝](#驗證安裝)
  - [檢查清單](#檢查清單)
  - [執行測試](#執行測試)
- [常見問題](#常見問題)
  - [1. 安裝失敗](#1-安裝失敗)
  - [2. 開發伺服器無法啟動](#2-開發伺服器無法啟動)
  - [3. Supabase 連線失敗](#3-supabase-連線失敗)
  - [4. 類型錯誤](#4-類型錯誤)
  - [5. 建置失敗](#5-建置失敗)
  - [6. 依賴版本衝突](#6-依賴版本衝突)
- [下一步](#下一步)
- [相關文檔](#相關文檔)
- [取得協助](#取得協助)
- [🎯 系統架構說明](#-系統架構說明)
  - [Git-like 分支模型](#git-like-分支模型)
  - [51 張資料表架構](#51-張資料表架構)
  - [技術棧版本](#技術棧版本)

---


> 🚀 **目的**：幫助新成員在最短時間內完成環境設定並啟動開發伺服器

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [環境準備](#環境準備)
- [安裝步驟](#安裝步驟)
- [環境變數配置](#環境變數配置)
- [資料庫設定](#資料庫設定)
- [啟動開發伺服器](#啟動開發伺服器)
- [驗證安裝](#驗證安裝)
- [常見問題](#常見問題)

- --

## 環境準備

### 必要軟體

#### 1. Node.js
- **版本要求**：Node.js >= 20
- **下載**：https://nodejs.org/
- **驗證**：
  ```bash
  node --version
  # 應顯示 v20.x.x 或更高版本
  ```

#### 2. Yarn
- **版本要求**：Yarn 4.9.2+（專案內已設定 Plug'n'Play）
- **安裝**：
  ```bash
  npm install -g yarn
  ```
- **驗證**：
  ```bash
  yarn --version
  # 應顯示 4.9.2 或更高版本
  ```

#### 3. Git
- **版本要求**：Git >= 2.30
- **下載**：https://git-scm.com/
- **驗證**：
  ```bash
  git --version
  ```

#### 4. Supabase CLI（可選，用於本地開發）
- **安裝**：
  ```bash
  npm install -g supabase
  ```
- **驗證**：
  ```bash
  supabase --version
  ```

### 開發工具建議

- **IDE**：Visual Studio Code（推薦）
- **瀏覽器**：Chrome / Edge（用於開發者工具）
- **終端機**：Windows Terminal / PowerShell 7+

- --

## 安裝步驟

### 1. 複製專案

```bash
git clone <repository-url>
cd ng-alain
```

### 2. 安裝依賴

```bash
yarn install
```

**注意事項**：
- 首次安裝可能需要 3-5 分鐘
- 如果遇到網路問題，可以使用國內鏡像：
  ```bash
  yarn config set registry https://registry.npmmirror.com
  ```

### 3. 驗證安裝

```bash
yarn ng version
# 應顯示 Angular CLI 版本資訊
```

- --

## 環境變數配置

### 1. 複製環境變數範例

專案使用 `src/environments/environment.ts` 進行環境配置。

**開發環境**：`src/environments/environment.ts`
**生產環境**：`src/environments/environment.prod.ts`

### 2. 配置 Supabase

在 `src/environments/environment.ts` 中配置 Supabase 連線資訊：

```typescript
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project.supabase.co',  // 替換為您的 Supabase URL
    anonKey: 'your-anon-key',                 // 替換為您的 Anon Key
    storage: {
      documentBucket: 'blueprint-documents'   // Storage Bucket 名稱
    }
  },
  cwa: {
    apiKey: 'your-cwa-api-key'                // 中央氣象署 API Key（可選）
  }
};
```

**取得 Supabase 連線資訊**：
1. 登入 Supabase Dashboard：https://app.supabase.com
2. 選擇專案
3. 進入 **Settings** → **API**
4. 複製 **Project URL** 和 **anon public** key

### 3. 配置 CWA API Key（可選）

如果需要天氣功能：
1. 前往中央氣象署開放資料平台：https://opendata.cwb.gov.tw/
2. 申請 API Key
3. 將 API Key 填入 `environment.ts`

- --

## 資料庫設定

### 1. 建立 Supabase 專案

1. 前往 https://app.supabase.com
2. 建立新專案或選擇現有專案
3. 等待專案初始化完成（約 2-3 分鐘）

### 2. 執行資料庫遷移

**使用 Supabase Dashboard**：
1. 進入 **SQL Editor**
2. 執行遷移腳本（參考 `supabase/migrations/` 目錄）

**使用 Supabase CLI**（本地開發）：
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 3. 驗證資料庫連線

使用 Supabase MCP 工具驗證：
```bash
@SUPABASE 列出所有資料庫表
```

或使用 Supabase Dashboard：
1. 進入 **Table Editor**
2. 確認所有表已建立（參考 `docs/30-資料表清單總覽.md`）

- --

## 啟動開發伺服器

### 1. 啟動開發伺服器

```bash
yarn start
```

或使用完整指令：
```bash
yarn ng serve --open
```

**預設行為**：
- 開發伺服器啟動在 `http://localhost:4200`
- 自動開啟瀏覽器
- 支援熱重載（Hot Reload）

### 2. 使用 HMR（熱模組替換）

```bash
yarn hmr
```

### 3. 驗證啟動成功

瀏覽器應顯示：
- ✅ 應用程式正常載入
- ✅ 沒有 Console 錯誤
- ✅ 可以正常導航

- --

## 驗證安裝

### 檢查清單

- [ ] Node.js 版本 >= 20
- [ ] Yarn 已安裝並可用
- [ ] 依賴安裝成功（`node_modules/` 存在）
- [ ] 環境變數已配置
- [ ] Supabase 連線正常
- [ ] 資料庫表已建立
- [ ] 開發伺服器可以啟動
- [ ] 瀏覽器可以正常顯示應用

### 執行測試

```bash
# 單元測試
yarn test

# 程式碼檢查
yarn lint

# 建置測試
yarn build
```

- --

## 常見問題

### 1. 安裝失敗

**問題**：`yarn install` 失敗

**解決方案**：
- 檢查 Node.js 版本：`node --version`（應 >= 20）
- 清除快取：`yarn cache clean`
- 刪除 `node_modules` 和 `yarn.lock`，重新安裝
- 使用國內鏡像：`yarn config set registry https://registry.npmmirror.com`

### 2. 開發伺服器無法啟動

**問題**：`yarn start` 失敗

**解決方案**：
- 檢查端口 4200 是否被占用：
  ```bash
  netstat -ano | findstr :4200
  ```
- 使用其他端口：
  ```bash
  yarn ng serve --port 4201
  ```
- 檢查 `environment.ts` 配置是否正確

### 3. Supabase 連線失敗

**問題**：無法連線到 Supabase

**解決方案**：
- 檢查 Supabase URL 和 Anon Key 是否正確
- 確認 Supabase 專案狀態（Dashboard 中檢查）
- 檢查網路連線
- 確認 RLS 策略是否正確設定

### 4. 類型錯誤

**問題**：TypeScript 編譯錯誤

**解決方案**：
- 執行類型檢查：`yarn type-check`（如果有）
- 檢查 `tsconfig.json` 配置
- 確認所有依賴已正確安裝

### 5. 建置失敗

**問題**：`yarn build` 失敗

**解決方案**：
- 檢查記憶體使用（可能需要增加 Node.js 記憶體限制）
- 清除建置快取：`yarn ng cache clean`
- 檢查 `angular.json` 配置

### 6. 依賴版本衝突

**問題**：依賴版本不匹配

**解決方案**：
- 使用 `yarn install --frozen-lockfile` 確保版本一致
- 檢查 `package.json` 中的版本要求
- 更新依賴：`yarn upgrade`

- --

## 下一步

完成環境設定後，建議閱讀：

1. [開發作業指引](./specs/00-development-guidelines.md) - 了解開發規範
2. [專案結構樹](./02-專案結構樹.md) - 了解專案結構
3. [開發工作流程](./35-開發工作流程.md) - 了解開發流程
4. [API接口詳細文檔](./33-API-接口詳細文檔.md) - 了解 API 使用方式

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [開發前檢查清單](./31-開發前檢查清單.md)
- [專案結構樹](./02-專案結構樹.md)
- [資料表清單總覽](./30-資料表清單總覽.md)

- --

## 取得協助

如果遇到問題：

1. 查閱 [常見問題 FAQ](./36-常見問題-FAQ.md)（如果已建立）
2. 檢查 [開發前檢查清單](./31-開發前檢查清單.md)
3. 查看專案 Issue Tracker
4. 聯繫團隊成員

- --

- --

## 🎯 系統架構說明

### Git-like 分支模型
- **主分支 (blueprints)**：擁有者全權控制任務結構
- **組織分支 (blueprint_branches)**：協作組織只能填寫承攬欄位
- **Pull Request**：提交執行數據 → 擁有者審核 → 合併更新

### 51 張資料表架構
系統共包含 51 張資料表，分為 11 個模組。詳細表結構請參考：
- [30-資料表清單總覽.md](./30-資料表清單總覽.md) - 資料表清單
- [30-0-完整SQL表結構定義.md](./30-0-完整SQL表結構定義.md) - 完整 SQL 表結構定義

### 技術棧版本
- **Angular**：20.3.x
- **NG-ZORRO**：20.3.x
- **NG-ALAIN**：20.0.x
- **Supabase**：最新版本

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）

