# @delon/auth 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [配置](#配置)
- [配置](#配置)
  - [配置選項](#配置選項)
- [主要功能](#主要功能)
  - [AuthService - 認證服務](#authservice---認證服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
  - [TokenService - Token 服務](#tokenservice---token-服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
  - [HTTP 攔截器](#http-攔截器)
    - [配置](#配置)
    - [工作原理](#工作原理)
  - [路由守衛](#路由守衛)
    - [創建認證守衛](#創建認證守衛)
    - [在路由中使用](#在路由中使用)
- [實際使用示例](#實際使用示例)
  - [示例 1：登錄組件](#示例-1登錄組件)
  - [示例 2：與 Supabase 集成](#示例-2與-supabase-集成)
  - [示例 3：登出組件](#示例-3登出組件)
  - [示例 4：檢查登錄狀態](#示例-4檢查登錄狀態)
- [與 Supabase 集成](#與-supabase-集成)
  - [工作原理](#工作原理)
  - [使用方式](#使用方式)
- [最佳實踐](#最佳實踐)
  - [1. 使用 SupabaseAuthAdapterService](#1-使用-supabaseauthadapterservice)
  - [2. 配置 HTTP 攔截器](#2-配置-http-攔截器)
  - [3. 使用路由守衛](#3-使用路由守衛)
  - [4. 檢查登錄狀態](#4-檢查登錄狀態)
  - [5. 處理 Token 過期](#5-處理-token-過期)
- [常見問題](#常見問題)
  - [Q1: 如何自定義 Token 存儲方式？](#q1-如何自定義-token-存儲方式)
  - [Q2: 如何實現 Token 刷新？](#q2-如何實現-token-刷新)
  - [Q3: 如何獲取當前用戶信息？](#q3-如何獲取當前用戶信息)
  - [Q4: 如何手動設置 Token？](#q4-如何手動設置-token)
  - [Q5: 如何監聽 Token 變化？](#q5-如何監聽-token-變化)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/auth` 認證服務的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/auth ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [AuthService - 認證服務](#authservice---認證服務)
  - [TokenService - Token 服務](#tokenservice---token-服務)
  - [HTTP 攔截器](#http-攔截器)
  - [路由守衛](#路由守衛)
- [實際使用示例](#實際使用示例)
- [與 Supabase 集成](#與-supabase-集成)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/auth` 是 ng-alain 框架提供的認證服務，用於實現用戶登錄、登出、Token 管理等功能。支持多種認證方式，並提供 HTTP 攔截器自動添加 Token。

### 核心特點

- **Token 管理**：自動管理 Token 的存儲和發送
- **HTTP 攔截器**：自動在 HTTP 請求中添加 Token
- **路由守衛**：支持路由級認證控制
- **多種存儲方式**：支持 localStorage、sessionStorage 等
- **Token 刷新**：支持 Token 自動刷新機制

- --

## 安裝與導入

### 安裝

`@delon/auth` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/auth": "^20.1.0"
  }
}
```

### 配置

在 `app.config.ts` 中配置認證服務：

```typescript
import { provideAuth, authSimpleInterceptor } from '@delon/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authSimpleInterceptor]) // 添加認證攔截器
    ),
    provideAuth({
      login_url: '/passport/login',
      ignores: [/\/login/, /assets\//, /\/passport\//],
      token_send_key: 'Authorization',
      token_send_template: 'Bearer ${token}',
      token_send_place: 'header',
      store_key: '_token',
      token_invalid_redirect: true,
      token_exp_offset: 10, // Token 過期前 10 秒刷新
    }),
    // ...
  ],
};
```

- --

## 配置

### 配置選項

| 選項 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `login_url` | 登錄頁面 URL | `string` | `'/login'` |
| `ignores` | 忽略認證的路由正則表達式 | `RegExp[]` | `[]` |
| `token_send_key` | Token 發送的 Header 鍵名 | `string` | `'Authorization'` |
| `token_send_template` | Token 發送模板 | `string` | `'Bearer ${token}'` |
| `token_send_place` | Token 發送位置 | `'header' \| 'body' \| 'url'` | `'header'` |
| `store_key` | Token 存儲鍵名 | `string` | `'_token'` |
| `token_invalid_redirect` | Token 無效時是否重定向 | `boolean` | `true` |
| `token_exp_offset` | Token 過期前多少秒刷新 | `number` | `10` |

- --

## 主要功能

### AuthService - 認證服務

**導入**：`import { AuthService } from '@delon/auth';`

#### 主要方法

##### 1. login() - 登錄

```typescript
login(params: any, go?: boolean): Observable<any>;
```

##### 2. logout() - 登出

```typescript
logout(): void;
```

##### 3. check() - 檢查登錄狀態

```typescript
check(): boolean;
```

##### 4. getToken() - 獲取 Token

```typescript
getToken(): string | null;
```

##### 5. getUser() - 獲取用戶信息

```typescript
getUser(): any;
```

##### 6. setToken() - 設置 Token

```typescript
setToken(token: string): void;
```

##### 7. setUser() - 設置用戶信息

```typescript
setUser(user: any): void;
```

#### 使用示例

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@delon/auth';
import { SHARED_IMPORTS } from '@shared';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label>用戶名</nz-form-label>
        <nz-form-control>
          <input nz-input formControlName="username" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-label>密碼</nz-form-label>
        <nz-form-control>
          <input nz-input type="password" formControlName="password" />
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [disabled]="loading()">
            {{ loading() ? '登錄中...' : '登錄' }}
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly msg = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  loading = signal(false);

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    const { username, password } = this.form.value;

    this.auth.login({ username, password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.msg.success('登錄成功');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.msg.error('登錄失敗：' + (err.message || '未知錯誤'));
      }
    });
  }
}
```

- --

### TokenService - Token 服務

**導入**：`import { DA_SERVICE_TOKEN } from '@delon/auth';`

`TokenService` 是 `@delon/auth` 提供的 Token 管理服務，通過 `DA_SERVICE_TOKEN` 注入。

#### 主要方法

##### 1. get() - 獲取 Token

```typescript
get(): any;
```

##### 2. set() - 設置 Token

```typescript
set(token: any): boolean;
```

##### 3. clear() - 清空 Token

```typescript
clear(): void;
```

##### 4. change() - Token 變化事件

```typescript
change(): Observable<any>;
```

#### 使用示例

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent implements OnInit {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);

  ngOnInit(): void {
    // 獲取 Token
    const token = this.tokenService.get();
    console.log('當前 Token:', token);

    // 監聽 Token 變化
    this.tokenService.change().subscribe(token => {
      console.log('Token 已更新:', token);
    });
  }
}
```

- --

### HTTP 攔截器

`@delon/auth` 提供 `authSimpleInterceptor` 攔截器，自動在 HTTP 請求中添加 Token。

#### 配置

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authSimpleInterceptor } from '@delon/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authSimpleInterceptor])
    ),
    // ...
  ],
};
```

#### 工作原理

1. 攔截所有 HTTP 請求
2. 檢查是否有 Token
3. 如果有 Token，根據配置添加到請求頭、請求體或 URL 參數中
4. 如果 Token 無效，根據配置重定向到登錄頁

- --

### 路由守衛

可以配合路由守衛實現路由級認證控制。

#### 創建認證守衛

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@delon/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.check()) {
    return true;
  } else {
    router.navigate(['/passport/login']);
    return false;
  }
};
```

#### 在路由中使用

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  }
];
```

- --

## 實際使用示例

### 示例 1：登錄組件

**實際使用案例**：

```31:110:src/app/routes/passport/login/login.component.ts
export class UserLoginComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly supabaseAuthAdapter = inject(SupabaseAuthAdapterService);

  form = inject(FormBuilder).nonNullable.group({
    userName: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [true]
  });
  error = '';
  loading = false;

  submit(): void {
    this.error = '';
    const { userName, password } = this.form.controls;
    userName.markAsDirty();
    userName.updateValueAndValidity();
    password.markAsDirty();
    password.updateValueAndValidity();
    if (userName.invalid || password.invalid) {
      return;
    }

    // 使用 Supabase Auth 進行登入
    // 適配器會自動將 Session 同步到 @delon/auth TokenService
    const email = String(this.form.value.userName || '');
    const pwd = String(this.form.value.password || '');

    if (!email || !pwd) {
      this.error = '請輸入帳號和密碼';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.cdr.detectChanges();

    this.supabaseAuthAdapter
      .signIn(email, pwd)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: result => {
          if (result.error) {
            this.error = result.error.message || '登入失敗';
            this.cdr.detectChanges();
            return;
          }
          // 清空路由复用信息
          this.reuseTabService?.clear();
          // 適配器已自動同步 Session 到 TokenService
          // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
          this.startupSrv.load().subscribe(() => {
            let url = this.tokenService.referrer!.url || '/';
            if (url.includes('/passport')) {
              url = '/';
            }
            this.router.navigateByUrl(url);
          });
        },
        error: err => {
          this.error = err.message || '登入失敗，請稍後再試';
          this.cdr.detectChanges();
        }
      });
  }
}
```

### 示例 2：與 Supabase 集成

項目中實現了 `SupabaseAuthAdapterService`，作為 Supabase Auth 與 `@delon/auth` 之間的橋樑：

```28:227:src/app/core/supabase/supabase-auth-adapter.service.ts
export class SupabaseAuthAdapterService {
  private readonly supabaseService = inject(SupabaseService);
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly platformId = inject(PLATFORM_ID);
  private authListenerInitialized = false;

  constructor() {
    // 在瀏覽器環境中初始化 Auth 監聽器
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAuthListener();
    }
  }

  /**
   * 登入
   *
   * @param email 用戶郵箱
   * @param password 密碼
   * @returns Observable<{ error: AuthError | null }>
   */
  signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
    return from(
      this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      tap(({ data, error }) => {
        if (!error && data.session) {
          this.syncSessionToTokenService(data.session);
        }
      }),
      map(({ error }) => ({ error }))
    );
  }
  // ...
}
```

### 示例 3：登出組件

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@delon/auth';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <button nz-button (click)="logout()">登出</button>
  `
})
export class LogoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/passport/login']);
  }
}
```

### 示例 4：檢查登錄狀態

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@delon/auth';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>用戶信息</h3>
      <p>用戶名：{{ user()?.name }}</p>
      <p>郵箱：{{ user()?.email }}</p>
    </nz-card>
  `
})
export class ProfileComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user = signal<any>(null);

  ngOnInit(): void {
    if (!this.auth.check()) {
      this.router.navigate(['/passport/login']);
      return;
    }

    const user = this.auth.getUser();
    this.user.set(user);
  }
}
```

- --

## 與 Supabase 集成

項目中實現了 `SupabaseAuthAdapterService`，用於將 Supabase Auth 與 `@delon/auth` 集成：

### 工作原理

1. **登錄**：使用 Supabase Auth 進行登錄
2. **Session 轉換**：將 Supabase Session 轉換為 `@delon/auth` Token 格式
3. **自動同步**：自動將 Session 同步到 `TokenService`
4. **狀態監聽**：監聽 Supabase Auth 狀態變化，自動同步到 `TokenService`

### 使用方式

```typescript
import { SupabaseAuthAdapterService } from '@core/supabase/supabase-auth-adapter.service';

// 在組件中使用
const adapter = inject(SupabaseAuthAdapterService);

// 登錄
adapter.signIn('user@example.com', 'password').subscribe({
  next: (result) => {
    if (!result.error) {
      // 登錄成功，Session 已自動同步到 TokenService
      console.log('登錄成功');
    }
  }
});
```

- --

## 最佳實踐

### 1. 使用 SupabaseAuthAdapterService

項目中已經實現了 `SupabaseAuthAdapterService`，建議使用它而不是直接使用 `AuthService`：

```typescript
// ✅ 推薦：使用 SupabaseAuthAdapterService
import { SupabaseAuthAdapterService } from '@core/supabase/supabase-auth-adapter.service';

const adapter = inject(SupabaseAuthAdapterService);
adapter.signIn(email, password).subscribe();

// ❌ 不推薦：直接使用 AuthService（除非不使用 Supabase）
import { AuthService } from '@delon/auth';
this.auth.login({ username, password }).subscribe();
```

### 2. 配置 HTTP 攔截器

確保在 `app.config.ts` 中配置了 HTTP 攔截器：

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authSimpleInterceptor } from '@delon/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authSimpleInterceptor])
    ),
    // ...
  ],
};
```

### 3. 使用路由守衛

使用路由守衛保護需要認證的路由：

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  }
];
```

### 4. 檢查登錄狀態

在需要認證的組件中檢查登錄狀態：

```typescript
ngOnInit(): void {
  if (!this.auth.check()) {
    this.router.navigate(['/passport/login']);
    return;
  }
}
```

### 5. 處理 Token 過期

配置 Token 過期前自動刷新：

```typescript
provideAuth({
  token_exp_offset: 10, // Token 過期前 10 秒刷新
  // ...
})
```

- --

## 常見問題

### Q1: 如何自定義 Token 存儲方式？

```typescript
import { DA_STORE_TOKEN } from '@delon/auth';

// 自定義存儲服務
@Injectable()
export class CustomStorageService implements ITokenService {
  get(): any {
    // 自定義獲取邏輯
  }

  set(token: any): boolean {
    // 自定義設置邏輯
  }

  clear(): void {
    // 自定義清空邏輯
  }
}

// 在 app.config.ts 中提供
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: DA_STORE_TOKEN,
      useClass: CustomStorageService
    },
    // ...
  ],
};
```

### Q2: 如何實現 Token 刷新？

```typescript
import { provideBindAuthRefresh } from '@delon/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth({
      token_exp_offset: 10, // Token 過期前 10 秒刷新
      // ...
    }),
    provideBindAuthRefresh(), // 啟用 Token 刷新
    // ...
  ],
};
```

### Q3: 如何獲取當前用戶信息？

```typescript
import { AuthService } from '@delon/auth';

const auth = inject(AuthService);
const user = auth.getUser();
console.log('當前用戶:', user);
```

### Q4: 如何手動設置 Token？

```typescript
import { DA_SERVICE_TOKEN } from '@delon/auth';

const tokenService = inject(DA_SERVICE_TOKEN);
tokenService.set({
  token: 'your-token',
  token_type: 'Bearer',
  expires_in: 3600,
  // ...
});
```

### Q5: 如何監聽 Token 變化？

```typescript
import { DA_SERVICE_TOKEN } from '@delon/auth';

const tokenService = inject(DA_SERVICE_TOKEN);

tokenService.change().subscribe(token => {
  console.log('Token 已更新:', token);
});
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [SupabaseAuthAdapterService 源碼](../../src/app/core/supabase/supabase-auth-adapter.service.ts) - Supabase 認證適配器
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/auth 官方文檔](https://ng-alain.com/auth)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/acl](https://ng-alain.com/acl) - 訪問控制列表
- [@delon/cache](https://ng-alain.com/cache) - 緩存服務

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
