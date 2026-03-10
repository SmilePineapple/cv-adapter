import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interview Preparation Guide 2026: Questions, Tips & STAR Method | My CV Buddy',
  description: 'Complete interview preparation guide with 50+ common questions, STAR method examples, and expert tips. Learn how to answer behavioral questions, prepare for technical interviews, and ace your next job interview. Free interview prep checklist included.',
  keywords: [
    'interview preparation',
    'interview questions and answers',
    'common interview questions',
    'behavioral interview questions',
    'STAR method interview',
    'interview tips',
    'job interview preparation',
    'interview prep guide',
    'how to prepare for an interview',
    'interview questions to ask',
    'technical interview questions',
    'interview preparation checklist',
    'interview practice',
    'mock interview questions',
    'interview coaching'
  ],
  alternates: {
    canonical: 'https://www.mycvbuddy.com/interview-prep',
  },
  openGraph: {
    title: 'Interview Preparation Guide 2026: Master Your Next Interview',
    description: 'Complete guide with 50+ questions, STAR method examples, and expert tips to ace your job interview.',
    type: 'article',
    url: 'https://www.mycvbuddy.com/interview-prep',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Interview Preparation Guide 2026',
    description: '50+ questions, STAR method, and expert tips to ace your interview.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function InterviewPrepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
