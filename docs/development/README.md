# 開發文檔 | Development Documentation

> **目的**: 本目錄包含 ng-alain-gighub 專案的開發相關文檔  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 新成員
- AI Agents

---

## 📚 文檔清單

### 入門指南

- **getting-started.md** ⭐⭐⭐⭐⭐ - 開發入門指南
  - 快速開始
  - 專案結構
  - 開發工作流程
  - 常用命令

---

## 🚀 快速開始

### 新成員第一天

1. 閱讀 **getting-started.md** 了解專案結構
2. 設置開發環境（參考 [setup/environment.md](../setup/environment.md)）
3. 啟動開發伺服器
4. 瀏覽專案結構

### 開發工作流程

1. 創建功能分支
2. 開發功能
3. 編寫測試
4. 提交代碼
5. 創建 Pull Request

---

## 📖 相關文檔

### 完整開發指南

- [guides/](../guides/) - 完整的開發指南目錄
  - getting-started.md - 快速開始指南
  - development-best-practices.md - 開發最佳實踐
  - development-workflow.md - 開發工作流程
  - pre-development-checklist.md - 開發前檢查清單

### 開發規範

- [specs/](../specs/) - 開發規範文檔
- [standards/](../standards/) - 編碼標準

### 環境設置

- [setup/environment.md](../setup/environment.md) - 環境設置指南
- [setup/supabase.md](../setup/supabase.md) - Supabase 設置

### Supabase 開發

- [supabase/development/](../supabase/development/) - Supabase 開發指南
  - setup.md - 環境設定
  - database-dev.md - 資料庫開發
  - api-dev.md - API 開發
  - testing.md - 測試策略
  - local-workflow.md - 本地開發流程

---

## 🛠️ 常用命令

### 開發伺服器

```bash
# 啟動開發伺服器
npm start
# 或
yarn start

# 指定端口
npm start -- --port 4200
```

### 建構

```bash
# 開發建構
npm run build

# 生產建構
npm run build:prod
```

### 測試

```bash
# 單元測試
npm test

# E2E 測試
npm run e2e
```

### 代碼檢查

```bash
# Lint
npm run lint

# 格式化
npm run format
```

---

## 📝 開發流程

### 創建新功能

1. 創建功能分支
2. 開發功能
3. 編寫測試
4. 提交代碼
5. 創建 Pull Request

詳見：[workflow/git-workflow.md](../workflow/git-workflow.md)

---

## 🔗 相關資源

### 官方文檔

- [Angular 官方文檔](https://angular.dev)
- [NG-ZORRO 文檔](https://ng.ant.design)
- [ng-alain 文檔](https://ng-alain.com)
- [Supabase 文檔](https://supabase.com/docs)

### 專案文檔

- [00-順序.md](../00-順序.md) - 新功能開發順序指南
- [architecture/](../architecture/) - 系統架構文檔
- [reference/](../reference/) - 技術參考文檔

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊

