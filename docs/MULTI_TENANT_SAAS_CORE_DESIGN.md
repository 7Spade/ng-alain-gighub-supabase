# Multi-Tenant SaaS Core Design Document
# 多租戶 SaaS 核心設計文件

## Document Information | 文件資訊

**Version:** 1.0  
**Date:** 2025-11-23  
**Status:** Complete Design Specification  
**Authors:** GitHub Copilot Agent  
**Project:** ng-alain-gighub-supabase  

**References:**
- [Account Context Switcher Design](./ACCOUNT_CONTEXT_SWITCHER_DESIGN.md)
- [Blueprint Container Planning](./BLUEPRINT_CONTAINER_PLANNING.md)
- [Supabase RLS Documentation](./supabase/security/rls.md)
- [Security Standards](./specs/00-security-standards.md)

---

## Table of Contents | 目錄

1. [Executive Summary](#1-executive-summary)
2. [Account & Identity Management](#2-account--identity-management)
3. [Workspace & Blueprint System](#3-workspace--blueprint-system)
4. [Data Isolation & Security](#4-data-isolation--security)
5. [Audit Log System](#5-audit-log-system)
6. [API & Middleware Layer](#6-api--middleware-layer)
7. [Observability & Operations](#7-observability--operations)
8. [Implementation Roadmap](#8-implementation-roadmap)
9. [Database Schema](#9-database-schema)
10. [Security Best Practices](#10-security-best-practices)

---

## 1. Executive Summary | 執行摘要

### 1.1 Purpose | 目的

This document defines the complete architecture for a **Multi-Tenant SaaS** platform based on the ng-alain-gighub-supabase project. It addresses the six core design pillars required for enterprise-grade SaaS applications.

本文件定義基於 ng-alain-gighub-supabase 專案的**多租戶 SaaS** 平台完整架構，解決企業級 SaaS 應用所需的六大核心設計支柱。

### 1.2 Current State Analysis | 現狀分析

#### Implemented Features | 已實現功能 ✅

1. **Basic Multi-Tenant Structure** (40% complete)
   - User, Organization, Team account types
   - Context switching UI component
   - Basic RLS policies

2. **Workspace Foundation** (30% complete)
   - Workspace/Blueprint data models
   - Context-aware data access
   - Basic isolation patterns

#### Missing Critical Features | 缺失的關鍵功能 ❌

1. **Authentication & Authorization** (0% complete)
   - Multi-Factor Authentication (MFA)
   - Single Sign-On (SSO / OAuth)
   - Account lifecycle management
   - User metadata system

2. **Audit Log System** (0% complete)
   - Comprehensive activity tracking
   - Immutable log storage
   - Compliance reporting
   - Anomaly detection

3. **API Security Layer** (0% complete)
   - Rate limiting & throttling
   - Tenant context middleware
   - API versioning
   - Request tracing

4. **Observability** (0% complete)
   - Metrics collection
   - Resource usage tracking
   - Error isolation
   - Backup & disaster recovery

### 1.3 Design Goals | 設計目標

- ✅ **Complete Coverage**: Address all 6 core SaaS pillars
- ✅ **Enterprise Grade**: Production-ready security and compliance
- ✅ **Scalable**: Support thousands of tenants
- ✅ **Observable**: Complete visibility into system behavior
- ✅ **Maintainable**: Clear architecture and documentation

---

## 2. Account & Identity Management | 帳號與身份管理

### 2.1 Account Types | 帳號類型

#### 2.1.1 Supported Account Types

```typescript
// src/app/core/types/account.types.ts
export enum AccountType {
  USER = 'user',           // Personal account | 個人帳戶
  ORGANIZATION = 'organization', // Organization account | 組織帳戶
  TEAM = 'team',           // Team account | 團隊帳戶
  BOT = 'bot'              // Bot/Service account | 機器人帳戶
}

export interface BaseAccount {
  id: string;
  type: AccountType;
  name: string;
  avatarUrl?: string;
  status: AccountStatus;  // NEW: Status management
  metadata: AccountMetadata; // NEW: Extended metadata
  createdAt: Date;
  updatedAt: Date;
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  DELETED = 'deleted'
}

export interface AccountMetadata {
  department?: string;
  position?: string;
  location?: string;
  timezone?: string;
  language?: string;
  customFields?: Record<string, unknown>;
}
```

#### 2.1.2 Account Hierarchy | 帳號層級結構

```
User (Personal)
└── Organizations (多個組織)
    ├── Teams (多個團隊)
    │   └── Sub-Teams (可選的子團隊)
    └── Bots (組織機器人)
```

### 2.2 Multi-Factor Authentication (MFA) | 多因素驗證

#### 2.2.1 MFA Architecture

```typescript
// src/app/core/types/mfa.types.ts
export enum MFAMethod {
  TOTP = 'totp',           // Time-based OTP (Google Authenticator)
  SMS = 'sms',             // SMS verification
  EMAIL = 'email',         // Email verification
  WEBAUTHN = 'webauthn'    // Hardware keys (YubiKey)
}

export interface MFAConfig {
  userId: string;
  method: MFAMethod;
  enabled: boolean;
  verified: boolean;
  secret?: string;          // Encrypted TOTP secret
  backupCodes?: string[];   // Encrypted backup codes
  lastUsedAt?: Date;
  createdAt: Date;
}

export interface MFAVerificationRequest {
  userId: string;
  method: MFAMethod;
  code: string;
  trustDevice?: boolean;
}
```

#### 2.2.2 MFA Database Schema

```sql
-- MFA Configuration Table
CREATE TABLE public.mfa_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL CHECK (method IN ('totp', 'sms', 'email', 'webauthn')),
  enabled BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  secret_encrypted TEXT, -- Encrypted with application key
  backup_codes_encrypted TEXT[], -- Array of encrypted backup codes
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, method)
);

CREATE INDEX idx_mfa_configs_user ON public.mfa_configs(user_id);
CREATE INDEX idx_mfa_configs_enabled ON public.mfa_configs(user_id, enabled) WHERE enabled = TRUE;

-- MFA Verification Attempts (for rate limiting)
CREATE TABLE public.mfa_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  method TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mfa_attempts_user_time ON public.mfa_attempts(user_id, attempted_at DESC);
```

#### 2.2.3 MFA Service Implementation

```typescript
// src/app/core/services/mfa.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MFAService {
  private readonly supabase = inject(SupabaseClient);

  /**
   * Enable TOTP MFA for user
   */
  enableTOTP(userId: string): Observable<{ secret: string; qrCode: string }> {
    return from(
      this.supabase.rpc('enable_totp_mfa', { p_user_id: userId })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      })
    );
  }

  /**
   * Verify TOTP code and activate MFA
   */
  verifyTOTP(userId: string, code: string): Observable<boolean> {
    return from(
      this.supabase.rpc('verify_totp_code', {
        p_user_id: userId,
        p_code: code
      })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      })
    );
  }

  /**
   * Check if MFA is required for user
   */
  isMFARequired(userId: string): Observable<boolean> {
    return from(
      this.supabase
        .from('mfa_configs')
        .select('enabled')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single()
    ).pipe(
      map(response => !!response.data)
    );
  }
}
```

### 2.3 Single Sign-On (SSO) | 單點登入

#### 2.3.1 Supported SSO Providers

```typescript
export enum SSOProvider {
  GOOGLE = 'google',
  GITHUB = 'github',
  MICROSOFT = 'microsoft',
  SAML = 'saml',
  OIDC = 'oidc'
}

export interface SSOConfig {
  organizationId: string;
  provider: SSOProvider;
  enabled: boolean;
  clientId: string;
  clientSecret?: string;  // Encrypted
  domain?: string;        // For SAML/OIDC
  metadataUrl?: string;
  enforceSSO: boolean;    // Require SSO for all org members
  autoProvision: boolean; // Auto-create accounts
  createdAt: Date;
  updatedAt: Date;
}
```

#### 2.3.2 SSO Database Schema

```sql
-- SSO Configuration (Organization-level)
CREATE TABLE public.sso_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'github', 'microsoft', 'saml', 'oidc')),
  enabled BOOLEAN DEFAULT FALSE,
  client_id TEXT NOT NULL,
  client_secret_encrypted TEXT,
  domain TEXT,
  metadata_url TEXT,
  enforce_sso BOOLEAN DEFAULT FALSE,
  auto_provision BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, provider)
);

CREATE INDEX idx_sso_configs_org ON public.sso_configs(organization_id);

-- SSO User Mappings
CREATE TABLE public.sso_user_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sso_config_id UUID NOT NULL REFERENCES public.sso_configs(id) ON DELETE CASCADE,
  provider_user_id TEXT NOT NULL,
  provider_email TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sso_config_id, provider_user_id)
);

CREATE INDEX idx_sso_mappings_user ON public.sso_user_mappings(user_id);
CREATE INDEX idx_sso_mappings_provider ON public.sso_user_mappings(sso_config_id, provider_user_id);
```

### 2.4 Account Lifecycle Management | 帳號生命週期管理

#### 2.4.1 Invitation System | 邀請系統

```typescript
export interface InvitationModel {
  id: string;
  inviterUserId: string;
  inviteeEmail: string;
  targetType: 'organization' | 'team';
  targetId: string;
  role: string;
  status: InvitationStatus;
  token: string;
  expiresAt: Date;
  acceptedAt?: Date;
  createdAt: Date;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  REVOKED = 'revoked'
}
```

#### 2.4.2 Invitation Database Schema

```sql
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inviter_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('organization', 'team')),
  target_id UUID NOT NULL,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_email ON public.invitations(invitee_email);
CREATE INDEX idx_invitations_token ON public.invitations(token);
CREATE INDEX idx_invitations_status ON public.invitations(status) WHERE status = 'pending';
```

#### 2.4.3 Offboarding Process | 離職流程

```typescript
export interface OffboardingProcess {
  userId: string;
  initiatedBy: string;
  organizationId?: string;
  steps: OffboardingStep[];
  status: OffboardingStatus;
  completedAt?: Date;
  createdAt: Date;
}

export interface OffboardingStep {
  name: string;
  description: string;
  completed: boolean;
  completedAt?: Date;
}

export enum OffboardingStatus {
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Example offboarding steps:
const OFFBOARDING_STEPS: OffboardingStep[] = [
  { name: 'revoke_access', description: 'Revoke all access permissions' },
  { name: 'transfer_ownership', description: 'Transfer owned resources' },
  { name: 'export_data', description: 'Export user data' },
  { name: 'delete_credentials', description: 'Delete API keys and tokens' },
  { name: 'archive_account', description: 'Archive account data' }
];
```

---

## 3. Workspace & Blueprint System | 工作區與藍圖系統

### 3.1 Enhanced Workspace Features | 增強的工作區功能

#### 3.1.1 Version Control & History | 版本控制與歷史紀錄

```typescript
export interface WorkspaceVersion {
  id: string;
  workspaceId: string;
  version: number;
  changes: VersionChange[];
  createdBy: string;
  createdAt: Date;
  description?: string;
  tags?: string[];
}

export interface VersionChange {
  type: 'task' | 'log' | 'storage' | 'settings';
  action: 'create' | 'update' | 'delete';
  resourceId: string;
  previousValue?: unknown;
  newValue?: unknown;
}

export interface BlueprintTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
  ownerId: string;
  structure: BlueprintStructure;
  usageCount: number;
  rating: number;
  createdAt: Date;
}

export interface BlueprintStructure {
  tasks: TaskTemplate[];
  logs: LogTemplate[];
  dashboard: DashboardConfig;
  storage: StorageConfig;
}
```

#### 3.1.2 Version Control Database Schema

```sql
CREATE TABLE public.workspace_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  changes JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id),
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, version)
);

CREATE INDEX idx_workspace_versions_workspace ON public.workspace_versions(workspace_id, version DESC);
CREATE INDEX idx_workspace_versions_created ON public.workspace_versions(created_at DESC);

-- Blueprint Templates
CREATE TABLE public.blueprint_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  is_public BOOLEAN DEFAULT FALSE,
  owner_id UUID NOT NULL REFERENCES public.users(id),
  structure JSONB NOT NULL,
  usage_count INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_blueprint_templates_public ON public.blueprint_templates(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_blueprint_templates_category ON public.blueprint_templates(category);
CREATE INDEX idx_blueprint_templates_owner ON public.blueprint_templates(owner_id);
```

### 3.2 Sharing & Collaboration | 共享與協作

#### 3.2.1 Sharing Models

```typescript
export enum SharingScope {
  PRIVATE = 'private',           // Only owner
  ORGANIZATION = 'organization', // All org members
  TEAM = 'team',                 // Specific team
  PUBLIC = 'public',             // Anyone with link
  CUSTOM = 'custom'              // Custom permissions
}

export interface SharingConfig {
  workspaceId: string;
  scope: SharingScope;
  targetId?: string;  // Organization ID or Team ID
  permissions: Permission[];
  allowedUsers?: string[];
  allowedDomains?: string[];
  expiresAt?: Date;
  createdAt: Date;
}

export interface Permission {
  action: 'view' | 'edit' | 'comment' | 'admin';
  granted: boolean;
}

export interface CollaboratorModel {
  id: string;
  workspaceId: string;
  userId: string;
  role: CollaboratorRole;
  permissions: Permission[];
  invitedBy: string;
  joinedAt: Date;
}

export enum CollaboratorRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
  COMMENTER = 'commenter'
}
```

#### 3.2.2 Sharing Database Schema

```sql
CREATE TABLE public.workspace_sharing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('private', 'organization', 'team', 'public', 'custom')),
  target_id UUID,
  permissions JSONB NOT NULL,
  allowed_users UUID[],
  allowed_domains TEXT[],
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workspace_sharing_workspace ON public.workspace_sharing(workspace_id);
CREATE INDEX idx_workspace_sharing_scope ON public.workspace_sharing(scope);

CREATE TABLE public.workspace_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'editor', 'viewer', 'commenter')),
  permissions JSONB NOT NULL,
  invited_by UUID NOT NULL REFERENCES public.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_workspace_collaborators_workspace ON public.workspace_collaborators(workspace_id);
CREATE INDEX idx_workspace_collaborators_user ON public.workspace_collaborators(user_id);
```

### 3.3 Notification & Subscription | 通知與訂閱

#### 3.3.1 Notification System

```typescript
export interface NotificationModel {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedResource?: ResourceReference;
  read: boolean;
  archived: boolean;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  COMMENT_ADDED = 'comment_added',
  WORKSPACE_SHARED = 'workspace_shared',
  INVITATION_RECEIVED = 'invitation_received',
  SYSTEM_ALERT = 'system_alert'
}

export interface SubscriptionModel {
  id: string;
  userId: string;
  resourceType: 'workspace' | 'blueprint' | 'task';
  resourceId: string;
  events: NotificationType[];
  channels: NotificationChannel[];
  enabled: boolean;
  createdAt: Date;
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
  WEBHOOK = 'webhook'
}
```

#### 3.3.2 Notification Database Schema

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_resource JSONB,
  read BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = FALSE;

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('workspace', 'blueprint', 'task')),
  resource_id UUID NOT NULL,
  events TEXT[] NOT NULL,
  channels TEXT[] NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_type, resource_id)
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_resource ON public.subscriptions(resource_type, resource_id);
```

### 3.4 Global Search & Filtering | 全局搜索與過濾

#### 3.4.1 Search System Architecture

```typescript
export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  tenantScope?: TenantScope;
  pagination: PaginationOptions;
  sortBy?: SortOptions;
}

export interface SearchFilters {
  types?: ('workspace' | 'task' | 'log' | 'document')[];
  dateRange?: DateRange;
  owners?: string[];
  tags?: string[];
  status?: string[];
}

export interface TenantScope {
  type: 'user' | 'organization' | 'team';
  id: string;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  excerpt: string;
  relevance: number;
  highlights: string[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 3.4.2 Search Database Schema (PostgreSQL Full-Text Search)

```sql
-- Full-text search configuration
CREATE TABLE public.search_index (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  tenant_type TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  search_vector TSVECTOR,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generate search vector automatically
CREATE INDEX idx_search_vector ON public.search_index USING GIN(search_vector);
CREATE INDEX idx_search_tenant ON public.search_index(tenant_type, tenant_id);
CREATE INDEX idx_search_resource ON public.search_index(resource_type, resource_id);

-- Trigger to update search vector
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_update_search_vector
BEFORE INSERT OR UPDATE ON public.search_index
FOR EACH ROW EXECUTE FUNCTION update_search_vector();
```


---

## 4. Data Isolation & Security | 資料隔離與安全

### 4.1 Tenant Context Middleware | 租戶上下文中介層

#### 4.1.1 Middleware Architecture

```typescript
// src/app/core/interceptors/tenant-context.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { WorkspaceContextFacade } from '@core';

export const tenantContextInterceptor: HttpInterceptorFn = (req, next) => {
  const contextFacade = inject(WorkspaceContextFacade);
  
  const contextType = contextFacade.contextType();
  const contextId = contextFacade.contextId();
  
  // Only add tenant context for API requests
  if (req.url.includes('/api/') || req.url.includes('supabase')) {
    const clonedReq = req.clone({
      setHeaders: {
        'X-Tenant-Type': contextType,
        'X-Tenant-ID': contextId || '',
        'X-Request-ID': generateRequestId()
      }
    });
    return next(clonedReq);
  }
  
  return next(req);
};

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
```

#### 4.1.2 Supabase Edge Function Middleware

```typescript
// supabase/functions/_shared/tenant-middleware.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface TenantContext {
  type: 'user' | 'organization' | 'team';
  id: string;
  userId: string;
}

export async function validateTenantContext(
  supabase: SupabaseClient,
  headers: Headers
): Promise<TenantContext> {
  const tenantType = headers.get('X-Tenant-Type');
  const tenantId = headers.get('X-Tenant-ID');
  const authHeader = headers.get('Authorization');
  
  if (!tenantType || !tenantId) {
    throw new Error('Missing tenant context headers');
  }
  
  // Get authenticated user
  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader?.replace('Bearer ', '')
  );
  
  if (error || !user) {
    throw new Error('Unauthorized');
  }
  
  // Validate user has access to tenant
  const hasAccess = await verifyTenantAccess(supabase, user.id, tenantType, tenantId);
  if (!hasAccess) {
    throw new Error('Forbidden: No access to requested tenant');
  }
  
  return {
    type: tenantType as TenantContext['type'],
    id: tenantId,
    userId: user.id
  };
}

async function verifyTenantAccess(
  supabase: SupabaseClient,
  userId: string,
  tenantType: string,
  tenantId: string
): Promise<boolean> {
  switch (tenantType) {
    case 'user':
      return userId === tenantId;
    
    case 'organization':
      const { data: orgMember } = await supabase
        .from('org_members')
        .select('id')
        .eq('user_id', userId)
        .eq('organization_id', tenantId)
        .single();
      return !!orgMember;
    
    case 'team':
      const { data: teamMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('user_id', userId)
        .eq('team_id', tenantId)
        .single();
      return !!teamMember;
    
    default:
      return false;
  }
}
```

### 4.2 Row-Level Security Enhanced | 增強的行級安全

#### 4.2.1 Multi-Tenant RLS Patterns

```sql
-- Pattern 1: User-Owned Resources
CREATE POLICY "Users can only access own resources"
  ON public.user_resources FOR ALL
  USING (owner_id = auth.uid());

-- Pattern 2: Organization-Scoped Resources
CREATE POLICY "Organization members can access org resources"
  ON public.org_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.org_members
      WHERE organization_id = org_resources.organization_id
      AND user_id = auth.uid()
    )
  );

-- Pattern 3: Team-Scoped Resources
CREATE POLICY "Team members can access team resources"
  ON public.team_resources FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = team_resources.team_id
      AND user_id = auth.uid()
    )
  );

-- Pattern 4: Hierarchical Access (Org → Team → User)
CREATE POLICY "Hierarchical tenant access"
  ON public.hierarchical_resources FOR SELECT
  USING (
    -- Direct ownership
    owner_id = auth.uid()
    OR
    -- Team membership
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_id = hierarchical_resources.team_id
      AND user_id = auth.uid()
    )
    OR
    -- Organization membership (includes all teams)
    EXISTS (
      SELECT 1 FROM public.org_members om
      JOIN public.teams t ON t.organization_id = om.organization_id
      WHERE t.id = hierarchical_resources.team_id
      AND om.user_id = auth.uid()
    )
  );
```

### 4.3 Cross-Tenant Access Prevention | 跨租戶存取防護

#### 4.3.1 Database Functions for Access Control

```sql
-- Function to check if user can access resource across tenants
CREATE OR REPLACE FUNCTION can_access_resource(
  p_user_id UUID,
  p_resource_tenant_type TEXT,
  p_resource_tenant_id UUID,
  p_required_permission TEXT DEFAULT 'read'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_access BOOLEAN := FALSE;
BEGIN
  -- Check based on tenant type
  CASE p_resource_tenant_type
    WHEN 'user' THEN
      v_has_access := (p_user_id = p_resource_tenant_id);
    
    WHEN 'organization' THEN
      SELECT EXISTS (
        SELECT 1 FROM public.org_members
        WHERE user_id = p_user_id
        AND organization_id = p_resource_tenant_id
        AND (
          CASE p_required_permission
            WHEN 'read' THEN TRUE
            WHEN 'write' THEN role IN ('owner', 'admin', 'member')
            WHEN 'admin' THEN role IN ('owner', 'admin')
            WHEN 'owner' THEN role = 'owner'
            ELSE FALSE
          END
        )
      ) INTO v_has_access;
    
    WHEN 'team' THEN
      SELECT EXISTS (
        SELECT 1 FROM public.team_members
        WHERE user_id = p_user_id
        AND team_id = p_resource_tenant_id
        AND (
          CASE p_required_permission
            WHEN 'read' THEN TRUE
            WHEN 'write' THEN role IN ('maintainer', 'member')
            WHEN 'admin' THEN role = 'maintainer'
            ELSE FALSE
          END
        )
      ) INTO v_has_access;
    
    ELSE
      v_has_access := FALSE;
  END CASE;
  
  RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4.4 Data Encryption | 資料加密

#### 4.4.1 Encryption Strategy

```typescript
// src/app/core/services/encryption.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EncryptionService {
  private readonly algorithm = 'AES-GCM';
  private readonly keyLength = 256;
  
  /**
   * Encrypt sensitive data before storing
   */
  async encrypt(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);
    
    return btoa(String.fromCharCode(...combined));
  }
  
  /**
   * Decrypt sensitive data
   */
  async decrypt(encryptedData: string, key: CryptoKey): Promise<string> {
    const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      key,
      data
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  }
  
  /**
   * Generate encryption key from password
   */
  async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: this.algorithm, length: this.keyLength },
      false,
      ['encrypt', 'decrypt']
    );
  }
}
```

#### 4.4.2 Encryption at Rest (Supabase)

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive columns
CREATE TABLE public.encrypted_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id),
  data_type TEXT NOT NULL,
  encrypted_value BYTEA NOT NULL,  -- Encrypted with pgcrypto
  encryption_key_id TEXT NOT NULL,
  iv BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to encrypt data
CREATE OR REPLACE FUNCTION encrypt_data(
  p_plaintext TEXT,
  p_key TEXT
)
RETURNS BYTEA AS $$
BEGIN
  RETURN pgp_sym_encrypt(p_plaintext, p_key);
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt data
CREATE OR REPLACE FUNCTION decrypt_data(
  p_encrypted BYTEA,
  p_key TEXT
)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(p_encrypted, p_key);
END;
$$ LANGUAGE plpgsql;
```

### 4.5 Resource Quotas | 資源配額

#### 4.5.1 Quota Management

```typescript
export interface TenantQuota {
  tenantId: string;
  tenantType: 'user' | 'organization' | 'team';
  limits: QuotaLimits;
  usage: QuotaUsage;
  period: 'hourly' | 'daily' | 'monthly';
  resetAt: Date;
}

export interface QuotaLimits {
  maxWorkspaces: number;
  maxTasks: number;
  maxStorageGB: number;
  maxAPICallsPerHour: number;
  maxCollaborators: number;
  maxTeams?: number;  // For organizations
}

export interface QuotaUsage {
  workspaces: number;
  tasks: number;
  storageGB: number;
  apiCallsThisHour: number;
  collaborators: number;
  teams?: number;
}
```

#### 4.5.2 Quota Database Schema

```sql
CREATE TABLE public.tenant_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('user', 'organization', 'team')),
  limits JSONB NOT NULL,
  usage JSONB NOT NULL,
  period TEXT DEFAULT 'monthly' CHECK (period IN ('hourly', 'daily', 'monthly')),
  reset_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, tenant_type)
);

CREATE INDEX idx_tenant_quotas_tenant ON public.tenant_quotas(tenant_id, tenant_type);
CREATE INDEX idx_tenant_quotas_reset ON public.tenant_quotas(reset_at) WHERE reset_at < NOW();

-- Function to check quota before resource creation
CREATE OR REPLACE FUNCTION check_quota(
  p_tenant_id UUID,
  p_tenant_type TEXT,
  p_resource_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_limit INTEGER;
  v_usage INTEGER;
BEGIN
  SELECT 
    (limits->>p_resource_type)::INTEGER,
    (usage->>p_resource_type)::INTEGER
  INTO v_limit, v_usage
  FROM public.tenant_quotas
  WHERE tenant_id = p_tenant_id AND tenant_type = p_tenant_type;
  
  IF v_usage IS NULL THEN
    RETURN TRUE;  -- No quota set
  END IF;
  
  RETURN v_usage < v_limit;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Audit Log System | 審計日誌系統

### 5.1 Audit Log Architecture | 審計日誌架構

#### 5.1.1 Audit Event Model

```typescript
export interface AuditLogEntry {
  id: string;
  tenantId: string;
  tenantType: 'user' | 'organization' | 'team';
  userId: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  changes?: AuditChanges;
  metadata: AuditMetadata;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  hash: string;  // For immutability verification
}

export enum AuditAction {
  // CRUD Operations
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  
  // Authentication
  LOGIN = 'login',
  LOGOUT = 'logout',
  LOGIN_FAILED = 'login_failed',
  PASSWORD_CHANGED = 'password_changed',
  MFA_ENABLED = 'mfa_enabled',
  MFA_DISABLED = 'mfa_disabled',
  
  // Authorization
  PERMISSION_GRANTED = 'permission_granted',
  PERMISSION_REVOKED = 'permission_revoked',
  ROLE_CHANGED = 'role_changed',
  
  // Workspace Operations
  WORKSPACE_CREATED = 'workspace_created',
  WORKSPACE_DELETED = 'workspace_deleted',
  WORKSPACE_SHARED = 'workspace_shared',
  
  // Blueprint Operations
  BLUEPRINT_CREATED = 'blueprint_created',
  BLUEPRINT_CLONED = 'blueprint_cloned',
  BLUEPRINT_PUBLISHED = 'blueprint_published',
  
  // Task Operations
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_COMPLETED = 'task_completed',
  TASK_DELETED = 'task_deleted',
  
  // Storage Operations
  FILE_UPLOADED = 'file_uploaded',
  FILE_DOWNLOADED = 'file_downloaded',
  FILE_DELETED = 'file_deleted',
  
  // Account Operations
  USER_INVITED = 'user_invited',
  USER_JOINED = 'user_joined',
  USER_REMOVED = 'user_removed',
  ACCOUNT_SUSPENDED = 'account_suspended',
  ACCOUNT_ACTIVATED = 'account_activated'
}

export interface AuditChanges {
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  fields?: string[];
}

export interface AuditMetadata {
  source: 'web' | 'api' | 'mobile' | 'system';
  version?: string;
  requestId?: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}
```

#### 5.1.2 Audit Log Database Schema

```sql
-- Main audit log table (append-only, immutable)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('user', 'organization', 'team')),
  user_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  metadata JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  hash TEXT NOT NULL,  -- SHA256 hash for integrity
  previous_hash TEXT,  -- Hash of previous log entry (blockchain-style)
  CONSTRAINT no_updates CHECK (false)  -- Prevent updates
);

-- Indexes for efficient querying
CREATE INDEX idx_audit_logs_tenant ON public.audit_logs(tenant_id, tenant_type, timestamp DESC);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, timestamp DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id, timestamp DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action, timestamp DESC);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- Prevent updates and deletes
CREATE RULE audit_logs_no_update AS ON UPDATE TO public.audit_logs DO INSTEAD NOTHING;
CREATE RULE audit_logs_no_delete AS ON DELETE TO public.audit_logs DO INSTEAD NOTHING;

-- Function to compute hash for integrity
CREATE OR REPLACE FUNCTION compute_audit_hash(
  p_entry JSONB
)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(p_entry::TEXT, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to set hash before insert
CREATE OR REPLACE FUNCTION set_audit_hash()
RETURNS TRIGGER AS $$
DECLARE
  v_entry JSONB;
  v_previous_hash TEXT;
BEGIN
  -- Get previous hash
  SELECT hash INTO v_previous_hash
  FROM public.audit_logs
  WHERE tenant_id = NEW.tenant_id
  ORDER BY timestamp DESC
  LIMIT 1;
  
  -- Build entry for hashing
  v_entry := jsonb_build_object(
    'tenant_id', NEW.tenant_id,
    'user_id', NEW.user_id,
    'action', NEW.action,
    'resource_type', NEW.resource_type,
    'resource_id', NEW.resource_id,
    'timestamp', NEW.timestamp,
    'previous_hash', v_previous_hash
  );
  
  NEW.previous_hash := v_previous_hash;
  NEW.hash := compute_audit_hash(v_entry);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_set_audit_hash
BEFORE INSERT ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION set_audit_hash();
```

### 5.2 Audit Log Service | 審計日誌服務

#### 5.2.1 Service Implementation

```typescript
// src/app/core/services/audit-log.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { WorkspaceContextFacade } from '@core';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private readonly supabase = inject(SupabaseClient);
  private readonly contextFacade = inject(WorkspaceContextFacade);
  
  /**
   * Log an audit event
   */
  log(
    action: AuditAction,
    resourceType: string,
    resourceId: string,
    changes?: AuditChanges,
    metadata?: Record<string, unknown>
  ): Observable<void> {
    const contextType = this.contextFacade.contextType();
    const contextId = this.contextFacade.contextId();
    const userId = this.contextFacade.currentUserAccountId();
    
    return from(
      this.supabase.from('audit_logs').insert({
        tenant_id: contextId,
        tenant_type: contextType,
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        changes,
        metadata: {
          source: 'web',
          version: '1.0',
          ...metadata
        }
      })
    ).pipe(
      map(response => {
        if (response.error) {
          console.error('Failed to log audit event:', response.error);
        }
      })
    );
  }
  
  /**
   * Query audit logs
   */
  query(filter: AuditLogFilter): Observable<AuditLogEntry[]> {
    let query = this.supabase
      .from('audit_logs')
      .select('*');
    
    if (filter.tenantId) {
      query = query.eq('tenant_id', filter.tenantId);
    }
    
    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    
    if (filter.action) {
      query = query.eq('action', filter.action);
    }
    
    if (filter.resourceType) {
      query = query.eq('resource_type', filter.resourceType);
    }
    
    if (filter.dateFrom) {
      query = query.gte('timestamp', filter.dateFrom.toISOString());
    }
    
    if (filter.dateTo) {
      query = query.lte('timestamp', filter.dateTo.toISOString());
    }
    
    query = query.order('timestamp', { ascending: false }).limit(filter.limit || 100);
    
    return from(query).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data as AuditLogEntry[];
      })
    );
  }
  
  /**
   * Verify audit log integrity
   */
  verifyIntegrity(tenantId: string): Observable<boolean> {
    return from(
      this.supabase.rpc('verify_audit_log_integrity', {
        p_tenant_id: tenantId
      })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data;
      })
    );
  }
}

