import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Client-side Supabase client (nullable if env vars missing)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Client component client (for use in client components)
export const createSupabaseClient = () => {
  // During build/prerender, env vars might not be available
  // Return a client with placeholder values that will be replaced at runtime
  if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    // Server-side during build - return a dummy client
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key-for-build-only'
    )
  }
  return createClientComponentClient()
}
