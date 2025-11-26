# GitHub Copilot Custom Agents

本文件說明本專案保留的 GitHub Copilot 自訂代理配置，專為 Angular / ng-alain / Supabase 企業級開發設計。

**最後更新**：2025-11-26  
**檔案位置**：[.github/agents/](../.github/agents/)  
**代理數量**：49 個

---

## 如何使用 GitHub Copilot Agent

在 VS Code 或 GitHub Copilot Chat 中，您可以透過 `@` 符號呼叫特定代理。例如：
- `@0-ng-ArchAI-v1` - 呼叫 ng-alain 企業級架構師
- `@accessibility` - 呼叫無障礙專家

---

## 代理分類索引

### 專案專屬代理（Project-Specific Agents）

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [0-ng-ArchAI-v1.agent.md](../.github/agents/0-ng-ArchAI-v1.agent.md) | ng-alain Enterprise Architect | Angular 20+ / ng-alain / Supabase 企業級開發 |
| [0-ng-governance-v1.md](../.github/agents/0-ng-governance-v1.md) | ng-alain Governance Rules | ng-alain 企業級開發規範文件 |

---

### 架構與規劃類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [arch.agent.md](../.github/agents/arch.agent.md) | Senior Cloud Architect | 現代架構設計模式、NFR 需求分析、架構圖與文件產出 |
| [api-architect.agent.md](../.github/agents/api-architect.agent.md) | API Architect | API 設計、連接模式、韌性設計 |
| [adr-generator.agent.md](../.github/agents/adr-generator.agent.md) | ADR Generator | 建立架構決策記錄（ADR），結構化格式便於 AI 理解 |
| [hlbpa.agent.md](../.github/agents/hlbpa.agent.md) | HLBPA | 高階架構文件撰寫與審查、遺留系統研究 |

---

### 規劃與研究類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [plan.agent.md](../.github/agents/plan.agent.md) | Plan Mode | 策略規劃與架構分析，實作前的深思熟慮 |
| [planner.agent.md](../.github/agents/planner.agent.md) | Planning Mode | 功能開發或重構的實作計畫產出 |
| [implementation-plan.agent.md](../.github/agents/implementation-plan.agent.md) | Implementation Plan | 新功能或重構的實作計畫產出 |
| [task-planner.agent.md](../.github/agents/task-planner.agent.md) | Task Planner | 可執行的任務規劃（by microsoft/edge-ai）|
| [task-researcher.agent.md](../.github/agents/task-researcher.agent.md) | Task Researcher | 專案分析的深度研究（by microsoft/edge-ai）|
| [research-technical-spike.agent.md](../.github/agents/research-technical-spike.agent.md) | Technical Spike Research | 技術驗證與深度研究 |
| [prd.agent.md](../.github/agents/prd.agent.md) | PRD Generator | 產品需求文件（PRD）產出，含使用者故事、驗收標準 |
| [specification.agent.md](../.github/agents/specification.agent.md) | Specification | 規格文件產出與更新 |
| [refine-issue.agent.md](../.github/agents/refine-issue.agent.md) | Refine Issue | 需求精煉：驗收標準、技術考量、邊界案例、NFR |

---

### 程式碼品質類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [wg-code-alchemist.agent.md](../.github/agents/wg-code-alchemist.agent.md) | WG Code Alchemist | Clean Code 原則與 SOLID 設計轉換 |
| [wg-code-sentinel.agent.md](../.github/agents/wg-code-sentinel.agent.md) | WG Code Sentinel | 程式碼安全性審查 |
| [janitor.agent.md](../.github/agents/janitor.agent.md) | Janitor | 程式碼清理、簡化、技術債務處理 |
| [tech-debt-remediation-plan.agent.md](../.github/agents/tech-debt-remediation-plan.agent.md) | Tech Debt Plan | 技術債務修復計畫產出 |
| [gilfoyle.agent.md](../.github/agents/gilfoyle.agent.md) | Gilfoyle | 毒舌但精準的程式碼審查（Silicon Valley 風格）|

