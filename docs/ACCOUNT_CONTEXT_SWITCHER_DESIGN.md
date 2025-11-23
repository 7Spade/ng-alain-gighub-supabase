# Account Organization Context Switcher - Design Document

## Document Information

**Version:** 1.0  
**Date:** 2025-11-23  
**Status:** Design Phase  
**Authors:** AI Copilot Agent  
**References:**
- [TenantFlow-lin](https://github.com/7Spade/TenantFlow-lin) - Reference implementation (React/Next.js)
- [ng-alain-gighub](https://github.com/7Spade/ng-alain-gighub) - Base Angular template

---

## 1. Executive Summary

### 1.1 Purpose

This document defines the architecture and design for an **Account Organization Context Switcher** system in the ng-alain-gighub-supabase Angular application. The system enables users to seamlessly switch between different account contexts (Personal, Organization, Team, Bot) similar to GitHub's organization switcher.

### 1.2 Goals

- ✅ Support four account types: **User** (Personal), **Organization**, **Team**, **Bot**
- ✅ Implement GitHub-style context switching UI
- ✅ Integrate with Supabase for multi-tenant data management
- ✅ Follow ng-alain and Angular best practices
- ✅ Provide type-safe TypeScript definitions
- ✅ Enable role-based access control (RBAC) per context
- ✅ Support hierarchical tenant structures (Org → Teams)

### 1.3 Non-Goals (Out of Scope)

- ❌ Direct implementation (design only)
- ❌ UI component implementation details
- ❌ Specific business logic beyond context switching
- ❌ Migration strategies from existing auth systems

---

## 2. Architecture Overview

### 2.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐      ┌───────────────────────┐   │
│  │  Context Switcher   │◄────►│  Account Context      │   │
│  │    Component        │      │     Service           │   │
│  │  (UI Dropdown)      │      │ (State Management)    │   │
│  └─────────────────────┘      └───────────────────────┘   │
│           │                              │                 │
│           │                              │                 │
│           ▼                              ▼                 │
│  ┌─────────────────────┐      ┌───────────────────────┐   │
│  │  Layout Header      │      │  Tenant Service       │   │
│  │   Integration       │      │  (CRUD Operations)    │   │
│  └─────────────────────┘      └───────────────────────┘   │
│                                          │                 │
│                                          │                 │
│                                          ▼                 │
│                            ┌─────────────────────────┐     │
│                            │  Supabase Client        │     │
│                            │  (API + Auth + RLS)     │     │
│                            └─────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Backend                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────────┐  ┌───────┐  ┌──────────┐  │
│  │  users   │  │ organizations│  │ teams │  │   bots   │  │
│  └──────────┘  └──────────────┘  └───────┘  └──────────┘  │
│                                                             │
│  ┌──────────────────┐  ┌────────────────────────────────┐  │
│  │ org_members      │  │  team_members                  │  │
│  └──────────────────┘  └────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Row Level Security (RLS) Policies          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Key Components

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| **Context Switcher Component** | UI dropdown for switching accounts | Angular Standalone Component |
| **Account Context Service** | Manages active context state | Injectable Service (RxJS) |
| **Tenant Service** | CRUD operations for tenants | Injectable Service (Supabase) |
| **Types Module** | TypeScript definitions | Interface/Type definitions |
| **Supabase Tables** | Multi-tenant data storage | PostgreSQL + RLS |
| **Auth Guard** | Route-level context protection | Angular Guard |

### 2.3 Data Flow

```
User Action (Click Account) 
    ↓
Context Switcher Component
    ↓
Account Context Service.setContext(account)
    ↓
State Update (BehaviorSubject)
    ↓
Subscribers React:
  - UI Updates (Active Account Display)
  - API Calls (Context-specific queries)
  - Router Guards (Permission checks)
  - Layout Changes (Context-specific menus)
```

---

## 3. TypeScript Type Definitions

### 3.1 Core Account Types

**Location:** `src/app/core/types/account.types.ts`

```typescript
/**
 * Base account interface with common properties
 */
export interface BaseAccount {
  id: string;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User account type (Personal account)
 */
export interface User extends BaseAccount {
  type: 'user';
  email: string;
  emailVerified: boolean;
  role: 'user' | 'admin';
  metadata?: Record<string, unknown>;
}

/**
 * Organization account type
 * Can contain multiple teams
 */
export interface Organization extends BaseAccount {
  type: 'organization';
  ownerId: string; // User ID who owns the org
  description?: string;
  website?: string;
  teams: Team[];
  memberCount: number;
  settings: OrganizationSettings;
}

/**
 * Team account type (sub-organization)
 * Belongs to an organization
 */
export interface Team extends BaseAccount {
  type: 'team';
  organizationId: string;
  description?: string;
  memberCount: number;
  parentTeamId?: string; // For nested teams (optional)
}

/**
 * Bot account type (automated/service accounts)
 */
export interface Bot extends BaseAccount {
  type: 'bot';
  ownerId: string; // User or Org that owns the bot
  apiKeyHash: string; // For API authentication
  permissions: string[];
  isActive: boolean;
}

/**
 * Union type for all account types
 */
export type Account = User | Organization | Team | Bot;

/**
 * Union type for tenant contexts (excludes Bot for now)
 */
export type Tenant = User | Organization | Team;

/**
 * Type guard functions
 */
export function isUser(account: Account): account is User {
  return account.type === 'user';
}

export function isOrganization(account: Account): account is Organization {
  return account.type === 'organization';
}

export function isTeam(account: Account): account is Team {
  return account.type === 'team';
}

export function isBot(account: Account): account is Bot {
  return account.type === 'bot';
}
```

### 3.2 Membership Types

```typescript
/**
 * Organization membership roles
 */
export type OrganizationRole = 'owner' | 'admin' | 'member' | 'guest';

/**
 * Team membership roles
 */
export type TeamRole = 'maintainer' | 'member';

/**
 * Organization member interface
 */
export interface OrganizationMember {
  id: string;
  userId: string;
  organizationId: string;
  role: OrganizationRole;
  joinedAt: Date;
  invitedBy?: string;
}

/**
 * Team member interface
 */
export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: TeamRole;
  joinedAt: Date;
  addedBy?: string;
}
```

### 3.3 Context State Types

```typescript
/**
 * Active context state
 */
export interface AccountContext {
  account: Account;
  permissions: string[];
  role?: OrganizationRole | TeamRole;
  isOwner: boolean;
}

/**
 * Context selection event
 */
export interface ContextChangeEvent {
  previous: Account | null;
  current: Account;
  timestamp: Date;
}

/**
 * Organization settings
 */
export interface OrganizationSettings {
  allowPublicRepositories: boolean;
  requireTwoFactor: boolean;
  defaultTeamPermissions: string[];
}
```

---

## 4. Service Layer Design

### 4.1 Account Context Service

**Location:** `src/app/core/services/account-context.service.ts`

**Responsibilities:**
- Maintain active account context
- Notify subscribers of context changes
- Persist context selection
- Load user's available accounts

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Account, AccountContext } from '../types/account.types';
import { TenantService } from './tenant.service';

@Injectable({ providedIn: 'root' })
export class AccountContextService {
  private readonly tenantService = inject(TenantService);
  
  // Current active context
  private readonly _activeContext$ = new BehaviorSubject<AccountContext | null>(null);
  
  // Observable for components to subscribe
  public readonly activeContext$: Observable<AccountContext | null> = 
    this._activeContext$.asObservable();
  
  // Available accounts for current user
  private readonly _availableAccounts$ = new BehaviorSubject<Account[]>([]);
  public readonly availableAccounts$: Observable<Account[]> = 
    this._availableAccounts$.asObservable();
  
  constructor() {
    this.initializeContext();
  }
  
  /**
   * Initialize context from storage or default to user account
   */
  private async initializeContext(): Promise<void> {
    const savedContextId = this.getSavedContextId();
    const accounts = await this.loadAvailableAccounts();
    
    this._availableAccounts$.next(accounts);
    
    if (savedContextId) {
      const account = accounts.find(a => a.id === savedContextId);
      if (account) {
        await this.setContext(account);
        return;
      }
    }
    
    // Default to user account
    const userAccount = accounts.find(a => a.type === 'user');
    if (userAccount) {
      await this.setContext(userAccount);
    }
  }
  
  /**
   * Set active account context
   */
  async setContext(account: Account): Promise<void> {
    const permissions = await this.tenantService.getUserPermissions(account.id);
    const role = await this.tenantService.getUserRole(account.id);
    const isOwner = await this.tenantService.isOwner(account.id);
    
    const context: AccountContext = {
      account,
      permissions,
      role,
      isOwner
    };
    
    this._activeContext$.next(context);
    this.saveContextId(account.id);
    
    // Emit context change event
    this.emitContextChangeEvent(account);
  }
  
  /**
   * Get current active account
   */
  getActiveAccount(): Account | null {
    return this._activeContext$.value?.account || null;
  }
  
  /**
   * Load all accounts accessible by current user
   */
  private async loadAvailableAccounts(): Promise<Account[]> {
    return await this.tenantService.getUserAccounts();
  }
  
  /**
   * Check if user has permission
   */
  hasPermission(permission: string): boolean {
    const context = this._activeContext$.value;
    return context?.permissions.includes(permission) || false;
  }
  
  /**
   * Get observable for specific account type
   */
  getAccountsByType<T extends Account>(type: Account['type']): Observable<T[]> {
    return this.availableAccounts$.pipe(
      map(accounts => accounts.filter(a => a.type === type) as T[])
    );
  }
  
  // Storage helpers
  private saveContextId(id: string): void {
    localStorage.setItem('active_context_id', id);
  }
  
  private getSavedContextId(): string | null {
    return localStorage.getItem('active_context_id');
  }
  
  private emitContextChangeEvent(account: Account): void {
    // Emit to analytics, logging, etc.
    console.log('Context switched to:', account.name, account.type);
  }
}
```

### 4.2 Key Service Methods Summary

| Method | Purpose | Returns |
|--------|---------|---------|
| `initializeContext()` | Load saved context or default to user | `Promise<void>` |
| `setContext(account)` | Switch to a different account context | `Promise<void>` |
| `getActiveAccount()` | Get currently active account | `Account \| null` |
| `hasPermission(permission)` | Check if user has a specific permission | `boolean` |
| `getAccountsByType<T>(type)` | Filter accounts by type | `Observable<T[]>` |


---

## 5. Supabase Database Schema

### 5.1 Core Tables

#### users Table
```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
```

#### organizations Table
```sql
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  description TEXT,
  website TEXT,
  member_count INTEGER DEFAULT 1,
  settings JSONB DEFAULT '{"allowPublicRepositories": true, "requireTwoFactor": false}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orgs_owner ON public.organizations(owner_id);
CREATE INDEX idx_orgs_name ON public.organizations(name);
```

#### teams Table
```sql
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  description TEXT,
  member_count INTEGER DEFAULT 0,
  parent_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_teams_org ON public.teams(organization_id);
CREATE INDEX idx_teams_parent ON public.teams(parent_team_id);
```

#### bots Table
```sql
CREATE TABLE public.bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  api_key_hash TEXT NOT NULL,
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bots_owner ON public.bots(owner_id);
CREATE INDEX idx_bots_api_key ON public.bots(api_key_hash);
```

#### org_members Table
```sql
CREATE TABLE public.org_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'guest')),
  invited_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_org_members_user ON public.org_members(user_id);
