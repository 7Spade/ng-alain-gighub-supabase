---
description: '@delon component usage guide for ng-alain projects - essential patterns for GitHub Copilot agent'
applyTo: '**/*.ts, **/*.html'
---

# @delon Component Usage Guide

Essential patterns and API usage for @delon components in ng-alain projects. This guide enables GitHub Copilot to generate correct @delon component code.

## Core Principle

> **CRITICAL**: Always use `[input]="templateRef"` binding for template inputs, NOT content projection.

## Package Overview

| Package | Purpose | Key Components |
|---------|---------|----------------|
| `@delon/abc` | Business components | ST, SV, SE, PageHeader, ReuseTab |
| `@delon/form` | Dynamic forms | sf-component (JSON Schema based) |
| `@delon/auth` | Authentication | TokenService, DA_SERVICE_TOKEN |
| `@delon/acl` | Access control | ACLService, ACLDirective |
| `@delon/cache` | Caching | CacheService |
| `@delon/chart` | Charts | G2Bar, G2Pie, ChartECharts |
| `@delon/theme` | Theme/Layout | SettingsService, MenuService, I18nPipe |
| `@delon/util` | Utilities | ArrayService, DateTimeService |

---

## PageHeader Component

### ⚠️ CRITICAL: Action Template Binding

The `action` input requires explicit `[action]="templateRef"` binding. Content projection does NOT work.

```typescript
// ❌ WRONG - action template NOT rendered
@Component({
  template: `
    <page-header [title]="'Page Title'">
      <ng-template #action>
        <button nz-button>Button</button>
      </ng-template>
    </page-header>
  `
})

// ✅ CORRECT - explicit [action] binding
@Component({
  template: `
    <page-header [title]="'Page Title'" [action]="actionTpl"></page-header>
    <ng-template #actionTpl>
      <button nz-button nzType="primary">新增</button>
    </ng-template>
  `
})
```

### PageHeader API

```typescript
interface PageHeaderInputs {
  title: string | TemplateRef<void>;           // Page title
  titleSuffix?: TemplateRef<void>;             // Title suffix template
  action?: TemplateRef<void>;                  // Action buttons area
  content?: TemplateRef<void>;                 // Content area
  breadcrumb?: TemplateRef<void>;              // Custom breadcrumb
  extra?: TemplateRef<void>;                   // Extra content
  logo?: TemplateRef<void>;                    // Logo template
  tab?: TemplateRef<void>;                     // Tab content
  home?: string;                               // Home breadcrumb text
  homeLink?: string;                           // Home link
  homeI18n?: string;                           // Home i18n key
  autoBreadcrumb?: boolean;                    // Auto generate breadcrumb (default: true)
  autoTitle?: boolean;                         // Auto set document title (default: true)
  syncTitle?: boolean;                         // Sync with route data (default: true)
  loading?: boolean;                           // Loading state
  wide?: boolean;                              // Wide mode
}
```

### PageHeader Examples

```typescript
// Full featured page header
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <page-header 
      [title]="pageTitle()" 
      [action]="actionTpl"
      [content]="contentTpl"
      [loading]="loading()">
    </page-header>
    
    <ng-template #actionTpl>
      @if (canCreate()) {
        <button nz-button nzType="primary" (click)="create()">
          <span nz-icon nzType="plus"></span>
          新增
        </button>
      }
    </ng-template>
    
    <ng-template #contentTpl>
      <nz-alert 
        nzType="info" 
        [nzMessage]="'當前上下文：' + contextName()">
      </nz-alert>
    </ng-template>
  `
})
export class ListComponent {
  pageTitle = signal('我的列表');
  loading = signal(false);
  canCreate = signal(true);
  contextName = signal('個人帳戶');
}
```

---

## ST (Smart Table) Component

### Basic Usage

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <st 
      [data]="dataUrl" 
      [columns]="columns"
      [req]="req"
      [res]="res"
      [page]="page"
      (change)="onChange($event)">
    </st>
  `
})
export class TableComponent {
  dataUrl = '/api/items';
  
  columns: STColumn[] = [
    { title: '編號', index: 'id', type: 'number', width: 80 },
    { title: '名稱', index: 'name' },
    { title: '狀態', index: 'status', type: 'tag', tag: {
      active: { text: '啟用', color: 'green' },
      inactive: { text: '停用', color: 'default' }
    }},
    { title: '創建時間', index: 'createdAt', type: 'date', dateFormat: 'yyyy-MM-dd' },
    { 
      title: '操作', 
      buttons: [
        { text: '編輯', click: (item) => this.edit(item) },
        { text: '刪除', type: 'del', click: (item) => this.delete(item) }
      ]
    }
  ];
  
