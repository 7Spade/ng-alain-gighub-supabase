# GitHub Agents Knowledge Hub

> **目的**：集中管理原 `.ai/` 與舊 `.github/agents/` 的所有 AI 上下文，提供一致的代理說明、專案背景與工作流程。所有檔案皆依角色職責分類，方便在 GitHub Actions、Cursor 或任意 Agent Runtime 中引用。

## 🚀 快速開始

**新手？** 先閱讀 [QUICK-START.md](./QUICK-START.md) 了解：
- 🗺️ 決策樹：根據任務類型選擇對應文件
- 📋 常見任務快速參考（創建元件、整合 API、修復型別等）
- 🔍 重要文件速查表
- 💡 最佳實踐和回覆檢查清單

**選擇你的 AI 助手**：
- 📘 [GitHub Copilot](./copilot-instructions.md) - 日常開發與代碼補全（推薦）
- 🤖 [Claude AI](../../CLAUDE.md) - 架構設計與深度分析
- 🌟 [Google Gemini](../../GEMINI.md) - 多模態任務與即時搜尋
- 💻 [Cursor IDE](../../.cursor/rules/) - 即時規則檢查（28 個規則自動應用）

## 📁 目錄結構

```text
├── AGENTS.md                 # ⭐ 所有 AI 助手的入口文檔
├── CLAUDE.md                 # 🤖 Claude AI 專用配置（7KB）
├── GEMINI.md                 # 🌟 Google Gemini 專用配置（9KB）
├── .copilot-*.md             # 📘 GitHub Copilot（VSCode 整合）
├── .cursor/rules/            # 💻 Cursor IDE 規則（28 個）
├── .github/agents/           # 📂 GitHub Agents 目錄
│   ├── README.md             # 本文件
│   ├── QUICK-START.md        # 🚀 快速開始指南（新手必讀）
│   ├── agent-startup-checklist.md # ⭐⭐⭐ Agent 啟動檢查清單（v3.0 - 含 Redis）
│   ├── redis-external-brain-guide.md # ⭐⭐⭐⭐⭐ Redis 外掛大腦指南（新）
│   ├── mcp-tools-workflow-guide.md # ⭐⭐⭐ MCP 工具工作流程指南
│   ├── memory-usage-guide.md # ⭐⭐⭐ 記憶庫使用指南
│   ├── copilot-instructions.md # ⭐⭐ GitHub Copilot Agent 優化版（v2.0）
│   ├── ng-alain-github-agent.md   # ⭐ 專案級上下文（v2.0 - 強調工具使用）
│   ├── docs-index.md         # 🔍 docs/ 目錄索引
│   ├── role.agent.md         # Copilot / AI 角色設定
│   ├── role-config.md        # System message 快速參考
│   └── domain/               # 技術領域檢查表
│       ├── angular-agent.md
│       ├── typescript-agent.md
│       ├── code-quality-agent.md
│       ├── testing-agent.md
│       ├── security-agent.md
│       ├── performance-agent.md
│       ├── accessibility-agent.md
│       └── docs-agent.md
├── .github/copilot/          # 📂 GitHub Copilot Memory
│   ├── memory.jsonl          # ⭐⭐⭐⭐⭐ 專案記憶庫（149 實體 + 170 關係）
│   ├── README.md             # 記憶庫說明
│   ├── MEMORY_SUMMARY.md     # 記憶庫摘要
│   └── USAGE-GUIDE.md        # 詳細使用指南
└── src/app/                  # 模組特定規範
    ├── core/AGENTS.md        # ✨ Core 模組規範（優化版）
    ├── shared/AGENTS.md      # ✨ Shared 模組規範（優化版）
    ├── layout/AGENTS.md      # ✨ Layout 模組規範（優化版）
    └── routes/AGENTS.md      # ✨ Routes 模組規範（優化版）
```

## 🔄 內容來源
- **原 `.ai/` 目錄**：architecture、tech-stack、business-context、quick-reference... 等背景資料已整合進 `ng-alain-github-agent.md` 與各 domain agents。
- **舊 `.github/agents/`**：Angular / TypeScript / Code Quality / Testing 等代理移動至 `domain/`，內容依新路徑更新引用。

## 🚀 使用方式