export interface AuditLogFilter {
  tenantId?: string;
  userId?: string;
  action?: AuditAction;
  resourceType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}
```

### 5.3 Audit Log Retention Policy | 日誌保留策略

```sql
-- Partition audit logs by month for efficient management
CREATE TABLE public.audit_logs_2025_01 PARTITION OF public.audit_logs
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Function to create new partitions automatically
CREATE OR REPLACE FUNCTION create_audit_log_partition()
RETURNS VOID AS $$
DECLARE
  v_start_date DATE;
  v_end_date DATE;
  v_partition_name TEXT;
BEGIN
  v_start_date := date_trunc('month', NOW() + INTERVAL '1 month');
  v_end_date := v_start_date + INTERVAL '1 month';
  v_partition_name := 'audit_logs_' || to_char(v_start_date, 'YYYY_MM');
  
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS public.%I PARTITION OF public.audit_logs FOR VALUES FROM (%L) TO (%L)',
    v_partition_name,
    v_start_date,
    v_end_date
  );
END;
$$ LANGUAGE plpgsql;

-- Archive old logs (move to cold storage after 1 year)
CREATE TABLE public.audit_logs_archive (
  LIKE public.audit_logs INCLUDING ALL
);

-- Function to archive old logs
CREATE OR REPLACE FUNCTION archive_old_audit_logs(
  p_retention_months INTEGER DEFAULT 12
)
RETURNS INTEGER AS $$
DECLARE
  v_cutoff_date TIMESTAMPTZ;
  v_archived_count INTEGER;
