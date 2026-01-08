# Missing 'net' Schema - Signup 500 Error Fix

## Problem
Users cannot sign up - getting 500 error:
```
ERROR: schema "net" does not exist (SQLSTATE 3F000)
Database error saving new user
```

## Root Cause
Supabase Auth requires the `pg_net` extension which provides the `net` schema for network operations. This extension is missing or not enabled in your Supabase project.

## Error Details
From Auth logs:
```json
{
  "error": "failed to close prepared statement: ERROR: current transaction is aborted, commands ignored until end of transaction block (SQLSTATE 25P02): ERROR: schema \"net\" does not exist (SQLSTATE 3F000)",
  "msg": "500: Database error saving new user",
  "path": "/signup",
  "method": "POST"
}
```

## Solution

### Option 1: Enable pg_net Extension (Recommended)

Run this SQL in Supabase SQL Editor:

```sql
-- Enable the pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Grant permissions
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Verify
SELECT extname, extversion, nspname as schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname = 'pg_net';
```

### Option 2: Contact Supabase Support

If the extension cannot be enabled (permission denied), you need to:

1. Go to Supabase Dashboard
2. Click "Support" or "Help"
3. Request: "Please enable the pg_net extension for my project"
4. Reference error: "schema net does not exist during user signup"

### Option 3: Check Project Version

Older Supabase projects may not have pg_net available. Check:

1. Supabase Dashboard → Project Settings → General
2. Look for "Postgres Version"
3. If it's very old (< 14), you may need to:
   - Create a new Supabase project with latest version
   - Or request a migration from Supabase support

## Why This Happened

The `pg_net` extension is a standard Supabase extension used for:
- HTTP requests from database
- Webhooks
- Network operations during auth flows

It should be enabled by default on newer Supabase projects, but may be missing on:
- Older projects
- Projects created before pg_net was standard
- Projects with custom configurations

## Verification

After enabling the extension, verify it works:

```sql
-- Check extension exists
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- Try signup again
-- Should now work without 500 error
```

## Alternative Workaround (If Extension Cannot Be Enabled)

If you absolutely cannot enable pg_net, you may need to:

1. **Disable features that require it:**
   - Auth webhooks
   - Email confirmations (if they use net schema)
   - Any custom database functions using HTTP

2. **Use application-level webhooks instead:**
   - Handle auth events in your Next.js API routes
   - Don't rely on database-level network operations

## Files Created
- `fix-missing-net-schema.sql` - SQL to enable the extension
- `missing-net-schema-fix.md` - This documentation

## Testing
After running the fix:
1. Try signing up with a new email
2. Should succeed without 500 error
3. Check that user is created in auth.users
4. Check that profile and usage_tracking are created

## Related Issues
This was NOT a problem with:
- ❌ Database trigger (handle_new_user)
- ❌ Missing columns in usage_tracking
- ❌ RLS policies
- ❌ Our application code

It was a missing Supabase extension that Auth depends on.

## Prevention
For future projects:
- Verify all required Supabase extensions are enabled
- Use latest Supabase project templates
- Test auth flows immediately after project creation
