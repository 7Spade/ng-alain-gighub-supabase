# 企業級編碼規範

## 概述

本文檔定義了 ng-alain-gighub-supabase 專案的編碼標準，所有團隊成員和貢獻者都必須遵守。

## TypeScript 規範

### 基本原則

1. **使用嚴格模式**
   - 專案已啟用 TypeScript strict mode
   - 禁止使用 `any` 類型（除非有充分理由且添加註釋）
   - 使用明確的類型註解

```typescript
// ✅ 正確
function calculateTotal(items: Product[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ 錯誤
function calculateTotal(items: any): any {
  return items.reduce((sum: any, item: any) => sum + item.price, 0);
}
```

2. **使用 `const` 和 `let`**
   - 優先使用 `const`
   - 只在需要重新賦值時使用 `let`
   - 禁止使用 `var`

```typescript
// ✅ 正確
const MAX_RETRY = 3;
let currentRetry = 0;

// ❌ 錯誤
var MAX_RETRY = 3;
var currentRetry = 0;
```

3. **類型推斷**
   - 在明顯的情況下可以省略類型註解
   - 公開 API 必須有明確的類型

```typescript
// ✅ 正確
const count = 0; // 類型推斷為 number
const items: Product[] = []; // 空陣列需要類型註解

// ❌ 錯誤
const count: number = 0; // 不必要的類型註解
const items = []; // 無法推斷類型
```

### 命名規範

請參閱 [命名規範文檔](./naming-conventions.md) 獲取詳細資訊。

### Interface vs Type

- 優先使用 `interface` 定義物件形狀
- 使用 `type` 定義聯合類型、交叉類型或複雜類型

```typescript
// ✅ 使用 interface
interface User {
  id: string;
  name: string;
  email: string;
}

// ✅ 使用 type
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### 函數

1. **函數聲明 vs 箭頭函數**

```typescript
// ✅ 類別方法使用函數聲明
class UserService {
  getUser(id: string): User {
    return this.users.find(u => u.id === id);
  }
}

// ✅ 回調函數使用箭頭函數
users.map(user => user.name);

// ✅ 獨立函數可使用函數聲明
function formatDate(date: Date): string {
  return date.toISOString();
}
```

2. **參數數量**
   - 避免超過 3 個參數
   - 多個參數使用物件封裝

```typescript
// ✅ 正確
interface CreateUserOptions {
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

function createUser(options: CreateUserOptions): User {
  // ...
}

// ❌ 錯誤
function createUser(name: string, email: string, role: string, department?: string): User {
  // ...
}
```

## Angular 規範

### 元件

1. **元件類別命名**
   - 使用 PascalCase
   - 以 `Component` 結尾

```typescript
// ✅ 正確
export class UserListComponent { }
export class ProductDetailComponent { }

// ❌ 錯誤
export class userList { }
export class ProductDetails { }
```

2. **元件選擇器**
   - 使用 kebab-case
   - 使用專案前綴（`app-`）
   - 描述性命名

```typescript
// ✅ 正確
@Component({
  selector: 'app-user-list',
  // ...
})

// ❌ 錯誤
@Component({
  selector: 'userList',
  // ...
})
```

3. **元件生命週期**
   - 按順序實作生命週期方法
   - 明確實作介面

```typescript
export class UserComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    // 初始化邏輯
  }

  ngOnDestroy(): void {
    // 清理邏輯
  }
}
```

4. **變更檢測策略**
   - 優先使用 OnPush 策略
   - 配合 Immutable 資料模式

```typescript
@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### Service

1. **Service 命名**
   - 使用 PascalCase
   - 以 `Service` 結尾

```typescript
// ✅ 正確
export class UserDataService { }
export class AuthenticationService { }

// ❌ 錯誤
export class UserData { }
export class Auth { }
```

2. **依賴注入**
   - 使用 `providedIn: 'root'` 提供單例服務
   - 避免在構造函數中執行邏輯

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {
    // 只做簡單的初始化
  }

  // 邏輯在方法中實作
  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }
}
```

### RxJS

1. **訂閱管理**
   - 使用 `async` pipe 避免手動訂閱
   - 必須手動訂閱時，確保取消訂閱

```typescript
// ✅ 使用 async pipe
@Component({
  template: `
    <div *ngFor="let user of users$ | async">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  users$ = this.userService.getUsers();
}

// ✅ 手動訂閱時取消訂閱
export class UserDetailComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.userService.getUser(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

2. **操作符使用**

```typescript
// ✅ 正確使用 RxJS 操作符
this.searchTerm$
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => this.search(term)),
    catchError(error => of([]))
  )
  .subscribe(results => this.results = results);
```

## HTML 範本規範

### 結構

1. **屬性順序**
   - 結構性指令（*ngIf, *ngFor）
   - 屬性綁定 ([prop])
   - 事件綁定 ((event))
   - 雙向綁定 ([(ngModel)])
   - 一般屬性

```html
<!-- ✅ 正確 -->
<button
  *ngIf="isVisible"
  [disabled]="isDisabled"
  (click)="handleClick()"
  type="button"
  class="btn btn-primary">
  Submit
