# Blueprint Container Module

## Overview

Blueprint Container (藍圖容器) is a logical container system for data isolation and context sharing with complete CRUD functionality. It follows the vertical architecture pattern and Angular Enterprise Development Guidelines.

## Purpose

- **Data Isolation (隔離資料)**: Separate data spaces for different blueprints
- **Context Provision (提供 Context)**: Shared context for all modules within a blueprint
- **Modular Structure**: Support for multiple sub-modules (tasks, files, etc.)
- **CRUD Operations**: Full create, read, update, delete functionality for blueprints and tasks

## Structure

```
/routes/blueprint/
├── blueprint-container.component.ts    # Main container component
├── blueprint-container.component.html
├── blueprint-container.component.less
├── routes.ts                           # Route configuration with CRUD routes
├── directives/                         # Blueprint-specific directives
│   ├── draggable-zone.directive.ts     # Drag and drop functionality
│   └── contextmenu.directive.ts        # Right-click context menu
├── pipes/                              # Blueprint-specific pipes
│   └── task-status.pipe.ts             # Task status display transformation
├── store/                              # RxJS-based state management
│   ├── blueprint.state.ts              # State definitions
│   ├── blueprint.actions.ts            # Action definitions
│   └── blueprint.store.ts              # Store implementation
├── create-blueprint/                   # Create blueprint CRUD
├── update-blueprint/                   # Update blueprint CRUD
├── delete-blueprint/                   # Delete blueprint CRUD
├── task/                               # Task module
│   ├── task-list.component.ts
│   ├── create-task/                    # Create task CRUD
│   ├── update-task/                    # Update task CRUD
│   └── delete-task/                    # Delete task CRUD
└── README.md
```

## Architecture Layers

Following `docs/00-順序.md` standards:

1. **Types Layer** (`src/app/core/infra/types/`)
   - `blueprint.types.ts` - Blueprint type definitions
   
2. **Repository Layer** (`src/app/core/infra/repositories/`)
   - `blueprint.repository.ts` - Data access layer
   
3. **Models Layer** (`src/app/shared/models/`)
   - `blueprint.models.ts` - Business models
   
4. **Service Layer** (`src/app/shared/services/`)
   - `blueprint/blueprint.service.ts` - Business logic
   - `blueprint/workspace.service.ts` - Workspace management
   
5. **Facade Layer** (`src/app/core/facades/`)
   - `blueprint.facade.ts` - Unified interface
   
6. **Component Layer** (`src/app/routes/blueprint/`)
   - `blueprint-container.component.ts` - Container component
   - `task/task-list.component.ts` - Task module component

## Current Modules

### Task Module

Task module with unlimited depth hierarchy support:

- **Dual View Modes**: Tree view and table view
- **Features**:
  - Status tracking (pending, in_progress, completed, cancelled)
  - Level display (L0, L1, L2, L3+)
  - Progress calculation from leaf nodes
  - Assignee management
  - Area and tag categorization
  - Search and filter

## Integration with Context Switcher

The blueprint container is designed to integrate with the organization context switcher:

- **Current State**: Placeholder implementation
- **Future Integration**: Will receive context from organization switcher
- **Data Isolation**: Each blueprint maintains its own data context

## Routes

- `/blueprint` - Blueprint container (main page)
- `/blueprint/task` - Task module

## Development Guidelines

1. **Keep it Minimal**: Only implement skeleton structure for future expansion
2. **Follow Standards**: Adhere to `docs/00-順序.md` architecture
3. **Vertical Slicing**: Each module is self-contained
4. **Context Aware**: Designed for context switcher integration
5. **Extensible**: Easy to add new modules

## Future Modules

Planned modules to be added:

- File management module
- Settings module
- Collaboration module
- Automation module

## Notes

- All data layers (Types → Repositories → Models → Services → Facades) are already implemented
- This is a skeleton implementation for easy expansion
- Focus on structural correctness rather than complete functionality
- Designed for seamless integration with organization context switcher


---

## CRUD Components

### Blueprint CRUD

#### Create Blueprint (`create-blueprint/`)
- **Route**: `/blueprint/create`
- **Features**: Dynamic form using @delon/form, category/visibility selection, tag management
- **Form Fields**: name, description, category, visibility, tags

#### Update Blueprint (`update-blueprint/`)
- **Route**: `/blueprint/update/:id`
- **Features**: Pre-fills existing data, partial updates, real-time validation

#### Delete Blueprint (`delete-blueprint/`)
- **Route**: `/blueprint/delete/:id`
- **Features**: Confirmation modal, displays metadata before deletion

### Task CRUD

#### Create Task (`task/create-task/`)
- **Route**: `/blueprint/task/create?workspaceId=<id>`
- **Features**: Status/priority selection, area/tag management, due date picker
- **Form Fields**: name, description, status, priority, area, tags, dueDate

#### Update Task (`task/update-task/`)
- **Route**: `/blueprint/task/update/:id`
- **Features**: Edit all task properties, status and priority management

#### Delete Task (`task/delete-task/`)
- **Route**: `/blueprint/task/delete/:id`
- **Features**: Shows hierarchy level, progress metrics, warns about child tasks

## Directives

### DraggableZoneDirective
```html
<div appDraggableZone 
     [dragEnabled]="true"
     (dragStart)="onDragStart($event)"
     (dragMove)="onDragMove($event)"
     (dragEnd)="onDragEnd($event)">
  Draggable content
</div>
```

### ContextMenuDirective
```html
<div appContextMenu 
     [contextMenuEnabled]="true"
     [contextMenuData]="item"
     (contextMenu)="onContextMenu($event)">
  Right-click me
</div>
```

## Pipes

### TaskStatusPipe
```typescript
{{ task.status | taskStatus }}
<!-- Outputs: 待處理, 進行中, 已完成, or 已取消 -->
```

## State Management (RxJS Store)

```typescript
// Inject store
private readonly blueprintStore = inject(BlueprintStore);

// Subscribe to state
this.blueprintStore.blueprints$.subscribe(blueprints => {
  console.log('Blueprints:', blueprints);
});

// Dispatch actions
this.blueprintStore.dispatch({
  type: BlueprintActionType.LOAD_BLUEPRINTS
});
```

## Form Schema Examples

### Blueprint Form
```typescript
schema: SFSchema = {
  properties: {
    name: { type: 'string', title: '藍圖名稱', maxLength: 100 },
    description: { type: 'string', title: '描述', maxLength: 500 },
    category: { 
      type: 'string', 
      enum: ['software_development', 'marketing', 'sales', 'hr', 'operations', 'custom']
    }
  },
  required: ['name', 'description', 'category']
};
```

## Best Practices

1. **Minimal Code**: Components only call facade methods
2. **Type Safety**: Full TypeScript strict mode compliance
3. **Modern Angular**: Use Angular 20+ control flow (@if, @for)
4. **UI/UX**: Use @delon/form and ng-zorro-antd components
5. **Performance**: Lazy loading for all routes

## Testing Checklist

- [ ] Create blueprint with valid data
- [ ] Update blueprint with changes
- [ ] Delete blueprint with confirmation
- [ ] Create task with valid data
- [ ] Update task status and priority
- [ ] Delete task with confirmation
- [ ] Test form validations
- [ ] Test error handling

## Build & Lint

```bash
# Build
yarn build

# Lint
yarn lint

# Start dev server
yarn start
```
