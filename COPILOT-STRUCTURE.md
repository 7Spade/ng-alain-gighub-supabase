# GitHub Copilot 資料夾與檔案結構說明

> **📌 用途**：本文件詳細說明 GitHub Copilot 相關配置文件的資料夾結構、命名規範和使用方式，幫助使用者快速了解如何組織和命名相關文件。

---

## 📑 目錄

- [概覽](#概覽)
- [資料夾結構總覽](#資料夾結構總覽)
- [詳細資料夾說明](#詳細資料夾說明)
  - [.github/agents](#1-githubagents)
  - [.github/prompts](#2-githubprompts)
  - [.github/instructions 或 instructions](#3-githubinstructions-或-instructions)
  - [.github/collections 或 collections](#4-githubcollections-或-collections)
  - [.github/copilot](#5-githubcopilot)
  - [.github/copilot-instructions](#6-githubcopilot-instructions)
  - [.github/copilot-instructions.md](#7-githubcopilot-instructionsmd)
- [命名規範總覽](#命名規範總覽)
- [檔案格式規範](#檔案格式規範)
- [YAML Front Matter 範例](#yaml-front-matter-範例)
- [最佳實踐](#最佳實踐)
- [參考資源](#參考資源)

---

## 概覽

GitHub Copilot 支援多種配置方式來自訂 AI 助手的行為，包括：

| 類型 | 用途 | 主要位置 |
|------|------|----------|
| **Agents** | 自訂聊天模式/代理 | `.github/agents/` |
| **Prompts** | 可重複使用的提示模板 | `.github/prompts/` |
| **Instructions** | 編碼標準和開發指南 | `.github/copilot-instructions/` 或 `instructions/` |
| **Collections** | 資源集合（組合 agents, prompts, instructions） | `.github/collections/` 或 `collections/` |
| **Copilot Memory** | AI 記憶庫 | `.github/copilot/` |
| **Global Instructions** | 全域 Copilot 指令 | `.github/copilot-instructions.md` |

---

## 資料夾結構總覽

```
專案根目錄/
├── .github/
│   ├── agents/                          # 自訂 Copilot 代理
│   │   ├── README.md                    # 代理說明文件
│   │   ├── {name}.agent.md              # 代理定義檔
│   │   └── ...
│   │
│   ├── prompts/                         # 可重複使用的提示模板
│   │   ├── {name}.prompt.md             # 提示模板檔
│   │   └── ...
│   │
│   ├── collections/                     # 資源集合
│   │   ├── README.md                    # 集合說明文件
│   │   ├── {name}.collection.yml        # 集合配置檔（YAML）
│   │   ├── {name}.md                    # 集合說明檔（Markdown）
│   │   └── ...
│   │
│   ├── copilot-instructions/            # 領域專屬指令
│   │   ├── README.md                    # 指令說明文件
│   │   ├── {name}.instructions.md       # 指令檔
│   │   └── ...
│   │
│   ├── copilot/                         # Copilot 配置和記憶
│   │   └── memory.jsonl                 # AI 記憶庫
│   │
│   └── copilot-instructions.md          # 全域 Copilot 指令（根檔案）
│
├── instructions/                        # 替代位置：領域專屬指令
│   ├── {name}.instructions.md
│   └── ...
│
└── collections/                         # 替代位置：資源集合
    ├── TEMPLATE.md                      # 集合模板
    ├── {name}.collection.yml
    ├── {name}.md
    └── ...
```

---

## 詳細資料夾說明

### 1. `.github/agents/`

**用途**：存放自訂 GitHub Copilot Agent（代理/聊天模式）

**命名規範**：
```
{agent-name}.agent.md
```

**命名規則**：
- 使用 **小寫字母**、**數字** 和 **連字號**（`-`）
- 副檔名必須是 `.agent.md`
- 名稱應清楚描述代理的功能

**檔案結構**：
```markdown
---
description: '代理的簡短描述'
model: GPT-4.1                           # 可選：指定模型
title: '代理顯示名稱'                     # 可選：顯示標題
tools: ['tool1', 'tool2']                # 可選：使用的工具
---

# 代理標題

代理的詳細說明和行為定義...
```

**範例**：
| 檔案名稱 | 用途 |
|---------|------|
| `debug.agent.md` | 除錯助手 |
| `api-architect.agent.md` | API 架構設計 |
| `accessibility.agent.md` | 無障礙功能專家 |
| `typescript-mcp-expert.agent.md` | TypeScript MCP 伺服器專家 |
| `4.1-Beast.agent.md` | GPT 4.1 增強模式 |

---

### 2. `.github/prompts/`

**用途**：存放可重複使用的提示模板

**命名規範**：
```
{prompt-name}.prompt.md
```

**命名規則**：
- 使用 **小寫字母**、**數字** 和 **連字號**（`-`）
- 副檔名必須是 `.prompt.md`
- 名稱應描述提示的功能或用途

**檔案結構**：
```markdown
---
mode: 'agent'                            # 可選：agent, edit, chat
description: '提示的簡短描述'
tools: ['edit/editFiles', 'fetch']       # 可選：使用的工具
---

# 提示標題

## 角色定義
您是...

## 目標
1. 任務一
2. 任務二

## 規則
- 規則一
- 規則二
```

**範例**：
| 檔案名稱 | 用途 |
|---------|------|
| `add-educational-comments.prompt.md` | 添加教育性註解 |
| `create-readme.prompt.md` | 建立 README 文件 |
| `conventional-commit.prompt.md` | 產生標準 Commit 訊息 |
| `playwright-generate-test.prompt.md` | 產生 Playwright 測試 |
| `csharp-docs.prompt.md` | C# 文檔產生 |

---

### 3. `.github/copilot-instructions/` 或 `instructions/`

**用途**：存放編碼標準、開發指南和最佳實踐

**命名規範**：
```
{topic-name}.instructions.md
```

**命名規則**：
- 使用 **小寫字母**、**數字** 和 **連字號**（`-`）
- 副檔名必須是 `.instructions.md`
- 名稱應描述指令適用的技術或領域

**檔案結構**：
```markdown
---
description: '指令的簡短描述'
applyTo: '**/*.ts, **/*.html'            # 可選：適用的檔案模式
---

# 指令標題

## 專案上下文
- 上下文說明一
- 上下文說明二

## 開發標準

### 架構
- 標準一
- 標準二

### 程式碼風格
- 風格一
- 風格二
```

**範例**：
| 檔案名稱 | 用途 |
|---------|------|
| `angular.instructions.md` | Angular 開發標準 |
| `typescript-5-es2022.instructions.md` | TypeScript 5 + ES2022 標準 |
| `security-and-owasp.instructions.md` | 安全性和 OWASP 指南 |
| `playwright-typescript.instructions.md` | Playwright + TypeScript 測試指南 |
| `a11y.instructions.md` | 無障礙功能開發指南 |

---

### 4. `.github/collections/` 或 `collections/`

**用途**：組合相關的 agents、prompts 和 instructions 成為可發現的資源集合

**命名規範**：
需要兩個檔案：
```
{collection-id}.collection.yml    # 集合配置檔
{collection-id}.md                # 集合說明檔（可選）
```

**命名規則**：
- 使用 **小寫字母**、**數字** 和 **連字號**（`-`）
- YAML 檔案副檔名必須是 `.collection.yml`
- Markdown 說明檔副檔名是 `.md`

**YAML 配置結構**：
```yaml
id: my-collection-id
name: My Collection Name
description: 集合的簡短描述（1-500 字元）
tags: [tag1, tag2, tag3]                 # 可選：最多 10 個標籤
items:
  - path: prompts/my-prompt.prompt.md
    kind: prompt
  - path: instructions/my-instructions.instructions.md  
    kind: instruction
  - path: agents/my-chatmode.agent.md
    kind: agent
display:
  ordering: alpha                        # alpha 或 manual
  show_badge: true                       # 是否顯示集合徽章
  featured: false                        # 是否為精選集合
```

**範例**：
| 檔案名稱 | 用途 |
|---------|------|
| `frontend-web-dev.collection.yml` | 前端網頁開發資源 |
| `security-best-practices.collection.yml` | 安全最佳實踐 |
| `testing-automation.collection.yml` | 測試自動化資源 |
| `awesome-copilot.collection.yml` | Copilot 元提示集合 |

---

### 5. `.github/copilot/`

**用途**：存放 Copilot 配置和 AI 記憶庫

**檔案說明**：

| 檔案 | 用途 |
|------|------|
| `memory.jsonl` | AI 記憶庫，儲存專案知識圖譜 |

**memory.jsonl 格式**：
```jsonl
{"entities":[{"name":"Entity Name","entityType":"Type","observations":["觀察一","觀察二"]}],"relations":[{"from":"Entity A","to":"Entity B","relationType":"關係類型"}]}
```

---

### 6. `.github/copilot-instructions/`

**用途**：存放領域專屬的 Copilot 指令（與 `instructions/` 功能相同，但位於 `.github/` 下）

此資料夾與根目錄的 `instructions/` 資料夾功能相同，請參考 [第 3 節](#3-githubinstructions-或-instructions)。

---

### 7. `.github/copilot-instructions.md`

**用途**：全域 Copilot 指令檔，適用於整個專案

**這是一個單一檔案**，不是資料夾。

**檔案結構**：
```markdown
---
description: '專案整體的編碼標準和最佳實踐'
applyTo: '**/*.ts, **/*.html, **/*.scss, **/*.css'
---

# 專案開發指令

## 專案上下文
- ...

## 開發標準
- ...
```

---

## 命名規範總覽

| 資源類型 | 命名格式 | 範例 |
|---------|---------|------|
| **Agent** | `{name}.agent.md` | `debug.agent.md` |
| **Prompt** | `{name}.prompt.md` | `create-readme.prompt.md` |
| **Instruction** | `{name}.instructions.md` | `angular.instructions.md` |
| **Collection (YAML)** | `{id}.collection.yml` | `frontend-web-dev.collection.yml` |
| **Collection (MD)** | `{id}.md` | `frontend-web-dev.md` |

### 通用命名規則

1. **小寫字母**：所有檔案名稱使用小寫
2. **連字號分隔**：使用 `-` 分隔單字，不使用底線 `_` 或空格
3. **語義化命名**：名稱應清楚描述檔案的功能或用途
4. **副檔名必須正確**：
   - Agents: `.agent.md`
   - Prompts: `.prompt.md`
   - Instructions: `.instructions.md`
   - Collections: `.collection.yml`

---

## 檔案格式規範

所有 Markdown 檔案都應包含 **YAML Front Matter**（前置資料），用於定義元資料。

### 必要欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `description` | string | 檔案的簡短描述（必要） |

### 可選欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `applyTo` | string | 適用的檔案模式（glob pattern） |
| `model` | string | 指定使用的 AI 模型 |
| `title` | string | 顯示標題 |
| `mode` | string | 運行模式（agent, edit, chat） |
| `tools` | array | 使用的工具列表 |
| `tags` | array | 分類標籤 |

---

## YAML Front Matter 範例

### Agent 範例
```yaml
---
description: 'Expert assistant for debugging applications'
model: GPT-4.1
title: 'Debug Mode v2.0'
tools: ['edit/editFiles', 'bash', 'fetch']
---
```

### Prompt 範例
```yaml
---
mode: 'agent'
description: 'Generate comprehensive README files'
tools: ['edit/editFiles', 'fetch']
---
```

### Instruction 範例
```yaml
---
description: 'Angular-specific coding standards and best practices'
applyTo: '**/*.ts, **/*.html, **/*.scss, **/*.css'
---
```

### Collection 範例
```yaml
id: frontend-web-dev
name: Frontend Web Development
description: Essential prompts, instructions, and chat modes for modern frontend web development.
tags: [frontend, web, react, typescript, javascript, angular]
items:
  - path: agents/expert-react-frontend-engineer.agent.md
    kind: agent
  - path: instructions/angular.instructions.md
    kind: instruction
  - path: prompts/playwright-generate-test.prompt.md
    kind: prompt
display:
  ordering: alpha
  show_badge: true
```

---

## 最佳實踐

### 1. 資料夾組織

- ✅ 將相關資源放在對應的資料夾中
- ✅ 為每個資料夾建立 `README.md` 說明文件
- ✅ 保持資料夾結構扁平，避免過深的巢狀

### 2. 命名

- ✅ 使用描述性的名稱
- ✅ 遵循一致的命名風格
- ✅ 避免使用特殊字元

### 3. 內容編寫

- ✅ 提供清晰的描述
- ✅ 包含使用範例
- ✅ 定義明確的角色和規則
- ✅ 適當分段，便於閱讀

### 4. 集合管理

- ✅ 將相關的資源組合成集合
- ✅ 使用有意義的標籤
- ✅ 保持集合專注（建議 3-10 個項目）

---

## 參考資源

### 官方文檔

- [GitHub Copilot 官方文檔](https://docs.github.com/en/copilot)
- [Customizing GitHub Copilot](https://docs.github.com/en/copilot/customizing-copilot)

### 本專案相關文檔

| 文檔 | 位置 | 說明 |
|------|------|------|
| AI 助手配置總覽 | `AGENTS.md` | 所有 AI 助手的入口文檔 |
| Agents README | `.github/agents/README.md` | 代理使用說明 |
| Collections README | `.github/collections/README.md` | 集合使用說明 |
| Instructions README | `.github/copilot-instructions/README.md` | 指令使用說明 |

### 社群資源

- [awesome-copilot](https://github.com/github/awesome-copilot) - GitHub Copilot 優質資源集合

---

## 快速參考卡片

```
📁 .github/
├── 📂 agents/               → *.agent.md
├── 📂 prompts/              → *.prompt.md  
├── 📂 collections/          → *.collection.yml + *.md
├── 📂 copilot-instructions/ → *.instructions.md
├── 📂 copilot/              → memory.jsonl
└── 📄 copilot-instructions.md (全域指令)

📁 根目錄/
├── 📂 instructions/         → *.instructions.md
└── 📂 collections/          → *.collection.yml + *.md
```

---

**最後更新**：2025-11-26  
**維護者**：開發團隊