</button>
```

2. **格式化**
   - 使用 2 空格縮排
   - 屬性過多時換行
   - 保持一致的結構

```html
<!-- ✅ 正確 -->
<app-user-card
  [user]="currentUser"
  [editable]="canEdit"
  (save)="onSave($event)"
  (cancel)="onCancel()">
</app-user-card>
```

### 可訪問性

1. **ARIA 屬性**
   - 為互動元素添加適當的 ARIA 屬性
   - 使用語義化 HTML

```html
<!-- ✅ 正確 -->
<button
  type="button"
  aria-label="關閉對話框"
  (click)="close()">
  <i class="icon-close"></i>
</button>

<!-- ❌ 錯誤 -->
<div (click)="close()">
  <i class="icon-close"></i>
</div>
```

## LESS/SCSS 規範

### 命名

1. **使用 kebab-case**

```scss
// ✅ 正確
.user-card {
  .user-name { }
  .user-email { }
}

// ❌ 錯誤
.userCard {
  .userName { }
}
```

2. **BEM 命名法**（推薦）

```scss
.user-card {
  &__header { }
  &__body { }
  &__footer { }
  
  &--highlighted {
    border-color: var(--primary-color);
  }
}
```

### 巢狀結構

- 最多 3 層巢狀
- 避免過深的選擇器

```scss
// ✅ 正確
.user-list {
  .user-item {
    .user-name { }
  }
}

// ❌ 錯誤
.container {
  .wrapper {
    .content {
      .section {
        .item { }
      }
    }
  }
}
```

## 註釋規範

### JSDoc 註釋

為公開 API 提供 JSDoc 註釋：

```typescript
/**
 * 根據 ID 獲取使用者資料
 * @param userId - 使用者唯一識別碼
 * @returns 使用者資料的 Observable
 * @throws {Error} 當使用者不存在時
 */
getUserById(userId: string): Observable<User> {
  // ...
}
```

### 程式碼註釋

- 解釋「為什麼」而不是「做什麼」
- 複雜邏輯需要註釋
- 保持註釋簡潔

```typescript
// ✅ 正確 - 解釋原因
// 使用 setTimeout 避免 ExpressionChangedAfterItHasBeenCheckedError
setTimeout(() => this.updateView(), 0);

// ❌ 錯誤 - 說明顯而易見的事
// 設置 count 為 0
this.count = 0;
```

## 錯誤處理

### 統一錯誤處理

```typescript
// Service 層
getUserData(): Observable<User> {
  return this.http.get<User>('/api/user').pipe(
    catchError(error => {
      console.error('Failed to load user:', error);
      return throwError(() => new Error('Unable to load user data'));
    })
  );
}

// Component 層
loadUser(): void {
  this.userService.getUserData().subscribe({
    next: (user) => this.user = user,
    error: (error) => {
      this.errorMessage = 'Failed to load user data';
      this.notificationService.showError(error.message);
    }
  });
}
```

## 測試

### 單元測試命名

```typescript
describe('UserService', () => {
  describe('getUserById', () => {
    it('should return user when ID is valid', () => {
      // ...
    });

    it('should throw error when ID is invalid', () => {
      // ...
    });

    it('should cache user data', () => {
      // ...
    });
  });
});
```

### 測試覆蓋率

- 目標：80% 以上的程式碼覆蓋率
- 所有公開 API 必須有測試
- 關鍵業務邏輯必須有測試

## 效能最佳化

1. **延遲載入**
   - 使用路由延遲載入功能模組
   - 大型第三方庫按需載入

2. **變更檢測**
   - 使用 OnPush 策略
   - 避免在範本中使用函數呼叫

3. **記憶化**
   - 使用 memoization 快取計算結果
   - 使用 TrackBy 優化 ngFor

## 安全性

### XSS 防護

```typescript
// ✅ 使用 Angular 內建的安全機制
@Component({
  template: `<div>{{ userInput }}</div>` // 自動轉義
})

// ❌ 避免使用 innerHTML
@Component({
  template: `<div [innerHTML]="userInput"></div>` // 危險！
})

// ✅ 必須使用時，先清理內容
constructor(private sanitizer: DomSanitizer) {}
getSafeHtml(html: string) {
  return this.sanitizer.sanitize(SecurityContext.HTML, html);
}
```

### 敏感資料

- 不在前端儲存敏感資料
- 使用環境變數管理 API 金鑰
- API 請求使用 HTTPS

## 程式碼審查檢查清單

- [ ] 代碼符合命名規範
- [ ] 沒有使用 `any` 類型
- [ ] 有適當的錯誤處理
- [ ] RxJS 訂閱已正確管理
- [ ] 有必要的單元測試
- [ ] 符合可訪問性標準
- [ ] 沒有安全性漏洞
- [ ] 效能考量已實施

## 工具配置

專案使用以下工具強制執行規範：

- **ESLint**: TypeScript 和 Angular 代碼檢查
- **Prettier**: 程式碼格式化
- **Stylelint**: 樣式檢查
- **Husky**: Pre-commit hooks

執行檢查：

```bash
npm run lint
npm run lint:ts
npm run lint:style
```

## 相關文檔

- [命名規範](./naming-conventions.md)
- [程式碼風格指南](./style-guide.md)
- [Angular Style Guide](https://angular.dev/style-guide)
