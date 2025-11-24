# 工作流程文檔 | Workflow Documentation

> **目的**: 本目錄包含 ng-alain-gighub 專案的開發工作流程與協作規範  
> **最後更新**: 2025-01-20

---

## 📋 目標讀者 (Audience)

- 所有開發者
- 專案管理者
- 代碼審查者
- 新成員

---

## 📚 文檔清單

### 工作流程

- **git-workflow.md** ⭐⭐⭐⭐⭐ - Git 工作流程
  - 分支策略
  - 工作流程
  - Commit 規範
  - Pull Request 流程
  - 代碼審查流程

- **contribution.md** ⭐⭐⭐⭐ - 貢獻指南
  - 如何貢獻
  - 提交流程
  - 代碼規範
  - 問題回報

---

## 🚀 快速開始

### 新成員工作流程

1. **閱讀工作流程文檔**
   - 了解分支策略（**git-workflow.md**）
   - 了解貢獻流程（**contribution.md**）

2. **設置開發環境**
   - 參考 [setup/environment.md](../setup/environment.md)
   - 配置 Git 與 IDE

3. **開始開發**
   - 創建功能分支
   - 開發功能
   - 提交代碼
   - 創建 Pull Request

---

## 📖 核心工作流程

### Git 工作流程

專案採用 **Git Flow** 工作流程的變體：

#### 主要分支

- **main** - 生產環境程式碼
- **develop** - 開發整合分支

#### 支援分支

- **feature/** - 功能分支
- **bugfix/** - 錯誤修復分支
- **hotfix/** - 緊急修復分支
- **release/** - 發布分支

詳見：**git-workflow.md**

### 貢獻流程

1. Fork 專案（如需要）
2. 創建功能分支
3. 開發功能
4. 提交代碼
5. 創建 Pull Request
6. 代碼審查
7. 合併到主分支

詳見：**contribution.md**

---

## 🔗 相關文檔

### 開發指南

- [guides/development-workflow.md](../guides/development-workflow.md) - 開發工作流程
- [development/getting-started.md](../development/getting-started.md) - 開發入門

### 代碼審查

- [guides/code-review-standards.md](../guides/code-review-standards.md) - 代碼審查規範

### 開發規範

- [standards/](../standards/) - 編碼標準
- [specs/](../specs/) - 開發規範

---

## 📋 工作流程檢查清單

### 開始開發前

- [ ] 閱讀工作流程文檔
- [ ] 確認分支策略
- [ ] 設置開發環境

### 開發中

- [ ] 遵循分支命名規範
- [ ] 遵循 Commit 規範
- [ ] 定期提交代碼

### 提交前

- [ ] 執行代碼檢查（lint, test）
- [ ] 更新文檔（如需要）
- [ ] 確認代碼符合規範

### Pull Request

- [ ] 填寫完整的 PR 描述
- [ ] 連結相關 Issue
- [ ] 請求代碼審查
- [ ] 回應審查意見

---

## 🛠️ 常用命令

### 分支操作

```bash
# 創建功能分支
git checkout -b feature/123-new-feature

# 切換分支
git checkout develop

# 合併分支
git merge feature/123-new-feature
```

### Commit

```bash
# 提交代碼
git commit -m "feat: add new feature"

# 修改最後一次 Commit
git commit --amend
```

### Pull Request

```bash
# 推送分支
git push origin feature/123-new-feature

# 在 GitHub 上創建 Pull Request
# 或使用 GitHub CLI
gh pr create
```

---

## 📊 工作流程統計

### 分支策略

- **主要分支**: 2 個（main, develop）
- **支援分支類型**: 4 種（feature, bugfix, hotfix, release）

### Commit 規範

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：
- `feat:` - 新功能
- `fix:` - 錯誤修復
- `docs:` - 文檔更新
- `style:` - 程式碼風格
- `refactor:` - 重構
- `test:` - 測試
- `chore:` - 雜項

---

## 🔗 相關資源

### 工具

- [GitHub](https://github.com) - 程式碼託管
- [GitHub CLI](https://cli.github.com/) - GitHub 命令行工具
- [Conventional Commits](https://www.conventionalcommits.org/) - Commit 規範

### 參考文檔

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

**最後更新**: 2025-01-20  
**維護者**: 開發團隊