BEGIN
  v_cutoff_date := NOW() - (p_retention_months || ' months')::INTERVAL;
  
  WITH archived AS (
    INSERT INTO public.audit_logs_archive
    SELECT * FROM public.audit_logs
    WHERE timestamp < v_cutoff_date
    RETURNING 1
  )
  SELECT count(*) INTO v_archived_count FROM archived;
  
  -- Note: Actual deletion requires manual intervention for safety
  RETURN v_archived_count;
END;
$$ LANGUAGE plpgsql;
```

### 5.4 Anomaly Detection | 異常行為偵測

```typescript
export interface AnomalyDetectionRule {
  id: string;
  name: string;
  description: string;
  condition: AnomalyCondition;
  threshold: number;
  timeWindow: number;  // in seconds
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: AnomalyAction[];
  enabled: boolean;
}

export interface AnomalyCondition {
  type: 'rate_limit' | 'unusual_access' | 'privilege_escalation' | 'data_exfiltration';
  filters: Record<string, unknown>;
}

export interface AnomalyAction {
  type: 'notify' | 'block' | 'flag' | 'log';
  config: Record<string, unknown>;
}

// Example rules
const ANOMALY_RULES: AnomalyDetectionRule[] = [
  {
    id: 'failed-login-attempts',
    name: 'Multiple Failed Login Attempts',
    description: 'Detect brute force attacks',
    condition: {
      type: 'rate_limit',
      filters: { action: 'login_failed' }
    },
    threshold: 5,
    timeWindow: 300,  // 5 minutes
    severity: 'high',
    actions: [
      { type: 'block', config: { duration: 900 } },  // Block for 15 minutes
      { type: 'notify', config: { channels: ['email', 'slack'] } }
    ],
    enabled: true
  },
  {
    id: 'unusual-download-volume',
    name: 'Unusual Data Download Volume',
    description: 'Detect potential data exfiltration',
    condition: {
      type: 'data_exfiltration',
      filters: { action: 'file_downloaded' }
    },
    threshold: 100,  // 100 files
    timeWindow: 3600,  // 1 hour
    severity: 'critical',
    actions: [
      { type: 'flag', config: {} },
      { type: 'notify', config: { channels: ['email', 'slack', 'pagerduty'] } }
    ],
    enabled: true
  }
];
```

#### 5.4.1 Anomaly Detection Database Schema

```sql
CREATE TABLE public.anomaly_detection_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  condition JSONB NOT NULL,
  threshold INTEGER NOT NULL,
  time_window INTEGER NOT NULL,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.anomaly_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES public.anomaly_detection_rules(id),
  tenant_id UUID NOT NULL,
  user_id UUID,
  severity TEXT NOT NULL,
  description TEXT NOT NULL,
  audit_log_ids UUID[],
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_anomaly_alerts_tenant ON public.anomaly_alerts(tenant_id, created_at DESC);
CREATE INDEX idx_anomaly_alerts_unresolved ON public.anomaly_alerts(resolved) WHERE resolved = FALSE;
```


---

## 6. API & Middleware Layer | API 與中介層

### 6.1 Rate Limiting & Throttling | 速率限制與節流

#### 6.1.1 Rate Limiting Strategy

```typescript
export interface RateLimitConfig {
  tenantId: string;
  endpoint: string;
  limit: number;
  window: number;  // in seconds
  strategy: 'fixed_window' | 'sliding_window' | 'token_bucket';
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}
```

#### 6.1.2 Rate Limiting Implementation (Edge Function)

```typescript
// supabase/functions/_shared/rate-limiter.ts
import { createClient } from '@supabase/supabase-js';

