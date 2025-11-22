# Git 工作流程

## 概述

本專案採用 Git Flow 工作流程的變體，適合團隊協作和持續交付。

## 分支策略

### 主要分支

1. **main**
   - 生產環境程式碼
   - 永遠保持穩定且可部署
   - 只能透過 Pull Request 合併
   - 受保護分支，需要程式碼審查

2. **develop**
   - 開發整合分支
   - 包含最新的開發功能
   - 定期合併到 main 進行發布

### 支援分支

1. **feature/ 功能分支**
   - 格式：`feature/{issue-number}-{brief-description}`
   - 範例：`feature/123-user-authentication`
   - 從 develop 分支建立
   - 完成後合併回 develop

2. **bugfix/ 錯誤修復分支**
   - 格式：`bugfix/{issue-number}-{brief-description}`
   - 範例：`bugfix/456-login-error`
   - 從 develop 分支建立
   - 完成後合併回 develop

3. **hotfix/ 緊急修復分支**
   - 格式：`hotfix/{version}-{brief-description}`
   - 範例：`hotfix/1.2.1-security-patch`
   - 從 main 分支建立
   - 完成後同時合併到 main 和 develop

4. **release/ 發布分支**
   - 格式：`release/{version}`
   - 範例：`release/1.2.0`
   - 從 develop 分支建立
   - 只進行版本更新和錯誤修復
   - 完成後合併到 main 和 develop

## 工作流程

### 開發新功能

1. **建立 Issue**
   - 在 GitHub 建立詳細的 Issue
   - 使用適當的標籤（feature, bug, enhancement）
   - 指派負責人

2. **建立功能分支**

```bash
# 確保本地 develop 是最新的
git checkout develop
git pull origin develop

# 建立新分支
git checkout -b feature/123-user-authentication
```

3. **開發和提交**

```bash
# 頻繁提交，使用清晰的提交訊息
git add .
git commit -m "feat: add user authentication service"

# 提交訊息格式
# feat: 新功能
# fix: 錯誤修復
# docs: 文檔更新
# style: 程式碼格式調整
# refactor: 重構
# test: 測試相關
# chore: 建構或輔助工具變更
```

4. **推送分支**

```bash
git push origin feature/123-user-authentication
```

5. **建立 Pull Request**
   - 在 GitHub 上建立 PR
   - 填寫 PR 模板
   - 連結相關 Issue
   - 請求程式碼審查

6. **程式碼審查和修改**
   - 回應審查意見
   - 進行必要的修改
   - 推送更新

7. **合併 PR**
   - 確保所有檢查通過（CI/CD, tests）
   - 獲得必要的審批
   - 使用 Squash and Merge

8. **清理**

```bash
# 刪除本地分支
git branch -d feature/123-user-authentication

# 刪除遠端分支（GitHub 可自動刪除）
git push origin --delete feature/123-user-authentication
```

### 修復錯誤

流程與開發新功能類似，但使用 `bugfix/` 前綴。

### 緊急修復（Hotfix）

1. **從 main 建立分支**

```bash
git checkout main
git pull origin main
git checkout -b hotfix/1.2.1-security-patch
```

2. **進行修復**

```bash
git add .
git commit -m "fix: patch security vulnerability"
```

3. **合併到 main**

```bash
# 建立 PR 合併到 main
# 打標籤
git tag -a v1.2.1 -m "Version 1.2.1 - Security patch"
git push origin v1.2.1
```

4. **合併到 develop**

```bash
# 也要合併到 develop 確保修復包含在未來版本中
git checkout develop
git merge hotfix/1.2.1-security-patch
git push origin develop
```

### 發布流程

1. **建立發布分支**

```bash
git checkout develop
git pull origin develop
git checkout -b release/1.2.0
```

2. **準備發布**
   - 更新版本號（package.json）
   - 更新 CHANGELOG.md
   - 執行完整測試
   - 修復發現的錯誤

3. **合併到 main**

```bash
# 建立 PR 合併到 main
# 打標籤
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin v1.2.0
```

4. **合併回 develop**

```bash
git checkout develop
git merge release/1.2.0
git push origin develop
```

## 提交訊息規範

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 類型

- **feat**: 新功能
- **fix**: 錯誤修復
- **docs**: 文檔變更
- **style**: 程式碼格式調整（不影響程式碼運行）
- **refactor**: 重構（既不是新功能也不是錯誤修復）
- **perf**: 效能優化
- **test**: 新增或修改測試
- **build**: 建構系統或外部依賴變更
- **ci**: CI 配置檔案和腳本變更
- **chore**: 其他不修改 src 或測試檔案的變更
- **revert**: 回退先前的提交

### 範例

```bash
# 簡單提交
git commit -m "feat: add user login functionality"

# 詳細提交
git commit -m "feat(auth): add JWT authentication

- Implement JWT token generation
- Add token validation middleware
- Update user service to use tokens

Closes #123"

# 修復錯誤
git commit -m "fix(ui): correct button alignment in modal

The submit button was misaligned on mobile devices.
This fix ensures proper alignment across all screen sizes.

Fixes #456"

# Breaking Change
git commit -m "feat(api): change user endpoint response format

BREAKING CHANGE: User API now returns nested profile object
instead of flat structure. Update client code accordingly.

Closes #789"
```

