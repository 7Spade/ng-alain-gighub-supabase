# 開發規範文檔 (Development Specifications)

> **目的**: 本目錄包含 ng-alain-gighub 專案的所有開發規範與編碼標準文檔

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- 代碼審查者
- AI Agents

## 文檔清單

### 核心規範

- **00-modern-syntax-standards.md** - 現代化語法規範
  - Angular 20+ 新語法 (@if, @for, @defer)
  - Standalone Components
  - Signals API
  - TypeScript 5.9+ 特性

- **00-api-standards.md** - API 開發規範
  - RESTful API 設計
  - Supabase API 使用
  - 錯誤處理
  - 請求/響應格式

- **00-component-standards.md** - 元件開發規範
  - Standalone Component 結構
  - OnPush 策略
  - Smart/Dumb Component 分離
  - 元件通訊模式

- **00-state-management-standards.md** - 狀態管理規範
  - Signals 使用
  - RxJS Observables
  - 狀態同步策略
  - 副作用管理

- **00-testing-standards.md** - 測試規範
  - 單元測試
  - 整合測試
  - E2E 測試
  - 測試覆蓋率

### 程式碼質量

- **00-single-responsibility-principle.md** - 單一職責原則 (SRP)
  - SOLID 原則
  - 程式碼分層
  - 職責劃分

- **00-naming-standards.md** - 命名標準化規範
  - 變數命名
  - 函數命名
  - 類別命名
  - 檔案命名

- **00-consistency-standards.md** - 一致性規範
  - 程式碼風格
  - 專案結構
  - 命名慣例

### 架構與設計

- **00-architecture-governance-standards.md** - 架構治理規範
  - 架構決策
  - 技術選型
  - 依賴管理

- **00-composability-standards.md** - 可組合性規範
  - 元件組合
  - 服務組合
  - 功能模組化

- **00-maintainability-standards.md** - 可維護性規範
  - 程式碼可讀性
  - 文檔撰寫
  - 重構原則

### 安全與效能

- **00-security-standards.md** - 安全規範
  - 認證授權
  - XSS 防護
  - CSRF 防護
  - 資料加密

- **00-performance-standards.md** - 效能規範
  - 載入優化
  - 渲染優化
  - 網路優化
  - 快取策略

### 運維規範

- **00-devops-standards.md** - DevOps 規範
  - CI/CD 流程
  - 部署策略
  - 環境管理

## 使用方法 (Usage)

### 新成員入門
1. 從 **00-modern-syntax-standards.md** 開始，了解專案使用的現代語法
2. 閱讀 **00-component-standards.md** 學習元件開發規範
3. 參考 **00-api-standards.md** 了解 API 開發模式

### 代碼審查
使用本目錄文檔作為代碼審查的檢查清單，確保代碼符合專案規範。

### 日常開發
在開發過程中，遇到具體問題時查閱對應的規範文檔。

## 規範優先級

### 🔴 必須遵循 (MUST)
- 00-modern-syntax-standards.md
- 00-component-standards.md
- 00-security-standards.md
- 00-testing-standards.md

### 🟡 強烈建議 (SHOULD)
- 00-api-standards.md
- 00-state-management-standards.md
- 00-naming-standards.md
- 00-performance-standards.md

### 🟢 參考建議 (MAY)
- 00-composability-standards.md
- 00-maintainability-standards.md
- 00-consistency-standards.md

## 參考資源 (References)

### 官方文檔
- [Angular 官方文檔](https://angular.dev)
- [NG-ZORRO 文檔](https://ng.ant.design)
- [ng-alain 文檔](https://ng-alain.com)
- [Supabase 文檔](https://supabase.com/docs)

### 風格指南
- [Angular 風格指南](https://angular.dev/style-guide)
- [TypeScript 深入探討](https://www.typescriptlang.org/docs/)
- [Google TypeScript 風格指南](https://google.github.io/styleguide/tsguide.html)

### 設計原則
- [SOLID 原則](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**文檔數量**: 15 個規範文檔