export class RateLimiter {
  constructor(private supabase: SupabaseClient) {}
  
  async checkLimit(
    tenantId: string,
    endpoint: string,
    limit: number = 100,
    window: number = 3600
  ): Promise<RateLimitStatus> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - window;
    const key = `ratelimit:${tenantId}:${endpoint}`;
    
    // Get current count from database
    const { data: requests, error } = await this.supabase
      .from('rate_limit_requests')
      .select('count')
      .eq('key', key)
      .gte('timestamp', windowStart)
      .single();
    
    const currentCount = requests?.count || 0;
    const remaining = Math.max(0, limit - currentCount);
    const allowed = remaining > 0;
    
    if (allowed) {
      // Increment counter
      await this.supabase.from('rate_limit_requests').insert({
        key,
        tenant_id: tenantId,
        endpoint,
        timestamp: now
      });
    }
    
    return {
      allowed,
      remaining,
      resetAt: new Date((Math.floor(now / window) + 1) * window * 1000),
      retryAfter: allowed ? undefined : window - (now - windowStart)
    };
  }
}
```

#### 6.1.3 Rate Limiting Database Schema

```sql
CREATE TABLE public.rate_limit_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_key_time ON public.rate_limit_requests(key, timestamp);
CREATE INDEX idx_rate_limit_tenant ON public.rate_limit_requests(tenant_id, timestamp);

