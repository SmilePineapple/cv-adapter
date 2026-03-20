import OpenAI from 'openai'

/**
 * Lazy OpenAI client initialization
 * This prevents build-time errors when OPENAI_API_KEY is not available
 * The client is only created when actually needed at runtime
 */
let openaiClient: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error(
        'OpenAI API key is missing. Set the OPENAI_API_KEY environment variable.'
      )
    }
    
    openaiClient = new OpenAI({
      apiKey,
    })
  }
  
  return openaiClient
}

/**
 * Reset the client (useful for testing)
 */
export function resetOpenAIClient(): void {
  openaiClient = null
}
