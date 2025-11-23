# 開發常見問題疑難排解指南

## 📑 目錄

- [📋 快速診斷](#-快速診斷)
- [🚨 常見問題與解決方案](#-常見問題與解決方案)
  - [1. 依賴安裝問題](#1-依賴安裝問題)
    - [問題 1.1：`yarn install` 失敗](#問題-11yarn-install-失敗)
    - [問題 1.2：`node-gyp` 編譯錯誤](#問題-12node-gyp-編譯錯誤)
  - [2. 開發伺服器問題](#2-開發伺服器問題)
    - [問題 2.1：端口 4200 被占用](#問題-21端口-4200-被占用)
    - [問題 2.2：開發伺服器無法啟動](#問題-22開發伺服器無法啟動)
    - [問題 2.3：Hot Reload 不工作](#問題-23hot-reload-不工作)
  - [3. 建置問題](#3-建置問題)
    - [問題 3.1：記憶體不足](#問題-31記憶體不足)
    - [問題 3.2：建置速度慢](#問題-32建置速度慢)
    - [問題 3.3：TypeScript 編譯錯誤](#問題-33typescript-編譯錯誤)
  - [4. Lint 問題](#4-lint-問題)
    - [問題 4.1：ESLint 錯誤](#問題-41eslint-錯誤)
    - [問題 4.2：自動修復不生效](#問題-42自動修復不生效)
  - [5. Supabase 連線問題](#5-supabase-連線問題)
    - [問題 5.1：連線失敗](#問題-51連線失敗)
    - [問題 5.2：RLS 權限錯誤](#問題-52rls-權限錯誤)
  - [6. Git 問題](#6-git-問題)
    - [問題 6.1：Pre-commit Hook 失敗](#問題-61pre-commit-hook-失敗)
    - [問題 6.2：合併衝突](#問題-62合併衝突)
  - [7. 測試問題](#7-測試問題)
    - [問題 7.1：測試無法執行](#問題-71測試無法執行)
    - [問題 7.2：測試超時](#問題-72測試超時)
  - [8. 型別定義問題](#8-型別定義問題)
    - [問題 8.1：找不到型別](#問題-81找不到型別)
    - [問題 8.2：`any` 型別警告](#問題-82any-型別警告)
- [🔍 進階診斷](#-進階診斷)
  - [完整系統檢查](#完整系統檢查)
  - [效能診斷](#效能診斷)
- [📞 取得進一步協助](#-取得進一步協助)
  - [1. 收集資訊](#1-收集資訊)
  - [2. 搜尋已知問題](#2-搜尋已知問題)
  - [3. 提問](#3-提問)
- [🔗 相關資源](#-相關資源)
  - [官方文檔](#官方文檔)
  - [專案文檔](#專案文檔)
- [💡 預防性措施](#-預防性措施)
  - [日常開發建議](#日常開發建議)

---


> 🔧 **目的**：快速解決開發過程中常見的問題，減少開發阻礙

**最後更新**：2025-01-20
**維護者**：開發團隊

- --

## 📋 快速診斷

遇到問題時，首先執行快速檢查：

```bash
# 快速環境檢查
yarn dev:check

# 或執行完整腳本
./scripts/dev-tools/quick-check.sh
```

- --

## 🚨 常見問題與解決方案

### 1. 依賴安裝問題

#### 問題 1.1：`yarn install` 失敗

**症狀**：
```bash
```

**解決方案 A**：清除快取並重試
```bash
# 清除 Yarn 快取
yarn cache clean

# 刪除 node_modules 和 yarn.lock
rm -rf node_modules yarn.lock

# 重新安裝
yarn install
```

**解決方案 B**：使用國內鏡像（中國用戶）
```bash
# 設定淘寶鏡像
yarn config set registry https://registry.npmmirror.com

# 重新安裝
yarn install

# 恢復預設鏡像
yarn config delete registry
```

#### 問題 1.2：`node-gyp` 編譯錯誤

**症狀**：
gyp ERR! build error
```bash
```

**解決方案**：
```bash
# Windows - 安裝 Visual Studio Build Tools
npm install --global windows-build-tools

# macOS - 安裝 Xcode Command Line Tools
xcode-select --install

# Linux - 安裝 build-essential
sudo apt-get install build-essential
```

- --

### 2. 開發伺服器問題

#### 問題 2.1：端口 4200 被占用

**症狀**：
Port 4200 is already in use.
```bash
```

**解決方案 A**：查找並終止占用進程
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4200 | xargs kill -9
```

**解決方案 B**：使用其他端口
```bash
yarn ng serve --port 4201
```

#### 問題 2.2：開發伺服器無法啟動

**症狀**：
Error: Cannot find module '@angular-devkit/build-angular'
```bash
```

**解決方案**：
```bash
# 重新安裝依賴
rm -rf node_modules yarn.lock
yarn install

# 清除 Angular 快取
yarn ng cache clean

# 重新啟動
yarn start
```

#### 問題 2.3：Hot Reload 不工作

**症狀**：修改程式碼後瀏覽器不自動刷新

**解決方案**：
```bash
# 使用 HMR 模式
yarn hmr

# 或手動啟用
yarn ng serve --hmr --open
```

- --

### 3. 建置問題

#### 問題 3.1：記憶體不足

**症狀**：
FATAL ERROR: Ineffective mark-compacts near heap limit
```bash
```

**解決方案**：
```bash
# 使用高記憶體模式建置（已內建）
yarn build

# 或手動增加記憶體限制
NODE_OPTIONS="--max_old_space_size=8192" yarn build
```

#### 問題 3.2：建置速度慢

**症狀**：建置時間過長（超過 5 分鐘）

**解決方案**：
```bash
# 清除建置快取
yarn ng cache clean
rm -rf .angular

# 使用開發建置（更快）
yarn ng build --configuration=development

# 啟用建置快取
yarn ng build --build-optimizer=false
```

#### 問題 3.3：TypeScript 編譯錯誤

**症狀**：
error TS2304: Cannot find name 'xxx'
```bash
```

**解決方案**：
```bash
# 檢查 TypeScript 版本
yarn tsc --version

# 重新安裝 TypeScript
yarn add -D typescript@~5.9.2

# 清除快取並重新建置
yarn ng cache clean
yarn build
```

- --

### 4. Lint 問題

#### 問題 4.1：ESLint 錯誤

**症狀**：
Parsing error: Cannot read file 'tsconfig.json'
```bash
```

**解決方案**：
```bash
# 檢查 tsconfig.json 是否存在
ls -la tsconfig.json

# 重新產生 ESLint 設定
yarn ng lint --fix

# 清除 ESLint 快取
rm -rf .eslintcache
```

#### 問題 4.2：自動修復不生效

**症狀**：`yarn lint --fix` 後仍有錯誤

**解決方案**：
```bash
# 只修復 TypeScript
yarn lint:ts --fix

# 手動修復樣式
yarn lint:style --fix

# 檢查不可自動修復的錯誤
yarn lint --no-fix
```

- --

### 5. Supabase 連線問題

#### 問題 5.1：連線失敗

**症狀**：
Error: Invalid Supabase URL or Anon Key
```markdown
```

**解決方案**：
```typescript
// 檢查 src/environments/environment.ts
export const environment = {
  production: false,
  supabase: {
    url: 'https://your-project.supabase.co',  // ← 確認正確
    anonKey: 'eyJhbG...',                      // ← 確認正確
  }
};
```

**驗證連線**：
```bash
# 使用 Supabase MCP 測試
@SUPABASE 列出所有資料庫表
```

#### 問題 5.2：RLS 權限錯誤

**症狀**：
new row violates row-level security policy
```text
```

**解決方案**：
1. 檢查 RLS 策略是否正確設定
2. 確認使用者權限
3. 參考 [安全與RLS權限矩陣](./21-安全與-RLS-權限矩陣.md)

- --

### 6. Git 問題

#### 問題 6.1：Pre-commit Hook 失敗

**症狀**：
husky - pre-commit hook exited with code 1
```bash
```

**解決方案**：
```bash
# 跳過 hook（不建議）
git commit --no-verify -m "message"

# 修復 lint 問題
yarn lint --fix

# 重新安裝 Husky
rm -rf .husky
yarn prepare
```

#### 問題 6.2：合併衝突

**症狀**：`git pull` 時出現衝突

**解決方案**：
```bash
# 查看衝突檔案
git status

# 手動解決衝突後
git add .
git commit -m "fix: resolve merge conflicts"

# 或使用合併工具
git mergetool
```

- --

### 7. 測試問題

#### 問題 7.1：測試無法執行

**症狀**：
Error: Cannot find module '@angular/core/testing'
```bash
```

**解決方案**：
```bash
# 重新安裝測試依賴
yarn install

# 清除 Karma 快取
rm -rf .karma
```

#### 問題 7.2：測試超時

**症狀**：
Timeout - Async callback was not invoked within timeout
```javascript
```

**解決方案**：
```typescript
// 增加測試超時時間
it('should do something', async () => {
  // test code
}, 10000); // 10 秒超時
```

- --

### 8. 型別定義問題

#### 問題 8.1：找不到型別

**症狀**：
Cannot find name 'YourType'
```sql
```

**解決方案**：
```bash
# 確認型別檔案存在
find src -name "*.model.ts"

# 檢查 import 路徑
# 正確：import { YourType } from '@shared';
# 錯誤：import { YourType } from '../../../shared/...';
```

#### 問題 8.2：`any` 型別警告

**症狀**：
Unexpected any. Specify a different type
```bash
```

**解決方案**：
```typescript
// ❌ 錯誤
function foo(x: any) { }

// ✅ 正確 - 使用具體型別
function foo(x: string) { }

// ✅ 正確 - 使用泛型
function foo<T>(x: T) { }

// ✅ 正確 - 使用 unknown（需要型別檢查）
function foo(x: unknown) {
  if (typeof x === 'string') {
    // ...
  }
}
```

- --

## 🔍 進階診斷

### 完整系統檢查

```bash
# 1. 檢查環境
yarn dev:check

# 2. 清除所有快取
yarn ng cache clean
rm -rf .angular .eslintcache

# 3. 重新安裝依賴
rm -rf node_modules yarn.lock
yarn install

# 4. 執行 Lint
yarn lint

# 5. 建置測試
yarn build

# 6. 執行測試
yarn test-coverage
```

### 效能診斷

```bash
# 分析 bundle 大小
yarn analyze
yarn analyze:view

# 檢查建置時間
time yarn build

# 使用開發者工具分析執行時效能
# Chrome DevTools > Performance
```

- --

## 📞 取得進一步協助

如果以上方案都無法解決問題：

### 1. 收集資訊

```bash
# 系統資訊
node --version
yarn --version
git --version

# 專案資訊
yarn ng version

# 錯誤訊息
yarn build 2>&1 | tee build-error.log
```

### 2. 搜尋已知問題

- 檢查專案 [Issue Tracker](https://github.com/ng-alain/ng-alain-gighub/issues)
- 搜尋 Angular 官方文檔
- 查閱 NG-ZORRO 文檔

### 3. 提問

準備以下資訊：
- 問題描述
- 錯誤訊息
- 系統環境
- 重現步驟
- 已嘗試的解決方案

- --

## 🔗 相關資源

### 官方文檔
- [Angular 文檔](https://angular.dev/)
- [NG-ZORRO 文檔](https://ng.ant.design/)
- [ng-alain 文檔](https://ng-alain.com/)
- [Supabase 文檔](https://supabase.com/docs)

### 專案文檔
- [開發者快速檢查清單](./guides/developer-quick-checklist.md)
- [快速開始指南](./guides/getting-started.md)
- [常見問題 FAQ](./29-常見問題-FAQ.md)
- [開發最佳實踐指南](./guides/development-best-practices.md)

- --

## 💡 預防性措施

### 日常開發建議

1. **每日更新**：
   ```bash
   git pull
   yarn install
   ```

2. **定期清理**：
   ```bash
   # 每週清理一次快取
   yarn ng cache clean
   rm -rf .angular .eslintcache
   ```

3. **Commit 前檢查**：
   ```bash
   yarn lint --fix
   yarn test-coverage
   ```

4. **定期備份**：
   - 重要變更前建立分支
   - 定期 push 到遠端倉庫

- --

**最後更新**：2025-01-20
**維護者**：開發團隊
**版本**：v1.0
