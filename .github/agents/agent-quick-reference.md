# 文檔標準化專案 - Agent 快速參考

> **用途**: 供 AI Agent 快速了解文檔標準化成果與規則  
> **建立日期**: 2025-01-20  
> **適用範圍**: ng-alain-gighub 專案所有文檔

---

## 🎯 核心規則（Agent 必讀）

### 1. 命名規範 **[強制]**
```text
✅ 範例: getting-started.md, api-standards.md
❌ 禁止: 中文檔名、camelCase、snake_case
❌ 禁止: Getting-Started.md, API_Standards.md
```

### 2. 目錄結構 **[強制]**
docs/
```mermaid
├── architecture/   # 架構設計（01-21-*.mermaid.md）
├── guides/         # 開發指南（*.md）
├── reference/      # 參考文檔（*.md）
├── workspace/      # 工作區系統（workspace-*.md）
├── delon-index/    # @delon 套件索引
├── ng-zorro-index/ # NG-ZORRO 元件索引
└── archive/        # 歸檔文檔
```

### 3. 文檔結構 **[必要]**
```markdown
# 文檔標題 (H1) - 必須有且僅有一個

## 目的 (Purpose) - 必要
說明本文檔的目的

## 目標讀者 (Audience) - 必要
列出目標讀者

## 內容主體
[主要內容]

## 使用方法 (Usage) - 指南類必要
如何使用

## 參考資源 (References) - 建議
相關連結
```

---

## 📁 文檔分類規則

| 文檔類型 | 放置目錄 | 命名規則 | 範例 |
|---------|---------|---------|------|
| 開發規範 | specs/ | 00-*-standards.md | 00-api-standards.md |
| 架構圖 | architecture/ | 數字-*-diagram.mermaid.md | 01-system-architecture-mindmap.mermaid.md |
| 開發指南 | guides/ | *-guide.md 或 *.md | getting-started.md, testing-guide.md |
| API/資料庫 | reference/ | *.md | api-documentation.md, sql-schema-definition.md |
| 工作區 | workspace/ | workspace-*.md | workspace-context-overview.md |

---

## 🔍 快速查詢

### 尋找特定文檔

**Q: 如何開始開發？**
→ `docs/guides/getting-started.md`

**Q: 開發規範在哪？**
→ `docs/specs/` 目錄，查看 `README.md`

**Q: 系統架構圖？**
→ `docs/architecture/20-complete-architecture-flowchart.mermaid.md` ⭐

**Q: 資料庫結構？**
→ `docs/reference/sql-schema-definition.md` ⭐⭐⭐⭐⭐

**Q: 工作區系統？**
→ `docs/workspace/` 目錄

### 常用文檔路徑

docs/guides/getting-started.md                    # 快速開始
docs/guides/development-best-practices.md         # 最佳實踐
```shell
docs/architecture/20-complete-architecture-flowchart.mermaid.md  # 完整架構
docs/reference/sql-schema-definition.md           # 資料表結構
```

---

## 📝 新增文檔流程

### Agent 新增文檔時應：

1. **確定分類**
   ```
   規範？ → specs/
   架構圖？ → architecture/
   指南？ → guides/
   API/DB？ → reference/
   工作區？ → workspace/
   ```

2. **使用正確命名**
   ```bash
   # ✅ 正確
   docs/guides/new-feature-guide.md
   
   # ❌ 錯誤
   docs/新功能指南.md
   docs/NewFeatureGuide.md
   ```

3. **使用標準模板**
   ```markdown
   # 文檔標題
   
   > **簡短描述**
   
   ## 目的
   ## 目標讀者
   ## 內容主體
   ## 使用方法
   ## 參考資源
   
   ---
   **最後更新**: YYYY-MM-DD
   ```

4. **更新對應 README**
   - 在該目錄的 `README.md` 中登記新文檔
   - 添加簡短說明

---

## ⚠️ Agent 常見錯誤

### ❌ 錯誤 1: 中文檔名
```bash
# 錯誤
docs/快速開始.md

# 正確
docs/guides/getting-started.md
```

### ❌ 錯誤 2: 放錯目錄
```bash
# 錯誤：指南放在根目錄
docs/deployment-guide.md

# 正確
docs/guides/deployment-guide.md
```

### ❌ 錯誤 3: 缺少 H1
```markdown
# 錯誤：無 H1
## 開始使用

# 正確：有 H1
# 快速開始指南
## 目的
```

### ❌ 錯誤 4: 跳級標題
```markdown
# 錯誤：H1 → H3
# 主標題
### 子標題  ← 跳過 H2

# 正確
# 主標題
## 第一節
### 第一節子項
```

---

## 🔗 重要文檔連結

### 完整規範（Agent 必讀）
- **標準化規範**: `.github/agents/markdown-documentation-standards.md` (9,624 字)
- **重構計劃**: `.github/agents/document-refactoring-plan.md` (8,794 字)
- **品質報告**: `.github/agents/documentation-quality-improvement-report.md` (8,990 字)

### 各目錄索引
- **規範索引**: `docs/specs/README.md`
- **架構索引**: `docs/architecture/README.md`
- **指南索引**: `docs/guides/README.md`
- **參考索引**: `docs/reference/README.md`
- **工作區索引**: `docs/workspace/README.md`

---

## 📊 統計數據

| 項目 | 數量 |
|------|------|
| 總文檔數 | 83+ |
| 規範文檔 | 15 |
| 架構文檔 | 19 |
| 開發指南 | 27 |
| 參考文檔 | 11 |
| 工作區文檔 | 8 |
| 子目錄 README | 5 |

---

## ✅ Agent 檢查清單

在處理文檔時，Agent 應檢查：

### 新增文檔
- [ ] 檔名使用 kebab-case
- [ ] 放在正確的目錄分類
- [ ] 有且僅有一個 H1 標題
- [ ] 包含「目的」章節
- [ ] 包含「目標讀者」章節
- [ ] 標題層級連續（H1→H2→H3）
- [ ] 在對應 README 中登記

### 修改文檔
- [ ] 保持檔名 kebab-case
- [ ] 不改變目錄分類（除非有充分理由）
- [ ] 更新「最後更新」日期
- [ ] 確保內部連結仍然有效

### 移動文檔
- [ ] 使用 `git mv` 保留歷史
- [ ] 更新所有引用此文檔的連結
- [ ] 更新舊目錄和新目錄的 README
- [ ] 在 commit message 中說明原因

---

## 🚀 快速命令

### 查看文檔結構
```bash
cd docs && find . -maxdepth 2 -type f -name "*.md" | sort
```

### 檢查命名規範
```bash
# 查找非 kebab-case 的檔案（排除子目錄）
cd docs && find . -maxdepth 1 -type f -name "*.md" | grep -v "^.*[A-Z_].*$" || echo "All good!"
```

### 統計各目錄文檔數
```bash
for dir in specs architecture guides reference workspace delon-index ng-zorro-index; do
  echo "$dir: $(find docs/$dir -type f -name '*.md' | wc -l) files"
done
```

---

## 📞 需要協助？

如果 Agent 不確定：
1. 查閱完整規範：`.github/agents/markdown-documentation-standards.md`
2. 參考現有文檔的組織方式
3. 遵循「最小變更原則」
4. 在 commit message 中註明不確定之處

---

**本文檔為 Agent 快速參考，詳細規範請見 `markdown-documentation-standards.md`**

**最後更新**: 2025-01-20  
**維護者**: AI Agent Team
