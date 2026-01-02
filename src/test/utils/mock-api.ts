import { http, HttpResponse } from 'msw'

/**
 * Mock API handlers for MSW (Mock Service Worker)
 * Used for integration testing API routes
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const handlers = [
  // Mock CV upload endpoint
  http.post(`${BASE_URL}/api/upload`, async () => {
    return HttpResponse.json({
      success: true,
      cvId: 'test-cv-id',
      fileName: 'test-cv.pdf',
      sections: [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Software Engineer at Tech Corp'
        }
      ]
    })
  }),

  // Mock CV rewrite endpoint
  http.post(`${BASE_URL}/api/rewrite`, async () => {
    return HttpResponse.json({
      success: true,
      generationId: 'test-generation-id',
      rewrittenSections: [
        {
          type: 'experience',
          title: 'Work Experience',
          content: 'Senior Software Engineer with extensive experience...'
        }
      ],
      atsScore: 85
    })
  }),

  // Mock Stripe checkout endpoint
  http.post(`${BASE_URL}/api/stripe/create-checkout`, async () => {
    return HttpResponse.json({
      success: true,
      sessionId: 'cs_test_123',
      url: 'https://checkout.stripe.com/test'
    })
  }),

  // Mock cover letter generation
  http.post(`${BASE_URL}/api/cover-letter/generate`, async () => {
    return HttpResponse.json({
      success: true,
      coverLetterId: 'test-cover-letter-id',
      content: 'Dear Hiring Manager, I am writing to express my interest...'
    })
  }),

  // Mock ATS score endpoint
  http.post(`${BASE_URL}/api/ats-score`, async () => {
    return HttpResponse.json({
      success: true,
      score: 85,
      feedback: {
        strengths: ['Good keyword usage', 'Clear formatting'],
        improvements: ['Add more quantifiable achievements']
      }
    })
  }),

  // Mock export endpoint
  http.post(`${BASE_URL}/api/export`, async () => {
    return HttpResponse.json({
      success: true,
      downloadUrl: '/downloads/test-cv.pdf'
    })
  }),

  // Mock Supabase auth endpoints
  http.post('https://test.supabase.co/auth/v1/token', async () => {
    return HttpResponse.json({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      user: {
        id: 'test-user-id',
        email: 'test@example.com'
      }
    })
  })
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  http.post(`${BASE_URL}/api/upload`, async () => {
    return HttpResponse.json(
      { error: 'File too large' },
      { status: 413 }
    )
  }),

  http.post(`${BASE_URL}/api/rewrite`, async () => {
    return HttpResponse.json(
      { error: 'OpenAI API error' },
      { status: 500 }
    )
  }),

  http.post(`${BASE_URL}/api/stripe/create-checkout`, async () => {
    return HttpResponse.json(
      { error: 'Invalid plan' },
      { status: 400 }
    )
  })
]
