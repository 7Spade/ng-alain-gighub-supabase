-- Migration: Create SECURITY DEFINER function to get user account ID
-- Purpose: Avoid infinite recursion in RLS policies by using a function that bypasses RLS
-- Created: 2025-11-24
-- Task: RLS-001

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_user_account_id();

-- Create SECURITY DEFINER function to get user's account ID
-- This function bypasses RLS (row_security = off) to avoid infinite recursion
CREATE OR REPLACE FUNCTION get_user_account_id()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET row_security = off
STABLE
AS $$
DECLARE
  user_account_id uuid;
BEGIN
  -- Query accounts table without triggering RLS
  -- This prevents infinite recursion in RLS policies
  SELECT id INTO user_account_id
  FROM accounts
  WHERE auth_user_id = auth.uid()
  AND type = 'User'
  AND deleted_at IS NULL
  LIMIT 1;
  
  RETURN user_account_id;
END;
$$;

-- Add comment to explain the function
COMMENT ON FUNCTION get_user_account_id() IS 
'Returns the account ID for the current authenticated user. 
Uses SECURITY DEFINER with row_security=off to avoid infinite recursion in RLS policies.
This function is critical for RLS policies that need to reference the accounts table.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_account_id() TO authenticated;
