import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Server component client (for use in server components)
export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies })
}

// Route handler client (for use in API routes)
// @supabase/auth-helpers-nextjs is deprecated and its types expect the pre-Next15
// synchronous cookies() signature (or, per its own .d.ts, a Promise-returning one -
// the two don't actually agree). We've already awaited cookies() above, so the
// function below returns the resolved store synchronously, exactly as the
// library's runtime code (NextRouteHandlerAuthStorageAdapter.getCookie/setCookie)
// expects - the `as any` only silences the mismatched type, it changes no behavior.
export const createSupabaseRouteClient = async () => {
  const cookieStore = await cookies()
  return createRouteHandlerClient({ cookies: (() => cookieStore) as any })
}

// Admin client (server-side only, with service role key)
export const createSupabaseAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey || !supabaseUrl) {
    // During build time, env vars might not be available
    // Return a dummy client that will fail at runtime if actually used
    if (process.env.NODE_ENV === 'production' && !serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
    }
    // During build, return a placeholder
    return createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
