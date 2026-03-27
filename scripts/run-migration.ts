/**
 * Run SQL migration via Supabase API
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
  console.log('📦 Running SEO metrics table migration...\n')

  // Read the SQL file
  const sqlPath = resolve(process.cwd(), 'supabase/migrations/20260327_create_seo_metrics_table.sql')
  const sql = readFileSync(sqlPath, 'utf-8')

  console.log('SQL to execute:')
  console.log('─'.repeat(60))
  console.log(sql)
  console.log('─'.repeat(60))
  console.log()

  // Execute the SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    console.error('❌ Migration failed:', error.message)
    console.error('Details:', error)
    
    // Try alternative approach: execute statements one by one
    console.log('\n🔄 Trying alternative approach...\n')
    
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i] + ';'
      console.log(`Executing statement ${i + 1}/${statements.length}...`)
      
      const { error: stmtError } = await supabase.rpc('exec_sql', { sql_query: stmt })
      
      if (stmtError) {
        console.error(`❌ Statement ${i + 1} failed:`, stmtError.message)
      } else {
        console.log(`✅ Statement ${i + 1} succeeded`)
      }
    }
    
    return
  }

  console.log('✅ Migration completed successfully!')
  console.log('Data:', data)

  // Verify the table was created
  const { data: tables, error: tableError } = await supabase
    .from('seo_metrics')
    .select('*')
    .limit(1)

  if (tableError) {
    console.error('⚠️  Warning: Could not verify table creation:', tableError.message)
  } else {
    console.log('✅ Table verified: seo_metrics exists')
  }
}

runMigration().catch(console.error)
