-- Migration: Rewrite User RLS policies to avoid infinite recursion
-- Purpose: Fix RLS infinite recursion by using auth.uid() directly instead of joining accounts table
-- Created: 2025-11-24
-- Task: RLS-002

-- Drop existing User RLS policies
DROP POLICY IF EXISTS "users_view_own_user_account" ON accounts;
DROP POLICY IF EXISTS "users_update_own_user_account" ON accounts;
DROP POLICY IF EXISTS "users_insert_own_user_account" ON accounts;

-- ============================================================================
-- User Account RLS Policies (Using auth.uid() directly)
-- ============================================================================

-- Policy: Users can view their own User account
-- Uses auth.uid() directly to avoid infinite recursion
CREATE POLICY "users_view_own_user_account"
ON accounts
FOR SELECT
TO authenticated
USING (
  type = 'User' 
  AND auth_user_id = auth.uid()
  AND deleted_at IS NULL
);

-- Policy: Users can update their own User account
-- Uses auth.uid() directly to avoid infinite recursion
CREATE POLICY "users_update_own_user_account"
ON accounts
FOR UPDATE
TO authenticated
USING (
  type = 'User' 
  AND auth_user_id = auth.uid()
  AND deleted_at IS NULL
)
WITH CHECK (
  type = 'User' 
  AND auth_user_id = auth.uid()
  AND deleted_at IS NULL
);

-- Policy: Users can insert their own User account (for initial setup)
-- Uses auth.uid() directly to avoid infinite recursion
CREATE POLICY "users_insert_own_user_account"
ON accounts
FOR INSERT
TO authenticated
WITH CHECK (
  type = 'User' 
  AND auth_user_id = auth.uid()
);

-- Add comments to explain the policies
COMMENT ON POLICY "users_view_own_user_account" ON accounts IS 
'Allows users to view their own User account. Uses auth.uid() directly to avoid infinite recursion.';

COMMENT ON POLICY "users_update_own_user_account" ON accounts IS 
'Allows users to update their own User account. Uses auth.uid() directly to avoid infinite recursion.';

COMMENT ON POLICY "users_insert_own_user_account" ON accounts IS 
'Allows users to insert their own User account during initial setup. Uses auth.uid() directly to avoid infinite recursion.';
