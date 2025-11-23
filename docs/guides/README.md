# 開發指南文檔 (Development Guides)

> **目的**: 本目錄包含 ng-alain-gighub 專案的各類開發指南、操作手冊與最佳實踐

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- DevOps 工程師
- 測試人員
- 新成員

## 文檔清單

### 入門指南 (Getting Started)

- **getting-started.md** ⭐ - 快速開始指南
  - 環境設置
  - 專案啟動
  - 開發流程
  - 常用指令

- **pre-development-checklist.md** - 開發前檢查清單
  - 環境檢查
  - 工具準備
  - 權限確認

- **development-workflow.md** - 開發工作流程
  - Git 工作流程
  - 分支策略
  - Code Review 流程
  - 部署流程

### 核心開發 (Core Development)

- **development-best-practices.md** ⭐ - 開發最佳實踐指南
  - 編碼最佳實踐
  - 常見模式
  - 範例代碼
  - 避免陷阱

- **frontend-state-management-guide.md** - 前端狀態管理指南
  - Signals 使用
  - RxJS Observables
  - 狀態同步
  - 快取策略

- **frontend-routing-design-guide.md** - 前端路由設計指南
  - 路由配置
  - 懶加載
  - 路由守衛
  - 導航策略

- **ui-ux-design-standards.md** - UI/UX 設計規範
  - 設計原則
  - NG-ZORRO 使用
  - 響應式設計
  - 無障礙訪問

### 測試與質量 (Testing & Quality)

- **testing-guide.md** - 測試指南
  - 單元測試
  - 整合測試
  - E2E 測試
  - 測試覆蓋率

- **code-review-standards.md** - 代碼審查規範
  - Review 流程
  - 檢查項目
  - 評論規範
  - 最佳實踐

- **error-handling-guide.md** - 錯誤處理指南
  - 錯誤類型
  - 處理策略
  - 錯誤記錄
  - 使用者提示

- **development-troubleshooting-guide.md** - 開發疑難排解指南
  - 常見問題
  - 解決方案
  - Debug 技巧
  - 工具使用

### 後端開發 (Backend Development)

- **rls-policy-development-guide.md** - RLS 策略開發指南
  - Row Level Security
  - 策略設計
  - 測試方法
  - 常見模式

- **edge-function-development-guide.md** - Edge Function 開發指南
  - Supabase Edge Functions
  - 開發流程
  - 部署方式
  - 最佳實踐

- **redis-usage-guide.md** - Redis 使用指南
  - 快取策略
  - 資料結構
  - 效能優化
  - 監控告警

### 部署與運維 (Deployment & Operations)

- **deployment-guide.md** - 部署指南
  - 環境配置
  - 部署流程
  - 回滾機制
  - 健康檢查

- **version-management-release-guide.md** - 版本管理與發布指南
  - 語意化版本
  - 變更日誌
  - 發布流程
  - Tag 管理

- **monitoring-alerting-guide.md** - 監控與告警配置指南
  - 監控指標
  - 告警規則
  - 日誌分析
  - 效能追蹤

- **disaster-recovery-backup-guide.md** - 災難恢復與備份指南
  - 備份策略
  - 恢復流程
  - 資料遷移
  - 災難演練

### 效能與安全 (Performance & Security)

- **performance-optimization-guide.md** - 效能優化指南
  - 前端優化
  - 後端優化
  - 資料庫優化
  - 網路優化

- **security-checklist.md** - 安全檢查清單
  - 認證授權
  - 資料保護
  - XSS/CSRF 防護
  - 安全審計

### 進階主題 (Advanced Topics)

- **i18n-localization-guide.md** - 國際化與本地化指南
  - i18n 設置
  - 翻譯管理
  - 多語言切換
  - 日期格式化

- **mobile-adaptation-guide.md** - 移動端適配指南
  - 響應式設計
  - 觸控優化
  - 效能優化
  - PWA 配置

- **third-party-integration-guide.md** - 第三方服務整合指南
  - API 整合
  - SDK 使用
  - 認證授權
  - 錯誤處理

### AI Agent 開發 (AI Agent Development)

- **agent-development-guide.md** - Agent 開發指南與限制說明
  - Agent 角色定位
  - 開發規範
  - 限制與約束
  - 最佳實踐

- **enterprise-task-system-instructions.md** - 企業級任務系統開發指令
  - 任務系統架構
  - 開發流程
  - 部署配置
  - 監控維護

### 快速參考 (Quick Reference)

- **developer-quick-checklist.md** - 開發者快速檢查清單
  - 日常開發檢查
  - Code Review 檢查
  - 部署前檢查
  - 常用指令

- **frequently-asked-questions.md** - 常見問題 (FAQ)
  - 環境問題
  - 開發問題
  - 部署問題
  - 疑難排解

## 使用方法 (Usage)

### 新成員入門路徑 🚀

#### 第一天
1. **getting-started.md** - 環境設置與專案啟動
2. **development-workflow.md** - 了解開發流程
3. **pre-development-checklist.md** - 確認環境準備完成

#### 第一週
4. **development-best-practices.md** - 學習開發規範
5. **frontend-state-management-guide.md** - 掌握狀態管理
6. **testing-guide.md** - 了解測試流程

#### 第一個月
7. **code-review-standards.md** - 參與 Code Review
8. **performance-optimization-guide.md** - 學習效能優化
9. **deployment-guide.md** - 了解部署流程

### 日常開發參考

#### 開發前
- [ ] 檢查 **pre-development-checklist.md**
- [ ] 確認分支策略（**development-workflow.md**）

#### 開發中
- [ ] 遵循 **development-best-practices.md**
- [ ] 參考對應技術指南
- [ ] 編寫測試（**testing-guide.md**）

#### 提交前
- [ ] 自我 Review（**code-review-standards.md**）
- [ ] 執行 **developer-quick-checklist.md**
- [ ] 確認測試通過

### 疑難排解流程

遇到問題時的查詢順序：
1. **frequently-asked-questions.md** - 檢查 FAQ
2. **development-troubleshooting-guide.md** - 查閱疑難排解
3. **error-handling-guide.md** - 了解錯誤處理
4. 聯繫團隊尋求協助

## 文檔優先級

### 🔴 必讀 (MUST READ)
- getting-started.md
- development-workflow.md
- development-best-practices.md
- testing-guide.md

### 🟡 強烈建議 (SHOULD READ)
- code-review-standards.md
- frontend-state-management-guide.md
- error-handling-guide.md
- security-checklist.md

### 🟢 按需閱讀 (OPTIONAL)
- 進階主題指南
- 特定技術指南
- 運維相關指南

## 相關資源 (References)

### 核心架構
- [architecture/20-complete-architecture-flowchart.mermaid.md](../architecture/20-complete-architecture-flowchart.mermaid.md) - Git-like 分支模型
- [reference/sql-schema-definition.md](../reference/sql-schema-definition.md) - 資料庫結構

### 開發規範
- [specs/](../specs/) - 完整開發規範
- [reference/shared-imports-guide.md](../reference/shared-imports-guide.md) - 共用模組使用

### 外部文檔
- [Angular 官方文檔](https://angular.dev)
- [NG-ZORRO 組件文檔](https://ng.ant.design)
- [ng-alain 框架文檔](https://ng-alain.com)
- [Supabase 文檔](https://supabase.com/docs)

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊  
**文檔數量**: 26 個指南文檔  
**適用專案**: ng-alain-gighub v2.0