### 第一次使用
1. **閱讀** [agent-startup-checklist.md](./agent-startup-checklist.md) - ⭐⭐⭐⭐⭐ 企業標準啟動檢查清單（v2.0）
2. **閱讀** [mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md) - ⭐⭐⭐⭐⭐ MCP 工具完整使用指南（新）
3. **閱讀** [memory-usage-guide.md](./memory-usage-guide.md) - ⭐⭐⭐⭐⭐ 記憶庫使用指南
4. **閱讀** [QUICK-START.md](./QUICK-START.md) - 了解整體工作流程和決策樹
5. **參考** `role.agent.md` - 了解 AI 角色定位與回覆原則
6. **查閱** `ng-alain-github-agent.md` - 獲取專案願景、架構、資料與 API 摘要
7. **選擇** 適當的 `domain/*.md` - 依任務類型套用專家檢查表

### 日常使用（強制流程）⭐⭐⭐⭐⭐

#### 🔴 第 0 步：連接 Redis 外掛大腦（絕對必須，最高優先級）
**⚠️ Redis 是 Agent 的外掛大腦，負責長期記憶和持續成長**

```bash
# 1. 載入使用者偏好
redis-cli MGET user:preferences:code_style user:preferences:ui

# 2. 載入專案知識
redis-cli MGET project:knowledge:architecture project:knowledge:api_conventions

# 3. 載入歷史決策
redis-cli KEYS history:decisions:*

# 4. 載入模式與慣例
redis-cli MGET patterns:repository patterns:service patterns:component
```

**詳細指南**：[redis-external-brain-guide.md](./redis-external-brain-guide.md) ⭐⭐⭐⭐⭐

#### 🔴 第 1 步：使用 MCP 工具（絕對必須，結合 Redis 記憶）
**⚠️ 必須在載入 Redis 記憶後使用這兩個工具：**

1. **Sequential Thinking Tool** (`sequential-thinking`)
   - 基於 Redis 記憶分析任務、識別風險、驗證可行性
   - 詳細指南：[mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md)

2. **Software Planning Tool** (`software-planning-tool`)
   - 參考 Redis 知識創建可執行計畫、追蹤進度
   - 詳細指南：[mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md)

#### 🔴 第 2 步：查閱記憶庫（必須）
```bash
# 打開記憶庫
.github/copilot/memory.jsonl

# 快速查詢
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("關鍵字"))'
```

#### 🔴 第 3 步：檢查系統架構（必須）
```bash
# 打開系統架構思維導圖
docs/architecture/01-system-architecture-mindmap.mermaid.md
```

#### 🔴 第 4 步：完成啟動檢查清單（必須）
- 使用 [agent-startup-checklist.md](./agent-startup-checklist.md)
- 確認所有必須項目已完成
- **特別注意**：Redis 外掛大腦 + MCP 工具使用

#### 第 5 步：執行任務
- **Redis 優先**：載入外掛大腦記憶
- **工具優先**：Sequential Thinking + Software Planning（結合 Redis）
- **Context7 (@C7)**：查官方來源（Angular、ng-alain、Supabase）
- **文件索引**：使用 `docs-index.md` 尋找對應 `docs/` 文件
- **決策支援**：使用 `QUICK-START.md` 的決策樹快速定位
- **任務執行**：依 `domain/*.md` 檢查清單逐項完成
- **品質把關**：參考每個 agent 的審查檢查清單
- **進度追蹤**：使用 Software Planning Tool 的 `update_todo_status` 更新進度

#### 第 6 步：任務完成後 - 更新 Redis 外掛大腦（必須）⭐⭐⭐⭐⭐
```bash
# 1. 保存決策
redis-cli SET history:decisions:$(date +%Y%m%dT%H%M%S) '{"task":"...","decision":"..."}'

# 2. 更新專案知識
redis-cli SET project:knowledge:new_domain '{"pattern":"..."}'

# 3. 更新統計
redis-cli INCR stats:tasks:total_completed

# 4. 記錄反饋
redis-cli SET feedback:$(date +%Y%m%dT%H%M%S) '{"effective":true}'
```

**成長效果**：每次任務讓 Agent 更聰明，越用越熟悉專案 🌱

## 🧭 推薦閱讀順序

