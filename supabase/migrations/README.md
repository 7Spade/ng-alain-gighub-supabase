# Supabase Migrations - RLS Policy Fixes

## Overview

This directory contains SQL migrations to fix infinite recursion issues in Row Level Security (RLS) policies for the accounts table. These migrations implement Phase 4 of the enterprise architecture refactoring (RLS-001 through RLS-004).

## Problem Statement

The original RLS policies caused infinite recursion because they would JOIN the `accounts` table while checking permissions on the `accounts` table itself. For example:

```sql
-- ❌ PROBLEMATIC POLICY (causes infinite recursion)
CREATE POLICY "view_orgs" ON accounts
USING (
  type = 'Organization'
  AND id IN (
    SELECT organization_id
    FROM organization_members om
    JOIN accounts a ON om.account_id = a.id  -- ⚠️ This JOIN triggers RLS recursion!
    WHERE a.auth_user_id = auth.uid()
  )
);
```

When a user queries the `accounts` table, the RLS policy fires. The policy's subquery JOINs `accounts` again, which triggers the RLS policy again, creating infinite recursion.

## Solution

The solution uses two strategies:

### 1. SECURITY DEFINER Helper Function

Create a `get_user_account_id()` function that:
- Uses `SECURITY DEFINER` to run with elevated privileges
- Sets `row_security = off` to bypass RLS
- Only returns data for `auth.uid()` (current user)
- Breaks the recursion chain by querying accounts without triggering RLS

### 2. Direct Column Checks

For User policies, check `auth_user_id` column directly instead of JOINing accounts:

```sql
-- ✅ CORRECT POLICY (no recursion)
CREATE POLICY "view_own_account" ON accounts
USING (
  type = 'User'
  AND auth_user_id = auth.uid()  -- Direct column check, no JOIN
);
```

## Migration Files

### 1. `20251124000001_create_get_user_account_id_function.sql`

**Purpose**: Create the helper function to break RLS recursion

**What it does**:
- Creates `public.get_user_account_id()` function
- Uses `SECURITY DEFINER` and `SET row_security = off`
- Returns the `account_id` (UUID) for the current `auth.uid()`
- Only returns User-type accounts
- Returns NULL if no account found

**Security**:
- Safe because it only returns data for `auth.uid()`
- Grants EXECUTE only to `authenticated` role
- Revokes from `anon` and `public` roles

**Usage**:
```sql
WHERE account_id = public.get_user_account_id()
```

### 2. `20251124000002_rewrite_user_rls_policies.sql`

**Purpose**: Fix User account RLS policies

**What it does**:
- Drops old policies that may have caused recursion
- Creates new policies that check `auth_user_id` directly
- Implements SELECT, UPDATE, and INSERT policies
- No DELETE policy (uses soft delete via UPDATE)

**Key Policies**:
- `users_view_own_user_account`: Users can view their own User account
- `users_update_own_user_account`: Users can update their own User account
- `users_insert_own_user_account`: Users can create their own User account

**No Recursion**: Uses direct column checks (`auth_user_id = auth.uid()`), no JOINs

### 3. `20251124000003_rewrite_organization_rls_policies.sql`

**Purpose**: Fix Organization account RLS policies

**What it does**:
- Drops old policies that caused recursion
- Creates new policies using `get_user_account_id()` in subqueries
- Implements SELECT, UPDATE, INSERT, and soft DELETE policies
- Creates trigger to auto-add creator as organization owner

**Key Policies**:
- `users_view_organizations_they_belong_to`: View organizations where user is a member
- `org_owners_update_organizations`: Owners can update organizations
- `org_owners_delete_organizations`: Owners can soft-delete organizations
- `authenticated_users_create_organizations`: Any user can create organizations

**Trigger**:
- `add_creator_as_org_owner`: Automatically adds creator to `organization_members` with 'owner' role

**No Recursion**: Uses `get_user_account_id()` instead of JOINing accounts

### 4. `20251124000004_rewrite_bot_rls_policies.sql`

**Purpose**: Fix Bot account RLS policies

**What it does**:
- Drops old policies that caused recursion
- Creates new policies for bot access control
- Bots visible to: creator AND team members
- Creates `team_bots` junction table for team-bot relationships
- Implements RLS for `team_bots` table

**Key Policies for accounts**:
- `users_view_bots_they_created`: View bots you created
- `users_view_bots_in_their_teams`: View bots in your teams
- `bot_creators_update_bots`: Update bots you created
- `bot_creators_delete_bots`: Soft-delete bots you created
- `authenticated_users_create_bots`: Create new bots

**Key Policies for team_bots**:
- `users_view_team_bots_for_their_teams`: View bot assignments in your teams
- `team_owners_manage_team_bots`: Manage bots in teams you own

**No Recursion**: Uses `get_user_account_id()` for team membership checks

## Testing the Migrations (RLS-005)

### Prerequisites

1. Supabase project with database access
2. Supabase CLI installed (`npm install -g supabase`)
3. Project linked to Supabase

### Running Migrations

```bash
# Link your project (one-time setup)
supabase link --project-ref xxycyrsgzjlphohqjpsh

# Run all migrations
supabase db push

# Or run individual migrations
supabase db execute --file supabase/migrations/20251124000001_create_get_user_account_id_function.sql
supabase db execute --file supabase/migrations/20251124000002_rewrite_user_rls_policies.sql
supabase db execute --file supabase/migrations/20251124000003_rewrite_organization_rls_policies.sql
supabase db execute --file supabase/migrations/20251124000004_rewrite_bot_rls_policies.sql
```

