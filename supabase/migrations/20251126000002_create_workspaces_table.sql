-- Migration: Create workspaces table
-- Purpose: Create the workspaces table for workspace instances (instantiated from blueprints)
-- Created: 2025-11-26
-- Phase: Blueprint Feature Setup
--
-- This table stores workspace instances that can be created from blueprints.
-- Following vertical slice architecture and Account Context integration.

-- ============================================================================
-- CREATE WORKSPACES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Blueprint reference (optional - workspace can be created without blueprint)
    blueprint_id UUID REFERENCES public.blueprints(id) ON DELETE SET NULL,
    blueprint_version INTEGER,

    -- Ownership (Account Context Integration)
    tenant_id UUID NOT NULL,
    tenant_type TEXT NOT NULL,

    -- Status and settings
    status TEXT NOT NULL DEFAULT 'active',
    settings JSONB NOT NULL DEFAULT '{"allowGuestAccess": false, "requireApprovalForJoin": true, "defaultMemberRole": "member", "enableTaskComments": true, "enableFileSharing": true, "enableNotifications": true}',

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT workspaces_status_check CHECK (
        status = ANY(ARRAY['active', 'archived', 'template'])
    ),
    CONSTRAINT workspaces_tenant_type_check CHECK (
        tenant_type = ANY(ARRAY['user', 'organization', 'team'])
    ),
    CONSTRAINT workspaces_name_length CHECK (
        char_length(name) >= 1 AND char_length(name) <= 255
    )
);

-- Table comment
COMMENT ON TABLE public.workspaces IS 'Workspace instances that can be created from blueprints. Follows Account Context integration for multi-tenant support.';

-- Column comments
COMMENT ON COLUMN public.workspaces.id IS 'Unique identifier for the workspace';
COMMENT ON COLUMN public.workspaces.name IS 'Workspace name (1-255 characters)';
COMMENT ON COLUMN public.workspaces.description IS 'Workspace description';
COMMENT ON COLUMN public.workspaces.blueprint_id IS 'Reference to the source blueprint (null if created without template)';
COMMENT ON COLUMN public.workspaces.blueprint_version IS 'Version of the blueprint used to create this workspace';
COMMENT ON COLUMN public.workspaces.tenant_id IS 'Tenant ID (user, organization, or team ID)';
COMMENT ON COLUMN public.workspaces.tenant_type IS 'Tenant type: user, organization, team';
COMMENT ON COLUMN public.workspaces.status IS 'Workspace status: active, archived, template';
COMMENT ON COLUMN public.workspaces.settings IS 'JSONB settings for the workspace';
COMMENT ON COLUMN public.workspaces.created_at IS 'Timestamp when workspace was created';
COMMENT ON COLUMN public.workspaces.updated_at IS 'Timestamp when workspace was last updated';
COMMENT ON COLUMN public.workspaces.archived_at IS 'Timestamp when workspace was archived (null if active)';

-- ============================================================================
-- CREATE WORKSPACE_MEMBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    invited_by UUID,

    -- Constraints
    CONSTRAINT workspace_members_role_check CHECK (
        role = ANY(ARRAY['owner', 'admin', 'member', 'viewer'])
    ),
    CONSTRAINT unique_workspace_user UNIQUE(workspace_id, user_id)
);

-- Table comment
COMMENT ON TABLE public.workspace_members IS 'Workspace membership tracking with role-based access control';

-- Column comments
COMMENT ON COLUMN public.workspace_members.id IS 'Unique identifier for the membership record';
COMMENT ON COLUMN public.workspace_members.workspace_id IS 'Reference to the workspace';
COMMENT ON COLUMN public.workspace_members.user_id IS 'Reference to the user account';
COMMENT ON COLUMN public.workspace_members.role IS 'Member role: owner, admin, member, viewer';
COMMENT ON COLUMN public.workspace_members.joined_at IS 'Timestamp when user joined the workspace';
COMMENT ON COLUMN public.workspace_members.invited_by IS 'User ID who invited this member';

-- ============================================================================
-- CREATE INDEXES FOR WORKSPACES
-- ============================================================================

-- Index for tenant-based queries (most common access pattern)
CREATE INDEX idx_workspaces_tenant ON public.workspaces(tenant_id, tenant_type);

-- Index for status filtering
CREATE INDEX idx_workspaces_status ON public.workspaces(status);

