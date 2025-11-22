# 程式碼風格指南

## 概述

本文檔詳細說明 ng-alain-gighub-supabase 專案的程式碼風格標準，補充 [編碼規範](./coding-standards.md) 和 [命名規範](./naming-conventions.md)。

## 檔案組織

### 檔案結構

```typescript
// 1. 匯入語句
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '@core/services';
import { User } from './models';

// 2. 介面和類型
interface LocalConfig {
  enabled: boolean;
}

// 3. 常數
const DEFAULT_CONFIG: LocalConfig = {
  enabled: true
};

// 4. 元件/服務/類別
@Component({
  // ...
})
export class MyComponent {
  // ...
}
```

### 匯入順序

使用自動排序（ESLint 已配置）：

1. Angular 核心套件
2. 第三方套件
3. 專案內部模組
4. 相對路徑匯入

```typescript
// ✅ 正確順序
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '@core/services/user.service';
import { AuthService } from '@shared/services/auth.service';

import { User } from './models/user.model';
import './styles.scss';
```

## TypeScript 風格

### 縮排與空格

- 使用 2 個空格縮排
- 運算符前後加空格
- 逗號後加空格
- 冒號後加空格

```typescript
// ✅ 正確
const user: User = {
  name: 'John',
  age: 30,
  email: 'john@example.com'
};

const result = value1 + value2;

// ❌ 錯誤
const user:User={
  name:'John',
  age:30,
  email:'john@example.com'
};

const result=value1+value2;
```

### 行長度

- 最大 140 字元
- 長語句適當換行

```typescript
// ✅ 正確
const message = this.translate.instant(
  'errors.validation.required',
  { field: fieldName }
);

// ✅ 也正確（如果夠短）
const message = this.translate.instant('errors.required');
```

### 分號

- 總是使用分號

```typescript
// ✅ 正確
const value = 10;
const getMessage = () => 'Hello';

// ❌ 錯誤
const value = 10
const getMessage = () => 'Hello'
```

### 引號

- 使用單引號
- HTML 屬性使用雙引號

```typescript
// ✅ TypeScript 中使用單引號
const message = 'Hello World';
const template = '<div class="container"></div>';

// ❌ 錯誤
const message = "Hello World";
```

```html
<!-- ✅ HTML 中使用雙引號 -->
<div class="container">
  <span id="message">Hello</span>
</div>
```

### 括號

- 物件字面值加空格
- 陣列字面值不加空格

```typescript
// ✅ 正確
const obj = { key: 'value' };
const arr = [1, 2, 3];

// ❌ 錯誤
const obj = {key: 'value'};
const arr = [ 1, 2, 3 ];
```

### 箭頭函數

- 單一參數可省略括號
- 單行函數可省略大括號

```typescript
// ✅ 正確
const double = (x: number) => x * 2;
const getName = (user: User) => user.name;

// ✅ 也正確
users.map(user => user.name);
users.filter(user => user.isActive);

// ✅ 多行需要大括號
const process = (data: Data[]) => {
  const filtered = data.filter(item => item.isValid);
  return filtered.map(item => item.value);
};
```

## Angular 風格

### 元件結構

```typescript
@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailComponent implements OnInit, OnDestroy {
  // 1. 裝飾器屬性
  @Input() userId!: string;
  @Output() userChange = new EventEmitter<User>();

  // 2. 公開屬性
  user: User | null = null;
  isLoading = false;

  // 3. 私有屬性
  private destroy$ = new Subject<void>();

  // 4. 建構函數
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  // 5. 生命週期方法
  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 6. 公開方法
  loadUser(): void {
    this.isLoading = true;
    this.userService.getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load user:', error);
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // 7. 私有方法
  private validateUser(user: User): boolean {
    return user.email && user.name;
  }
}
```

### 服務結構

```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // 1. 私有常數
  private readonly apiUrl = '/api/users';

  // 2. 私有屬性
  private userCache = new Map<string, User>();

  // 3. 建構函數
  constructor(
    private http: HttpClient,
    private logger: LoggerService
  ) {}

  // 4. 公開方法
  getUserById(id: string): Observable<User> {
    const cached = this.userCache.get(id);
    if (cached) {
      return of(cached);
    }

    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap(user => this.userCache.set(id, user)),
      catchError(error => this.handleError(error))
    );
  }

  // 5. 私有方法
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.logger.error('API Error:', error);
    return throwError(() => new Error('Failed to fetch user'));
  }
}
```

## HTML 範本風格

### 格式化

```html
<!-- ✅ 正確 - 單行簡單元素 -->
<button type="button" (click)="submit()">Submit</button>

<!-- ✅ 正確 - 多屬性換行 -->
<button
  type="submit"
  class="btn btn-primary"
  [disabled]="isLoading"
  (click)="submit()">
  Submit
</button>

<!-- ✅ 正確 - 巢狀結構 -->
<div class="user-card">
  <div class="user-card__header">
    <h3 class="user-card__title">{{ user.name }}</h3>
  </div>
  <div class="user-card__body">
    <p class="user-card__description">{{ user.description }}</p>
  </div>
</div>
```

### 結構指令

