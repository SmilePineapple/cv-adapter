import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Roast My CV - AI CV Roasting & Feedback | CV Adapter',
  description: 'Get brutally honest AI feedback on your CV. Our AI roasts your CV with humor while providing actionable improvement tips. Pro feature with 10 roasts per month.',
  alternates: {
    canonical: '/roast-cv',
  },
  openGraph: {
    title: 'Roast My CV - AI CV Roasting | CV Adapter',
    description: 'Get brutally honest AI feedback on your CV with humor and actionable tips.',
    url: 'https://www.mycvbuddy.com/roast-cv',
  },
}

export default function RoastCVLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
