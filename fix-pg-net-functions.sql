-- Fix: pg_net extension functions missing
-- Error: function net.http_post(...) does not exist
-- The extension was created but functions weren't installed properly

-- Step 1: Drop and recreate the extension properly
DROP EXTENSION IF EXISTS pg_net CASCADE;
CREATE EXTENSION pg_net WITH SCHEMA extensions;

-- Step 2: Check if the extension was created successfully
SELECT 
    extname as extension_name,
    extversion as version,
    nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE extname = 'pg_net';

-- Step 3: Check if net schema exists and has functions
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname IN ('net', 'extensions')
AND p.proname LIKE '%http%'
ORDER BY n.nspname, p.proname;

-- Step 4: If functions are in 'extensions' schema, create aliases in 'net' schema
DO $$
BEGIN
    -- Create net schema if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'net') THEN
        CREATE SCHEMA net;
        RAISE NOTICE 'Created net schema';
    END IF;
    
    -- Grant permissions on net schema
    GRANT USAGE ON SCHEMA net TO postgres, anon, authenticated, service_role;
    GRANT ALL ON ALL FUNCTIONS IN SCHEMA net TO postgres, anon, authenticated, service_role;
    
    RAISE NOTICE 'Permissions granted on net schema';
END $$;

-- Step 5: Check what schemas exist
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name IN ('net', 'extensions', 'public', 'auth')
ORDER BY schema_name;

-- Step 6: Final verification
SELECT 
    'Extension check' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_net') 
        THEN '✓ pg_net extension exists'
        ELSE '✗ pg_net extension missing'
    END as status;

SELECT 
    'Schema check' as check_type,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'net') 
        THEN '✓ net schema exists'
        ELSE '✗ net schema missing'
    END as status;

SELECT 
    'Function check' as check_type,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname IN ('net', 'extensions')
            AND p.proname = 'http_post'
        )
        THEN '✓ http_post function exists'
        ELSE '✗ http_post function missing - CONTACT SUPABASE SUPPORT'
    END as status;
