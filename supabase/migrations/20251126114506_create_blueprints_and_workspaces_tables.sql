-- Migration: Create blueprints and workspaces tables
-- Description: Creates the blueprints and workspaces tables for the Blueprint Container feature
-- Following the existing database conventions and Account Context integration

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Blueprint visibility enum
CREATE TYPE blueprint_visibility AS ENUM ('private', 'organization', 'team', 'public');

-- Blueprint status enum  
CREATE TYPE blueprint_status AS ENUM ('draft', 'published', 'archived');

-- Blueprint category enum
CREATE TYPE blueprint_category AS ENUM ('software_development', 'marketing', 'sales', 'hr', 'operations', 'custom');

-- Owner type enum (for Account Context integration)
CREATE TYPE owner_type AS ENUM ('user', 'organization', 'team');

-- Workspace status enum
CREATE TYPE workspace_status AS ENUM ('active', 'archived', 'template');

-- Tenant type enum (for Account Context integration)
CREATE TYPE tenant_type AS ENUM ('user', 'organization', 'team');

-- Workspace member role enum
CREATE TYPE workspace_member_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- =============================================================================
-- BLUEPRINTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.blueprints (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    
    -- Classification
    category blueprint_category NOT NULL DEFAULT 'custom',
    visibility blueprint_visibility NOT NULL DEFAULT 'private',
    status blueprint_status NOT NULL DEFAULT 'draft',
    
    -- Ownership (Account Context Integration)
    -- owner_id references the account (user, organization, or team)
    owner_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    owner_type owner_type NOT NULL DEFAULT 'user',
    
    -- Blueprint structure definition (JSONB - extensible)
    structure JSONB NOT NULL DEFAULT '{"settings": {"allowGuestAccess": false, "requireApprovalForJoin": true, "defaultMemberRole": "member", "enableTaskComments": true, "enableFileSharing": true, "enableNotifications": true}}',
    
    -- Metadata
    version INTEGER NOT NULL DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    icon_url TEXT,
    thumbnail_url TEXT,
    
    -- Statistics
    usage_count INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(2,1),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT blueprints_name_check CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
    CONSTRAINT blueprints_rating_check CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5))
);

-- Create indexes for blueprints
CREATE INDEX idx_blueprints_owner_id ON public.blueprints(owner_id);
CREATE INDEX idx_blueprints_category ON public.blueprints(category);
CREATE INDEX idx_blueprints_visibility ON public.blueprints(visibility);
CREATE INDEX idx_blueprints_status ON public.blueprints(status);
CREATE INDEX idx_blueprints_owner_type ON public.blueprints(owner_type);
CREATE INDEX idx_blueprints_created_at ON public.blueprints(created_at DESC);

-- Add comments
COMMENT ON TABLE public.blueprints IS 'Blueprint templates for workspace creation. Part of the Blueprint Container (邏輯容器) system.';
COMMENT ON COLUMN public.blueprints.owner_id IS 'References accounts.id - can be a user, organization, or team account';
COMMENT ON COLUMN public.blueprints.owner_type IS 'Type of owner: user, organization, or team';
COMMENT ON COLUMN public.blueprints.structure IS 'JSONB containing blueprint structure: tasks, folders, settings, automations, etc.';

-- =============================================================================
-- WORKSPACES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspaces (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Blueprint reference (optional - workspace can be created without blueprint)
    blueprint_id UUID REFERENCES public.blueprints(id) ON DELETE SET NULL,
    blueprint_version INTEGER,
    
    -- Ownership (Account Context Integration)
    -- tenant_id references the account that owns this workspace instance
    tenant_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    tenant_type tenant_type NOT NULL DEFAULT 'user',
    
    -- Status
    status workspace_status NOT NULL DEFAULT 'active',
    settings JSONB NOT NULL DEFAULT '{"allowGuestAccess": false, "requireApprovalForJoin": true, "defaultMemberRole": "member", "enableTaskComments": true, "enableFileSharing": true, "enableNotifications": true}',
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT workspaces_name_check CHECK (char_length(name) >= 1 AND char_length(name) <= 200)
);

-- Create indexes for workspaces
CREATE INDEX idx_workspaces_tenant_id ON public.workspaces(tenant_id);
CREATE INDEX idx_workspaces_blueprint_id ON public.workspaces(blueprint_id);
CREATE INDEX idx_workspaces_status ON public.workspaces(status);
CREATE INDEX idx_workspaces_tenant_type ON public.workspaces(tenant_type);
CREATE INDEX idx_workspaces_created_at ON public.workspaces(created_at DESC);

-- Add comments
COMMENT ON TABLE public.workspaces IS 'Workspace instances - created from blueprints or standalone. Part of the Blueprint Container system.';
COMMENT ON COLUMN public.workspaces.blueprint_id IS 'References the blueprint this workspace was created from (optional)';
COMMENT ON COLUMN public.workspaces.tenant_id IS 'References accounts.id - the account that owns this workspace';
COMMENT ON COLUMN public.workspaces.tenant_type IS 'Type of tenant: user, organization, or team';

