import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/edit/',
          '/generate/',
          '/review/',
          '/download/',
          '/history/',
          '/auto-cv/',
        ],
      },
    ],
    sitemap: [
      'https://www.mycvbuddy.com/sitemap.xml',
      'https://www.mycvbuddy.co.uk/sitemap.xml',
    ],
  }
}
