/**
 * IndexNow Submission Script
 * Instantly notifies Bing, Yandex, and other search engines of URL changes
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { existsSync } from 'fs'

// Load .env.local only if it exists (local development)
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  config({ path: envPath })
}

const INDEXNOW_KEY = '0d88c3e2afb46f36a115a179c0a61ff2'
const HOST = 'www.mycvbuddy.com'
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`

interface IndexNowResponse {
  success: boolean
  statusCode: number
  message: string
}

async function submitToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  console.log('📤 Submitting to IndexNow...')
  console.log(`URLs: ${urls.length}`)

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    const statusCode = response.status

    let message = ''
    let success = false
    
    switch (statusCode) {
      case 200:
      case 202:
        message = 'URLs submitted successfully to Bing, Yandex, and other search engines'
        success = true
        break
      case 400:
        message = 'Bad request - Invalid format'
        break
      case 403:
        message = 'Forbidden - Key not valid (check key file)'
        break
      case 422:
        message = 'Unprocessable Entity - URLs don\'t belong to host or key mismatch'
        break
      case 429:
        message = 'Too Many Requests - Potential spam detected'
        break
      default:
        message = `Unexpected status code: ${statusCode}`
    }

    console.log(`${success ? '✅' : '❌'} ${message}`)

    return {
      success,
      statusCode,
      message,
    }
  } catch (error: any) {
    console.error('❌ IndexNow submission failed:', error.message)
    return {
      success: false,
      statusCode: 0,
      message: error.message,
    }
  }
}

async function getAllUrls(): Promise<string[]> {
  const baseUrl = `https://${HOST}`
  
  // All important pages to index
  const urls = [
    baseUrl,
    `${baseUrl}/resume-builder-usa`,
    `${baseUrl}/pricing`,
    `${baseUrl}/features`,
    `${baseUrl}/blog`,
    `${baseUrl}/auth/login`,
    `${baseUrl}/auth/signup`,
    `${baseUrl}/sitemap.xml`,
  ]

  return urls
}

async function main() {
  console.log('🚀 IndexNow Submission Started\n')
  console.log('═'.repeat(60))
  
  // Get all URLs to submit
  const urls = await getAllUrls()
  
  console.log(`\n📋 Submitting ${urls.length} URLs to IndexNow:`)
  urls.forEach((url, i) => console.log(`   ${i + 1}. ${url}`))
  console.log()

  // Submit to IndexNow
  const result = await submitToIndexNow(urls)

  console.log('\n' + '═'.repeat(60))
  console.log('\n📊 Summary:')
  console.log(`Status: ${result.success ? '✅ Success' : '❌ Failed'}`)
  console.log(`Code: ${result.statusCode}`)
  console.log(`Message: ${result.message}`)
  
  if (result.success) {
    console.log('\n🎉 Your URLs are now being indexed by:')
    console.log('   • Bing')
    console.log('   • Yandex')
    console.log('   • Seznam.cz')
    console.log('   • Naver')
    console.log('   • And other IndexNow-enabled search engines')
    console.log('\n⏱️  Indexing typically happens within minutes!')
  } else {
    console.log('\n⚠️  Please check the error and try again.')
  }

  console.log('\n✅ IndexNow submission complete!')
  
  process.exit(result.success ? 0 : 1)
}

main().catch(console.error)