-- =============================================================================
-- WORKSPACE MEMBERS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.workspace_members (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
    
    -- Role
    role workspace_member_role NOT NULL DEFAULT 'member',
    
    -- Metadata
    invited_by UUID REFERENCES public.accounts(id) ON DELETE SET NULL,
    
    -- Timestamps
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Constraints: Each account can only be a member once per workspace
    CONSTRAINT workspace_members_unique UNIQUE (workspace_id, account_id)
);

-- Create indexes for workspace_members
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_account_id ON public.workspace_members(account_id);
CREATE INDEX idx_workspace_members_role ON public.workspace_members(role);

-- Add comments
COMMENT ON TABLE public.workspace_members IS 'Workspace membership tracking - links accounts to workspaces with roles.';
COMMENT ON COLUMN public.workspace_members.account_id IS 'References accounts.id - the member account';
COMMENT ON COLUMN public.workspace_members.invited_by IS 'References accounts.id - who invited this member';

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Trigger function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for blueprints
CREATE TRIGGER update_blueprints_updated_at
    BEFORE UPDATE ON public.blueprints
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for workspaces
CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- TRIGGER: INCREMENT BLUEPRINT USAGE COUNT
-- =============================================================================

CREATE OR REPLACE FUNCTION increment_blueprint_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.blueprint_id IS NOT NULL THEN
        UPDATE public.blueprints
        SET usage_count = usage_count + 1
        WHERE id = NEW.blueprint_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_blueprint_usage_on_workspace_create
    AFTER INSERT ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION increment_blueprint_usage_count();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- RLS POLICIES FOR BLUEPRINTS
-- =============================================================================

-- SELECT: Users can view their own blueprints
CREATE POLICY "users_view_own_blueprints" ON public.blueprints
    FOR SELECT
    USING (owner_id = public.get_user_account_id());

-- SELECT: Users can view public published blueprints
CREATE POLICY "users_view_public_blueprints" ON public.blueprints
    FOR SELECT
    USING (visibility = 'public' AND status = 'published');

-- SELECT: Organization members can view organization blueprints
CREATE POLICY "org_members_view_org_blueprints" ON public.blueprints
    FOR SELECT
    USING (
        owner_type = 'organization' 
        AND visibility IN ('organization', 'public')
        AND owner_id IN (
            SELECT organization_id 
            FROM public.organization_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- SELECT: Team members can view team blueprints
CREATE POLICY "team_members_view_team_blueprints" ON public.blueprints
    FOR SELECT
    USING (
        owner_type = 'team' 
        AND visibility IN ('team', 'organization', 'public')
        AND owner_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- INSERT: Users can create blueprints for themselves
CREATE POLICY "users_create_own_blueprints" ON public.blueprints
    FOR INSERT
    WITH CHECK (
        owner_id = public.get_user_account_id() 
        AND owner_type = 'user'
    );

-- INSERT: Org admins can create blueprints for their organizations
CREATE POLICY "org_admins_create_org_blueprints" ON public.blueprints
    FOR INSERT
    WITH CHECK (
        owner_type = 'organization'
        AND public.is_org_admin(owner_id)
    );

-- INSERT: Team leaders can create blueprints for their teams
CREATE POLICY "team_leaders_create_team_blueprints" ON public.blueprints
    FOR INSERT
    WITH CHECK (
        owner_type = 'team'
        AND owner_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'leader'
        )
    );

-- UPDATE: Users can update their own blueprints
CREATE POLICY "users_update_own_blueprints" ON public.blueprints
    FOR UPDATE
    USING (owner_id = public.get_user_account_id() AND owner_type = 'user')
    WITH CHECK (owner_id = public.get_user_account_id() AND owner_type = 'user');

-- UPDATE: Org admins can update organization blueprints
CREATE POLICY "org_admins_update_org_blueprints" ON public.blueprints
    FOR UPDATE
    USING (owner_type = 'organization' AND public.is_org_admin(owner_id))
    WITH CHECK (owner_type = 'organization' AND public.is_org_admin(owner_id));

-- UPDATE: Team leaders can update team blueprints
CREATE POLICY "team_leaders_update_team_blueprints" ON public.blueprints
    FOR UPDATE
    USING (
        owner_type = 'team'
        AND owner_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'leader'
        )
    )
    WITH CHECK (
        owner_type = 'team'
        AND owner_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'leader'
        )
    );

-- DELETE: Users can delete their own blueprints
CREATE POLICY "users_delete_own_blueprints" ON public.blueprints
    FOR DELETE
    USING (owner_id = public.get_user_account_id() AND owner_type = 'user');

-- DELETE: Org admins can delete organization blueprints
CREATE POLICY "org_admins_delete_org_blueprints" ON public.blueprints
    FOR DELETE
    USING (owner_type = 'organization' AND public.is_org_admin(owner_id));

-- DELETE: Team leaders can delete team blueprints
CREATE POLICY "team_leaders_delete_team_blueprints" ON public.blueprints
    FOR DELETE
    USING (
        owner_type = 'team'
        AND owner_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'leader'
        )
    );

