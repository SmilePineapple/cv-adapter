import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator | CV Adapter',
  description: 'Generate professional, personalized cover letters with AI in seconds. Tailored to your CV and job description. Free to try.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/cover-letter'
  },
  openGraph: {
    title: 'AI Cover Letter Generator | CV Adapter',
    description: 'Generate professional, personalized cover letters with AI in seconds.',
    url: 'https://www.mycvbuddy.com/cover-letter',
    siteName: 'CV Adapter',
    locale: 'en_GB',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
