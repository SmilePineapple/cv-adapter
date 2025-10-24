import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const { linkedinUrl, userId } = await request.json()

    if (!linkedinUrl || !userId) {
      return NextResponse.json(
        { error: 'LinkedIn URL and user ID are required' },
        { status: 400 }
      )
    }

    // Validate LinkedIn URL
    if (!linkedinUrl.includes('linkedin.com/in/')) {
      return NextResponse.json(
        { error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)' },
        { status: 400 }
      )
    }

    // Check user's subscription tier for gating
    const { data: usage } = await supabase
      .from('usage_tracking')
      .select('subscription_tier, linkedin_imports_used')
      .eq('user_id', userId)
      .single()

    const subscriptionTier = usage?.subscription_tier || 'free'
    const isPro = subscriptionTier === 'pro_monthly' || subscriptionTier === 'pro_annual'
    const linkedinImportsUsed = usage?.linkedin_imports_used || 0

    // Gate: Free = 1 import, Pro = unlimited
    if (!isPro && linkedinImportsUsed >= 1) {
      return NextResponse.json(
        { 
          error: 'You have used your free LinkedIn import. Upgrade to Pro for unlimited imports!',
          requiresUpgrade: true
        },
        { status: 403 }
      )
    }

    console.log('[LinkedIn Scrape] Fetching profile:', linkedinUrl)

    // Option 1: Proxycurl (Recommended - $0.01 per profile)
    if (process.env.PROXYCURL_API_KEY) {
      const response = await fetch(`https://nubela.co/proxycurl/api/v2/linkedin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`
        },
        // @ts-ignore
        params: {
          url: linkedinUrl,
          fallback_to_cache: 'on-error',
          use_cache: 'if-present',
          skills: 'include',
          inferred_salary: 'exclude',
          personal_email: 'exclude',
          personal_contact_number: 'exclude',
          twitter_profile_id: 'exclude',
          facebook_profile_id: 'exclude',
          github_profile_id: 'exclude',
          extra: 'exclude'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('[LinkedIn Scrape] Proxycurl error:', error)
        throw new Error('Failed to fetch LinkedIn profile')
      }

      const profileData = await response.json()
      const cvSections = convertProxycurlToSections(profileData)

      // Create CV record
      const { data: cv, error: cvError } = await supabase
        .from('cvs')
        .insert({
          user_id: userId,
          file_meta: {
            name: `${profileData.full_name || 'LinkedIn Import'}`,
            size: 0,
            type: 'application/json',
            upload_date: new Date().toISOString(),
            source: 'linkedin_scrape',
            linkedin_url: linkedinUrl
          },
          parsed_sections: cvSections,
          original_text: JSON.stringify(profileData),
          detected_language: 'en'
        })
        .select()
        .single()

      if (cvError) {
        console.error('[LinkedIn Scrape] CV creation error:', cvError)
        throw cvError
      }

      // Increment counter
      await supabase
        .from('usage_tracking')
        .update({
          linkedin_imports_used: linkedinImportsUsed + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      console.log('[LinkedIn Scrape] CV created successfully:', cv.id)

      return NextResponse.json({
        success: true,
        cvId: cv.id,
        sections: cvSections,
        message: 'LinkedIn profile imported successfully!'
      })
    }

    // Option 2: RapidAPI LinkedIn Scraper (Fallback)
    if (process.env.RAPIDAPI_KEY) {
      const response = await fetch('https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url', {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'linkedin-data-api.p.rapidapi.com'
        },
        // @ts-ignore
        params: {
          url: linkedinUrl
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch LinkedIn profile')
      }

      const profileData = await response.json()
      // Convert RapidAPI format to sections
      // (Implementation depends on RapidAPI response format)
      
      return NextResponse.json({
        success: true,
        message: 'LinkedIn profile imported successfully!'
      })
    }

    // No API key configured
    return NextResponse.json(
      { 
        error: 'LinkedIn scraping is not configured. Please contact support.',
        fallbackToPaste: true
      },
      { status: 503 }
    )

  } catch (error: any) {
    console.error('[LinkedIn Scrape] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to import LinkedIn profile' },
      { status: 500 }
    )
  }
}

function convertProxycurlToSections(data: any) {
  const sections = []

  // Personal Info
  sections.push({
    type: 'personal_info',
    title: 'Personal Information',
    content: {
      name: data.full_name || '',
      title: data.headline || '',
      summary: data.summary || '',
      location: data.city ? `${data.city}, ${data.country}` : '',
      email: data.email || '',
      phone: data.phone_number || ''
    }
  })

  // Work Experience
  if (data.experiences && data.experiences.length > 0) {
    sections.push({
      type: 'work_experience',
      title: 'Work Experience',
      content: data.experiences.map((exp: any) => ({
        job_title: exp.title || '',
        company: exp.company || '',
        dates: `${exp.starts_at?.month || ''}/${exp.starts_at?.year || ''} - ${exp.ends_at ? `${exp.ends_at.month}/${exp.ends_at.year}` : 'Present'}`,
        description: exp.description || ''
      }))
    })
  }

  // Education
  if (data.education && data.education.length > 0) {
    sections.push({
      type: 'education',
      title: 'Education',
      content: data.education.map((edu: any) => ({
        degree: edu.degree_name || edu.field_of_study || '',
        institution: edu.school || '',
        dates: `${edu.starts_at?.year || ''} - ${edu.ends_at?.year || ''}`,
        details: edu.description || ''
      }))
    })
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    sections.push({
      type: 'skills',
      title: 'Skills',
      content: data.skills.join(', ')
    })
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    sections.push({
      type: 'certifications',
      title: 'Certifications',
      content: data.certifications.map((cert: any) => ({
        name: cert.name || '',
        issuer: cert.authority || '',
        date: cert.starts_at ? `${cert.starts_at.month}/${cert.starts_at.year}` : ''
      }))
    })
  }

  return sections
}