---

### 除錯與測試類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [debug.agent.md](../.github/agents/debug.agent.md) | Debug Mode | 系統性除錯，識別、分析並解決 bug |
| [playwright-tester.agent.md](../.github/agents/playwright-tester.agent.md) | Playwright Tester | Playwright E2E 測試開發 |
| [tdd-red.agent.md](../.github/agents/tdd-red.agent.md) | TDD Red | TDD 紅燈階段：撰寫失敗測試 |
| [tdd-green.agent.md](../.github/agents/tdd-green.agent.md) | TDD Green | TDD 綠燈階段：最小實作讓測試通過 |
| [tdd-refactor.agent.md](../.github/agents/tdd-refactor.agent.md) | TDD Refactor | TDD 重構階段：提升品質與安全性 |

---

### 無障礙與 SEO 類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [accessibility.agent.md](../.github/agents/accessibility.agent.md) | Accessibility Expert | WCAG 2.1/2.2 無障礙功能、包容性 UX、a11y 測試 |
| [search-ai-optimization-expert.agent.md](../.github/agents/search-ai-optimization-expert.agent.md) | SEO/AEO/GEO Expert | 現代搜尋優化：SEO、AI 答案引擎優化、生成式引擎優化 |

---

### 文件與教學類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [code-tour.agent.md](../.github/agents/code-tour.agent.md) | CodeTour Expert | VSCode CodeTour 檔案建立與維護 |
| [technical-content-evaluator.agent.md](../.github/agents/technical-content-evaluator.agent.md) | Content Evaluator | 技術訓練教材、文件、教學內容評估 |
| [mentor.agent.md](../.github/agents/mentor.agent.md) | Mentor | 工程師指導與支援 |
| [demonstrate-understanding.agent.md](../.github/agents/demonstrate-understanding.agent.md) | Demonstrate Understanding | 透過引導式問答驗證對程式碼的理解 |

---

### PR 與 Issue 管理類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [address-comments.agent.md](../.github/agents/address-comments.agent.md) | Address Comments | 回應 PR 評論 |
| [critical-thinking.agent.md](../.github/agents/critical-thinking.agent.md) | Critical Thinking | 挑戰假設，確保最佳解決方案 |

---

### Prompt 工程類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [prompt-builder.agent.md](../.github/agents/prompt-builder.agent.md) | Prompt Builder | 高品質 Prompt 工程（by microsoft/edge-ai）|
| [prompt-engineer.agent.md](../.github/agents/prompt-engineer.agent.md) | Prompt Engineer | Prompt 分析與改進（基於 OpenAI 最佳實踐）|

---

### 資料庫類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [postgresql-dba.agent.md](../.github/agents/postgresql-dba.agent.md) | PostgreSQL DBA | PostgreSQL 資料庫管理（適用於 Supabase）|

---

### TypeScript / MCP 類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [typescript-mcp-expert.agent.md](../.github/agents/typescript-mcp-expert.agent.md) | TypeScript MCP Expert | TypeScript Model Context Protocol 伺服器開發 |
| [context7.agent.md](../.github/agents/context7.agent.md) | Context7 Expert | 使用最新文件查詢函式庫版本與最佳實踐 |

---

### Angular / Electron 類

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [electron-angular-native.agent.md](../.github/agents/electron-angular-native.agent.md) | Electron Angular Review | Electron + Angular + 原生整合層的程式碼審查 |

---

### 進階自主代理（Advanced Autonomous Agents）

