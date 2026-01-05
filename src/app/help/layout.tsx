import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - CV Adapter Support & FAQs',
  description: 'Get help with CV Adapter. Find answers to common questions about creating CVs, uploading documents, using AI features, and troubleshooting. 24/7 support available.',
  alternates: {
    canonical: '/help',
  },
  openGraph: {
    title: 'Help Center - CV Adapter Support',
    description: 'Get help with CV Adapter. FAQs, guides, and support for all your CV creation needs.',
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
