import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade to Pro | CV Buddy',
  description: 'Upgrade to CV Buddy Pro for £9.99/month. Get unlimited CV generations, premium templates, and priority support. Cancel anytime.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/subscription'
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SubscriptionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