-- Cleanup old records (run periodically)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_records()
RETURNS VOID AS $$
BEGIN
  DELETE FROM public.rate_limit_requests
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;
```

### 6.2 API Versioning | API 版本控制

#### 6.2.1 Versioning Strategy

```typescript
// src/app/core/services/api-version.service.ts
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class APIVersionService {
  private readonly defaultVersion = 'v1';
  private currentVersion = this.defaultVersion;
  
  /**
   * Get API version headers
   */
  getVersionHeaders(): HttpHeaders {
    return new HttpHeaders({
      'API-Version': this.currentVersion,
      'Accept': `application/vnd.app.${this.currentVersion}+json`
    });
  }
  
  /**
   * Set API version
   */
  setVersion(version: string): void {
    this.currentVersion = version;
  }
  
  /**
   * Get current version
   */
  getVersion(): string {
    return this.currentVersion;
  }
}
```

#### 6.2.2 API Version Compatibility Matrix

| Version | Release Date | Status | Support End | Breaking Changes |
|---------|-------------|--------|-------------|------------------|
| v1      | 2025-01-01  | Stable | 2026-01-01  | N/A (Initial)    |
| v2      | 2025-06-01  | Beta   | TBD         | Auth flow changes |

### 6.3 Request Tracing | 請求追蹤

#### 6.3.1 Distributed Tracing

```typescript
export interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  timestamp: Date;
  duration?: number;
  tags: Record<string, string>;
}

