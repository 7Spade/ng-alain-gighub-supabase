# 錯誤處理指南


> **📚 目的**: 定義統一的錯誤處理策略，提升應用程式的穩定性與用戶體驗

## 目標讀者 (Audience)

- 前端開發者
- 後端開發者

---


## 📑 目錄

- [📋 目錄](#-目錄)
- [錯誤處理概述](#錯誤處理概述)
  - [核心組件](#核心組件)
  - [自動處理](#自動處理)
- [錯誤分類](#錯誤分類)
  - [錯誤類型（ErrorType）](#錯誤類型errortype)
  - [錯誤嚴重程度（ErrorSeverity）](#錯誤嚴重程度errorseverity)
- [錯誤碼定義](#錯誤碼定義)
  - [HTTP 錯誤碼](#http-錯誤碼)
  - [網路錯誤碼](#網路錯誤碼)
  - [驗證錯誤碼](#驗證錯誤碼)
  - [業務錯誤碼](#業務錯誤碼)
  - [權限錯誤碼](#權限錯誤碼)
  - [Git-like 分支錯誤碼](#git-like-分支錯誤碼)
- [使用 ErrorStateService](#使用-errorstateservice)
  - [基本使用](#基本使用)
  - [自動 HTTP 錯誤處理](#自動-http-錯誤處理)
  - [手動添加錯誤](#手動添加錯誤)
- [前端錯誤顯示](#前端錯誤顯示)
  - [使用 ErrorBannerComponent](#使用-errorbannercomponent)
  - [在組件中顯示錯誤](#在組件中顯示錯誤)
- [後端錯誤回應](#後端錯誤回應)
  - [Supabase PostgREST 錯誤格式](#supabase-postgrest-錯誤格式)
  - [Edge Functions 錯誤格式](#edge-functions-錯誤格式)
- [錯誤日誌記錄](#錯誤日誌記錄)
  - [前端錯誤日誌](#前端錯誤日誌)
  - [後端錯誤日誌](#後端錯誤日誌)
  - [錯誤追蹤](#錯誤追蹤)
- [最佳實踐](#最佳實踐)
  - [1. 錯誤分類原則](#1-錯誤分類原則)
  - [2. 嚴重程度選擇](#2-嚴重程度選擇)
  - [3. 錯誤訊息撰寫](#3-錯誤訊息撰寫)
  - [4. 錯誤來源標記](#4-錯誤來源標記)
  - [5. 錯誤元數據](#5-錯誤元數據)
  - [6. 避免重複錯誤](#6-避免重複錯誤)
  - [7. 錯誤重試](#7-錯誤重試)
- [完整範例](#完整範例)
  - [範例 1：服務中的錯誤處理](#範例-1服務中的錯誤處理)
  - [範例 2：組件中的錯誤處理](#範例-2組件中的錯誤處理)
  - [範例 3：表單驗證錯誤](#範例-3表單驗證錯誤)
- [API 參考](#api-參考)
  - [ErrorStateService 方法](#errorstateservice-方法)
  - [ErrorStateService 屬性（Signal）](#errorstateservice-屬性signal)
- [相關文檔](#相關文檔)

---


> 📋 **目的**：統一錯誤處理方式，確保錯誤處理的一致性和使用者體驗

**最後更新**：2025-11-15
**維護者**：開發團隊

- --

## 📋 目錄

- [錯誤處理概述](#錯誤處理概述)
- [錯誤分類](#錯誤分類)
- [錯誤碼定義](#錯誤碼定義)
- [使用 ErrorStateService](#使用-errorstateservice)
- [前端錯誤顯示](#前端錯誤顯示)
- [後端錯誤回應](#後端錯誤回應)
- [錯誤日誌記錄](#錯誤日誌記錄)
- [最佳實踐](#最佳實踐)

**參考文檔**：
- [開發作業指引](./specs/00-development-guidelines.md) - 錯誤處理規範
- `src/app/core/net/error/ERROR_HANDLING_GUIDE.md` - 詳細使用手冊
- [API接口詳細文檔](./33-API-接口詳細文檔.md) - API 錯誤處理

- --

## 錯誤處理概述

專案使用統一的錯誤處理系統，透過 `ErrorStateService` 管理所有錯誤狀態。

### 核心組件

- **ErrorStateService** - 錯誤狀態管理服務
- **defaultInterceptor** - HTTP 錯誤自動攔截
- **ErrorBannerComponent** - 錯誤橫幅顯示組件

### 自動處理

所有 HTTP 錯誤會透過 `defaultInterceptor` 自動記錄到 `ErrorStateService`，無需手動處理。

- --

## 錯誤分類

### 錯誤類型（ErrorType）

| 類型 | 說明 | 範例 |
|------|------|------|
| `http` | HTTP 請求錯誤 | 4xx、5xx 狀態碼 |
| `network` | 網路連線錯誤 | 連線失敗、超時 |
| `validation` | 表單驗證錯誤 | 欄位驗證失敗 |
| `business` | 業務邏輯錯誤 | 業務規則違反 |
| `permission` | 權限錯誤 | 無權限訪問 |
| `unknown` | 未知錯誤 | 未分類錯誤 |

### 錯誤嚴重程度（ErrorSeverity）

| 嚴重程度 | 說明 | 使用場景 |
|---------|------|---------|
| `critical` | 嚴重錯誤 | 系統級錯誤，需立即處理（如 500 錯誤） |
| `error` | 一般錯誤 | 需要處理的錯誤（如 400、404 錯誤） |
| `warning` | 警告 | 可忽略的警告（如驗證警告） |
| `info` | 資訊提示 | 僅提示資訊（如操作成功提示） |

- --

## 錯誤碼定義

### HTTP 錯誤碼

| HTTP 狀態碼 | 錯誤碼 | 說明 | 處理方式 |
|------------|--------|------|---------|
| 400 | `http.400.bad_request` | 請求參數錯誤 | 檢查請求參數 |
| 401 | `http.401.unauthorized` | 未授權 | 重新登入 |
| 403 | `http.403.forbidden` | 無權限 | 檢查用戶權限 |
| 404 | `http.404.not_found` | 資源不存在 | 檢查資源 ID |
| 409 | `http.409.conflict` | 資料衝突 | 檢查唯一性約束 |
| 500 | `http.500.internal_server_error` | 伺服器錯誤 | 聯繫管理員 |
| 502 | `http.502.bad_gateway` | 閘道錯誤 | 重試請求 |
| 503 | `http.503.service_unavailable` | 服務不可用 | 稍後重試 |

### 網路錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `network.timeout` | 請求超時 | 重試請求 |
| `network.offline` | 網路離線 | 檢查網路連線 |
| `network.dns_failed` | DNS 解析失敗 | 檢查網路設定 |

### 驗證錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `validation.form.required` | 必填欄位為空 | 填寫必填欄位 |
| `validation.form.email` | 電子郵件格式錯誤 | 修正電子郵件格式 |
| `validation.form.min_length` | 長度不足 | 增加輸入長度 |

### 業務錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `business.task.limit_reached` | 任務數量已達上限 | 刪除舊任務或升級方案 |
| `business.blueprint.not_found` | 藍圖不存在 | 檢查藍圖 ID |
| `business.user.inactive` | 用戶未啟用 | 聯繫管理員啟用帳戶 |

### 權限錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `permission.denied` | 無權限 | 聯繫管理員授予權限 |
| `permission.role.insufficient` | 角色權限不足 | 升級角色權限 |

### Git-like 分支錯誤碼

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|---------|
| `branch.merge.conflict` | 合併承攬欄位時資料衝突 | 依錯誤 payload 修正欄位後重新提交 PR |
| `branch.payload.missing` | PR 缺少允許欄位 | 確認 `payload` 只包含在 `allowed_columns` 內的欄位 |
| `branch.role.forbidden` | 分支角色無該欄位寫入權限 | 調整 `branch_roles`/`branch_permissions` 或請擁有者操作 |
| `staging.expired` | 暫存提交逾期 | 重新填寫資料或透過 PR 修正 |

- --

## 使用 ErrorStateService

### 基本使用

```typescript
import { inject } from '@angular/core';
import { ErrorStateService } from '@core/net';

export class MyService {
  private readonly errorService = inject(ErrorStateService);

  async performAction() {
    try {
      await someOperation();
    } catch (error) {
      this.errorService.addError({
        type: 'business',
        severity: 'error',
        message: '操作失敗',
        details: error.message,
        source: 'MyService',
        retryable: false
      });
    }
  }
}
```

### 自動 HTTP 錯誤處理

所有 HTTP 錯誤會自動處理，無需手動添加：

```typescript
// HTTP 錯誤會自動記錄到 ErrorStateService
this.http.get('/api/data').subscribe({
  next: (data) => console.log(data),
  error: (error) => {
    // 錯誤已被自動記錄，這裡可以添加額外處理
    console.error('載入失敗', error);
  }
});
```

### 手動添加錯誤

```typescript
// 網路錯誤（可重試）
this.errorService.addError({
  type: 'network',
  severity: 'error',
  message: '網路連線失敗',
  details: '無法連接到服務器',
  source: 'DataService',
  retryable: true,
  retryFn: () => {
    this.loadData();
  }
});

// 驗證錯誤
this.errorService.addError({
  type: 'validation',
  severity: 'warning',
  message: '表單驗證失敗',
  details: '請檢查輸入欄位',
  source: 'FormComponent',
  retryable: false
});

// 業務邏輯錯誤
this.errorService.addError({
  type: 'business',
  severity: 'error',
  message: '餘額不足',
  details: '您的帳戶餘額不足以完成此操作',
  source: 'PaymentService',
  retryable: false,
  metadata: {
    accountId: '123',
    amount: 1000,
    balance: 500
  }
});
```

- --

## 前端錯誤顯示

### 使用 ErrorBannerComponent

在應用根組件中添加錯誤橫幅：

```typescript
import { Component, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';
import { ErrorBannerComponent } from '@shared/components/error-display';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ErrorBannerComponent, /* ... */],
  template: `
    <app-error-banner
      [errors]="errorService.activeErrors()"
      (clear)="errorService.removeError($event)"
      (retry)="errorService.retryError($event)"
    />
    <router-outlet />
  `
})
export class AppComponent {
  readonly errorService = inject(ErrorStateService);
}
```

### 在組件中顯示錯誤

```typescript
import { Component, inject } from '@angular/core';
import { ErrorStateService } from '@core/net';

@Component({
  selector: 'app-my-component',
  template: `
    @if (errorService.hasErrors()) {
      <div class="error-summary">
        發現 {{ errorService.errorCount() }} 個錯誤
      </div>
    }

    @for (error of errorService.criticalErrors(); track error.id) {
      <div class="critical-error">
        {{ error.message }}
      </div>
    }
  `
})
export class MyComponent {
  readonly errorService = inject(ErrorStateService);
}
```

- --

## 後端錯誤回應

### Supabase PostgREST 錯誤格式

```json
{
  "error": {
    "code": "PGRST116",
    "message": "The result contains 0 rows",
    "details": null,
    "hint": null
  }
}
```

### Edge Functions 錯誤格式

```typescript
// 成功回應
return new Response(
  JSON.stringify({ success: true, data: result }),
  { status: 200, headers: { 'Content-Type': 'application/json' } }
);

// 錯誤回應
return new Response(
  JSON.stringify({
    error: {
      code: 'business.task.not_found',
      message: '任務不存在',
      details: `找不到 ID 為 ${taskId} 的任務`
    }
  }),
  { status: 404, headers: { 'Content-Type': 'application/json' } }
);
```

**Git-like/暫存 Edge Functions**（如 `branch-merge`, `staging-finalize`）請務必：

- 使用上表定義的錯誤碼（如 `branch.merge.conflict`, `staging.expired`）。
- 在 `details` 中附上衝突欄位或逾期時間，方便前端顯示。
- 使用對應的 HTTP 狀態碼：`409`（衝突）、`422`（payload 不完整）、`410`（暫存逾期）。

- --

## 錯誤日誌記錄

### 前端錯誤日誌

錯誤會自動記錄到 `ErrorStateService` 的錯誤歷史中：

```typescript
// 獲取錯誤歷史
const history = this.errorService.errorHistory();

// 查看最近的錯誤
const recentErrors = history
  .slice(-10)
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
```

### 後端錯誤日誌

使用 Supabase 的日誌功能：

```bash
# 使用 Supabase MCP 工具查看日誌
@SUPABASE 獲取 API 日誌
@SUPABASE 獲取 Edge Functions 日誌
```

### 錯誤追蹤

建議整合錯誤追蹤服務（如 Sentry）：

```typescript
// 在 ErrorStateService 中添加錯誤追蹤
this.errorService.addError({
  // ...
  metadata: {
    // 添加追蹤資訊
    userId: this.userService.currentUser()?.id,
    url: window.location.href,
    userAgent: navigator.userAgent
  }
});
```

- --

## 最佳實踐

### 1. 錯誤分類原則

- **HTTP 錯誤**：網路請求相關的錯誤（自動處理）
- **網路錯誤**：連線失敗、超時等
- **驗證錯誤**：表單驗證、輸入驗證錯誤
- **業務邏輯錯誤**：業務規則違反、操作失敗
- **權限錯誤**：無權限訪問、身份驗證失敗

### 2. 嚴重程度選擇

- **critical**：系統級錯誤，需要立即處理
- **error**：一般錯誤，需要處理
- **warning**：警告，可忽略
- **info**：資訊提示

### 3. 錯誤訊息撰寫

```typescript
// ✅ 好的錯誤訊息
{
  message: '無法載入用戶資料',
  details: '網路連線失敗，請檢查您的網路設定'
}

// ❌ 不好的錯誤訊息
{
  message: 'Error',
  details: 'Something went wrong'
}
```

### 4. 錯誤來源標記

始終提供 `source` 參數，方便追蹤錯誤來源：

```typescript
this.errorService.addError({
  // ...
  source: 'UserService.loadUserProfile', // 清晰的來源標記
});
```

### 5. 錯誤元數據

使用 `metadata` 儲存有用的調試資訊：

```typescript
this.errorService.addError({
  // ...
  metadata: {
    userId: '123',
    operation: 'updateProfile',
    requestData: { name: 'John' }
  }
});
```

### 6. 避免重複錯誤

在添加錯誤前檢查是否已存在相同錯誤：

```typescript
const existingError = this.errorService
  .activeErrors()
  .find(e => e.message === '網路連線失敗');

if (!existingError) {
  this.errorService.addError({
    // ...
  });
}
```

### 7. 錯誤重試

對可恢復的錯誤提供重試機制：

```typescript
this.errorService.addError({
  type: 'network',
  severity: 'error',
  message: '網路連線失敗',
  retryable: true,
  retryFn: () => {
    this.loadData();
  }
});
```

- --

## 完整範例

### 範例 1：服務中的錯誤處理

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorStateService } from '@core/net';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly errorService = inject(ErrorStateService);

  loadUser(userId: string) {
    return this.http.get(`/api/users/${userId}`).pipe(
      catchError(error => {
        // HTTP 錯誤會被自動記錄，但可以添加額外的業務邏輯
        if (error.status === 404) {
          this.errorService.addError({
            type: 'business',
            severity: 'error',
            message: '用戶不存在',
            details: `找不到 ID 為 ${userId} 的用戶`,
            source: 'UserService.loadUser',
            retryable: false,
            metadata: { userId }
          });
        }
        return throwError(() => error);
      })
    );
  }
}
```

### 範例 2：組件中的錯誤處理

```typescript
import { Component, inject, signal } from '@angular/core';
import { ErrorStateService } from '@core/net';
import { ErrorBannerComponent } from '@shared/components/error-display';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ErrorBannerComponent],
  template: `
    <app-error-banner
      [errors]="errorService.activeErrors()"
      (clear)="errorService.removeError($event)"
      (retry)="errorService.retryError($event)"
    />

    @if (user(); as userData) {
      <div class="user-profile">
        <h1>{{ userData.name }}</h1>
        <p>{{ userData.email }}</p>
      </div>
    }

    @if (errorService.hasErrors()) {
      <div class="error-summary">
        發現 {{ errorService.errorCount() }} 個錯誤
      </div>
    }
  `
})
export class UserProfileComponent {
  readonly userService = inject(UserService);
  readonly errorService = inject(ErrorStateService);
  readonly user = signal<any>(null);

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    this.userService.loadUser('123').subscribe({
      next: (user) => this.user.set(user),
      error: (error) => {
        // 錯誤已被自動記錄
        console.error('載入用戶失敗', error);
      }
    });
  }
}
```

### 範例 3：表單驗證錯誤

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ErrorStateService } from '@core/net';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" />
      @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <span class="error">請輸入有效的電子郵件地址</span>
      }
      <button type="submit" [disabled]="form.invalid">提交</button>
    </form>
  `
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly errorService = inject(ErrorStateService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.errorService.addError({
        type: 'validation',
        severity: 'warning',
        message: '表單驗證失敗',
        details: '請檢查所有必填欄位',
        source: 'ContactFormComponent',
        retryable: false
      });
      return;
    }
    // 提交表單...
  }
}
```

- --

## API 參考

### ErrorStateService 方法

| 方法 | 說明 | 參數 | 返回值 |
|------|------|------|--------|
| `addError(error)` | 添加錯誤 | `ErrorRecord` | `string` (錯誤 ID) |
| `removeError(id)` | 移除錯誤 | `string` (錯誤 ID) | `void` |
| `clearErrors()` | 清除所有錯誤 | - | `void` |
| `clearErrorsByType(type)` | 清除特定類型的錯誤 | `ErrorType` | `void` |
| `clearErrorsBySeverity(severity)` | 清除特定嚴重程度的錯誤 | `ErrorSeverity` | `void` |
| `retryError(id)` | 重試錯誤 | `string` (錯誤 ID) | `void` |
| `getError(id)` | 獲取特定錯誤 | `string` (錯誤 ID) | `ErrorRecord \| undefined` |
| `filterErrors(predicate)` | 過濾錯誤 | `(error: ErrorRecord) => boolean` | `ErrorRecord[]` |
| `clearHistory()` | 清除歷史記錄 | - | `void` |

### ErrorStateService 屬性（Signal）

| 屬性 | 說明 | 類型 |
|------|------|------|
| `errors` | 所有錯誤列表 | `Signal<ErrorRecord[]>` |
| `errorHistory` | 錯誤歷史記錄 | `Signal<ErrorRecord[]>` |
| `activeErrors` | 當前活躍的錯誤 | `Signal<ErrorRecord[]>` |
| `hasErrors` | 是否有錯誤 | `Signal<boolean>` |
| `errorCount` | 錯誤數量 | `Signal<number>` |
| `criticalErrors` | 嚴重錯誤列表 | `Signal<ErrorRecord[]>` |
| `normalErrors` | 一般錯誤列表 | `Signal<ErrorRecord[]>` |

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [API接口詳細文檔](./33-API-接口詳細文檔.md)
- [常見問題 FAQ](./36-常見問題-FAQ.md)
- `src/app/core/net/error/ERROR_HANDLING_GUIDE.md`

- --

**最後更新**：2025-11-13
**維護者**：開發團隊


