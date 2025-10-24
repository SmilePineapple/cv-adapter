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
    const { companyUrl, userId } = await request.json()

    if (!companyUrl || !userId) {
      return NextResponse.json(
        { error: 'Company URL and user ID are required' },
        { status: 400 }
      )
    }

    // Check if user is Pro (this feature is Pro-only)
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'

    if (!isPro) {
      return NextResponse.json(
        { 
          error: 'Company research is a Pro feature. Upgrade to access!',
          requiresUpgrade: true
        },
        { status: 403 }
      )
    }

    console.log('[Company Research] Researching company:', companyUrl)

    // Fetch company website
    let html = ''
    try {
      const response = await fetch(companyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow'
      })

      if (response.ok) {
        html = await response.text()
      }
    } catch (error) {
      console.error('[Company Research] Fetch error:', error)
      // Continue with AI research even if fetch fails
    }

    // Use OpenAI to research company (cost-effective approach)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages: [
        {
          role: 'system',
          content: `You are an expert company research analyst. Provide a COMPREHENSIVE and DETAILED research report for interview preparation.

Analyze deeply and provide specific, actionable insights:

1. **Company Overview**: Industry, size, founding year, headquarters, key markets
2. **Business Model**: How they make money, target customers, competitive advantages
3. **Products/Services**: Detailed list with descriptions of main offerings
4. **Company Culture**: Work environment, employee reviews, management style, perks
5. **Values & Mission**: Core values, mission statement, what they stand for
6. **Recent News**: Latest achievements, product launches, expansions, awards (last 6-12 months)
7. **Competitors**: Main competitors and how this company differentiates
8. **Growth & Future**: Expansion plans, new markets, strategic direction
9. **Interview Tips**: 5-7 specific tips for interviewing at THIS company
10. **Questions to Ask**: 5-7 intelligent questions that show you researched them
11. **Red Flags to Watch**: Potential concerns or things to clarify
12. **Key People**: CEO, founders, key executives to know about
13. **Company Stats**: Employee count, revenue (if public), locations, year founded

Be DETAILED and SPECIFIC. Provide real insights, not generic statements.

Return JSON:
{
  "company_name": "Full Company Name",
  "industry": "Specific industry/sector",
  "founded": "Year or 'Unknown'",
  "headquarters": "City, Country",
  "employee_count": "Estimated number or range",
  "overview": "2-3 paragraph detailed overview",
  "business_model": "How they make money and serve customers",
  "products_services": [
    {"name": "Product/Service 1", "description": "What it does"},
    {"name": "Product/Service 2", "description": "What it does"}
  ],
  "culture": "Detailed description of company culture and work environment",
  "values": ["Value 1 with explanation", "Value 2 with explanation", "Value 3 with explanation"],
  "mission_statement": "Their mission or purpose",
  "recent_news": [
    "Recent achievement 1 with details",
    "Recent achievement 2 with details",
    "Recent achievement 3 with details"
  ],
  "competitors": ["Competitor 1", "Competitor 2", "Competitor 3"],
  "competitive_advantage": "What makes them different/better",
  "growth_plans": "Future direction and expansion plans",
  "interview_tips": [
    "Specific tip 1 for this company",
    "Specific tip 2 for this company",
    "Specific tip 3 for this company",
    "Specific tip 4 for this company",
    "Specific tip 5 for this company"
  ],
  "questions_to_ask": [
    "Intelligent question 1 about their business",
    "Intelligent question 2 about growth",
    "Intelligent question 3 about culture",
    "Intelligent question 4 about challenges",
    "Intelligent question 5 about future"
  ],
  "red_flags": ["Potential concern 1", "Thing to clarify 2"],
  "key_people": [
    {"name": "CEO Name", "role": "CEO", "background": "Brief background"},
    {"name": "Founder Name", "role": "Founder", "background": "Brief background"}
  ],
  "key_facts": [
    "Important fact 1",
    "Important fact 2",
    "Important fact 3",
    "Important fact 4",
    "Important fact 5"
  ]
}`
        },
        {
          role: 'user',
          content: html 
            ? `Research this company THOROUGHLY for interview preparation:\n\nURL: ${companyUrl}\n\nWebsite content:\n${html.substring(0, 12000)}\n\nIMPORTANT: Provide DETAILED, SPECIFIC information. Don't be generic. Extract real facts, names, numbers, and insights from the website. Be comprehensive - this is for serious interview preparation!`
            : `Research this company: ${companyUrl}\n\nNote: Unable to fetch website content. Use your knowledge to provide detailed research based on the URL and company name. Be as specific as possible.`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower for more factual responses
      max_tokens: 4000 // Maximum detail for comprehensive research
    })

    const companyData = JSON.parse(completion.choices[0].message.content || '{}')

    console.log('[Company Research] Research complete')

    return NextResponse.json({
      success: true,
      companyData,
      message: 'Company research completed successfully!'
    })

  } catch (error: any) {
    console.error('[Company Research] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to research company' },
      { status: 500 }
    )
  }
}
