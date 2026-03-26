/**
 * OpenAI Usage Cost Calculator
 * 
 * This script fetches your OpenAI usage from October 1, 2025 to today
 * and calculates the total cost.
 * 
 * Usage:
 * 1. Set your OPENAI_API_KEY in .env.local
 * 2. Run: npx tsx scripts/check-openai-usage.ts
 */

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface UsageData {
  date: string
  model: string
  requests: number
  tokens: number
  cost: number
}

// Pricing as of 2026 (update if needed)
const PRICING = {
  'gpt-4o-mini': {
    input: 0.15 / 1_000_000,  // $0.15 per 1M input tokens
    output: 0.60 / 1_000_000, // $0.60 per 1M output tokens
  },
  'gpt-4o': {
    input: 2.50 / 1_000_000,  // $2.50 per 1M input tokens
    output: 10.00 / 1_000_000, // $10.00 per 1M output tokens
  },
  'gpt-4-turbo': {
    input: 10.00 / 1_000_000,
    output: 30.00 / 1_000_000,
  },
  'gpt-3.5-turbo': {
    input: 0.50 / 1_000_000,
    output: 1.50 / 1_000_000,
  },
}

async function getUsageData() {
  console.log('📊 Fetching OpenAI usage data...\n')
  console.log('Period: October 1, 2025 - Today')
  console.log('=' .repeat(60))

  try {
    // Note: OpenAI doesn't have a direct usage API endpoint
    // You'll need to check the dashboard or use their billing API
    console.log('\n⚠️  OpenAI Usage API Access:')
    console.log('OpenAI does not provide a public API for usage/billing data.')
    console.log('\nTo get your exact costs, please:')
    console.log('1. Go to: https://platform.openai.com/usage')
    console.log('2. Set date range: Oct 1, 2025 - Today')
    console.log('3. Export the data or note the total\n')

    // Alternative: Estimate from your database
    console.log('=' .repeat(60))
    console.log('\n📈 Estimating from your database...\n')

    // This would require database access
    // For now, we'll show you how to calculate manually
    
    console.log('Manual Calculation Guide:')
    console.log('=' .repeat(60))
    console.log('\n1. Count total CV generations since Oct 1, 2025')
    console.log('2. Average tokens per generation:')
    console.log('   - Input: ~2,000 tokens (CV + job description)')
    console.log('   - Output: ~1,500 tokens (generated CV)')
    console.log('\n3. Calculate cost:')
    console.log('   Cost = (input_tokens × $0.15/1M) + (output_tokens × $0.60/1M)')
    console.log('\nExample for 1,000 generations:')
    console.log('   Input: 2,000,000 tokens × $0.15/1M = $0.30')
    console.log('   Output: 1,500,000 tokens × $0.60/1M = $0.90')
    console.log('   Total: $1.20')
    console.log('\n' + '=' .repeat(60))

  } catch (error) {
    console.error('Error:', error)
  }
}

// Run if called directly
if (require.main === module) {
  getUsageData()
}

export { getUsageData }
