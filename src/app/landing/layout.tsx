import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Writing Services | AI CV Optimization for UK Job Seekers | CV Buddy',
  description: 'Transform your job search with AI-powered CV optimization. Get ATS-friendly, professionally tailored resumes that impress UK employers. 95% success rate. Start free trial today.',
  keywords: [
    'CV writing services',
    'AI CV optimization',
    'CV tailoring',
    'professional resume writing',
    'ATS friendly CV',
    'UK job seekers',
    'CV optimization',
    'resume writing services',
    'cover letter generator',
    'job application tools',
    'career advancement',
    'CV templates',
    'AI resume builder',
    'UK job market',
    'Applicant Tracking Systems',
    'CV writing services',
    'professional CV maker',
    'AI career tools',
    'job search optimization',
    'CV enhancement',
    'resume customization',
    'UK employers',
    'career development',
    'professional CV writer UK',
    'CV writing service London',
    'ATS CV checker',
    'CV optimization service',
    'best CV writing service UK',
    'CV writing service Manchester',
    'CV writing service Edinburgh',
    'CV writing service Birmingham',
    'professional CV writing services',
    'executive CV writing service',
    'graduate CV writing service',
    'CV writing service reviews',
    'affordable CV writing service',
    'CV writing service cost',
    'CV writing service guarantee'
  ],
  authors: [{ name: 'CV Buddy Team' }],
  creator: 'CV Buddy',
  publisher: 'CV Buddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mycvbuddy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://mycvbuddy.com',
    title: 'CV Writing Services | AI CV Optimization for UK Job Seekers | CV Buddy',
    description: 'Transform your job search with AI-powered CV optimization. Get ATS-friendly, professionally tailored resumes that impress UK employers. 95% success rate.',
    siteName: 'CV Buddy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'CV Buddy - AI CV Optimization for UK Job Seekers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Writing Services | AI CV Optimization for UK Job Seekers | CV Buddy',
    description: 'Transform your job search with AI-powered CV optimization. Get ATS-friendly, professionally tailored resumes that impress UK employers.',
    images: ['/og-image.jpg'],
  },
  robots: {
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
