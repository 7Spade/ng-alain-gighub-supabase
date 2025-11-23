# Blueprint Container System - Planning Document

## Document Information

**Version:** 1.0  
**Date:** 2025-11-23  
**Status:** Planning Phase  
**Authors:** AI Copilot Agent  
**Related Documents:**
- [Account Context Switcher Design](./ACCOUNT_CONTEXT_SWITCHER_DESIGN.md)
- [TenantFlow-lin](https://github.com/7Spade/TenantFlow-lin) - Reference workspace implementation
- [ng-alain-gighub](https://github.com/7Spade/ng-alain-gighub) - Base Angular template

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the architecture and planning for a **Blueprint Container System** that enables users and organizations to create, manage, and instantiate workspace templates (blueprints). The system provides enterprise-grade standardization, reusability, and governance for workspace creation in a multi-tenant environment.

### 1.2 What is a Blueprint?

A **Blueprint** (藍圖) is a reusable workspace template that defines:
- **Structure**: Default folders, categories, sections
- **Configuration**: Settings, permissions, roles
- **Content**: Pre-defined tasks, documents, resources
- **Automation**: Workflows, notifications, integrations

### 1.3 Key Concepts

```
Blueprint (Template)
    ↓ instantiate
Workspace (Instance)
    ↓ contains
Tasks, Files, Members, Settings
```

**Example Use Cases:**
- **Software Project Blueprint**: Includes sprint boards, code review checklist, deployment docs
- **Marketing Campaign Blueprint**: Campaign timeline, asset library, approval workflow
- **Onboarding Blueprint**: Training materials, checklist, mentor assignment
- **Sales Pipeline Blueprint**: Lead stages, proposal templates, contract docs

### 1.4 Goals

- ✅ Enable users/orgs to create reusable workspace templates
- ✅ Support blueprint sharing (private, org-wide, public marketplace)
- ✅ Provide versioning and change management
- ✅ Integrate with Account Context Switcher (multi-tenant)
- ✅ Enterprise governance (approval, compliance, standards)
- ✅ Import/Export blueprints (JSON/YAML format)
- ✅ Analytics and usage tracking

### 1.5 Non-Goals

- ❌ Direct implementation (planning only)
- ❌ Specific business logic for individual industries
- ❌ Third-party marketplace integration (future phase)

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Angular Application                        │
├─────────────────────────────────────────────────────────────┤
│  Blueprint Gallery → Blueprint Editor → Workspace Creator   │
│         ↓                    ↓                    ↓          │
│  Blueprint Service ← Account Context Service → Workspace Svc│
│                              ↓                               │
│                     Supabase Client (RLS)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                           │
│  blueprints | workspaces | tasks | files | workspace_members│
│                  + RLS Policies                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Core Components

| Component | Responsibility |
|-----------|---------------|
| **Blueprint Gallery** | Browse, search, preview blueprints |
| **Blueprint Editor** | Create/edit blueprint definitions |
| **Workspace Creator** | Instantiate workspace from blueprint |
| **Blueprint Service** | CRUD, versioning, instantiation |
| **Workspace Service** | Workspace CRUD, member management |

---

## 3. TypeScript Type Definitions

**Location:** `src/app/core/types/blueprint.types.ts`

```typescript
/**
 * Blueprint visibility levels
 */
export type BlueprintVisibility = 'private' | 'organization' | 'team' | 'public';

/**
 * Blueprint status
 */
export type BlueprintStatus = 'draft' | 'published' | 'archived';

/**
 * Blueprint category
 */
export type BlueprintCategory = 
  | 'software_development'
  | 'marketing'
  | 'sales'
  | 'hr'
  | 'operations'
  | 'custom';

/**
 * Base blueprint interface
 */
export interface Blueprint {
  id: string;
  name: string;
  description: string;
  category: BlueprintCategory;
  visibility: BlueprintVisibility;
  status: BlueprintStatus;
  
  // Ownership (Account Context Integration)
  ownerId: string; // User or Organization ID
  ownerType: 'user' | 'organization' | 'team';
  
  // Blueprint structure definition
  structure: BlueprintStructure;
  
  // Metadata
  version: number;
  tags: string[];
  iconUrl?: string;
  thumbnailUrl?: string;
  
  // Statistics
  usageCount: number;
  rating?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * Blueprint structure definition
 */
export interface BlueprintStructure {
  tasks?: TaskTemplate[];
  folders?: FolderTemplate[];
  settings: WorkspaceSettings;
  automations?: AutomationRule[];
  defaultRoles?: DefaultRole[];
}

/**
 * Task template within blueprint
 */
export interface TaskTemplate {
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueInDays?: number; // Relative due date
  assigneeRole?: string; // Role-based assignment
  tags?: string[];
  subtasks?: SubtaskTemplate[];
}

/**
 * Workspace instance (instantiated from blueprint)
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  
  // Blueprint reference
  blueprintId?: string;
  blueprintVersion?: number;
  
  // Ownership (Account Context Integration)
  tenantId: string; // Current context tenant
  tenantType: 'user' | 'organization' | 'team';
  
  // Status
  status: 'active' | 'archived' | 'template';
  settings: WorkspaceSettings;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Workspace settings
 */
export interface WorkspaceSettings {
  allowGuestAccess: boolean;
  requireApprovalForJoin: boolean;
  defaultMemberRole: 'member' | 'viewer';
  enableTaskComments: boolean;
  enableFileSharing: boolean;
  enableNotifications: boolean;
}
```

---

## 4. Database Schema

### 4.1 blueprints Table

```sql
CREATE TABLE public.blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN (
    'software_development', 'marketing', 'sales', 'hr', 'operations', 'custom'
  )),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN (
    'private', 'organization', 'team', 'public'
  )),
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'published', 'archived'
  )),
  
  owner_id UUID NOT NULL,
  owner_type TEXT NOT NULL CHECK (owner_type IN ('user', 'organization', 'team')),
  
  structure JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  version INTEGER DEFAULT 1,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  icon_url TEXT,
  thumbnail_url TEXT,
  
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) 
    REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_blueprints_owner ON public.blueprints(owner_id);
CREATE INDEX idx_blueprints_category ON public.blueprints(category);
CREATE INDEX idx_blueprints_visibility ON public.blueprints(visibility);
CREATE INDEX idx_blueprints_tags ON public.blueprints USING GIN(tags);

CREATE INDEX idx_blueprints_search ON public.blueprints 
  USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### 4.2 workspaces Table

```sql
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  
  blueprint_id UUID REFERENCES public.blueprints(id) ON DELETE SET NULL,
  blueprint_version INTEGER,
  
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('user', 'organization', 'team')),
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'template')),
  settings JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE INDEX idx_workspaces_tenant ON public.workspaces(tenant_id);
