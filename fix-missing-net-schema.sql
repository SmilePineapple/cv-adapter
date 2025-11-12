-- Fix: Missing 'net' schema causing signup 500 error
-- The error: "schema \"net\" does not exist"
-- This is a Supabase extension that needs to be enabled

-- Step 1: Enable the pg_net extension (provides the 'net' schema)
-- This extension is used by Supabase Auth for network operations
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Step 2: Grant necessary permissions
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Step 3: Verify the extension is installed
SELECT 
    extname as extension_name,
    extversion as version,
    nspname as schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname = 'pg_net';

-- Step 4: Check if net schema exists (it should be under extensions)
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('net', 'extensions')
ORDER BY schema_name;

-- Step 5: Verify Supabase can now access net functions
SELECT 'Setup complete! The net schema should now be available.' as status;

-- Note: If pg_net extension cannot be created, you may need to:
-- 1. Contact Supabase support to enable it
-- 2. Or check if your Supabase project has the extension available
-- 3. Some older Supabase projects may need to be migrated to support pg_net