這些代理具備較高的自主性，適合複雜任務或需要較少監督的場景：

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [4.1-Beast.agent.md](../.github/agents/4.1-Beast.agent.md) | GPT 4.1 Beast | 頂級程式碼代理，強大自主能力 |
| [gpt-5-beast-mode.agent.md](../.github/agents/gpt-5-beast-mode.agent.md) | Beast Mode 2.0 | GPT-5 專屬強大自主代理 |
| [Thinking-Beast-Mode.agent.md](../.github/agents/Thinking-Beast-Mode.agent.md) | Thinking Beast Mode | 量子認知架構與對抗式智慧 |
| [Ultimate-Transparent-Thinking-Beast-Mode.agent.md](../.github/agents/Ultimate-Transparent-Thinking-Beast-Mode.agent.md) | Ultimate Beast Mode | 終極透明思維模式 |
| [voidbeast-gpt41enhanced.agent.md](../.github/agents/voidbeast-gpt41enhanced.agent.md) | VoidBeast Enhanced | 進階全端開發代理（多模式）|
| [software-engineer-agent-v1.agent.md](../.github/agents/software-engineer-agent-v1.agent.md) | Software Engineer v1 | 專家級軟體工程代理 |
| [principal-software-engineer.agent.md](../.github/agents/principal-software-engineer.agent.md) | Principal Engineer | 首席工程師級指導 |

---

### 工作流程代理（Workflow Agents）

| 代理檔案 | 名稱 | 適用場景 |
|----------|------|----------|
| [blueprint-mode.agent.md](../.github/agents/blueprint-mode.agent.md) | Blueprint Mode | 結構化工作流程執行（Debug/Express/Main/Loop）|
| [blueprint-mode-codex.agent.md](../.github/agents/blueprint-mode-codex.agent.md) | Blueprint Mode Codex | 最小工具使用的結構化工作流程 |
| [meta-agentic-project-scaffold.agent.md](../.github/agents/meta-agentic-project-scaffold.agent.md) | Project Scaffold | 專案工作流程建立與管理 |
| [simple-app-idea-generator.agent.md](../.github/agents/simple-app-idea-generator.agent.md) | App Idea Generator | 透過互動問答腦力激盪應用程式創意 |

---

## 使用建議

### 開發流程推薦

1. **需求階段**: `prd.agent.md` → `refine-issue.agent.md`
2. **規劃階段**: `plan.agent.md` → `implementation-plan.agent.md`
3. **開發階段**: `0-ng-ArchAI-v1.agent.md`（Angular 專案）
4. **測試階段**: `tdd-red.agent.md` → `tdd-green.agent.md` → `tdd-refactor.agent.md`
5. **審查階段**: `wg-code-sentinel.agent.md` → `accessibility.agent.md`
6. **重構階段**: `janitor.agent.md` → `tech-debt-remediation-plan.agent.md`

### 特定任務推薦

| 任務 | 推薦代理 |
|------|----------|
| Angular/ng-alain 開發 | `0-ng-ArchAI-v1.agent.md` |
| 架構設計 | `arch.agent.md` + `adr-generator.agent.md` |
| 程式碼審查 | `gilfoyle.agent.md`（直接）或 `wg-code-alchemist.agent.md`（建設性）|
| 除錯 | `debug.agent.md` |
| E2E 測試 | `playwright-tester.agent.md` |
| 無障礙 | `accessibility.agent.md` |
| 資料庫 | `postgresql-dba.agent.md` |

---

## 維護記錄

- **2025-11-26**: 更新文件以反映 Copilot 配置清理後的狀態
  - 移除：AEM、Amplitude、Apify、ARM、Atlassian、Comet、Diffblue、Droid、Drupal、Dynatrace、Elasticsearch、C++、Next.js、React、JFrog、Kusto、Laravel、LaunchDarkly、Microsoft Learn、Monday、MongoDB、MS SQL、Neo4j、Neon、Octopus、PagerDuty、Pimcore、Power BI、Power Platform、Shopify、StackHawk 等專用代理
  - 保留：49 個 Angular、TypeScript、通用開發、架構、測試、無障礙等相關代理
- **2025-11-25**: 從 awesome-copilot 複製有價值的 agents
- **2025-11-23**: 移除不適用的代理，保留最佳化的 ng-alain 專用代理

---

## 來源

部分代理精選自 [awesome-copilot](https://github.com/github/awesome-copilot) 開源專案。
