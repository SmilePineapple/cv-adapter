import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | CV Buddy - Start Creating Professional CVs',
  description: 'Create your My CV Buddy account and start adapting your CV to any job description with AI. Includes 1 free generation — no credit card required.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/auth/signup'
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
