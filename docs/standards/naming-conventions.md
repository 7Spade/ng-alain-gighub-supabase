# 命名規範

## 概述

統一的命名規範是維持代碼可讀性和可維護性的關鍵。本文檔定義了專案中所有代碼元素的命名標準。

## 通用原則

### 基本規則

1. **使用英文命名**
   - 所有命名使用英文
   - 避免使用拼音或中英混合
   - 使用完整單詞而非縮寫（除非是業界通用縮寫）

```typescript
// ✅ 正確
const userList = [];
const emailAddress = '';

// ❌ 錯誤
const yonghuList = [];  // 拼音
const emlAddr = '';     // 不明確的縮寫
```

2. **見名知意**
   - 命名應該清楚表達其用途
   - 避免使用單字母變數（循環除外）
   - 避免使用過於泛化的名稱

```typescript
// ✅ 正確
const activeUserCount = users.filter(u => u.isActive).length;
const calculateTotalPrice = (items: Product[]) => { };

// ❌ 錯誤
const temp = users.filter(u => u.isActive).length;
const calc = (data: any[]) => { };
```

3. **保持一致性**
   - 同一概念在整個專案中使用相同的命名
   - 建立並遵循專案詞彙表

## TypeScript / JavaScript 命名

### 變數和常數

1. **變數：camelCase**

```typescript
let userName: string;
let isUserActive: boolean;
let totalPrice: number;
let userList: User[];
```

2. **常數：UPPER_SNAKE_CASE**

```typescript
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 20;
```

3. **只讀變數：camelCase**

```typescript
const apiConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 5000
} as const;
```

### 函數和方法

1. **使用動詞開頭**
   - 描述函數的行為
   - 使用 camelCase

```typescript
// ✅ 正確
function getUserById(id: string): User { }
function calculateTotal(items: Product[]): number { }
function isUserActive(user: User): boolean { }
function hasPermission(role: string): boolean { }

// ❌ 錯誤
function user(id: string): User { }
function total(items: Product[]): number { }
```

2. **常見動詞前綴**

| 前綴 | 說明 | 範例 |
|------|------|------|
| get | 獲取資料 | `getUserData()` |
| set | 設置資料 | `setUserRole()` |
| fetch | 從遠端獲取 | `fetchUserList()` |
| load | 載入資料 | `loadConfiguration()` |
| save | 儲存資料 | `saveUserProfile()` |
| update | 更新資料 | `updateUserStatus()` |
| delete | 刪除資料 | `deleteUser()` |
| create | 創建資料 | `createNewUser()` |
| is/has/can | 布林判斷 | `isActive()`, `hasPermission()`, `canEdit()` |
| handle | 處理事件 | `handleClick()`, `handleSubmit()` |
| on | 事件回調 | `onUserLogin()`, `onDataLoad()` |

### 類別和介面

1. **類別：PascalCase**

```typescript
class UserService { }
class ProductDetailComponent { }
class HttpInterceptor { }
class AuthenticationGuard { }
```

2. **介面：PascalCase**

```typescript
interface User { }
interface ProductDetail { }
interface ApiResponse<T> { }
interface ConfigOptions { }
```

3. **類別成員**

```typescript
class UserService {
  // Private 成員使用 private 關鍵字
  private userCache: Map<string, User>;
  private readonly apiUrl: string;

  // Public 成員不使用前綴
  currentUser: User | null;

  // 方法使用 camelCase
  getUserById(id: string): User { }
  private validateUser(user: User): boolean { }
}
```

### 類型別名和列舉

1. **Type Alias：PascalCase**

```typescript
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  error?: string;
};
type ValidationResult = {
  isValid: boolean;
  errors: string[];
};
```

2. **Enum：PascalCase**
   - Enum 名稱：PascalCase
   - Enum 成員：PascalCase

```typescript
enum UserStatus {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
  Suspended = 'SUSPENDED'
}

enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE'
}
```

## Angular 特定命名

### 元件

1. **元件類別**

```typescript
// 格式：{Feature}{Type}Component
export class UserListComponent { }
export class ProductDetailComponent { }
export class ShoppingCartComponent { }
export class LoginFormComponent { }
```

2. **元件選擇器**

```typescript
// 格式：app-{feature}-{type}
@Component({
  selector: 'app-user-list',
  // ...
})
export class UserListComponent { }

@Component({
  selector: 'app-product-detail',
  // ...
})
export class ProductDetailComponent { }
```

3. **元件檔案**

```
// 格式：{feature}-{type}.component.ts
user-list.component.ts
user-list.component.html
user-list.component.scss
user-list.component.spec.ts

product-detail.component.ts
product-detail.component.html
product-detail.component.scss
product-detail.component.spec.ts
```

### 服務

1. **服務類別**

```typescript
// 格式：{Feature}Service
export class UserService { }
export class AuthenticationService { }
export class DataStorageService { }
export class NotificationService { }
```

2. **服務檔案**

```
// 格式：{feature}.service.ts
user.service.ts
user.service.spec.ts

authentication.service.ts
authentication.service.spec.ts
```

### 指令

1. **Directive 類別**

```typescript
// 格式：{Feature}Directive
export class HighlightDirective { }
export class AutofocusDirective { }
export class ClickOutsideDirective { }
```

2. **Directive 選擇器**

```typescript
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective { }

@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective { }
```

### 管道

1. **Pipe 類別**

```typescript
// 格式：{Feature}Pipe
export class DateFormatPipe { }
export class CurrencyPipe { }
export class TruncatePipe { }
```

