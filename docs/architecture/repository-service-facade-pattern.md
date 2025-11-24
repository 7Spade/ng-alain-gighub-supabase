# Repository/Service/Facade Architecture Pattern

## 📋 Overview

This document describes the three-layer architecture pattern implemented in the ng-alain-github-supabase project for managing data access and business logic.

## 🎯 Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                  Routes/Components                   │
│              (Presentation Layer)                    │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                    Facade Layer                      │
│         (Orchestration & Error Handling)            │
│                                                      │
│  • OrganizationFacade                               │
│  • TeamFacade                                        │
│  • UserFacade                                        │
│  • BotFacade                                         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Service Layer                      │
│             (Business Logic)                         │
│                                                      │
│  • OrganizationService                              │
│  • TeamService                                       │
│  • UserService                                       │
│  • BotService                                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                 Repository Layer                     │
│           (Data Access Logic)                        │
│                                                      │
│  • UserRepository                                   │
│  • OrganizationRepository                           │
│  • TeamRepository                                    │
│  • BotRepository                                     │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   Supabase Client                    │
│           (PostgreSQL Database)                      │
└─────────────────────────────────────────────────────┘
```

## 🏗️ Layer Responsibilities

### 1. Repository Layer (`src/app/core/repositories/`)

**Purpose**: Pure data access operations with no business logic

**Responsibilities**:
- Direct database queries (Supabase API calls)
- Type filtering by `account_type` column
- CRUD operations on database tables
- No business logic or error handling

**Example**:
```typescript
@Injectable({ providedIn: 'root' })
export class OrganizationRepository {
  private readonly supabase = inject(SupabaseClient);
  private readonly tableName = 'accounts';
  private readonly accountType = 'organization' as const;

  async findAll(): Promise<Account[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('type', this.accountType)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
```

**Key Characteristics**:
- ✅ Thin data access layer
- ✅ Type-specific filtering (organization, team, user, bot)
- ✅ No error handling (throws Supabase errors)
- ✅ No business logic
- ✅ Returns raw database entities

---

### 2. Service Layer (`src/app/core/services/`)

**Purpose**: Business logic and validation

**Responsibilities**:
- Transform Repository entities to Business Models
- Apply business rules and validation
- Coordinate multiple repository calls if needed
- Transform request DTOs to database entities

**Example**:
```typescript
@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly repository = inject(OrganizationRepository);

  async getOrganizations(): Promise<OrganizationBusinessModel[]> {
    const accounts = await this.repository.findAll();
    return accounts.map(account => this.toBusinessModel(account));
  }

  async createOrganization(
    userId: string,
    request: CreateOrganizationRequest
  ): Promise<OrganizationBusinessModel> {
    // Business validation
    if (!request.name || request.name.trim().length < 2) {
      throw new Error('Organization name must be at least 2 characters');
    }

    // Transform to database entity
    const entity: Partial<Account> = {
      type: 'organization',
      name: request.name,
      email: request.email,
      avatar: request.avatar,
      created_by: userId
    };

    const created = await this.repository.create(entity);
    return this.toBusinessModel(created);
  }

  private toBusinessModel(account: Account): OrganizationBusinessModel {
    return {
      ...account,
      displayName: (account as any).name || 'Unnamed Organization'
    };
  }
}
```

**Key Characteristics**:
- ✅ Contains business logic
- ✅ Validates business rules
- ✅ Transforms entities to business models
- ✅ No direct error handling (throws errors)
- ✅ No workspace context management

---

### 3. Facade Layer (`src/app/core/facades/`)

**Purpose**: Orchestration, error handling, and workspace management

**Responsibilities**:
- Call Service layer methods
- Centralized error handling and logging
- Reload workspace data after mutations
- Display user-friendly error messages
- Coordinate cross-cutting concerns

**Example**:
```typescript
@Injectable({ providedIn: 'root' })
export class OrganizationFacade extends BaseAccountCrudFacade {
  private readonly service = inject(OrganizationService);
  private readonly workspaceDataService = inject(WorkspaceDataService);
  private readonly messageService = inject(NzMessageService);
  private readonly errorHandler = inject(ErrorHandlerService);