CREATE INDEX idx_org_members_org ON public.org_members(organization_id);
```

#### team_members Table
```sql
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('maintainer', 'member')),
  added_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, team_id)
);

CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
```

### 5.2 Row Level Security (RLS) Policies

#### users Policies
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view profiles"
  ON public.users FOR SELECT
  USING (auth.role() = 'authenticated');
```

#### organizations Policies
```sql
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view organization"
  ON public.organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE organization_id = id AND user_id = auth.uid()
    ) OR owner_id = auth.uid()
  );

CREATE POLICY "Owner can update organization"
  ON public.organizations FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create orgs"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND owner_id = auth.uid());

CREATE POLICY "Owner can delete organization"
  ON public.organizations FOR DELETE
  USING (owner_id = auth.uid());
```

#### teams Policies
```sql
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view team"
  ON public.teams FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE organization_id = teams.organization_id AND user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = teams.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Org admins can manage teams"
  ON public.teams FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE organization_id = teams.organization_id 
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );
```

---

## 6. Component Design

### 6.1 Context Switcher Component

**Location:** `src/app/shared/components/context-switcher/context-switcher.component.ts`

**Template Structure:**
```html
<nz-dropdown [nzDropdownMenu]="accountMenu" nzTrigger="click">
  <button nz-button nzType="text" class="context-switcher-btn">
    <nz-avatar 
      [nzSrc]="activeAccount?.avatarUrl" 
      [nzIcon]="getAccountIcon(activeAccount!)">
    </nz-avatar>
    <span class="account-name">{{ activeAccount?.name }}</span>
    <span nz-icon nzType="down"></span>
  </button>
</nz-dropdown>

<nz-dropdown-menu #accountMenu="nzDropdownMenu">
  <ul nz-menu class="context-menu">
    <!-- Personal Account -->
    <li nz-menu-item *ngIf="personalAccount" 
        (click)="switchContext(personalAccount)">
      <nz-avatar [nzIcon]="'user'"></nz-avatar>
      <span>{{ personalAccount.name }}</span>
      <span nz-icon nzType="check" *ngIf="isActive(personalAccount)"></span>
    </li>
    
    <!-- Organizations & Teams -->
    <ng-container *ngFor="let org of ownedOrganizations">
      <li nz-menu-item (click)="switchContext(org)">
        <nz-avatar [nzIcon]="'team'"></nz-avatar>
        <span>{{ org.name }}</span>
        <span nz-icon nzType="check" *ngIf="isActive(org)"></span>
      </li>
      
      <!-- Nested Teams -->
      <li nz-menu-item *ngFor="let team of org.teams" 
          class="team-item" (click)="switchContext(team)">
        <span class="indent"></span>
        <nz-avatar [nzIcon]="'usergroup-add'"></nz-avatar>
        <span>{{ team.name }}</span>
        <span nz-icon nzType="check" *ngIf="isActive(team)"></span>
      </li>
    </ng-container>
  </ul>
</nz-dropdown-menu>
```

