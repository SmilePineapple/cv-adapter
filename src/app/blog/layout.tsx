import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CV & Resume Writing Tips | Job Search Advice | My CV Buddy Blog',
  description: 'Expert CV writing tips, ATS optimization guides, and job search strategies. Learn how to create a winning CV that gets you interviews.',
  keywords: [
    'CV writing tips',
    'resume writing guide',
    'ATS optimization',
    'job search advice',
    'career tips',
    'CV best practices',
    'how to write a CV',
    'resume tips',
    'job application advice',
    'CV examples'
  ],
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
