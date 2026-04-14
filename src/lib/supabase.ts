import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton client instance to avoid Multiple GoTrueClient instances warning
let _clientInstance: ReturnType<typeof createClientComponentClient> | null = null

// Client component client (for use in client components) - returns singleton
export const createSupabaseClient = (): ReturnType<typeof createClientComponentClient> => {
  // During build/prerender on the server, return a build-time dummy
  if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key-for-build-only'
    ) as ReturnType<typeof createClientComponentClient>
  }
  // Return existing singleton to avoid multiple GoTrueClient instances
  if (!_clientInstance) {
    _clientInstance = createClientComponentClient()
  }
  return _clientInstance
}
