import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkSchema() {
  console.log('Checking usage_tracking schema...\n')

  const { data, error } = await supabase
    .from('usage_tracking')
    .select('*')
    .limit(3)

  if (error) {
    console.error('Error:', error.message)
    return
  }

  console.log('Sample rows from usage_tracking:')
  console.log(JSON.stringify(data, null, 2))
  
  if (data && data.length > 0) {
    console.log('\nColumn names:')
    console.log(Object.keys(data[0]).join(', '))
  }
}

checkSchema()
