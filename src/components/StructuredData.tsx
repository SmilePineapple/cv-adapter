import Script from 'next/script'

export function StructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What's the difference between a CV and a resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A CV (Curriculum Vitae) is typically longer and used in the UK, Europe, and academia. A resume is shorter (1-2 pages) and common in the US. My CV Buddy works with both formats."
        }
      },
      {
        "@type": "Question",
        "name": "Is My CV Buddy free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer 1 free CV generation. For unlimited access, upgrade to Pro for £9.99/month."
        }
      },
      {
        "@type": "Question",
        "name": "Will my CV pass ATS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! My CV Buddy creates ATS-optimized CVs with clean formatting, proper keyword placement, and standard section headers that applicant tracking systems can parse."
        }
      },
      {
        "@type": "Question",
        "name": "How does AI CV tailoring work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your CV, paste a job description, and our AI analyzes both to identify key requirements, match relevant experience, and optimize keywords for ATS systems."
        }
      }
    ]
  }

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "My CV Buddy",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP",
        "description": "Free tier with 1 CV generation"
      },
      {
        "@type": "Offer",
        "price": "9.99",
        "priceCurrency": "GBP",
        "description": "Pro plan with unlimited CV generations (monthly subscription)",
        "priceValidUntil": "2026-12-31"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "AI-powered CV and resume generator that tailors your job application to any position. ATS-optimized and free to use for UK, US, and international job seekers.",
    "featureList": [
      "AI CV tailoring to job descriptions",
      "ATS optimization and keyword matching",
      "Multiple export formats (PDF, DOCX, TXT, HTML)",
      "AI-powered cover letter generation",
      "10 professional CV templates",
      "Job description analysis",
      "Real-time CV editing",
      "Usage tracking and analytics"
    ],
    "screenshot": "https://mycvbuddy.com/screenshot.png",
    "url": "https://mycvbuddy.com"
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "My CV Buddy",
    "url": "https://mycvbuddy.com",
    "logo": "https://mycvbuddy.com/logo.png",
    "sameAs": [
      "https://twitter.com/mycvbuddy",
      "https://linkedin.com/company/mycvbuddy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@mycvbuddy.com",
      "contactType": "Customer Support",
      "availableLanguage": ["English"]
    },
    "description": "AI-powered CV and resume builder helping job seekers create ATS-optimized applications"
  }

  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  )
}
