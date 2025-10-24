import { Metadata } from 'next'

const baseUrl = 'https://www.mycvbuddy.com'

export function generateMetadata(path: string, customMetadata?: Partial<Metadata>): Metadata {
  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}${path}`
    },
    ...customMetadata
  }
}

// Homepage metadata
export const homeMetadata: Metadata = {
  ...generateMetadata('/'),
  title: 'CV Buddy - Free AI CV Generator & Builder | Create Professional CVs',
  description: 'Create professional, ATS-friendly CVs in minutes with AI. Free CV builder supporting 50+ languages. Tailor your CV for any job, generate cover letters, and export in multiple formats.',
  keywords: ['CV generator', 'CV builder', 'AI CV maker', 'free CV builder', 'professional CV', 'ATS CV', 'cover letter generator', 'resume builder', 'CV tailoring', 'job application'],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: baseUrl,
    title: 'CV Buddy - AI-Powered CV Generator',
    description: 'Create professional CVs in minutes with AI. Tailor your CV for any job instantly.',
    siteName: 'CV Buddy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CV Buddy - AI CV Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CV Buddy - AI-Powered CV Generator',
    description: 'Create professional CVs in minutes with AI',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Privacy page metadata
export const privacyMetadata: Metadata = {
  ...generateMetadata('/privacy'),
  title: 'Privacy Policy | CV Buddy',
  description: 'Learn how CV Buddy protects your data and privacy. We are committed to keeping your personal information secure.',
  robots: {
    index: true,
    follow: true,
  },
}

// Signup page metadata
export const signupMetadata: Metadata = {
  ...generateMetadata('/auth/signup'),
  title: 'Sign Up | CV Buddy - Start Creating Professional CVs',
  description: 'Create your free CV Buddy account and start building professional CVs with AI. Get 1 free CV generation, no credit card required.',
  robots: {
    index: true,
    follow: true,
  },
}

// Login page metadata
export const loginMetadata: Metadata = {
  ...generateMetadata('/auth/login'),
  title: 'Log In | CV Buddy',
  description: 'Log in to your CV Buddy account to access your CVs, generations, and cover letters.',
  robots: {
    index: true,
    follow: true,
  },
}

// Upload page metadata
export const uploadMetadata: Metadata = {
  ...generateMetadata('/upload'),
  title: 'Upload CV | CV Buddy',
  description: 'Upload your CV to get started with AI-powered tailoring. Supports PDF, DOCX, and TXT formats.',
  robots: {
    index: true,
    follow: true,
  },
}

// Subscription page metadata
export const subscriptionMetadata: Metadata = {
  ...generateMetadata('/subscription'),
  title: 'Upgrade to Pro | CV Buddy',
  description: 'Upgrade to CV Buddy Pro for £9.99/month. Get unlimited CV generations, premium templates, and priority support.',
  robots: {
    index: true,
    follow: true,
  },
}

// Cover letter page metadata
export const coverLetterMetadata: Metadata = {
  ...generateMetadata('/cover-letter'),
  title: 'Cover Letter Generator | CV Buddy',
  description: 'Generate personalized cover letters with AI. Complement your CV with a professional cover letter tailored to any job.',
  robots: {
    index: true,
    follow: true,
  },
}

// Dashboard metadata (no index)
export const dashboardMetadata: Metadata = {
  ...generateMetadata('/dashboard'),
  title: 'Dashboard | CV Buddy',
  description: 'Manage your CVs, generations, and cover letters.',
  robots: {
    index: false,
    follow: false,
  },
}

// Contact page metadata
export const contactMetadata: Metadata = {
  ...generateMetadata('/contact'),
  title: 'Contact Us | CV Buddy',
  description: 'Get in touch with the CV Buddy team. We\'re here to help with any questions or feedback.',
  robots: {
    index: true,
    follow: true,
  },
}

// Terms page metadata
export const termsMetadata: Metadata = {
  ...generateMetadata('/terms'),
  title: 'Terms of Service | CV Buddy',
  description: 'Read our terms of service and understand how to use CV Buddy responsibly.',
  robots: {
    index: true,
    follow: true,
  },
}
