# Blueprint Task Module - Design Document

## Document Information

**Version:** 1.0  
**Date:** 2025-11-23  
**Status:** Design Phase  
**Authors:** AI Copilot Agent  
**Related Documents:**
- [Account Context Switcher Design](./ACCOUNT_CONTEXT_SWITCHER_DESIGN.md)
- [Blueprint Container Planning](./BLUEPRINT_CONTAINER_PLANNING.md)
- [Design Coordination Report](./DESIGN_COORDINATION_REPORT.md)
- [ng-alain Task Reference](https://github.com/7Spade/ng-alain) - Task model reference

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the architecture and design for a **Blueprint Task Module** - an enterprise-grade hierarchical task management system with unlimited tree depth, workflow states, dependencies, and template support. The module integrates seamlessly with the Blueprint Container system and Account Context Switcher to provide tenant-isolated task management.

### 1.2 What is the Task Module?

The **Task Module** provides:
- **Task Tree Structure**: Unlimited depth parent-child task relationships with drag-and-drop reordering
- **Enterprise Workflow**: 8-state workflow with 48-hour reversible staging mechanism
- **Dependencies**: Task blocking relationships with cycle detection
- **Templates**: Reusable task structures with variable placeholders
- **Audit Trail**: Complete history tracking for compliance
- **Multi-Assignment**: Tasks can be assigned to Users, Teams, Organizations, or Bots

### 1.3 Key Features

```
Task Tree (Unlimited Depth)
    ├── TASK-001 Parent Task
    │   ├── TASK-002 Child Task 1
    │   │   ├── TASK-003 Grandchild
    │   │   └── TASK-004 Grandchild
    │   └── TASK-005 Child Task 2
    └── TASK-006 Another Parent

Workflow States:
pending → assigned → in_progress → staging (48h) 
→ in_qa → in_inspection → completed / cancelled
```

### 1.4 Goals

- ✅ Hierarchical task tree with unlimited depth (parent → child → grandchild...)
- ✅ Enterprise 8-state workflow with quality gates
- ✅ Task dependencies with cycle detection
- ✅ Template system with variable substitution
- ✅ Multi-tenant isolation via RLS policies
- ✅ Integration with Blueprint Container (tasks belong to workspaces)
- ✅ Integration with Account Context (tenant-scoped visibility)
- ✅ Full audit trail for compliance
- ✅ Bulk operations (multi-task updates, status changes)

### 1.5 Non-Goals

- ❌ Time tracking or billing (future enhancement)
- ❌ Advanced project management (Gantt charts, resource allocation)
- ❌ External integrations (GitHub, Jira) in initial phase
- ❌ Real-time collaborative editing (future enhancement)

---

## 2. Architecture Overview

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Angular Application                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ TaskTree     │  │ TaskForm     │  │ TaskList / Kanban    │  │
│  │ Component    │  │ Component    │  │ Component            │  │
│  │ (ng-zorro)   │  │ (@delon/form)│  │ (@delon/abc)         │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────────────┘  │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│         ┌──────────────────▼──────────────────┐                 │
│         │     Task Service Layer              │                 │
│         │  ┌────────────┐  ┌────────────────┐ │                 │
│         │  │ TaskService│  │ TaskTreeService│ │                 │
│         │  └────────────┘  └────────────────┘ │                 │
│         │  ┌───────────────────────────────┐  │                 │
│         │  │  TaskTemplateService          │  │                 │
│         │  └───────────────────────────────┘  │                 │
│         └───────────────────┬──────────────────┘                 │
│                             │                                    │
│         ┌───────────────────▼──────────────────┐                 │
│         │  Account Context Service             │                 │
│         │  (Tenant Context + Permissions)      │                 │
│         └───────────────────┬──────────────────┘                 │
│                             │                                    │
│         ┌───────────────────▼──────────────────┐                 │
│         │      Supabase Client (RLS)           │                 │
│         └───────────────────┬──────────────────┘                 │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                    Supabase Backend                               │
├───────────────────────────────────────────────────────────────────┤
│  ┌────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ tasks  │  │ task_deps    │  │ task_assigns │  │ task_temps │ │
│  │ (tree) │  │ (blocking)   │  │ (multi)      │  │ (reusable) │ │
│  └────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
│                                                                   │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────────┐   │
│  │ task_staging │  │ task_history  │  │ task_comments       │   │
│  │ (48h queue)  │  │ (audit trail) │  │ (discussions)       │   │
│  └──────────────┘  └───────────────┘  └─────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │               Row Level Security (RLS)                   │    │
│  │         (Tenant isolation via workspace_id)              │    │
│  └──────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

### 2.2 Key Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **TaskTreeComponent** | Tree visualization, drag-drop | ng-zorro nz-tree |
| **TaskFormComponent** | Task creation/editing | @delon/form (Schema Form) |
| **TaskListComponent** | Table view with filters | @delon/abc (Simple Table) |
| **TaskKanbanComponent** | Kanban board by status | ngx-drag-drop |
| **TaskService** | CRUD operations, validation | Injectable (Supabase) |
| **TaskTreeService** | Tree operations, path calc | Injectable (Recursive) |
| **TaskTemplateService** | Template CRUD, instantiation | Injectable (Supabase) |
| **RLS Policies** | Multi-tenant data isolation | PostgreSQL RLS |

---

## 3. TypeScript Type Definitions

**Location:** `src/app/core/types/task.types.ts`

### 3.1 Core Types

```typescript
/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Task workflow states (8 states)
 */
export type TaskStatus = 
  | 'pending'       // Initial state, not yet assigned
  | 'assigned'      // Assigned to user(s), not started
  | 'in_progress'   // Actively being worked on
  | 'staging'       // Submitted for review (48h reversible)
  | 'in_qa'         // Under QA review
  | 'in_inspection' // Under final inspection/approval
  | 'completed'     // Finished and approved
  | 'cancelled';    // Cancelled/abandoned

/**
 * Assignment type (polymorphic)
 */
export type AssigneeType = 'user' | 'team' | 'organization' | 'bot';

/**
 * Task entity with tree structure
 */
export interface Task {
  // Identity
  id: string;
  workspace_id: string;
  
  // Tree structure
  parent_id: string | null;  // null for root tasks
  position: number;          // Sibling ordering (0-based)
  path: string;              // Materialized path: '1.2.3'
  depth: number;             // Tree depth (0 for root)
  
  // Basic info
  title: string;             // Task title (max 200 chars)
  description: string | null; // Rich text description
  status: TaskStatus;
  priority: TaskPriority;
  
  // Assignment (see task_assignments table for details)
  assignee_ids: string[];    // Array of assignee IDs
  assignee_types: AssigneeType[]; // Parallel array of types
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  started_at: Date | null;   // When moved to in_progress
  completed_at: Date | null; // When moved to completed
  due_date: Date | null;
  
  // Metadata
  tags: string[];            // Flexible tagging
  contractor_fields: Record<string, unknown> | null; // Bot-specific data (JSONB)
  
  // Relations
  dependency_count: number;  // How many tasks block this one
  blocked_count: number;     // How many tasks this blocks
  comment_count: number;
  child_count: number;       // Direct children count
}

/**
 * Task node for tree visualization
 */
export interface TaskNode {
  key: string;               // task.id
  title: string;
  isLeaf: boolean;           // No children
  expanded: boolean;
  children: TaskNode[];
  
  // Metadata for rendering
  task: Task;
  level: number;             // Display depth
  icon: string;              // Icon based on status
  disabled: boolean;
}

/**
 * Task tree operations result
 */
export interface TaskTreeOperationResult {
  success: boolean;
  task?: Task;
  affectedTaskIds: string[]; // Tasks that had positions/paths updated
  error?: string;
}

/**
 * Task dependency relationship
 */
export interface TaskDependency {
  id: string;
  task_id: string;           // The task that is blocked
  depends_on_task_id: string; // The task that must complete first
  created_at: Date;
  created_by: string;
}

/**
 * Task assignment record
 */
export interface TaskAssignment {
  id: string;
  task_id: string;
  assignee_id: string;       // User/Team/Org/Bot ID
  assignee_type: AssigneeType;
  assigned_at: Date;
  assigned_by: string;
}

/**
 * Task template for reusable structures
 */
export interface TaskTemplate {
  id: string;
  name: string;
  description: string | null;
  
  // Template structure
  task_structure: TaskTemplateNode[]; // Hierarchical template
  variables: TaskTemplateVariable[];   // Placeholders
  
  // Metadata
  category: string;
  tags: string[];
  usage_count: number;
  
  // Ownership
  owner_id: string;          // Account Context ID
  owner_type: 'user' | 'organization' | 'team';
  visibility: 'private' | 'organization' | 'public';
  
  created_at: Date;
  updated_at: Date;
}

/**
 * Task template node (reusable task definition)
 */
export interface TaskTemplateNode {
  title: string;             // Can include {{variables}}
  description: string | null;
  priority: TaskPriority;
  position: number;
  children: TaskTemplateNode[];
  estimated_hours: number | null;
}

/**
 * Task template variable
 */
export interface TaskTemplateVariable {
  key: string;               // e.g., "project_name"
  label: string;             // e.g., "Project Name"
  default_value: string | null;
  required: boolean;
}

/**
 * Task staging record (48-hour reversible submission)
 */
export interface TaskStaging {
  id: string;
  task_id: string;
  submitted_by: string;
  submitted_at: Date;
  expires_at: Date;          // submitted_at + 48 hours
  previous_status: TaskStatus; // For rollback
  previous_data: Partial<Task>; // Snapshot (JSONB)
  withdrawn: boolean;
}

/**
 * Task history entry (audit trail)
 */
export interface TaskHistory {
  id: string;
  task_id: string;
  changed_by: string;
  changed_at: Date;
  action: 'created' | 'updated' | 'moved' | 'deleted' | 'status_changed';
  changed_fields: Record<string, { old: unknown; new: unknown }>;
  metadata: Record<string, unknown> | null;
}

/**
 * Task comment
 */
export interface TaskComment {
  id: string;
  task_id: string;
  author_id: string;
  content: string;
  created_at: Date;
  updated_at: Date;
  parent_comment_id: string | null; // For threaded comments
}
```

### 3.2 Type Guards

```typescript
/**
 * Type guard for task status
 */
export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && [
    'pending', 'assigned', 'in_progress', 'staging',
    'in_qa', 'in_inspection', 'completed', 'cancelled'
  ].includes(value);
}

/**
 * Check if task is in a terminal state
 */
export function isTerminalStatus(status: TaskStatus): boolean {
  return status === 'completed' || status === 'cancelled';
}

/**
 * Check if task can transition to new status
 */
export function canTransitionTo(from: TaskStatus, to: TaskStatus): boolean {
  const transitions: Record<TaskStatus, TaskStatus[]> = {
    pending: ['assigned', 'cancelled'],
    assigned: ['in_progress', 'pending', 'cancelled'],
    in_progress: ['staging', 'assigned', 'cancelled'],
    staging: ['in_qa', 'in_progress'], // Can withdraw within 48h
    in_qa: ['in_inspection', 'in_progress', 'cancelled'],
    in_inspection: ['completed', 'in_qa', 'cancelled'],
    completed: [], // Terminal - no transitions
    cancelled: []  // Terminal - no transitions
  };
  
  return transitions[from]?.includes(to) ?? false;
}
```

---

## 4. Database Schema

**Location:** Supabase Migration Script

### 4.1 Table: `tasks` (Core Task Table with Tree Structure)

```sql
CREATE TABLE public.tasks (
  -- Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Tree structure
  parent_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  path TEXT NOT NULL, -- Materialized path: '1.2.3' for efficient queries
  depth INTEGER NOT NULL DEFAULT 0,
  
  -- Basic info
  title TEXT NOT NULL CHECK (length(title) >= 1 AND length(title) <= 200),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'assigned', 'in_progress', 'staging',
    'in_qa', 'in_inspection', 'completed', 'cancelled'
  )),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN (
    'low', 'medium', 'high', 'urgent'
  )),
  
  -- Assignment
  assignee_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  assignee_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  contractor_fields JSONB, -- For bot tasks with custom data
  
  -- Denormalized counts for performance
  dependency_count INTEGER NOT NULL DEFAULT 0,
  blocked_count INTEGER NOT NULL DEFAULT 0,
  comment_count INTEGER NOT NULL DEFAULT 0,
  child_count INTEGER NOT NULL DEFAULT 0,
  
  -- Constraints
  CONSTRAINT parent_not_self CHECK (id != parent_id),
  CONSTRAINT valid_depth CHECK (depth >= 0),
  CONSTRAINT valid_position CHECK (position >= 0)
);

-- Indexes for performance
CREATE INDEX idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX idx_tasks_parent ON public.tasks(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignees ON public.tasks USING GIN(assignee_ids);
CREATE INDEX idx_tasks_path ON public.tasks USING GIST(path gist_trgm_ops); -- For path queries
CREATE INDEX idx_tasks_tags ON public.tasks USING GIN(tags);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;

-- Full-text search index
CREATE INDEX idx_tasks_search ON public.tasks USING GIN(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to maintain denormalized child_count
CREATE OR REPLACE FUNCTION update_task_child_count()
RETURNS TRIGGER AS $
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE public.tasks
      SET child_count = child_count + 1
      WHERE id = NEW.parent_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE public.tasks
      SET child_count = child_count - 1
      WHERE id = OLD.parent_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
      IF OLD.parent_id IS NOT NULL THEN
        UPDATE public.tasks SET child_count = child_count - 1 WHERE id = OLD.parent_id;
      END IF;
      IF NEW.parent_id IS NOT NULL THEN
        UPDATE public.tasks SET child_count = child_count + 1 WHERE id = NEW.parent_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_task_child_count
  AFTER INSERT OR UPDATE OR DELETE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_task_child_count();
```

### 4.2 Table: `task_dependencies` (Task Blocking Relationships)

```sql
CREATE TABLE public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.users(id),
  
  -- Constraints
  CONSTRAINT dependency_not_self CHECK (task_id != depends_on_task_id),
  CONSTRAINT unique_dependency UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_task_deps_task ON public.task_dependencies(task_id);
CREATE INDEX idx_task_deps_depends_on ON public.task_dependencies(depends_on_task_id);

-- Trigger to update denormalized counts
CREATE OR REPLACE FUNCTION update_dependency_counts()
RETURNS TRIGGER AS $
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tasks SET dependency_count = dependency_count + 1 WHERE id = NEW.task_id;
    UPDATE public.tasks SET blocked_count = blocked_count + 1 WHERE id = NEW.depends_on_task_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tasks SET dependency_count = dependency_count - 1 WHERE id = OLD.task_id;
    UPDATE public.tasks SET blocked_count = blocked_count - 1 WHERE id = OLD.depends_on_task_id;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_dependency_counts
  AFTER INSERT OR DELETE ON public.task_dependencies
  FOR EACH ROW
  EXECUTE FUNCTION update_dependency_counts();
```

### 4.3 Table: `task_assignments` (Multi-Assignee Support)

```sql
CREATE TABLE public.task_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  assignee_id UUID NOT NULL, -- Can reference users, teams, orgs, or bots
  assignee_type TEXT NOT NULL CHECK (assignee_type IN ('user', 'team', 'organization', 'bot')),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assigned_by UUID NOT NULL REFERENCES public.users(id),
  
  CONSTRAINT unique_assignment UNIQUE(task_id, assignee_id, assignee_type)
);

CREATE INDEX idx_task_assigns_task ON public.task_assignments(task_id);
CREATE INDEX idx_task_assigns_assignee ON public.task_assignments(assignee_id, assignee_type);
```

### 4.4 Table: `task_templates` (Reusable Task Structures)

```sql
CREATE TABLE public.task_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (length(name) >= 3 AND length(name) <= 100),
  description TEXT,
  
  -- Template structure (JSONB for flexibility)
  task_structure JSONB NOT NULL, -- Array of TaskTemplateNode
  variables JSONB DEFAULT '[]'::JSONB, -- Array of TaskTemplateVariable
  
  -- Metadata
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  usage_count INTEGER NOT NULL DEFAULT 0,
  
  -- Ownership
  owner_id UUID NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'organization', 'team')),
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'organization', 'public')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_task_templates_owner ON public.task_templates(owner_id, owner_type);
CREATE INDEX idx_task_templates_category ON public.task_templates(category);
CREATE INDEX idx_task_templates_tags ON public.task_templates USING GIN(tags);
CREATE INDEX idx_task_templates_visibility ON public.task_templates(visibility);

CREATE TRIGGER update_task_templates_updated_at
  BEFORE UPDATE ON public.task_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4.5 Table: `task_staging` (48-Hour Reversible Staging)

```sql
CREATE TABLE public.task_staging (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES public.users(id),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL, -- submitted_at + interval '48 hours'
  previous_status TEXT NOT NULL,
  previous_data JSONB NOT NULL, -- Snapshot of task before staging
  withdrawn BOOLEAN NOT NULL DEFAULT FALSE,
  
  CONSTRAINT unique_active_staging UNIQUE(task_id)
);

CREATE INDEX idx_task_staging_expires ON public.task_staging(expires_at) WHERE NOT withdrawn;

-- Automatic expiration function (run via cron or pg_cron)
CREATE OR REPLACE FUNCTION expire_staged_tasks()
RETURNS void AS $
BEGIN
  -- Move expired staging tasks to in_qa
  UPDATE public.tasks t
  SET status = 'in_qa', updated_at = NOW()
  FROM public.task_staging ts
  WHERE t.id = ts.task_id
    AND ts.expires_at < NOW()
    AND NOT ts.withdrawn
    AND t.status = 'staging';
    
  -- Mark staging records as processed
  UPDATE public.task_staging
  SET withdrawn = TRUE
  WHERE expires_at < NOW() AND NOT withdrawn;
END;
$ LANGUAGE plpgsql;
```

### 4.6 Table: `task_history` (Audit Trail)

```sql
CREATE TABLE public.task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES public.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action TEXT NOT NULL CHECK (action IN ('created', 'updated', 'moved', 'deleted', 'status_changed')),
  changed_fields JSONB NOT NULL, -- { field: { old: value, new: value } }
  metadata JSONB
);

