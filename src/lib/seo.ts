import { Metadata } from 'next'

const SITE_URL = 'https://www.mycvbuddy.com'
const SITE_NAME = 'CV Adapter'

export function generateMetadata({
  title,
  description,
  path = '',
  image = '/og-image.png',
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = `${SITE_URL}${path}`
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [`${SITE_URL}${image}`],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}

export const defaultMetadata = generateMetadata({
  title: 'AI-Powered CV Tailoring for Job Applications',
  description:
    'Tailor your CV to any job description with AI in 2 minutes. Get ATS-optimized CVs, professional templates, and cover letters. Try free - no credit card required.',
  path: '/',
})
