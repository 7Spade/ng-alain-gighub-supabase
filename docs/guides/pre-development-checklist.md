# 開發前檢查清單

## 📑 目錄

- [❌ 缺少的關鍵檔案](#-缺少的關鍵檔案)
  - [🔴 高優先級（必須完成才能開始開發）](#-高優先級必須完成才能開始開發)
    - [1. 資料庫遷移腳本](#1-資料庫遷移腳本)
    - [2. TypeScript 模型定義完整性](#2-typescript-模型定義完整性)
    - [3. 環境配置檔案](#3-環境配置檔案)
  - [🟡 中優先級（建議在開發初期完成）](#-中優先級建議在開發初期完成)
    - [4. Repository 層實現](#4-repository-層實現)
  - [🟢 低優先級（可在開發過程中補充）](#-低優先級可在開發過程中補充)
    - [錯誤處理文檔](#錯誤處理文檔)
- [📋 開發前必做檢查](#-開發前必做檢查)
  - [環境準備](#環境準備)
  - [專案設定](#專案設定)
  - [資料庫設定](#資料庫設定)
  - [開發環境](#開發環境)
- [🔍 驗證方式](#-驗證方式)
  - [使用 Supabase MCP 工具驗證](#使用-supabase-mcp-工具驗證)
  - [使用專案工具驗證](#使用專案工具驗證)
- [📝 備註](#-備註)
- [🔗 相關文檔](#-相關文檔)

---


> 📋 **目的**：確保所有必要的檔案和配置都已就緒，可以開始開發工作

**最後更新**：2025-11-15
**維護者**：開發團隊

> ℹ️ 歷史紀錄與已完成項目請參考 `docs/Archive/31-開發前檢查清單-archive.md`。

- --

## ❌ 缺少的關鍵檔案

### 🔴 高優先級（必須完成才能開始開發）

#### 1. 資料庫遷移腳本
**狀態**：⚠️ **不完整** - 只有 1 個優化遷移，缺少基礎表結構

**需要建立**：
- [ ] `supabase/migrations/00000000000000_initial_schema.sql` - 初始資料庫結構（51 張表）
  - 包含所有 51 張表的 CREATE TABLE 語句
  - 包含外鍵約束
  - 包含索引定義
  - 參考：`docs/30-0-完整SQL表結構定義.md`（完整 SQL 表結構定義）和 `docs/30-資料表清單總覽.md`

- [ ] `supabase/migrations/00000000000001_rls_policies.sql` - RLS 權限策略
  - 所有表的 RLS 啟用
  - 所有權限策略定義
  - 參考：`docs/21-安全與-RLS-權限矩陣.md`

- [ ] `supabase/migrations/00000000000002_seed_data.sql` - 初始種子資料（可選）
  - 測試用帳戶
  - 預設角色和權限
  - 系統設定

**檢查方式**：
```bash
# 使用 Supabase MCP 檢查表是否存在
@SUPABASE 列出所有資料庫表
```

- --

#### 2. TypeScript 模型定義完整性
**狀態**：⚠️ **部分完成** - 部分模型已定義，但可能不完整

**需要檢查/建立**：
- [ ] `src/app/shared/models/account.model.ts` - 帳戶模型
- [ ] `src/app/shared/models/team.model.ts` - 團隊模型
- [ ] `src/app/shared/models/role.model.ts` - 角色模型
- [ ] `src/app/shared/models/permission.model.ts` - 權限模型
- [ ] `src/app/shared/models/issue.model.ts` - 問題模型
- [ ] `src/app/shared/models/quality-check.model.ts` - 品質檢查模型
- [ ] `src/app/shared/models/daily-report.model.ts` - 每日報表模型
- [ ] `src/app/shared/models/comment.model.ts` - 留言模型
- [ ] `src/app/shared/models/notification.model.ts` - 通知模型
- [ ] `src/app/shared/models/todo.model.ts` - 待辦事項模型
- [ ] `src/app/shared/models/document.model.ts` - 文件模型
- [ ] `src/app/shared/models/progress-tracking.model.ts` - 進度追蹤模型
- [ ] `src/app/shared/models/activity-log.model.ts` - 活動記錄模型
- [ ] `src/app/shared/models/setting.model.ts` - 系統設定模型

**檢查方式**：
```bash
# 檢查現有模型
grep -r "export interface" src/app/shared/models/
# 對比 docs/30-資料表清單總覽.md 確認完整性
```

- --

#### 3. 環境配置檔案
**狀態**：⚠️ **缺少範例檔案**

**需要建立**：
- [ ] `.env.example` - 環境變數範例
  ```env
  # Supabase
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

  # CWA (中央氣象署 API)
  CWA_API_KEY=your-cwa-api-key

  # 其他配置
  NODE_ENV=development
  ```

- [ ] `.env.local` - 本地開發環境變數（應在 .gitignore 中）
- [ ] `docs/環境配置說明.md` - 環境變數配置說明

**檢查方式**：
```bash
# 檢查 environment.ts 中使用的變數
cat src/environments/environment.ts
```

- --

### 🟡 中優先級（建議在開發初期完成）

#### 4. Repository 層實現
**狀態**：⚠️ **部分完成** - account、blueprint、team 等核心模組已實作，其餘資料表尚未建立 Repository

**需要檢查/建立**：
- [ ] `src/app/core/infra/repositories/role.repository.ts`
- [ ] `src/app/core/infra/repositories/permission.repository.ts`
- [ ] `src/app/core/infra/repositories/issue.repository.ts`
- [ ] `src/app/core/infra/repositories/quality-check.repository.ts`
- [ ] `src/app/core/infra/repositories/daily-report.repository.ts`
- [ ] `src/app/core/infra/repositories/comment.repository.ts`
- [ ] `src/app/core/infra/repositories/notification.repository.ts`
- [ ] `src/app/core/infra/repositories/todo.repository.ts`
- [ ] `src/app/core/infra/repositories/document.repository.ts`
- [ ] `src/app/core/infra/repositories/progress-tracking.repository.ts`
- [ ] `src/app/core/infra/repositories/activity-log.repository.ts`
- [ ] `src/app/core/infra/repositories/setting.repository.ts`

**檢查方式**：
```bash
find src/app/core/infra/repositories -name "*.repository.ts"
```

- --

### 🟢 低優先級（可在開發過程中補充）

#### 錯誤處理文檔
**狀態**：⚠️ **部分完成** - 有錯誤處理指南，但可能需要更新

**需要檢查**：
- [ ] `src/app/core/net/error/ERROR_HANDLING_GUIDE.md` 是否完整
- [ ] 是否需要補充錯誤碼對照表

## 📋 開發前必做檢查

### 環境準備
- [ ] Node.js 版本符合要求（檢查 `package.json` 的 `engines`）
- [ ] Yarn 已安裝（版本 4.9.2+）
- [ ] Supabase CLI 已安裝
- [ ] Git 已配置

### 專案設定
- [ ] 執行 `yarn install` 安裝依賴
- [ ] 複製 `.env.example` 為 `.env.local` 並填入正確值
- [ ] 執行 `yarn lint` 檢查程式碼風格
- [ ] 執行 `yarn type-check` 檢查類型（如果有的話）
- [ ] 執行 `yarn build` 確認可以建置

### 資料庫設定
- [ ] Supabase 專案已建立
- [ ] 執行資料庫遷移腳本
- [ ] 驗證所有表已建立（使用 `@SUPABASE 列出所有資料庫表`）
- [ ] 驗證 RLS 策略已啟用
- [ ] 測試連線（使用 `@SUPABASE` 工具）

### 開發環境
- [ ] 執行 `yarn start` 啟動開發伺服器
- [ ] 瀏覽器可以正常開啟應用
- [ ] 登入功能正常（如果已實現）
- [ ] 基本路由導航正常

## 🔍 驗證方式

### 使用 Supabase MCP 工具驗證
```bash
# 列出所有表
@SUPABASE 列出所有資料庫表

# 檢查 RLS 策略
@SUPABASE 獲取安全建議

# 檢查遷移
@SUPABASE 列出所有遷移
```

### 使用專案工具驗證
```bash
# 建置檢查
yarn build

# 測試檢查
yarn test

# 程式碼品質檢查
yarn lint
yarn type-check  # 如果有
```

- --

## 📝 備註

- 本文檔應在每次重大開發前更新
- 完成項目後應勾選對應的檢查框
- 如有新增需求，應更新本文檔
- 建議定期檢查本文檔的完整性

- --

## 🔗 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [專案結構樹](./02-專案結構樹.md)
- [資料表清單總覽](./30-資料表清單總覽.md)
- [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md)
- [API介面映射圖](./25-API-介面映射圖.mermaid.md)