CREATE INDEX idx_task_history_task ON public.task_history(task_id, changed_at DESC);
CREATE INDEX idx_task_history_user ON public.task_history(changed_by);
CREATE INDEX idx_task_history_action ON public.task_history(action);
```

### 4.7 Table: `task_comments` (Threaded Discussions)

```sql
CREATE TABLE public.task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL CHECK (length(content) >= 1 AND length(content) <= 5000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  parent_comment_id UUID REFERENCES public.task_comments(id) ON DELETE CASCADE,
  
  CONSTRAINT comment_not_self_parent CHECK (id != parent_comment_id)
);

CREATE INDEX idx_task_comments_task ON public.task_comments(task_id, created_at DESC);
CREATE INDEX idx_task_comments_author ON public.task_comments(author_id);
CREATE INDEX idx_task_comments_parent ON public.task_comments(parent_comment_id) WHERE parent_comment_id IS NOT NULL;

CREATE TRIGGER update_task_comments_updated_at
  BEFORE UPDATE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update comment_count on tasks
CREATE OR REPLACE FUNCTION update_task_comment_count()
RETURNS TRIGGER AS $
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tasks SET comment_count = comment_count + 1 WHERE id = NEW.task_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tasks SET comment_count = comment_count - 1 WHERE id = OLD.task_id;
  END IF;
  RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_task_comment_count
  AFTER INSERT OR DELETE ON public.task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comment_count();