2. **Pipe 名稱**

```typescript
@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe { }

@Pipe({
  name: 'truncate'
})
export class TruncatePipe { }
```

### 模組

```typescript
// 格式：{Feature}Module
export class UserModule { }
export class SharedModule { }
export class CoreModule { }
export class AuthenticationModule { }
```

### Guards

```typescript
// 格式：{Feature}Guard
export class AuthGuard { }
export class RoleGuard { }
export class UnsavedChangesGuard { }
```

### Interceptors

```typescript
// 格式：{Feature}Interceptor
export class AuthInterceptor { }
export class ErrorInterceptor { }
export class CachingInterceptor { }
```

## 檔案和目錄命名

### 目錄結構

```
src/
├── app/
│   ├── core/              # 核心模組（單例服務）
│   ├── shared/            # 共用模組
│   ├── routes/            # 功能路由
│   │   ├── user/          # 使用者功能
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── user.module.ts
│   │   └── product/       # 產品功能
│   └── layout/            # 版面配置
├── assets/                # 靜態資源
└── environments/          # 環境配置
```

### 檔案命名

1. **元件檔案**

```
{name}.component.ts
{name}.component.html
{name}.component.scss
{name}.component.spec.ts
```

2. **服務檔案**

```
{name}.service.ts
{name}.service.spec.ts
```

3. **模型檔案**

```
{name}.model.ts
{name}.interface.ts
```

4. **配置檔案**

```
{name}.config.ts
{name}.constants.ts
```

## CSS/LESS/SCSS 命名

### 類別命名：kebab-case

```scss
.user-card { }
.product-list { }
.shopping-cart { }
.login-form { }
```

### BEM 命名法（推薦）

```scss
// Block
.user-card {
  // Element
  &__header { }
  &__body { }
  &__footer { }
  &__title { }
  &__description { }
  
  // Modifier
  &--highlighted { }
  &--disabled { }
  &--large { }
}

// 使用範例
<div class="user-card user-card--highlighted">
  <div class="user-card__header">
    <h3 class="user-card__title">Title</h3>
  </div>
  <div class="user-card__body">
    <p class="user-card__description">Description</p>
  </div>
</div>
```

### CSS 變數命名

```scss
:root {
  // 顏色
  --primary-color: #1890ff;
  --secondary-color: #52c41a;
  --danger-color: #ff4d4f;
  --text-color: #000000d9;
  --text-color-secondary: #00000073;
  
  // 間距
  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  // 字體
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;
}
```

## 資料庫命名

### 表格命名：snake_case（複數形式）

```sql
users
user_profiles
product_categories
order_items
```

### 欄位命名：snake_case

```sql
user_id
first_name
last_name
email_address
created_at
updated_at
is_active
```

### 索引命名

```sql
idx_{table}_{column}
idx_users_email
idx_products_category_id

uk_{table}_{column}  -- unique key
uk_users_email
```

## API 命名

### RESTful API

```
GET    /api/users              # 獲取使用者列表
GET    /api/users/:id          # 獲取單個使用者
POST   /api/users              # 創建使用者
PUT    /api/users/:id          # 更新使用者
PATCH  /api/users/:id          # 部分更新使用者
DELETE /api/users/:id          # 刪除使用者

GET    /api/users/:id/posts    # 獲取使用者的文章
POST   /api/users/:id/posts    # 為使用者創建文章
```

### GraphQL

```graphql
# Query
getUser(id: ID!): User
getUserList(filter: UserFilter): [User]

# Mutation
createUser(input: CreateUserInput!): User
updateUser(id: ID!, input: UpdateUserInput!): User
deleteUser(id: ID!): Boolean
```

## 測試命名

### 測試檔案

```
{name}.spec.ts
{name}.test.ts
{name}.e2e-spec.ts
```

### 測試描述

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when ID exists', () => { });
    it('should throw error when ID does not exist', () => { });
    it('should cache user data after first load', () => { });
  });

  describe('createUser', () => {
    it('should create user with valid data', () => { });
    it('should validate email format', () => { });
    it('should reject duplicate email', () => { });
  });
});
```

## 專案詞彙表

建立並維護專案特定的詞彙表，確保團隊使用一致的術語：

| 中文 | 英文 | 說明 |
|------|------|------|
| 使用者 | User | 系統使用者 |
| 角色 | Role | 使用者角色 |
| 權限 | Permission | 操作權限 |
| 組織 | Organization | 組織單位 |
| 部門 | Department | 部門單位 |
| 專案 | Project | 專案管理 |
| 任務 | Task | 工作任務 |
| 工單 | Ticket | 服務工單 |

## 命名檢查清單

- [ ] 使用適當的大小寫規範（camelCase, PascalCase, kebab-case, UPPER_SNAKE_CASE）
- [ ] 命名清楚表達用途
- [ ] 避免使用縮寫（除非是通用縮寫）
- [ ] 保持專案內命名一致性
- [ ] 遵循 Angular 命名約定
- [ ] 布林變數使用 is/has/can 等前綴
- [ ] 函數使用動詞開頭
- [ ] 類別和介面使用名詞

## 工具支援

專案使用 ESLint 強制執行命名規範：

```bash
npm run lint:ts
```

相關規則配置在 `eslint.config.mjs` 中。

## 相關文檔

- [編碼規範](./coding-standards.md)
- [程式碼風格指南](./style-guide.md)
- [Angular Style Guide](https://angular.dev/style-guide)
