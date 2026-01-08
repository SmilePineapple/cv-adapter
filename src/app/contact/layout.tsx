import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | CV Adapter Support',
  description: 'Contact CV Adapter support team. Get help with your CV, report issues, or share feedback. We respond within 24 hours. Email, live chat, and support available.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact CV Adapter Support',
    description: 'Get in touch with CV Adapter support. We respond within 24 hours.',
    url: 'https://www.mycvbuddy.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
