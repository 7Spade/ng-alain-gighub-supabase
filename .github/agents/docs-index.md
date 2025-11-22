# Docs Index for Agents

> **目的**：把 `docs/` 目錄內最常用的規範、架構與流程文件映射到單一查詢入口，協助 Context7 / Sequential Thinking / Software Planning Tool 快速定位來源。所有列出的路徑皆可直接在 Cursor / GitHub 中開啟。

## 🔧 使用方式
1. **Context7 查詢 →** 先以 `@C7 "<topic>"` 搜尋 Angular / ng-alain / Supabase 官方資料，確認關鍵字。
2. **比對本索引 →** 依任務性質找到對應分類，開啟建議文件深入閱讀。
3. **Sequential Thinking (`@S7`) →** 根據文件要求拆解目標、輸入/輸出、風險。
4. **Software Planning Tool (`@SPT`) →** 把文檔中的必跑指令、依賴與測試納入計畫。
5. **實作 / 審查 →** 在 PR / 交付敘述中引用本索引列出的檔案，確保可追溯。

## 📚 快速索引
| 類別 | 主要文件 | 摘要 |
| --- | --- | --- |
| 架構與總覽 | `docs/00-開發作業指引.md`, `docs/27-完整架構流程圖.mermaid.md`, `docs/28-架構審查報告.md` | 團隊統一流程、Git-like Branch 模型、視覺化架構圖與審查依據 |
| 規劃與工作流程 | `docs/24-開發前檢查清單.md`, `docs/28-開發工作流程.md`, `docs/25-快速開始指南.md` | 任務開展前的檢查項、拆解步驟、環境建立流程 |
| 模組與元件 | `docs/40-共用元件清單.md`, `docs/45-SHARED_IMPORTS-使用指南.md`, `docs/38-ng-zorro-antd-組件清單與CLI指令.md` | SHARED_IMPORTS 定義、共用元件職責、NG-ZORRO 元件與 CLI 指令 |
| 資料與 API | `docs/22-完整SQL表結構定義.md`, `docs/23-資料表清單總覽.md`, `docs/26-API-接口詳細文檔.md`, `docs/27-資料模型對照表.md` | 51 張資料表欄位、模組分群、API 參數與模型映射 |
| 安全與權限 | `docs/34-安全檢查清單.md`, `docs/50-RLS策略開發指南.md`, `docs/09-安全與-RLS-權限矩陣.md` | Supabase RLS、前後端權限、依賴審查與密鑰控管 |
| 測試與品質 | `docs/31-測試指南.md`, `docs/48-代碼審查規範.md`, `docs/33-效能優化指南.md` | 單元/端對端測試基線、Code Review 要求、效能診斷 |
| 部署與監控 | `docs/32-部署指南.md`, `docs/18-部署基礎設施視圖.mermaid.md`, `docs/46-監控與告警配置指南.md` | CI/CD、Infra 架構、可觀測性與告警流程 |
| Agent 與協作 | `docs/43-Agent開發指南與限制說明.md`, `AGENTS.md`, `docs/41-AI助手角色配置.md` | AI Agent 規範、角色設定、上下文同步方式 |
| 背景與脈絡 | `docs/fyi-architecture.md`, `docs/fyi-development.md`, `docs/藍圖實現狀況分析報告.md` | 歷史決策、背景限制、藍圖進度與依賴 |

> **提示**：若索引未涵蓋的檔案，可搜尋 `docs/` 或參考 `docs/README.md` 的完整清單，再將結果補回本文件。

## 🧭 類別詳解

### 1. 架構與總覽
- `@file docs/00-開發作業指引.md`：專案使命、標準作業流程、Context7/Sequential Thinking 工作流。
- `@file docs/27-完整架構流程圖.mermaid.md`：Git-like Branch、Supabase、ng-alain 前端流向圖。
- `@file docs/28-架構審查報告.md`：審查項目、KPI、風險清單。

### 2. 規劃與工作流程
- `@file docs/24-開發前檢查清單.md`：開始開發前的必備檢查。
- `@file docs/28-開發工作流程.md`：SOP、責任分工、審查節點。
- `@file docs/25-快速開始指南.md`：環境設定、指令與啟動步驟。

### 3. 模組與元件
- `@file docs/45-SHARED_IMPORTS-使用指南.md`：共享導入策略、禁忌。
- `@file docs/40-共用元件清單.md`：每個共享組件的 selector、inputs/outputs。
- `@file docs/38-ng-zorro-antd-組件清單與CLI指令.md`：Zorro 元件支援度、CLI 指令。

### 4. 資料與 API
- `@file docs/22-完整SQL表結構定義.md`：51 表欄位、索引、關聯。
- `@file docs/23-資料表清單總覽.md`：模組分層、資料責任。
- `@file docs/26-API-接口詳細文檔.md`：REST 定義、錯誤碼。
- `@file docs/27-資料模型對照表.md`：前端模型 ↔ 資料庫欄位映射。

### 5. 安全與權限
- `@file docs/34-安全檢查清單.md`：依賴審查、密鑰管理、回報流程。
- `@file docs/50-RLS策略開發指南.md`：Supabase RLS 設計、測試方法。
- `@file docs/09-安全與-RLS-權限矩陣.md`：跨模組權限矩陣、角色/branch 對應。

### 6. 測試與品質
- `@file docs/31-測試指南.md`：測試矩陣、覆蓋率目標。
- `@file docs/48-代碼審查規範.md`：CR 流程與審查清單。
- `@file docs/33-效能優化指南.md`：前端/後端效能 best practices。

### 7. 部署與監控
- `@file docs/32-部署指南.md`：build、deploy、rollback。
- `@file docs/18-部署基礎設施視圖.mermaid.md`：Infra 拓樸、各服務角色。
- `@file docs/46-監控與告警配置指南.md`：可觀測性、告警閾值。

### 8. Agent 與協作
- `@file docs/43-Agent開發指南與限制說明.md`：AI 協作邊界、輸出格式。
- `@file AGENTS.md`：高層決策、規範索引。
- `@file docs/41-AI助手角色配置.md`：Agent persona 與權限。

### 9. 背景與脈絡
- `@file docs/fyi-architecture.md`、`docs/fyi-development.md`：設計決策、演進紀錄。
- `@file docs/藍圖實現狀況分析報告.md`：藍圖里程碑與阻塞。

## 🗂️ 維護指引
1. **新增文件**：在 `docs/` 加入新指南後，立刻補充本索引並在 PR 描述中記錄。
2. **版本同步**：若文件大幅改版，請在相對應 agent（如 Angular / Security）中更新引用。
3. **自動化建議**：可用 `rg "docs/" -g "*.md"` 搜尋新檔案、或用 `ls docs` 產生列表後人工分類。

---
**版本**：v1.0（2025-11-18）  
**維護者**：AI Agents 小組
