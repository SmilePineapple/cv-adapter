import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | My CV Buddy Support',
  description: 'Contact My CV Buddy support team. Get help with your CV, report issues, or share feedback. We respond within 24 hours. Email, live chat, and support available.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/contact',
  },
  openGraph: {
    title: 'Contact My CV Buddy Support',
    description: 'Get in touch with My CV Buddy support. We respond within 24 hours.',
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
