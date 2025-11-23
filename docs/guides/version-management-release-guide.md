# 版本管理與發布指南


> **📚 目的**: 提供版本管理與發布流程的完整指引，確保版本控制的規範性

## 目標讀者 (Audience)

- 技術主管
- DevOps 工程師
- 所有開發者

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [版本號規範](#版本號規範)
  - [語義化版本 (Semantic Versioning 2.0.0)](#語義化版本-semantic-versioning-200)
  - [版本號定義](#版本號定義)
    - [MAJOR（主版本號）](#major主版本號)
    - [MINOR（次版本號）](#minor次版本號)
    - [PATCH（修訂號）](#patch修訂號)
  - [預發布版本](#預發布版本)
    - [Alpha（內部測試版）](#alpha內部測試版)
    - [Beta（公開測試版）](#beta公開測試版)
    - [RC（候選發布版）](#rc候選發布版)
- [發布流程](#發布流程)
  - [1. 準備階段](#1-準備階段)
    - [1.1 版本號確定](#11-版本號確定)
    - [1.2 分支準備](#12-分支準備)
    - [1.3 更新版本資訊](#13-更新版本資訊)
  - [2. 測試階段](#2-測試階段)
    - [2.1 自動化測試](#21-自動化測試)
    - [2.2 手動測試](#22-手動測試)
    - [2.3 建置驗證](#23-建置驗證)
  - [3. 文檔更新](#3-文檔更新)
    - [3.1 CHANGELOG.md](#31-changelogmd)
    - [3.2 API 文檔](#32-api-文檔)
    - [3.3 使用者文檔](#33-使用者文檔)
  - [4. 審查階段](#4-審查階段)
    - [4.1 Code Review](#41-code-review)
    - [4.2 審查檢查點](#42-審查檢查點)
  - [5. 發布階段](#5-發布階段)
    - [5.1 合併到 main](#51-合併到-main)
    - [5.2 建立標籤](#52-建立標籤)
    - [5.3 部署到生產環境](#53-部署到生產環境)
    - [5.4 發布公告](#54-發布公告)
  - [6. 後續處理](#6-後續處理)
    - [6.1 分支清理](#61-分支清理)
    - [6.2 監控](#62-監控)
- [變更日誌規範](#變更日誌規範)
  - [CHANGELOG.md 結構](#changelogmd-結構)
  - [變更類型分類](#變更類型分類)
  - [撰寫規範](#撰寫規範)
- [分支策略](#分支策略)
  - [Git Flow 模型](#git-flow-模型)
  - [分支說明](#分支說明)
    - [main 分支](#main-分支)
    - [develop 分支](#develop-分支)
    - [feature 分支](#feature-分支)
    - [release 分支](#release-分支)
    - [hotfix 分支](#hotfix-分支)
- [標籤管理](#標籤管理)
  - [標籤命名規範](#標籤命名規範)
  - [創建標籤](#創建標籤)
  - [刪除標籤](#刪除標籤)
- [發布檢查清單](#發布檢查清單)
  - [發布前檢查](#發布前檢查)
    - [代碼品質](#代碼品質)
    - [功能驗證](#功能驗證)
    - [文檔更新](#文檔更新)
    - [安全性檢查](#安全性檢查)
    - [部署準備](#部署準備)
  - [發布後驗證](#發布後驗證)
    - [即時監控（發布後 1 小時）](#即時監控發布後-1-小時)
    - [短期監控（發布後 24 小時）](#短期監控發布後-24-小時)
    - [長期追蹤（發布後 1 週）](#長期追蹤發布後-1-週)
- [緊急發布流程](#緊急發布流程)
  - [Hotfix 快速發布](#hotfix-快速發布)
- [版本生命週期](#版本生命週期)
  - [支援策略](#支援策略)
  - [版本廢棄流程](#版本廢棄流程)
- [相關資源](#相關資源)
  - [內部文檔](#內部文檔)
  - [外部資源](#外部資源)

---


> **目的**：定義專案的版本號規範、發布流程和變更日誌管理規則

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊

- --

## 📋 目錄

1. [版本號規範](#版本號規範)
2. [發布流程](#發布流程)
3. [變更日誌規範](#變更日誌規範)
4. [分支策略](#分支策略)
5. [標籤管理](#標籤管理)
6. [發布檢查清單](#發布檢查清單)

- --

## 版本號規範

### 語義化版本 (Semantic Versioning 2.0.0)

本專案遵循 [Semantic Versioning 2.0.0](https://semver.org/) 規範。

**版本格式**：`MAJOR.MINOR.PATCH[-prerelease][+build]`

```diff
- 1.0.0        （正式版本）
- 1.0.0-alpha.1（Alpha 預覽版）
- 1.0.0-beta.2 （Beta 測試版）
- 1.0.0-rc.1   （Release Candidate）
- 2.1.3+20251116（包含建置元數據）
```

### 版本號定義

#### MAJOR（主版本號）
當進行**不向後相容的 API 修改**時遞增：
- 重大架構變更
- 破壞性 API 變更
- 移除已棄用的功能
- 資料庫結構重大變更

**範例**：`1.x.x` → `2.0.0`

#### MINOR（次版本號）
當**添加向後相容的新功能**時遞增：
- 新增功能模組
- 新增 API 端點
- 新增資料表（不影響現有結構）
- 效能優化（不影響 API）

**範例**：`1.0.x` → `1.1.0`

#### PATCH（修訂號）
當進行**向後相容的問題修正**時遞增：
- Bug 修復
- 文檔更新
- 依賴套件更新（安全性修補）
- 小型優化（不影響功能）

**範例**：`1.0.0` → `1.0.1`

### 預發布版本

#### Alpha（內部測試版）
格式：x.y.z-alpha.n
```diff

特性：
- 功能未完整
- 可能存在嚴重錯誤
- 僅供內部測試
- 不保證穩定性
```

#### Beta（公開測試版）
格式：x.y.z-beta.n
範例：2.0.0-beta.1
```diff
特性：
- 功能基本完整
- 已修復重大錯誤
- 開放測試反饋
- API 可能微調
```

#### RC（候選發布版）
格式：x.y.z-rc.n
範例：2.0.0-rc.1

```markdown
- 功能完整凍結
- 僅進行錯誤修正
- 準備正式發布
- API 已穩定
```

- --

## 發布流程

### 1. 準備階段

#### 1.1 版本號確定
```bash
# 根據變更類型確定版本號
# 破壞性變更：MAJOR + 1
# 新功能：MINOR + 1
# 修復：PATCH + 1
```

#### 1.2 分支準備
```bash
# 從 main 分支創建 release 分支
git checkout main
git pull origin main
git checkout -b release/v2.1.0
```

#### 1.3 更新版本資訊
```bash
# 更新 package.json
npm version 2.1.0 --no-git-tag-version

# 更新其他版本文件
# - docs/README.md
# - CHANGELOG.md
# - 相關配置文件
```

### 2. 測試階段

#### 2.1 自動化測試
```bash
# 執行所有測試
yarn test-coverage

# 執行 E2E 測試
yarn e2e

# 檢查程式碼品質
yarn lint
```

#### 2.2 手動測試
- [ ] 功能回歸測試
- [ ] 關鍵流程驗證
- [ ] 跨瀏覽器測試
- [ ] 效能測試
- [ ] 安全性掃描

#### 2.3 建置驗證
```bash
# Production 建置
yarn build

# 檢查建置產物
ls -lh dist/

# 驗證建置大小
npm run analyze
```

### 3. 文檔更新

#### 3.1 CHANGELOG.md
```markdown
## [2.1.0] - 2025-11-16

### Added
- 新增待辦小工具元件 (#123)
- 新增照片畫廊元件 (#124)

### Changed
- 優化表單驗證邏輯 (#125)
- 更新 Angular 至 20.3.0 (#126)

### Fixed
- 修復登入狀態丟失問題 (#127)
- 修復圖片上傳錯誤 (#128)

### Security
- 更新依賴套件安全性漏洞 (#129)
```

#### 3.2 API 文檔
- 更新 API 端點文檔
- 更新資料模型文檔
- 更新範例程式碼

#### 3.3 使用者文檔
- 更新快速開始指南
- 更新功能說明文檔
- 更新常見問題

### 4. 審查階段

#### 4.1 Code Review
```bash
# 創建 Pull Request
gh pr create \
  --base main \
  --head release/v2.1.0 \
  --title "Release v2.1.0" \
  --body "$(cat release-notes.md)"
```

#### 4.2 審查檢查點
- [ ] 代碼品質符合標準
- [ ] 所有測試通過
- [ ] 文檔已更新
- [ ] 變更日誌已完善
- [ ] 無安全性問題
- [ ] 效能無退化

### 5. 發布階段

#### 5.1 合併到 main
```bash
# 合併 release 分支
git checkout main
git merge --no-ff release/v2.1.0
git push origin main
```

#### 5.2 建立標籤
```bash
# 建立版本標籤
git tag -a v2.1.0 -m "Release version 2.1.0"
git push origin v2.1.0
```

#### 5.3 部署到生產環境
```bash
# 觸發 CI/CD 管道
# 自動部署到 Staging
# 驗證 Staging 環境
# 手動觸發 Production 部署
```

#### 5.4 發布公告
- 更新 GitHub Release Notes
- 發送團隊通知
- 更新專案網站
- 社群媒體公告（如需要）

### 6. 後續處理

#### 6.1 分支清理
```bash
# 刪除 release 分支
git branch -d release/v2.1.0
git push origin --delete release/v2.1.0
```

#### 6.2 監控
- 監控應用程式錯誤率
- 監控效能指標
- 收集使用者反饋
- 快速修復緊急問題

- --

## 變更日誌規範

### CHANGELOG.md 結構

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security

## [2.1.0] - 2025-11-16

### Added
- Feature description with PR link

[Unreleased]: https://github.com/user/repo/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/user/repo/compare/v2.0.0...v2.1.0
```

### 變更類型分類

| 類型 | 說明 | 範例 |
|------|------|------|
| **Added** | 新增功能 | 新增使用者註冊功能 |
| **Changed** | 功能變更 | 更改登入流程 |
| **Deprecated** | 即將棄用 | 棄用舊版 API |
| **Removed** | 移除功能 | 移除實驗性功能 |
| **Fixed** | 錯誤修正 | 修復記憶體洩漏 |
| **Security** | 安全性修補 | 更新依賴套件 |

### 撰寫規範

1. **清晰簡潔**：每條變更一行，簡明扼要
2. **使用者視角**：描述使用者可感知的變更
3. **連結 Issue/PR**：附上相關 Issue 或 PR 編號
4. **時間順序**：最新版本在最上方

**範例**：
```markdown
### Added
- 新增照片畫廊元件，支援 Lightbox 和 EXIF 資訊顯示 (#124)
- 新增待辦小工具，支援五種狀態分類 (#123)

### Fixed
- 修復使用者登出後 token 未清除的問題 (#127)
- 修復圖片上傳時檔案大小限制未生效 (#128)
```

- --

## 分支策略

### Git Flow 模型

main (生產環境)
├── develop (開發主線)
│   ├── feature/user-auth (功能分支)
│   ├── feature/photo-gallery (功能分支)
```bash
├── release/v2.1.0 (發布分支)
└── hotfix/critical-bug (緊急修復分支)
```

### 分支說明

#### main 分支
- 永遠保持可發布狀態
- 僅接受來自 release 和 hotfix 的合併
- 每次合併都應該有對應的版本標籤

#### develop 分支
- 開發主線
- 整合所有功能分支
- 準備發布時創建 release 分支

#### feature 分支
```bash
# 命名：feature/功能名稱
git checkout -b feature/todo-widget develop

# 開發完成後合併回 develop
git checkout develop
git merge --no-ff feature/todo-widget
git push origin develop
git branch -d feature/todo-widget
```

#### release 分支
```bash
# 命名：release/v版本號
git checkout -b release/v2.1.0 develop

# 僅進行版本號更新和錯誤修正
# 完成後合併到 main 和 develop
git checkout main
git merge --no-ff release/v2.1.0
git tag -a v2.1.0

git checkout develop
git merge --no-ff release/v2.1.0
```

#### hotfix 分支
```bash
# 命名：hotfix/問題描述
git checkout -b hotfix/auth-token-leak main

# 修復後合併到 main 和 develop
git checkout main
git merge --no-ff hotfix/auth-token-leak
git tag -a v2.0.1

git checkout develop
git merge --no-ff hotfix/auth-token-leak
```

- --

## 標籤管理

### 標籤命名規範

```bash
# 正式版本
v2.1.0

# 預發布版本
v2.1.0-alpha.1
v2.1.0-beta.1
v2.1.0-rc.1
```

### 創建標籤

```bash
# 輕量標籤（不建議用於發布）
git tag v2.1.0

# 附註標籤（推薦）
git tag -a v2.1.0 -m "Release version 2.1.0

Major changes:
- Feature A
- Feature B
- Bug fixes
"

# 推送標籤
git push origin v2.1.0

# 推送所有標籤
git push origin --tags
```

### 刪除標籤

```bash
# 刪除本地標籤
git tag -d v2.1.0

# 刪除遠端標籤
git push origin --delete v2.1.0
```

- --

## 發布檢查清單

### 發布前檢查

#### 代碼品質
- [ ] 所有單元測試通過
- [ ] 所有 E2E 測試通過
- [ ] 程式碼覆蓋率達標（≥80%）
- [ ] Linting 無錯誤
- [ ] 無 TypeScript 編譯錯誤

#### 功能驗證
- [ ] 新功能完整測試
- [ ] 回歸測試完成
- [ ] 跨瀏覽器測試（Chrome, Firefox, Safari, Edge）
- [ ] 行動裝置測試（iOS, Android）
- [ ] 效能測試通過

#### 文檔更新
- [ ] CHANGELOG.md 已更新
- [ ] API 文檔已更新
- [ ] README.md 已更新
- [ ] 版本號已更新（package.json）
- [ ] 發布說明已撰寫

#### 安全性檢查
- [ ] 依賴套件安全性掃描
- [ ] 無已知安全漏洞
- [ ] 敏感資訊已移除
- [ ] RLS 策略已驗證

#### 部署準備
- [ ] 資料庫遷移腳本已準備
- [ ] 環境變數已配置
- [ ] 回滾計劃已準備
- [ ] 監控告警已設置

### 發布後驗證

#### 即時監控（發布後 1 小時）
- [ ] 應用程式正常啟動
- [ ] 關鍵功能運作正常
- [ ] 錯誤率未異常增加
- [ ] API 回應時間正常

#### 短期監控（發布後 24 小時）
- [ ] 無重大錯誤報告
- [ ] 使用者反饋正面
- [ ] 效能指標穩定
- [ ] 資料庫運作正常

#### 長期追蹤（發布後 1 週）
- [ ] 收集使用者反饋
- [ ] 分析使用數據
- [ ] 規劃下一版本
- [ ] 更新路線圖

- --

## 緊急發布流程

### Hotfix 快速發布

當生產環境出現嚴重問題需要緊急修復時：

1. **創建 Hotfix 分支**
```bash
git checkout -b hotfix/critical-bug main
```

2. **快速修復**
   - 僅修復緊急問題
   - 最小化變更範圍
   - 快速測試驗證

3. **版本號遞增**
```bash
# PATCH 版本號 +1
# 2.0.0 → 2.0.1
npm version patch --no-git-tag-version
```

4. **快速發布**
```bash
# 合併到 main
git checkout main
git merge --no-ff hotfix/critical-bug
git tag -a v2.0.1 -m "Hotfix: Critical bug"
git push origin main --tags

# 合併回 develop
git checkout develop
git merge --no-ff hotfix/critical-bug
git push origin develop
```

5. **緊急部署**
   - 跳過部分非關鍵測試
   - 快速部署到生產環境
   - 加強監控

6. **事後處理**
   - 撰寫事故報告
   - 更新 CHANGELOG
   - 檢討預防措施

- --

## 版本生命週期

### 支援策略

| 版本類型 | 支援期限 | 說明 |
|---------|---------|------|
| **最新版本 (Latest)** | 持續支援 | 獲得所有更新和新功能 |
| **LTS 版本** | 2 年 | 僅提供安全性和重大錯誤修復 |
| **舊版本** | 6 個月 | 僅提供關鍵安全性修補 |
| **過期版本** | 不支援 | 建議升級 |

### 版本廢棄流程

1. **宣告廢棄（6 個月前）**
   - 在文檔中標記為 Deprecated
   - 添加遷移指南
   - 發送通知給使用者

2. **維護期（3-6 個月）**
   - 僅修復嚴重錯誤
   - 提供遷移支援
   - 更新遷移工具

3. **停止支援**
   - 正式移除
   - 關閉相關 Issue
   - 保留文檔歸檔

- --

## 相關資源

### 內部文檔
- [開發工作流程](./35-開發工作流程.md)
- [測試指南](./38-測試指南.md)
- [部署指南](./39-部署指南.md)
- [代碼審查規範](./58-代碼審查規範.md)

### 外部資源
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
