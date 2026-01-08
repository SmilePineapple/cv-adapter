import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV Templates - Professional CV Templates UK | CV Adapter',
  description: 'Browse 12+ professional CV templates optimized for UK job applications. ATS-friendly designs, modern layouts, and industry-specific templates. Free to use with CV Adapter.',
  alternates: {
    canonical: '/templates',
  },
  openGraph: {
    title: 'Professional CV Templates UK | CV Adapter',
    description: 'Browse 12+ professional CV templates optimized for UK job applications. ATS-friendly and modern designs.',
    url: 'https://www.mycvbuddy.com/templates',
  },
}

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