```html
<!-- ✅ 正確 - 使用 ng-container -->
<ng-container *ngIf="user$ | async as user">
  <div class="user-info">
    <h2>{{ user.name }}</h2>
    <p>{{ user.email }}</p>
  </div>
</ng-container>

<!-- ✅ 正確 - else 分支 -->
<div *ngIf="isLoading; else content">
  <app-loading-spinner></app-loading-spinner>
</div>
<ng-template #content>
  <div class="main-content">...</div>
</ng-template>

<!-- ✅ 正確 - trackBy -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>
```

### 事件綁定

```html
<!-- ✅ 正確 -->
<button (click)="handleClick()">Click</button>
<input (input)="handleInput($event)" />
<form (ngSubmit)="onSubmit()">...</form>

<!-- ❌ 錯誤 - 避免範本中的複雜表達式 -->
<button (click)="users.filter(u => u.isActive).length > 0 && doSomething()">
  Click
</button>
```

## LESS/SCSS 風格

### 縮排與巢狀

```scss
// ✅ 正確 - 最多 3 層巢狀
.user-card {
  padding: 16px;
  border: 1px solid #ddd;

  &__header {
    margin-bottom: 12px;

    .title {
      font-size: 18px;
      font-weight: bold;
    }
  }

  &__body {
    color: #666;
  }

  &--highlighted {
    border-color: #1890ff;
    background-color: #e6f7ff;
  }
}
```

### 屬性順序

```scss
.component {
  // 1. 定位
  position: relative;
  top: 0;
  left: 0;
  z-index: 1;

  // 2. 盒模型
  display: flex;
  width: 100%;
  height: auto;
  padding: 16px;
  margin: 0;

  // 3. 排版
  font-size: 14px;
  line-height: 1.5;
  text-align: left;

  // 4. 視覺
  color: #000;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  // 5. 動畫
  transition: all 0.3s ease;
}
```

### 變數使用

```scss
// ✅ 使用 CSS 變數
.component {
  color: var(--text-color);
  background: var(--primary-color);
  padding: var(--spacing-md);
}

// ✅ LESS 變數（需要時）
@primary-color: #1890ff;
@border-radius: 4px;

.button {
  background: @primary-color;
  border-radius: @border-radius;
}
```

## 註釋風格

### JSDoc 註釋

```typescript
/**
 * 使用者服務
 * 
 * 負責管理使用者相關的 API 請求和快取
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * 根據 ID 獲取使用者資料
   * 
   * @param userId - 使用者唯一識別碼
   * @returns 包含使用者資料的 Observable
   * @throws {Error} 當使用者不存在或網路錯誤時
   * 
   * @example
   * ```typescript
   * this.userService.getUserById('123').subscribe(user => {
   *   console.log(user.name);
   * });
   * ```
   */
  getUserById(userId: string): Observable<User> {
    // ...
  }
}
```

### 行內註釋

```typescript
// ✅ 正確 - 解釋為什麼
// 使用 setTimeout 避免 ExpressionChangedAfterItHasBeenCheckedError
setTimeout(() => this.updateView(), 0);

// ✅ 正確 - 解釋複雜邏輯
// 計算使用者權限時，需要考慮繼承的角色權限
const permissions = this.calculatePermissions(user.roles);

// ❌ 錯誤 - 說明明顯的事情
// 設置使用者名稱
this.userName = user.name;
```

### TODO 註釋

```typescript
// TODO: 需要優化此查詢的效能
// TODO(username): 實作快取機制
// FIXME: 修復當使用者未登入時的錯誤
// NOTE: 此處的邏輯與 spec 不同，需要確認
```

## 格式化工具

### Prettier 配置

專案已配置 Prettier，會自動格式化：

- TypeScript 檔案
- HTML 檔案  
- SCSS/LESS 檔案
- JSON 檔案

### 自動格式化

```bash
# 格式化所有檔案
npx prettier --write "src/**/*.{ts,html,scss,json}"

# 檢查格式
npx prettier --check "src/**/*.{ts,html,scss,json}"
```

### VSCode 設定

在 VSCode 中啟用自動格式化：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 檢查清單

提交程式碼前確認：

- [ ] 程式碼已通過 Prettier 格式化
- [ ] 程式碼已通過 ESLint 檢查
- [ ] 程式碼已通過 Stylelint 檢查
- [ ] 匯入語句已正確排序
- [ ] 沒有未使用的變數或匯入
- [ ] 註釋清晰且有意義
- [ ] 命名符合規範
- [ ] 程式碼結構清晰

## 工具指令

```bash
# 檢查 TypeScript 程式碼風格
npm run lint:ts

# 檢查 LESS 樣式風格
npm run lint:style

# 檢查所有
npm run lint

# 自動修復
npm run lint:ts -- --fix
```

## 相關文檔

- [編碼規範](./coding-standards.md)
- [命名規範](./naming-conventions.md)
- [Git 工作流程](../workflow/git-workflow.md)
- [Prettier 配置](../../.prettierrc.js)
- [ESLint 配置](../../eslint.config.mjs)
- [Stylelint 配置](../../stylelint.config.mjs)
