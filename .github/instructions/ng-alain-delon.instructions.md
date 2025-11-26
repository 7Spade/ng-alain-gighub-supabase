---
description: 'ng-alain and @delon component usage patterns and best practices'
applyTo: '**/*.ts, **/*.html'
---

# ng-alain & @delon Components Instructions

Guidelines for using ng-alain framework and @delon component libraries effectively.

## @delon Package Overview

| Package | Purpose | Common Use Cases |
|---------|---------|------------------|
| @delon/abc | Business components | ST, SV, SE, SG, PageHeader |
| @delon/acl | Access Control | Permission guards, role-based UI |
| @delon/auth | Authentication | JWT tokens, OAuth, guards |
| @delon/cache | Caching | Memory/LocalStorage caching |
| @delon/chart | Charts | G2 chart wrappers |
| @delon/form | Dynamic forms | JSON Schema forms |
| @delon/mock | Mock data | Development mocking |
| @delon/theme | Theming | Layout, i18n, settings |
| @delon/util | Utilities | Array, format, lazy load |

## Simple Table (ST) Component

The `st` component is a powerful table component with sorting, filtering, pagination, and more.

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { STColumn, STModule, STChange } from '@delon/abc/st';

@Component({
  standalone: true,
  imports: [STModule],
  template: `
    <st #st 
        [data]="url" 
        [columns]="columns"
        [req]="req"
        [res]="res"
        [page]="page"
        (change)="onChange($event)">
    </st>
  `
})
export class UserListComponent {
  url = '/api/users';
  
  req = {
    method: 'POST',
    allInBody: true,
    lazyLoad: true
  };
  
  res = {
    reName: { total: 'total', list: 'items' }
  };
  
  page = {
    front: false, // Server-side pagination
    show: true,
    showSize: true,
    pageSizes: [10, 20, 50]
  };
  
  columns: STColumn[] = [
    { title: '#', type: 'no', width: 50 },
    { title: 'Name', index: 'name', sort: true },
    { title: 'Email', index: 'email' },
    { 
      title: 'Status', 
      index: 'status',
      type: 'tag',
      tag: {
        active: { text: 'Active', color: 'green' },
        inactive: { text: 'Inactive', color: 'red' }
      }
    },
    { 
      title: 'Created', 
      index: 'createdAt', 
      type: 'date',
      dateFormat: 'yyyy-MM-dd HH:mm'
    },
    {
      title: 'Actions',
      buttons: [
        { text: 'View', click: (item) => this.view(item) },
        { 
          text: 'Edit', 
          click: (item) => this.edit(item),
          iif: (item) => item.canEdit 
        },
        { 
          text: 'Delete', 
          type: 'del',
          pop: { title: 'Confirm delete?' },
          click: (item) => this.delete(item)
        }
      ]
    }
  ];
  
  onChange(event: STChange): void {
    if (event.type === 'click') {
      console.log('Row clicked:', event.click?.item);
    }
    if (event.type === 'pi' || event.type === 'ps') {
      console.log('Page changed:', event.pi, event.ps);
    }
  }
  
  view(item: any): void { /* ... */ }
  edit(item: any): void { /* ... */ }
  delete(item: any): void { /* ... */ }
}
```

### With Local Data

```typescript
import { STColumn, STData } from '@delon/abc/st';

