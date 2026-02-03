import Script from 'next/script'

export function StructuredData() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is My CV Buddy really free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! My CV Buddy offers 2 free CV generations with no credit card required. For unlimited access to CV generation, cover letters, and interview prep, upgrade to Pro for £9.99/month."
        }
      },
      {
        "@type": "Question",
        "name": "How do I create a CV for free in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your existing CV or create one from scratch, paste a job description, and our AI will generate an ATS-optimized CV tailored to the role. No credit card required for your first 2 CVs."
        }
      },
      {
        "@type": "Question",
        "name": "Will my CV pass ATS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! My CV Buddy creates ATS-optimized CVs with clean formatting, proper keyword placement, and standard section headers that applicant tracking systems can parse. Our AI matches keywords from the job description to maximize your ATS score."
        }
      },
      {
        "@type": "Question",
        "name": "How does AI CV tailoring work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your CV, paste a job description, and our AI analyzes both to identify key requirements, match relevant experience, and optimize keywords for ATS systems. The process takes just 2 minutes and creates a job-specific CV."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between a CV and a resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A CV (Curriculum Vitae) is typically longer and used in the UK, Europe, and academia. A resume is shorter (1-2 pages) and common in the US. My CV Buddy works with both formats and optimizes for your target country."
        }
      },
      {
        "@type": "Question",
        "name": "Can I download my CV as a PDF?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! You can export your CV in multiple formats including PDF, DOCX (Word), TXT, and HTML. All formats are ATS-friendly and professionally formatted."
        }
      },
      {
        "@type": "Question",
        "name": "How long does it take to generate a CV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI generates a tailored, ATS-optimized CV in approximately 30-60 seconds. You can then review, edit, and download it immediately."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer CV templates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer 10+ professional CV templates optimized for UK and US job markets. All templates are ATS-friendly and can be customized to match your industry."
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

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "My CV Buddy",
    "description": "AI-powered CV and resume builder that tailors your job application to any position",
    "brand": {
      "@type": "Brand",
      "name": "My CV Buddy"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "250",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "My ATS score went from 30% to 89% after using My CV Buddy. I got 3 interview requests in one week!",
        "datePublished": "2025-12-15"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "James T."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "I was applying to 50+ jobs with no responses. After optimizing my resume, I got callbacks from 15 companies.",
        "datePublished": "2025-12-10"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Emily P."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Saved me hours of work! The AI understood exactly what the job required and tailored my CV perfectly.",
        "datePublished": "2025-12-05"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah Johnson"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Got 3 interviews in the first week after using CV Adapter. The ATS optimization really works!",
        "datePublished": "2025-11-28"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Michael Chen"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Saved me hours of work. The AI perfectly adapted my CV for each application. Highly recommend!",
        "datePublished": "2025-11-25"
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Emma Williams"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "The templates are beautiful and professional. Finally landed my dream job at a top tech company!",
        "datePublished": "2025-11-20"
      }
    ]
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
      <Script
        id="review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
    </>
  )
}
