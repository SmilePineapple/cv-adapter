import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free ATS CV Checker UK 2026: Check Your CV Score Instantly',
  description: 'Free ATS CV checker for UK job seekers. Instantly check if your CV will pass Applicant Tracking Systems. Get your ATS score, keyword analysis, and recommendations. No sign up required. 100% free.',
  keywords: [
    'ats cv checker',
    'ats cv checker free',
    'free ats checker',
    'ats checker uk',
    'cv ats score',
    'ats resume checker',
    'applicant tracking system checker',
    'ats cv test',
    'check cv ats',
    'ats optimization tool',
    'free cv checker',
    'cv scanner ats',
    'ats friendly cv checker',
    'resume ats checker free'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/ats-checker',
  },
  openGraph: {
    title: 'Free ATS CV Checker - Check Your CV Score Instantly',
    description: 'Free ATS checker for UK CVs. Get instant ATS score, keyword analysis, and recommendations. No sign up required.',
    url: 'https://www.mycvbuddy.com/ats-checker',
    type: 'website',
  },
}

export default function ATSCheckerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
