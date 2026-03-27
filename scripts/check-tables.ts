import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkTables() {
  console.log('Checking available tables...\n')

  // Try to query cv_generations
  const { data: gens, error: gensError } = await supabase
    .from('cv_generations')
    .select('*')
    .limit(5)

  console.log('cv_generations:', gensError ? `Error: ${gensError.message}` : `${gens?.length} rows`)

  // Try to get user count from admin stats
  const { data: stats, error: statsError } = await supabase
    .rpc('get_admin_stats')

  console.log('get_admin_stats:', statsError ? `Error: ${statsError.message}` : stats)

  // List all tables we can access
  const tables = ['cv_generations', 'users', 'subscriptions', 'usage_tracking', 'cv_ratings']
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    console.log(`${table}:`, error ? `Error: ${error.message}` : `${count} rows`)
  }
}

checkTables()