-- Index for blueprint reference
CREATE INDEX idx_workspaces_blueprint ON public.workspaces(blueprint_id);

-- Composite index for active workspaces per tenant
CREATE INDEX idx_workspaces_tenant_active ON public.workspaces(tenant_id, tenant_type, status)
    WHERE status = 'active';

-- ============================================================================
-- CREATE INDEXES FOR WORKSPACE_MEMBERS
-- ============================================================================

-- Index for workspace member lookup
CREATE INDEX idx_workspace_members_workspace ON public.workspace_members(workspace_id);

-- Index for user membership lookup
CREATE INDEX idx_workspace_members_user ON public.workspace_members(user_id);

-- ============================================================================
-- CREATE TRIGGERS FOR updated_at
-- ============================================================================

CREATE OR REPLACE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES FOR WORKSPACES
-- ============================================================================

-- Policy: View own workspaces (user owns the workspace)
CREATE POLICY "users_view_own_workspaces" ON public.workspaces
FOR SELECT
TO authenticated
USING (
    tenant_type = 'user'
    AND tenant_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_view_own_workspaces" ON public.workspaces IS
'Allows users to view their own workspaces';

-- Policy: View organization workspaces (user is member of the organization)
CREATE POLICY "org_members_view_org_workspaces" ON public.workspaces
FOR SELECT
TO authenticated
USING (
    tenant_type = 'organization'
    AND public.is_org_member(tenant_id)
);

COMMENT ON POLICY "org_members_view_org_workspaces" ON public.workspaces IS
'Allows organization members to view organization workspaces';

-- Policy: View team workspaces (user is member of the team)
CREATE POLICY "team_members_view_team_workspaces" ON public.workspaces
FOR SELECT
TO authenticated
USING (
    tenant_type = 'team'
    AND public.is_team_member(tenant_id)
);

COMMENT ON POLICY "team_members_view_team_workspaces" ON public.workspaces IS
'Allows team members to view team workspaces';

-- Policy: View workspaces where user is a member
CREATE POLICY "workspace_members_view_workspaces" ON public.workspaces
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = id
        AND user_id = public.get_user_account_id()
    )
);

COMMENT ON POLICY "workspace_members_view_workspaces" ON public.workspaces IS
'Allows workspace members to view workspaces they belong to';

-- Policy: Create workspaces for own user account
CREATE POLICY "users_insert_own_workspaces" ON public.workspaces
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_type = 'user'
    AND tenant_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_insert_own_workspaces" ON public.workspaces IS
'Allows users to create workspaces for their own account';

-- Policy: Create workspaces for organization (must be admin/owner)
CREATE POLICY "org_admins_insert_org_workspaces" ON public.workspaces
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_type = 'organization'
    AND public.is_org_admin(tenant_id)
);

COMMENT ON POLICY "org_admins_insert_org_workspaces" ON public.workspaces IS
'Allows organization admins/owners to create workspaces for their organization';

-- Policy: Create workspaces for team (must be leader)
CREATE POLICY "team_leaders_insert_team_workspaces" ON public.workspaces
FOR INSERT
TO authenticated
WITH CHECK (
    tenant_type = 'team'
    AND public.is_team_leader(tenant_id)
);

COMMENT ON POLICY "team_leaders_insert_team_workspaces" ON public.workspaces IS
'Allows team leaders to create workspaces for their team';

