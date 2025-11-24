-- Migration: Rewrite Organization RLS policies
-- Purpose: Fix Organization account RLS policies using get_user_account_id() to avoid recursion
-- Created: 2025-11-24
-- Phase: 4 - RLS Policy Fixes (RLS-003)
--
-- Organization policies are more complex because they need to check membership through
-- the organization_members table. By using get_user_account_id() instead of JOINing
-- accounts directly, we avoid the infinite recursion issue.
--
-- Key principle: Use get_user_account_id() in subqueries, not JOIN accounts table.

-- ============================================================================
-- DROP EXISTING POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "users_view_organizations_they_belong_to" ON public.accounts;
DROP POLICY IF EXISTS "org_owners_update_organizations" ON public.accounts;
DROP POLICY IF EXISTS "org_owners_delete_organizations" ON public.accounts;
DROP POLICY IF EXISTS "authenticated_users_create_organizations" ON public.accounts;

-- ============================================================================
-- SELECT POLICY - Users can view organizations they belong to
-- ============================================================================

CREATE POLICY "users_view_organizations_they_belong_to" ON public.accounts
FOR SELECT
TO authenticated
USING (
  type = 'Organization'
  AND deleted_at IS NULL
  AND (
    -- User is a member of this organization
    id IN (
      SELECT organization_id
      FROM public.organization_members
      WHERE account_id = public.get_user_account_id()
        AND deleted_at IS NULL
    )
    OR
    -- User created this organization
    created_by = auth.uid()
  )
);

COMMENT ON POLICY "users_view_organizations_they_belong_to" ON public.accounts IS
'Allows users to view organizations they are members of or created.
Uses get_user_account_id() to avoid infinite recursion.';

-- ============================================================================
-- UPDATE POLICY - Organization owners can update their organizations
-- ============================================================================

CREATE POLICY "org_owners_update_organizations" ON public.accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Organization'
  AND deleted_at IS NULL
  AND id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE account_id = public.get_user_account_id()
      AND role = 'owner'
      AND deleted_at IS NULL
  )
)
WITH CHECK (
  -- Ensure updates maintain data integrity
  type = 'Organization'  -- Cannot change account type
  AND deleted_at IS NULL
);

COMMENT ON POLICY "org_owners_update_organizations" ON public.accounts IS
'Allows organization owners to update their organizations.
Requires owner role in organization_members table.
Uses get_user_account_id() to avoid recursion.';

-- ============================================================================
-- DELETE POLICY - Organization owners can soft-delete their organizations
-- ============================================================================

CREATE POLICY "org_owners_delete_organizations" ON public.accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Organization'
  AND id IN (
    SELECT organization_id
    FROM public.organization_members
    WHERE account_id = public.get_user_account_id()
      AND role = 'owner'
      AND deleted_at IS NULL
  )
)
WITH CHECK (
  -- Allow setting deleted_at
  type = 'Organization'
  AND deleted_at IS NOT NULL
);

COMMENT ON POLICY "org_owners_delete_organizations" ON public.accounts IS
'Allows organization owners to soft-delete their organizations.
Soft delete is implemented by setting deleted_at timestamp.
Uses get_user_account_id() to avoid recursion.';

-- ============================================================================
-- INSERT POLICY - Authenticated users can create organizations
-- ============================================================================

CREATE POLICY "authenticated_users_create_organizations" ON public.accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'Organization'
  AND created_by = auth.uid()
  AND deleted_at IS NULL
);

COMMENT ON POLICY "authenticated_users_create_organizations" ON public.accounts IS
'Allows authenticated users to create new organizations.
Sets created_by to the authenticated user.';

-- ============================================================================
-- TRIGGER - Auto-add creator as organization owner
-- ============================================================================

-- Drop trigger if exists
DROP TRIGGER IF EXISTS add_creator_as_org_owner ON public.accounts;
DROP FUNCTION IF EXISTS public.add_creator_as_org_owner();

-- Create function to add creator as owner
CREATE OR REPLACE FUNCTION public.add_creator_as_org_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
AS $$
DECLARE
  v_user_account_id UUID;
BEGIN
  -- Only run for Organization accounts
  IF NEW.type = 'Organization' THEN
    -- Get the user's account_id
    SELECT id INTO v_user_account_id
    FROM public.accounts
    WHERE auth_user_id = NEW.created_by
      AND type = 'User'
      AND deleted_at IS NULL
    LIMIT 1;
    
    -- If user account exists, add as organization owner
    IF v_user_account_id IS NOT NULL THEN
      INSERT INTO public.organization_members (
        organization_id,
        account_id,
        role,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        v_user_account_id,
        'owner',
        NOW(),
        NOW()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER add_creator_as_org_owner
  AFTER INSERT ON public.accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.add_creator_as_org_owner();

COMMENT ON FUNCTION public.add_creator_as_org_owner() IS
'Automatically adds the creator as an owner in organization_members when a new organization is created.
Uses SECURITY DEFINER to bypass RLS when inserting into organization_members.';