CREATE INDEX idx_workspaces_blueprint ON public.workspaces(blueprint_id);
```

### 4.3 workspace_members Table

```sql
CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);
```

### 4.4 tasks Table

```sql
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'canceled')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  assignee_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tasks_workspace ON public.tasks(workspace_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_assignee ON public.tasks USING GIN(assignee_ids);
```

---

## 5. Row Level Security (RLS) Policies

### 5.1 blueprints RLS

```sql
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Public blueprints visible to all
CREATE POLICY "Anyone can view public blueprints"
  ON public.blueprints FOR SELECT
  USING (visibility = 'public' AND status = 'published');

-- Own blueprints visible to owner
CREATE POLICY "Users can view own blueprints"
  ON public.blueprints FOR SELECT
  USING (owner_id = auth.uid());

-- Organization blueprints visible to org members
CREATE POLICY "Org members can view org blueprints"
  ON public.blueprints FOR SELECT
  USING (
    visibility = 'organization' 
    AND status = 'published'
    AND EXISTS (
      SELECT 1 FROM public.org_members
      WHERE organization_id = blueprints.owner_id AND user_id = auth.uid()
    )
  );

-- Users can create blueprints
CREATE POLICY "Authenticated users can create blueprints"
  ON public.blueprints FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

-- Owners can update/delete blueprints
CREATE POLICY "Owners can manage blueprints"
  ON public.blueprints FOR ALL
  USING (owner_id = auth.uid());
```

### 5.2 workspaces RLS

```sql
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;

-- Workspace members can view
CREATE POLICY "Members can view workspace"
  ON public.workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = workspaces.id AND user_id = auth.uid()
    )
  );

-- Authenticated users can create
CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Owners and admins can update
CREATE POLICY "Owners and admins can update workspace"
  ON public.workspaces FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = workspaces.id 
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

---

## 6. Service Architecture

### 6.1 BlueprintService

**Location:** `src/app/core/services/blueprint.service.ts`

**Key Methods:**
- `getPublicBlueprints()` - Browse marketplace
- `getContextBlueprints()` - Get blueprints for active context
- `createBlueprint()` - Create new blueprint
- `updateBlueprint()` - Update blueprint
- `publishBlueprint()` - Publish with versioning
- `instantiateWorkspace()` - Create workspace from blueprint
- `exportBlueprint()` - Export as JSON
- `importBlueprint()` - Import from JSON

### 6.2 WorkspaceService

