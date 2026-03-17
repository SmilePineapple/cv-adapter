/**
 * Safe API response handler that prevents JSON parse errors
 * Use this instead of directly calling response.json()
 */
export async function safeJsonResponse<T = any>(response: Response): Promise<T> {
  // Check if response is ok first
  if (!response.ok) {
    // Try to parse error as JSON, fallback to text if it fails
    let errorMessage = `API error: ${response.status} ${response.statusText}`
    
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorData.message || errorMessage
    } catch {
      // If JSON parsing fails, try to get text
      try {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      } catch {
        // Use default error message
      }
    }
    
    throw new Error(errorMessage)
  }
  
  // Response is ok, parse JSON
  try {
    return await response.json()
  } catch (error) {
    throw new Error('Failed to parse response as JSON')
  }
}

/**
 * Alternative: Parse JSON with fallback for non-JSON responses
 */
export async function parseJsonSafe<T = any>(response: Response): Promise<T | null> {
  try {
    return await response.json()
  } catch {
    return null
  }
}