export interface RequestTrace {
  traceId: string;
  method: string;
  url: string;
  tenantId: string;
  userId: string;
  spans: TraceSpan[];
  totalDuration: number;
  status: number;
  error?: string;
  createdAt: Date;
}

export interface TraceSpan {
  spanId: string;
  parentSpanId?: string;
  name: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  tags: Record<string, string>;
  logs?: TraceLog[];
}

export interface TraceLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, unknown>;
}
```

#### 6.3.2 Tracing Database Schema

```sql
CREATE TABLE public.request_traces (
  trace_id UUID PRIMARY KEY,
  method TEXT NOT NULL,
  url TEXT NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID,
  spans JSONB NOT NULL,
  total_duration INTEGER NOT NULL,  -- in milliseconds
  status INTEGER NOT NULL,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_request_traces_tenant ON public.request_traces(tenant_id, created_at DESC);
CREATE INDEX idx_request_traces_user ON public.request_traces(user_id, created_at DESC);
CREATE INDEX idx_request_traces_error ON public.request_traces(status) WHERE status >= 400;
```

---

## 7. Observability & Operations | 可觀測性與運維

### 7.1 Metrics Collection | 指標收集

#### 7.1.1 Key Metrics

```typescript
export interface TenantMetrics {
  tenantId: string;
  tenantType: 'user' | 'organization' | 'team';
  period: Date;
  metrics: {
    // Resource Usage
    activeUsers: number;
    storageUsedGB: number;
    apiCallsCount: number;
    workspaceCount: number;
    taskCount: number;
    
    // Performance
    avgResponseTimeMs: number;
    p95ResponseTimeMs: number;
    p99ResponseTimeMs: number;
    errorRate: number;
    
    // Engagement
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    
    // Feature Usage
    featureUsage: Record<string, number>;
  };
  createdAt: Date;
}
```

#### 7.1.2 Metrics Database Schema

```sql
CREATE TABLE public.tenant_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL CHECK (tenant_type IN ('user', 'organization', 'team')),
  period TIMESTAMPTZ NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, period)
);

