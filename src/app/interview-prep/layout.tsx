import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interview Prep - AI Interview Practice & Tips | CV Adapter',
  description: 'Prepare for job interviews with AI-powered practice. Get personalized interview questions, tips, and feedback based on your CV and target role. Free interview preparation tool.',
  alternates: {
    canonical: '/interview-prep',
  },
  openGraph: {
    title: 'Interview Prep - AI Interview Practice | CV Adapter',
    description: 'Prepare for job interviews with AI-powered practice and personalized feedback.',
    url: 'https://www.mycvbuddy.com/interview-prep',
  },
}

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