### 初次了解專案
1. `agent-startup-checklist.md` – ⭐⭐⭐⭐⭐ **企業標準啟動流程（從這裡開始）**
2. `mcp-tools-workflow-guide.md` – ⭐⭐⭐⭐⭐ **MCP 工具完整使用指南（新）**
3. `memory-usage-guide.md` – ⭐⭐⭐⭐⭐ **記憶庫使用指南（如何查詢）**
4. `.github/copilot/memory.jsonl` – ⭐⭐⭐⭐⭐ **專案記憶庫（必讀）**
5. `docs/architecture/01-system-architecture-mindmap.mermaid.md` – ⭐⭐⭐⭐⭐ **系統架構思維導圖**
6. `development-sequence-guide.md` – ⭐⭐⭐⭐⭐ **五層架構開發順序指南（開發任務必讀）**
7. `QUICK-START.md` – ⭐⭐⭐⭐ 決策樹與快速參考
8. `role.agent.md` – ⭐⭐⭐ AI 角色定位與回覆原則
9. `ng-alain-github-agent.md` – ⭐⭐⭐⭐⭐ 專案願景、架構、資料與 API 摘要
10. `docs-index.md` – ⭐⭐⭐ 確認任務涉及的 `docs/` 原始資料

### 執行特定任務
1. **使用 MCP 工具**（絕對必須）：`Sequential Thinking` → `Software Planning Tool`
2. **查閱記憶庫**（必須）：`.github/copilot/memory.jsonl` 搜尋相關實體
3. **檢查架構圖**（必須）：`docs/architecture/01-system-architecture-mindmap.mermaid.md` 理解系統架構
4. **完成檢查清單**（必須）：`agent-startup-checklist.md` 確認所有必須項目
5. **新功能開發**（必須）：`development-sequence-guide.md` 遵循五層架構順序
6. `QUICK-START.md` - 使用決策樹找到對應文件
7. `domain/*.md` – 依任務類型套用專家檢查表
8. `docs-index.md` - 查找詳細文檔
9. `role-config.md` – 需要快速複製的 system message 時使用

## 📚 核心文件說明

### Redis 外掛大腦（新增）⭐⭐⭐⭐⭐
| 文件 | 用途 | 適用對象 |
|------|------|----------|
| [redis-external-brain-guide.md](./redis-external-brain-guide.md) | **Redis 外掛大腦完整指南**：長期記憶、知識累積、持續成長 | **所有 Agent（絕對必讀）** |

**Redis 成長循環**：
1. **載入記憶** - 從 Redis 讀取使用者偏好、專案知識、歷史決策
2. **結合推論** - Sequential Thinking + Software Planning 結合 Redis 記憶
3. **更新知識** - 將新決策、模式、統計寫回 Redis
4. **持續成長** - 每次任務讓 Agent 更聰明，越用越熟悉專案

### MCP 工具使用⭐⭐⭐⭐⭐
| 文件 | 用途 | 適用對象 |
|------|------|----------|
| [mcp-tools-workflow-guide.md](./mcp-tools-workflow-guide.md) | Sequential Thinking 和 Software Planning Tool 完整使用指南 | **所有 Agent（必讀）** |

**工具使用流程（結合 Redis）**：
1. **Redis 載入** - 載入外掛大腦的記憶
2. **Sequential Thinking** - 基於 Redis 記憶分析任務
3. **Software Planning** - 參考 Redis 知識創建計畫
4. **執行與追蹤** - 更新進度
5. **Redis 更新** - 寫回新知識，讓 Agent 成長

### 企業標準文件⭐⭐⭐⭐⭐
| 文件 | 用途 | 適用對象 |
|------|------|----------|
| [agent-startup-checklist.md](./agent-startup-checklist.md) | 企業標準啟動檢查清單、強制執行流程 | **所有 Agent（必讀）** |
| [memory-usage-guide.md](./memory-usage-guide.md) | 記憶庫使用指南、查詢方法、常見場景 | **所有 Agent（必讀）** |
| [development-sequence-guide.md](./development-sequence-guide.md) | 五層架構開發順序指南（Agent 專用版）| **開發任務 Agent（必讀）** |
| [enterprise-compliance-checklist.md](./enterprise-compliance-checklist.md) | 企業標準合規檢查清單（五級檢查）| **所有 Agent（必讀）** |
| [.github/copilot/memory.jsonl](../copilot/memory.jsonl) | 專案記憶庫（149 實體 + 170 關係） | **所有 Agent（必讀）** |