**Location:** `src/app/core/services/workspace.service.ts`

**Key Methods:**
- `getContextWorkspaces()` - Get workspaces for active context
- `getWorkspaceById()` - Get workspace details
- `createWorkspace()` - Create workspace (without blueprint)
- `getWorkspaceMembers()` - Get members
- `addWorkspaceMember()` - Add member
- `archiveWorkspace()` - Archive workspace

---

## 7. Enterprise Standards

### 7.1 Naming Conventions

**Blueprint Names:**
- Format: `[Prefix] - [Name] - [Version]`
- Example: `SWDEV-001 - Agile Sprint Board - v1.0`
- Prefix codes:
  - `SWDEV`: Software Development
  - `MKTG`: Marketing
  - `SALES`: Sales
  - `HR`: Human Resources
  - `OPS`: Operations

**Workspace Names:**
- Format: `[Project Code] - [Name]`
- Example: `PROJ-2024-Q1-001 - Website Redesign`

### 7.2 Governance

**Blueprint Approval Workflow:**
1. Draft → Submit for Review
2. Review → Approve/Reject
3. Approved → Published
4. Published → Available for use

**Roles:**
- **Blueprint Creator**: Can create and edit blueprints
- **Blueprint Reviewer**: Can approve/reject blueprints
- **Blueprint Admin**: Can manage all blueprints

### 7.3 Quality Standards

**Blueprint Quality Checklist:**
- [ ] Clear, descriptive name
- [ ] Comprehensive description (minimum 50 characters)
- [ ] Appropriate category assigned
- [ ] Minimum 3 task templates
- [ ] Default settings configured
- [ ] Permissions properly set
- [ ] Tested with sample workspace
- [ ] Documentation included

### 7.4 Compliance

**Required Fields for Enterprise Blueprints:**
- Name (with standard naming)
- Description (minimum 50 characters)
- Category
- Owner
- Tags (minimum 3)
- Version changelog

**Audit Trail:**
- All blueprint changes logged
- Version history maintained
- User actions tracked

---

## 8. Integration with Account Context

### 8.1 Context-Aware Blueprint Creation

```typescript
// When creating a blueprint, automatically set owner based on active context
const context = this.accountContextService.getActiveAccount();

if (context.type === 'organization') {
  blueprint.ownerId = context.id;
  blueprint.ownerType = 'organization';
  blueprint.visibility = 'organization'; // Default to org-wide
} else {
  blueprint.ownerId = context.id;
  blueprint.ownerType = 'user';
  blueprint.visibility = 'private'; // Default to private
}
```

### 8.2 Context-Aware Workspace Creation

```typescript
// When instantiating a workspace, use active context as tenant
const context = this.accountContextService.getActiveAccount();

workspace.tenantId = context.id;
workspace.tenantType = context.type;

// Auto-add creator as workspace owner
workspaceMember.userId = currentUser.id;
workspaceMember.role = 'owner';
```

### 8.3 Permission Inheritance

