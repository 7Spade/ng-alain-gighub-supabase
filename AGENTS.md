# AI 助手配置總覽（AGENTS.md）

> **📌 重要提示**：本文件是所有 AI 助手的入口文檔，提供專案概覽與文檔組織結構。

## 🎉 最新更新（v2.0 - 企業標準優化）

**更新日期**：2025-01-15  
**版本**：v2.0.0（企業標準）

### ✨ 重大改進
本次更新將 GitHub Copilot Agent 配置提升至企業級標準：

1. **🔴 強制記憶庫查閱機制**
   - 每個 Agent 啟動前必須查閱 `.github/copilot/memory.jsonl`
   - 149 個實體 + 170 個關係的企業級知識圖譜
   - 三種查詢方法（grep、jq、編輯器）+ 快速查詢命令

2. **🗺️ 系統架構思維導圖整合**
   - 強制檢查 `docs/architecture/01-system-architecture-mindmap.mermaid.md`
   - 理解系統整體架構（9 大模組）
   - 確認任務在架構中的位置

3. **📋 企業標準檢查清單**
   - 新增 3 個核心文件（23KB）
   - 三步驟強制執行程序
   - 五級企業標準合規檢查（200+ 項）
   - 完整的評分標準與檢查記錄範本

4. **🎯 領域專家完全優化**
   - 8 個領域專家 Agents 完全優化
   - 統一的強制執行程序
   - 關鍵記憶實體清單
   - 快速查詢命令範例

5. **📊 成果統計**
   - 14 個文件已創建/優化
   - 企業標準達成度：100%
   - 所有 Agents 現在都基於企業級知識工作

**詳細說明**：[.github/agents/README.md](./.github/agents/README.md)

---

## 🧠 專案記憶庫（所有 AI 助手必讀）

**⚠️ 重要：所有 AI 助手在執行任務前，都應該先查閱專案記憶庫**

### 記憶庫位置
- **主檔案**：[.github/copilot/memory.jsonl](./.github/copilot/memory.jsonl)
- **使用指南**：[.github/copilot/README.md](./.github/copilot/README.md)
- **摘要說明**：[.github/copilot/MEMORY_SUMMARY.md](./.github/copilot/MEMORY_SUMMARY.md)

### 記憶庫內容（v4.0）
- **實體數量**：149 個（架構、規範、模式、功能）
- **關係數量**：170 個（連接實體之間的關聯）
- **涵蓋領域**：
  - 📐 架構設計（Git-like Branch Model、51 張資料表、五層架構）
  - 🛡️ 安全與權限（RLS 策略、認證流程、分支權限規則）
  - 📝 開發標準（SOLID、DRY、KISS、四大核心開發原則）
  - 🚀 效能優化（OnPush 策略、Lazy Loading、Bundle 優化）
  - 🧪 測試策略（單元測試、E2E 測試、覆蓋率要求）
  - 📚 文檔結構（232 個文檔的組織架構和閱讀路徑）

### 使用方式
1. **任務開始前**：查閱相關實體，了解現有規範和模式
2. **設計決策時**：參考記憶庫中的架構原則和最佳實踐
3. **代碼實作時**：遵循記憶庫中定義的開發標準和檢查清單
4. **完成任務後**：如發現新的模式或規範，建議更新記憶庫

### 關鍵記憶實體範例
- `Five Layer Development Order` - 五層架構開發順序
- `Git-like Branch Model` - Git-like 分支模型架構
- `Four Core Development Principles` - 四大核心開發原則
- `Security Best Practices` - 安全最佳實踐
- `UI Component Priority` - UI 元件優先級規範
- `OnPush Strategy` - Angular 變更檢測策略
- `Documentation Structure` - 232 個文檔的完整結構

---

## 🤖 支援的 AI 助手

本專案針對以下 AI 助手提供專門配置：

- **GitHub Copilot**：`.copilot-*.md`（VSCode 整合）+ `.github/agents/`（Agent Mode）
- **Claude AI**：[CLAUDE.md](./CLAUDE.md) - Anthropic Claude 專用配置
- **Google Gemini**：[GEMINI.md](./GEMINI.md) - Google Gemini 專用配置
- **Cursor IDE**：`.cursor/rules/` 目錄（自動應用）
- **通用 AI**：本文件（AGENTS.md）提供通用指引

