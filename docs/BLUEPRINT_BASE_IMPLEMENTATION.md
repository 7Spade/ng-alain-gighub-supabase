# Blueprint Container Base Structure

## Overview

This implementation provides the foundational architecture for the **Blueprint Container** (邏輯容器) system following the enterprise standards defined in `docs/00-順序.md` and `docs/BLUEPRINT_CONTAINER_PLANNING.md`.

The Blueprint Container system enables users to create reusable workspace templates (blueprints) that can be instantiated into workspaces. It supports multi-tenant isolation and is designed for seamless integration with the Account Context Switcher.

## Architecture

### 5-Layer Architecture (垂直架構)

```
┌─────────────────────────────────────────────────────────┐
│  Step 6: Components Layer (To be added)                 │
│         ↓                                                │
│  Step 5: Facades Layer (Unified API)                    │
│         ↓                                                │
│  Step 4: Services Layer (Business Logic + Signals)      │
│         ↓                                                │
│  Step 3: Models Layer (Business Types)                  │
│         ↓                                                │
│  Step 2: Repositories Layer (Data Access)               │
│         ↓                                                │
│  Step 1: Types Layer (Type Definitions)                 │
│         ↓                                                │
│  Supabase (Database + RLS)                              │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
src/app/
├── core/
│   ├── facades/
│   │   ├── blueprint.facade.ts          # Step 5: Unified Blueprint/Workspace API
│   │   └── index.ts
│   └── infra/
│       ├── repositories/
│       │   ├── blueprint.repository.ts  # Step 2: Blueprint data access
│       │   ├── workspace.repository.ts  # Step 2: Workspace data access
│       │   └── index.ts
│       └── types/
│           ├── blueprint.types.ts       # Step 1: Blueprint type definitions
│           ├── workspace.types.ts       # Step 1: Workspace type definitions
│           └── index.ts
└── shared/
    ├── models/
    │   ├── blueprint.models.ts          # Step 3: Blueprint business models
    │   ├── workspace.models.ts          # Step 3: Workspace business models
    │   └── index.ts
    └── services/
        ├── blueprint/
        │   ├── blueprint.service.ts     # Step 4: Blueprint business logic
        │   └── index.ts
        └── workspace/
            ├── workspace.service.ts     # Step 4: Workspace business logic
            └── index.ts
```

## Layer Descriptions

### Step 1: Types Layer (類型定義層)

**Location:** `src/app/core/infra/types/`

**Purpose:** Pure TypeScript type definitions from database schema

**Files:**
- `blueprint.types.ts` - Blueprint, BlueprintStructure, BlueprintInsert, BlueprintUpdate
- `workspace.types.ts` - Workspace, WorkspaceMember, WorkspaceInsert, WorkspaceUpdate

**Key Types:**
```typescript
// Blueprint visibility levels
type BlueprintVisibility = 'private' | 'organization' | 'team' | 'public';

// Blueprint status
type BlueprintStatus = 'draft' | 'published' | 'archived';

// Owner/Tenant types (Account Context integration)
type OwnerType = 'user' | 'organization' | 'team';
type TenantType = 'user' | 'organization' | 'team';
```

**Characteristics:**
- Direct mapping from Supabase database types
- snake_case → camelCase conversion handled by BaseRepository
- Type guards for runtime validation
- No business logic

### Step 2: Repositories Layer (數據訪問層)

**Location:** `src/app/core/infra/repositories/`

**Purpose:** Data access with automatic camelCase conversion

**Files:**
- `blueprint.repository.ts` - CRUD + query methods for blueprints
- `workspace.repository.ts` - CRUD + query methods for workspaces

**Key Features:**
- Extends `BaseRepository<TEntity, TInsert, TUpdate>`
- Automatic snake_case ↔ camelCase conversion
- Type-safe Supabase operations
- RxJS Observable support

**Example Methods:**
```typescript
// BlueprintRepository
findByOwner(ownerId: string): Observable<Blueprint[]>
findByCategory(category: string): Observable<Blueprint[]>
findPublicBlueprints(): Observable<Blueprint[]>
search(searchTerm: string): Observable<Blueprint[]>

// WorkspaceRepository
findByTenant(tenantId: string): Observable<Workspace[]>
findByBlueprint(blueprintId: string): Observable<Workspace[]>
findActiveTenantWorkspaces(tenantId: string): Observable<Workspace[]>
```

### Step 3: Models Layer (業務模型層)

**Location:** `src/app/shared/models/`

**Purpose:** Business models with enums and helper types

**Files:**
- `blueprint.models.ts` - Business enums, summary types, request interfaces
- `workspace.models.ts` - Business enums, summary types, request interfaces

**Key Features:**
- Business enums for type-safe code
- Summary types for list views
- Request interfaces for API calls
- Statistics types for dashboards
- Filter options for queries