**Component Class:**
```typescript
@Component({
  selector: 'app-context-switcher',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzAvatarModule,
    NzIconModule
  ],
  templateUrl: './context-switcher.component.html',
  styleUrls: ['./context-switcher.component.less']
})
export class ContextSwitcherComponent implements OnInit {
  private readonly contextService = inject(AccountContextService);
  
  activeAccount: Account | null = null;
  personalAccount: Account | null = null;
  ownedOrganizations: Organization[] = [];
  joinedOrganizations: Organization[] = [];
  
  ngOnInit(): void {
    this.contextService.activeContext$.subscribe(ctx => {
      this.activeAccount = ctx?.account || null;
    });
    
    this.contextService.availableAccounts$.subscribe(accounts => {
      this.groupAccounts(accounts);
    });
  }
  
  switchContext(account: Account): void {
    this.contextService.setContext(account);
  }
  
  isActive(account: Account): boolean {
    return this.activeAccount?.id === account.id;
  }
  
  private groupAccounts(accounts: Account[]): void {
    this.personalAccount = accounts.find(a => a.type === 'user') || null;
    // Group organizations...
  }
}
```

### 6.2 Integration with Layout

Update the header component to include the context switcher:

```typescript
// src/app/layout/basic/widgets/user.component.ts
@Component({
  selector: 'header-user',
  template: `
    <div class="alain-default__nav-item">
      <app-context-switcher></app-context-switcher>
    </div>
  `,
  standalone: true,
  imports: [ContextSwitcherComponent]
})
export class UserComponent {}
```

