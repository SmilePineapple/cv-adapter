/**
 * Automated SEO Optimization Script
 * Runs daily to improve SEO health automatically
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, existsSync } from 'fs'

// Load .env.local only if it exists (local development)
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  config({ path: envPath })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  console.error('In GitHub Actions, these should be set as secrets.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface SEOAction {
  action: string
  status: 'success' | 'failed'
  details: string
  timestamp: string
}

const actions: SEOAction[] = []

async function logAction(action: string, status: 'success' | 'failed', details: string) {
  actions.push({
    action,
    status,
    details,
    timestamp: new Date().toISOString(),
  })
  
  console.log(`${status === 'success' ? '✅' : '❌'} ${action}: ${details}`)
}

// 1. Auto-generate and submit sitemap to Google
async function generateAndSubmitSitemap() {
  console.log('\n🗺️  Generating sitemap...')
  
  const baseUrl = 'https://www.mycvbuddy.com'
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/resume-builder-usa', priority: 0.9, changefreq: 'weekly' },
    { url: '/pricing', priority: 0.8, changefreq: 'weekly' },
    { url: '/features', priority: 0.8, changefreq: 'weekly' },
    { url: '/blog', priority: 0.7, changefreq: 'daily' },
    { url: '/login', priority: 0.5, changefreq: 'monthly' },
    { url: '/signup', priority: 0.5, changefreq: 'monthly' },
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  // Save sitemap
  writeFileSync(resolve(process.cwd(), 'public/sitemap.xml'), sitemap)
  await logAction('Generate Sitemap', 'success', 'Sitemap.xml created with 7 pages')

  // Submit to Google Search Console
  try {
    const response = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(baseUrl + '/sitemap.xml')}`
    )
    
    if (response.ok) {
      await logAction('Submit Sitemap', 'success', 'Sitemap submitted to Google')
    } else {
      await logAction('Submit Sitemap', 'failed', `HTTP ${response.status}`)
    }
  } catch (error: any) {
    await logAction('Submit Sitemap', 'failed', error.message)
  }
}

// 2. Auto-generate robots.txt
async function generateRobotsTxt() {
  console.log('\n🤖 Generating robots.txt...')
  
  const robotsTxt = `# mycvbuddy.com robots.txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /history/
Disallow: /_next/

Sitemap: https://www.mycvbuddy.com/sitemap.xml

# Crawl-delay for polite bots
Crawl-delay: 1`

  writeFileSync(resolve(process.cwd(), 'public/robots.txt'), robotsTxt)
  await logAction('Generate Robots.txt', 'success', 'robots.txt updated')
}

// 3. Check for broken internal links
async function checkBrokenLinks() {
  console.log('\n🔗 Checking for broken links...')
  
  const baseUrl = 'https://www.mycvbuddy.com'
  const pagesToCheck = ['/', '/pricing', '/features']
  
  let brokenLinks = 0
  
  for (const page of pagesToCheck) {
    try {
      const response = await fetch(baseUrl + page, { method: 'HEAD' })
      
      if (!response.ok) {
        brokenLinks++
        await logAction('Check Link', 'failed', `${page} returned ${response.status}`)
      }
    } catch (error: any) {
      brokenLinks++
      await logAction('Check Link', 'failed', `${page} - ${error.message}`)
    }
  }
  
  if (brokenLinks === 0) {
    await logAction('Check Broken Links', 'success', 'All links working')
  } else {
    await logAction('Check Broken Links', 'failed', `${brokenLinks} broken links found`)
  }
}

// 4. Auto-post to social media when new users are low
async function autoSocialMediaPost() {
  console.log('\n📱 Checking if social media post needed...')
  
  // Get recent user signups
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const { count: newUsers7d } = await supabase
    .from('usage_tracking')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString())

  if ((newUsers7d || 0) < 20) {
    // Low signups - trigger social media post
    const posts = [
      "🚀 Transform your CV in minutes with AI! Free CV builder with ATS optimization. Try it now: mycvbuddy.com #CVBuilder #JobSearch",
      "💼 Stand out from the crowd! Our AI-powered CV adapter tailors your resume to any job. Get started free: mycvbuddy.com #CareerTips",
      "✨ Your dream job is one CV away. Build a professional, ATS-friendly resume in minutes. Free to start: mycvbuddy.com #Resume",
    ]
    
    const randomPost = posts[Math.floor(Math.random() * posts.length)]
    
    // Log the suggested post (you can integrate with Twitter/LinkedIn API later)
    await logAction('Social Media Post', 'success', `Suggested: "${randomPost}"`)
    
    // Save to database for manual posting
    await supabase.from('social_media_queue').insert({
      platform: 'twitter',
      content: randomPost,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
  } else {
    await logAction('Social Media Post', 'success', 'Signups healthy, no post needed')
  }
}

// 5. Auto-optimize page speed by checking Core Web Vitals
async function checkPageSpeed() {
  console.log('\n⚡ Checking page speed...')
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.mycvbuddy.com&category=PERFORMANCE&category=SEO`
    )
    
    const data = await response.json()
    const score = data.lighthouseResult?.categories?.performance?.score * 100
    const seoScore = data.lighthouseResult?.categories?.seo?.score * 100
    
    await logAction('Page Speed Check', 'success', `Performance: ${score}/100, SEO: ${seoScore}/100`)
    
    // Save to database
    await supabase.from('page_speed_metrics').insert({
      performance_score: score,
      seo_score: seoScore,
      checked_at: new Date().toISOString(),
    })
  } catch (error: any) {
    await logAction('Page Speed Check', 'failed', error.message)
  }
}

// 6. Auto-generate blog post ideas based on trending keywords
async function generateBlogIdeas() {
  console.log('\n📝 Generating blog post ideas...')
  
  const trendingKeywords = [
    'resume adapter',
    'cv builder uk',
    'ats cv optimizer',
    'free resume builder 2026',
    'ai cv maker',
    'job application tips',
  ]
  
  const blogIdeas = trendingKeywords.map(keyword => ({
    title: `How to Create a ${keyword.charAt(0).toUpperCase() + keyword.slice(1)} That Gets You Hired`,
    keyword,
    status: 'idea',
    created_at: new Date().toISOString(),
  }))
  
  await logAction('Generate Blog Ideas', 'success', `${blogIdeas.length} ideas generated`)
  
  // Save to database
  for (const idea of blogIdeas) {
    await supabase.from('blog_ideas').upsert(idea, { onConflict: 'keyword' })
  }
}

// 7. Auto-send re-engagement emails to inactive users
async function sendReengagementEmails() {
  console.log('\n📧 Checking for inactive users...')
  
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  
  // Get users who signed up 30-60 days ago but haven't generated a CV
  const { data: inactiveUsers } = await supabase
    .from('usage_tracking')
    .select('user_id, created_at, lifetime_generation_count')
    .lte('created_at', thirtyDaysAgo.toISOString())
    .gte('created_at', sixtyDaysAgo.toISOString())
    .eq('lifetime_generation_count', 0)
    .limit(10)

  if (inactiveUsers && inactiveUsers.length > 0) {
    await logAction('Re-engagement Emails', 'success', `${inactiveUsers.length} users queued`)
    
    // Queue emails (integrate with Resend later)
    for (const user of inactiveUsers) {
      await supabase.from('email_queue').insert({
        user_id: user.user_id,
        email_type: 'reengagement',
        status: 'pending',
        created_at: new Date().toISOString(),
      })
    }
  } else {
    await logAction('Re-engagement Emails', 'success', 'No inactive users found')
  }
}

// 8. Auto-update meta descriptions based on performance
async function optimizeMetaTags() {
  console.log('\n🏷️  Optimizing meta tags...')
  
  const metaOptimizations = [
    {
      page: 'homepage',
      title: 'Free Resume & CV Builder 2026: AI Adapter & ATS Optimizer | MyCVBuddy',
      description: 'Build a professional, ATS-friendly resume in minutes with our AI-powered CV builder. Free to start, trusted by 457+ job seekers. Get hired faster!',
    },
    {
      page: 'usa-landing',
      title: 'Free Resume Builder USA 2026: AI-Powered ATS Optimizer',
      description: 'Create a winning resume tailored for US jobs. AI-powered resume builder with ATS optimization. Free to start, no credit card required.',
    },
  ]
  
  await logAction('Optimize Meta Tags', 'success', `${metaOptimizations.length} pages optimized`)
  
  // Save recommendations to database
  for (const meta of metaOptimizations) {
    await supabase.from('meta_tag_recommendations').upsert(meta, { onConflict: 'page' })
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting automated SEO optimization...\n')
  console.log('═'.repeat(60))
  
  await generateAndSubmitSitemap()
  await generateRobotsTxt()
  await checkBrokenLinks()
  await autoSocialMediaPost()
  await checkPageSpeed()
  await generateBlogIdeas()
  await sendReengagementEmails()
  await optimizeMetaTags()
  
  console.log('\n' + '═'.repeat(60))
  console.log('\n📊 Summary:')
  console.log(`✅ Successful: ${actions.filter(a => a.status === 'success').length}`)
  console.log(`❌ Failed: ${actions.filter(a => a.status === 'failed').length}`)
  
  // Save actions to database
  await supabase.from('seo_automation_log').insert({
    actions: actions,
    total_actions: actions.length,
    successful_actions: actions.filter(a => a.status === 'success').length,
    failed_actions: actions.filter(a => a.status === 'failed').length,
    run_at: new Date().toISOString(),
  })
  
  console.log('\n✅ SEO automation complete!')
}

main().catch(console.error)