```

---

## 5. Row Level Security (RLS) Policies

### 5.1 Enable RLS on All Tables

```sql
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
```

### 5.2 RLS Policies for `tasks`

```sql
-- Users can view tasks in workspaces they have access to
CREATE POLICY "Tasks visible to workspace members"
  ON public.tasks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Users can insert tasks in workspaces where they have write permissions
CREATE POLICY "Tasks insertable by workspace members"
  ON public.tasks FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin', 'member')
    )
  );

-- Users can update tasks they created or are assigned to
CREATE POLICY "Tasks updatable by assignees and workspace admins"
  ON public.tasks FOR UPDATE
  USING (
    auth.uid()::TEXT = ANY(assignee_ids)
    OR workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );

-- Only workspace owners/admins can delete tasks
CREATE POLICY "Tasks deletable by workspace admins"
  ON public.tasks FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM public.workspace_members
      WHERE user_id = auth.uid()
        AND role IN ('owner', 'admin')
    )
  );
```

### 5.3 RLS Policies for Other Tables

```sql
-- task_dependencies: Same visibility as tasks
CREATE POLICY "Dependencies visible to task viewers"
  ON public.task_dependencies FOR SELECT
  USING (
    task_id IN (SELECT id FROM public.tasks)
  );

CREATE POLICY "Dependencies manageable by workspace members"
  ON public.task_dependencies FOR ALL
  USING (
    task_id IN (
      SELECT t.id FROM public.tasks t
      JOIN public.workspace_members wm ON t.workspace_id = wm.workspace_id
      WHERE wm.user_id = auth.uid() AND wm.role IN ('owner', 'admin', 'member')
    )
  );

