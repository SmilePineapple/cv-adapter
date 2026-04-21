import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - User Agreement | My CV Buddy',
  description: 'My CV Buddy terms of service and user agreement. Read our terms and conditions for using our AI-powered CV builder and related services.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/terms',
  },
  openGraph: {
    title: 'Terms of Service | My CV Buddy',
    description: 'My CV Buddy terms of service and user agreement.',
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
