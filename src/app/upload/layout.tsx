import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upload CV - Free CV Upload & Analysis | CV Adapter',
  description: 'Upload your CV for free AI-powered analysis and optimization. Supports PDF and Word documents. Get instant feedback on your CV and tailor it for any job in minutes.',
  alternates: {
    canonical: '/upload',
  },
  openGraph: {
    title: 'Upload CV - Free CV Analysis | CV Adapter',
    description: 'Upload your CV for free AI-powered analysis. Supports PDF and Word documents.',
    url: 'https://www.mycvbuddy.com/upload',
  },
}

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