**Example Types:**
```typescript
// Business enums
enum BlueprintStatusEnum {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

// Summary for lists
interface BlueprintSummary {
  id: string;
  name: string;
  category: BlueprintCategory;
  usageCount: number;
  rating?: number;
  tags: string[];
}

// Statistics for dashboards
interface BlueprintStatistics {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
}
```

### Step 4: Services Layer (業務邏輯層)

**Location:** `src/app/shared/services/`

**Purpose:** Business logic with Angular Signals state management

**Files:**
- `blueprint/blueprint.service.ts` - Blueprint CRUD and state management
- `workspace/workspace.service.ts` - Workspace CRUD and state management

**Key Features:**
- **Angular Signals** for reactive state management
- **ReadonlySignal** exposure to components
- **Computed signals** for derived state
- Error and loading state management
- Async/await with firstValueFrom

**State Management Pattern:**
```typescript
@Injectable({ providedIn: 'root' })
export class BlueprintService {
  // Private state (writable)
  private blueprintsState = signal<BlueprintModel[]>([]);
  private loadingState = signal<boolean>(false);
  private errorState = signal<string | null>(null);

  // Public state (readonly)
  readonly blueprints = this.blueprintsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  // Computed signals
  readonly publishedBlueprints = computed(() => 
    this.blueprints().filter(b => b.status === 'published')
  );

  readonly statistics = computed<BlueprintStatistics>(() => ({
    totalCount: this.blueprints().length,
    publishedCount: this.publishedBlueprints().length,
    // ...
  }));
}
```

**Key Methods:**
- `loadBlueprintsByOwner(ownerId)` - Load blueprints for owner
- `loadPublicBlueprints()` - Load marketplace blueprints
- `getBlueprintById(id)` - Get single blueprint
- `createBlueprint(request)` - Create new blueprint
- `updateBlueprint(id, request)` - Update blueprint
- `deleteBlueprint(id)` - Delete blueprint
- `publishBlueprint(id)` - Publish blueprint
- `archiveBlueprint(id)` - Archive blueprint
- `searchBlueprints(term)` - Search blueprints

### Step 5: Facades Layer (門面層)

**Location:** `src/app/core/facades/`

**Purpose:** Unified API coordinating multiple services

**Files:**
- `blueprint.facade.ts` - Coordinates BlueprintService + WorkspaceService

**Key Features:**
- Exposes all service state through facade
- Coordinates multiple services
- Provides unified methods
- Ready for Account Context integration
- Single entry point for components

**Usage Pattern:**
```typescript
@Component({...})
export class BlueprintGalleryComponent {
  private facade = inject(BlueprintFacade);

  // Access state via facade
  readonly blueprints = this.facade.blueprints;
  readonly loading = this.facade.blueprintLoading;
  readonly statistics = this.facade.blueprintStatistics;

  async ngOnInit() {
    await this.facade.loadMarketplaceBlueprints();
  }

  async createBlueprint(data: CreateBlueprintRequest) {
    await this.facade.createBlueprint(data);
  }
}
```

## Key Design Principles

### 1. Minimal & Extensible ✅

The implementation provides only the essential base structure:
- Blueprint and Workspace core types
- Basic CRUD operations
- Extensible `BlueprintStructure` for future modules
- Easy to add Task Module, File Module, etc.

### 2. Context Switcher Ready ✅

Designed for Account Context integration:
- `ownerId` + `ownerType` for blueprint ownership
- `tenantId` + `tenantType` for workspace tenancy
- Multi-tenant isolation via RLS policies (to be added)

### 3. Vertical Architecture ✅

Self-contained layers following docs/00-順序.md:
- Clear dependency flow: Types → Repos → Models → Services → Facades
- Each layer has single responsibility
- No circular dependencies

### 4. Single Responsibility ✅

Each layer has distinct responsibility:
- **Types**: Definitions only
- **Repositories**: Data access only
- **Models**: Business types only
- **Services**: Business logic + state management
- **Facades**: API coordination

### 5. Enterprise Standards ✅

Follows ng-alain and Angular best practices:
- TypeScript strict mode
- Angular Signals for reactivity
- Injectable services with `providedIn: 'root'`
- Error handling and loading states
- ReadonlySignal exposure

## Usage Examples

### Creating a Blueprint

```typescript
import { inject } from '@angular/core';
import { BlueprintFacade } from '@core';
import { CreateBlueprintRequest, BlueprintCategoryEnum } from '@shared';

@Component({...})
export class CreateBlueprintComponent {
  private facade = inject(BlueprintFacade);

  async createBlueprint() {
    const request: CreateBlueprintRequest = {
      name: 'Software Project Blueprint',
      description: 'Template for software development projects',
      category: BlueprintCategoryEnum.SOFTWARE_DEVELOPMENT,
      ownerId: 'current-user-id',  // From Account Context
      ownerType: 'user',
      tags: ['software', 'agile', 'scrum']
    };

    const blueprint = await this.facade.createBlueprint(request);
    console.log('Created blueprint:', blueprint.id);
  }
}
```

