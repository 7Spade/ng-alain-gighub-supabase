-- Migration: Rewrite Bot RLS policies to avoid infinite recursion
-- Purpose: Fix RLS infinite recursion by using get_user_account_id() function
-- Created: 2025-11-24
-- Task: RLS-004

-- Drop existing Bot RLS policies
DROP POLICY IF EXISTS "users_view_bots_in_their_teams" ON accounts;
DROP POLICY IF EXISTS "users_update_bots_they_created" ON accounts;
DROP POLICY IF EXISTS "users_insert_bots" ON accounts;

-- ============================================================================
-- Bot Account RLS Policies (Using get_user_account_id() function)
-- ============================================================================

-- Policy: Users can view bots in their teams
-- Uses get_user_account_id() function to avoid infinite recursion
CREATE POLICY "users_view_bots_in_their_teams"
ON accounts
FOR SELECT
TO authenticated
USING (
  type = 'Bot'
  AND deleted_at IS NULL
  AND (
    -- User created this bot
    created_by = auth.uid()
    OR
    -- Bot belongs to a team that the user is a member of
    EXISTS (
      SELECT 1
      FROM team_members tm
      JOIN teams t ON tm.team_id = t.id
      WHERE t.bot_id = accounts.id
      AND tm.account_id = get_user_account_id()
      AND tm.deleted_at IS NULL
      AND t.deleted_at IS NULL
    )
  )
);

-- Policy: Users can update bots they created
-- Uses auth.uid() directly since we're only checking the creator
CREATE POLICY "users_update_bots_they_created"
ON accounts
FOR UPDATE
TO authenticated
USING (
  type = 'Bot'
  AND deleted_at IS NULL
  AND created_by = auth.uid()
)
WITH CHECK (
  type = 'Bot'
  AND deleted_at IS NULL
);

-- Policy: Authenticated users can create bots
-- No need to use get_user_account_id() for INSERT as we only check auth.uid()
CREATE POLICY "users_insert_bots"
ON accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'Bot'
  AND created_by = auth.uid()
);

-- Policy: Users can delete bots they created (soft delete)
-- Uses auth.uid() directly since we're only checking the creator
CREATE POLICY "users_delete_bots_they_created"
ON accounts
FOR DELETE
TO authenticated
USING (
  type = 'Bot'
  AND created_by = auth.uid()
);

-- Add comments to explain the policies
COMMENT ON POLICY "users_view_bots_in_their_teams" ON accounts IS 
'Allows users to view bots they created or bots that belong to their teams. Uses get_user_account_id() to avoid infinite recursion.';

COMMENT ON POLICY "users_update_bots_they_created" ON accounts IS 
'Allows users to update bots they created.';

COMMENT ON POLICY "users_insert_bots" ON accounts IS 
'Allows authenticated users to create new bots.';

COMMENT ON POLICY "users_delete_bots_they_created" ON accounts IS 
'Allows users to delete bots they created (soft delete).';
