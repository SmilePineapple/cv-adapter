import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator | My CV Buddy',
  description: 'Generate professional, personalised cover letters with AI in seconds. Tailored to your existing CV and job description. 1 free generation included.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/cover-letter'
  },
  openGraph: {
    title: 'AI Cover Letter Generator | My CV Buddy',
    description: 'Generate professional, personalized cover letters with AI in seconds.',
    url: 'https://www.mycvbuddy.com/cover-letter',
    siteName: 'My CV Buddy',
    locale: 'en_GB',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
