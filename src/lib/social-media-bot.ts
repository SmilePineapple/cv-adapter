/**
 * Social Media Bot - Automated Content Generation & Posting
 * 
 * Features:
 * - AI-generated content for CV/career topics
 * - Multi-platform support (Twitter/X, LinkedIn, Facebook)
 * - Daily automated posting
 * - Engagement tracking
 * - Content variety (tips, stats, questions, testimonials)
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Content types for variety
export type ContentType = 
  | 'cv_tip'           // Quick CV writing tip
  | 'career_advice'    // Career development advice
  | 'job_search_tip'   // Job hunting strategy
  | 'industry_stat'    // Interesting employment statistic
  | 'ats_tip'          // ATS optimization advice
  | 'interview_prep'   // Interview preparation tip
  | 'success_story'    // User success story template
  | 'question'         // Engagement question
  | 'myth_buster'      // Common CV myth debunked
  | 'tool_feature'     // Highlight CV Adapter feature

// Platform types
export type Platform = 'twitter' | 'linkedin' | 'facebook' | 'instagram'

// Post template
export interface SocialPost {
  id: string
  content: string
  platform: Platform
  contentType: ContentType
  hashtags: string[]
  scheduledFor: Date
  posted: boolean
  engagement?: {
    likes: number
    shares: number
    comments: number
    clicks: number
  }
}

/**
 * Generate engaging social media content using AI
 */
export async function generateSocialContent(
  contentType: ContentType,
  platform: Platform
): Promise<{ content: string; hashtags: string[] }> {
  
  const characterLimits = {
    twitter: 280,
    linkedin: 3000,
    facebook: 2000,
    instagram: 2200
  }

  const maxLength = characterLimits[platform]

  const prompt = `You are a social media expert for CV Adapter, an AI-powered CV generation tool.

Generate a ${contentType.replace('_', ' ')} post for ${platform}.

Guidelines:
- Be engaging, helpful, and professional
- Include a clear call-to-action when appropriate
- Use emojis strategically (not too many)
- Keep it under ${maxLength} characters
- Make it shareable and valuable
- Focus on helping job seekers
- Mention CV Adapter naturally when relevant
- Create urgency or curiosity when appropriate

Content Type: ${contentType}

Examples of good posts:
- "Did you know 75% of CVs never reach a human? 🤖 ATS systems filter them out first. Here's how to beat them..."
- "Your CV has 6 seconds to impress. Make every word count. ⏱️ Try our AI-powered CV optimizer: [link]"
- "Question: What's the biggest mistake you've made on your CV? 💭 (We've seen them all!)"

Generate an engaging post now:`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a social media content creator specializing in career advice and CV optimization.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    })

    const content = response.choices[0].message.content?.trim() || ''
    
    // Generate relevant hashtags
    const hashtags = generateHashtags(contentType, platform)

    return { content, hashtags }
  } catch (error) {
    console.error('Error generating social content:', error)
    throw error
  }
}

/**
 * Generate relevant hashtags based on content type and platform
 */
function generateHashtags(contentType: ContentType, platform: Platform): string[] {
  const baseHashtags = ['CVTips', 'CareerAdvice', 'JobSearch', 'CVWriting']
  
  const contentHashtags: Record<ContentType, string[]> = {
    cv_tip: ['CVTips', 'ResumeWriting', 'CareerTips'],
    career_advice: ['CareerAdvice', 'CareerGrowth', 'ProfessionalDevelopment'],
    job_search_tip: ['JobSearch', 'JobHunt', 'JobSeekers'],
    industry_stat: ['CareerStats', 'JobMarket', 'Employment'],
    ats_tip: ['ATS', 'ATSOptimization', 'CVOptimization'],
    interview_prep: ['InterviewTips', 'JobInterview', 'InterviewPrep'],
    success_story: ['SuccessStory', 'CareerSuccess', 'JobOffer'],
    question: ['CareerChat', 'JobSearchTips', 'CVHelp'],
    myth_buster: ['CVMyths', 'CareerMyths', 'FactCheck'],
    tool_feature: ['CVAdapter', 'AITools', 'CareerTools']
  }

  const platformHashtags: Record<Platform, string[]> = {
    twitter: ['Jobs', 'Careers', 'Hiring'],
    linkedin: ['LinkedIn', 'Networking', 'ProfessionalGrowth'],
    facebook: ['JobSearch', 'CareerAdvice', 'Employment'],
    instagram: ['CareerGoals', 'JobSearchTips', 'ProfessionalLife']
  }

  // Combine and limit to 5-7 hashtags
  const allHashtags = [
    ...contentHashtags[contentType],
    ...platformHashtags[platform],
    ...baseHashtags
  ]

  // Remove duplicates and limit
  const uniqueHashtags = Array.from(new Set(allHashtags))
  const maxHashtags = platform === 'instagram' ? 10 : 5
  
  return uniqueHashtags.slice(0, maxHashtags)
}

