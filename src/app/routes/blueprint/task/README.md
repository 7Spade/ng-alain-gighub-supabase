# Task Module Component

## Overview

Task module component within the Blueprint Container, providing dual-view task management with unlimited depth hierarchy.

## Features

### Dual View Modes

1. **Tree View**
   - Hierarchical display of tasks
   - Visual parent-child relationships
   - Expandable/collapsible nodes
   - Level indicators (L0, L1, L2, L3+)

2. **Table View**
   - Flat list with indentation
   - Full task details in columns
   - Sortable and filterable
   - Pagination support

### Task Properties Displayed

- **Status**: pending, in_progress, completed, cancelled
- **Level**: L0, L1, L2, L3+ (depth indicator)
- **Name**: Task title
- **Progress**: Calculated from leaf nodes (completedCount / totalCount)
- **Completed Count**: Number of completed child tasks
- **Total Count**: Total number of child tasks
- **Assignees**: User/team/organization assignments
- **Area**: Categorization by area
- **Tags**: Multiple tag support

## Implementation

### Component Structure

```typescript
TaskListComponent
├── View Mode Toggle (tree/table)
├── Statistics Summary
├── Search and Filter
├── Tree View (placeholder for full implementation)
└── Table View (full implementation)
```

### State Management

Using Angular Signals with TaskFacade:

- `tasks`: All tasks signal
- `loading`: Loading state
- `error`: Error state
- `statistics`: Task statistics
- `rootTasks`: L0 level tasks

### Integration

- **TaskFacade**: Provides unified task management API
- **TaskService**: Business logic layer
- **TaskRepository**: Data access layer

## Architecture Compliance

Following `docs/00-順序.md` Component layer standards:

✅ Uses Standalone Components
✅ Imports via SHARED_IMPORTS
✅ Injects services via inject()
✅ Uses ReadonlySignals from Facade
✅ Lazy loaded routing

## Future Enhancements

1. **Tree View**: Full tree control implementation with NzTreeViewModule
2. **Drag & Drop**: Reorder tasks
3. **Bulk Operations**: Multi-select and batch actions
4. **Advanced Filters**: By status, priority, assignee, etc.
5. **Real-time Updates**: WebSocket integration
6. **Offline Support**: PWA capabilities

## Usage

Access via route: `/blueprint/task`

The component automatically loads tasks when initialized (placeholder - needs workspace context).

## Development Notes

- **Skeleton Implementation**: Basic structure ready for expansion
- **Context Integration**: Designed to receive workspace ID from context
- **Extensible**: Easy to add new features without breaking existing structure
- **Performance**: Computed signals for efficient rendering