### Test Cases

#### Test 1: No Infinite Recursion

```sql
-- Should NOT cause infinite recursion
SELECT * FROM accounts WHERE type = 'Organization';
```

**Expected**: Query completes successfully, returns organizations user has access to

#### Test 2: User Account Access

```sql
-- User should see their own account
SELECT * FROM accounts WHERE type = 'User' AND auth_user_id = auth.uid();
```

**Expected**: Returns 1 row (current user's account)

#### Test 3: Organization Creation Flow

```typescript
// In application
const org = await organizationFacade.createOrganization({
  name: 'Test Organization',
  email: 'test@org.com'
});
```

**Expected**:
1. Organization created successfully
2. Creator automatically added to `organization_members` with 'owner' role
3. No infinite recursion errors
4. Organization appears in user's workspace

#### Test 4: Organization Visibility

```sql
-- User should only see organizations they belong to
SELECT * FROM accounts WHERE type = 'Organization';
```

**Expected**: Only returns organizations where user is a member

#### Test 5: Bot Visibility

```sql
-- User should see bots they created or are in their teams
SELECT * FROM accounts WHERE type = 'Bot';
```

**Expected**: Returns bots created by user + bots in user's teams

#### Test 6: Permission Enforcement

```sql
-- User should NOT be able to update organizations they don't own
UPDATE accounts 
SET name = 'Hacked Name'
WHERE type = 'Organization' 
  AND id = '<some-other-users-org-id>';
```

**Expected**: 0 rows updated (policy prevents update)

### Performance Testing

```sql
-- Measure query performance
EXPLAIN ANALYZE
SELECT * FROM accounts WHERE type = 'Organization';
```

**Expected**: Query plan shows index usage, completes in < 50ms

### Rollback Plan

If migrations cause issues:

```sql
-- Rollback by dropping policies and function
DROP POLICY IF EXISTS "users_view_own_user_account" ON public.accounts;
DROP POLICY IF EXISTS "users_view_organizations_they_belong_to" ON public.accounts;
DROP POLICY IF EXISTS "users_view_bots_they_created" ON public.accounts;
DROP FUNCTION IF EXISTS public.get_user_account_id();

-- Re-enable old policies (from backup)
```

## Security Considerations

### SECURITY DEFINER Safety

The `get_user_account_id()` function uses `SECURITY DEFINER`, which runs with elevated privileges. This is safe because:

1. **Limited Scope**: Only returns single UUID for `auth.uid()`
2. **No User Input**: Takes no parameters, only uses `auth.uid()`
3. **Read-Only**: Only SELECTs data, doesn't modify anything
4. **Explicit Grants**: Only `authenticated` role can execute
5. **Simple Logic**: Minimal code reduces attack surface

### RLS Best Practices Followed

1. ✅ Policies are explicit and understandable
2. ✅ Use `deleted_at` for soft deletes (no hard DELETE)
3. ✅ Separate policies for each operation (SELECT/UPDATE/INSERT)
4. ✅ WITH CHECK clauses prevent privilege escalation
5. ✅ Comments document each policy's purpose
6. ✅ Minimal use of SECURITY DEFINER
7. ✅ Proper role grants (authenticated vs anon)

## Troubleshooting

### Issue: "infinite recursion detected in policy for relation accounts"

**Cause**: RLS policy is JOINing accounts table

**Solution**: Use `get_user_account_id()` instead of JOIN, or check columns directly

### Issue: "permission denied for function get_user_account_id"

**Cause**: Function not granted to authenticated role

**Solution**: Run migration 20251124000001 again, or manually:
```sql
GRANT EXECUTE ON FUNCTION public.get_user_account_id() TO authenticated;
```

### Issue: "User cannot see their organizations after creation"

**Cause**: Trigger didn't add user to `organization_members`

**Solution**: Check trigger exists and user has a User account:
```sql
-- Check trigger exists
SELECT * FROM information_schema.triggers WHERE trigger_name = 'add_creator_as_org_owner';

-- Manually add to organization_members
INSERT INTO organization_members (organization_id, account_id, role)
VALUES ('<org-id>', '<user-account-id>', 'owner');
```

### Issue: "Query is slow after RLS migration"

**Cause**: Missing indexes on foreign key columns

**Solution**: Add indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_organization_members_account_id ON organization_members(account_id);
CREATE INDEX IF NOT EXISTS idx_team_members_account_id ON team_members(account_id);
CREATE INDEX IF NOT EXISTS idx_team_bots_team_id ON team_bots(team_id);
```

## Migration Checklist

Before applying to production:

- [ ] Backup database
- [ ] Test migrations in development environment
- [ ] Run all test cases (Test 1-6 above)
- [ ] Verify no infinite recursion errors
- [ ] Check organization creation flow
- [ ] Verify permission enforcement
- [ ] Measure query performance
- [ ] Document any custom changes
- [ ] Plan maintenance window (if needed)
- [ ] Prepare rollback plan
- [ ] Monitor error logs after deployment

## References

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Task Documentation](../../docs/TASK_NOW.md) - Phase 4

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review test cases
3. Consult Supabase documentation
4. Open issue in repository
5. Contact @7Spade

---

**Last Updated**: 2025-11-24
**Version**: 1.0
**Migration Count**: 4 files
**Status**: Ready for testing (requires Supabase access)
