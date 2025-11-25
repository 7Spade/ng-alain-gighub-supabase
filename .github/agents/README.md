# GitHub Copilot Custom Agents

## 專案代理

本專案使用一個最佳化的自訂 GitHub Copilot 代理，專門為 ng-alain 企業級應用開發設計。

### 主要代理：`agent.agent.md`

**名稱**: `ng-alain-enterprise-architect`

**描述**: 企業級 Angular 20 + ng-alain + Supabase 智能開發助手

**核心功能**:
- 專精於 @delon 業務元件、ng-zorro-antd UI 整合
- Supabase 後端整合與資料建模
- Token 最佳化策略（三級任務分類系統）
- 企業級程式碼品質保證
- 完整的開發流程支援（需求分析 → 架構設計 → 程式碼實作 → 驗證）

**適用場景**:
- Angular 20 + ng-alain 框架專案
- 使用 @delon 業務元件庫
- ng-zorro-antd UI 元件
- Supabase 後端服務
- Less 樣式預處理器
- 企業級管理系統開發

**技術棧匹配**:
- ✅ Angular 20.3.x
- ✅ ng-alain 20.1.0
- ✅ @delon 業務元件
- ✅ ng-zorro-antd UI 庫
- ✅ TypeScript 5.9.x
- ✅ Less 樣式
- ✅ Supabase 整合
- ✅ Karma + Jasmine 測試

## 使用方式

此代理已自動整合至 GitHub Copilot，無需額外配置。在使用 Copilot 時，它會自動應用本專案的最佳實踐和開發規範。

## 代理特色

### 1. Token 最佳化策略
- **Tier 1**: 輕量級任務（直接處理，不呼叫 MCP）
- **Tier 2**: 中等任務（選擇性 MCP，1-3 次呼叫）
- **Tier 3**: 重量級任務（完整 MCP 工作流程）

### 2. MCP 整合
- sequential-thinking: 複雜任務推論
- software-planning-tool: 架構設計
- github MCP: 程式碼查詢與 PR 管理
- supabase MCP: 資料庫操作

### 3. 企業級品質標準
- TypeScript 嚴格型別檢查
- ng-alain 與 @delon 最佳實踐
- 完整的測試覆蓋
- 安全性與效能最佳化

## 額外代理（來自 awesome-copilot）

本專案從 [awesome-copilot](https://github.com/github/awesome-copilot) 精選以下輔助代理：

### `accessibility.agent.md`
**名稱**: Accessibility Expert  
**描述**: WCAG 無障礙功能專家，協助確保 UI 符合 WCAG 2.2 標準

### `debug.agent.md`
**名稱**: Debug Mode  
**描述**: 系統性調試助手，協助識別、分析並解決 bug

### `api-architect.agent.md`
**名稱**: API Architect  
**描述**: API 架構師，協助設計 API 連接與韌性模式

### `typescript-mcp-expert.agent.md`
**名稱**: TypeScript MCP Server Expert  
**描述**: TypeScript MCP 伺服器專家，協助開發 Model Context Protocol 伺服器

## 維護記錄

- **2025-11-25**: 從 awesome-copilot 複製有價值的 agents、prompts、instructions 和 collections
  - 新增: `accessibility.agent.md`、`debug.agent.md`、`api-architect.agent.md`、`typescript-mcp-expert.agent.md`
  - 新增目錄: `.github/prompts/`、`.github/collections/`
  - 新增 instructions: `angular.instructions.md`、`a11y.instructions.md`、`typescript-mcp-server.instructions.md`、`playwright-typescript.instructions.md`
- **2025-11-23**: 移除不適用的代理，保留最佳化的 ng-alain 專用代理
  - 移除: `ng-alain-gighub-supabase.agent.md`（SSR 專用，本專案不適用）
  - 移除: `onboarding.agent.md`、`review.agent.md`、`repo-name.agent.md`（空文件）
  - 保留: `agent.agent.md`（ng-alain 企業架構師）