### Instantiating a Workspace from Blueprint

```typescript
@Component({...})
export class BlueprintGalleryComponent {
  private facade = inject(BlueprintFacade);

  async instantiateWorkspace(blueprintId: string) {
    const workspace = await this.facade.instantiateWorkspace(
      blueprintId,
      'My Project Workspace',
      'current-user-id',  // From Account Context
      'user'
    );

    console.log('Created workspace:', workspace.id);
  }
}
```

### Loading Blueprints by Owner

```typescript
@Component({...})
export class MyBlueprintsComponent implements OnInit {
  private facade = inject(BlueprintFacade);

  readonly blueprints = this.facade.blueprints;
  readonly loading = this.facade.blueprintLoading;
  readonly statistics = this.facade.blueprintStatistics;

  async ngOnInit() {
    const ownerId = 'current-user-id';  // From Account Context
    await this.facade.loadOwnerBlueprints(ownerId);
  }
}
```

## Integration Points

### Account Context Switcher Integration (Future)

The Blueprint Container is designed for seamless integration with the Account Context Switcher:

```typescript
// Future integration example
@Component({...})
export class BlueprintGalleryComponent {
  private facade = inject(BlueprintFacade);
  private accountContext = inject(AccountContextService);

  async ngOnInit() {
    // Get active account context
    const context = this.accountContext.activeContext();

    // Load blueprints for active context
    await this.facade.loadOwnerBlueprints(context.account.id);
  }

  async createBlueprint(data: CreateBlueprintRequest) {
    const context = this.accountContext.activeContext();

    // Blueprint automatically owned by active context
    const request = {
      ...data,
      ownerId: context.account.id,
      ownerType: context.account.type
    };

    await this.facade.createBlueprint(request);
  }
}
```

### Task Module Integration (Future)

The extensible structure allows easy integration of the Task Module:

```typescript
// blueprints will include task templates in structure
interface BlueprintStructure {
  tasks?: TaskTemplate[];  // Task module integration
  folders?: FolderTemplate[];
  settings: WorkspaceSettings;
  automations?: AutomationRule[];
}

// When instantiating workspace, tasks are created
async instantiateWorkspace(blueprintId: string, ...) {
  const blueprint = await this.facade.getBlueprint(blueprintId);
  const workspace = await this.facade.createWorkspace(...);

  // Task module will instantiate tasks from blueprint.structure.tasks
  if (blueprint.structure.tasks) {
    await taskModule.instantiateTasks(workspace.id, blueprint.structure.tasks);
  }

  return workspace;
}
```

## Next Steps

### Step 6: Components Layer (To be implemented)

Create minimal UI components:
- `BlueprintGalleryComponent` - Browse blueprints
- `BlueprintEditorComponent` - Create/edit blueprints
- `WorkspaceListComponent` - List workspaces
- `WorkspaceCreatorComponent` - Create from blueprint

### Database Setup (Required)

Create Supabase migrations:
- `blueprints` table
- `workspaces` table
- `workspace_members` table
- RLS policies for multi-tenant isolation

### Testing (Required)

Add unit tests:
- Service layer tests (≥80% coverage)
- Facade layer tests (≥80% coverage)
- Repository layer tests (optional)

## Testing the Implementation

### Type Checking

```bash
npx tsc --noEmit
```

Expected result: No blueprint/workspace related errors

### Importing in Components

```typescript
// All exports available from @core and @shared
import { BlueprintFacade } from '@core';
import { 
  BlueprintModel, 
  WorkspaceModel,
  CreateBlueprintRequest,
  BlueprintStatusEnum 
} from '@shared';
```

## Documentation References

- [docs/00-順序.md](../../docs/00-順序.md) - Development order guide
- [docs/BLUEPRINT_CONTAINER_PLANNING.md](../../docs/BLUEPRINT_CONTAINER_PLANNING.md) - Blueprint Container design
- [docs/ACCOUNT_CONTEXT_SWITCHER_DESIGN.md](../../docs/ACCOUNT_CONTEXT_SWITCHER_DESIGN.md) - Account Context design
- [docs/BLUEPRINT_TASK_MODULE_DESIGN.md](../../docs/BLUEPRINT_TASK_MODULE_DESIGN.md) - Task Module design

## Summary

This implementation provides a **solid, extensible foundation** for the Blueprint Container system following enterprise standards:

- ✅ 5-layer vertical architecture
- ✅ Angular Signals for reactive state
- ✅ Type-safe with TypeScript strict mode
- ✅ Ready for Account Context integration
- ✅ Ready for Task Module integration
- ✅ Minimal code, maximum extensibility
- ✅ Single responsibility principle
- ✅ Enterprise best practices

The structure is designed to be **easy to understand, easy to extend, and easy to maintain**.
