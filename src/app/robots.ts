import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/edit/',
          '/generate/',
          '/review/',
          '/download/',
          '/history/',
          '/auto-cv/',
          '/upload/',
          '/subscription/',
          '/templates/',
          '/cover-letter/',
          '/interview-prep/',
          '/roast-cv/',
        ],
      },
    ],
    sitemap: [
      'https://www.mycvbuddy.com/sitemap.xml',
      'https://www.mycvbuddy.co.uk/sitemap.xml',
    ],
  }
}
