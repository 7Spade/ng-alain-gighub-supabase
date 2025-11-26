---
description: 'Angular-specific coding standards and best practices for ng-alain with Supabase'
applyTo: '**/*.ts, **/*.html, **/*.scss, **/*.css, **/*.less'
---

# Angular Development Instructions

Instructions for generating high-quality Angular 20 code with ng-alain framework, ng-zorro-antd components, and Supabase backend integration.

## Project Context

| Setting | Value |
|---------|-------|
| Angular Version | 20.3.x |
| TypeScript Version | 5.9.x |
| UI Framework | ng-zorro-antd 20.3.x |
| Business Components | @delon/* 20.1.x |
| Backend | Supabase 2.84.x |
| Styling | Less preprocessor |
| Unit Testing | Karma + Jasmine |
| E2E Testing | Playwright |

## Development Standards

### Architecture

- **Standalone Components**: Use standalone components by default (Angular 20)
- **Lazy Loading**: Implement lazy loading for feature routes
- **Dependency Injection**: Use `inject()` function for DI
- **Component Structure**: Separate smart (container) and presentational components
- **Vertical Slices**: Organize features as self-contained modules in `src/app/features/`

### TypeScript Standards

```typescript
// tsconfig.json settings (enforced)
{
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noImplicitReturns": true,
  "target": "ES2022",
  "module": "ES2022"
}
```

- Enable strict mode compliance
- Define clear interfaces and types
- Use type guards and union types
- Implement proper error handling

### Component Design

```typescript
import { Component, inject, signal, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [/* required imports */],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ExampleComponent {
  // Dependency injection
  private readonly service = inject(MyService);
  
  // Signal-based inputs (Angular 20)
  readonly title = input<string>();
  readonly data = input.required<Data[]>();
  
  // Signal-based outputs
  readonly itemSelected = output<Item>();
  
  // Internal state with signals
  readonly loading = signal(false);
  readonly filteredItems = computed(() => 
    this.data().filter(item => item.active)
  );
}
```

### Template Patterns

```html
<!-- New control flow syntax (Angular 17+) -->
@if (loading()) {
  <nz-spin nzSimple />
} @else {
  @for (item of items(); track item.id) {
    <app-item [data]="item" (selected)="onSelect($event)" />
  } @empty {
    <nz-empty nzNotFoundContent="No items found" />
  }
}

<!-- Conditional rendering -->
@switch (status()) {
  @case ('loading') { <nz-spin /> }
  @case ('error') { <nz-alert nzType="error" [nzMessage]="error()" /> }
  @case ('success') { <div>Content</div> }
}

<!-- Deferred loading -->
@defer (on viewport) {
  <app-heavy-component />
} @placeholder {
  <nz-skeleton />
}
```

### Styling

- **Preprocessor**: Use Less (project convention)
- **Encapsulation**: Default ViewEncapsulation.Emulated
- **Theming**: Follow ng-alain theming guidelines
- **Responsive**: Use ng-zorro-antd grid system

```less
// Component styles
:host {
  display: block;
}

.container {
  padding: @padding-md;
  
  @media (max-width: @screen-sm) {
    padding: @padding-sm;
  }
}
```

### State Management

```typescript
// Use Angular Signals for reactive state
@Injectable({ providedIn: 'root' })
export class DataService {
  // Private writable signal
  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  
  // Public readonly signals
  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  
  // Computed signals
  readonly activeItems = computed(() => 
    this._items().filter(item => item.isActive)
  );
  
  // Effects for side effects
  constructor() {
    effect(() => {
      console.log('Items changed:', this._items().length);
    });
  }
}
```

### Data Fetching with Supabase

```typescript
import { inject } from '@angular/core';
import { SupabaseService } from '@core';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly supabase = inject(SupabaseService);
  private readonly _users = signal<User[]>([]);
  
  readonly users = this._users.asReadonly();

  async loadUsers(): Promise<void> {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('users')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading users:', error);
      throw error;
    }
    
    this._users.set(data ?? []);
  }
  
  async createUser(user: CreateUserDto): Promise<User> {
    const client = this.supabase.getClient();
    
    const { data, error } = await client
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    
    this._users.update(users => [...users, data]);
    return data;
  }
}
```

### @delon Component Usage

#### Simple Table (ST)
```typescript
import { STColumn, STModule } from '@delon/abc/st';