### 自動化工具（新增）⭐⭐⭐⭐⭐
| 工具 | 用途 | 適用場景 |
|------|------|----------|
| [tools/validate-compliance.sh](./tools/validate-compliance.sh) | 自動檢查 Level 0-5 合規性 | PR 提交前、開發過程中 |
| [tools/check-memory-coverage.sh](./tools/check-memory-coverage.sh) | 檢查記憶庫覆蓋率 | 記憶庫更新後 |
| [tools/verify-dev-sequence.sh](./tools/verify-dev-sequence.sh) | 驗證開發順序遵循情況 | 新功能開發後 |
| [tools/monitoring-prototype.md](./tools/monitoring-prototype.md) | 監控追蹤系統雛型設計 | 系統監控規劃 |
| [tools/README.md](./tools/README.md) | 工具使用說明與快速開始 | **工具使用者（必讀）** |

### 指引文件
| 文件 | 用途 | 適用對象 |
|------|------|----------|
| [QUICK-START.md](./QUICK-START.md) | 快速開始指南、決策樹、常見任務參考 | 所有 Agent（新手必讀） |
| [role.agent.md](./role.agent.md) | AI 角色定位、工作流程、回覆原則 | 所有 Agent |
| [ng-alain-github-agent.md](./ng-alain-github-agent.md) | 專案架構、技術棧、資料模型摘要（已優化） | 開發相關任務 |
| [docs-index.md](./docs-index.md) | docs/ 目錄索引 | 查找詳細文檔時 |
| [role-config.md](./role-config.md) | System message 精簡版 | 快速參考時 |

### 領域專家文件（domain/）
| Agent | 職責範圍 | 適用情境 |
|-------|----------|----------|
| [angular-agent.md](./domain/angular-agent.md) | Angular 20 + Signals 開發規範 | 元件開發、模板編寫、程式碼審查 |
| [typescript-agent.md](./domain/typescript-agent.md) | TypeScript 型別安全與品質 | 型別定義、型別檢查、模型一致性 |
| [code-quality-agent.md](./domain/code-quality-agent.md) | 代碼品質與最佳實踐 | Code Review、重構、品質檢查 |
| [security-agent.md](./domain/security-agent.md) | 安全與權限控制 | 安全審查、RLS 設定、憑證管理 |
| [performance-agent.md](./domain/performance-agent.md) | 效能優化 | 效能問題診斷、優化建議 |
| [testing-agent.md](./domain/testing-agent.md) | 測試策略與實踐 | 撰寫測試、測試審查、覆蓋率 |
| [accessibility-agent.md](./domain/accessibility-agent.md) | 無障礙性與 WCAG 合規 | A11y 審查、WCAG 檢查 |
| [docs-agent.md](./domain/docs-agent.md) | 文件維護與更新 | 更新文件、文件審查 |

## 🔗 Docs Index 快速導覽
- `docs-index.md` 提供 `docs/` 目錄的分類索引（架構、流程、資料、權限、Agent 等九大類）。
- 每個項目都附 `@file` 標籤與說明，方便在回覆中引用。
- 若新增或修改 `docs/` 內容，請同步更新 `docs-index.md` 並於 PR 描述記錄。

## 🤖 AI 助手專用配置

### 新增檔案（2025-11-20）
專案現已提供針對不同 AI 助手的專門配置：

| AI 助手 | 配置檔案 | 大小 | 特色 | 適用場景 |
|---------|---------|------|------|----------|
| **GitHub Copilot** | [copilot-instructions.md](./copilot-instructions.md) | 4.5KB | Agent Mode 優化 | 日常開發、代碼補全 |
| **Claude AI** | [CLAUDE.md](../../CLAUDE.md) | 7KB | 長上下文（200K tokens） | 架構設計、深度分析 |
| **Google Gemini** | [GEMINI.md](../../GEMINI.md) | 9KB | 多模態、即時搜尋 | UI 設計圖轉代碼 |
| **Cursor IDE** | [.cursor/rules/](../../.cursor/rules/) | - | 28 個規則自動應用 | 即時規則檢查 |

### 使用建議

**Claude AI** 適合：
- 一次性閱讀多個相關文件（支援 200K tokens）
- 完整模組架構設計
- 大型 PR 審查
- 複雜業務邏輯梳理
- 使用 Artifacts 生成完整代碼
- Projects 功能整合專案知識庫

**Google Gemini** 適合：
- 上傳 UI 設計圖生成 Component 代碼
- 解析流程圖並實作業務邏輯
- 審查錯誤截圖
- 使用 Grounding 搜尋最新 API 資訊
- Code Execution 驗證邏輯
- 超長上下文（1M tokens）