  req: STReq = {
    method: 'POST',
    allInBody: true,
    lazyLoad: true
  };
  
  res: STRes = {
    reName: { list: 'data', total: 'total' }
  };
  
  page: STPage = {
    front: false,  // Backend pagination
    show: true,
    showSize: true,
    pageSizes: [10, 20, 50]
  };
  
  onChange(e: STChange) {
    if (e.type === 'click' && e.click?.item) {
      console.log('Row clicked:', e.click.item);
    }
  }
}
```

### ST with Local Data

```typescript
@Component({
  template: `
    <st [data]="items()" [columns]="columns" [page]="{ front: true }"></st>
  `
})
export class LocalTableComponent {
  items = signal<Item[]>([]);
  
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: 'Name', index: 'name' },
    { title: 'Actions', buttons: [
      { 
        text: 'View', 
        icon: 'eye',
        click: (record) => this.view(record)
      }
    ]}
  ];
}
```

---

## SV (Simple View) Component

For key-value display in detail pages.

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <sv-container [col]="3" size="small">
      <sv label="名稱">{{ item().name }}</sv>
      <sv label="狀態">
        <nz-tag [nzColor]="item().status === 'active' ? 'green' : 'default'">
          {{ item().status }}
        </nz-tag>
      </sv>
      <sv label="創建時間">{{ item().createdAt | date:'yyyy-MM-dd HH:mm' }}</sv>
      <sv label="描述" [col]="3">{{ item().description }}</sv>
    </sv-container>
  `
})
export class DetailComponent {
  item = signal({ name: '', status: '', createdAt: new Date(), description: '' });
}
```

---

## SE (Simple Edit) Component

For form layouts with consistent styling.

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <form nz-form [formGroup]="form" se-container [col]="2" labelWidth="120">
      <se label="名稱" required>
        <input nz-input formControlName="name" placeholder="請輸入名稱" />
      </se>
      <se label="類型" required>
        <nz-select formControlName="type" nzPlaceHolder="請選擇類型">
          @for (opt of typeOptions; track opt.value) {
            <nz-option [nzValue]="opt.value" [nzLabel]="opt.label"></nz-option>
          }
        </nz-select>
      </se>
      <se label="描述" [col]="2">
        <textarea nz-input formControlName="description" [nzAutosize]="{ minRows: 3 }"></textarea>
      </se>
      <se [col]="2">
        <button nz-button nzType="primary" (click)="submit()" [disabled]="!form.valid">
          保存
        </button>
        <button nz-button (click)="cancel()">取消</button>
      </se>
    </form>
  `
})
export class EditFormComponent {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    type: ['', Validators.required],
    description: ['']
  });
  
  typeOptions = [
    { value: 'type1', label: '類型一' },
    { value: 'type2', label: '類型二' }
  ];
}
```

---

## SF (Schema Form) Component

Dynamic form based on JSON Schema.

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  template: `
    <sf [schema]="schema" [ui]="ui" [formData]="formData" (formSubmit)="onSubmit($event)"></sf>
  `
})
export class SchemaFormComponent {
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名稱', maxLength: 100 },
      email: { type: 'string', title: 'Email', format: 'email' },
      age: { type: 'integer', title: '年齡', minimum: 0, maximum: 150 },
      status: { 
        type: 'string', 
        title: '狀態',
        enum: ['active', 'inactive'],
        default: 'active'
      }
    },
    required: ['name', 'email']
  };
  
  ui: SFUISchema = {
    '*': { spanLabel: 6, spanControl: 18 },
    $name: { placeholder: '請輸入名稱' },
    $status: { widget: 'select' }
  };
  
  formData = { name: '', email: '', status: 'active' };
  
  onSubmit(value: any) {
    console.log('Form submitted:', value);
  }
}
```

---

## ReuseTab Component

Route reuse/tab caching.

```typescript
// In layout component
@Component({
  template: `
    <reuse-tab 
      #reuseTab
      [mode]="ReuseTabMatchMode.Menu"
      [allowClose]="true"
      [tabType]="'card'"
      (change)="onTabChange($event)"
      (close)="onTabClose($event)">
    </reuse-tab>
    <router-outlet></router-outlet>
  `
})
export class LayoutComponent {
  ReuseTabMatchMode = ReuseTabMatchMode;
  
  onTabChange(item: ReuseItem) {
    console.log('Tab changed:', item);
  }
  
  onTabClose(item: ReuseItem) {
    console.log('Tab closed:', item);
  }
}
```