CREATE INDEX idx_tenant_metrics_tenant ON public.tenant_metrics(tenant_id, period DESC);
CREATE INDEX idx_tenant_metrics_period ON public.tenant_metrics(period DESC);

-- Aggregate function to compute metrics
CREATE OR REPLACE FUNCTION compute_tenant_metrics(
  p_tenant_id UUID,
  p_period_start TIMESTAMPTZ,
  p_period_end TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
  v_metrics JSONB;
BEGIN
  SELECT jsonb_build_object(
    'activeUsers', COUNT(DISTINCT user_id),
    'apiCallsCount', COUNT(*),
    'avgResponseTimeMs', AVG(total_duration),
    'errorRate', COUNT(*) FILTER (WHERE status >= 400)::FLOAT / COUNT(*)
  )
  INTO v_metrics
  FROM public.request_traces
  WHERE tenant_id = p_tenant_id
  AND created_at BETWEEN p_period_start AND p_period_end;
  
  RETURN v_metrics;
END;
$$ LANGUAGE plpgsql;
```

### 7.2 Resource Usage Tracking | 資源使用追蹤

#### 7.2.1 Storage Usage Tracking

```sql
CREATE TABLE public.storage_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  tenant_type TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  file_count INTEGER NOT NULL,
  total_size_bytes BIGINT NOT NULL,
  snapshot_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_storage_usage_tenant ON public.storage_usage(tenant_id, snapshot_at DESC);

-- Function to compute storage usage
CREATE OR REPLACE FUNCTION compute_storage_usage(
  p_tenant_id UUID,
  p_tenant_type TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_usage JSONB;
BEGIN
  SELECT jsonb_build_object(
    'fileCount', COUNT(*),
    'totalSizeGB', SUM(size_bytes)::FLOAT / (1024*1024*1024)
  )
  INTO v_usage
  FROM storage.objects
  WHERE bucket_id = 'tenant-files'
  AND (metadata->>'tenantId')::UUID = p_tenant_id;
  
  RETURN v_usage;
END;
$$ LANGUAGE plpgsql;
```

### 7.3 Multi-Tenant Error Isolation | 多租戶錯誤隔離

#### 7.3.1 Error Isolation Strategy

```typescript
export interface TenantHealthStatus {
  tenantId: string;
  status: 'healthy' | 'degraded' | 'critical';
  checks: HealthCheck[];
  lastChecked: Date;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  timestamp: Date;
}

// Health checks to run per tenant
const HEALTH_CHECKS = [
  {
    name: 'database_connectivity',
    check: async (tenantId: string) => {
      // Check if tenant can query database
      const result = await supabase
        .from('workspaces')
        .select('count')
        .eq('owner_id', tenantId)
        .single();
      return result.error ? 'fail' : 'pass';
    }
  },
  {
    name: 'storage_accessibility',
    check: async (tenantId: string) => {
      // Check if tenant can access storage
      const { data, error } = await supabase.storage
        .from('tenant-files')
        .list(`${tenantId}/`);
      return error ? 'fail' : 'pass';
    }
  },
  {
    name: 'quota_compliance',
    check: async (tenantId: string) => {
      // Check if tenant is within quota
      const usage = await getQuotaUsage(tenantId);
      const limits = await getQuotaLimits(tenantId);
      return usage < limits * 0.9 ? 'pass' : 'warn';
    }
  }
];
```

### 7.4 Backup & Disaster Recovery | 備份與災難恢復

#### 7.4.1 Backup Strategy

```typescript
export interface BackupPolicy {
  tenantId: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  retention: number;  // in days
  includeStorage: boolean;
  encrypted: boolean;
  destinations: BackupDestination[];
}

export interface BackupDestination {
  type: 's3' | 'gcs' | 'azure';
  bucket: string;
  region: string;
  credentials: string;  // Encrypted reference
}

export interface BackupJob {
  id: string;
  tenantId: string;
  type: 'full' | 'incremental';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  size: number;  // in bytes
  location: string;
  error?: string;
}
```

#### 7.4.2 Backup Database Schema

```sql
CREATE TABLE public.backup_policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL UNIQUE,
  frequency TEXT NOT NULL CHECK (frequency IN ('hourly', 'daily', 'weekly')),
  retention INTEGER NOT NULL,
  include_storage BOOLEAN DEFAULT TRUE,
  encrypted BOOLEAN DEFAULT TRUE,
  destinations JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.backup_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.backup_policies(tenant_id),
  type TEXT NOT NULL CHECK (type IN ('full', 'incremental')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  size_bytes BIGINT,
  location TEXT,
  error TEXT
);

CREATE INDEX idx_backup_jobs_tenant ON public.backup_jobs(tenant_id, started_at DESC);
CREATE INDEX idx_backup_jobs_status ON public.backup_jobs(status) WHERE status IN ('pending', 'running');
```

---

## 8. Implementation Roadmap | 實施路線圖

### Phase 1: Foundation (Weeks 1-2) | 基礎建設

- [ ] Complete MFA/SSO authentication system
- [ ] Implement tenant context middleware
- [ ] Set up audit log infrastructure
- [ ] Deploy rate limiting mechanisms

### Phase 2: Security Hardening (Weeks 3-4) | 安全加固

- [ ] Enhance RLS policies
- [ ] Implement encryption services
- [ ] Deploy quota management
- [ ] Set up anomaly detection

### Phase 3: Observability (Weeks 5-6) | 可觀測性

- [ ] Deploy metrics collection
- [ ] Implement request tracing
- [ ] Set up health checks
- [ ] Configure alerting

### Phase 4: Operations (Weeks 7-8) | 運維

- [ ] Implement backup system
- [ ] Deploy disaster recovery procedures
- [ ] Set up monitoring dashboards
- [ ] Document runbooks

### Phase 5: Optimization (Weeks 9-10) | 優化

- [ ] Performance tuning
- [ ] Cost optimization
- [ ] Load testing
- [ ] Production readiness review

---

## 9. Database Schema Summary | 資料庫架構總結

### Complete Table List (40 tables)

#### Account Management (6 tables)
- users
- organizations
- teams
- bots
- org_members
- team_members

#### Authentication & Authorization (4 tables)
- mfa_configs
- mfa_attempts
- sso_configs
- sso_user_mappings

#### Workspace & Collaboration (8 tables)
- workspaces
- blueprints
- workspace_versions
- blueprint_templates
- workspace_sharing
- workspace_collaborators
- notifications
- subscriptions

#### Security & Compliance (10 tables)
- audit_logs (partitioned)
- audit_logs_archive
- anomaly_detection_rules
- anomaly_alerts
- encrypted_data
- tenant_quotas
- invitations
- offboarding_processes (optional)
- search_index
- rate_limit_requests

#### Observability & Operations (8 tables)
- request_traces
- tenant_metrics
- storage_usage
- backup_policies
- backup_jobs
- tenant_health_checks (optional)
- error_logs (optional)
- performance_metrics (optional)

#### Tasks & Workflows (4 tables - from existing design)
- tasks
- task_dependencies
- task_assignments
- task_comments

---

## 10. Security Best Practices | 安全最佳實踐

### 10.1 Authentication Best Practices

1. ✅ Enforce strong password policies (min 12 chars, complexity)
2. ✅ Require MFA for admin/owner accounts
3. ✅ Implement account lockout after 5 failed attempts
4. ✅ Use secure session management with httpOnly cookies
5. ✅ Rotate JWT tokens every 15 minutes

### 10.2 Authorization Best Practices

1. ✅ Always validate tenant context on backend
2. ✅ Never trust client-side permission checks
3. ✅ Use RLS policies as last line of defense
4. ✅ Implement principle of least privilege
5. ✅ Regular audit of permission assignments

### 10.3 Data Protection Best Practices

1. ✅ Encrypt sensitive data at rest and in transit
2. ✅ Use separate encryption keys per tenant
3. ✅ Implement secure key rotation procedures
4. ✅ Anonymize/pseudonymize PII where possible
5. ✅ Regular security audits and penetration testing

### 10.4 Compliance Best Practices

1. ✅ GDPR: Right to access, rectification, erasure
2. ✅ SOC 2: Audit logs, access controls, monitoring
3. ✅ HIPAA: Encryption, audit trails, access logs (if applicable)
4. ✅ ISO 27001: Information security management
5. ✅ Regular compliance assessments

---

## Conclusion | 結論

This comprehensive Multi-Tenant SaaS Core Design document addresses all six critical pillars:

1. ✅ **Account & Identity Management** - Complete with MFA, SSO, lifecycle management
2. ✅ **Workspace & Blueprint System** - Enhanced with versioning, sharing, notifications
3. ✅ **Data Isolation & Security** - Multi-layered with middleware, RLS, encryption
4. ✅ **Audit Log System** - Immutable, traceable, with anomaly detection
5. ✅ **API & Middleware Layer** - Rate limiting, versioning, tracing
6. ✅ **Observability & Operations** - Metrics, monitoring, backup/recovery

### Next Steps

1. Review and approve this design document
2. Prioritize implementation phases based on business needs
3. Allocate development resources (estimated 10 weeks)
4. Begin Phase 1: Foundation implementation
5. Continuous iteration and improvement

---

**Document Status:** ✅ Complete  
**Last Updated:** 2025-11-23  
**Version:** 1.0  
**Maintainers:** Development Team, Security Team, Operations Team

