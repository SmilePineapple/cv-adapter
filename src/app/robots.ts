import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://cvadapter.com' // Update with your actual domain

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
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
