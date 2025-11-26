---
description: 'Repository-specific instructions for ng-alain enterprise application'
applyTo: '**/*.ts, **/*.html, **/*.scss, **/*.css, **/*.less'
---

# GitHub Copilot Instructions

## Priority Guidelines

When generating code for this repository:

1. **Version Compatibility**: Always respect the exact versions of languages, frameworks, and libraries used in this project
2. **Context Files**: Prioritize patterns and standards defined in the `.github/copilot` and `.github/instructions` directories
3. **Codebase Patterns**: When context files don't provide specific guidance, scan the codebase for established patterns
4. **Architectural Consistency**: Maintain our layered architectural style with vertical slice features
5. **Code Quality**: Prioritize maintainability, performance, security, accessibility, and testability in all generated code

## Technology Version Detection

### Detected Versions (Do Not Exceed)

| Technology | Version | Configuration File |
|------------|---------|-------------------|
| Angular | 20.3.x | package.json |
| TypeScript | 5.9.x | package.json, tsconfig.json |
| ng-zorro-antd | 20.3.x | package.json |
| @delon/* | 20.1.x | package.json |
| @supabase/supabase-js | 2.84.x | package.json |
| RxJS | 7.8.x | package.json |
| Node.js | See .nvmrc | .nvmrc |
| Yarn | 4.9.x | package.json (packageManager) |

### Language Features
- **TypeScript**: Target ES2022, strict mode enabled
- **Angular**: Standalone components (default), Signals API, new control flow syntax
- **Module System**: ES2022 modules with bundler resolution

## Context Files

Prioritize the following files in `.github/` directories:

### Primary Context (`.github/copilot/`)
- **memory.jsonl**: Session memory and context

### Instructions (`.github/instructions/`)
- **angular.instructions.md**: Angular-specific patterns
- **typescript-5-es2022.instructions.md**: TypeScript standards
- **security-guidelines.md**: Security patterns
- **testing-guidelines.md**: Testing approaches
- **style-guide.md**: Code style standards

## Project Architecture

### Directory Structure
```
src/
├── app/
│   ├── core/           # Singleton services, guards, interceptors
│   │   ├── facades/    # Facade pattern for complex operations
│   │   ├── infra/      # Infrastructure (Supabase, repositories)
│   │   ├── services/   # Core application services
│   │   └── startup/    # App initialization
│   ├── features/       # Vertical slice feature modules
│   │   └── [feature]/  # Each feature is self-contained
│   ├── layout/         # Layout components
│   ├── routes/         # Route components and configurations
│   └── shared/         # Shared components, directives, pipes
├── assets/             # Static assets
├── environments/       # Environment configurations
└── styles/             # Global styles and theming
```

### Path Aliases (tsconfig.json)
```typescript
@shared   → src/app/shared/index
@core     → src/app/core/index
@features → src/app/features/index
@features/* → src/app/features/*
@env/*    → src/environments/*
@_mock    → _mock/index
```

## Code Quality Standards

### Maintainability
- Write self-documenting code with clear naming
- Follow established patterns for consistency
- Keep functions focused on single responsibilities
- Use JSDoc comments for public APIs

### Performance
- Use `OnPush` change detection strategy
- Implement lazy loading for feature routes
- Use Angular Signals for fine-grained reactivity
- Apply `trackBy` in `@for` loops

### Security
- Use `@delon/auth` for JWT authentication
- Use `@delon/acl` for authorization
- Sanitize user inputs using Angular's DomSanitizer
- Use parameterized queries via Supabase client

### Accessibility
- Follow WCAG 2.1 AA guidelines
- Use semantic HTML elements
- Add ARIA attributes where needed
- Ensure keyboard navigation support

### Testability
- Write unit tests with Jasmine/Karma
- Write E2E tests with Playwright
- Use `provideHttpClientTesting` for HTTP mocks
- Test signal-based state with Angular testing utilities

## Angular-Specific Guidelines

### Component Patterns
```typescript
// Use inject() function for DI (Angular 20 pattern)
private readonly router = inject(Router);
private readonly service = inject(MyService);

// Use signal-based inputs/outputs (Angular 20)
readonly myInput = input<string>();
readonly myOutput = output<Event>();

// Use Angular Signals for state
readonly data = signal<Data[]>([]);
readonly filteredData = computed(() => this.data().filter(...));
```

### Template Patterns
```html
<!-- Use new control flow syntax (Angular 17+) -->
@if (condition) {
  <div>Content</div>
} @else {
  <div>Alternative</div>
}

@for (item of items; track item.id) {
  <app-item [data]="item" />
}

<!-- Use ng-zorro-antd components -->
<nz-table [nzData]="data()">...</nz-table>
<nz-button nzType="primary">Button</nz-button>
```

### Service Patterns
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly supabase = inject(SupabaseService);
  
  // Use signals for reactive state
  private readonly _items = signal<Item[]>([]);
  readonly items = this._items.asReadonly();
  
  async loadItems(): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('items')
      .select('*');
    
    if (error) throw error;
    this._items.set(data);
  }
}
```

## @delon Component Usage

### Business Components (@delon/abc)
- `st` - Simple Table with rich features
- `sv` - View component for displaying data
- `se` - Edit component for forms
- `sg` - Grid layout component
- `page-header` - Page header with breadcrumb

### Form Generation (@delon/form)
- Use `sf` component for dynamic forms
- Define schemas with JSON Schema
- Use custom widgets when needed

### Authentication (@delon/auth)
- Use `JWTTokenModel` for JWT handling
- Implement `TokenService` for token management
- Use `@delon/auth` interceptors

### Caching (@delon/cache)
- Use `CacheService` for data caching
- Implement TTL-based cache expiration

## Supabase Integration

### Client Access
```typescript
// Always use SupabaseService for client access
private readonly supabase = inject(SupabaseService);
const client = this.supabase.getClient();
```

### Data Operations
```typescript
// Query with type safety
const { data, error } = await client
  .from('table_name')
  .select('*')
  .eq('column', value);

// Use typed database types
import { Database } from '@core/infra/types/database.types';
```

## Development Commands

| Command | Description |
|---------|-------------|
| `yarn start` | Start dev server |
| `yarn build` | Production build |
| `yarn lint` | Run all linters |
| `yarn lint:ts` | Lint TypeScript |
| `yarn lint:style` | Lint styles |
| `yarn test` | Run unit tests |
| `yarn test-coverage` | Test with coverage |
| `yarn e2e` | Run E2E tests |

## Import Organization

Follow this order (enforced by ESLint):
1. External imports (Angular, ng-zorro, etc.)
2. Internal imports (@delon, etc.)
3. Parent/sibling imports (@core, @shared, @features)
4. Relative imports

```typescript
// External
import { Component, inject, signal } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';

// Internal libraries
import { STModule } from '@delon/abc/st';

// Application imports
import { SupabaseService } from '@core';
import { SharedModule } from '@shared';
```

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Component | `feature.component.ts` | `user-list.component.ts` |
| Service | `feature.service.ts` | `auth.service.ts` |
| Guard | `feature.guard.ts` | `auth.guard.ts` |
| Pipe | `feature.pipe.ts` | `date-format.pipe.ts` |
| Directive | `feature.directive.ts` | `tooltip.directive.ts` |
| Interface | `feature.interface.ts` or `feature.types.ts` | `user.types.ts` |
| Module | `feature.module.ts` | `shared.module.ts` |

## Key Guidelines

1. **Follow Angular Style Guide** and ng-alain conventions
2. **Use Angular CLI** commands for scaffolding (`ng generate`)
3. **Document with JSDoc** comments for public APIs
4. **Ensure accessibility** compliance (WCAG 2.1)
5. **Use @delon components** when available instead of custom implementations
6. **Leverage ng-zorro-antd** components for consistent UI
7. **Use Angular Signals** for reactive state management
8. **Follow vertical slice** architecture for features
9. **Keep services stateless** or use signals for state
10. **Test critical paths** with appropriate coverage