  async createOrganization(
    request: CreateOrganizationRequest
  ): Promise<OrganizationBusinessModel> {
    try {
      const userId = await this.getCurrentUserId();
      const organization = await this.service.createOrganization(userId, request);
      
      // Reload workspace context
      await this.workspaceDataService.reload();
      
      this.messageService.success('組織創建成功！');
      return organization;
    } catch (error) {
      this.errorHandler.logError('OrganizationFacade', 'createOrganization', error);
      this.messageService.error('創建組織失敗，請稍後再試');
      throw error;
    }
  }
}
```

**Key Characteristics**:
- ✅ Error handling with user-friendly messages
- ✅ Workspace data reload after mutations
- ✅ Logging and monitoring
- ✅ No direct business logic
- ✅ Orchestrates Service layer calls

---

### 4. Routes/Components Layer (`src/app/routes/`)

**Purpose**: User interface and user interactions

**Responsibilities**:
- Render UI components
- Handle user input via forms
- Call Facade methods
- Display loading and error states
- Use FormUtils for validation

**Example**:
```typescript
@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: SHARED_IMPORTS
})
export class CreateOrganizationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly organizationFacade = inject(OrganizationFacade);
  private readonly modal = inject(NzModalRef);

  loading = false;
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]],
    avatar: ['']
  });

  async submit(): Promise<void> {
    // Use FormUtils for validation
    if (!FormUtils.validateFormNzStyle(this.form)) {
      return;
    }

    this.loading = true;
    try {
      // Call Facade (handles errors, workspace reload, messages)
      const request = FormUtils.trimFormValues(this.form.value);
      const organization = await this.organizationFacade.createOrganization(request);
      this.modal.close(organization);
    } catch (error) {
      // Facade already handled error display
    } finally {
      this.loading = false;
    }
  }
}
```

**Key Characteristics**:
- ✅ Uses Facade layer only (never Service or Repository)
- ✅ Uses FormUtils for validation
- ✅ Handles loading states
- ✅ No business logic
- ✅ Minimal error handling (Facade handles it)

---

## 📁 Five-Folder Separation

The architecture enforces strict separation across five folders:

```
src/app/
├── core/
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic layer
│   └── facades/          # Orchestration layer
├── routes/               # UI components
└── shared/               # Utilities (FormUtils, etc.)
```

**Key Rules**:
1. ❌ **Routes** cannot import from **Services** or **Repositories**
2. ❌ **Facades** cannot import from **Repositories**
3. ❌ **Services** cannot import from **Facades**
4. ✅ **Routes** can only import from **Facades**
5. ✅ **Facades** can only import from **Services**
6. ✅ **Services** can only import from **Repositories**

---

## 🔄 Data Flow Example

### Create Organization Flow

```
1. User clicks "Create" button
   ↓
2. CreateOrganizationComponent.submit()
   - Validates form with FormUtils.validateFormNzStyle()
   - Trims values with FormUtils.trimFormValues()
   ↓
3. OrganizationFacade.createOrganization()
   - Gets current user ID
   - Calls OrganizationService
   - Handles errors with ErrorHandlerService
   - Displays messages with NzMessageService
   - Reloads workspace with WorkspaceDataService.reload()
   ↓
4. OrganizationService.createOrganization()
   - Validates business rules
   - Transforms request to database entity
   - Calls OrganizationRepository.create()
   - Transforms result to business model
   ↓
5. OrganizationRepository.create()
   - Executes Supabase insert query
   - Filters by type='organization'
   - Returns raw Account entity
   ↓
6. Result flows back up the chain
   - Repository → Service (as business model)
   - Service → Facade (with error handling)
   - Facade → Component (with success message)
   - Component → User (modal closes, UI updates)
