/**
 * User-friendly error messages for common API errors
 */

export interface ApiError {
  code: string
  message: string
  userMessage: string
  statusCode: number
}

export const ERROR_MESSAGES: Record<string, ApiError> = {
  // OpenAI Errors
  insufficient_quota: {
    code: 'insufficient_quota',
    message: 'OpenAI quota exceeded',
    userMessage: 'Our AI service is temporarily unavailable. Please try again in a few minutes.',
    statusCode: 503
  },
  rate_limit_exceeded: {
    code: 'rate_limit_exceeded',
    message: 'Rate limit exceeded',
    userMessage: 'Too many requests. Please wait a moment and try again.',
    statusCode: 429
  },
  invalid_api_key: {
    code: 'invalid_api_key',
    message: 'Invalid OpenAI API key',
    userMessage: 'Service configuration error. Our team has been notified.',
    statusCode: 500
  },
  
  // Supabase Errors
  auth_required: {
    code: 'auth_required',
    message: 'Authentication required',
    userMessage: 'Please sign in to continue.',
    statusCode: 401
  },
  permission_denied: {
    code: 'permission_denied',
    message: 'Permission denied',
    userMessage: 'You don\'t have permission to perform this action.',
    statusCode: 403
  },
  
  // Usage Errors
  generation_limit_reached: {
    code: 'generation_limit_reached',
    message: 'Generation limit reached',
    userMessage: 'You\'ve used all your free generations. Upgrade to Pro for unlimited access!',
    statusCode: 403
  },
  file_too_large: {
    code: 'file_too_large',
    message: 'File size exceeds limit',
    userMessage: 'File is too large. Maximum size is 10MB.',
    statusCode: 413
  },
  invalid_file_type: {
    code: 'invalid_file_type',
    message: 'Invalid file type',
    userMessage: 'Please upload a PDF or Word document (.pdf, .doc, .docx).',
    statusCode: 400
  },
  
  // Generic Errors
  internal_error: {
    code: 'internal_error',
    message: 'Internal server error',
    userMessage: 'Something went wrong. Our team has been notified and will fix this soon.',
    statusCode: 500
  },
  network_error: {
    code: 'network_error',
    message: 'Network error',
    userMessage: 'Network connection issue. Please check your internet and try again.',
    statusCode: 503
  }
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(error: any): string {
  // Check if it's an OpenAI error
  if (error?.error?.code) {
    const errorDef = ERROR_MESSAGES[error.error.code]
    if (errorDef) return errorDef.userMessage
  }
  
  // Check if it's a known error code
  if (error?.code) {
    const errorDef = ERROR_MESSAGES[error.code]
    if (errorDef) return errorDef.userMessage
  }
  
  // Check for specific error messages
  if (error?.message?.includes('quota')) {
    return ERROR_MESSAGES.insufficient_quota.userMessage
  }
  if (error?.message?.includes('rate limit')) {
    return ERROR_MESSAGES.rate_limit_exceeded.userMessage
  }
  if (error?.message?.includes('authentication') || error?.message?.includes('unauthorized')) {
    return ERROR_MESSAGES.auth_required.userMessage
  }
  
  // Default error message
  return ERROR_MESSAGES.internal_error.userMessage
}

/**
 * Get HTTP status code for error
 */
export function getErrorStatusCode(error: any): number {
  if (error?.error?.code) {
    const errorDef = ERROR_MESSAGES[error.error.code]
    if (errorDef) return errorDef.statusCode
  }
  
  if (error?.code) {
    const errorDef = ERROR_MESSAGES[error.code]
    if (errorDef) return errorDef.statusCode
  }
  
  return 500
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: any) {
  const userMessage = getUserErrorMessage(error)
  const statusCode = getErrorStatusCode(error)
  
  // Log the actual error for debugging
  console.error('API Error:', {
    code: error?.code || error?.error?.code,
    message: error?.message,
    stack: error?.stack
  })
  
  return {
    error: userMessage,
    code: error?.code || error?.error?.code || 'internal_error',
    statusCode
  }
}
