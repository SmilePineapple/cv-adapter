import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Manage Your CVs | CV Adapter',
  description: 'Access your CV dashboard. View, edit, and download your generated CVs. Track your usage and manage all your job application documents in one place.',
  alternates: {
    canonical: '/dashboard',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
