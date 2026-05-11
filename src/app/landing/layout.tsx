import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My CV Buddy | Free AI CV Builder for UK Jobs 2026',
  description: 'MyCVBuddy is a free AI CV builder for UK job seekers. Upload your CV, paste a job description, and get an ATS-friendly, tailored CV in minutes. Start free today.',
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
    'CV writing service guarantee',
    'mycv',
    'mycv buddy',
    'my cv buddy',
    'mycv builder'
  ],
  authors: [{ name: 'My CV Buddy Team' }],
  creator: 'My CV Buddy',
  publisher: 'My CV Buddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.mycvbuddy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.mycvbuddy.com',
    title: 'My CV Buddy | Free AI CV Builder for UK Jobs 2026',
    description: 'MyCVBuddy is a free AI CV builder for UK job seekers. Upload your CV, paste a job description, and get an ATS-friendly, tailored CV in minutes.',
    siteName: 'My CV Buddy',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My CV Buddy - AI CV Builder for UK Job Seekers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My CV Buddy | Free AI CV Builder for UK Jobs 2026',
    description: 'MyCVBuddy is a free AI CV builder for UK job seekers. Create an ATS-friendly, tailored CV in minutes.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
