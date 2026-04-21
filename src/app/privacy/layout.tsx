import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - How We Protect Your Data | My CV Buddy',
  description: 'My CV Buddy privacy policy. Learn how we collect, use, and protect your personal data and CV information. GDPR compliant. Your data security is our priority.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | My CV Buddy',
    description: 'Learn how My CV Buddy protects your personal data and CV information. GDPR compliant.',
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