@Component({
  template: `
    <st [data]="users()" [columns]="columns" [loading]="loading()">
    </st>
  `
})
export class UserListComponent {
  readonly facade = inject(UserFacade);
  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  
  columns: STColumn[] = [
    { title: 'Name', index: 'name', filter: { type: 'keyword' } },
    { title: 'Email', index: 'email' },
    { title: 'Role', index: 'role', filter: { 
      menus: [
        { text: 'Admin', value: 'admin' },
        { text: 'User', value: 'user' }
      ],
      fn: (filter, record) => record.role === filter.value
    }}
  ];
}
```

### Column Types

```typescript
const columns: STColumn[] = [
  // Number column with formatting
  { title: 'Amount', index: 'amount', type: 'number', numberDigits: '1.2-2' },
  
  // Currency
  { title: 'Price', index: 'price', type: 'currency' },
  
  // Date with format
  { title: 'Date', index: 'date', type: 'date', dateFormat: 'yyyy-MM-dd' },
  
  // Link
  { title: 'Name', index: 'name', type: 'link', click: (item) => this.view(item) },
  
  // Image
  { title: 'Avatar', index: 'avatar', type: 'img', width: 80 },
  
  // Badge
  { 
    title: 'Status', 
    index: 'status', 
    type: 'badge',
    badge: {
      1: { text: 'Success', color: 'success' },
      0: { text: 'Error', color: 'error' }
    }
  },
  
  // Checkbox
  { title: '', type: 'checkbox', index: 'checked' },
  
  // Radio
  { title: '', type: 'radio', index: 'checked' },
  
  // Widget (custom component)
  { title: 'Custom', type: 'widget', widget: { type: 'custom-widget' } }
];
```

## View Component (SV)

The `sv` component displays read-only data in a structured format.

```typescript
import { SVModule } from '@delon/abc/sv';

@Component({
  imports: [SVModule],
  template: `
    <sv-container col="2" labelWidth="120">
      <sv label="Name">{{ user().name }}</sv>
      <sv label="Email">{{ user().email }}</sv>
      <sv label="Status">
        <nz-tag [nzColor]="user().active ? 'green' : 'red'">
          {{ user().active ? 'Active' : 'Inactive' }}
        </nz-tag>
      </sv>
      <sv label="Created">{{ user().createdAt | date:'medium' }}</sv>
      <sv label="Description" col="2">{{ user().description }}</sv>
    </sv-container>
  `
})
export class UserDetailComponent {
  readonly user = input.required<User>();
}
```

## Edit Component (SE)

The `se` component provides consistent form field layouts.

```typescript
import { SEModule } from '@delon/abc/se';

@Component({
  imports: [SEModule, ReactiveFormsModule, NzInputModule, NzSelectModule],
  template: `
    <form nz-form [formGroup]="form" se-container col="2" labelWidth="120">
      <se label="Name" required error="Name is required">
        <input nz-input formControlName="name" />
      </se>
      <se label="Email" required error="Valid email required">
        <input nz-input formControlName="email" />
      </se>
      <se label="Role">
        <nz-select formControlName="role">
          <nz-option nzValue="admin" nzLabel="Admin"></nz-option>
          <nz-option nzValue="user" nzLabel="User"></nz-option>
        </nz-select>
      </se>
      <se label="Description" col="2">
        <textarea nz-input formControlName="description" rows="4"></textarea>
      </se>
    </form>
  `
})
export class UserFormComponent {
  form = inject(FormBuilder).group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user'],
    description: ['']
  });
}
```

## Dynamic Form (SF)

The `sf` component generates forms from JSON Schema.

```typescript
import { SFModule, SFSchema, SFUISchema } from '@delon/form';

@Component({
  imports: [SFModule],
  template: `
    <sf [schema]="schema" 
        [ui]="ui" 
        [formData]="formData()"
        (formSubmit)="onSubmit($event)"
        (formError)="onError($event)">
    </sf>
  `
})
export class DynamicFormComponent {
  readonly formData = input<any>();
  
  schema: SFSchema = {
    properties: {
      name: { 
        type: 'string', 
        title: 'Name',
        minLength: 2,
        maxLength: 50
      },
      email: { 
        type: 'string', 
        title: 'Email',
        format: 'email'
      },
      age: { 
        type: 'integer', 
        title: 'Age',
        minimum: 18,
        maximum: 120
      },
      role: {
        type: 'string',
        title: 'Role',
        enum: ['admin', 'user', 'guest'],
        default: 'user'
      },
      tags: {
        type: 'array',
        title: 'Tags',
        items: { type: 'string' }
      },
      birthday: {
        type: 'string',
        title: 'Birthday',
        format: 'date'
      },
      active: {
        type: 'boolean',
        title: 'Active',
        default: true
      },
      address: {
        type: 'object',
        title: 'Address',
        properties: {
          street: { type: 'string', title: 'Street' },
          city: { type: 'string', title: 'City' },
          zip: { type: 'string', title: 'ZIP' }
        }
      }
    },
    required: ['name', 'email']
  };
  
