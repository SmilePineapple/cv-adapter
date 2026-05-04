import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI CV Optimization for UK Job Seekers | CV Buddy - Professional Resume Writing',
  description: 'Transform your job search with AI-powered CV optimization. Get ATS-friendly, professionally tailored resumes that impress UK employers. 95% success rate. Start free trial today.',
  keywords: [
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
    'career development'
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
    title: 'AI CV Optimization for UK Job Seekers | CV Buddy',
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
    title: 'AI CV Optimization for UK Job Seekers | CV Buddy',
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
