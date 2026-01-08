import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

/**
 * Custom render function with common providers
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User'
  },
  created_at: '2024-01-01T00:00:00.000Z'
}

/**
 * Mock CV data for testing
 */
export const mockCV = {
  id: 'test-cv-id',
  user_id: 'test-user-id',
  file_name: 'test-cv.pdf',
  file_meta: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+44 1234 567890',
    sections: [
      {
        type: 'experience',
        title: 'Work Experience',
        content: 'Software Engineer at Tech Corp'
      },
      {
        type: 'education',
        title: 'Education',
        content: 'BSc Computer Science'
      }
    ]
  },
  created_at: '2024-01-01T00:00:00.000Z'
}

/**
 * Mock generation data for testing
 */
export const mockGeneration = {
  id: 'test-generation-id',
  user_id: 'test-user-id',
  cv_id: 'test-cv-id',
  job_title: 'Senior Software Engineer',
  company_name: 'Tech Corp',
  job_description: 'Looking for an experienced software engineer...',
  rewritten_sections: [
    {
      type: 'experience',
      title: 'Work Experience',
      content: 'Senior Software Engineer with 5 years experience...'
    }
  ],
  ats_score: 85,
  created_at: '2024-01-01T00:00:00.000Z'
}

/**
 * Mock Supabase response
 */
export function mockSupabaseResponse<T>(data: T, error: any = null) {
  return {
    data,
    error,
    count: null,
    status: error ? 400 : 200,
    statusText: error ? 'Bad Request' : 'OK'
  }
}

/**
 * Mock OpenAI response
 */
export function mockOpenAIResponse(content: string) {
  return {
    id: 'chatcmpl-test',
    object: 'chat.completion',
    created: Date.now(),
    model: 'gpt-4',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content
        },
        finish_reason: 'stop'
      }
    ],
    usage: {
      prompt_tokens: 100,
      completion_tokens: 200,
      total_tokens: 300
    }
  }
}

/**
 * Mock Stripe response
 */
export function mockStripeCheckoutSession() {
  return {
    id: 'cs_test_123',
    object: 'checkout.session',
    url: 'https://checkout.stripe.com/test',
    customer: 'cus_test_123',
    payment_status: 'unpaid',
    status: 'open'
  }
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Create mock file for upload testing
 */
export function createMockFile(
  name: string = 'test.pdf',
  size: number = 1024,
  type: string = 'application/pdf'
): File {
  const blob = new Blob(['test content'], { type })
  return new File([blob], name, { type })
}
