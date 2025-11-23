# RLS Infinite Recursion Fix

**Date**: 2025-01-23  
**Status**: ✅ Fixed  
**Priority**: Critical

## Problem

### Symptoms
- Creating organizations fails with error: "創建組織失敗" (Create organization failed)
- PostgreSQL logs show: `ERROR: infinite recursion detected in policy for relation "accounts"`
- PostgreSQL logs show: `ERROR: SET is not allowed in a non-volatile function`

### Root Cause Analysis

The `private.get_user_account_id()` function had a fatal design flaw:

1. **Function was marked as `STABLE`** (non-volatile function)
2. **Function tried to execute `SET LOCAL row_security = off`**
3. **PostgreSQL does not allow SET statements in non-volatile functions**
4. **This caused RLS policy circular dependency**:
   ```
   accounts RLS policy → private.get_user_account_id()
   ↓
   private.get_user_account_id() → SELECT FROM accounts
   ↓
   accounts table query → triggers RLS policy
   ↓
   RLS policy → private.get_user_account_id()
   ↓
   INFINITE RECURSION! ♻️
   ```

### Impact

All RLS policies depending on `private.get_user_account_id()` failed:
- `Organization owners can update their organization`
- `Users can view accounts in their teams`
- `Users can view organization accounts they belong to`
- All `organization_members` table policies

This made it **impossible to create or manage organizations**.

## Solution

### Changes Made

Modified `private.get_user_account_id()` function from `STABLE` to `VOLATILE`:

```sql
CREATE OR REPLACE FUNCTION private.get_user_account_id()
RETURNS uuid
LANGUAGE plpgsql
VOLATILE SECURITY DEFINER  -- ✅ Changed from STABLE to VOLATILE
SET search_path TO 'public', 'private'
AS $function$
DECLARE
  account_id UUID;
BEGIN
  -- Disable RLS for this query to prevent infinite recursion
  SET LOCAL row_security = off;
  
  SELECT id INTO account_id
  FROM public.accounts
  WHERE auth_user_id = auth.uid()
    AND type = 'User'
  LIMIT 1;
  
  RETURN account_id;
END;
$function$;
```

### Why This Works

1. **VOLATILE functions CAN execute SET statements** in PostgreSQL
2. **SECURITY DEFINER ensures safe execution** with elevated privileges
3. **`SET LOCAL row_security = off` prevents RLS recursion** for this query only
4. **Function still filters by `auth.uid()`** so it's secure

### Migration Applied

Migration: `fix_get_user_account_id_infinite_recursion`

Applied via: `supabase-apply_migration` MCP tool

## Verification

### Before Fix
```sql
SELECT private.get_user_account_id();
-- ERROR: SET is not allowed in a non-volatile function
```

### After Fix
```sql
SELECT private.get_user_account_id();
-- Returns: <user_account_id> or NULL (no error)
```

### Testing Organization Creation

1. **Create organization** via frontend
2. **Expected**: Organization created successfully
3. **Expected**: Owner membership record created
4. **Expected**: No infinite recursion errors in logs

## Lessons Learned

### PostgreSQL Function Volatility

- **IMMUTABLE**: Always returns same result for same inputs (no database reads)
- **STABLE**: Returns same result within a transaction (can read database, but no modifications)
- **VOLATILE**: Result can change even within transaction (can execute SET statements)

**Rule**: If your function needs to execute `SET LOCAL`, it **MUST be VOLATILE**.

### RLS Policy Best Practices

1. **Avoid circular dependencies** in RLS policies
2. **Use SECURITY DEFINER functions carefully** to break recursion
3. **Disable RLS internally** when function is called from RLS policies
4. **Always test RLS policies** with actual authenticated users

### Documentation

- Document all SECURITY DEFINER functions thoroughly
- Explain why VOLATILE is needed (if applicable)
- Document RLS policy dependencies

## Related Issues

- Issue: Account module architecture compliance
- Issue: Organization creation functionality
- Doc: `docs/00-順序.md` (Development order guide)

## References

- PostgreSQL Function Volatility: https://www.postgresql.org/docs/current/xfunc-volatility.html
- RLS Best Practices: https://supabase.com/docs/guides/auth/row-level-security
- SECURITY DEFINER: https://www.postgresql.org/docs/current/sql-createfunction.html

---

**Last Updated**: 2025-01-23  
**Maintainer**: Development Team