-- Policy: Update own user workspaces
CREATE POLICY "users_update_own_workspaces" ON public.workspaces
FOR UPDATE
TO authenticated
USING (
    tenant_type = 'user'
    AND tenant_id = public.get_user_account_id()
)
WITH CHECK (
    tenant_type = 'user'
    AND tenant_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_update_own_workspaces" ON public.workspaces IS
'Allows users to update their own workspaces';

-- Policy: Update organization workspaces (must be admin/owner)
CREATE POLICY "org_admins_update_org_workspaces" ON public.workspaces
FOR UPDATE
TO authenticated
USING (
    tenant_type = 'organization'
    AND public.is_org_admin(tenant_id)
)
WITH CHECK (
    tenant_type = 'organization'
    AND public.is_org_admin(tenant_id)
);

COMMENT ON POLICY "org_admins_update_org_workspaces" ON public.workspaces IS
'Allows organization admins/owners to update organization workspaces';

-- Policy: Update team workspaces (must be leader)
CREATE POLICY "team_leaders_update_team_workspaces" ON public.workspaces
FOR UPDATE
TO authenticated
USING (
    tenant_type = 'team'
    AND public.is_team_leader(tenant_id)
)
WITH CHECK (
    tenant_type = 'team'
    AND public.is_team_leader(tenant_id)
);

COMMENT ON POLICY "team_leaders_update_team_workspaces" ON public.workspaces IS
'Allows team leaders to update team workspaces';

-- Policy: Delete own user workspaces
CREATE POLICY "users_delete_own_workspaces" ON public.workspaces
FOR DELETE
TO authenticated
USING (
    tenant_type = 'user'
    AND tenant_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_delete_own_workspaces" ON public.workspaces IS
'Allows users to delete their own workspaces';

-- Policy: Delete organization workspaces (must be admin/owner)
CREATE POLICY "org_admins_delete_org_workspaces" ON public.workspaces
FOR DELETE
TO authenticated
USING (
    tenant_type = 'organization'
    AND public.is_org_admin(tenant_id)
);

COMMENT ON POLICY "org_admins_delete_org_workspaces" ON public.workspaces IS
'Allows organization admins/owners to delete organization workspaces';

-- Policy: Delete team workspaces (must be leader)
CREATE POLICY "team_leaders_delete_team_workspaces" ON public.workspaces
FOR DELETE
TO authenticated
USING (
    tenant_type = 'team'
    AND public.is_team_leader(tenant_id)
);

COMMENT ON POLICY "team_leaders_delete_team_workspaces" ON public.workspaces IS
'Allows team leaders to delete team workspaces';

-- ============================================================================
-- RLS POLICIES FOR WORKSPACE_MEMBERS
-- ============================================================================

-- Policy: View workspace members (must be a member of the workspace)
CREATE POLICY "workspace_members_view_members" ON public.workspace_members
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_id
        AND wm.user_id = public.get_user_account_id()
    )
);

COMMENT ON POLICY "workspace_members_view_members" ON public.workspace_members IS
'Allows workspace members to view other members of the same workspace';

-- Policy: Insert workspace members (must be owner/admin of the workspace)
CREATE POLICY "workspace_admins_insert_members" ON public.workspace_members
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_id
        AND wm.user_id = public.get_user_account_id()
        AND wm.role IN ('owner', 'admin')
    )
);

COMMENT ON POLICY "workspace_admins_insert_members" ON public.workspace_members IS
'Allows workspace owners/admins to add new members';

-- Policy: Update workspace members (must be owner/admin of the workspace)
CREATE POLICY "workspace_admins_update_members" ON public.workspace_members
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_id
        AND wm.user_id = public.get_user_account_id()
        AND wm.role IN ('owner', 'admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_id
        AND wm.user_id = public.get_user_account_id()
        AND wm.role IN ('owner', 'admin')
    )
);

COMMENT ON POLICY "workspace_admins_update_members" ON public.workspace_members IS
'Allows workspace owners/admins to update member roles';

-- Policy: Delete workspace members (must be owner/admin of the workspace, or removing self)
CREATE POLICY "workspace_admins_delete_members" ON public.workspace_members
FOR DELETE
TO authenticated
USING (
    -- Self-removal or admin removal
    user_id = public.get_user_account_id()
    OR EXISTS (
        SELECT 1 FROM public.workspace_members wm
        WHERE wm.workspace_id = workspace_id
        AND wm.user_id = public.get_user_account_id()
        AND wm.role IN ('owner', 'admin')
    )
);

COMMENT ON POLICY "workspace_admins_delete_members" ON public.workspace_members IS
'Allows workspace owners/admins to remove members, or members to remove themselves';

-- ============================================================================
-- TRIGGER: Increment blueprint usage_count when workspace is created from blueprint
-- ============================================================================

CREATE OR REPLACE FUNCTION public.increment_blueprint_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.blueprint_id IS NOT NULL THEN
        UPDATE public.blueprints
        SET usage_count = usage_count + 1
        WHERE id = NEW.blueprint_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER increment_blueprint_usage_on_workspace_create
    AFTER INSERT ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_blueprint_usage();

COMMENT ON FUNCTION public.increment_blueprint_usage() IS
'Automatically increments the usage_count of a blueprint when a workspace is created from it';
