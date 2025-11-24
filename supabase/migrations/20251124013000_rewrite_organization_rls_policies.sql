-- Migration: Rewrite Organization RLS policies to avoid infinite recursion
-- Purpose: Fix RLS infinite recursion by using get_user_account_id() function
-- Created: 2025-11-24
-- Task: RLS-003

-- Drop existing Organization RLS policies
DROP POLICY IF EXISTS "users_view_organizations_they_belong_to" ON accounts;
DROP POLICY IF EXISTS "org_owners_update_organizations" ON accounts;
DROP POLICY IF EXISTS "users_insert_organizations" ON accounts;

-- ============================================================================
-- Organization Account RLS Policies (Using get_user_account_id() function)
-- ============================================================================

-- Policy: Users can view organizations they belong to (as member or owner)
-- Uses get_user_account_id() function to avoid infinite recursion
CREATE POLICY "users_view_organizations_they_belong_to"
ON accounts
FOR SELECT
TO authenticated
USING (
  type = 'Organization'
  AND deleted_at IS NULL
  AND (
    -- User created this organization (owner)
    created_by = auth.uid()
    OR
    -- User is a member of this organization (through organization_members)
    EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = accounts.id
      AND om.account_id = get_user_account_id()
      AND om.deleted_at IS NULL
    )
  )
);

-- Policy: Organization owners can update their organizations
-- Uses get_user_account_id() function to avoid infinite recursion
CREATE POLICY "org_owners_update_organizations"
ON accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Organization'
  AND deleted_at IS NULL
  AND (
    -- User created this organization (owner)
    created_by = auth.uid()
    OR
    -- User is an owner of this organization (through organization_members)
    EXISTS (
      SELECT 1
      FROM organization_members om
      WHERE om.organization_id = accounts.id
      AND om.account_id = get_user_account_id()
      AND om.role = 'Owner'
      AND om.deleted_at IS NULL
    )
  )
)
WITH CHECK (
  type = 'Organization'
  AND deleted_at IS NULL
);

-- Policy: Authenticated users can create organizations
-- No need to use get_user_account_id() for INSERT as we only check auth.uid()
CREATE POLICY "users_insert_organizations"
ON accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'Organization'
  AND created_by = auth.uid()
);

-- Add comments to explain the policies
COMMENT ON POLICY "users_view_organizations_they_belong_to" ON accounts IS 
'Allows users to view organizations they created or are members of. Uses get_user_account_id() to avoid infinite recursion.';

COMMENT ON POLICY "org_owners_update_organizations" ON accounts IS 
'Allows organization owners to update their organizations. Uses get_user_account_id() to avoid infinite recursion.';

COMMENT ON POLICY "users_insert_organizations" ON accounts IS 
'Allows authenticated users to create new organizations.';
