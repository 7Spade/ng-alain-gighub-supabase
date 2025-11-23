# @delon/acl 使用指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [概述](#概述)
  - [核心特點](#核心特點)
- [安裝與導入](#安裝與導入)
  - [安裝](#安裝)
  - [導入方式](#導入方式)
    - [方式 1：導入 ACLModule（已棄用，推薦使用 Standalone）](#方式-1導入-aclmodule已棄用推薦使用-standalone)
    - [方式 2：使用 SHARED_IMPORTS（推薦）](#方式-2使用-shared_imports推薦)
- [配置](#配置)
- [主要功能](#主要功能)
  - [ACLDirective - ACL 指令](#acldirective---acl-指令)
    - [基本用法](#基本用法)
    - [API 參數](#api-參數)
    - [使用示例](#使用示例)
  - [ACLIfDirective - 條件 ACL 指令](#aclifdirective---條件-acl-指令)
    - [基本用法](#基本用法)
    - [使用示例](#使用示例)
  - [ACLService - ACL 服務](#aclservice---acl-服務)
    - [主要方法](#主要方法)
    - [使用示例](#使用示例)
    - [在服務中使用](#在服務中使用)
- [實際使用示例](#實際使用示例)
  - [示例 1：角色控制](#示例-1角色控制)
  - [示例 2：權限控制](#示例-2權限控制)
  - [示例 3：與 PermissionService 集成](#示例-3與-permissionservice-集成)
  - [示例 4：路由守衛集成](#示例-4路由守衛集成)
  - [示例 5：動態設置權限](#示例-5動態設置權限)
- [最佳實踐](#最佳實踐)
  - [1. 優先使用 SHARED_IMPORTS](#1-優先使用-shared_imports)
  - [2. 使用 Signals 管理權限狀態](#2-使用-signals-管理權限狀態)
  - [3. 與 PermissionService 集成](#3-與-permissionservice-集成)
  - [4. 路由級權限控制](#4-路由級權限控制)
  - [5. 模板中使用條件渲染](#5-模板中使用條件渲染)
- [常見問題](#常見問題)
  - [Q1: 如何同時檢查角色和權限？](#q1-如何同時檢查角色和權限)
  - [Q2: 如何動態更新權限？](#q2-如何動態更新權限)
  - [Q3: 如何清空所有權限？](#q3-如何清空所有權限)
  - [Q4: 如何獲取當前 ACL 數據？](#q4-如何獲取當前-acl-數據)
  - [Q5: 如何與 Supabase 權限系統集成？](#q5-如何與-supabase-權限系統集成)
- [🔗 相關文檔](#-相關文檔)
- [📚 參考資源](#-參考資源)
  - [官方文檔](#官方文檔)
  - [相關組件](#相關組件)

---


> 📋 **目的**：詳細說明 `@delon/acl` 訪問控制列表的使用方法、API 和最佳實踐

**最後更新**：2025-01-15
**適用版本**：@delon/acl ^20.1.0
**相關文檔**：[SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md)

- --

## 📋 目錄

- [概述](#概述)
- [安裝與導入](#安裝與導入)
- [配置](#配置)
- [主要功能](#主要功能)
  - [ACLDirective - ACL 指令](#acldirective---acl-指令)
  - [ACLIfDirective - 條件 ACL 指令](#aclifdirective---條件-acl-指令)
  - [ACLService - ACL 服務](#aclservice---acl-服務)
- [實際使用示例](#實際使用示例)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)

- --

## 概述

`@delon/acl` 是 ng-alain 框架提供的訪問控制列表（ACL）功能，用於實現基於角色和權限的訪問控制。支持角色（Role）和權限（Ability）兩種控制方式。

### 核心特點

- **雙重控制**：支持角色（Role）和權限（Ability）兩種控制方式
- **模板指令**：提供 `[acl]` 和 `*aclIf` 指令，方便在模板中使用
- **服務 API**：提供 `ACLService` 服務，支持在組件和服務中使用
- **路由守衛**：可配合路由守衛實現路由級權限控制

- --

## 安裝與導入

### 安裝

`@delon/acl` 已包含在專案依賴中（`package.json`）：

```json
{
  "dependencies": {
    "@delon/acl": "^20.1.0"
  }
}
```

### 導入方式

#### 方式 1：導入 ACLModule（已棄用，推薦使用 Standalone）

```typescript
import { ACLModule } from '@delon/acl';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ACLModule],
  // ...
})
export class ExampleComponent {}
```

#### 方式 2：使用 SHARED_IMPORTS（推薦）

```typescript
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS], // 包含 ACLDirective 和 ACLIfDirective
  // ...
})
export class ExampleComponent {}
```

- --

## 配置

在 `app.config.ts` 中配置 ACL：

```typescript
import { provideDelonACL } from '@delon/acl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideDelonACL({
      guard_url: '/403', // 無權限時跳轉的 URL
      guard_failure: null, // 無權限時的處理函數
      preCan: null, // 權限檢查前的處理函數
    }),
    // ...
  ],
};
```

- --

## 主要功能

### ACLDirective - ACL 指令

**導入**：`import { ACLDirective } from '@delon/acl';`
**文檔**：https://ng-alain.com/acl

用於控制元素的顯示/隱藏。

#### 基本用法

```html
<!-- 單個角色 -->
<button nz-button [acl]="'admin'">管理員按鈕</button>

<!-- 多個角色（OR） -->
<div [acl]="['admin', 'user']">管理員或用戶可見</div>

<!-- 權限控制 -->
<button nz-button [acl]="'blueprint.read'">查看藍圖</button>

<!-- 多個權限（OR） -->
<div [acl]="['blueprint.read', 'blueprint.write']">有讀或寫權限可見</div>
```

#### API 參數

| 參數 | 說明 | 類型 | 默認值 |
|------|------|------|--------|
| `[acl]` | 角色或權限 | `string \| string[] \| ACLType` | `-` |
| `[aclAbility]` | 權限能力（當 acl 為角色時） | `string \| string[]` | `-` |
| `[aclThen]` | 有權限時顯示的模板 | `TemplateRef<void>` | `-` |
| `[aclElse]` | 無權限時顯示的模板 | `TemplateRef<void>` | `-` |

#### 使用示例

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <!-- 單個角色 -->
    <button nz-button [acl]="'admin'">管理員操作</button>

    <!-- 多個角色（OR） -->
    <div [acl]="['admin', 'user']">
      <p>管理員或用戶可見</p>
    </div>

    <!-- 權限控制 -->
    <button nz-button [acl]="'blueprint.read'">查看藍圖</button>

    <!-- 使用 then/else 模板 -->
    <div [acl]="'admin'" [aclThen]="adminTemplate" [aclElse]="noAccessTemplate">
    </div>

    <ng-template #adminTemplate>
      <p>管理員專屬內容</p>
    </ng-template>

    <ng-template #noAccessTemplate>
      <p>無權限訪問</p>
    </ng-template>
  `
})
export class ExampleComponent {}
```

- --

### ACLIfDirective - 條件 ACL 指令

**導入**：`import { ACLIfDirective } from '@delon/acl';`
**文檔**：https://ng-alain.com/acl

條件渲染指令，類似 `*ngIf`。

#### 基本用法

```html
<!-- 單個角色 -->
<div *aclIf="'admin'">僅管理員可見</div>

<!-- 多個角色（OR） -->
<div *aclIf="['admin', 'user']">管理員或用戶可見</div>

<!-- 權限控制 -->
<div *aclIf="'blueprint.read'">有讀權限可見</div>

<!-- 多個權限（OR） -->
<div *aclIf="['blueprint.read', 'blueprint.write']">有讀或寫權限可見</div>
```

#### 使用示例

```typescript
import { Component, signal } from '@angular/core';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <!-- 條件渲染 -->
    <div *aclIf="'admin'">
      <p>僅管理員可見</p>
    </div>

    <!-- 多角色條件 -->
    <div *aclIf="['admin', 'user']">
      <p>管理員或用戶可見</p>
    </div>

    <!-- 權限條件 -->
    <div *aclIf="'blueprint.read'">
      <p>有讀權限可見</p>
    </div>

    <!-- 配合 else -->
    <div *aclIf="'admin'; else noAccess">
      <p>管理員專屬內容</p>
    </div>

    <ng-template #noAccess>
      <p>無權限訪問</p>
    </ng-template>
  `
})
export class ExampleComponent {}
```

- --

### ACLService - ACL 服務

**導入**：`import { ACLService } from '@delon/acl';`

在組件或服務中使用 ACL 服務進行權限判斷。

#### 主要方法

##### 1. can() - 檢查權限

```typescript
// 檢查單個角色
can(role: string): boolean;

// 檢查多個角色（OR）
can(roles: string[]): boolean;

// 檢查多個角色（AND）
can(roles: string[], mode: 'AND'): boolean;

// 檢查權限
can(ability: string): boolean;
```

##### 2. setFull() - 設置全權限

```typescript
setFull(val: boolean): void;
```

##### 3. setRole() - 設置角色

```typescript
setRole(roles: string | string[]): void;
```

##### 4. setAbility() - 設置權限

```typescript
setAbility(abilities: string | string[]): boolean;
```

##### 5. set() - 設置完整 ACL 數據

```typescript
set(value: ACLType): void;
```

##### 6. get() - 獲取 ACL 數據

```typescript
get(): ACLType;
```

##### 7. clear() - 清空 ACL

```typescript
clear(): void;
```

#### 使用示例

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { ACLService } from '@delon/acl';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <button nz-button *ngIf="canEdit()" (click)="edit()">編輯</button>
      <button nz-button *ngIf="canDelete()" (click)="delete()">刪除</button>
      <button nz-button *ngIf="canAdmin()" (click)="admin()">管理</button>
    </nz-card>
  `
})
export class ExampleComponent {
  private readonly acl = inject(ACLService);

  // 檢查編輯權限
  canEdit = computed(() => {
    return this.acl.can('admin') || this.acl.can('blueprint.write');
  });

  // 檢查刪除權限
  canDelete = computed(() => {
    return this.acl.can('admin');
  });

  // 檢查管理權限
  canAdmin = computed(() => {
    return this.acl.can(['admin', 'super_admin'], 'AND');
  });

  edit(): void {
    console.log('編輯操作');
  }

  delete(): void {
    console.log('刪除操作');
  }

  admin(): void {
    console.log('管理操作');
  }
}
```

#### 在服務中使用

```typescript
import { Injectable, inject } from '@angular/core';
import { ACLService } from '@delon/acl';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private readonly acl = inject(ACLService);

  canAccess(permission: string): boolean {
    return this.acl.can(permission);
  }

  canAccessAny(permissions: string[]): boolean {
    return permissions.some(p => this.acl.can(p));
  }

  canAccessAll(permissions: string[]): boolean {
    return permissions.every(p => this.acl.can(p));
  }
}
```

- --

## 實際使用示例

### 示例 1：角色控制

```typescript
import { Component, inject } from '@angular/core';
import { ACLService } from '@delon/acl';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-role-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>角色控制示例</h3>

      <!-- 管理員專屬 -->
      <div [acl]="'admin'">
        <button nz-button nzType="primary">管理員操作</button>
      </div>

      <!-- 管理員或用戶 -->
      <div [acl]="['admin', 'user']">
        <button nz-button>管理員或用戶操作</button>
      </div>

      <!-- 條件渲染 -->
      <div *aclIf="'admin'">
        <p>僅管理員可見的內容</p>
      </div>
    </nz-card>
  `
})
export class RoleExampleComponent {
  private readonly acl = inject(ACLService);

  ngOnInit(): void {
    // 設置當前用戶角色
    this.acl.setRole(['user']);
  }
}
```

### 示例 2：權限控制

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { ACLService } from '@delon/acl';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-permission-example',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <h3>權限控制示例</h3>

      <!-- 讀權限 -->
      <button nz-button [acl]="'blueprint.read'" (click)="view()">
        查看藍圖
      </button>

      <!-- 寫權限 -->
      <button nz-button [acl]="'blueprint.write'" (click)="edit()">
        編輯藍圖
      </button>

      <!-- 管理權限 -->
      <button nz-button [acl]="'blueprint.admin'" (click)="admin()">
        管理藍圖
      </button>

      <!-- 多權限（OR） -->
      <div [acl]="['blueprint.read', 'blueprint.write']">
        <p>有讀或寫權限可見</p>
      </div>
    </nz-card>
  `
})
export class PermissionExampleComponent {
  private readonly acl = inject(ACLService);

  ngOnInit(): void {
    // 設置當前用戶權限
    this.acl.setAbility(['blueprint.read', 'blueprint.write']);
  }

  view(): void {
    console.log('查看藍圖');
  }

  edit(): void {
    console.log('編輯藍圖');
  }

  admin(): void {
    console.log('管理藍圖');
  }
}
```

### 示例 3：與 PermissionService 集成

**實際使用案例**：

```36:227:src/app/core/permissions/permission.service.ts
export class PermissionService {
  private readonly aclService = inject(ACLService);
  // ...

  can(permission: string): Observable<boolean> {
    // 1. 检查本地 ACLService 缓存
    if (this.aclService.can(permission)) {
      return of(true);
    }
    // ...
  }

  private syncPermissionToACL(permission: string): void {
    // 同步权限到 @delon/acl ACLService
    const parts = permission.split('.');
    if (parts.length === 2) {
      const currentData = this.aclService.data;
      const abilities = currentData.abilities || [];
      if (!abilities.includes(permission)) {
        this.aclService.set({
          ...currentData,
          abilities: [...abilities, permission]
        });
      }
    }
  }
}
```

### 示例 4：路由守衛集成

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ACLService } from '@delon/acl';

export const aclGuard: CanActivateFn = (route) => {
  const acl = inject(ACLService);
  const router = inject(Router);

  // 從路由數據中獲取所需權限
  const requiredRole = route.data?.['role'];
  const requiredAbility = route.data?.['ability'];

  if (requiredRole && !acl.can(requiredRole)) {
    router.navigate(['/403']);
    return false;
  }

  if (requiredAbility && !acl.can(requiredAbility)) {
    router.navigate(['/403']);
    return false;
  }

  return true;
};

// 在路由配置中使用
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [aclGuard],
    data: { role: 'admin' }
  },
  {
    path: 'blueprint',
    component: BlueprintComponent,
    canActivate: [aclGuard],
    data: { ability: 'blueprint.read' }
  }
];
```

### 示例 5：動態設置權限

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ACLService } from '@delon/acl';
import { PermissionService } from '@core/permissions/permission.service';
import { SHARED_IMPORTS } from '@shared';

@Component({
  selector: 'app-dynamic-acl',
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <nz-card>
      <button nz-button [acl]="'blueprint.read'">查看</button>
      <button nz-button [acl]="'blueprint.write'">編輯</button>
    </nz-card>
  `
})
export class DynamicACLComponent implements OnInit {
  private readonly acl = inject(ACLService);
  private readonly permissionService = inject(PermissionService);

  ngOnInit(): void {
    // 從數據庫加載用戶權限
    this.permissionService.loadUserPermissions(userId).subscribe({
      next: (permissions) => {
        // 同步權限到 ACLService
        const abilities = permissions.map(p => `${p.resource}.${p.action}`);
        this.acl.setAbility(abilities);
      }
    });
  }
}
```

- --

## 最佳實踐

### 1. 優先使用 SHARED_IMPORTS

```typescript
// ✅ 正確：使用 SHARED_IMPORTS
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  standalone: true,
  imports: [SHARED_IMPORTS], // 已包含 ACL 指令
  template: `<button [acl]="'admin'">管理</button>`
})
export class ExampleComponent {}
```

### 2. 使用 Signals 管理權限狀態

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { ACLService } from '@delon/acl';

@Component({
  selector: 'app-example',
  standalone: true,
  template: `...`
})
export class ExampleComponent {
  private readonly acl = inject(ACLService);

  // 使用 computed 創建派生狀態
  canEdit = computed(() => this.acl.can('blueprint.write'));
  canDelete = computed(() => this.acl.can('blueprint.delete'));
}
```

### 3. 與 PermissionService 集成

項目中的 `PermissionService` 已經與 `ACLService` 集成，可以統一管理權限：

```typescript
import { PermissionService } from '@core/permissions/permission.service';

// 在組件中使用
const permissionService = inject(PermissionService);

// 檢查權限（會自動同步到 ACLService）
permissionService.can('blueprint.read').subscribe(hasPermission => {
  if (hasPermission) {
    // 有權限
  }
});
```

### 4. 路由級權限控制

使用路由守衛實現路由級權限控制：

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [aclGuard],
    data: { role: 'admin' }
  }
];
```

### 5. 模板中使用條件渲染

```html
<!-- ✅ 推薦：使用 *aclIf -->
<div *aclIf="'admin'">
  <p>管理員專屬內容</p>
</div>

<!-- ✅ 推薦：使用 [acl] 指令 -->
<button nz-button [acl]="'admin'">管理</button>

<!-- ❌ 不推薦：在組件中手動判斷 -->
<div *ngIf="acl.can('admin')">
  <p>管理員專屬內容</p>
</div>
```

- --

## 常見問題

### Q1: 如何同時檢查角色和權限？

```typescript
// 檢查角色
const hasRole = this.acl.can('admin');

// 檢查權限
const hasAbility = this.acl.can('blueprint.read');

// 同時檢查（AND）
const hasBoth = hasRole && hasAbility;

// 任一檢查（OR）
const hasEither = hasRole || hasAbility;
```

### Q2: 如何動態更新權限？

```typescript
import { ACLService } from '@delon/acl';

// 設置角色
this.acl.setRole(['admin', 'user']);

// 設置權限
this.acl.setAbility(['blueprint.read', 'blueprint.write']);

// 設置完整 ACL 數據
this.acl.set({
  role: ['admin'],
  ability: ['blueprint.read', 'blueprint.write'],
  full: false
});
```

### Q3: 如何清空所有權限？

```typescript
import { ACLService } from '@delon/acl';

// 清空 ACL
this.acl.clear();

// 或設置為空
this.acl.set({
  role: [],
  ability: [],
  full: false
});
```

### Q4: 如何獲取當前 ACL 數據？

```typescript
import { ACLService } from '@delon/acl';

const aclData = this.acl.get();
console.log('角色:', aclData.role);
console.log('權限:', aclData.ability);
console.log('全權限:', aclData.full);
```

### Q5: 如何與 Supabase 權限系統集成？

項目中已經實現了 `PermissionService`，它會自動將 Supabase 數據庫中的權限同步到 `ACLService`：

```typescript
import { PermissionService } from '@core/permissions/permission.service';

// 加載用戶權限（會自動同步到 ACLService）
this.permissionService.loadUserPermissions(userId).subscribe();

// 檢查權限（會自動查詢數據庫並同步到 ACLService）
this.permissionService.can('blueprint.read').subscribe(hasPermission => {
  // 權限已同步到 ACLService，可以在模板中使用 [acl] 指令
});
```

- --

## 🔗 相關文檔

- [SHARED_IMPORTS 使用指南](../reference/shared-imports-guide.md) - 共享模組使用指南
- [開發作業指引](../specs/00-development-guidelines.md) - 開發規範
- [PermissionService 源碼](../../src/app/core/permissions/permission.service.ts) - 權限服務實現
- [返回索引](./README.md)

- --

## 📚 參考資源

### 官方文檔

- [@delon/acl 官方文檔](https://ng-alain.com/acl)
- [ng-alain 官方文檔](https://ng-alain.com)

### 相關組件

- [@delon/auth](https://ng-alain.com/auth) - 認證服務
- [@delon/theme](https://ng-alain.com/theme) - 主題系統

- --

**最後更新**：2025-01-15
**維護者**：開發團隊
**下次審查**：2025-02-15