## Pull Request 流程

### 建立 PR 前檢查清單

- [ ] 程式碼符合專案編碼規範
- [ ] 所有測試通過
- [ ] 新功能有對應的測試
- [ ] 文檔已更新
- [ ] 沒有合併衝突
- [ ] 提交訊息清晰且符合規範

### PR 描述模板

專案提供 PR 模板，包含：

1. **變更摘要**
   - 簡述此 PR 的目的
   - 列出主要變更

2. **測試**
   - 說明如何測試變更
   - 列出測試場景

3. **截圖**（如適用）
   - UI 變更的截圖

4. **相關 Issue**
   - 連結相關 Issue

5. **檢查清單**
   - 確認所有必要步驟已完成

### 程式碼審查指南

**審查者職責：**

- 檢查程式碼品質和風格
- 驗證邏輯正確性
- 提出建設性建議
- 確保測試覆蓋率
- 檢查安全性問題

**審查標準：**

- 程式碼可讀性
- 遵循最佳實務
- 效能考量
- 錯誤處理
- 測試完整性

**審查回應時間：**

- 一般 PR：24 小時內
- 緊急 PR：4 小時內
- Hotfix：1 小時內

## 衝突解決

### 預防衝突

```bash
# 定期同步 develop 分支
git checkout feature/your-branch
git fetch origin
git rebase origin/develop
```

### 解決衝突

```bash
# 當遇到衝突時
git status  # 查看衝突檔案

# 手動編輯衝突檔案，解決衝突標記
# <<<<<<< HEAD
# 你的變更
# =======
# 他人的變更
# >>>>>>> branch-name

# 標記衝突已解決
git add <conflicted-file>
git rebase --continue

# 如果需要中止
git rebase --abort
```

## Git 最佳實務

### Do's ✅

1. **頻繁提交**
   - 小步驟、頻繁提交
   - 每個提交做一件事

2. **清晰的提交訊息**
   - 說明「為什麼」而不只是「做什麼」
   - 使用現在式動詞

3. **保持分支更新**
   - 定期從 develop 更新功能分支
   - 使用 rebase 保持歷史清晰

4. **程式碼審查**
   - 認真審查他人程式碼
   - 接受建設性回饋

5. **測試**
   - 本地測試通過才推送
   - 確保 CI 通過

### Don'ts ❌

1. **直接推送到 main**
   - 永遠透過 PR 合併

2. **提交未完成的程式碼**
   - 確保程式碼可編譯且測試通過

3. **包含無關變更**
   - 每個 PR 專注於一個功能或修復

4. **忽略程式碼審查意見**
   - 認真對待審查建議

5. **提交敏感資訊**
   - 不要提交密碼、金鑰等敏感資料
   - 使用 .gitignore 排除敏感檔案

## Git 指令速查

```bash
# 查看狀態
git status

# 查看變更
git diff
git diff --staged

# 暫存變更
git add <file>
git add .

# 提交
git commit -m "message"
git commit --amend  # 修改最後一次提交

# 推送
git push origin <branch>
git push origin <branch> --force-with-lease  # 安全的強制推送

# 拉取
git pull origin <branch>
git fetch origin

# 分支操作
git branch  # 列出本地分支
git branch -a  # 列出所有分支
git checkout <branch>  # 切換分支
git checkout -b <new-branch>  # 建立並切換
git branch -d <branch>  # 刪除本地分支

# 合併
git merge <branch>
git rebase <branch>

# 暫存
git stash  # 暫存當前變更
git stash pop  # 恢復暫存的變更
git stash list  # 列出所有暫存

# 重置
git reset --soft HEAD~1  # 撤銷最後一次提交，保留變更
git reset --hard HEAD~1  # 撤銷最後一次提交，丟棄變更

# 查看歷史
git log
git log --oneline
git log --graph --oneline --all
```

## 工具配置

### Git Hooks（Husky）

專案使用 Husky 設置 Git hooks：

- **pre-commit**: 執行 linting 和格式化
- **commit-msg**: 驗證提交訊息格式
- **pre-push**: 執行測試

### Git 配置

推薦配置：

```bash
# 設定使用者資訊
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 啟用顏色輸出
git config --global color.ui auto

# 設定預設編輯器
git config --global core.editor "code --wait"

# 設定預設分支名稱
git config --global init.defaultBranch main

# 啟用 rebase 作為預設拉取策略
git config --global pull.rebase true
```

## 故障排查

### 常見問題

1. **推送被拒絕**
   - 檢查是否有衝突
   - 確保本地分支是最新的

2. **意外提交**
   - 使用 `git reset` 撤銷
   - 使用 `git revert` 建立反向提交

3. **遺失的提交**
   - 使用 `git reflog` 查找
   - 使用 `git cherry-pick` 恢復

## 相關文檔

- [貢獻指南](./contribution.md)
- [程式碼審查指南](./code-review.md)
- [發布流程](./release-process.md)
