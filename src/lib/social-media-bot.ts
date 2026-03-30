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

import { getOpenAIClient } from './openai-client'

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
export type Platform = 'linkedin'

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
    linkedin: 3000
  }

  const maxLength = characterLimits[platform]

  const prompt = `You are a social media expert for CV Adapter, an AI-powered CV generation tool.

Generate a ${contentType.replace('_', ' ')} post for ${platform}.

Guidelines:
- Be engaging, helpful, and professional
- Include a clear call-to-action when appropriate
- Use emojis strategically (not too many)
- CRITICAL: Keep it under ${maxLength} characters TOTAL (including hashtags and link)
- For LinkedIn: Aim for 400-600 characters for best engagement (not the full 3000)
- Make it shareable and valuable
- Focus on helping job seekers
- Mention CV Adapter naturally when relevant
- Create urgency or curiosity when appropriate
- Use [link] as a placeholder for the website URL
- End with a call to action using [link]

Content Type: ${contentType}

Examples of good posts:
- "Did you know 75% of CVs never reach a human? 🤖 ATS systems filter them out first. Here's how to beat them... Try CV Adapter: [link]"
- "Your CV has 6 seconds to impress. Make every word count. ⏱️ Try our AI-powered CV optimizer: [link]"
- "Question: What's the biggest mistake you've made on your CV? 💭 Share below! Check out CV Adapter for tips: [link]"

Generate an engaging post now:`

  try {
    const openai = getOpenAIClient()
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
    linkedin: ['LinkedIn', 'Networking', 'ProfessionalGrowth']
  }

  // Combine and limit to 5-7 hashtags
  const allHashtags = [
    ...contentHashtags[contentType],
    ...platformHashtags[platform],
    ...baseHashtags
  ]

  // Remove duplicates and limit
  const uniqueHashtags = Array.from(new Set(allHashtags))
  const maxHashtags = 5
  
  return uniqueHashtags.slice(0, maxHashtags)
}

/**
 * Get a varied content schedule for the week (2 posts per day)
 */
export function getWeeklyContentSchedule(): ContentType[] {
  return [
    // Monday
    'cv_tip',           // 10 AM - Start week with actionable tip
    'industry_stat',    // 2 PM - Share interesting data
    // Tuesday
    'ats_tip',          // 10 AM - Technical advice
    'question',         // 2 PM - Engage audience
    // Wednesday
    'career_advice',    // 10 AM - Professional development
    'job_search_tip',   // 2 PM - Job hunting strategy
    // Thursday
    'interview_prep',   // 10 AM - Interview tips
    'myth_buster',      // 2 PM - Debunk common myths
    // Friday
    'success_story',    // 10 AM - Inspire with success
    'tool_feature',     // 2 PM - Highlight CV Adapter
    // Saturday
    'cv_tip',           // 10 AM - Weekend CV improvement
    'industry_stat',    // 2 PM - Interesting employment data
    // Sunday
    'career_advice',    // 10 AM - Week prep advice
    'question'          // 2 PM - Engage for Monday
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
    
    // Calculate day and time slot (2 posts per day)
    const dayOffset = Math.floor(i / 2)
    const isFirstPost = i % 2 === 0
    const hour = isFirstPost ? 10 : 14 // 10 AM or 2 PM
    
    scheduledDate.setDate(scheduledDate.getDate() + dayOffset)
    scheduledDate.setHours(hour, 0, 0, 0)

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

  // LinkedIn: hashtags at end, professional style
  formattedContent += `\n\n${hashtags.map(h => `#${h}`).join(' ')}`

  return formattedContent
}

/**
 * Get best posting times for LinkedIn
 */
export function getBestPostingTime(platform: Platform, dayOfWeek: number): { hour: number; minute: number } {
  const bestTimes: Record<number, { hour: number; minute: number }> = {
    0: { hour: 10, minute: 0 },  // Sunday
    1: { hour: 8, minute: 0 },   // Monday
    2: { hour: 8, minute: 0 },   // Tuesday
    3: { hour: 8, minute: 0 },   // Wednesday
    4: { hour: 8, minute: 0 },   // Thursday
    5: { hour: 9, minute: 0 },   // Friday
    6: { hour: 10, minute: 0 }   // Saturday
  }

  return bestTimes[dayOfWeek]
}
