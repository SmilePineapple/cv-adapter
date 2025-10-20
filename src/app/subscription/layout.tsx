import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade to Pro | CV Buddy',
  description: 'Upgrade to CV Buddy Pro for just £5. Get 100 lifetime CV generations, premium templates, and priority support. One-time payment, no subscription.',
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
