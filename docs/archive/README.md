# 文檔封存 | Documentation Archive

> **目的**: 本目錄存放已過時、已完成或不再維護的文檔，保留作為歷史參考  
> **最後更新**: 2025-01-20

---

## 📋 封存原則

### ✅ 應該封存的文檔

- 已完成且不再更新的設計文檔
- 已被新版本取代的舊文檔
- 已棄用的功能說明
- 歷史階段完成報告
- 不再使用的實施記錄

### ❌ 不應該封存的文檔

- 仍在使用的參考文檔
- 當前開發指南
- 活躍的規範文檔
- 系統架構文檔（除非已完全重寫）

---

## 📂 組織方式

### 按年份組織

```
archive/
├── 2024/              # 2024 年的歷史文檔
│   ├── phase-completions/
│   └── workspace-tracking/
└── 2025/              # 2025 年的歷史文檔
    └── ...
```

### 按類型組織

```
archive/
├── phase-completions/     # 階段完成報告
├── workspace-tracking/    # 工作區追蹤記錄
├── deprecated/            # 已棄用的設計文檔
└── superseded/            # 已被取代的文檔
```

---

## 📚 已封存文檔清單

### 階段完成報告 (Phase Completions)

- **PHASE0_COMPLETION_REPORT.md** - Phase 0 完成報告
- **WEEK1_COMPLETION_REPORT.md** - 第一週完成報告
- **WEEK2_COMPLETION_REPORT.md** - 第二週完成報告
- **facades-phase1-complete-summary.md** - Facades Phase 1 完成總結

### 工作區追蹤記錄 (Workspace Tracking)

- **analysis-summary-zh.md** - 分析摘要（中文版）
- **facades-enhancement-progress-history.md** - Facades 增強進度歷史
- **facades-implementation-record.md** - Facades 實施記錄

---

## 🔍 查看方式

### 瀏覽封存文檔

1. 直接瀏覽本目錄結構
2. 使用檔案總管或 IDE 搜尋功能

### 從 Git 歷史查看

如需查看已刪除的封存文檔：

```bash
# 查看所有封存相關的提交
git log --all -- docs/archive/

# 查看特定文件的歷史
git log --all -- docs/archive/path/to/file.md

# 恢復特定版本的文件
git show <commit>:docs/archive/path/to/file.md > recovered-file.md
```

### 搜尋封存內容

```bash
# 在封存目錄中搜尋關鍵字
grep -r "關鍵字" docs/archive/

# 使用 Git 搜尋歷史內容
git log -S "關鍵字" --all -- docs/archive/
```

---

## 📝 封存流程

### 何時封存文檔

1. **階段完成後**: 當一個開發階段完成，相關的追蹤報告可以封存
2. **文檔被取代**: 當新版本文檔已完全取代舊版本
3. **功能已棄用**: 當相關功能已從系統中移除
4. **定期整理**: 每季度或每半年進行一次文檔整理

### 封存步驟

1. **確認文檔狀態**
   - [ ] 確認文檔已完成或已取代
   - [ ] 確認沒有其他文檔依賴此文件
   - [ ] 確認已更新相關連結

2. **移動文檔**
   ```bash
   # 移動到對應的封存目錄
   git mv docs/path/to/file.md docs/archive/2025/file.md
   ```

3. **更新索引**
   - [ ] 更新本 README.md 的文檔清單
   - [ ] 更新主 README.md 的連結（如有需要）
   - [ ] 在原始位置留下重定向說明（可選）

4. **提交變更**
   ```bash
   git commit -m "docs: archive outdated documentation"
   ```

---

## 🔗 相關文檔

- [docs/README.md](../README.md) - 主文檔索引
- [docs/workspace/README.md](../workspace/README.md) - 工作區文檔（包含封存說明）

---

## 📊 統計資訊

- **封存文檔總數**: 9+ 個
- **最後更新**: 2025-11-22
- **維護狀態**: 定期整理

---

**最後更新**: 2025-01-20  
**維護者**: 文檔團隊

