# ng-alain-gighub 文檔總覽與索引

> **目的**: 提供 ng-alain-gighub 專案的完整文檔導航和索引，幫助開發者和 AI Agents 快速定位所需文檔。

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者
- 技術主管
- AI Agents
- 新成員開發者

## 📑 目錄

- [📋 文檔分類總覽](#-文檔分類總覽)
  - [1. 根目錄文檔（8 個）](#1-根目錄文檔8-個)
    - [AI 助手配置文檔](#ai-助手配置文檔)
    - [開發指引文檔](#開發指引文檔)
  - [2. Copilot 配置文檔（5 個）](#2-copilot-配置文檔5-個)
    - [VSCode GitHub Copilot 指引](#vscode-github-copilot-指引)
  - [3. GitHub Agents 文檔（11 個）](#3-github-agents-文檔11-個)
    - [Agent 主要配置](#agent-主要配置)
    - [領域專家 Agents（8 個）](#領域專家-agents8-個)
  - [4. Cursor IDE 規則文檔（29 個）](#4-cursor-ide-規則文檔29-個)
    - [Cursor 規則總覽](#cursor-規則總覽)
    - [核心開發規範（28 個 .mdc 文件）](#核心開發規範28-個-mdc-文件)
  - [5. GitHub Copilot Memory（2 個）](#5-github-copilot-memory2-個)
  - [6. 專案文檔目錄（docs/ - 140+ 個）](#6-專案文檔目錄docs---140-個)
    - [6.1 核心規範文檔（00-14 編號）](#61-核心規範文檔00-14-編號)
    - [6.2 核心文檔（21-40 編號）](#62-核心文檔21-40-編號)
    - [6.3 進階指南（41-62 編號）](#63-進階指南41-62-編號)
    - [6.4 工作區上下文系統（5 個）](#64-工作區上下文系統5-個)
    - [6.5 NG-ZORRO 組件索引（73 個）](#65-ng-zorro-組件索引73-個)
    - [6.6 DELON 套件索引（11 個）](#66-delon-套件索引11-個)
    - [6.7 FYI 參考文檔（13 個）](#67-fyi-參考文檔13-個)
    - [6.8 其他專案文檔](#68-其他專案文檔)
  - [7. 源代碼模組文檔（8 個）](#7-源代碼模組文檔8-個)
    - [Core 模組](#core-模組)
    - [Layout 模組](#layout-模組)
    - [Routes 模組](#routes-模組)
    - [Shared 模組](#shared-模組)
  - [8. 工具與腳本文檔（4 個）](#8-工具與腳本文檔4-個)
  - [9. VSCode 配置文檔（1 個）](#9-vscode-配置文檔1-個)
- [📊 文檔統計](#-文檔統計)
  - [按目錄分類](#按目錄分類)
  - [按類型分類](#按類型分類)
- [🗂️ 建議的閱讀路徑](#-建議的閱讀路徑)
  - [新成員入門路徑](#新成員入門路徑)
  - [前端開發者路徑](#前端開發者路徑)
  - [後端開發者路徑](#後端開發者路徑)
  - [架構師路徑](#架構師路徑)
  - [AI 助手開發者路徑](#ai-助手開發者路徑)
- [🔍 快速查找](#-快速查找)
  - [按關鍵字查找](#按關鍵字查找)
  - [按優先級查找](#按優先級查找)
- [📝 維護建議](#-維護建議)
  - [文檔更新原則](#文檔更新原則)
  - [新增文檔指引](#新增文檔指引)

---


> 📚 **目的**：提供專案所有 Markdown 文檔的完整索引和分類導航

**最後更新**：2025-11-20
**總文檔數**：232 個
**架構版本**：v2.0（Git-like 分支模型，51 張資料表）
**技術棧**：Angular 20.3.x + NG-ZORRO 20.3.x + ng-alain 20.1.x + Supabase

- --

## 📋 文檔分類總覽

### 1. 根目錄文檔（8 個）

#### AI 助手配置文檔
| 文檔 | 說明 | 用途 |
|------|------|------|
| [AGENTS.md](../AGENTS.md) | AI 助手配置總覽（入口文檔） | 所有 AI 助手的統一入口 |
| [CLAUDE.md](../CLAUDE.md) | Claude AI 專用配置 | Anthropic Claude 使用指引 |
| [GEMINI.md](../GEMINI.md) | Google Gemini 專用配置 | Google Gemini 使用指引 |

#### 開發指引文檔
| 文檔 | 說明 | 用途 |
|------|------|------|
| [README.md](../README.md) | 專案主要說明文檔（英文） | 專案介紹與快速開始 |
| [README-zh_CN.md](../README-zh_CN.md) | 專案主要說明文檔（簡體中文） | 專案介紹與快速開始 |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | 貢獻指南 | 如何貢獻代碼 |

- --

### 2. Copilot 配置文檔（5 個）

#### VSCode GitHub Copilot 指引
| 文檔 | 說明 | 用途 |
|------|------|------|
| [.copilot-instructions.md](../.copilot-instructions.md) | 主要開發指引 | VSCode Copilot 代碼生成規範 |
| [.copilot-review-instructions.md](../.copilot-review-instructions.md) | 程式碼審查指引 | Code Review 規範 |
| [.copilot-commit-message-instructions.md](../.copilot-commit-message-instructions.md) | Commit 訊息規範 | Git Commit 格式 |
| [.copilot-pull-request-description-instructions.md](../.copilot-pull-request-description-instructions.md) | PR 描述規範 | Pull Request 撰寫格式 |
| [.copilot-test-instructions.md](../.copilot-test-instructions.md) | 測試產生指引 | 測試代碼生成規範 |

- --

### 3. GitHub Agents 文檔（11 個）

#### Agent 主要配置
| 文檔 | 說明 | 用途 |
|------|------|------|
| [.github/agents/README.md](../.github/agents/README.md) | GitHub Agents 總覽 | Agent 完整說明 |
| [.github/agents/QUICK-START.md](../.github/agents/QUICK-START.md) | 快速開始指南 | Agent 快速上手 |
| [.github/agents/copilot-instructions.md](../.github/agents/copilot-instructions.md) | Agent 簡要指引 | Copilot Agent Mode 規範 |
| [.github/agents/ng-alain-github-agent.md](../.github/agents/ng-alain-github-agent.md) | 專案開發代理 | 專案特定 Agent 配置 |
| [.github/agents/role-config.md](../.github/agents/role-config.md) | 角色配置 | Agent 角色定義 |
| [.github/agents/role.agent.md](../.github/agents/role.agent.md) | 角色 Agent | 專業角色定義 |
| [.github/agents/docs-index.md](../.github/agents/docs-index.md) | 文檔索引 | Agent 文檔導航 |

#### 領域專家 Agents（8 個）
| 文檔 | 說明 | 專長領域 |
|------|------|----------|
| [.github/agents/domain/angular-agent.md](../.github/agents/domain/angular-agent.md) | Angular 專家 | Angular 開發 |
| [.github/agents/domain/typescript-agent.md](../.github/agents/domain/typescript-agent.md) | TypeScript 專家 | TypeScript 開發 |
| [.github/agents/domain/code-quality-agent.md](../.github/agents/domain/code-quality-agent.md) | 代碼質量專家 | 代碼審查與重構 |
| [.github/agents/domain/security-agent.md](../.github/agents/domain/security-agent.md) | 安全專家 | 安全性檢查 |
| [.github/agents/domain/performance-agent.md](../.github/agents/domain/performance-agent.md) | 效能專家 | 效能優化 |
| [.github/agents/domain/testing-agent.md](../.github/agents/domain/testing-agent.md) | 測試專家 | 測試策略與執行 |
| [.github/agents/domain/accessibility-agent.md](../.github/agents/domain/accessibility-agent.md) | 可訪問性專家 | 無障礙設計 |
| [.github/agents/domain/docs-agent.md](../.github/agents/domain/docs-agent.md) | 文檔專家 | 文檔撰寫與維護 |

- --

### 4. Cursor IDE 規則文檔（29 個）

#### Cursor 規則總覽
| 文檔 | 說明 |
|------|------|
| [.cursor/rules/README.md](../.cursor/rules/README.md) | Cursor 規則總覽 |

#### 核心開發規範（28 個 .mdc 文件）
- 詳細規則請參考 [.cursor/rules/README.md](../.cursor/rules/README.md)
- 包含：TypeScript、Angular、現代語法、架構、代碼質量、性能、安全、測試等

- --

### 5. GitHub Copilot Memory（2 個）
| 文檔 | 說明 | 用途 |
|------|------|------|
| [.github/copilot/README.md](../.github/copilot/README.md) | Copilot Memory 說明 | 記憶庫使用指南 |
| [.github/copilot/memory.jsonl](../.github/copilot/memory.jsonl) | 企業級開發標準記憶庫 | 181 條知識圖譜記錄 |

- --

### 6. 專案文檔目錄（docs/ - 140+ 個）

#### 6.1 核心規範文檔（00-14 編號）

##### 開發規範（00-）
| 文檔 | 說明 | 優先級 |
|------|------|--------|
| [00-API規範.md](./specs/00-api-standards.md) | API 設計規範 | ⭐⭐⭐⭐⭐ |
| [00-Component規範.md](./specs/00-component-standards.md) | 元件開發規範 | ⭐⭐⭐⭐⭐ |
| [00-DevOps規範.md](./specs/00-devops-standards.md) | DevOps 規範 | ⭐⭐⭐⭐ |
| [00-SRP.md](./specs/00-single-responsibility-principle.md) | 單一職責原則 | ⭐⭐⭐⭐⭐ |
| [00-State規範.md](./specs/00-state-management-standards.md) | 狀態管理規範 | ⭐⭐⭐⭐⭐ |
| [00-一致性規範.md](./specs/00-consistency-standards.md) | 一致性原則 | ⭐⭐⭐⭐⭐ |
| [00-可組合性規範.md](./specs/00-composability-standards.md) | 可組合性原則 | ⭐⭐⭐⭐ |
| [00-可維護性規範.md](./specs/00-maintainability-standards.md) | 可維護性原則 | ⭐⭐⭐⭐ |
| [00-命名標準化規範.md](./specs/00-naming-standards.md) | 命名規範 | ⭐⭐⭐⭐⭐ |
| [00-安全規範.md](./specs/00-security-standards.md) | 安全規範 | ⭐⭐⭐⭐⭐ |
| [00-性能規範.md](./specs/00-performance-standards.md) | 效能規範 | ⭐⭐⭐⭐⭐ |
| [00-架構治理規範.md](./specs/00-architecture-governance-standards.md) | 架構治理 | ⭐⭐⭐⭐ |
| [00-測試規範.md](./specs/00-testing-standards.md) | 測試規範 | ⭐⭐⭐⭐⭐ |
| [00-現代化語法規範.md](./specs/00-modern-syntax-standards.md) | 現代 Angular 語法 | ⭐⭐⭐⭐⭐ |

##### 架構設計圖（01-20 編號）
| 文檔 | 說明 | 優先級 |
|------|------|--------|
| [01-系統架構思維導圖.mermaid.md](./architecture/01-system-architecture-mindmap.mermaid.md) | 系統架構總覽 | ⭐⭐⭐⭐⭐ |
| [02-專案結構流程圖.mermaid.md](./architecture/02-project-structure-flowchart.mermaid.md) | 專案結構流程 | ⭐⭐⭐⭐ |
| [03-系統上下文圖.mermaid.md](./03-系統上下文圖.mermaid.md) | 系統上下文 | ⭐⭐⭐⭐ |
| [04-業務流程圖.mermaid.md](./04-業務流程圖.mermaid.md) | 業務流程 | ⭐⭐⭐⭐⭐ |
| [05-帳戶層流程圖.mermaid.md](./05-帳戶層流程圖.mermaid.md) | 帳戶層架構 | ⭐⭐⭐⭐⭐ |
| [06-實體關係圖.mermaid.md](./06-實體關係圖.mermaid.md) | 資料庫 ER 圖 | ⭐⭐⭐⭐⭐ |
| [07-資料生命週期-ETL-流程圖.mermaid.md](./07-資料生命週期-ETL-流程圖.mermaid.md) | ETL 流程 | ⭐⭐⭐ |
| [08-Storage-Bucket結構視圖.mermaid.md](./08-Storage-Bucket結構視圖.mermaid.md) | Storage 結構 | ⭐⭐⭐ |
| [09-安全與-RLS-權限矩陣.md](./09-安全與-RLS-權限矩陣.md) | RLS 權限矩陣 | ⭐⭐⭐⭐⭐ |
| [10-容器圖.mermaid.md](./10-容器圖.mermaid.md) | 容器架構圖 | ⭐⭐⭐⭐ |
| [11-元件模組視圖.mermaid.md](./11-元件模組視圖.mermaid.md) | 元件模組視圖 | ⭐⭐⭐⭐ |
| [12-元件模組視圖-補充.md](./12-元件模組視圖-補充.md) | 元件模組補充 | ⭐⭐⭐ |
| [13-序列圖.mermaid.md](./13-序列圖.mermaid.md) | 序列圖 | ⭐⭐⭐ |
| [14-狀態圖.mermaid.md](./14-狀態圖.mermaid.md) | 狀態流轉圖 | ⭐⭐⭐⭐⭐ |
| [15-領域事件時間軸圖.mermaid.md](./15-領域事件時間軸圖.mermaid.md) | 領域事件 | ⭐⭐⭐ |
| [16-API-介面映射圖.mermaid.md](archive/16-API-介面映射圖.mermaid.md) | API 映射 | ⭐⭐⭐⭐ |
| [17-Supabase架構流程圖.mermaid.md](./17-Supabase架構流程圖.mermaid.md) | Supabase 架構 | ⭐⭐⭐⭐⭐ |
| [18-部署基礎設施視圖.mermaid.md](./18-部署基礎設施視圖.mermaid.md) | 部署架構 | ⭐⭐⭐⭐ |
| [19-可觀測性與CI-CD管道圖.mermaid.md](archive/19-可觀測性與CI-CD管道圖.mermaid.md) | CI/CD 管道 | ⭐⭐⭐⭐ |
| [20-完整架構流程圖.mermaid.md](./architecture/20-complete-architecture-flowchart.mermaid.md) | 完整架構流程 | ⭐⭐⭐⭐⭐ |

#### 6.2 核心文檔（21-40 編號）
| 文檔 | 說明 | 優先級 |
|------|------|--------|
| [21-架構審查報告.md](./architecture/21-architecture-review-report.md) | 架構審查報告（生產就緒） | ⭐⭐⭐⭐⭐ |
| [22-完整SQL表結構定義.md](./reference/sql-schema-definition.md) | 51 張表結構定義 | ⭐⭐⭐⭐⭐ |
| [23-資料表清單總覽.md](./23-資料表清單總覽.md) | 資料表清單 | ⭐⭐⭐⭐ |
| [24-開發前檢查清單.md](./guides/pre-development-checklist.md) | 開發檢查清單 | ⭐⭐⭐⭐⭐ |
| [25-快速開始指南.md](./guides/getting-started.md) | 快速開始 | ⭐⭐⭐⭐⭐ |
| [26-API-接口詳細文檔.md](./26-API-接口詳細文檔.md) | API 接口文檔 | ⭐⭐⭐⭐ |
| [27-資料模型對照表.md](./27-資料模型對照表.md) | 資料模型對照 | ⭐⭐⭐⭐ |
| [28-開發工作流程.md](./guides/development-workflow.md) | 開發流程 | ⭐⭐⭐⭐⭐ |
| [29-常見問題-FAQ.md](./29-常見問題-FAQ.md) | 常見問題 | ⭐⭐⭐⭐ |
| [30-錯誤處理指南.md](./30-錯誤處理指南.md) | 錯誤處理 | ⭐⭐⭐⭐⭐ |
| [31-測試指南.md](./31-測試指南.md) | 測試指南 | ⭐⭐⭐⭐⭐ |
| [32-部署指南.md](./32-部署指南.md) | 部署指南 | ⭐⭐⭐⭐ |
| [33-效能優化指南.md](./33-效能優化指南.md) | 效能優化 | ⭐⭐⭐⭐⭐ |
| [34-安全檢查清單.md](./34-安全檢查清單.md) | 安全檢查 | ⭐⭐⭐⭐⭐ |
| [35-詞彙表.md](./35-詞彙表.md) | 專案詞彙 | ⭐⭐⭐⭐ |
| [36-狀態枚舉值定義.md](./36-狀態枚舉值定義.md) | 狀態枚舉 | ⭐⭐⭐⭐ |
| [37-SHARED_IMPORTS-使用指南.md](./reference/shared-imports-guide.md) | SHARED_IMPORTS 指南 | ⭐⭐⭐⭐⭐ |
| [38-ng-zorro-antd-組件清單與CLI指令.md](./38-ng-zorro-antd-組件清單與CLI指令.md) | NG-ZORRO 組件清單 | ⭐⭐⭐⭐⭐ |
| [39-DELON-Index-索引.md](./39-DELON-Index-索引.md) | DELON 索引 | ⭐⭐⭐⭐⭐ |
| [40-共用元件清單.md](./40-共用元件清單.md) | 共用元件 | ⭐⭐⭐⭐ |

#### 6.3 進階指南（41-62 編號）
| 文檔 | 說明 | 優先級 |
|------|------|--------|
| [41-AI助手角色配置.md](./41-AI助手角色配置.md) | AI 助手角色 | ⭐⭐⭐⭐⭐ |
| [42-開發最佳實踐指南.md](./guides/development-best-practices.md) | 最佳實踐 | ⭐⭐⭐⭐⭐ |
| [43-Agent開發指南與限制說明.md](./43-Agent開發指南與限制說明.md) | Agent 開發限制 | ⭐⭐⭐⭐⭐ |
| [44-企業級任務系統開發指令.md](./44-企業級任務系統開發指令.md) | 任務系統開發 | ⭐⭐⭐⭐ |
| [45-版本管理與發布指南.md](./45-版本管理與發布指南.md) | 版本管理 | ⭐⭐⭐⭐ |
| [46-監控與告警配置指南.md](./46-監控與告警配置指南.md) | 監控告警 | ⭐⭐⭐ |
| [47-災難恢復與備份指南.md](./47-災難恢復與備份指南.md) | 災難恢復 | ⭐⭐⭐ |
| [48-代碼審查規範.md](./48-代碼審查規範.md) | 代碼審查 | ⭐⭐⭐⭐⭐ |
| [49-前端狀態管理指南.md](./49-前端狀態管理指南.md) | 狀態管理 | ⭐⭐⭐⭐⭐ |
| [50-RLS策略開發指南.md](./50-RLS策略開發指南.md) | RLS 策略 | ⭐⭐⭐⭐⭐ |
| [51-Edge-Function開發指南.md](./51-Edge-Function開發指南.md) | Edge Function | ⭐⭐⭐⭐ |
| [52-前端路由設計指南.md](./52-前端路由設計指南.md) | 路由設計 | ⭐⭐⭐⭐⭐ |
| [53-國際化與本地化指南.md](./53-國際化與本地化指南.md) | 國際化 | ⭐⭐⭐⭐ |
| [54-UI-UX設計規範.md](./54-UI-UX設計規範.md) | UI/UX 設計 | ⭐⭐⭐⭐ |
| [55-移動端適配指南.md](./55-移動端適配指南.md) | 移動端適配 | ⭐⭐⭐ |
| [56-第三方服務整合指南.md](./56-第三方服務整合指南.md) | 第三方服務 | ⭐⭐⭐ |
| [57-Redis使用指南.md](./57-Redis使用指南.md) | Redis 使用 | ⭐⭐⭐⭐ |
| [58-工作區上下文功能總覽.md](./workspace/workspace-context-overview.md) | 工作區上下文 | ⭐⭐⭐⭐⭐ |
| [60-開發者快速檢查清單.md](./guides/developer-quick-checklist.md) | 快速檢查 | ⭐⭐⭐⭐⭐ |
| [61-開發疑難排解指南.md](./guides/development-troubleshooting-guide.md) | 疑難排解 | ⭐⭐⭐⭐⭐ |
| [62-專案開發改善實施總結報告.md](archive/62-專案開發改善實施總結報告.md) | 改善實施總結 | ⭐⭐⭐ |

#### 6.4 工作區上下文系統（5 個）
| 文檔 | 說明 | 優先級 |
|------|------|--------|
| [工作區上下文使用與規劃指南.md](./工作區上下文使用與規劃指南.md) | 上下文使用指南 | ⭐⭐⭐⭐⭐ |
| [工作區上下文切換流程圖.mermaid.md](./工作區上下文切換流程圖.mermaid.md) | 切換流程圖 | ⭐⭐⭐⭐ |
| [工作區上下文系統架構審查.md](./工作區上下文系統架構審查.md) | 系統架構審查 | ⭐⭐⭐⭐ |
| [工作區系統-快速參考指南.md](./工作區系統-快速參考指南.md) | 快速參考 | ⭐⭐⭐⭐ |
| [個人上下文菜單功能說明-user-data.md](./個人上下文菜單功能說明-user-data.md) | 個人上下文 | ⭐⭐⭐⭐ |
| [團隊上下文菜單功能說明-team-data.md](./團隊上下文菜單功能說明-team-data.md) | 團隊上下文 | ⭐⭐⭐⭐ |
| [組織上下文菜單功能說明-organization-data.md](./組織上下文菜單功能說明-organization-data.md) | 組織上下文 | ⭐⭐⭐⭐ |

#### 6.5 NG-ZORRO 組件索引（73 個）
**目錄**：`docs/NG-ZORRO-Index/`

| 文檔 | 說明 |
|------|------|
| [README.md](./NG-ZORRO-Index/README.md) | NG-ZORRO 索引總覽 |
| [component-template.md](./NG-ZORRO-Index/component-template.md) | 組件模板 |

**組件文檔**（01-72）：
- 反饋組件：Alert, Message, Notification, Modal, Drawer, Popconfirm, Progress, Result, Skeleton, Spin
- 數據錄入：Form, Input, InputNumber, Select, Checkbox, Radio, Switch, Upload, DatePicker, TimePicker, Cascader, Transfer, TreeSelect, Mention, Rate, Slider, AutoComplete, ColorPicker
- 數據展示：Table, Tree, TreeView, List, Calendar, Card, Carousel, Collapse, Comment, Descriptions, Empty, Image, Statistic, Timeline, Tag, Avatar, Badge, QRCode, Segmented
- 佈局：Grid, Layout, Space, Divider, Flex, Splitter
- 導航：Menu, Dropdown, Pagination, Steps, Breadcrumb, Tabs, Anchor, PageHeader
- 其他：Button, FloatButton, Icon, Typography, Tooltip, Popover, Affix, BackTop, WaterMark, CheckList, HashCode

#### 6.6 DELON 套件索引（11 個）
**目錄**：`docs/DELON-Index/`

| 文檔 | 說明 |
|------|------|
| [README.md](./DELON-Index/README.md) | DELON 索引總覽 |
| [01-@delon-abc.md](./DELON-Index/01-@delon-abc.md) | 業務元件 |
| [02-@delon-acl.md](./DELON-Index/02-@delon-acl.md) | 訪問控制列表 |
| [03-@delon-auth.md](./DELON-Index/03-@delon-auth.md) | 認證模組 |
| [04-@delon-cache.md](./DELON-Index/04-@delon-cache.md) | 快取服務 |
| [05-@delon-chart.md](./DELON-Index/05-@delon-chart.md) | 圖表元件 |
| [06-@delon-form.md](./DELON-Index/06-@delon-form.md) | 動態表單 |
| [07-@delon-mock.md](./DELON-Index/07-@delon-mock.md) | Mock 數據 |
| [08-@delon-theme.md](./DELON-Index/08-@delon-theme.md) | 主題系統 |
| [09-@delon-util.md](./DELON-Index/09-@delon-util.md) | 工具函數 |
| [10-@delon-testing.md](./DELON-Index/10-@delon-testing.md) | 測試工具 |

#### 6.7 FYI 參考文檔（13 個）
| 文檔 | 說明 |
|------|------|
| [fyi.md](archive/fyi.md) | FYI 總覽 |
| [fyi-architecture.md](./fyi-architecture.md) | 架構資訊 |
| [fyi-background.md](archive/fyi-background.md) | 背景資訊 |
| [fyi-challenges.md](./fyi-challenges.md) | 挑戰與解決方案 |
| [fyi-codebase.md](./fyi-codebase.md) | 代碼庫資訊 |
| [fyi-context.md](./fyi-context.md) | 上下文資訊 |
| [fyi-data.md](./fyi-data.md) | 數據資訊 |
| [fyi-development.md](./fyi-development.md) | 開發資訊 |
| [fyi-history.md](archive/fyi-history.md) | 歷史資訊 |
| [fyi-mind-map.md](./fyi-mind-map.md) | 思維導圖 |
| [fyi-notes.md](archive/fyi-notes.md) | 筆記 |
| [fyi-performance.md](./fyi-performance.md) | 效能資訊 |
| [fyi-rls.md](./fyi-rls.md) | RLS 資訊 |

#### 6.8 其他專案文檔
| 文檔 | 說明 |
|------|------|
| [CHANGELOG.md](./CHANGELOG.md) | 變更日誌 |
| [FINAL-SUMMARY.md](archive/FINAL-SUMMARY.md) | 最終總結 |
| [MCP-Server-Verification-Report.md](archive/MCP-Server-Verification-Report.md) | MCP 伺服器驗證報告 |
| [MCP伺服器驗證總結.md](archive/MCP伺服器驗證總結.md) | MCP 驗證總結 |
| [README.md](./README.md) | 文檔索引（主文檔） |
| [SRP-檢查清單.md](archive/SRP-檢查清單.md) | SRP 檢查清單 |
| [SRP-重構完成報告.md](archive/SRP-重構完成報告.md) | SRP 重構報告 |

- --

### 7. 源代碼模組文檔（8 個）

#### Core 模組
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [AGENTS.md](../src/app/core/AGENTS.md) | src/app/core/ | Core 模組 Agent 指引 |
| [README.md](../src/app/core/README.md) | src/app/core/ | Core 模組說明 |
| [QUICK_START.md](../src/app/core/infra/QUICK_START.md) | src/app/core/infra/ | Infra 快速開始 |
| [README.md](../src/app/core/infra/README.md) | src/app/core/infra/ | Infra 模組說明 |

#### Layout 模組
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [AGENTS.md](../src/app/layout/AGENTS.md) | src/app/layout/ | Layout 模組 Agent 指引 |
| [README.md](../README.md) | src/app/layout/basic/ | Basic Layout 說明 |
| [README.md](../README.md) | src/app/layout/blank/ | Blank Layout 說明 |

#### Routes 模組
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [AGENTS.md](../src/app/routes/AGENTS.md) | src/app/routes/ | Routes 模組 Agent 指引 |

#### Shared 模組
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [AGENTS.md](../src/app/shared/AGENTS.md) | src/app/shared/ | Shared 模組 Agent 指引 |
| [README.md](../src/app/shared/README.md) | src/app/shared/ | Shared 模組說明 |
| [README.md](../README.md) | src/app/shared/json-schema/ | JSON Schema 說明 |
| [README.md](../README.md) | src/app/shared/st-widget/ | ST Widget 說明 |

- --

### 8. 工具與腳本文檔（4 個）
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [README.md](../README.md) | _cli-tpl/ | CLI 模板說明 |
| [README.md](../README.md) | _mock/ | Mock 數據說明 |
| [README.md](../README.md) | scripts/_ci/ | CI 腳本說明 |
| [README.md](../scripts/dev-tools/README.md) | scripts/dev-tools/ | 開發工具說明 |

- --

### 9. VSCode 配置文檔（1 個）
| 文檔 | 路徑 | 說明 |
|------|------|------|
| [README.md](../.vscode/README.md) | .vscode/ | VSCode 配置說明 |

- --

## 📊 文檔統計

### 按目錄分類
| 目錄 | 文檔數量 | 說明 |
|------|----------|------|
| **根目錄** | 8 | 專案主要說明與 AI 配置 |
| **Copilot 配置** | 5 | VSCode Copilot 指引 |
| **GitHub Agents** | 11 | GitHub Copilot Agent Mode |
| **Cursor 規則** | 29 | Cursor IDE 規則（1 README + 28 mdc） |
| **Copilot Memory** | 2 | 記憶庫文檔 |
| **docs/** | 140+ | 專案核心文檔 |
| - 核心規範（00-） | 14 | 開發規範文檔 |
| - 架構圖（01-20） | 20 | Mermaid 架構圖 |
| - 核心文檔（21-40） | 20 | 核心指南 |
| - 進階指南（41-62） | 22 | 進階主題 |
| - 工作區上下文 | 7 | 上下文系統 |
| - NG-ZORRO Index | 73 | NG-ZORRO 組件文檔 |
| - DELON Index | 11 | DELON 套件文檔 |
| - FYI 文檔 | 13 | 參考資訊 |
| - 其他 | 7 | 總結報告等 |
| **src/app/** | 12 | 源代碼模組文檔 |
| **工具與腳本** | 4 | 腳本說明 |
| **VSCode** | 1 | VSCode 配置 |
| **總計** | **232** | 所有 Markdown 文檔 |

### 按類型分類
| 類型 | 數量 | 說明 |
|------|------|------|
| **規範標準** | ~40 | 開發規範、編碼標準 |
| **架構設計** | ~25 | 架構圖、流程圖 |
| **開發指南** | ~50 | 各類開發指南 |
| **組件文檔** | ~85 | NG-ZORRO + DELON 文檔 |
| **AI 配置** | ~25 | AI 助手配置 |
| **其他** | ~7 | 總結、報告等 |

- --

## 🗂️ 建議的閱讀路徑

### 新成員入門路徑
1. [README.md](../README.md) - 專案總覽
2. [25-快速開始指南.md](./guides/getting-started.md) - 環境設定
3. [60-開發者快速檢查清單.md](./guides/developer-quick-checklist.md) - 環境驗證
4. [42-開發最佳實踐指南.md](./guides/development-best-practices.md) - 最佳實踐
5. [37-SHARED_IMPORTS-使用指南.md](./reference/shared-imports-guide.md) - 必讀 ⭐

### 前端開發者路徑
1. [00-Component規範.md](./specs/00-component-standards.md) - 元件規範
2. [00-現代化語法規範.md](./specs/00-modern-syntax-standards.md) - 現代語法
3. [38-ng-zorro-antd-組件清單與CLI指令.md](./38-ng-zorro-antd-組件清單與CLI指令.md) - NG-ZORRO
4. [39-DELON-Index-索引.md](./39-DELON-Index-索引.md) - DELON
5. [49-前端狀態管理指南.md](./49-前端狀態管理指南.md) - 狀態管理
6. [52-前端路由設計指南.md](./52-前端路由設計指南.md) - 路由設計

### 後端開發者路徑
1. [00-API規範.md](./specs/00-api-standards.md) - API 規範
2. [50-RLS策略開發指南.md](./50-RLS策略開發指南.md) - RLS 策略
3. [51-Edge-Function開發指南.md](./51-Edge-Function開發指南.md) - Edge Function
4. [22-完整SQL表結構定義.md](./reference/sql-schema-definition.md) - 資料庫結構

### 架構師路徑
1. [20-完整架構流程圖.mermaid.md](./architecture/20-complete-architecture-flowchart.mermaid.md) - 完整架構
2. [21-架構審查報告.md](./architecture/21-architecture-review-report.md) - 架構審查
3. [00-架構治理規範.md](./specs/00-architecture-governance-standards.md) - 架構治理
4. [00-SRP.md](./specs/00-single-responsibility-principle.md) - 單一職責原則

### AI 助手開發者路徑
1. [AGENTS.md](../AGENTS.md) - AI 助手總覽
2. [41-AI助手角色配置.md](./41-AI助手角色配置.md) - 角色配置
3. [43-Agent開發指南與限制說明.md](./43-Agent開發指南與限制說明.md) - Agent 限制
4. [.github/agents/README.md](../.github/agents/README.md) - GitHub Agents

- --

## 🔍 快速查找

### 按關鍵字查找
- **Angular**：00-Component規範.md, 00-現代化語法規範.md, .github/agents/domain/angular-agent.md
- **NG-ZORRO**：38-ng-zorro-antd-組件清單與CLI指令.md, NG-ZORRO-Index/
- **DELON**：39-DELON-Index-索引.md, DELON-Index/
- **Supabase**：17-Supabase架構流程圖.mermaid.md, 50-RLS策略開發指南.md
- **測試**：00-測試規範.md, 31-測試指南.md, .github/agents/domain/testing-agent.md
- **安全**：00-安全規範.md, 34-安全檢查清單.md, 09-安全與-RLS-權限矩陣.md
- **效能**：00-性能規範.md, 33-效能優化指南.md, .github/agents/domain/performance-agent.md

### 按優先級查找
**⭐⭐⭐⭐⭐ 必讀文檔**（共 30+ 個）：
- 所有 00- 開頭的規範文檔
- 20-完整架構流程圖.mermaid.md
- 21-架構審查報告.md
- 22-完整SQL表結構定義.md
- 25-快速開始指南.md
- 37-SHARED_IMPORTS-使用指南.md
- 42-開發最佳實踐指南.md
- 更多請參考各分類表格中的優先級標記

- --

## 📝 維護建議

### 文檔更新原則
1. **保持一致性**：所有文檔使用相同的格式和風格
2. **版本管理**：重要文檔包含版本號和更新日期
3. **交叉引用**：使用相對路徑連結相關文檔
4. **定期審查**：每月檢視文檔的準確性和時效性

### 新增文檔指引
1. **命名規範**：使用描述性名稱，中文優先
2. **分類歸檔**：放置在正確的目錄
3. **更新索引**：同步更新 README.md 和本文檔
4. **優先級標記**：標注文檔重要性（⭐⭐⭐⭐⭐）

- --

**最後更新**：2025-11-20
**維護者**：開發團隊
**下次檢視**：2025-12-20