```

---

## 🛠️ Utility Classes

### FormUtils (`src/app/shared/utils/form.utils.ts`)

**Purpose**: Reduce code duplication in form validation

**Methods**:
- `validateForm(formGroup)`: Validates and marks controls as touched
- `validateFormNzStyle(formGroup)`: Validates and marks controls as dirty (ng-zorro style)
- `markFormGroupTouched(formGroup)`: Recursively marks all controls as touched
- `markFormGroupDirty(formGroup)`: Recursively marks invalid controls as dirty
- `trimFormValues(formValue)`: Trims all string values in form
- `resetForm(formGroup)`: Resets form and clears validation
- `getAllErrors(formGroup)`: Gets all errors as flat object
- `hasError(control, errorType?)`: Checks if control has error and is touched

**Usage in Components**:
```typescript
async submit(): Promise<void> {
  // Validate form (ng-zorro style)
  if (!FormUtils.validateFormNzStyle(this.form)) {
    return;
  }

  // Trim form values
  const request = FormUtils.trimFormValues(this.form.value);

  // Call Facade
  await this.facade.createEntity(request);
}
```

---

## 🎨 Design Patterns

### 1. Base CRUD Facade Pattern

All CRUD Facades extend `BaseAccountCrudFacade`:

```typescript
export abstract class BaseAccountCrudFacade {
  protected readonly authService = inject(AuthService);
  protected readonly workspaceDataService = inject(WorkspaceDataService);
  protected readonly messageService = inject(NzMessageService);
  protected readonly errorHandler = inject(ErrorHandlerService);

  protected async getCurrentUserId(): Promise<string> {
    const user = await this.authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  protected async reloadWorkspace(): Promise<void> {
    await this.workspaceDataService.reload();
  }
}
```

**Benefits**:
- ✅ Shared error handling logic
- ✅ Shared workspace reload logic
- ✅ Consistent user authentication
- ✅ Reduced code duplication

---

### 2. Business Model Pattern

Services transform database entities to business models:

```typescript
// Database Entity (from Repository)
interface Account {
  id: string;
  type: 'organization' | 'team' | 'user' | 'bot';
  name?: string;
  email?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

// Business Model (from Service)
interface OrganizationBusinessModel extends Account {
  displayName: string;      // Computed property
  memberCount?: number;      // Enriched data
  isOwner?: boolean;        // User-specific data
}
```

**Benefits**:
- ✅ Separation of database schema from business logic
- ✅ Enriched data for UI display
- ✅ Type-safe transformations
- ✅ Flexibility for schema changes

---

## 🔐 RLS (Row Level Security) Integration

The architecture integrates with Supabase RLS policies:

```sql
-- Organizations: Users can only see organizations they belong to
CREATE POLICY "Users can view their organizations"
ON accounts FOR SELECT
TO authenticated
USING (
  type = 'organization' AND
  id IN (
    SELECT organization_id 
    FROM organization_members 
    WHERE user_id = auth.uid()
  )
);

-- Teams: Users can only see teams in their organizations
CREATE POLICY "Users can view teams in their organizations"
ON accounts FOR SELECT
TO authenticated
USING (
  type = 'team' AND
  id IN (
    SELECT team_id 
    FROM team_members 
    WHERE user_id = auth.uid()
  )
);
```

**Key Points**:
- ✅ RLS policies enforce tenant isolation at database level
- ✅ Repository layer respects RLS policies automatically
- ✅ No RLS infinite recursion issues (fixed in Phase 4)
- ✅ Service layer doesn't need to implement tenant filtering

---

## 📊 Performance Considerations

### Caching Strategy

```typescript
@Injectable({ providedIn: 'root' })
export class WorkspaceContextFacade {
  private organizationsCache = signal<OrganizationBusinessModel[]>([]);
  private teamsCache = signal<TeamBusinessModel[]>([]);
  
