# 代碼審查規範

## 📑 目錄

- [📋 目錄](#-目錄)
- [審查流程](#審查流程)
  - [1. Pull Request 建立](#1-pull-request-建立)
  - [2. 自動檢查](#2-自動檢查)
  - [3. 人工審查](#3-人工審查)
  - [4. 審查回饋](#4-審查回饋)
  - [5. 合併條件](#5-合併條件)
- [Pull Request 規範](#pull-request-規範)
  - [PR 標題格式](#pr-標題格式)
  - [Type 類型](#type-類型)
  - [PR 描述模板](#pr-描述模板)
- [審查檢查清單](#審查檢查清單)
  - [🎯 功能性](#-功能性)
  - [🏗️ 架構設計](#-架構設計)
  - [💻 代碼品質](#-代碼品質)
    - [TypeScript 檢查](#typescript-檢查)
    - [Angular 最佳實踐](#angular-最佳實踐)
  - [🧪 測試](#-測試)
  - [🔒 安全性](#-安全性)
  - [⚡ 效能](#-效能)
  - [📝 文檔](#-文檔)
- [代碼品質標準](#代碼品質標準)
  - [命名規範](#命名規範)
  - [函數大小](#函數大小)
  - [圈複雜度](#圈複雜度)
  - [DRY 原則](#dry-原則)
- [審查技巧](#審查技巧)
  - [高效審查](#高效審查)
  - [溝通方式](#溝通方式)
- [相關文檔](#相關文檔)

---


> **目的**：定義代碼審查流程、檢查清單和品質標準，確保代碼品質

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊

- --

## 📋 目錄

1. [審查流程](#審查流程)
2. [Pull Request 規範](#pull-request-規範)
3. [審查檢查清單](#審查檢查清單)
4. [代碼品質標準](#代碼品質標準)

- --

## 審查流程

### 1. Pull Request 建立

```bash
# 1. 確保分支最新
git checkout develop
git pull origin develop

# 2. 建立功能分支
git checkout -b feature/todo-widget

# 3. 開發並提交
git add .
git commit -m "feat: add todo widget component"

# 4. 推送並建立 PR
git push origin feature/todo-widget
gh pr create --base develop --fill
```

### 2. 自動檢查

PR 建立後自動觸發：
- ✅ Lint 檢查
- ✅ TypeScript 編譯
- ✅ 單元測試
- ✅ 建置驗證
- ✅ 代碼覆蓋率檢查

### 3. 人工審查

**審查者職責**：
- 檢查代碼邏輯
- 驗證功能完整性
- 確認測試覆蓋
- 檢視文檔更新

**審查時限**：
- 小型 PR (<200 行)：24 小時內
- 中型 PR (200-500 行)：48 小時內
- 大型 PR (>500 行)：72 小時內

### 4. 審查回饋

```markdown
## 審查意見範例

### 必須修改 (Blocking)
- [ ] L23: 缺少錯誤處理
- [ ] L45: 應使用 Signal 而非 Observable

### 建議改進 (Non-blocking)
- 💡 L67: 可以提取為共用函數
- 💡 L89: 考慮使用 computed 優化效能

### 讚賞
- 👍 測試覆蓋完整
- 👍 文檔寫得很清楚
```

### 5. 合併條件

- ✅ 所有自動檢查通過
- ✅ 至少 1 位審查者批准
- ✅ 所有 Blocking 意見已解決
- ✅ 無合併衝突
- ✅ CI/CD 成功

- --

## Pull Request 規範

### PR 標題格式

```mermaid

範例：
feat(tasks): add todo widget component
fix(auth): resolve token refresh issue
docs(readme): update installation guide
```

### Type 類型

| Type | 說明 | 範例 |
|------|------|------|
| **feat** | 新功能 | feat: add user profile page |
| **fix** | Bug 修復 | fix: resolve memory leak |
| **docs** | 文檔更新 | docs: update API documentation |
| **style** | 格式調整 | style: format code with prettier |
| **refactor** | 重構 | refactor: simplify auth logic |
| **perf** | 效能優化 | perf: optimize query performance |
| **test** | 測試 | test: add unit tests for service |
| **chore** | 雜項 | chore: update dependencies |

### PR 描述模板

```markdown
## PR Checklist
- [ ] 代碼遵循專案規範
- [ ] 已添加單元測試
- [ ] 測試覆蓋率達標
- [ ] 已更新相關文檔
- [ ] 無編譯錯誤或警告

## PR Type
- [ ] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Documentation

## 問題描述
<!-- 描述要解決的問題 -->

## 解決方案
<!-- 描述如何解決問題 -->

## 測試計劃
<!-- 如何測試這些變更 -->

## Screenshots (如有 UI 變更)
<!-- 附上截圖 -->

## Breaking Changes
- [ ] Yes
- [ ] No

## 其他資訊
<!-- 其他需要說明的內容 -->
```

- --

## 審查檢查清單

### 🎯 功能性

- [ ] **功能完整**：實作符合需求
- [ ] **邊界條件**：處理各種邊界情況
- [ ] **錯誤處理**：適當的錯誤處理和恢復
- [ ] **使用者體驗**：介面友善且直觀

### 🏗️ 架構設計

- [ ] **模組化**：代碼分層清晰
- [ ] **可重用性**：元件設計通用
- [ ] **鬆耦合**：模組間依賴最小化
- [ ] **SOLID 原則**：遵循設計原則

### 💻 代碼品質

- [ ] **可讀性**：命名清晰、邏輯簡單
- [ ] **一致性**：遵循專案風格
- [ ] **註解**：適當的文檔註解
- [ ] **複雜度**：避免過度複雜

#### TypeScript 檢查

```typescript
// ✅ 好的代碼
interface User {
  id: string;
  name: string;
  email: string;
}

function getUserById(id: string): Promise<User | null> {
  return userRepository.findById(id);
}

// ❌ 不好的代碼
function getUser(x: any): any {
  return getData(x);
}
```

#### Angular 最佳實踐

```typescript
// ✅ Standalone Component + OnPush + Signals
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class UserProfileComponent {
  user = input.required<User>();
  isEditing = signal(false);
}

// ❌ 不推薦
@Component({
  selector: 'app-user-profile',
  template: `...`
})
export class UserProfileComponent {
  user: any;
  isEditing: boolean;
}
```

### 🧪 測試

- [ ] **單元測試**：關鍵邏輯有測試
- [ ] **覆蓋率**：達到 80% 以上
- [ ] **測試品質**：測試有意義且穩定
- [ ] **E2E 測試**：關鍵流程有測試

```typescript
// ✅ 好的測試
describe('UserService', () => {
  it('should return user when found', async () => {
    const user = await service.getUserById('123');
    expect(user).toBeDefined();
    expect(user.id).toBe('123');
  });

  it('should throw error when user not found', async () => {
    await expectAsync(
      service.getUserById('invalid')
    ).toBeRejectedWithError('User not found');
  });
});
```

### 🔒 安全性

- [ ] **輸入驗證**：所有輸入都經過驗證
- [ ] **SQL 注入**：使用參數化查詢
- [ ] **XSS 防護**：適當的輸出編碼
- [ ] **認證授權**：正確的權限檢查
- [ ] **敏感資訊**：無密碼或 Token 硬編碼

### ⚡ 效能

- [ ] **查詢優化**：資料庫查詢高效
- [ ] **記憶體管理**：無記憶體洩漏
- [ ] **懶加載**：適當使用懶加載
- [ ] **快取策略**：合理使用快取

### 📝 文檔

- [ ] **JSDoc**：公開 API 有文檔
- [ ] **README**：必要時更新 README
- [ ] **CHANGELOG**：記錄重要變更
- [ ] **註解**：複雜邏輯有說明

- --

## 代碼品質標準

### 命名規範

```typescript
// ✅ 好的命名
class UserRepository { }
interface UserProfile { }
function calculateTotalAmount(): number { }
const MAX_RETRY_COUNT = 3;
const isValidEmail = (email: string) => { };

// ❌ 不好的命名
class UR { }
interface data { }
function calc(): any { }
const x = 3;
const check = (e: any) => { };
```

### 函數大小

```typescript
// ✅ 好的函數 (< 50 行)
function processUser(user: User): ProcessedUser {
  const validated = validateUser(user);
  const normalized = normalizeUser(validated);
  return enrichUser(normalized);
}

// ❌ 太大的函數 (> 100 行)
function doEverything() {
  // 100+ lines of code
}
```

### 圈複雜度

```typescript
// ✅ 低複雜度 (< 10)
function getStatus(user: User): string {
  if (!user.isActive) return 'inactive';
  if (user.isVerified) return 'verified';
  return 'pending';
}

// ❌ 高複雜度 (> 15)
function complexLogic(data: any) {
  if (data.a) {
    if (data.b) {
      if (data.c) {
        // 多層嵌套
      }
    }
  }
  // ...更多條件
}
```

### DRY 原則

```typescript
// ✅ 提取共用邏輯
function validateAndSave(entity: any, repo: Repository) {
  const errors = validate(entity);
  if (errors.length > 0) throw new ValidationError(errors);
  return repo.save(entity);
}

const user = await validateAndSave(userData, userRepo);
const task = await validateAndSave(taskData, taskRepo);

// ❌ 重複代碼
async function saveUser(userData: any) {
  const errors = validate(userData);
  if (errors.length > 0) throw new ValidationError(errors);
  return userRepo.save(userData);
}

async function saveTask(taskData: any) {
  const errors = validate(taskData);
  if (errors.length > 0) throw new ValidationError(errors);
  return taskRepo.save(taskData);
}
```

- --

## 審查技巧

### 高效審查

1. **先看大局**：理解整體變更目的
2. **分批審查**：大 PR 分多次審查
3. **優先重點**：先看邏輯和安全
4. **給予建設性意見**：說明原因和建議
5. **認可優點**：讚賞好的實作

### 溝通方式

```markdown
# ✅ 建設性回饋
💡 建議將此函數拆分為兩個較小的函數，可提升可讀性和可測試性。
參考：[Function Size Best Practice]

# ❌ 無建設性回饋
這段代碼寫得不好。
```

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [測試指南](./38-測試指南.md)
- [版本管理與發布指南](./55-版本管理與發布指南.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