---

## 7. State Management & Data Flow

### 7.1 State Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│              Application Bootstrap                  │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│    AccountContextService.initializeContext()        │
│    1. Load saved context ID from LocalStorage       │
│    2. Fetch available accounts from Supabase        │
│    3. Set active context (saved or default)         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│           BehaviorSubject Updates                   │
│    - activeContext$                                 │
│    - availableAccounts$                             │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│             Subscribers Notified                    │
│    - UI Components                                  │
│    - Route Guards                                   │
│    - API Services                                   │
│    - Menu Configurations                            │
└─────────────────────────────────────────────────────┘
```

### 7.2 Context Persistence

- **Storage:** Browser LocalStorage
- **Key:** `active_context_id`
- **Scope:** Per browser/device
- **Fallback:** Default to user's personal account

### 7.3 Observable Pattern

```typescript
// Components subscribe to context changes
this.contextService.activeContext$
  .pipe(
    filter(ctx => ctx !== null),
    switchMap(ctx => this.loadContextData(ctx.account.id))
  )
  .subscribe(data => {
    this.updateUI(data);
  });

// Guards use context for authorization
canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
  return this.contextService.activeContext$.pipe(
    map(ctx => this.checkPermission(ctx, route.data['permission']))
  );
}
```

---

## 8. Security Considerations

### 8.1 Data Isolation

1. **Row Level Security (RLS):** All tables enforce RLS policies
2. **Tenant Scoping:** All queries filter by active context tenant_id
3. **Permission Checks:** Both frontend (UX) and backend (security) validation

### 8.2 Bot Security

1. **API Keys:** Store only hashed keys (bcrypt/argon2)
2. **Permissions:** Explicit whitelist per bot
3. **Rate Limiting:** Implement per-bot rate limits
4. **Audit Logs:** Log all bot actions with timestamps

### 8.3 Best Practices

- Never trust client-side permission checks
- Always validate on server (RLS policies)
- Use prepared statements (Supabase handles this)
- Implement CSRF protection for state-changing operations
- Regular security audits of RLS policies

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Create Supabase tables and RLS policies
- [ ] Define TypeScript types
- [ ] Implement TenantService (basic CRUD)
- [ ] Write unit tests for services

### Phase 2: Context Management (Week 3)
- [ ] Implement AccountContextService
- [ ] Add context persistence (LocalStorage)
- [ ] Create context guards
- [ ] Integration tests

### Phase 3: UI Components (Week 4)
- [ ] Implement Context Switcher component
- [ ] Design LESS styles
- [ ] Integrate with layout header
- [ ] Accessibility features (ARIA labels, keyboard nav)

### Phase 4: Integration (Week 5)
- [ ] Update existing features for context-awareness
- [ ] Refactor API calls to include tenant filters
- [ ] Update menu configurations
- [ ] E2E tests

### Phase 5: Polish & Launch (Week 6)
- [ ] Performance optimizations
- [ ] Error handling & edge cases
- [ ] Documentation
- [ ] User acceptance testing
- [ ] Production deployment

---

## 10. Testing Strategy

### 10.1 Unit Tests

```typescript
describe('AccountContextService', () => {
  it('should initialize with user account by default', async () => {
    // Test
  });
  
  it('should switch context and notify subscribers', async () => {
    // Test
  });
  
  it('should persist context to localStorage', () => {
    // Test
  });
  
  it('should load saved context on init', () => {
    // Test
  });
});
```

### 10.2 Integration Tests

```typescript
describe('Context Switcher Integration', () => {
  it('should load available accounts on mount', () => {
    // Test with Supabase mock
  });
  
  it('should switch context when account is selected', () => {
    // Test full flow
  });
});
```

### 10.3 E2E Tests

```typescript
test('should switch from personal to organization context', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('[data-testid="context-switcher"]');
  await page.click('[data-testid="org-myorg"]');
  await expect(page.locator('[data-testid="active-context"]'))
    .toContainText('My Organization');
});
```

---

## 11. Monitoring & Analytics

### 11.1 Metrics to Track

- Context switch frequency per user
- Most used contexts
- Context switch errors
- Permission denial rate
- Bot usage statistics

### 11.2 Logging

```typescript
// Log context changes
private emitContextChangeEvent(account: Account): void {
  this.analytics.track('context_switched', {
    userId: this.getUserId(),
    fromContext: this._activeContext$.value?.account.id,
    toContext: account.id,
    accountType: account.type,
    timestamp: new Date()
  });
}
```

---

## 12. Accessibility (a11y)

### 12.1 Keyboard Navigation

- **Tab:** Focus context switcher button
- **Enter/Space:** Open dropdown
- **Arrow Up/Down:** Navigate accounts
- **Enter:** Select account
- **Esc:** Close dropdown

### 12.2 ARIA Attributes

```html
<button 
  aria-label="Switch account context"
  aria-expanded="false"
  aria-haspopup="menu"
  role="button">
  <!-- Content -->