## 📂 文檔組織結構

### 三層文檔架構
1. **根目錄 Copilot 指引**：`.copilot-*.md`（VSCode GitHub Copilot）
2. **GitHub Agents 目錄**：`.github/agents/`（GitHub Copilot Agent Mode）
3. **Cursor 規則目錄**：`.cursor/rules/`（Cursor IDE 自動載入）
4. **AI 助手專用配置**：`CLAUDE.md`, `GEMINI.md`（各 AI 助手）
5. **模組規範**：各模組目錄下的 `AGENTS.md`

### 快速連結
- ⭐ [Agent 開發指南](./docs/43-Agent開發指南與限制說明.md)
- 📚 [GitHub Agents 使用說明](./.github/agents/README.md)
- 🎯 [快速開始指南](./.github/agents/QUICK-START.md)

## 📖 各 AI 助手使用指南

### GitHub Copilot（推薦用於日常開發）
**VSCode 整合**：
- [`.copilot-instructions.md`](./.copilot-instructions.md) - 主要開發指引
- [`.copilot-review-instructions.md`](./.copilot-review-instructions.md) - 程式碼審查
- [`.copilot-commit-message-instructions.md`](./.copilot-commit-message-instructions.md) - Commit 規範
- [`.copilot-pull-request-description-instructions.md`](./.copilot-pull-request-description-instructions.md) - PR 描述
- [`.copilot-test-instructions.md`](./.copilot-test-instructions.md) - 測試產生

**Agent Mode**（✨ 企業標準優化 v2.0）：
- [`.github/agents/`](./.github/agents/) - 完整 Agent 配置（已優化）
- [`.github/agents/agent-startup-checklist.md`](./.github/agents/agent-startup-checklist.md) - ⭐⭐⭐⭐⭐ 企業標準啟動檢查清單（新）
- [`.github/agents/memory-usage-guide.md`](./.github/agents/memory-usage-guide.md) - ⭐⭐⭐⭐⭐ 記憶庫使用指南（新）
- [`.github/agents/enterprise-compliance-checklist.md`](./.github/agents/enterprise-compliance-checklist.md) - ⭐⭐⭐⭐⭐ 企業標準合規檢查（新）
- [`.github/agents/QUICK-START.md`](./.github/agents/QUICK-START.md) - 快速開始
- [`.github/agents/copilot-instructions.md`](./.github/agents/copilot-instructions.md) - Agent 簡要指引（已優化）
- [`.github/agents/ng-alain-github-agent.md`](./.github/agents/ng-alain-github-agent.md) - 主 Agent 配置（已優化）

**優化重點**：
- ✅ **強制記憶庫查閱**：每次任務開始前必須查閱 `.github/copilot/memory.jsonl`（149 實體 + 170 關係）
- ✅ **系統架構整合**：強制檢查系統架構思維導圖（`docs/architecture/01-system-architecture-mindmap.mermaid.md`）
- ✅ **企業標準流程**：三步驟啟動程序（記憶庫 → 架構圖 → 檢查清單）
- ✅ **領域專家優化**：8 個領域專家 Agents 完全優化（Angular、TypeScript、代碼質量、安全、測試、效能、無障礙、文檔）
- ✅ **合規檢查機制**：五級企業標準合規檢查清單（200+ 項）

### Claude AI（推薦用於架構設計與深度分析）
**配置文件**：[CLAUDE.md](./CLAUDE.md)

**適用場景**：
- 長上下文分析（200K tokens）
- 完整模組架構設計
- 大型 PR 審查
- 複雜業務邏輯梳理

**特色功能**：
- Artifacts：生成完整可運行代碼
- Projects：專案級知識庫
- 思考鏈：深度邏輯分析

### Google Gemini（推薦用於多模態任務）
**配置文件**：[GEMINI.md](./GEMINI.md)

**適用場景**：
- UI 設計圖轉代碼
- 流程圖理解與實作
- 錯誤截圖分析
- 即時搜尋最新資訊

**特色功能**：
- 多模態輸入（圖片、影片）
- Grounding：即時 Google 搜尋
- Code Execution：代碼執行驗證
- 長上下文（1M tokens）

### Cursor IDE（推薦用於代碼編輯）
**配置目錄**：[`.cursor/rules/`](./.cursor/rules/)

