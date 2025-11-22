# Memory.jsonl 自動加載實施說明

> **目的**：說明如何實現 Agents 自動查看 memory.jsonl 的機制

## 實施概覽

本專案已實施完整的 memory.jsonl 自動加載機制，確保所有 AI 助手在執行任務時都會查閱專案記憶庫。

## 實施架構

```markdown
│                     AI 助手入口點                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. AGENTS.md                                               │
│     └─ 🧠 專案記憶庫（所有 AI 助手必讀）                    │
│                                                              │
│  2. .copilot-instructions.md                                │
│     └─ 🧠 專案記憶庫（必讀）                                │
│                                                              │
│  3. .github/agents/ng-alain-github-agent.md                 │
│     └─ 🧠 專案記憶庫（必讀）                                │
│                                                              │
│  4. .github/agents/copilot-instructions.md                  │
│     └─ 🧠 專案記憶庫（Priority #1）                         │
│                                                              │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ 所有入口點都包含記憶庫引用
                    │
                    ↓
┌─────────────────────────────────────────────────────────────┐
│                    記憶庫核心文件                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  📄 .github/copilot/memory.jsonl                            │
│     ├─ 161 個實體（Entity）                                 │
│     │   ├─ Architecture（架構）                             │
│     │   ├─ Security（安全）                                 │
│     │   ├─ Standard（標準）                                 │
│     │   ├─ Principle（原則）                                │
│     │   ├─ Feature（功能）                                  │
│     │   ├─ Pattern（模式，包含核心服務實現模式）            │
│     │   └─ ...其他 28 個類別                                │
│     │                                                        │
│     └─ 193 個關係（Relation）                               │
│         ├─ uses（使用）                                      │
│         ├─ implements（實作）                                │
│         ├─ enforces（強制）                                  │
│         ├─ requires（需要）                                  │
│         └─ ...其他 36 種關係                                 │
│                                                              │
│  📚 .github/copilot/USAGE-GUIDE.md                          │
│     └─ 完整使用指南（如何查詢、使用場景、最佳實踐）         │
│                                                              │
│  📋 .github/copilot/MEMORY_SUMMARY.md                       │
│     └─ 記憶庫摘要（統計資訊、版本歷史）                     │
│                                                              │
│  📖 .github/copilot/README.md                               │
│     └─ 基本說明（快速開始、自動加載機制）                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 自動加載機制

### 機制 1：配置文件頂部引用

所有主要 Agent 配置文件都在開頭包含醒目的記憶庫章節：

```markdown
## 🧠 專案記憶庫（必讀）

**⚠️ 重要：每次執行任務前，請先查閱專案記憶庫**

記憶庫檔案：[.github/copilot/memory.jsonl](../copilot/memory.jsonl)