  ui: SFUISchema = {
    '*': { spanLabelFixed: 120, grid: { span: 12 } },
    $name: { widget: 'string', placeholder: 'Enter name' },
    $email: { widget: 'string', placeholder: 'Enter email' },
    $role: { widget: 'select' },
    $tags: { widget: 'tag' },
    $birthday: { widget: 'date' },
    $active: { widget: 'checkbox' },
    $address: { grid: { span: 24 } }
  };
  
  onSubmit(value: any): void {
    console.log('Form submitted:', value);
  }
  
  onError(errors: any[]): void {
    console.log('Form errors:', errors);
  }
}
```

## Page Header

```typescript
import { PageHeaderModule } from '@delon/abc/page-header';

@Component({
  imports: [PageHeaderModule, NzButtonModule],
  template: `
    <page-header [title]="'User Management'" [breadcrumb]="breadcrumb">
      <ng-template #breadcrumb>
        <nz-breadcrumb>
          <nz-breadcrumb-item>Home</nz-breadcrumb-item>
          <nz-breadcrumb-item>Users</nz-breadcrumb-item>
        </nz-breadcrumb>
      </ng-template>
      
      <ng-template #extra>
        <button nz-button nzType="primary" (click)="create()">
          <i nz-icon nzType="plus"></i>
          Add User
        </button>
      </ng-template>
      
      <ng-template #content>
        <nz-alert nzType="info" nzMessage="Manage your users here"></nz-alert>
      </ng-template>
    </page-header>
  `
})
export class UserPageComponent {
  create(): void { /* ... */ }
}
```

## Authentication (@delon/auth)

### Configuration

```typescript
// app.config.ts
import { provideAuth, withJWT } from '@delon/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(withJWT({
      store_key: 'ng-alain-token',
      token_send_key: 'Authorization',
      token_send_template: 'Bearer ${token}',
      login_url: '/passport/login',
      ignores: [/\/login/, /\/register/, /\/assets\//]
    }))
  ]
};
```

### Token Service

```typescript
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  
  setToken(token: string, expiresIn?: number): void {
    this.tokenService.set({
      token,
      expired: expiresIn ? Date.now() + expiresIn * 1000 : undefined
    });
  }
  
  getToken(): string | null {
    return this.tokenService.get()?.token ?? null;
  }
  
  isAuthenticated(): boolean {
    return !this.tokenService.get()?.isExpired?.() ?? false;
  }
  
  logout(): void {
    this.tokenService.clear();
  }
}
```

### Auth Guard

```typescript
import { JWTGuard } from '@delon/auth';

// In routes
export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [JWTGuard],
    loadComponent: () => import('./dashboard.component')
  }
];
```

## Access Control (@delon/acl)

### Configuration

```typescript
import { provideACL } from '@delon/acl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideACL({
      roles: ['admin', 'user', 'guest'],
      abilities: ['user.create', 'user.edit', 'user.delete']
    })
  ]
};
```

### ACL Service

```typescript
import { ACLService } from '@delon/acl';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly acl = inject(ACLService);
  
  setUserPermissions(user: User): void {
    // Set role
    this.acl.setRole([user.role]);
    
    // Set abilities
    this.acl.setAbility(user.permissions);
  }
  
  canEditUser(): boolean {
    return this.acl.can('user.edit');
  }
  
  hasAdminRole(): boolean {
    return this.acl.canRole('admin');
  }
}
```

### ACL in Templates

```typescript
import { ACLModule } from '@delon/acl';