-- =============================================================================
-- RLS POLICIES FOR WORKSPACES
-- =============================================================================

-- SELECT: Workspace members can view workspaces they belong to
CREATE POLICY "workspace_members_view_workspaces" ON public.workspaces
    FOR SELECT
    USING (
        id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- SELECT: Workspace tenants can view their workspaces
CREATE POLICY "tenants_view_own_workspaces" ON public.workspaces
    FOR SELECT
    USING (tenant_id = public.get_user_account_id() AND tenant_type = 'user');

-- SELECT: Org members can view organization workspaces
CREATE POLICY "org_members_view_org_workspaces" ON public.workspaces
    FOR SELECT
    USING (
        tenant_type = 'organization'
        AND tenant_id IN (
            SELECT organization_id 
            FROM public.organization_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- SELECT: Team members can view team workspaces
CREATE POLICY "team_members_view_team_workspaces" ON public.workspaces
    FOR SELECT
    USING (
        tenant_type = 'team'
        AND tenant_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- INSERT: Users can create workspaces for themselves
CREATE POLICY "users_create_own_workspaces" ON public.workspaces
    FOR INSERT
    WITH CHECK (
        tenant_id = public.get_user_account_id() 
        AND tenant_type = 'user'
    );

-- INSERT: Org admins can create workspaces for their organizations
CREATE POLICY "org_admins_create_org_workspaces" ON public.workspaces
    FOR INSERT
    WITH CHECK (
        tenant_type = 'organization'
        AND public.is_org_admin(tenant_id)
    );

-- INSERT: Team leaders can create workspaces for their teams
CREATE POLICY "team_leaders_create_team_workspaces" ON public.workspaces
    FOR INSERT
    WITH CHECK (
        tenant_type = 'team'
        AND tenant_id IN (
            SELECT team_id 
            FROM public.team_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'leader'
        )
    );

-- UPDATE: Users can update their own workspaces
CREATE POLICY "users_update_own_workspaces" ON public.workspaces
    FOR UPDATE
    USING (tenant_id = public.get_user_account_id() AND tenant_type = 'user')
    WITH CHECK (tenant_id = public.get_user_account_id() AND tenant_type = 'user');

-- UPDATE: Workspace admins/owners can update workspaces
CREATE POLICY "workspace_admins_update_workspaces" ON public.workspaces
    FOR UPDATE
    USING (
        id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role IN ('owner', 'admin')
        )
    )
    WITH CHECK (
        id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role IN ('owner', 'admin')
        )
    );

-- DELETE: Users can delete their own workspaces
CREATE POLICY "users_delete_own_workspaces" ON public.workspaces
    FOR DELETE
    USING (tenant_id = public.get_user_account_id() AND tenant_type = 'user');

-- DELETE: Workspace owners can delete workspaces
CREATE POLICY "workspace_owners_delete_workspaces" ON public.workspaces
    FOR DELETE
    USING (
        id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'owner'
        )
    );

-- =============================================================================
-- RLS POLICIES FOR WORKSPACE MEMBERS
-- =============================================================================

-- SELECT: Workspace members can view other members of their workspaces
CREATE POLICY "workspace_members_view_members" ON public.workspace_members
    FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id()
        )
    );

-- INSERT: Workspace admins/owners can add members
CREATE POLICY "workspace_admins_add_members" ON public.workspace_members
    FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role IN ('owner', 'admin')
        )
    );

-- UPDATE: Workspace owners can update member roles
CREATE POLICY "workspace_owners_update_members" ON public.workspace_members
    FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'owner'
        )
    )
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role = 'owner'
        )
    );

-- DELETE: Workspace admins/owners can remove members
CREATE POLICY "workspace_admins_remove_members" ON public.workspace_members
    FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id 
            FROM public.workspace_members 
            WHERE account_id = public.get_user_account_id() 
            AND role IN ('owner', 'admin')
        )
    );

-- DELETE: Members can leave workspaces (remove themselves)
CREATE POLICY "members_can_leave_workspace" ON public.workspace_members
    FOR DELETE
    USING (account_id = public.get_user_account_id());

-- =============================================================================
-- GRANTS
-- =============================================================================

-- Grant permissions to roles
GRANT ALL ON TABLE public.blueprints TO authenticated;
GRANT ALL ON TABLE public.blueprints TO service_role;

GRANT ALL ON TABLE public.workspaces TO authenticated;
GRANT ALL ON TABLE public.workspaces TO service_role;

GRANT ALL ON TABLE public.workspace_members TO authenticated;
GRANT ALL ON TABLE public.workspace_members TO service_role;

-- Grant usage on enum types
GRANT USAGE ON TYPE blueprint_visibility TO authenticated;
GRANT USAGE ON TYPE blueprint_status TO authenticated;
GRANT USAGE ON TYPE blueprint_category TO authenticated;
GRANT USAGE ON TYPE owner_type TO authenticated;
GRANT USAGE ON TYPE workspace_status TO authenticated;
GRANT USAGE ON TYPE tenant_type TO authenticated;
GRANT USAGE ON TYPE workspace_member_role TO authenticated;