...（詳細說明）
```

### 機制 2：視覺提示

使用圖標和格式強調重要性：
- 🧠 圖標：代表記憶和知識
- ⚠️ 圖標：表示警告和重要性
- **粗體**：強調關鍵文字
- `代碼格式`：突出文件路徑

### 機制 3：多層級引用

四個層級確保覆蓋所有使用場景：

1. **根目錄層級**
   - `AGENTS.md` - 所有 AI 助手的入口
   - `.copilot-instructions.md` - VSCode Copilot 主要指引

2. **GitHub Agents 層級**
   - `.github/agents/ng-alain-github-agent.md` - 主要 Agent 配置
   - `.github/agents/copilot-instructions.md` - Copilot Agent 簡要指引

3. **領域專家層級**
   - 繼承主配置的記憶庫引用
   - `.github/agents/domain/*.md`

4. **專用配置層級**
   - `CLAUDE.md` - Claude AI 配置
   - `GEMINI.md` - Google Gemini 配置

### 機制 4：使用指南

提供完整的使用文檔：

| 文檔 | 用途 | 適用對象 |
|------|------|----------|
| **USAGE-GUIDE.md** | 完整使用指南 | AI 助手、開發者 |
| **README.md** | 快速開始 | 新用戶 |
| **MEMORY_SUMMARY.md** | 統計摘要 | 維護者 |

## Agent 使用流程

### 標準流程

1. 任務開始
```bash
2. 讀取 Agent 配置文件
   ├─ 看到「專案記憶庫（必讀）」章節
   └─ 提醒查閱 memory.jsonl
   ↓
3. 查詢記憶庫
   ├─ 按名稱查詢特定實體
   ├─ 按類別查詢相關實體
   ├─ 按關鍵字搜尋
   └─ 查詢相關關係
   ↓
4. 理解上下文
   ├─ 架構設計原則
   ├─ 開發標準規範
   ├─ 安全要求
   └─ 已知模式
   ↓
5. 執行任務
   └─ 基於記憶庫知識做決策
   ↓
6. 完成任務
   └─ 建議更新記憶庫（如有新發現）
```

### 查詢範例

#### 範例 1：開發新功能

```bash
# 1. 查詢開發順序
cat .github/copilot/memory.jsonl | \
  jq 'select(.name=="Five Layer Development Order")'

# 2. 查詢安全規範
cat .github/copilot/memory.jsonl | \
  jq 'select(.type=="entity" and .entityType=="Security")'

# 3. 查詢 UI 規範
cat .github/copilot/memory.jsonl | \
  jq 'select(.name=="UI Component Priority")'
```

#### 範例 2：代碼審查

```bash
# 1. 查詢審查標準
cat .github/copilot/memory.jsonl | \
  jq 'select(.name=="Code Review Standards")'

# 2. 查詢核心原則
cat .github/copilot/memory.jsonl | \
  jq 'select(.name=="Four Core Development Principles")'
```

#### 範例 3：架構設計

```bash
# 1. 查詢架構模式
cat .github/copilot/memory.jsonl | \
  jq 'select(.type=="entity" and .entityType=="Architecture")'

# 2. 查詢分支模型
cat .github/copilot/memory.jsonl | \
  jq 'select(.name=="Git-like Branch Model")'
```

## 實施效果

### ✅ 達成目標

1. **自動提醒**
   - 所有 Agent 配置都包含記憶庫引用
   - 視覺化提示（🧠 ⚠️ 圖標）
   - 清晰的位置和連結

2. **完整文檔**
   - 使用指南（6930 字）
   - 查詢範例（bash 命令）
   - 使用場景（4 個完整範例）

3. **多層級覆蓋**
   - 根目錄配置（2 個文件）
   - GitHub Agents（2 個文件）
   - 記憶庫文檔（4 個文件）

4. **易於維護**
   - 集中管理（單一 memory.jsonl）
   - 版本控制（MEMORY_SUMMARY.md）
   - 更新指引（USAGE-GUIDE.md）

### 📊 統計資訊

配置文件更新：6 個
├─ AGENTS.md
```mermaid
├─ .github/agents/ng-alain-github-agent.md
├─ .github/agents/copilot-instructions.md
├─ .github/copilot/README.md
└─ .github/copilot/USAGE-GUIDE.md (新建)

記憶庫內容：
├─ 實體：161 個
│   ├─ Standard: 48
│   ├─ Feature: 18（+4：Realtime Communication System, Explore Module, Dashboard Module, Daily Report System）
│   ├─ Pattern: 12（+8：核心服務實現模式）
│   ├─ Principle: 13
│   └─ 其他 30 個類別: 70
│
└─ 關係：193 個
    ├─ uses: 26+
    ├─ implements: 21+
    ├─ enforces: 14+
    └─ 其他 37+ 種: 132+
```

## 使用驗證

### 驗證 1：配置文件檢查

```bash
# 檢查所有配置文件是否包含記憶庫引用
grep -r "專案記憶庫" \
  AGENTS.md \
  .copilot-instructions.md \
  .github/agents/ng-alain-github-agent.md \
  .github/agents/copilot-instructions.md

# 預期：所有文件都應該匹配
```

### 驗證 2：記憶庫格式檢查

```bash
# 驗證 JSON 格式
cat .github/copilot/memory.jsonl | jq '.' > /dev/null

# 預期：無錯誤輸出
```

### 驗證 3：統計資訊檢查

```bash
# 計算實體數量
cat .github/copilot/memory.jsonl | \
  jq -s '[.[] | select(.type=="entity")] | length'

# 預期：161

# 計算關係數量
cat .github/copilot/memory.jsonl | \
  jq -s '[.[] | select(.type=="relation")] | length'

# 預期：193
```

## 維護指南

### 定期檢查（每月）

1. **內容審查**
   - 確認所有實體仍然有效
   - 更新過時的觀察
   - 添加新的規範和模式

2. **格式驗證**
   - 執行 JSON 格式檢查
   - 確認所有引用有效
   - 更新統計資訊

3. **文檔同步**
   - 更新 MEMORY_SUMMARY.md
   - 更新版本號和日期
   - 記錄主要變更

### 更新流程

1. 發現新知識
   ↓
2. 定義實體/關係
```text
   ├─ 編寫觀察（具體、可追溯）
   └─ 定義關係
   ↓
3. 添加到 memory.jsonl
   └─ 按字母順序插入
   ↓
4. 驗證格式
   └─ jq '.' memory.jsonl > /dev/null
   ↓
5. 更新文檔
   ├─ 更新 MEMORY_SUMMARY.md
   │   ├─ 實體/關係數量
   │   ├─ 類別統計
   │   └─ 版本號
   └─ 記錄變更原因
   ↓
6. 提交變更
   └─ git commit -m "docs: update memory.jsonl - [變更說明]"
```

## 常見問題

### Q1：為什麼使用 JSONL 格式？

**A**：JSONL（JSON Lines）格式的優點：
- 每行一個 JSON 物件，易於處理
- 支援串流讀取，不需載入全部內容
- 易於合併和版本控制
- 使用 `jq` 工具方便查詢

### Q2：如何確保 Agents 真的會查閱？

**A**：通過多層機制：
1. 配置文件頂部醒目章節
2. 視覺提示（🧠 ⚠️ 圖標）
3. 明確標記為「必讀」或「Priority #1」
4. 提供具體的查詢範例
5. 在使用指南中說明標準流程

### Q3：記憶庫會不會太大？

**A**：目前不會：
- 161 實體 + 193 關係 = 401 行
- 檔案大小約 120KB
- jq 查詢非常快速
- 可按需查詢特定實體

### Q4：如何避免記憶庫過時？

**A**：定期維護機制：
- 每月審查一次內容
- 主要變更時立即更新
- 版本控制追蹤變更
- 文檔同步機制

### Q5：新的 Agent 如何知道記憶庫？

**A**：自動繼承：
- 所有 Agent 都繼承主配置
- 主配置包含記憶庫引用
- 新 Agent 創建時遵循模板
- 文檔提供清晰指引

## 相關資源

### 核心文檔
- [memory.jsonl](./memory.jsonl) - 主記憶檔案
- [USAGE-GUIDE.md](./USAGE-GUIDE.md) - 完整使用指南
- [MEMORY_SUMMARY.md](./MEMORY_SUMMARY.md) - 記憶庫摘要
- [README.md](./README.md) - 基本說明

### Agent 配置
- [AGENTS.md](../../AGENTS.md) - AI 助手總覽
- [.copilot-instructions.md](../../.copilot-instructions.md) - Copilot 指引
- [ng-alain-github-agent.md](../agents/ng-alain-github-agent.md) - 主要 Agent
- [copilot-instructions.md](../agents/copilot-instructions.md) - Copilot Agent

### 開發指南
- [docs/43-Agent開發指南與限制說明.md](../../docs/43-Agent開發指南與限制說明.md) - Agent 開發指南（如存在）

---

**版本**：v1.1.0（更新統計數據以反映 v4.1 新增內容）  
**最後更新**：2025-01-21  
**維護者**：開發團隊  
**狀態**：✅ 已實施並運行中