</button>

<ul role="menu" aria-label="Available accounts">
  <li role="menuitem" tabindex="0">Personal Account</li>
</ul>
```

### 12.3 Screen Reader Support

- Announce current context on page load
- Announce context changes
- Provide descriptive labels for all interactive elements

---

## 13. Internationalization (i18n)

### 13.1 Translation Keys

**File:** `src/assets/i18n/zh-TW.json`
```json
{
  "context": {
    "personal": "個人帳戶",
    "myOrganizations": "我的組織",
    "joinedOrganizations": "加入的組織",
    "createOrg": "建立組織",
    "settings": "設定",
    "switchTo": "切換至 {{name}}",
    "currentContext": "目前內容"
  }
}
```

**File:** `src/assets/i18n/en-US.json`
```json
{
  "context": {
    "personal": "Personal Account",
    "myOrganizations": "My Organizations",
    "joinedOrganizations": "Joined Organizations",
    "createOrg": "Create Organization",
    "settings": "Settings",
    "switchTo": "Switch to {{name}}",
    "currentContext": "Current Context"
  }
}
```

---

## 14. Future Enhancements

### 14.1 Short-term (3-6 months)
- [ ] Context search functionality
- [ ] Recent contexts quick access
- [ ] Context-specific notifications
- [ ] Workspace templates per context

### 14.2 Long-term (6-12 months)
- [ ] Multi-level team hierarchies
- [ ] Advanced bot permissions (OAuth)
- [ ] Context analytics dashboard
- [ ] Custom context badges/tags
- [ ] Context-specific themes

---

## 15. References & Resources

### 15.1 External Documentation
- [GitHub Organizations](https://docs.github.com/en/organizations)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Angular Standalone Components](https://angular.dev/guide/components)
- [ng-alain Documentation](https://ng-alain.com)
- [ng-zorro-antd](https://ng.ant.design/)

### 15.2 Internal Resources
- TenantFlow-lin repository (reference implementation)
- ng-alain-gighub repository (base template)

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **Account** | Generic term for User, Organization, Team, or Bot |
| **Context** | Active account from which user is operating |
| **Tenant** | Entity that owns resources (User, Org, Team) |
| **Organization** | Group account that can contain teams |
| **Team** | Sub-group within an organization |
| **Bot** | Automated service account |
| **RLS** | Row Level Security (Supabase feature) |
| **RBAC** | Role-Based Access Control |

---

## 17. Conclusion

This design document provides a comprehensive blueprint for implementing an Account Organization Context Switcher in the ng-alain Angular application. The design follows industry best practices from GitHub and adapts them to the Angular + ng-alain + Supabase stack.

### Key Takeaways

1. ✅ **Type Safety:** Full TypeScript definitions for all account types
2. ✅ **Security:** RLS policies ensure data isolation per context
3. ✅ **Scalability:** Hierarchical structure (Org → Teams)
4. ✅ **UX:** GitHub-inspired familiar user experience
5. ✅ **Maintainability:** Clear service-oriented architecture
6. ✅ **Performance:** Caching and lazy loading strategies

### Next Steps

1. **Review:** Gather feedback from stakeholders
2. **Refine:** Adjust design based on feedback
3. **Implement:** Follow phased implementation roadmap
4. **Test:** Comprehensive test coverage (unit, integration, E2E)
5. **Deploy:** Gradual rollout with monitoring

---

**Document Version:** 1.0  
**Last Updated:** 2025-11-23  
**Status:** Ready for Review

---

_This document is a living document and will be updated as the implementation progresses._
