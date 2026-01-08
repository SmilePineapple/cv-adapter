import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | CV Buddy - Start Creating Professional CVs',
  description: 'Create your free CV Buddy account and start building professional CVs with AI. Get 2 free CV generations, no credit card required.',
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