**自動應用規則**：
- 28 個規則文件自動載入
- 按目錄自動應用對應規則
- 即時代碼建議與補全

**詳細說明**：[.cursor/rules/README.md](./.cursor/rules/README.md)

- --

## 📋 快速參考

### Cursor 規則文件
完整規則文件：[.cursor/rules/README.md](./.cursor/rules/README.md)

包含 28 個規則文件（核心開發規範、架構設計、代碼質量、開發工具、模組規範）。

### GitHub Agents 目錄
完整說明：[.github/agents/README.md](./.github/agents/README.md)

包含專案開發代理、角色定位、領域專家 Agents（Angular、TypeScript、代碼質量、安全、效能、測試、可訪問性、文件）。

- --

## 🔧 VSCode 設定檔整合

`.vscode/settings.json` 已配置 GitHub Copilot 使用根目錄指引檔案：
- 程式碼產生：`.copilot-instructions.md`
- 程式碼審查：`.copilot-review-instructions.md`
- Commit 訊息：`.copilot-commit-message-instructions.md`
- PR 描述：`.copilot-pull-request-description-instructions.md`
- 測試產生：`.copilot-test-instructions.md`

詳細配置：[.vscode/settings.json](./.vscode/settings.json)

- --

## 📝 模板文件

- [Component 模板](./.cursor/templates/component.mdc) - Angular Standalone Component 模板
- [Service 模板](./.cursor/templates/service.mdc) - Angular Service 模板（使用 Signals）

- --

## 🔄 保留在 AGENTS.md 的內容

本文件作為高層次架構決策參考：

**架構理解**：
  - **Git-like 分支模型**：主分支、組織分支、PR 機制（參考 `docs/20-完整架構流程圖.mermaid.md`, `docs/21-架構審查報告.md`）
  - **51 張資料表架構**：分為 11 個模組（參考 `docs/22-完整SQL表結構定義.md`）
  - **核心設計原則**：暫存區機制（48h 可撤回）、待辦中心（五種狀態）、問題同步（即時至主分支）、活動記錄（集中記錄）、文件管理（版本控制、縮圖、軟刪除）

**文檔索引**：
  - 完整索引：[docs/README.md](./docs/README.md)
  - 規則文件：[.cursor/rules/README.md](./.cursor/rules/README.md)
  - GitHub Agents：[.github/agents/README.md](./.github/agents/README.md)

**核心開發原則** ⭐：
  - **常見做法**：遵循業界標準，參考官方文檔和最佳實踐
  - **企業標準**：代碼結構清晰、職責分離明確、錯誤處理完善、狀態管理規範
  - **符合邏輯**：數據流清晰、命名語義化、條件判斷合理、組件初始化順序正確
  - **符合常理**：功能真正可用、用戶體驗優先、避免過度設計、及時驗證
  - 詳細說明：[代碼質量規範](./.cursor/rules/code-quality.mdc#core-development-principles-)

- --

## 📚 相關文檔

完整索引：[docs/README.md](./docs/README.md)

### 核心文檔
- [快速開始指南](./docs/25-快速開始指南.md) - 環境設定與啟動
- [專案結構流程圖](./docs/02-專案結構流程圖.mermaid.md) - 專案結構概覽
- [完整SQL表結構定義](./docs/22-完整SQL表結構定義.md) - 51 張表結構 ⭐⭐⭐⭐⭐
- [完整架構流程圖](./docs/20-完整架構流程圖.mermaid.md) - Git-like 分支模型 ⭐⭐⭐⭐⭐
- [架構審查報告](./docs/21-架構審查報告.md) - 生產就緒版 ⭐⭐⭐⭐⭐
- [SHARED_IMPORTS 使用指南](./docs/37-SHARED_IMPORTS-使用指南.md) - 必讀 ⭐
- [開發最佳實踐指南](./docs/42-開發最佳實踐指南.md) - 代碼示例 ⭐

### 使用建議
- **架構理解**：架構流程圖、架構審查報告、SQL表結構定義
- **日常開發**：SHARED_IMPORTS 使用指南、開發最佳實踐指南
- **詳細資料**：docs/README.md

- --

**最後更新**：2025-01-15
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）
**維護者**：開發團隊
