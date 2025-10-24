import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { jobUrl, userId } = await request.json()

    if (!jobUrl || !userId) {
      return NextResponse.json(
        { error: 'Job URL and user ID are required' },
        { status: 400 }
      )
    }

    // Check user's subscription tier for gating
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('subscription_tier, job_scrapes_used')
      .eq('user_id', userId)
      .single()

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
    const jobScrapesUsed = usage?.job_scrapes_used || 0

    // Gate: Free = 3 scrapes, Pro = unlimited
    if (!isPro && jobScrapesUsed >= 3) {
      return NextResponse.json(
        { 
          error: 'You have used your 3 free job scrapes. Upgrade to Pro for unlimited!',
          requiresUpgrade: true
        },
        { status: 403 }
      )
    }

    console.log('[Job Scrape] Fetching job from URL:', jobUrl)

    // Fetch the job page HTML with better error handling
    let html = ''
    
    try {
      const response = await fetch(jobUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        redirect: 'follow'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      html = await response.text()
      
      if (!html || html.length < 100) {
        throw new Error('Received empty or invalid HTML')
      }
    } catch (fetchError: any) {
      console.error('[Job Scrape] Fetch error:', fetchError.message)
      
      // Fallback: Ask user to paste job description directly
      return NextResponse.json(
        { 
          error: 'Unable to fetch job posting directly. This site may block automated access.',
          suggestion: 'Please copy and paste the job description manually into the form below.',
          fallbackMode: true
        },
        { status: 400 }
      )
    }

    // Use OpenAI to extract job details from HTML
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a job posting parser. Extract structured job data from HTML.

Return a JSON object with:
{
  "job_title": "Job Title",
  "company": "Company Name",
  "location": "Location",
  "job_description": "Full job description text",
  "requirements": "List of requirements",
  "salary": "Salary range if mentioned",
  "job_type": "Full-time/Part-time/Contract",
  "remote": "Remote/Hybrid/On-site"
}

Extract as much information as possible. If a field is missing, return empty string.`
        },
        {
          role: 'user',
          content: `Extract job details from this HTML:\n\n${html.substring(0, 10000)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })

    const jobData = JSON.parse(completion.choices[0].message.content || '{}')

    console.log('[Job Scrape] Successfully parsed job posting')

    // Increment job scrapes counter
    await supabase
      .from('usage_tracking')
      .update({
        job_scrapes_used: jobScrapesUsed + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    return NextResponse.json({
      success: true,
      jobData,
      message: 'Job posting scraped successfully!'
    })

  } catch (error: any) {
    console.error('[Job Scrape] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to scrape job posting' },
      { status: 500 }
    )
  }
}
