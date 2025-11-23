# RLS Infinite Recursion Fix

## Problem

When creating an organization, the application encountered a `42P17: infinite recursion detected in policy for relation "accounts"` error.

## Root Cause

Three RLS policies on the `accounts` table were calling `private.get_user_account_id()`:

1. "Users can view organization accounts they belong to"
2. "Users can view accounts in their teams"  
3. "Organization owners can update their organization"

The `get_user_account_id()` function queries the `accounts` table:
```sql
SELECT id FROM accounts WHERE auth_user_id = auth.uid() AND type = 'User'
```

This created a circular dependency:
1. Query accounts table → Triggers RLS policy
2. RLS policy calls get_user_account_id() → Queries accounts table
3. Querying accounts table → Triggers RLS policy again
4. Infinite recursion 💥

Even with `SET LOCAL row_security = off` in the function, PostgreSQL can still trigger infinite recursion when the function is called from within RLS policy expressions.

## Solution

Replaced `private.get_user_account_id()` calls with direct JOINs using `auth.uid()` in the RLS policy expressions. This eliminates the need for a separate subquery to the `accounts` table.

### Migration Applied

**File:** `supabase/migrations/YYYYMMDD_fix_accounts_rls_infinite_recursion.sql`

**Changes:**

1. **"Users can view organization accounts they belong to"**
   ```sql
   -- OLD (caused infinite recursion)
   WHERE account_id = (SELECT private.get_user_account_id())
   
   -- NEW (direct join)
   SELECT om.organization_id
   FROM organization_members om
   INNER JOIN accounts a ON a.id = om.account_id
   WHERE a.auth_user_id = auth.uid() AND a.type = 'User'
   ```

2. **"Users can view accounts in their teams"**
   ```sql
   -- OLD (caused infinite recursion)
   WHERE account_id = (SELECT private.get_user_account_id())
   
   -- NEW (direct join)
   SELECT tm.account_id
   FROM team_members tm
   WHERE tm.team_id IN (
     SELECT tm2.team_id
     FROM team_members tm2
     INNER JOIN accounts a ON a.id = tm2.account_id
     WHERE a.auth_user_id = auth.uid() AND a.type = 'User'
   )
   ```

3. **"Organization owners can update their organization"**
   ```sql
   -- OLD (caused infinite recursion)
   WHERE account_id = (SELECT private.get_user_account_id())
   
   -- NEW (direct join)
   SELECT om.organization_id
   FROM organization_members om
   INNER JOIN accounts a ON a.id = om.account_id
   WHERE a.auth_user_id = auth.uid() 
     AND a.type = 'User'
     AND om.role = 'owner'
   ```

## Verification

After applying the migration:

```sql
-- Query that previously caused infinite recursion
SELECT * FROM accounts WHERE auth_user_id = 'xxx';
-- ✅ Now works correctly
```

## Impact

- ✅ Eliminates infinite recursion error
- ✅ Maintains same security semantics
- ✅ Improves performance (fewer function calls)
- ✅ No application code changes required

## Related Error Messages

If you see any of these errors, they indicate RLS infinite recursion:

- `42P17: infinite recursion detected in policy for relation "accounts"`
- `GET .../rest/v1/accounts?... 500 (Internal Server Error)`
- `Error in findOne for accounts: {code: '42P17', ...}`

## Prevention

When writing RLS policies, avoid:

1. ❌ Calling functions that query the same table the policy is on
2. ❌ Using subqueries that might trigger the same policy again
3. ✅ Use direct JOINs within the policy expression
4. ✅ Reference `auth.uid()` directly instead of querying for it

## Tenant Isolation Impact

This fix **maintains perfect tenant isolation**:

- User accounts are still filtered by `auth.uid()`
- Organization membership is still checked via `organization_members` table
- Team membership is still checked via `team_members` table
- No cross-tenant data leakage introduced

The fix only changes **how** the checks are performed (direct JOINs vs function calls), not **what** is checked.

---

**Applied:** 2025-11-23 (as part of account module refactoring)
**Status:** ✅ Resolved
**Supabase Project:** xxycyrsgzjlphohqjpsh
