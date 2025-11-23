# 系統架構文檔 (System Architecture)

> **目的**: 本目錄包含 ng-alain-gighub 專案的完整系統架構設計文檔與圖表

## 目標讀者 (Audience)

- 架構師
- 技術主管
- 資深開發者
- 新成員入門
- AI Agents

## 文檔清單

### 系統總覽 (System Overview)

- **01-system-architecture-mindmap.mermaid.md** - 系統架構思維導圖
  - 完整系統架構概覽
  - 核心模組關係
  - 技術棧配置

- **02-project-structure-flowchart.mermaid.md** - 專案結構流程圖
  - 目錄結構
  - 檔案組織
  - 模組劃分

- **03-system-context-diagram.mermaid.md** - 系統上下文圖
  - 系統邊界
  - 外部依賴
  - 使用者角色

### 業務流程 (Business Process)

- **04-business-process-flowchart.mermaid.md** - 業務流程圖
  - 核心業務流程
  - 使用者旅程
  - 工作流程

- **05-account-layer-flowchart.mermaid.md** - 帳戶層流程圖
  - 帳戶層級結構
  - 權限模型
  - 組織架構

### 資料架構 (Data Architecture)

- **06-entity-relationship-diagram.mermaid.md** - 實體關係圖
  - 51 張資料表關係
  - 主鍵外鍵
  - 表關聯

- **07-data-lifecycle-etl-flowchart.mermaid.md** - 資料生命週期 ETL 流程圖
  - 資料流向
  - ETL 處理
  - 資料轉換

- **08-storage-bucket-structure-view.mermaid.md** - Storage Bucket 結構視圖
  - 儲存桶組織
  - 檔案管理
  - 權限配置

- **09-security-rls-permission-matrix.md** - 安全與 RLS 權限矩陣
  - Row Level Security 策略
  - 權限矩陣
  - 安全模型

### 技術架構 (Technical Architecture)

- **10-container-diagram.mermaid.md** - 容器圖
  - 前後端分離
  - 容器部署
  - 服務通訊

- **11-component-module-view.mermaid.md** - 元件模組視圖
  - Angular 模組結構
  - 元件層級
  - 服務注入

- **12-component-module-view-supplement.md** - 元件模組視圖補充
  - 詳細說明
  - 設計決策
  - 實作細節

### 行為模型 (Behavioral Models)

- **13-sequence-diagram.mermaid.md** - 序列圖
  - 互動流程
  - 訊息傳遞
  - 時間序列

- **14-state-diagram.mermaid.md** - 狀態圖
  - 狀態轉換
  - 事件觸發
  - 狀態管理

- **15-domain-event-timeline.mermaid.md** - 領域事件時間軸圖
  - 事件溯源
  - 時間軸
  - 事件流

### 基礎設施 (Infrastructure)

- **17-supabase-architecture-flowchart.mermaid.md** - Supabase 架構流程圖
  - Supabase 服務
  - 資料庫設計
  - 實時功能

- **18-deployment-infrastructure-view.mermaid.md** - 部署基礎設施視圖
  - 部署架構
  - 環境配置
  - CI/CD 管道

### 完整架構 (Complete Architecture)

- **20-complete-architecture-flowchart.mermaid.md** - 完整架構流程圖 ⭐⭐⭐⭐⭐
  - **Git-like 分支模型**
  - 主分支與組織分支
  - PR 工作流程
  - 資料同步機制

- **21-architecture-review-report.md** - 架構審查報告 ⭐⭐⭐⭐⭐
  - 生產就緒評估
  - 架構決策記錄
  - 風險分析
  - 優化建議

## 使用方法 (Usage)

### 快速理解系統
推薦閱讀順序（新成員）：
1. **01-system-architecture-mindmap.mermaid.md** - 整體概念
2. **20-complete-architecture-flowchart.mermaid.md** - Git-like 分支模型
3. **21-architecture-review-report.md** - 深入理解架構決策

### 架構設計參考
進行架構設計時：
1. 參考 **03-system-context-diagram.mermaid.md** 理解系統邊界
2. 查閱 **10-container-diagram.mermaid.md** 了解容器部署
3. 使用 **13-sequence-diagram.mermaid.md** 設計互動流程

### 資料庫設計
資料庫相關設計：
1. **06-entity-relationship-diagram.mermaid.md** - 查看表關係
2. **09-security-rls-permission-matrix.md** - 設計 RLS 策略
3. 參考 [reference/sql-schema-definition.md](../reference/sql-schema-definition.md)

## 核心架構概念

### Git-like 分支模型 🌟
專案採用類似 Git 的分支模型進行專案管理：
- **主分支 (Main Branch)**: 業主控制，正式版本
- **組織分支 (Organization Branch)**: 協作者控制，開發版本
- **Pull Request 機制**: 審查與合併流程
- **暫存區設計**: 48 小時可撤回機制

詳見：**20-complete-architecture-flowchart.mermaid.md**

### 51 張資料表架構 🗄️
系統包含 51 張資料表，分為 11 個業務模組：
- 使用者與認證 (5 張表)
- 專案管理 (8 張表)
- 工作區系統 (3 張表)
- 任務與待辦 (7 張表)
- ...

詳見：[reference/sql-schema-definition.md](../reference/sql-schema-definition.md)

### 核心設計原則 📐
1. **暫存區機制**: 所有變更先進暫存區，48 小時內可撤回
2. **待辦中心**: 五種狀態統一管理（建議、未指派、進行中、已完成、已拒絕）
3. **問題同步**: 問題立即同步至主分支，無需等待 PR
4. **活動記錄**: 集中記錄所有操作，支援審計與追蹤

## Mermaid 圖表使用

本目錄的 `.mermaid.md` 檔案包含 Mermaid 圖表語法。

### 在 VSCode 中查看
安裝 [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) 擴充套件。

### 在 GitHub 中查看
GitHub 原生支援 Mermaid 圖表渲染，直接在瀏覽器中查看即可。

### 線上編輯
使用 [Mermaid Live Editor](https://mermaid.live/) 線上編輯與預覽。

## 架構決策記錄 (ADR)

重大架構決策記錄在：
- **21-architecture-review-report.md** - 完整的架構審查與決策

## 參考資源 (References)

### 架構方法論
- [C4 Model](https://c4model.com/) - 軟體架構圖表模型
- [Arc42](https://arc42.org/) - 架構文檔模板
- [ADR](https://adr.github.io/) - 架構決策記錄

### 設計模式
- [Microservices Patterns](https://microservices.io/patterns/)
- [Cloud Design Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/)
- [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/)

### 圖表工具
- [Mermaid 文檔](https://mermaid.js.org/)
- [PlantUML](https://plantuml.com/)
- [Draw.io](https://www.drawio.com/)

---

**最後更新**: 2025-01-20  
**維護者**: 架構團隊  
**文檔數量**: 18 個架構文檔  
**架構版本**: v2.0 (Git-like 分支模型 + 51 張資料表)
