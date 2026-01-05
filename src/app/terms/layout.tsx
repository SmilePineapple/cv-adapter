import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - User Agreement | CV Adapter',
  description: 'CV Adapter terms of service and user agreement. Read our terms and conditions for using our AI-powered CV builder and related services.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | CV Adapter',
    description: 'CV Adapter terms of service and user agreement.',
    url: 'https://www.mycvbuddy.com/terms',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
