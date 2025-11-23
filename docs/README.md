# ng-alain-gighub-supabase 專案文檔

此資料夾包含 ng-alain-gighub-supabase 專案的完整技術文件。

This folder contains the complete technical documentation for the ng-alain-gighub-supabase project.

---

## 📚 文件結構 | Documentation Structure

### 🗄️ [Supabase 企業級整合文件](./supabase/)

完整的 Supabase 後端整合文件，包括：

- **[架構設計](./supabase/architecture/)** - 系統架構、資料庫設計、認證架構
- **[開發指南](./supabase/development/)** - 環境設定、開發規範、測試策略
- **[部署文件](./supabase/deployment/)** - 環境配置、CI/CD、資料庫遷移
- **[安全性](./supabase/security/)** - RLS 策略、身份驗證、資料加密
- **[最佳實踐](./supabase/best-practices/)** - 資料庫設計、查詢優化、效能調校
- **[API 參考](./supabase/api-reference/)** - Supabase Client 使用、型別定義

**開始使用 | Get Started**: [Supabase 文件首頁](./supabase/README.md)

### 🏗️ [系統架構文件](./architecture/)

專案特定的系統架構文件，包括：

- 系統架構思維導圖、C4 架構圖
- 51 張資料表的資料庫設計
- Git-like 分支模型架構
- Mermaid 架構圖表
- 架構審查報告

### 📖 [開發指南](./guides/)

開發者指南和最佳實踐：

- 開發最佳實踐
- Agent 開發指南
- 程式碼審查標準
- 部署指南
- 快速開發檢查清單

### 📋 [技術規範](./specs/)

技術標準和規範：

- API 標準
- 元件標準
- 命名規範
- 安全標準
- 效能標準
- 測試標準

### 📚 [參考文件](./reference/)

技術參考資料：

- SQL 資料表結構定義（51 張表）
- 資料模型對照表
- 狀態枚舉值定義
- API 文件
- SHARED_IMPORTS 使用指南
- **注意**: ng-zorro 和 @delon 組件文檔請參考官方：
  - [NG-ZORRO 官方文檔](https://ng.ant.design/)
  - [@delon 官方文檔](https://ng-alain.com/)

### 🔐 [安全性文件](./security/)

安全評估和實踐：

- 安全評估報告
- RLS 策略實作

### ⚙️ [設定文件](./setup/)

環境設定指南：

- 環境變數配置
- Supabase 設定

### 🔄 [工作流程](./workflow/)

開發工作流程：

- Git 工作流程
- 貢獻指南

### 🗂️ [工作區文件](./workspace/)

工作區系統文件：

- 工作區系統概覽
- 上下文切換機制

---

## 🚀 快速連結 | Quick Links

### 新手入門 | Getting Started
- [環境設定指南](./supabase/development/setup.md)
- [整體架構概覽](./supabase/architecture/overview.md)
- [Supabase Client 基礎](./supabase/api-reference/supabase-client.md)

### 開發必讀 | Development Essentials
- [RLS 安全策略](./supabase/security/rls.md)
- [資料庫架構設計](./supabase/architecture/database.md)
- [查詢優化技巧](./supabase/best-practices/query-optimization.md)

### 部署與維運 | Deployment & Operations
- [環境配置管理](./supabase/deployment/environments.md)
- [CI/CD 整合](./supabase/deployment/cicd.md)
- [資料庫遷移策略](./supabase/deployment/migrations.md)

---

## 📝 文件貢獻 | Contributing to Documentation

我們歡迎對文件的改進！請遵循以下規範：

We welcome documentation improvements! Please follow these guidelines:

### 撰寫規範 | Writing Guidelines

1. **雙語撰寫**: 使用繁體中文為主，關鍵術語附英文
2. **程式碼範例**: 必須包含完整可執行的範例
3. **圖表說明**: 使用 Mermaid 語法繪製架構圖
4. **版本標記**: 每個文件都要標註版本號與更新日期

### 提交流程 | Submission Process

```bash
# 1. 建立文件分支
git checkout -b docs/improve-xxx

# 2. 編輯文件
# 編輯 docs/ 下的相關文件

# 3. 提交變更
git add docs/
git commit -m "docs: improve xxx documentation"

# 4. 推送並開啟 PR
git push origin docs/improve-xxx
```

---

## 📊 文件狀態 | Documentation Status

| 類別 | Category | 狀態 | Status | 完成度 | Completion |
|------|----------|------|--------|--------|------------|
| Supabase 架構設計 | Architecture | ✅ 已完成核心文件 | Core docs completed | 80% |
| Supabase 開發指南 | Development | ✅ 已完成核心文件 | Core docs completed | 80% |
| Supabase 部署文件 | Deployment | 🚧 施工中 | Under construction | 40% |
| Supabase 安全性 | Security | ✅ 已完成核心文件 | Core docs completed | 80% |
| Supabase 最佳實踐 | Best Practices | ⚠️ 部分完成 | Partially completed | 60% |
| Supabase API 參考 | API Reference | ⚠️ 部分完成 | Partially completed | 60% |

---

## 🔄 更新日誌 | Changelog

### v1.1.0 (2025-11-23)
- 🧹 清理冗餘文件：移除 ng-zorro-index、delon-index、archive 目錄
- 📝 更新文件參考連結指向官方文檔
- 🗂️ 精簡文件結構，保留專案特定文件
- ✅ 減少 ~130 個重複文件，保留 ~90 個核心文件

### v1.0.0 (2025-11-22)
- ✨ 建立完整 Supabase 文件架構（6 大類別）
- ✅ 完成核心文件：整體架構、環境設定、RLS 策略
- 📚 建立 24+ 個文件骨架供未來擴充
- 🎨 採用中英雙語、Mermaid 圖表、企業級標準

---

## 📞 需要協助？ | Need Help?

- **專案 Issues**: [GitHub Issues](https://github.com/7Spade/ng-alain-gighub-supabase/issues)
- **Supabase 官方**: [supabase.com/docs](https://supabase.com/docs)
- **ng-alain 官方**: [ng-alain.com](https://ng-alain.com)

---

**最後更新 | Last Updated**: 2025-11-23  
**維護團隊 | Maintained by**: 7Spade Development Team

