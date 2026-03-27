/**
 * Automated SEO Monitoring Script
 * Runs daily to check SEO health and alert on issues
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  console.error('Make sure .env.local exists with these values')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface SEOMetrics {
  date: string
  totalUsers: number
  newUsers24h: number
  newUsers7d: number
  activeUsers30d: number
  totalGenerations: number
  generations7d: number
  conversionRate: number
  avgGenerationsPerUser: number
}

interface SEOAlert {
  type: 'critical' | 'warning' | 'info'
  metric: string
  message: string
  currentValue: number
  expectedValue: number
  percentageChange: number
}

async function getMetrics(): Promise<SEOMetrics> {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Get total users from usage_tracking
  const { count: totalUsers } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })

  // Get new users in last 24h
  const { count: newUsers24h } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', oneDayAgo.toISOString())

  // Get new users in last 7 days
  const { count: newUsers7d } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())

  // Get active users in last 30 days (users who generated CVs recently)
  const { count: activeUsers30d } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .gte('last_generation_at', thirtyDaysAgo.toISOString())

  // Get total generations (sum of cv_generations_count from usage_tracking)
  const { data: usageData } = await supabase
    .from('usage_tracking')
    .select('cv_generations_count')
  
  const totalGenerations = usageData?.reduce((sum, row) => sum + (row.cv_generations_count || 0), 0) || 0

  // Get generations in last 7 days (count users who generated in last 7 days * their avg)
  const { data: recentUsers } = await supabase
    .from('usage_tracking')
    .select('cv_generations_count')
    .gte('last_generation_at', sevenDaysAgo.toISOString())
  
  const generations7d = recentUsers?.reduce((sum, row) => sum + (row.cv_generations_count || 0), 0) || 0

  // Get paying customers from subscriptions table
  const { count: payingCustomers } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const conversionRate = totalUsers ? (payingCustomers! / totalUsers) * 100 : 0
  const avgGenerationsPerUser = totalUsers ? totalGenerations! / totalUsers : 0

  return {
    date: now.toISOString(),
    totalUsers: totalUsers || 0,
    newUsers24h: newUsers24h || 0,
    newUsers7d: newUsers7d || 0,
    activeUsers30d: activeUsers30d || 0,
    totalGenerations: totalGenerations || 0,
    generations7d: generations7d || 0,
    conversionRate,
    avgGenerationsPerUser,
  }
}

async function checkAlerts(metrics: SEOMetrics): Promise<SEOAlert[]> {
  const alerts: SEOAlert[] = []

  // Expected baseline (pre-Feb 13 levels)
  const expectedNewUsers24h = 9 // 9 users/day before drop
  const expectedNewUsers7d = 63 // 9 * 7
  const expectedGenerations7d = 50 // Healthy level
  const expectedActiveRate = 10 // 10% of users active

  // Alert: New users too low
  if (metrics.newUsers24h < expectedNewUsers24h * 0.5) {
    alerts.push({
      type: 'critical',
      metric: 'New Users (24h)',
      message: `New user signups critically low: ${metrics.newUsers24h}/day vs expected ${expectedNewUsers24h}/day`,
      currentValue: metrics.newUsers24h,
      expectedValue: expectedNewUsers24h,
      percentageChange: ((metrics.newUsers24h - expectedNewUsers24h) / expectedNewUsers24h) * 100,
    })
  }

  // Alert: Weekly signups too low
  if (metrics.newUsers7d < expectedNewUsers7d * 0.5) {
    alerts.push({
      type: 'critical',
      metric: 'New Users (7d)',
      message: `Weekly signups critically low: ${metrics.newUsers7d} vs expected ${expectedNewUsers7d}`,
      currentValue: metrics.newUsers7d,
      expectedValue: expectedNewUsers7d,
      percentageChange: ((metrics.newUsers7d - expectedNewUsers7d) / expectedNewUsers7d) * 100,
    })
  }

  // Alert: Generations too low
  if (metrics.generations7d < expectedGenerations7d * 0.5) {
    alerts.push({
      type: 'warning',
      metric: 'Generations (7d)',
      message: `CV generations low: ${metrics.generations7d} vs expected ${expectedGenerations7d}`,
      currentValue: metrics.generations7d,
      expectedValue: expectedGenerations7d,
      percentageChange: ((metrics.generations7d - expectedGenerations7d) / expectedGenerations7d) * 100,
    })
  }

  // Alert: Active users too low
  const activeRate = (metrics.activeUsers30d / metrics.totalUsers) * 100
  if (activeRate < expectedActiveRate) {
    alerts.push({
      type: 'warning',
      metric: 'Active Users Rate',
      message: `Active user rate low: ${activeRate.toFixed(1)}% vs expected ${expectedActiveRate}%`,
      currentValue: activeRate,
      expectedValue: expectedActiveRate,
      percentageChange: ((activeRate - expectedActiveRate) / expectedActiveRate) * 100,
    })
  }

  // Alert: Conversion rate too low
  if (metrics.conversionRate < 2) {
    alerts.push({
      type: 'info',
      metric: 'Conversion Rate',
      message: `Conversion rate below target: ${metrics.conversionRate.toFixed(2)}% vs target 2%`,
      currentValue: metrics.conversionRate,
      expectedValue: 2,
      percentageChange: ((metrics.conversionRate - 2) / 2) * 100,
    })
  }

  return alerts
}

async function saveMetrics(metrics: SEOMetrics) {
  // Save to seo_metrics table
  const { error } = await supabase
    .from('seo_metrics')
    .insert({
      date: metrics.date,
      total_users: metrics.totalUsers,
      new_users_24h: metrics.newUsers24h,
      new_users_7d: metrics.newUsers7d,
      active_users_30d: metrics.activeUsers30d,
      total_generations: metrics.totalGenerations,
      generations_7d: metrics.generations7d,
      conversion_rate: metrics.conversionRate,
      avg_generations_per_user: metrics.avgGenerationsPerUser,
    })

  if (error) {
    console.error('Error saving metrics:', error)
  }
}

async function sendAlertEmail(alerts: SEOAlert[]) {
  if (alerts.length === 0) return

  const criticalAlerts = alerts.filter(a => a.type === 'critical')
  const warningAlerts = alerts.filter(a => a.type === 'warning')

  const emailBody = `
    <h2>🚨 SEO Health Alert - ${new Date().toLocaleDateString()}</h2>
    
    ${criticalAlerts.length > 0 ? `
      <h3 style="color: red;">Critical Issues (${criticalAlerts.length})</h3>
      <ul>
        ${criticalAlerts.map(a => `
          <li>
            <strong>${a.metric}:</strong> ${a.message}<br/>
            Current: ${a.currentValue} | Expected: ${a.expectedValue} | Change: ${a.percentageChange.toFixed(1)}%
          </li>
        `).join('')}
      </ul>
    ` : ''}
    
    ${warningAlerts.length > 0 ? `
      <h3 style="color: orange;">Warnings (${warningAlerts.length})</h3>
      <ul>
        ${warningAlerts.map(a => `
          <li>
            <strong>${a.metric}:</strong> ${a.message}<br/>
            Current: ${a.currentValue} | Expected: ${a.expectedValue} | Change: ${a.percentageChange.toFixed(1)}%
          </li>
        `).join('')}
      </ul>
    ` : ''}
    
    <p><a href="https://www.mycvbuddy.com/admin">View Admin Dashboard</a></p>
  `

  // Send via Resend
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'SEO Monitor <alerts@mycvbuddy.com>',
      to: ['jakedalerourke@gmail.com'],
      subject: `🚨 SEO Alert: ${criticalAlerts.length} Critical Issues`,
      html: emailBody,
    }),
  })

  if (!response.ok) {
    console.error('Failed to send alert email:', await response.text())
  }
}

async function main() {
  console.log('🔍 Running SEO health check...')

  // Get current metrics
  const metrics = await getMetrics()
  console.log('📊 Current Metrics:', metrics)

  // Check for alerts
  const alerts = await checkAlerts(metrics)
  console.log(`⚠️  Found ${alerts.length} alerts`)

  // Save metrics to database
  await saveMetrics(metrics)

  // Send alert email if needed
  if (alerts.length > 0) {
    await sendAlertEmail(alerts)
    console.log('📧 Alert email sent')
  }

  // Print summary
  console.log('\n=== SEO Health Summary ===')
  console.log(`Total Users: ${metrics.totalUsers}`)
  console.log(`New Users (24h): ${metrics.newUsers24h}`)
  console.log(`New Users (7d): ${metrics.newUsers7d}`)
  console.log(`Active Users (30d): ${metrics.activeUsers30d}`)
  console.log(`Generations (7d): ${metrics.generations7d}`)
  console.log(`Conversion Rate: ${metrics.conversionRate.toFixed(2)}%`)
  console.log(`Avg Gens/User: ${metrics.avgGenerationsPerUser.toFixed(2)}`)
  console.log('========================\n')
}

main().catch(console.error)
