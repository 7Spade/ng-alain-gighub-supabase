-- Migration: Create blueprints table
-- Purpose: Create the blueprints table for Blueprint Container system
-- Created: 2025-11-26
-- Phase: Blueprint Feature Setup
--
-- This table stores blueprint templates that can be instantiated into workspaces.
-- Following vertical slice architecture and Account Context integration.

-- ============================================================================
-- CREATE BLUEPRINTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.blueprints (
    -- Identity
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    category TEXT NOT NULL DEFAULT 'custom',
    visibility TEXT NOT NULL DEFAULT 'private',
    status TEXT NOT NULL DEFAULT 'draft',

    -- Ownership (Account Context Integration)
    owner_id UUID NOT NULL,
    owner_type TEXT NOT NULL,

    -- Blueprint structure definition (JSONB - extensible)
    structure JSONB NOT NULL DEFAULT '{"settings": {"allowGuestAccess": false, "requireApprovalForJoin": true, "defaultMemberRole": "member", "enableTaskComments": true, "enableFileSharing": true, "enableNotifications": true}}',

    -- Metadata
    version INTEGER NOT NULL DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    icon_url VARCHAR(500),
    thumbnail_url VARCHAR(500),

    -- Statistics
    usage_count INTEGER NOT NULL DEFAULT 0,
    rating DECIMAL(3,2),

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT blueprints_category_check CHECK (
        category = ANY(ARRAY['software_development', 'marketing', 'sales', 'hr', 'operations', 'custom'])
    ),
    CONSTRAINT blueprints_visibility_check CHECK (
        visibility = ANY(ARRAY['private', 'organization', 'team', 'public'])
    ),
    CONSTRAINT blueprints_status_check CHECK (
        status = ANY(ARRAY['draft', 'published', 'archived'])
    ),
    CONSTRAINT blueprints_owner_type_check CHECK (
        owner_type = ANY(ARRAY['user', 'organization', 'team'])
    ),
    CONSTRAINT blueprints_rating_check CHECK (
        rating IS NULL OR (rating >= 0 AND rating <= 5)
    ),
    CONSTRAINT blueprints_name_length CHECK (
        char_length(name) >= 2 AND char_length(name) <= 100
    )
);

-- Table comment
COMMENT ON TABLE public.blueprints IS 'Blueprint templates that can be instantiated into workspaces. Follows Account Context integration for multi-tenant support.';

-- Column comments
COMMENT ON COLUMN public.blueprints.id IS 'Unique identifier for the blueprint';
COMMENT ON COLUMN public.blueprints.name IS 'Blueprint name (2-100 characters)';
COMMENT ON COLUMN public.blueprints.description IS 'Blueprint description';
COMMENT ON COLUMN public.blueprints.category IS 'Blueprint category: software_development, marketing, sales, hr, operations, custom';
COMMENT ON COLUMN public.blueprints.visibility IS 'Visibility level: private, organization, team, public';
COMMENT ON COLUMN public.blueprints.status IS 'Blueprint status: draft, published, archived';
COMMENT ON COLUMN public.blueprints.owner_id IS 'Owner ID (user, organization, or team ID from accounts table)';
COMMENT ON COLUMN public.blueprints.owner_type IS 'Owner type: user, organization, team';
COMMENT ON COLUMN public.blueprints.structure IS 'JSONB structure containing blueprint definition (tasks, folders, settings, etc.)';
COMMENT ON COLUMN public.blueprints.version IS 'Blueprint version number, incremented on updates';
COMMENT ON COLUMN public.blueprints.tags IS 'Array of tags for categorization and search';
COMMENT ON COLUMN public.blueprints.icon_url IS 'URL to blueprint icon image';
COMMENT ON COLUMN public.blueprints.thumbnail_url IS 'URL to blueprint thumbnail image';
COMMENT ON COLUMN public.blueprints.usage_count IS 'Number of times this blueprint has been used to create workspaces';
COMMENT ON COLUMN public.blueprints.rating IS 'Average rating (0-5) from users';
COMMENT ON COLUMN public.blueprints.created_at IS 'Timestamp when blueprint was created';
COMMENT ON COLUMN public.blueprints.updated_at IS 'Timestamp when blueprint was last updated';
COMMENT ON COLUMN public.blueprints.published_at IS 'Timestamp when blueprint was published (null if draft)';

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

-- Index for owner-based queries (most common access pattern)
CREATE INDEX idx_blueprints_owner ON public.blueprints(owner_id, owner_type);

-- Index for status filtering
CREATE INDEX idx_blueprints_status ON public.blueprints(status);

-- Index for visibility filtering (for marketplace/public blueprints)
CREATE INDEX idx_blueprints_visibility ON public.blueprints(visibility);

-- Index for category filtering
CREATE INDEX idx_blueprints_category ON public.blueprints(category);

-- Composite index for public marketplace queries
CREATE INDEX idx_blueprints_public_published ON public.blueprints(visibility, status)
    WHERE visibility = 'public' AND status = 'published';

-- GIN index for tags array search
CREATE INDEX idx_blueprints_tags ON public.blueprints USING GIN(tags);

-- ============================================================================
-- CREATE TRIGGER FOR updated_at
-- ============================================================================