-- task_assignments: Same visibility as tasks
CREATE POLICY "Assignments visible to workspace members"
  ON public.task_assignments FOR SELECT
  USING (
    task_id IN (SELECT id FROM public.tasks)
  );

-- task_templates: Visible based on visibility level
CREATE POLICY "Templates visible based on visibility"
  ON public.task_templates FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'organization' AND owner_id IN (
      SELECT organization_id FROM public.org_members WHERE user_id = auth.uid()
    ))
    OR owner_id = auth.uid()
  );

-- task_history: Same visibility as tasks (audit trail)
CREATE POLICY "History visible to workspace members"
  ON public.task_history FOR SELECT
  USING (
    task_id IN (SELECT id FROM public.tasks)
  );

-- task_comments: Same visibility as tasks
CREATE POLICY "Comments visible to workspace members"
  ON public.task_comments FOR SELECT
  USING (
    task_id IN (SELECT id FROM public.tasks)
  );

CREATE POLICY "Comments creatable by workspace members"
  ON public.task_comments FOR INSERT
  WITH CHECK (
    author_id = auth.uid()
    AND task_id IN (SELECT id FROM public.tasks)
  );
```

---

*Continued in next response due to length...*

## 6. Service Architecture

### 6.1 TaskService (Core CRUD Operations)

**Location:** `src/app/core/services/task.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Task, TaskStatus, TaskHistory } from '@core/types/task.types';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly supabase = inject(SupabaseClient);

  /**
   * Get tasks by workspace
   */
  getTasksByWorkspace(workspaceId: string): Observable<Task[]> {
    return from(
      this.supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('path', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data as Task[];
      }),
      catchError(error => {
        console.error('Failed to load tasks:', error);
        return throwError(() => new Error('Failed to load tasks'));
      })
    );
  }

  /**
   * Create a new task
   */
  createTask(task: Partial<Task>): Observable<Task> {
    return from(
      this.supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        this.recordHistory(response.data.id, 'created', {});
        return response.data as Task;
      })
    );
  }

  /**
   * Update a task
   */
  updateTask(id: string, updates: Partial<Task>): Observable<Task> {
    return from(
      this.supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        this.recordHistory(id, 'updated', updates);
        return response.data as Task;
      })
    );
  }

  /**
   * Change task status with validation
   */
  changeStatus(id: string, newStatus: TaskStatus): Observable<Task> {
    return this.getTask(id).pipe(
      switchMap(task => {
        if (!canTransitionTo(task.status, newStatus)) {
          return throwError(() => new Error(`Cannot transition from ${task.status} to ${newStatus}`));
        }
        
        const updates: Partial<Task> = { status: newStatus };
        if (newStatus === 'in_progress' && !task.started_at) {
          updates.started_at = new Date();
        }
        if (newStatus === 'completed' && !task.completed_at) {
          updates.completed_at = new Date();
        }
        
        return this.updateTask(id, updates);
      })
    );
  }

  /**
   * Record task history for audit trail
   */
  private recordHistory(taskId: string, action: string, changedFields: Record<string, unknown>): void {
    this.supabase.from('task_history').insert({
      task_id: taskId,
      changed_by: this.getCurrentUserId(),
      action,
      changed_fields: changedFields
    }).then();
  }

  private getCurrentUserId(): string {
    // Get from AccountContextService
    return 'current-user-id';
  }

  private getTask(id: string): Observable<Task> {
    return from(
      this.supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data as Task;
      })
    );
  }
}
```

### 6.2 TaskTreeService (Tree Operations)

```typescript
@Injectable({ providedIn: 'root' })
export class TaskTreeService {
  private readonly supabase = inject(SupabaseClient);

