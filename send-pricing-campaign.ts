/**
 * Script to send pricing announcement campaign to non-Pro users
 * 
 * Usage:
 * 1. Test mode (sends to admin only): npx tsx send-pricing-campaign.ts test
 * 2. Production mode (sends to all eligible users): npx tsx send-pricing-campaign.ts production
 */

const ADMIN_TOKEN = process.env.ADMIN_AUTH_TOKEN || ''

async function sendCampaign(testMode: boolean) {
  console.log(`\n🚀 Starting pricing campaign in ${testMode ? 'TEST' : 'PRODUCTION'} mode...\n`)

  try {
    const response = await fetch('http://localhost:3000/api/admin/send-pricing-campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({
        testMode
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Campaign failed:', data.error)
      return
    }

    console.log('\n✅ Campaign completed successfully!\n')
    console.log('📊 Results:')
    console.log(`   • Total recipients: ${data.results.total}`)
    console.log(`   • Successfully sent: ${data.results.sent}`)
    console.log(`   • Failed: ${data.results.failed}`)
    
    if (data.excluded) {
      console.log(`\n🚫 Excluded:`)
      console.log(`   • Pro users: ${data.excluded.proUsers}`)
      console.log(`   • Excluded emails: ${data.excluded.excludedEmails}`)
    }

    if (data.results.errors.length > 0) {
      console.log('\n⚠️  Errors:')
      data.results.errors.forEach((error: string) => console.log(`   • ${error}`))
    }

    console.log('\n✨ Campaign complete!\n')

  } catch (error) {
    console.error('❌ Error sending campaign:', error)
  }
}

// Parse command line arguments
const mode = process.argv[2]

if (!mode || !['test', 'production'].includes(mode)) {
  console.log(`
Usage:
  npx tsx send-pricing-campaign.ts test        # Send to admin only (test)
  npx tsx send-pricing-campaign.ts production  # Send to all eligible users

Make sure to set ADMIN_AUTH_TOKEN environment variable first.
  `)
  process.exit(1)
}

if (!ADMIN_TOKEN) {
  console.error('❌ Error: ADMIN_AUTH_TOKEN environment variable not set')
  console.log('\nGet your admin token by:')
  console.log('1. Log in to mycvbuddy.com as admin')
  console.log('2. Open browser console')
  console.log('3. Run: localStorage.getItem("supabase.auth.token")')
  console.log('4. Copy the access_token value')
  console.log('5. Set it: export ADMIN_AUTH_TOKEN="your-token-here"\n')
  process.exit(1)
}

const testMode = mode === 'test'

// Confirm production mode
if (!testMode) {
  console.log('\n⚠️  WARNING: You are about to send emails to ALL non-Pro users!')
  console.log('This will send to potentially hundreds of users.')
  console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to continue...\n')
  
  setTimeout(() => {
    sendCampaign(false)
  }, 5000)
} else {
  sendCampaign(true)
}
