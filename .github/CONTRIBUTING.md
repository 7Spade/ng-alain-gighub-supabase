# 貢獻指南

感謝您考慮為 ng-gighub 專案做出貢獻！本指南將幫助您了解如何參與專案開發。

## 目錄

- [行為準則](#行為準則)
- [我可以如何貢獻](#我可以如何貢獻)
- [開發流程](#開發流程)
- [編碼規範](#編碼規範)
- [提交規範](#提交規範)
- [Pull Request 流程](#pull-request-流程)
- [文件貢獻](#文件貢獻)

## 行為準則

參與本專案時，請遵守以下原則：

- 尊重所有貢獻者
- 接受建設性的批評
- 專注於對社群最有利的事情
- 展現同理心

## 我可以如何貢獻

### 回報 Bug

發現 bug 時，請：

1. 檢查 [Issues](https://github.com/7Spade/ng-gighub/issues) 確認該問題尚未被回報
2. 建立新 issue，包含：
   - 清楚的標題和描述
   - 重現步驟
   - 預期行為與實際行為
   - 環境資訊（瀏覽器、Node.js 版本等）
   - 截圖或錯誤訊息（如適用）

### 建議新功能

想要建議新功能時：

1. 先在 Issues 中討論您的想法
2. 說明功能的用途和預期效益
3. 提供可能的實作方式（如有想法）

### 修正 Bug 或實作功能

1. Fork 本專案
2. 建立功能分支
3. 進行開發
4. 提交 Pull Request

## 開發流程

### 環境設定

1. **Clone 專案**
   ```bash
   git clone https://github.com/7Spade/ng-gighub.git
   cd ng-gighub
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **環境設定**
   - 複製 `.env.example` 為 `.env`
   - 參考 [環境設定文件](docs/setup/environment.md)
   - 參考 [Supabase 設定文件](docs/setup/supabase.md)

4. **啟動開發伺服器**
   ```bash
   npm start
   ```

### 分支策略

我們使用 Git Flow 工作流程：

- **main** - 穩定的生產版本
- **develop** - 開發分支
- **feature/*** - 功能開發分支
- **bugfix/*** - Bug 修正分支
- **hotfix/*** - 緊急修正分支

### 建立功能分支

```bash
# 從 develop 分支建立新的功能分支
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 開發過程

1. **撰寫程式碼**
   - 遵循 [程式碼風格指南](docs/standards/code-style.md)
   - 保持變更範圍小且專注
   - 確保程式碼可讀性

2. **撰寫測試**
   ```bash
   npm test
   ```

3. **本地驗證**
   ```bash
   # 執行建置
   npm run build
   
   # 執行測試
   npm test
   
   # 執行 SSR 伺服器
   npm run serve:ssr:ng-gighub
   ```

4. **提交變更**
   - 使用有意義的提交訊息
   - 遵循提交訊息規範（見下方）

## 編碼規範

### TypeScript

- 遵循 [Angular Style Guide](https://angular.dev/style-guide)
- 使用嚴格的 TypeScript 設定
- 避免使用 `any` 型別
- 優先使用 `const` 而非 `let`
- 為函式和變數使用描述性名稱

範例：
```typescript
// ✅ Good
const userProfile = await this.userService.getProfile(userId);

// ❌ Bad
let x = await this.userService.getProfile(userId);
```

### Angular 組件

- 使用 Standalone Components（當適用）
- 組件前綴：`app-`
- 使用 OnPush 變更偵測策略（當可行時）
- 保持組件小且專注於單一職責

範例：
```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {
  // Component logic
}
```

### SCSS

- 使用 SCSS 作為樣式語言
- 遵循 BEM 命名慣例（當適用）
- 避免深層巢狀（最多 3 層）
- 使用變數定義顏色、間距等

### SSR 考量

- 避免在 SSR 環境使用瀏覽器專屬 API
- 使用 `isPlatformBrowser` 檢查執行環境
- 確保程式碼在伺服器端和客戶端都能正常運作

範例：
```typescript
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

export class MyComponent {
  private platformId = inject(PLATFORM_ID);
  
  someMethod() {
    if (isPlatformBrowser(this.platformId)) {
      // 瀏覽器專屬程式碼
      window.localStorage.setItem('key', 'value');
    }
  }
}
```

詳細規範請參考 [程式碼風格指南](docs/standards/code-style.md)。

## 提交規範

我們使用 [Conventional Commits](https://www.conventionalcommits.org/) 規範。

### 提交訊息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- **feat**: 新功能
- **fix**: Bug 修正
- **docs**: 文件變更
- **style**: 格式變更（不影響程式碼邏輯）
- **refactor**: 重構（既非新功能也非 bug 修正）
- **perf**: 效能改善
- **test**: 測試相關
- **chore**: 建置流程或輔助工具變更

### Scope（可選）

指定變更影響的範圍，例如：
- `core`: 核心功能
- `auth`: 認證相關
- `ui`: UI 組件
- `docs`: 文件

### 範例

```bash
feat(auth): add user login functionality

Implement user login with email and password.
Includes form validation and error handling.

Closes #123
```

```bash
fix(ui): correct button alignment in header

The submit button was misaligned on mobile devices.
This commit fixes the CSS to properly center the button.
```

```bash
docs: update setup instructions

Add missing steps for Supabase configuration.
```

詳細資訊請參考 [Git 工作流程文件](docs/standards/git-workflow.md)。

## Pull Request 流程

### 提交前檢查清單

在提交 PR 前，請確認：

- [ ] 程式碼遵循專案的編碼規範
- [ ] 所有測試通過 (`npm test`)
- [ ] 建置成功 (`npm run build`)
- [ ] 已撰寫或更新相關測試
- [ ] 已更新相關文件
- [ ] Commit 訊息遵循提交規範
- [ ] 沒有不必要的檔案變更

### 提交 PR

1. **Push 到您的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **建立 Pull Request**
   - 前往 GitHub 上的專案頁面
   - 點擊 "New Pull Request"
   - 選擇您的分支
   - 填寫 PR 描述

3. **PR 描述範本**
   ```markdown
   ## 變更說明
   簡短描述這個 PR 的目的和變更內容。
   
   ## 變更類型
   - [ ] 新功能
   - [ ] Bug 修正
   - [ ] 重構
   - [ ] 文件更新
   - [ ] 其他
   
   ## 測試
   說明如何測試這些變更。
   
   ## 檢查清單
   - [ ] 程式碼遵循專案規範
   - [ ] 測試通過
   - [ ] 文件已更新
   - [ ] 沒有破壞性變更（或已標註）
   
   ## 相關 Issue
   Closes #issue-number
   
   ## 截圖（如適用）
   ```

### Code Review 流程

1. **自動檢查**
   - CI/CD 管道會自動執行測試和建置
   - 確保所有檢查通過

2. **人工審查**
   - 維護者會審查您的程式碼
   - 可能會要求修改
   - 請及時回應審查意見

3. **合併**
   - 審查通過後，維護者會合併 PR
   - 分支會被刪除

詳細資訊請參考 [審查準則](docs/standards/review-guidelines.md)。

## 文件貢獻

文件與程式碼同樣重要！

### 文件類型

- **設定指南**: `docs/setup/`
- **架構文件**: `docs/architecture/`
- **開發指南**: `docs/guides/`
- **標準規範**: `docs/standards/`

### 文件規範

1. **使用 Markdown 格式**
2. **遵循命名規範**（kebab-case）
3. **保持簡潔清晰**
4. **包含程式碼範例**（當適用）
5. **使用 Mermaid 繪製圖表**

詳細資訊請參考 [文件管理標準](docs/DOCUMENTATION_STANDARDS.md)。

### 更新文件

當您的程式碼變更影響到：
- API 介面
- 設定方式
- 使用流程
- 架構設計

請同時更新相關文件。

## 問題回報與協助

### 尋求協助

- 查看 [文件](docs/README.md)
- 搜尋現有 [Issues](https://github.com/7Spade/ng-gighub/issues)
- 在 Discussions 提問

### 回報安全性問題

如果發現安全性漏洞，請：
- **不要**公開建立 issue
- 私下聯繫專案維護者
- 提供詳細的漏洞資訊

## 開發資源

### 文件
- [系統架構概覽](docs/architecture/system-overview.md)
- [領域模型](docs/architecture/DOMAIN_MODEL.md)
- [程式碼風格指南](docs/standards/code-style.md)
- [Git 工作流程](docs/standards/git-workflow.md)

### 外部資源
- [Angular 文件](https://angular.dev)
- [TypeScript 手冊](https://www.typescriptlang.org/docs/)
- [Supabase 文件](https://supabase.com/docs)
- [RxJS 文件](https://rxjs.dev)

## 授權

提交貢獻即表示您同意將您的貢獻按照本專案的授權條款進行授權。

## 致謝

感謝所有為本專案做出貢獻的開發者！

---

**問題？** 請開啟 [Issue](https://github.com/7Spade/ng-gighub/issues) 或參與 [Discussions](https://github.com/7Spade/ng-gighub/discussions)。

**最後更新**: 2025-11-22