  async loadWorkspaceData(): Promise<void> {
    // Load and cache organizations
    const orgs = await this.organizationService.getOrganizations();
    this.organizationsCache.set(orgs);
    
    // Load and cache teams
    const teams = await this.teamService.getTeams();
    this.teamsCache.set(teams);
  }
}
```

**Benefits**:
- ✅ Reduces database queries
- ✅ Improves UI responsiveness
- ✅ Angular signals for reactive updates
- ✅ Centralized cache management

---

## 🧪 Testing Strategy

### Repository Layer Tests

```typescript
describe('OrganizationRepository', () => {
  it('should filter by organization type', async () => {
    const organizations = await repository.findAll();
    
    expect(organizations).toBeDefined();
    expect(organizations.every(org => org.type === 'organization')).toBe(true);
  });
});
```

### Service Layer Tests

```typescript
describe('OrganizationService', () => {
  it('should transform account to business model', async () => {
    const organization = await service.getOrganizationById('123');
    
    expect(organization.displayName).toBeDefined();
    expect(organization.id).toBe('123');
  });
});
```

### Facade Layer Tests

```typescript
describe('OrganizationFacade', () => {
  it('should reload workspace after creation', async () => {
    const workspaceReloadSpy = jest.spyOn(workspaceDataService, 'reload');
    
    await facade.createOrganization({ name: 'Test Org' });
    
    expect(workspaceReloadSpy).toHaveBeenCalled();
  });
});
```

---

## 🎯 Best Practices

### 1. Component Best Practices

✅ **DO**:
- Use Facade layer for all data operations
- Use FormUtils for form validation
- Handle loading states with `loading` property
- Use Angular signals for reactive state
- Use `ChangeDetectionStrategy.OnPush`

❌ **DON'T**:
- Call Service layer directly from components
- Call Repository layer directly from components
- Implement business logic in components
- Handle detailed errors (Facade does this)

### 2. Facade Best Practices

✅ **DO**:
- Extend BaseAccountCrudFacade for CRUD operations
- Use ErrorHandlerService for error logging
- Use NzMessageService for user messages
- Reload workspace after mutations
- Catch and rethrow errors after handling

❌ **DON'T**:
- Implement business logic in Facades
- Call Repository layer directly
- Skip error logging
- Skip workspace reload

### 3. Service Best Practices

✅ **DO**:
- Implement business logic and validation
- Transform entities to business models
- Keep methods focused and single-purpose
- Throw errors for invalid states

❌ **DON'T**:
- Handle errors with user messages
- Access workspace context directly
- Implement data access logic (use Repository)

### 4. Repository Best Practices

✅ **DO**:
- Keep methods simple and focused
- Filter by `type` column for multi-tenant tables
- Throw Supabase errors directly
- Return raw database entities

❌ **DON'T**:
- Implement business logic
- Handle errors
- Transform entities to business models
- Access workspace or user context

---

## 📚 Additional Resources

- [Supabase Integration Guide](../SUPABASE_INTEGRATION.md)
- [RLS Infinite Recursion Fix](../RLS_INFINITE_RECURSION_FIX.md)
- [Multi-Tenant SaaS Core Design](../MULTI_TENANT_SAAS_CORE_DESIGN.md)
- [Development Getting Started](../development/getting-started.md)

---

## 🔄 Architecture Evolution

### Phase 1-4 Completion (60.5% - 23/38 tasks)
- ✅ Repository layer implementation
- ✅ Service layer implementation  
- ✅ Facade layer implementation
- ✅ RLS policies fixed

### Phase 5 Completion (Routes Simplification)
- ✅ FormUtils utility class created
- ✅ Components refactored to use FormUtils
- ✅ Code duplication reduced

### Phase 6 (Testing & Documentation)
- 🔄 Integration tests (Repository, Service, Facade)
- 🔄 E2E tests with RLS validation
- 🔄 Performance tests
- ✅ Architecture documentation (this document)
- 🔄 Development guide

---

**Last Updated**: 2025-11-24  
**Version**: 2.0  
**Status**: Active Development
