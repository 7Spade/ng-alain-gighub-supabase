# Blueprint Container Module

## Overview

Blueprint Container (藍圖容器) is a logical container system for data isolation and context sharing. It follows the vertical architecture pattern for easy development.

## Purpose

- **Data Isolation (隔離資料)**: Separate data spaces for different blueprints
- **Context Provision (提供 Context)**: Shared context for all modules within a blueprint
- **Modular Structure**: Support for multiple sub-modules (tasks, files, etc.)

## Structure

```
/routes/blueprint/
├── blueprint-container.component.ts    # Main container component
├── blueprint-container.component.html
├── blueprint-container.component.less
├── routes.ts                           # Route configuration
├── task/                               # Task module
│   ├── task-list.component.ts
│   ├── task-list.component.html
│   └── task-list.component.less
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

