import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - My CV Buddy Support & FAQs',
  description: 'Get help with My CV Buddy. Find answers to common questions about creating CVs, uploading documents, using AI features, and troubleshooting. 24/7 support available.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/help',
  },
  openGraph: {
    title: 'Help Center - My CV Buddy Support',
    description: 'Get help with My CV Buddy. FAQs, guides, and support for all your CV creation needs.',
    url: 'https://www.mycvbuddy.com/help',
  },
}

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
