import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Log In | CV Buddy',
  description: 'Log in to your CV Buddy account to access your CVs, generations, and cover letters.',
  alternates: {
    canonical: 'https://www.mycvbuddy.com/auth/login'
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