CREATE OR REPLACE TRIGGER update_blueprints_updated_at
    BEFORE UPDATE ON public.blueprints
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Policy: View own blueprints (user owns the blueprint)
CREATE POLICY "users_view_own_blueprints" ON public.blueprints
FOR SELECT
TO authenticated
USING (
    owner_type = 'user'
    AND owner_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_view_own_blueprints" ON public.blueprints IS
'Allows users to view their own blueprints (where owner_type = user and owner_id = their account id)';

-- Policy: View organization blueprints (user is member of the organization)
CREATE POLICY "org_members_view_org_blueprints" ON public.blueprints
FOR SELECT
TO authenticated
USING (
    owner_type = 'organization'
    AND public.is_org_member(owner_id)
);

COMMENT ON POLICY "org_members_view_org_blueprints" ON public.blueprints IS
'Allows organization members to view their organization blueprints';

-- Policy: View team blueprints (user is member of the team)
CREATE POLICY "team_members_view_team_blueprints" ON public.blueprints
FOR SELECT
TO authenticated
USING (
    owner_type = 'team'
    AND public.is_team_member(owner_id)
);

COMMENT ON POLICY "team_members_view_team_blueprints" ON public.blueprints IS
'Allows team members to view their team blueprints';

-- Policy: View public published blueprints (marketplace)
CREATE POLICY "anyone_view_public_blueprints" ON public.blueprints
FOR SELECT
TO authenticated
USING (
    visibility = 'public'
    AND status = 'published'
);

COMMENT ON POLICY "anyone_view_public_blueprints" ON public.blueprints IS
'Allows any authenticated user to view public published blueprints (marketplace)';

-- Policy: Create blueprints for own user account
CREATE POLICY "users_insert_own_blueprints" ON public.blueprints
FOR INSERT
TO authenticated
WITH CHECK (
    owner_type = 'user'
    AND owner_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_insert_own_blueprints" ON public.blueprints IS
'Allows users to create blueprints for their own account';

-- Policy: Create blueprints for organization (must be admin/owner)
CREATE POLICY "org_admins_insert_org_blueprints" ON public.blueprints
FOR INSERT
TO authenticated
WITH CHECK (
    owner_type = 'organization'
    AND public.is_org_admin(owner_id)
);

COMMENT ON POLICY "org_admins_insert_org_blueprints" ON public.blueprints IS
'Allows organization admins/owners to create blueprints for their organization';

-- Policy: Create blueprints for team (must be leader)
CREATE POLICY "team_leaders_insert_team_blueprints" ON public.blueprints
FOR INSERT
TO authenticated
WITH CHECK (
    owner_type = 'team'
    AND public.is_team_leader(owner_id)
);

COMMENT ON POLICY "team_leaders_insert_team_blueprints" ON public.blueprints IS
'Allows team leaders to create blueprints for their team';

-- Policy: Update own user blueprints
CREATE POLICY "users_update_own_blueprints" ON public.blueprints
FOR UPDATE
TO authenticated
USING (
    owner_type = 'user'
    AND owner_id = public.get_user_account_id()
)
WITH CHECK (
    owner_type = 'user'
    AND owner_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_update_own_blueprints" ON public.blueprints IS
'Allows users to update their own blueprints';

-- Policy: Update organization blueprints (must be admin/owner)
CREATE POLICY "org_admins_update_org_blueprints" ON public.blueprints
FOR UPDATE
TO authenticated
USING (
    owner_type = 'organization'
    AND public.is_org_admin(owner_id)
)
WITH CHECK (
    owner_type = 'organization'
    AND public.is_org_admin(owner_id)
);

COMMENT ON POLICY "org_admins_update_org_blueprints" ON public.blueprints IS
'Allows organization admins/owners to update organization blueprints';

-- Policy: Update team blueprints (must be leader)
CREATE POLICY "team_leaders_update_team_blueprints" ON public.blueprints
FOR UPDATE
TO authenticated
USING (
    owner_type = 'team'
    AND public.is_team_leader(owner_id)
)
WITH CHECK (
    owner_type = 'team'
    AND public.is_team_leader(owner_id)
);

COMMENT ON POLICY "team_leaders_update_team_blueprints" ON public.blueprints IS
'Allows team leaders to update team blueprints';

-- Policy: Delete own user blueprints
CREATE POLICY "users_delete_own_blueprints" ON public.blueprints
FOR DELETE
TO authenticated
USING (
    owner_type = 'user'
    AND owner_id = public.get_user_account_id()
);

COMMENT ON POLICY "users_delete_own_blueprints" ON public.blueprints IS
'Allows users to delete their own blueprints';

-- Policy: Delete organization blueprints (must be admin/owner)
CREATE POLICY "org_admins_delete_org_blueprints" ON public.blueprints
FOR DELETE
TO authenticated
USING (
    owner_type = 'organization'
    AND public.is_org_admin(owner_id)
);

COMMENT ON POLICY "org_admins_delete_org_blueprints" ON public.blueprints IS
'Allows organization admins/owners to delete organization blueprints';

-- Policy: Delete team blueprints (must be leader)
CREATE POLICY "team_leaders_delete_team_blueprints" ON public.blueprints
FOR DELETE
TO authenticated
USING (
    owner_type = 'team'
    AND public.is_team_leader(owner_id)
);

COMMENT ON POLICY "team_leaders_delete_team_blueprints" ON public.blueprints IS
'Allows team leaders to delete team blueprints';