```
Organization Blueprint
    ↓ visible to
Organization Members
    ↓ can create
Workspaces owned by Organization
    ↓ accessible to
Organization Members (based on workspace role)
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create Supabase tables (blueprints, workspaces, workspace_members, tasks)
- [ ] Set up RLS policies
- [ ] Define TypeScript types
- [ ] Create BlueprintService and WorkspaceService
- [ ] Unit tests for services

### Phase 2: Blueprint Management (Week 3-4)
- [ ] Implement Blueprint Gallery component
- [ ] Implement Blueprint Editor component
- [ ] Blueprint versioning system
- [ ] Import/Export functionality
- [ ] Integration tests

### Phase 3: Workspace Creation (Week 5-6)
- [ ] Workspace instantiation from blueprint
- [ ] Task creation from templates
- [ ] Folder structure creation
- [ ] Member assignment automation
- [ ] E2E tests

### Phase 4: Enterprise Features (Week 7-8)
- [ ] Blueprint approval workflow
- [ ] Usage analytics
- [ ] Quality standards enforcement
- [ ] Audit logging
- [ ] Admin dashboard

### Phase 5: UI/UX Polish (Week 9-10)
- [ ] Blueprint preview/templates
- [ ] Drag-and-drop editor
- [ ] Real-time collaboration
- [ ] Notifications
- [ ] User acceptance testing

---

## 10. Component Examples

### 10.1 Blueprint Gallery Component

```typescript
@Component({
  selector: 'app-blueprint-gallery',
  standalone: true,
  template: `
    <div class="blueprint-gallery">
      <page-header [title]="'Blueprint Gallery'">
        <ng-template #action>
          <button nz-button nzType="primary" (click)="createBlueprint()">
            <span nz-icon nzType="plus"></span> Create Blueprint
          </button>
        </ng-template>
      </page-header>
      
      <!-- Search & Filter -->
      <nz-card class="filter-card">
        <nz-input-group [nzPrefix]="prefixIcon">
          <input nz-input [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" />
        </nz-input-group>
        <nz-select [(ngModel)]="selectedCategory" (ngModelChange)="onCategoryChange()">
          <nz-option nzValue="all" nzLabel="All Categories"></nz-option>
          <nz-option nzValue="software_development" nzLabel="Software Dev"></nz-option>
        </nz-select>
      </nz-card>
      
      <!-- Blueprint Grid -->
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="6" *ngFor="let blueprint of blueprints">
          <nz-card [nzHoverable]="true" (click)="selectBlueprint(blueprint)">
            <h4>{{ blueprint.name }}</h4>
            <p>{{ blueprint.description }}</p>
            <nz-tag>{{ blueprint.category }}</nz-tag>
            <span>{{ blueprint.usageCount }} uses</span>
          </nz-card>
        </div>
      </div>
    </div>
  `
})
export class BlueprintGalleryComponent {}
```

### 10.2 Blueprint Editor Component

```typescript
@Component({
  selector: 'app-blueprint-editor',
  standalone: true,
  template: `
    <div class="blueprint-editor">
      <page-header [title]="'Create Blueprint'">
        <ng-template #action>
          <button nz-button (click)="saveDraft()">Save Draft</button>
          <button nz-button nzType="primary" (click)="publish()">Publish</button>
        </ng-template>
      </page-header>
      
      <nz-card>
        <form nz-form [formGroup]="form">
          <nz-form-item>
            <nz-form-label [nzRequired]="true">Blueprint Name</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="name" />
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Description</nz-form-label>
            <nz-form-control>
              <textarea nz-input formControlName="description" rows="3"></textarea>
            </nz-form-control>
          </nz-form-item>
          
          <nz-form-item>
            <nz-form-label>Category</nz-form-label>
            <nz-form-control>
              <nz-select formControlName="category">
                <nz-option nzValue="software_development" nzLabel="Software Dev"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </form>
      </nz-card>
      
      <!-- Structure Editor with @delon/form -->
      <nz-card [nzTitle]="'Blueprint Structure'">
        <sf [schema]="structureSchema" [formData]="structureData"></sf>
      </nz-card>
    </div>
  `
})
export class BlueprintEditorComponent {}
```

---

## 11. Success Metrics

### 11.1 Adoption Metrics
- Number of blueprints created
- Number of workspaces instantiated from blueprints
- Blueprint usage rate (vs. manual creation)
- Active blueprint creators

### 11.2 Quality Metrics
- Blueprint rating average
- Workspace success rate (not archived within 30 days)
- Time saved per workspace creation
- User satisfaction scores

### 11.3 Enterprise Metrics
- Compliance rate (blueprints meeting standards)
- Approval workflow efficiency
- Standardization adoption rate
- Cost savings from reusability

---

## 12. Future Enhancements

### 12.1 Short-term (3-6 months)
- [ ] Blueprint marketplace
- [ ] Community ratings and reviews
- [ ] Blueprint templates library
- [ ] Advanced search and filters
- [ ] AI-powered blueprint recommendations

### 12.2 Long-term (6-12 months)
- [ ] Blueprint automation (CI/CD integration)
- [ ] Custom workflow builder
- [ ] Third-party integrations (Jira, Trello, Asana)
- [ ] Blueprint analytics dashboard
- [ ] Multi-language support for blueprints

---

## 13. Conclusion

This Blueprint Container System provides an enterprise-grade solution for creating, managing, and instantiating workspace templates in a multi-tenant environment. By integrating with the Account Context Switcher, it enables seamless collaboration and standardization across users, organizations, and teams.

### Key Highlights

1. ✅ **Reusability**: Create once, use many times
2. ✅ **Standardization**: Enterprise governance and quality standards
3. ✅ **Flexibility**: Customizable templates for any use case
4. ✅ **Integration**: Seamless integration with account contexts
5. ✅ **Security**: RLS policies ensure proper access control
6. ✅ **Scalability**: Designed for large organizations

### Next Steps

1. **Review**: Stakeholder review and feedback
2. **Refine**: Adjust design based on requirements
3. **Implement**: Follow phased implementation roadmap
4. **Deploy**: Gradual rollout with monitoring

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-23  
**Status:** Ready for Review

---

_This document complements the Account Context Switcher Design and provides a complete blueprint for workspace template management in an enterprise environment._
