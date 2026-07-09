import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Singleton client instance to avoid Multiple GoTrueClient instances warning
//
// NOTE: annotated with the bare `SupabaseClient` class type (default generics), NOT
// `ReturnType<typeof createClientComponentClient>`. The latter looks equivalent but,
// due to a TypeScript quirk in how nested generic defaults (Database/SchemaName/Schema)
// resolve when extracted via ReturnType vs. calling the function directly, it collapsed
// the Postgrest `Schema` generic to `never` instead of `any`. That poisoned every
// `.from(...)` call downstream of `createSupabaseClient()` across the app (rows/inserts
// typed as `never`, ~100 spurious tsc errors). `@supabase/auth-helpers-nextjs` is also a
// generation behind the installed `@supabase/supabase-js` (5 type params vs. its 3), so
// the real return type doesn't structurally match `SupabaseClient` either - hence the
// `as unknown as SupabaseClient` cast below. See the July 2026 type-check cleanup.
let _clientInstance: SupabaseClient | null = null

// Client component client (for use in client components) - returns singleton
export const createSupabaseClient = (): SupabaseClient => {
  // During build/prerender on the server, return a build-time dummy
  if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key-for-build-only'
    )
  }
  // Return existing singleton to avoid multiple GoTrueClient instances
  if (!_clientInstance) {
    _clientInstance = createClientComponentClient() as unknown as SupabaseClient
  }
  return _clientInstance
}
