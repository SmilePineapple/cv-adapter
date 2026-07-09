/**
 * SEO Health Monitor
 * Runs daily to detect SEO regressions: broken sitemap URLs, robots.txt
 * contradictions, and missing metadata. Alerts by logging to Supabase and,
 * if any checks fail, emailing the site owner.
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  config({ path: envPath })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)
const BASE_URL = 'https://www.mycvbuddy.com'

interface CheckResult {
  check: string
  status: 'pass' | 'fail'
  details: string
}

const results: CheckResult[] = []

function record(check: string, status: 'pass' | 'fail', details: string) {
  results.push({ check, status, details })
  console.log(`${status === 'pass' ? '✅' : '❌'} ${check}: ${details}`)
}

// 1. Every URL in sitemap.xml should return 200
async function checkSitemapUrls() {
  console.log('\n🗺️  Checking sitemap URLs...')
  const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml')

  if (!existsSync(sitemapPath)) {
    record('Sitemap exists', 'fail', 'public/sitemap.xml is missing')
    return
  }

  const xml = readFileSync(sitemapPath, 'utf-8')
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])

  if (locs.length === 0) {
    record('Sitemap URLs', 'fail', 'No <loc> entries found in sitemap.xml')
    return
  }

  let broken = 0
  for (const url of locs) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      if (!response.ok) {
        broken++
        record('Sitemap URL', 'fail', `${url} returned ${response.status}`)
      }
    } catch (error: any) {
      broken++
      record('Sitemap URL', 'fail', `${url} - ${error.message}`)
    }
  }

  if (broken === 0) {
    record('Sitemap URLs', 'pass', `All ${locs.length} sitemap URLs return 200`)
  } else {
    record('Sitemap URLs', 'fail', `${broken}/${locs.length} sitemap URLs are broken`)
  }
}

// 2. robots.txt shouldn't Disallow a path that sitemap.xml lists as indexable
async function checkRobotsSitemapConsistency() {
  console.log('\n🤖 Checking robots.txt / sitemap.xml consistency...')
  const robotsPath = resolve(process.cwd(), 'public/robots.txt')
  const sitemapPath = resolve(process.cwd(), 'public/sitemap.xml')

  if (!existsSync(robotsPath) || !existsSync(sitemapPath)) {
    record('Robots/Sitemap consistency', 'fail', 'robots.txt or sitemap.xml missing')
    return
  }

  const robots = readFileSync(robotsPath, 'utf-8')
  const disallows = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)]
    .map(m => m[1])
    .filter(p => p && p !== '/')

  const xml = readFileSync(sitemapPath, 'utf-8')
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname)

  const conflicts: string[] = []
  for (const loc of locs) {
    for (const disallow of disallows) {
      const prefix = disallow.replace(/\*$/, '')
      if (loc === prefix || loc.startsWith(prefix)) {
        conflicts.push(`${loc} is in sitemap but disallowed by "${disallow}"`)
      }
    }
  }

  if (conflicts.length === 0) {
    record('Robots/Sitemap consistency', 'pass', 'No sitemap URLs are blocked by robots.txt')
  } else {
    record('Robots/Sitemap consistency', 'fail', conflicts.join('; '))
  }
}

// 3. Homepage should have basic metadata and structured data present
async function checkHomepageMetadata() {
  console.log('\n🏷️  Checking homepage metadata...')
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      record('Homepage reachable', 'fail', `Homepage returned ${response.status}`)
      return
    }
    const html = await response.text()

    const hasTitle = /<title>[^<]{10,}<\/title>/.test(html)
    const hasDescription = /<meta\s+name="description"\s+content="[^"]{20,}"/.test(html)
    const hasCanonical = /<link\s+rel="canonical"/.test(html)
    const hasJsonLd = /<script[^>]+type="application\/ld\+json"/.test(html)

    record('Homepage <title>', hasTitle ? 'pass' : 'fail', hasTitle ? 'present' : 'missing or too short')
    record('Homepage meta description', hasDescription ? 'pass' : 'fail', hasDescription ? 'present' : 'missing or too short')
    record('Homepage canonical link', hasCanonical ? 'pass' : 'fail', hasCanonical ? 'present' : 'missing')
    record('Homepage JSON-LD', hasJsonLd ? 'pass' : 'fail', hasJsonLd ? 'present' : 'missing')
  } catch (error: any) {
    record('Homepage reachable', 'fail', error.message)
  }
}

async function sendFailureAlert(failures: CheckResult[]) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set, skipping email alert')
    return
  }

  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'CV Buddy <noreply@mycvbuddy.com>',
      to: 'jakedalerourke@gmail.com',
      subject: `SEO Health Monitor: ${failures.length} check(s) failed`,
      text: failures.map(f => `[${f.check}] ${f.details}`).join('\n'),
    })
  } catch (error: any) {
    console.error('Failed to send alert email:', error.message)
  }
}

async function main() {
  console.log('🩺 Running SEO health checks...\n')
  console.log('═'.repeat(60))

  await checkSitemapUrls()
  await checkRobotsSitemapConsistency()
  await checkHomepageMetadata()

  console.log('\n' + '═'.repeat(60))
  const failures = results.filter(r => r.status === 'fail')
  console.log(`\n📊 Summary: ${results.length - failures.length}/${results.length} checks passed`)

  await supabase.from('seo_automation_log').insert({
    actions: results.map(r => ({
      action: r.check,
      status: r.status === 'pass' ? 'success' : 'failed',
      details: r.details,
      timestamp: new Date().toISOString(),
    })),
    total_actions: results.length,
    successful_actions: results.length - failures.length,
    failed_actions: failures.length,
    run_at: new Date().toISOString(),
  })

  if (failures.length > 0) {
    await sendFailureAlert(failures)
    console.error(`\n❌ ${failures.length} SEO check(s) failed`)
    process.exit(1)
  }

  console.log('\n✅ All SEO checks passed')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