  /**
   * Calculate materialized path for new task
   */
  calculatePath(parentId: string | null, position: number): Observable<string> {
    if (!parentId) {
      return of((position + 1).toString());
    }
    
    return from(
      this.supabase
        .from('tasks')
        .select('path')
        .eq('id', parentId)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        const parentPath = response.data.path;
        return `${parentPath}.${position + 1}`;
      })
    );
  }

  /**
   * Move task to new parent or position
   */
  moveTask(taskId: string, newParentId: string | null, newPosition: number): Observable<TaskTreeOperationResult> {
    return this.getTask(taskId).pipe(
      switchMap(task => {
        // Validate: cannot move to own descendant
        if (newParentId) {
          return this.isDescendant(newParentId, taskId).pipe(
            switchMap(isDesc => {
              if (isDesc) {
                return throwError(() => new Error('Cannot move task to its own descendant'));
              }
              return this.performMove(task, newParentId, newPosition);
            })
          );
        }
        return this.performMove(task, newParentId, newPosition);
      })
    );
  }

  /**
   * Get task tree as hierarchical structure
   */
  getTaskTree(workspaceId: string): Observable<TaskNode[]> {
    return from(
      this.supabase
        .from('tasks')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('path', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.buildTree(response.data as Task[]);
      })
    );
  }

  /**
   * Build hierarchical tree structure from flat list
   */
  private buildTree(tasks: Task[]): TaskNode[] {
    const map = new Map<string, TaskNode>();
    const roots: TaskNode[] = [];

    // Create nodes
    tasks.forEach(task => {
      const node: TaskNode = {
        key: task.id,
        title: task.title,
        isLeaf: task.child_count === 0,
        expanded: false,
        children: [],
        task,
        level: task.depth,
        icon: this.getStatusIcon(task.status),
        disabled: false
      };
      map.set(task.id, node);
    });

    // Build tree
    tasks.forEach(task => {
      const node = map.get(task.id)!;
      if (task.parent_id) {
        const parent = map.get(task.parent_id);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  private getStatusIcon(status: TaskStatus): string {
    const icons: Record<TaskStatus, string> = {
      pending: 'clock-circle',
      assigned: 'user',
      in_progress: 'loading',
      staging: 'upload',
      in_qa: 'experiment',
      in_inspection: 'eye',
      completed: 'check-circle',
      cancelled: 'close-circle'
    };
    return icons[status];
  }
}
```

---

## 7. Component Design

### 7.1 TaskTreeComponent (Tree Visualization)

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TaskTreeService } from '@core/services/task-tree.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-tree',
  standalone: true,
  imports: [CommonModule, NzTreeModule, NzIconModule],
  template: `
    <nz-tree
      [nzData]="treeNodes"
      [nzDraggable]="true"
      [nzExpandedKeys]="expandedKeys"
      (nzOnDrop)="onDrop($event)"
      (nzClick)="onNodeClick($event)"
      nzShowIcon>
    </nz-tree>
  `,
  styleUrls: ['./task-tree.component.less']
})
export class TaskTreeComponent implements OnInit, OnDestroy {
  private readonly treeService = inject(TaskTreeService);
  private readonly destroy$ = new Subject<void>();

  treeNodes: NzTreeNodeOptions[] = [];
  expandedKeys: string[] = [];
  workspaceId = 'current-workspace-id'; // From router or context

  ngOnInit(): void {
    this.loadTree();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadTree(): void {
    this.treeService.getTaskTree(this.workspaceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(nodes => {
        this.treeNodes = nodes;
      });
  }

  onDrop(event: any): void {
    const dragNode = event.dragNode;
    const dropNode = event.node;
    const dropPosition = event.dropPosition;

    // Move task via service
    this.treeService.moveTask(
      dragNode.key,
      dropPosition === -1 ? null : dropNode.key,
      dropPosition
    ).subscribe(() => {
      this.loadTree(); // Refresh
    });
  }

  onNodeClick(event: any): void {
    // Navigate to task detail
    console.log('Task clicked:', event.keys[0]);
  }
}
```

### 7.2 TaskFormComponent (@delon/form Schema Form)

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { TaskService } from '@core/services/task.service';

@Component({
  selector: 'app-task-form',
  template: `
    <sf 
      [schema]="schema"
      [ui]="ui"
      [formData]="formData"
      (formSubmit)="onSubmit($event)">
    </sf>
  `
})
export class TaskFormComponent implements OnInit {
  private readonly taskService = inject(TaskService);

  schema: SFSchema = {
    properties: {
      title: {
        type: 'string',
        title: '任務標題',
        maxLength: 200,
        minLength: 1
      },
      description: {
        type: 'string',
        title: '任務描述'
      },
      priority: {
        type: 'string',
        title: '優先級',
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
      },
      status: {
        type: 'string',
        title: '狀態',
        enum: ['pending', 'assigned', 'in_progress', 'staging', 'in_qa', 'in_inspection', 'completed', 'cancelled'],
        default: 'pending'
      },
      parent_id: {
        type: 'string',
        title: '父任務',
        ui: { widget: 'select' }
      },
      due_date: {
        type: 'string',
        title: '截止日期',
        format: 'date'
      },
      tags: {
        type: 'array',
        title: '標籤',
        items: { type: 'string' }
      }
    },
    required: ['title']
  };

  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 }
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 }
    }
  };

  formData: any = {};

  onSubmit(value: any): void {
    this.taskService.createTask(value).subscribe(task => {
      console.log('Task created:', task);
    });
  }
}
```

---

## 8. Enterprise Standards

### 8.1 Naming Conventions

**Task Naming Format:**
```
[PREFIX]-[NUMBER] - [Title]

