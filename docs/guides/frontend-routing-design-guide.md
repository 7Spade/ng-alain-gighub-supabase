# 前端路由設計指南

## 📑 目錄

- [📋 目錄](#-目錄)
- [路由命名規範](#路由命名規範)
  - [URL 結構規範](#url-結構規範)
  - [命名慣例](#命名慣例)
  - [路由配置](#路由配置)
- [路由守衛配置](#路由守衛配置)
  - [1. 認證守衛 (Auth Guard)](#1-認證守衛-auth-guard)
  - [2. 角色守衛 (Role Guard)](#2-角色守衛-role-guard)
  - [3. 權限守衛 (Permission Guard)](#3-權限守衛-permission-guard)
  - [4. 離開確認守衛 (Can Deactivate)](#4-離開確認守衛-can-deactivate)
  - [5. 資料預載守衛 (Resolve)](#5-資料預載守衛-resolve)
- [懶加載策略](#懶加載策略)
  - [1. 路由模組懶加載](#1-路由模組懶加載)
  - [2. 元件懶加載](#2-元件懶加載)
  - [3. 預載策略](#3-預載策略)
  - [4. 自訂預載策略](#4-自訂預載策略)
- [路由最佳實踐](#路由最佳實踐)
  - [1. 路由參數處理](#1-路由參數處理)
  - [2. 麵包屑導航](#2-麵包屑導航)
  - [3. 頁面標題管理](#3-頁面標題管理)
  - [4. 路由錯誤處理](#4-路由錯誤處理)
  - [5. 路由測試](#5-路由測試)
- [路由結構範例](#路由結構範例)
- [相關文檔](#相關文檔)

---


> **目的**：定義 Angular 路由的設計規範、命名規則和最佳實踐

**最後更新**：2025-11-16
**版本**：v1.0
**維護者**：開發團隊
**技術棧**：Angular 20.3.x Router

- --

## 📋 目錄

1. [路由命名規範](#路由命名規範)
2. [路由守衛配置](#路由守衛配置)
3. [懶加載策略](#懶加載策略)
4. [路由最佳實踐](#路由最佳實踐)

- --

## 路由命名規範

### URL 結構規範

```typescript
// ✅ 好的 URL 結構
/dashboard                    // 儀表板
/blueprints                   // 藍圖列表
/blueprints/:id               // 藍圖詳情
/blueprints/:id/edit          // 編輯藍圖
/blueprints/:id/branches      // 藍圖分支
/tasks                        // 任務列表
/tasks/:id                    // 任務詳情
/settings/profile             // 個人設定
/settings/team                // 團隊設定

// ❌ 不好的 URL 結構
/Blueprint                    // 大寫
/blueprint-list               // 使用連字號（應該用資源名複數）
/task_detail                  // 使用底線
/getBlueprint                 // 動詞開頭
```

### 命名慣例

| 類型 | 格式 | 範例 |
|------|------|------|
| **資源列表** | `/resources` | `/tasks`, `/blueprints` |
| **資源詳情** | `/resources/:id` | `/tasks/123` |
| **資源操作** | `/resources/:id/action` | `/tasks/123/edit` |
| **子資源** | `/resources/:id/sub` | `/blueprints/123/branches` |
| **設定頁面** | `/settings/category` | `/settings/profile` |

### 路由配置

```typescript
// src/app/routes/routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blueprints',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./blueprints/blueprint-list.component')
          .then(m => m.BlueprintListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./blueprints/blueprint-create.component')
          .then(m => m.BlueprintCreateComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: ':id',
        loadComponent: () => import('./blueprints/blueprint-detail.component')
          .then(m => m.BlueprintDetailComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./blueprints/blueprint-edit.component')
          .then(m => m.BlueprintEditComponent),
        canActivate: [roleGuard],
        data: { roles: ['admin', 'manager'] }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./exception/404/404.component')
      .then(m => m.Exception404Component)
  }
];
```

- --

## 路由守衛配置

### 1. 認證守衛 (Auth Guard)

```typescript
// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStateService } from '@shared/services/auth/auth-state.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  if (authState.isAuthenticated()) {
    return true;
  }

  // 保存原始 URL 以便登入後重導向
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

### 2. 角色守衛 (Role Guard)

```typescript
// src/app/core/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStateService } from '@shared/services/auth/auth-state.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRole = authState.user()?.role;

  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  return router.createUrlTree(['/exception/403']);
};
```

### 3. 權限守衛 (Permission Guard)

```typescript
// src/app/core/guards/permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionService } from '@core/services/permission.service';

export const permissionGuard: CanActivateFn = async (route, state) => {
  const permissionService = inject(PermissionService);

  const requiredPermission = route.data['permission'] as string;
  const hasPermission = await permissionService.checkPermission(requiredPermission);

  return hasPermission;
};
```

### 4. 離開確認守衛 (Can Deactivate)

```typescript
// src/app/core/guards/unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  return component.canDeactivate ? component.canDeactivate() : true;
};

// 在元件中實作
@Component({...})
export class BlueprintEditComponent implements CanComponentDeactivate {
  hasUnsavedChanges = signal(false);

  canDeactivate(): boolean {
    if (this.hasUnsavedChanges()) {
      return confirm('您有未保存的變更，確定要離開嗎？');
    }
    return true;
  }
}

// 路由配置
{
  path: ':id/edit',
  loadComponent: () => import('./blueprint-edit.component')
    .then(m => m.BlueprintEditComponent),
  canDeactivate: [unsavedChangesGuard]
}
```

### 5. 資料預載守衛 (Resolve)

```typescript
// src/app/core/resolvers/blueprint.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BlueprintService } from '@shared/services/blueprint.service';
import { Blueprint } from '@shared/models/blueprint.model';

export const blueprintResolver: ResolveFn<Blueprint> = (route, state) => {
  const blueprintService = inject(BlueprintService);
  const id = route.paramMap.get('id')!;

  return blueprintService.getById(id);
};

// 路由配置
{
  path: ':id',
  loadComponent: () => import('./blueprint-detail.component')
    .then(m => m.BlueprintDetailComponent),
  resolve: {
    blueprint: blueprintResolver
  }
}

// 在元件中使用
@Component({...})
export class BlueprintDetailComponent {
  route = inject(ActivatedRoute);

  blueprint = signal<Blueprint | null>(null);

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.blueprint.set(data['blueprint']);
    });
  }
}
```

- --

## 懶加載策略

### 1. 路由模組懶加載

```typescript
// ✅ 推薦：使用 loadChildren
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.routes')
    .then(m => m.ADMIN_ROUTES),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'] }
}

// src/app/routes/admin/admin.routes.ts
import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-list.component')
      .then(m => m.UserListComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component')
      .then(m => m.SettingsComponent)
  }
];
```

### 2. 元件懶加載

```typescript
// ✅ 推薦：使用 loadComponent
{
  path: 'dashboard',
  loadComponent: () => import('./dashboard/dashboard.component')
    .then(m => m.DashboardComponent)
}
```

### 3. 預載策略

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  PreloadAllModules,
  withPreloading
} from '@angular/router';
import { routes } from './routes/routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)  // 預載所有懶加載模組
    )
  ]
};
```

### 4. 自訂預載策略

```typescript
// src/app/core/strategies/selective-preload.strategy.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // 只預載標記為 preload 的路由
    return route.data?.['preload'] ? load() : of(null);
  }
}

// 使用
{
  path: 'blueprints',
  loadChildren: () => import('./blueprints/blueprints.routes')
    .then(m => m.BLUEPRINT_ROUTES),
  data: { preload: true }  // 標記為預載
}
```

- --

## 路由最佳實踐

### 1. 路由參數處理

```typescript
@Component({...})
export class BlueprintDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // 讀取路由參數
  blueprintId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!)
    )
  );

  // 讀取查詢參數
  queryParams = toSignal(
    this.route.queryParamMap.pipe(
      map(params => ({
        tab: params.get('tab') || 'info',
        page: +(params.get('page') || 1)
      }))
    )
  );

  // 程式導航
  navigateToEdit() {
    this.router.navigate(['/blueprints', this.blueprintId(), 'edit']);
  }

  // 帶查詢參數導航
  changeTab(tab: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'  // 保留其他查詢參數
    });
  }
}
```

### 2. 麵包屑導航

```typescript
// src/app/shared/services/breadcrumb.service.ts
@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private breadcrumbsState = signal<Breadcrumb[]>([]);
  readonly breadcrumbs = this.breadcrumbsState.asReadonly();

  setBreadcrumbs(crumbs: Breadcrumb[]) {
    this.breadcrumbsState.set(crumbs);
  }
}

// 在元件中使用
@Component({...})
export class BlueprintDetailComponent implements OnInit {
  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit() {
    this.breadcrumbService.setBreadcrumbs([
      { label: '首頁', url: '/dashboard' },
      { label: '藍圖', url: '/blueprints' },
      { label: this.blueprint().name, url: '' }
    ]);
  }
}
```

### 3. 頁面標題管理

```typescript
// src/app/core/services/title.service.ts
@Injectable({ providedIn: 'root' })
export class TitleService {
  private title = inject(Title);

  setTitle(pageTitle: string) {
    this.title.setTitle(`${pageTitle} - ng-alain-github`);
  }
}

// 在路由配置中使用
{
  path: 'blueprints',
  loadComponent: () => import('./blueprints/blueprint-list.component')
    .then(m => m.BlueprintListComponent),
  data: { title: '藍圖管理' }
}

// 在 app.component.ts 監聽路由變化
@Component({...})
export class AppComponent {
  private router = inject(Router);
  private titleService = inject(TitleService);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.getActivatedRoute(this.router.routerState.root);
      const title = route.snapshot.data['title'];
      if (title) {
        this.titleService.setTitle(title);
      }
    });
  }

  private getActivatedRoute(route: ActivatedRoute): ActivatedRoute {
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
}
```

### 4. 路由錯誤處理

```typescript
// src/app/app.config.ts
import { provideRouter, withNavigationErrorHandler } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        console.error('Navigation error:', error);
        // 發送錯誤到監控服務
        Sentry.captureException(error);
      })
    )
  ]
};
```

### 5. 路由測試

```typescript
// blueprint-detail.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('BlueprintDetailComponent', () => {
  let component: BlueprintDetailComponent;
  let fixture: ComponentFixture<BlueprintDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueprintDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '123']])),
            data: of({ blueprint: mockBlueprint })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BlueprintDetailComponent);
    component = fixture.componentInstance;
  });

  it('should load blueprint from route data', () => {
    fixture.detectChanges();
    expect(component.blueprint()).toEqual(mockBlueprint);
  });
});
```

- --

## 路由結構範例

```text
├── /dashboard              # 儀表板
├── /auth
│   ├── /login             # 登入
│   ├── /register          # 註冊
│   └── /forgot-password   # 忘記密碼
├── /blueprints            # 藍圖管理
│   ├── /                  # 列表
│   ├── /create            # 建立
│   ├── /:id               # 詳情
│   ├── /:id/edit          # 編輯
│   └── /:id/branches      # 分支管理
├── /tasks                 # 任務管理
│   ├── /                  # 列表
│   ├── /:id               # 詳情
│   └── /:id/edit          # 編輯
├── /quality               # 品質管理
│   ├── /checks            # 品質檢查
│   └── /inspections       # 驗收檢查
├── /settings              # 設定
│   ├── /profile           # 個人資料
│   ├── /team              # 團隊設定
│   └── /preferences       # 偏好設定
└── /exception             # 錯誤頁面
    ├── /403               # 無權限
    ├── /404               # 找不到頁面
    └── /500               # 伺服器錯誤
```

- --

## 相關文檔

- [開發作業指引](./specs/00-development-guidelines.md)
- [前端狀態管理指南](./59-前端狀態管理指南.md)
- [測試指南](./38-測試指南.md)

- --

**維護者**：開發團隊
**最後更新**：2025-11-16
**下次審查**：2026-02-16
