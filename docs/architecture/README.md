# 系統架構文檔 (Architecture Documentation)

> 企業級 Angular 20 + ng-alain + Supabase 應用程式架構文檔

**最後更新**：2025-11-27  
**維護者**：架構團隊  
**文檔數量**：20 個架構文檔  
**架構版本**：v2.1 (重組版)

---

## 📚 文檔總覽

### 🏛️ 基礎文檔 (00)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [00-architecture-design.md](./00-architecture-design.md) | **主要參考文檔** - 完整系統架構設計 | 所有人 |

> ⭐ 這是系統架構的**單一真相來源**，包含 ASCII 圖表和完整說明

---

### 🌐 系統總覽 (01-09)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [01-system-context.md](./01-system-context.md) | C4 系統上下文圖 - 系統邊界 | 所有人 |
| [02-architecture-mindmap.md](./02-architecture-mindmap.md) | 系統架構思維導圖 | 架構師 |
| [03-architecture-overview.md](./03-architecture-overview.md) | 完整架構流程圖 | 開發者 |

---

### 🧩 元件架構 (10-19)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [10-container-diagram.md](./10-container-diagram.md) | C4 容器圖 - 前後端分離 | 架構師 |
| [11-component-diagram.md](./11-component-diagram.md) | 元件與模組視圖 | 開發者 |
| [12-project-structure.md](./12-project-structure.md) | 專案結構流程圖 | 開發者 |

---

### 💾 資料架構 (20-29)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [20-entity-relationship.md](./20-entity-relationship.md) | 實體關係圖 (51 張資料表) | DBA |
| [21-data-lifecycle.md](./21-data-lifecycle.md) | 資料生命週期與 ETL | 資料工程師 |
| [22-storage-structure.md](./22-storage-structure.md) | Storage Bucket 結構 | DevOps |

---

### ⚡ 行為與事件 (30-39)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [30-business-process.md](./30-business-process.md) | 業務流程圖 | 業務分析師 |
| [31-sequence-diagrams.md](./31-sequence-diagrams.md) | 互動序列圖 | 開發者 |
| [32-state-diagrams.md](./32-state-diagrams.md) | 狀態機圖 | 開發者 |
| [33-domain-events.md](./33-domain-events.md) | 領域事件時間軸 | 架構師 |

---

### 🔐 安全與存取 (40-49)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [40-security-rls-matrix.md](./40-security-rls-matrix.md) | 安全與 RLS 權限矩陣 | 安全團隊 |
| [41-account-architecture.md](./41-account-architecture.md) | 帳戶層架構 | 開發者 |

---

### ☁️ 基礎設施 (50-59)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [50-supabase-architecture.md](./50-supabase-architecture.md) | Supabase 架構 | DevOps |
| [51-deployment-diagram.md](./51-deployment-diagram.md) | 部署基礎設施視圖 | DevOps |

---

### 📋 設計決策 (60-69)

| 文檔 | 描述 | 目標讀者 |
|------|------|----------|
| [60-layers-atomization.md](./60-layers-atomization.md) | 架構層原子化設計 | 架構師 |
| [61-architecture-review.md](./61-architecture-review.md) | 架構審查報告 | 利益相關者 |

---

## 🗺️ 建議閱讀路徑

### 👋 新成員入門

1. [00-architecture-design.md](./00-architecture-design.md) - 基礎架構
2. [01-system-context.md](./01-system-context.md) - 系統邊界
3. [11-component-diagram.md](./11-component-diagram.md) - 程式碼結構
4. [20-entity-relationship.md](./20-entity-relationship.md) - 資料模型

### 🏗️ 架構師路徑

1. [00-architecture-design.md](./00-architecture-design.md) - 完整參考
2. [60-layers-atomization.md](./60-layers-atomization.md) - 設計模式
3. [40-security-rls-matrix.md](./40-security-rls-matrix.md) - 安全模型
4. [61-architecture-review.md](./61-architecture-review.md) - 品質評估

### 🔧 DevOps 工程師路徑

1. [51-deployment-diagram.md](./51-deployment-diagram.md) - 基礎設施
2. [50-supabase-architecture.md](./50-supabase-architecture.md) - 後端服務
3. [22-storage-structure.md](./22-storage-structure.md) - 儲存管理

### 💼 業務分析師路徑

1. [30-business-process.md](./30-business-process.md) - 業務流程
2. [32-state-diagrams.md](./32-state-diagrams.md) - 狀態轉換
3. [33-domain-events.md](./33-domain-events.md) - 領域事件

---

## 📊 編號方案說明

本文檔採用**十進位分類法**組織：

| 區間 | 類別 | 文檔數 |
|------|------|--------|
| 00 | 基礎文檔 | 1 |
| 01-09 | 系統總覽 | 3 |
| 10-19 | 元件架構 | 3 |
| 20-29 | 資料架構 | 3 |
| 30-39 | 行為與事件 | 4 |
| 40-49 | 安全與存取 | 2 |
| 50-59 | 基礎設施 | 2 |
| 60-69 | 設計決策 | 2 |
| 70-89 | 預留擴展 | - |
| 90-99 | 歸檔文檔 | - |

---

## 🔑 核心架構概念

### Git-like 分支模型 🌟

專案採用類似 Git 的分支模型進行專案管理：

- **主分支 (Main Branch)**: 業主控制，正式版本
- **組織分支 (Organization Branch)**: 協作者控制，開發版本
- **Pull Request 機制**: 審查與合併流程
- **暫存區設計**: 48 小時可撤回機制

詳見：[03-architecture-overview.md](./03-architecture-overview.md)

### 51 張資料表架構 🗄️

系統包含 51 張資料表，分為 11 個業務模組：

- 使用者與認證 (5 張表)
- 專案管理 (8 張表)
- 工作區系統 (3 張表)
- 任務與待辦 (7 張表)
- ...更多詳見 [20-entity-relationship.md](./20-entity-relationship.md)

---

## 🔗 相關文檔

- [開發指南](/docs/guides/)
- [API 參考](/docs/reference/)
- [Supabase 配置](/docs/supabase/)
- [安全文檔](/docs/security/)
- [部署文檔](/docs/deployment/)

---

## 📐 架構方法論參考

- [C4 Model](https://c4model.com/) - 軟體架構圖表模型
- [Arc42](https://arc42.org/) - 架構文檔模板
- [ADR](https://adr.github.io/) - 架構決策記錄

---

## 🔧 查看 Mermaid 圖表

### 在 VSCode 中查看

安裝 [Markdown Preview Mermaid Support](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid) 擴充套件。

### 在 GitHub 中查看

GitHub 原生支援 Mermaid 圖表渲染，直接在瀏覽器中查看即可。

### 線上編輯

使用 [Mermaid Live Editor](https://mermaid.live/) 線上編輯與預覽。