@Component({
  imports: [ACLModule, NzButtonModule],
  template: `
    <!-- Role-based -->
    <button nz-button *aclIf="'admin'">Admin Only</button>
    
    <!-- Ability-based -->
    <button nz-button *aclIf="{ ability: ['user.edit'] }">Edit</button>
    
    <!-- Combined -->
    <button nz-button *aclIf="{ role: ['admin'], ability: ['user.delete'], mode: 'allOf' }">
      Delete
    </button>
    
    <!-- With else template -->
    <ng-container *aclIf="'admin'; else noAccess">
      <button nz-button nzType="primary">Admin Action</button>
    </ng-container>
    <ng-template #noAccess>
      <span>No access</span>
    </ng-template>
  `
})
export class UserActionsComponent {}
```

### ACL Route Guard

```typescript
import { ACLGuard } from '@delon/acl';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [ACLGuard],
    data: { guard: { role: ['admin'] } },
    loadComponent: () => import('./admin.component')
  },
  {
    path: 'users/create',
    canActivate: [ACLGuard],
    data: { guard: { ability: ['user.create'] } },
    loadComponent: () => import('./user-create.component')
  }
];
```

## Caching (@delon/cache)

### Basic Usage

```typescript
import { CacheService } from '@delon/cache';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly cache = inject(CacheService);
  
  // Set with TTL (seconds)
  cacheData(key: string, data: any, ttl: number = 300): void {
    this.cache.set(key, data, { expire: ttl });
  }
  
  // Get cached data
  getCached<T>(key: string): T | null {
    return this.cache.get<T>(key);
  }
  
  // Get or fetch
  async getOrFetch<T>(key: string, fetcher: () => Promise<T>, ttl: number = 300): Promise<T> {
    const cached = this.cache.get<T>(key);
    if (cached) return cached;
    
    const data = await fetcher();
    this.cache.set(key, data, { expire: ttl });
    return data;
  }
  
  // Clear
  clearCache(key?: string): void {
    if (key) {
      this.cache.remove(key);
    } else {
      this.cache.clear();
    }
  }
}
```

## Theme & Layout (@delon/theme)

### Settings Service

```typescript
import { SettingsService, User, App } from '@delon/theme';

@Injectable({ providedIn: 'root' })
export class AppService {
  private readonly settings = inject(SettingsService);
  
  setUser(user: User): void {
    this.settings.setUser(user);
  }
  
  getUser(): User {
    return this.settings.user;
  }
  
  setApp(app: App): void {
    this.settings.setApp(app);
  }
}
```

### Title Service

```typescript
import { TitleService } from '@delon/theme';

@Component({})
export class MyComponent {
  private readonly titleService = inject(TitleService);
  
  ngOnInit(): void {
    this.titleService.setTitle('Page Title');
  }
}
```

### Menu Service

```typescript
import { MenuService, Menu } from '@delon/theme';

@Injectable({ providedIn: 'root' })
export class AppMenuService {
  private readonly menuService = inject(MenuService);
  
  setMenus(menus: Menu[]): void {
    this.menuService.add(menus);
  }
  
  getMenus(): Menu[] {
    return this.menuService.menus;
  }
}
```

## Best Practices

### 1. Use @delon Components Over Custom

```typescript
// ✅ Good - Use ST for tables
<st [data]="users()" [columns]="columns"></st>

// ❌ Avoid - Custom table implementation
<nz-table [nzData]="users()">
  <!-- Manual column definitions -->
</nz-table>
```

### 2. Leverage SF for Forms

```typescript
// ✅ Good - Dynamic form
<sf [schema]="schema" (formSubmit)="onSubmit($event)"></sf>

// ❌ Avoid - Manual form for simple cases
<form [formGroup]="form">
  <!-- Manual field bindings -->
</form>
```

### 3. Consistent Layouts

```typescript
// ✅ Good - Use SV for display
<sv-container col="2">
  <sv label="Name">{{ name }}</sv>
</sv-container>

// ✅ Good - Use SE for forms
<form se-container col="2">
  <se label="Name"><input /></se>
</form>
```

### 4. ACL for Permissions

```typescript
// ✅ Good - Declarative ACL
<button *aclIf="'admin'">Admin Only</button>

// ❌ Avoid - Manual checks
@if (user.role === 'admin') {
  <button>Admin Only</button>
}
```

### 5. Cache Expensive Operations

```typescript
// ✅ Good - Cache API responses
async getConfig(): Promise<Config> {
  return this.cache.tryGet('config', async () => {
    return await this.api.getConfig();
  }, { expire: 3600 });
}
```