@Component({
  imports: [STModule],
  template: `
    <st [data]="users()" [columns]="columns" [loading]="loading()">
    </st>
  `
})
export class UserListComponent {
  columns: STColumn[] = [
    { title: 'Name', index: 'name' },
    { title: 'Email', index: 'email' },
    { title: 'Created', index: 'created_at', type: 'date' },
    {
      title: 'Actions',
      buttons: [
        { text: 'Edit', click: (item) => this.edit(item) },
        { text: 'Delete', type: 'del', click: (item) => this.delete(item) }
      ]
    }
  ];
}
```

#### Dynamic Forms (SF)
```typescript
import { SFModule, SFSchema } from '@delon/form';

@Component({
  imports: [SFModule],
  template: `
    <sf [schema]="schema" (formSubmit)="onSubmit($event)"></sf>
  `
})
export class UserFormComponent {
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: 'Name', minLength: 2 },
      email: { type: 'string', title: 'Email', format: 'email' },
      role: {
        type: 'string',
        title: 'Role',
        enum: ['admin', 'user', 'guest'],
        default: 'user'
      }
    },
    required: ['name', 'email']
  };
}
```

### Security

```typescript
// Authentication with @delon/auth
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  
  setToken(token: string): void {
    this.tokenService.set({ token });
  }
  
  getToken(): string | null {
    return this.tokenService.get()?.token ?? null;
  }
  
  logout(): void {
    this.tokenService.clear();
  }
}

// Authorization with @delon/acl
import { ACLService } from '@delon/acl';

@Component({
  template: `
    @if (acl.can('admin')) {
      <button nz-button>Admin Action</button>
    }
  `
})
export class AdminComponent {
  readonly acl = inject(ACLService);
}
```

### Performance Optimization

1. **OnPush Change Detection**: Use for all components
2. **Track Functions**: Use in @for loops
3. **Lazy Loading**: Load features on demand
4. **Signal-based State**: Avoid unnecessary re-renders

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }
  `
})
export class ListComponent {}
```

### Testing

#### Unit Tests
```typescript
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClientTesting(),
        UserService
      ]
    });
    service = TestBed.inject(UserService);
  });

  it('should load users', async () => {
    await service.loadUsers();
    expect(service.users().length).toBeGreaterThan(0);
  });
});
```

#### Component Tests
```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should display users', () => {
    fixture.componentRef.setInput('users', [
      { id: '1', name: 'Test User' }
    ]);
    fixture.detectChanges();
    
    const items = fixture.nativeElement.querySelectorAll('.user-item');
    expect(items.length).toBe(1);
  });
});
```

## Import Organization

Follow this order (enforced by ESLint):

```typescript
// 1. External imports (Angular, RxJS, etc.)
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

// 2. Third-party libraries (ng-zorro-antd)
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

// 3. @delon libraries
import { STModule } from '@delon/abc/st';
import { SFModule } from '@delon/form';

// 4. Application imports with path aliases
import { SupabaseService } from '@core';
import { SharedModule } from '@shared';

// 5. Relative imports
import { UserService } from './user.service';
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Component | `name.component.ts` | `user-list.component.ts` |
| Service | `name.service.ts` | `user.service.ts` |
| Guard | `name.guard.ts` | `auth.guard.ts` |
| Pipe | `name.pipe.ts` | `date-format.pipe.ts` |
| Directive | `name.directive.ts` | `highlight.directive.ts` |
| Interface/Type | `name.types.ts` | `user.types.ts` |
| Test | `name.spec.ts` | `user.service.spec.ts` |

## Key Guidelines Summary

1. ✅ Use standalone components (Angular 20 default)
2. ✅ Use `inject()` function for dependency injection
3. ✅ Use Angular Signals for state management
4. ✅ Use new control flow syntax (@if, @for, @switch)
5. ✅ Use OnPush change detection strategy
6. ✅ Use ng-zorro-antd components for UI
7. ✅ Use @delon components for business logic
8. ✅ Use SupabaseService for database operations
9. ✅ Follow ESLint import ordering rules
10. ✅ Write tests with Jasmine/Karma and Playwright