Examples:
- TASK-001 - Setup development environment
- BUG-042 - Fix navigation menu issue
- FEAT-123 - Add user authentication
- DOC-008 - Update API documentation
```

**Prefixes:**
- `TASK` - General task
- `BUG` - Bug fix
- `FEAT` - Feature development
- `DOC` - Documentation
- `TEST` - Testing task
- `REFACTOR` - Code refactoring

### 8.2 Workflow State Transitions

```
┌─────────┐     ┌──────────┐     ┌────────────┐     ┌─────────┐
│ pending │────►│ assigned │────►│in_progress │────►│ staging │
└─────────┘     └──────────┘     └────────────┘     └─────────┘
     │               │                  │                  │
     │               │                  │                  ▼
     │               │                  │            ┌─────────┐
     │               │                  │            │  in_qa  │
     │               │                  │            └─────────┘
     │               │                  │                  │
     │               │                  │                  ▼
     │               │                  │         ┌──────────────┐
     │               │                  │         │in_inspection │
     │               │                  │         └──────────────┘
     │               │                  │                  │
     │               │                  │                  ▼
     │               │                  │            ┌───────────┐
     │               │                  │            │ completed │
     │               │                  │            └───────────┘
     │               │                  │
     └───────────────┴──────────────────┴────────►┌───────────┐
                                                   │ cancelled │
                                                   └───────────┘
