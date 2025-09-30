import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server component client (for use in server components)
export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies })
}

// Route handler client (for use in API routes)
export const createSupabaseRouteClient = () => {
  return createRouteHandlerClient({ cookies })
}

// Admin client (server-side only, with service role key)
export const createSupabaseAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
