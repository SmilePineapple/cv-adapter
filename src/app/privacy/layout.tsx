import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | CV Adapter',
  description: 'CV Adapter privacy policy. Learn how we collect, use, and protect your personal data and CV information. GDPR compliant. Your data security is our priority.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | CV Adapter',
    description: 'Learn how CV Adapter protects your personal data and CV information. GDPR compliant.',
    url: 'https://www.mycvbuddy.com/privacy',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