```

### 8.3 Quality Gates

**Before moving to "staging":**
- [ ] Task description must be ≥ 20 characters
- [ ] All required fields filled
- [ ] No blocking dependencies incomplete

**Before moving to "in_qa":**
- [ ] 48-hour staging period expired OR manually approved
- [ ] No active blockers

**Before moving to "completed":**
- [ ] QA review passed
- [ ] Inspection approval received
- [ ] All acceptance criteria met

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Database schema setup (7 tables)
- [ ] RLS policies implementation
- [ ] TypeScript types and interfaces
- [ ] Basic TaskService (CRUD)
- [ ] Unit tests for services

### Phase 2: Tree Structure (Week 3-4)
- [ ] TaskTreeService implementation
- [ ] Recursive path calculation
- [ ] Move/reorder operations
- [ ] TaskTreeComponent (ng-zorro tree)
- [ ] Drag-and-drop functionality

### Phase 3: Workflow & States (Week 5-6)
- [ ] State machine implementation
- [ ] Transition validation
- [ ] Staging mechanism (48-hour)
- [ ] TaskFormComponent (@delon/form)
- [ ] Status change UI

### Phase 4: Templates & Dependencies (Week 7)
- [ ] TaskTemplateService
- [ ] Template instantiation
- [ ] Dependency management
- [ ] Cycle detection algorithm

### Phase 5: Polish & Integration (Week 8)
- [ ] TaskListComponent (table view)
- [ ] TaskKanbanComponent (board view)
- [ ] Integration with Blueprint Container
- [ ] Performance optimization
- [ ] E2E testing

---

## 10. Integration with Other Modules

### 10.1 Integration with Blueprint Container

**Blueprint instantiation creates tasks:**
```typescript
// When creating workspace from blueprint
const blueprint = await blueprintService.getBlueprint(blueprintId);
const workspace = await workspaceService.createWorkspace({
  name: workspaceName,
  blueprint_id: blueprintId
});