---

## Auth Service Usage

### Token Management

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(DA_SERVICE_TOKEN);
  
  // Get current token
  getToken(): JWTTokenModel | null {
    return this.tokenService.get<JWTTokenModel>(JWTTokenModel);
  }
  
  // Set token after login
  setToken(token: string, user: any) {
    this.tokenService.set({
      token,
      user,
      expired: Date.now() + 3600 * 1000 // 1 hour
    });
  }
  
  // Clear token on logout
  clearToken() {
    this.tokenService.clear();
  }
  
  // Check if authenticated
  isAuthenticated(): boolean {
    return this.tokenService.get()?.token ? true : false;
  }
}
```

---

## ACL Service Usage

```typescript
@Component({
  template: `
    <!-- Directive usage -->
    <button nz-button *aclIf="'admin'">Admin Only</button>
    
    <!-- With ability -->
    <div *aclIf="{ ability: ['canEdit'] }">Can Edit</div>
    
    <!-- Service usage -->
    @if (canAccess()) {
      <nz-card>Protected Content</nz-card>
    }
  `
})
export class ProtectedComponent {
  private aclService = inject(ACLService);
  
  canAccess = computed(() => this.aclService.canAbility('canView'));
  
  // Set user roles/abilities
  setUserPermissions(roles: string[], abilities: string[]) {
    this.aclService.setRole(roles);
    this.aclService.setAbility(abilities);
  }
}
```

---

## Theme Services

### Menu Service

```typescript
@Injectable({ providedIn: 'root' })
export class MenuManager {
  private menuService = inject(MenuService);
  
  // Set menu items
  setMenu(menus: Menu[]) {
    this.menuService.add(menus);
  }
  
  // Get current menu
  getMenus(): Menu[] {
    return this.menuService.menus;
  }
  
  // Set menu by URL
  setActiveByUrl(url: string) {
    this.menuService.openedByUrl(url);
  }
}
```

### Settings Service

```typescript
@Injectable({ providedIn: 'root' })
export class AppSettings {
  private settingsService = inject(SettingsService);
  
  // Get current user
  get user(): User {
    return this.settingsService.user;
  }
  
  // Set user
  setUser(user: User) {
    this.settingsService.setUser(user);
  }
  
  // Get app settings
  get app(): App {
    return this.settingsService.app;
  }
}
```

---

## Common Patterns

### Template Ref Binding Pattern

For any @delon component with template inputs:

```typescript
// Pattern for [action], [content], [extra], [tab], etc.
@Component({
  template: `
    <component-name 
      [templateInput]="myTemplate">
    </component-name>
    
    <ng-template #myTemplate>
      <!-- Template content here -->
    </ng-template>
  `
})
```

### Signal-Based Component Pattern

```typescript
@Component({
  standalone: true,
  imports: [SHARED_IMPORTS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent {
  // State signals
  loading = signal(false);
  items = signal<Item[]>([]);
  error = signal<string | null>(null);
  
  // Computed
  hasItems = computed(() => this.items().length > 0);
  
  // Load data
  async loadData() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const data = await this.service.getData();
      this.items.set(data);
    } catch (e) {
      this.error.set('載入失敗');
    } finally {
      this.loading.set(false);
    }
  }
}
```

---

## Quick Reference

| Component | Import | Key Input | Template Binding |
|-----------|--------|-----------|------------------|
| `page-header` | `PageHeaderModule` | `[action]` | `[action]="tpl"` |
| `st` | `STModule` | `[columns]` | N/A |
| `sv` | `SVModule` | `label` | N/A |
| `se` | `SEModule` | `label` | N/A |
| `sf` | `DelonFormModule` | `[schema]` | N/A |
| `reuse-tab` | `ReuseTabModule` | `[mode]` | N/A |

---

## Debugging Tips

1. **Template not rendering**: Check if using `[input]="templateRef"` not content projection
2. **ST data not loading**: Check `req`/`res` config matches API response format
3. **Form validation not working**: Check `Validators` imported and `required` attribute set
4. **ACL not working**: Verify roles/abilities are set via `ACLService`
5. **Menu not updating**: Call `menuService.resume()` after setting menu

---

**Version**: @delon ^20.1.0
**Last Updated**: 2025-11-26
