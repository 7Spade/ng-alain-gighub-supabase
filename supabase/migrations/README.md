# Supabase Migrations

This folder contains all database migrations for the ng-alain-gighub-supabase project.

## Migration Files

### Phase 4: RLS 策略修復 (2025-11-24)

The following migrations fix the infinite recursion issue in Row Level Security (RLS) policies:

1. **20251124012800_create_security_definer_function.sql**
   - Creates `get_user_account_id()` function with SECURITY DEFINER
   - Bypasses RLS to avoid infinite recursion
   - Used by Organization and Bot RLS policies

2. **20251124012900_rewrite_user_rls_policies.sql**
   - Rewrites User account RLS policies
   - Uses `auth.uid()` directly (no table join needed)
   - Policies: SELECT, UPDATE, INSERT for User accounts

3. **20251124013000_rewrite_organization_rls_policies.sql**
   - Rewrites Organization account RLS policies
   - Uses `get_user_account_id()` function to avoid recursion
   - Supports organization members and owners
   - Policies: SELECT, UPDATE, INSERT for Organization accounts

4. **20251124013100_rewrite_bot_rls_policies.sql**
   - Rewrites Bot account RLS policies
   - Uses `get_user_account_id()` for team bot visibility
   - Policies: SELECT, UPDATE, INSERT, DELETE for Bot accounts

## Applying Migrations

### Using Supabase CLI (Recommended)

```bash
# Initialize Supabase (if not already done)
supabase init

# Link to your project
supabase link --project-ref xxycyrsgzjlphohqjpsh

# Apply all pending migrations
supabase db push
```

### Manual Application

If you don't have Supabase CLI, you can apply migrations manually:

1. Open Supabase Dashboard → SQL Editor
2. Run each migration file in order (by timestamp)
3. Verify no errors occurred

## Migration Order

⚠️ **IMPORTANT**: Migrations must be applied in chronological order:

1. Create SECURITY DEFINER function first (RLS-001)
2. Then apply User RLS policies (RLS-002)
3. Then apply Organization RLS policies (RLS-003)
4. Finally apply Bot RLS policies (RLS-004)

## Testing

After applying migrations, run the tests described in `RLS_TESTING_GUIDE.md` to ensure:

- ✅ No infinite recursion errors
- ✅ Correct tenant isolation
- ✅ Users can create organizations successfully
- ✅ RLS policies work as expected

## Rollback

If you need to rollback these migrations:

```sql
-- Drop RLS policies
DROP POLICY IF EXISTS "users_view_own_user_account" ON accounts;
DROP POLICY IF EXISTS "users_update_own_user_account" ON accounts;
DROP POLICY IF EXISTS "users_insert_own_user_account" ON accounts;
DROP POLICY IF EXISTS "users_view_organizations_they_belong_to" ON accounts;
DROP POLICY IF EXISTS "org_owners_update_organizations" ON accounts;
DROP POLICY IF EXISTS "users_insert_organizations" ON accounts;
DROP POLICY IF EXISTS "users_view_bots_in_their_teams" ON accounts;
DROP POLICY IF EXISTS "users_update_bots_they_created" ON accounts;
DROP POLICY IF EXISTS "users_insert_bots" ON accounts;
DROP POLICY IF EXISTS "users_delete_bots_they_created" ON accounts;

-- Drop function
DROP FUNCTION IF EXISTS get_user_account_id();
```

Then recreate your original policies.

## Migration Naming Convention

Migrations follow this naming pattern:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Example: `20251124012800_create_security_definer_function.sql`

- **YYYYMMDDHHMMSS**: Timestamp ensures correct ordering
- **descriptive_name**: Brief description of what the migration does

## Key Changes from Previous RLS Implementation

### Before (Infinite Recursion Issue)

```sql
-- ❌ This caused infinite recursion
CREATE POLICY "users_view_organizations"
ON accounts
USING (
  type = 'Organization'
  AND EXISTS (
    SELECT 1 FROM organization_members om
    JOIN accounts a ON om.account_id = a.id  -- ❌ Recursive reference
    WHERE a.auth_user_id = auth.uid()
  )
);
```

### After (Fixed)

```sql
-- ✅ No recursion using SECURITY DEFINER function
CREATE POLICY "users_view_organizations_they_belong_to"
ON accounts
USING (
  type = 'Organization'
  AND EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.account_id = get_user_account_id()  -- ✅ Function bypasses RLS
  )
);
```

## Architecture Benefits

1. **No Infinite Recursion**: `SECURITY DEFINER` function breaks the recursion cycle
2. **Performance**: Direct `auth.uid()` checks are faster than table joins
3. **Security**: RLS still enforces proper access control
4. **Maintainability**: Centralized user account lookup logic

## Related Documentation

- [RLS Testing Guide](./RLS_TESTING_GUIDE.md) - Comprehensive testing procedures
- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

## Support

If you encounter issues:

1. Check the [RLS Testing Guide](./RLS_TESTING_GUIDE.md)
2. Review Supabase logs in the Dashboard
3. Verify all migrations were applied in order
4. Check PostgreSQL error logs for detailed error messages

## Contributing

When adding new migrations:

1. Use the timestamp naming convention
2. Include DROP statements for idempotency
3. Add comments explaining the purpose
4. Test thoroughly before committing
5. Update this README with migration details
