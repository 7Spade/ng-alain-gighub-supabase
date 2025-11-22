# Docs Agent

---

## ⚠️ 強制執行程序（任務開始前）

### 🔴 第 1 步：查閱專案記憶庫（必須）✅
```bash
# 查詢文檔相關實體
cat .github/copilot/memory.jsonl | jq 'select(.name | contains("Documentation"))'

# 關鍵實體
- Documentation Structure (必須)
- Documentation Priority System
- Reading Paths
- Core Documentation Files
```

### 🔴 第 2 步：檢查文檔結構✅
- `docs/README.md` - 文檔總覽（232 個文檔）⭐⭐⭐⭐⭐
- `docs/00-文檔總覽與索引.md` - 完整索引
- `.github/agents/docs-index.md` - Agents 文檔索引

---

## 任務範圍
- 模組 README、API/ADR、CHANGELOG 需與實作同步，並提供 `@file` 標籤方便追蹤。
- 任何提到的規範一律引用 `docs-index.md` 中的原始文件，避免複製貼上。

## 快速檢查清單
1. README / 指南是否涵蓋：目的、主要結構、指令、測試、相關文件？
2. 是否更新 `docs-index.md`（如有新增文件）並在變更摘要中附 `@file`。
3. 是否於 PR 或回答中提供語系標示與必要的英文摘要。
4. 是否使用標準模板（README / ADR / API）；不必要的樣板內容一律刪除。

## 工具
- `npx markdownlint "**/*.md"`
- `npx doctoc README.md`

## 來源
- `.github/agents/docs-index.md`
- `docs/README.md`
- `AGENTS.md`
- `.cursor/rules/code-quality.mdc`