// Instantiate task templates
for (const taskTemplate of blueprint.task_templates) {
  await taskTemplateService.instantiate(taskTemplate, workspace.id, variables);
}
```

### 10.2 Integration with Account Context

**Tasks are tenant-scoped:**
```typescript
// RLS automatically filters by workspace membership
const tasks = await taskService.getTasksByWorkspace(workspaceId);

// Permission checks use account context
if (accountContext.role === 'admin') {
  // Allow delete
}
```

---

## 11. Success Metrics

- **Task Tree Depth**: Support ≥10 levels without performance degradation
- **Query Performance**: Tree queries < 100ms for 1000 tasks
- **State Transitions**: 99.9% valid transitions (no invalid states)
- **48-Hour Staging**: 100% automated expiration
- **RLS Security**: Zero cross-tenant data leaks

---

## 12. Conclusion

The Blueprint Task Module provides enterprise-grade hierarchical task management with:
- ✅ **Unlimited tree depth** with efficient materialized paths
- ✅ **8-state workflow** with quality gates and 48-hour staging
- ✅ **Multi-tenant security** via RLS policies
- ✅ **Template system** for reusable task structures
- ✅ **Full audit trail** for compliance
- ✅ **Integration** with Blueprint Container and Account Context

**Total Implementation:** 8 weeks  
**Database Tables:** 7 tables with RLS  
**Services:** 3 core services (Task, TaskTree, TaskTemplate)  
**Components:** 4 UI components (Tree, Form, List, Kanban)

---

**End of Document**

*Generated by: AI Copilot Agent*  
*Design Date: 2025-11-23*  
*Status: Ready for Stakeholder Review*