/**
 * Get a varied content schedule for the week
 */
export function getWeeklyContentSchedule(): ContentType[] {
  return [
    'cv_tip',           // Monday - Start week with actionable tip
    'industry_stat',    // Tuesday - Share interesting data
    'question',         // Wednesday - Engage audience
    'ats_tip',          // Thursday - Technical advice
    'career_advice',    // Friday - Weekend motivation
    'success_story',    // Saturday - Inspire with success
    'myth_buster'       // Sunday - Educational content
  ]
}

/**
 * Generate a full week of content
 */
export async function generateWeeklyContent(
  platform: Platform,
  startDate: Date = new Date()
): Promise<SocialPost[]> {
  const schedule = getWeeklyContentSchedule()
  const posts: SocialPost[] = []

  for (let i = 0; i < schedule.length; i++) {
    const contentType = schedule[i]
    const scheduledDate = new Date(startDate)
    scheduledDate.setDate(scheduledDate.getDate() + i)
    scheduledDate.setHours(10, 0, 0, 0) // Post at 10 AM

    try {
      const { content, hashtags } = await generateSocialContent(contentType, platform)
      
      posts.push({
        id: `${platform}-${scheduledDate.toISOString()}-${contentType}`,
        content,
        platform,
        contentType,
        hashtags,
        scheduledFor: scheduledDate,
        posted: false
      })

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`Error generating content for ${contentType}:`, error)
    }
  }

  return posts
}

/**
 * Format post with hashtags for platform
 */
export function formatPostForPlatform(post: SocialPost): string {
  const { content, hashtags, platform } = post

  // Add link to CV Adapter
  const link = 'https://www.mycvbuddy.com'
  
  let formattedContent = content

  // Add link if not already present
  if (!content.includes('mycvbuddy.com') && !content.includes('[link]')) {
    formattedContent += `\n\n🔗 ${link}`
  } else {
    formattedContent = formattedContent.replace('[link]', link)
  }

  // Add hashtags based on platform
  if (platform === 'twitter') {
    // Twitter: hashtags inline or at end
    formattedContent += `\n\n${hashtags.map(h => `#${h}`).join(' ')}`
  } else if (platform === 'linkedin') {
    // LinkedIn: hashtags at end, more professional
    formattedContent += `\n\n${hashtags.map(h => `#${h}`).join(' ')}`
  } else if (platform === 'instagram') {
    // Instagram: lots of hashtags, separate section
    formattedContent += `\n\n.\n.\n.\n${hashtags.map(h => `#${h}`).join(' ')}`
  } else {
    // Facebook: fewer hashtags
    formattedContent += `\n\n${hashtags.slice(0, 3).map(h => `#${h}`).join(' ')}`
  }

  return formattedContent
}

/**
 * Get best posting times for each platform
 */
export function getBestPostingTime(platform: Platform, dayOfWeek: number): { hour: number; minute: number } {
  // Based on engagement data research
  const bestTimes: Record<Platform, Record<number, { hour: number; minute: number }>> = {
    twitter: {
      0: { hour: 9, minute: 0 },   // Sunday
      1: { hour: 12, minute: 0 },  // Monday
      2: { hour: 12, minute: 0 },  // Tuesday
      3: { hour: 12, minute: 0 },  // Wednesday
      4: { hour: 12, minute: 0 },  // Thursday
      5: { hour: 11, minute: 0 },  // Friday
      6: { hour: 10, minute: 0 }   // Saturday
    },
    linkedin: {
      0: { hour: 10, minute: 0 },  // Sunday
      1: { hour: 8, minute: 0 },   // Monday
      2: { hour: 8, minute: 0 },   // Tuesday
      3: { hour: 8, minute: 0 },   // Wednesday
      4: { hour: 8, minute: 0 },   // Thursday
      5: { hour: 9, minute: 0 },   // Friday
      6: { hour: 10, minute: 0 }   // Saturday
    },
    facebook: {
      0: { hour: 13, minute: 0 },  // Sunday
      1: { hour: 13, minute: 0 },  // Monday
      2: { hour: 13, minute: 0 },  // Tuesday
      3: { hour: 13, minute: 0 },  // Wednesday
      4: { hour: 13, minute: 0 },  // Thursday
      5: { hour: 13, minute: 0 },  // Friday
      6: { hour: 12, minute: 0 }   // Saturday
    },
    instagram: {
      0: { hour: 11, minute: 0 },  // Sunday
      1: { hour: 11, minute: 0 },  // Monday
      2: { hour: 11, minute: 0 },  // Tuesday
      3: { hour: 11, minute: 0 },  // Wednesday
      4: { hour: 11, minute: 0 },  // Thursday
      5: { hour: 11, minute: 0 },  // Friday
      6: { hour: 11, minute: 0 }   // Saturday
    }
  }

  return bestTimes[platform][dayOfWeek]
}