**GitHub Copilot** 適合：
- VSCode 內代碼補全
- Chat 功能快速問答
- Agent Mode 執行複雜任務
- 自動引用專案文檔（`@workspace`）

**Cursor IDE** 適合：
- 即時代碼建議
- 按目錄自動應用規則
- 代碼重構建議
- 即時錯誤檢查

## 📂 模組特定規範（2025-11-20 優化）

所有模組的 AGENTS.md 文件已全面優化，現在包含：

| 模組 | 檔案 | 大小 | 新增內容 |
|------|------|------|----------|
| **Core** | [src/app/core/AGENTS.md](../../src/app/core/AGENTS.md) | 5KB | HTTP 攔截器、錯誤處理範例 |
| **Shared** | [src/app/shared/AGENTS.md](../../src/app/shared/AGENTS.md) | 5KB | SHARED_IMPORTS、工具函數範例 |
| **Layout** | [src/app/layout/AGENTS.md](../../src/app/layout/AGENTS.md) | 5KB | 響應式設計、可訪問性範例 |
| **Routes** | [src/app/routes/AGENTS.md](../../src/app/routes/AGENTS.md) | 6.5KB | 路由配置、Facade 模式範例 |

### 模組規範統一結構
- 📖 目的說明與模組職責
- ⚡ 快速參考（依賴關係、關鍵原則）
- 📋 核心規範檢查清單（附完整代碼範例）
- 🧪 測試要求（覆蓋率標準、測試重點）
- 📚 相關 Cursor 規則
- 🔗 相關文檔（必讀、參考）
- 💡 AI 助手使用建議（適合的 AI、Prompt 範例）

## 🎯 文件改進重點

### v2.2（2025-11-20）更新 🆕
**新增 AI 助手專用配置**：
- ✅ `CLAUDE.md` - Claude AI 配置（7KB）
- ✅ `GEMINI.md` - Google Gemini 配置（9KB）
- ✅ Root `AGENTS.md` - AI 助手總覽入口
- ✅ `copilot-instructions.md` - GitHub Copilot Agent 優化版（4.5KB）

**優化所有模組規範**：
- ✅ 統一文檔結構與格式
- ✅ 新增完整代碼範例（✅ 正確 / ❌ 錯誤）
- ✅ 新增檢查清單格式
- ✅ 新增 AI 助手使用建議與 Prompt 範例
- ✅ GitHub Copilot Agent 友善格式

### v2.1（2025-11-20）更新
所有 domain agent 文件現已包含：
- ✅ 明確的角色定位與適用場景
- ✅ 詳細的核心檢查清單（每項都有範例）
- ✅ 正反面範例（✅ 正確 / ❌ 錯誤）
- ✅ 常見錯誤與解決方案
- ✅ 審查檢查清單
- ✅ 必跑指令
- ✅ 參考來源

### 已改進的 Agents
- ✅ angular-agent.md - 大幅增強（250+ 行，包含 Signals、Control Flow、Forms 等詳細範例）
- ✅ typescript-agent.md - 大幅增強（250+ 行，包含型別安全、模型一致性等）
- ✅ security-agent.md - 大幅增強（300+ 行，包含 RLS、Token、依賴安全等）
- 🔄 其他 agents 持續改進中...

## 🔗 關聯資源
- `AGENTS.md` – 專案最高層決策與規範索引
- `docs/` – 完整詳細文件，agents 僅保留摘要並附連結
- `.cursor/rules/` – Cursor 自動載入的細部規範，domain agents 會引用對應章節

## 💡 最佳實踐

### 使用這些文件時
- ✅ **先搜尋官方文檔**（使用 @C7）再查專案文件
- ✅ **引用文件來源**（使用 `@file` 標籤）
- ✅ **遵循檢查清單**（每個 agent 都提供）
- ✅ **執行必要指令**（lint/type-check/test/build）
- ✅ **提供範例**（好的 ✅ 和壞的 ❌）

### 維護這些文件時
- ✅ 保持兩套文件同步（.copilot-* 和非 .copilot-）
- ✅ 添加實際範例和常見錯誤
- ✅ 更新版本號和更新日期
- ✅ 在 PR 中記錄文件變更

---
**最後更新**：2025-11-20  
**版本**：v2.2  
**維護者**：開發團隊  
**主要改進**：新增 AI 助手專用配置（CLAUDE.md, GEMINI.md），優化所有模組 AGENTS.md，GitHub Copilot Agent 全面優化
