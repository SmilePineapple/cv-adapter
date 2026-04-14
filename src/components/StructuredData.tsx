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
          "text": "Yes! My CV Buddy includes 1 free CV adaptation with no credit card required. For unlimited access to CV generation, cover letters, and interview prep, upgrade to Pro for £2.99/month or £14.99/year (save 58%)."
        }
      },
      {
        "@type": "Question",
        "name": "How do I create a CV for free in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your existing CV, paste a job description, and our AI adapts it to match the role — ATS-optimised and tailored to that specific job. No credit card required. 1 free generation included."
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
      },
      {
        "@type": "Question",
        "name": "What is a resume adapter and how does it work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A resume adapter takes your existing resume and rewrites it to match a specific job description. Unlike a resume builder (which starts from scratch), a resume adapter keeps your real experience and reframes it using the employer's language and keywords. My CV Buddy is the leading AI resume adapter for US job seekers."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use My CV Buddy for US job applications?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! My CV Buddy works for both US resumes and UK CVs. Our AI adapts your resume to match American job description language, ATS requirements, and resume formatting standards. 1 free resume adaptation included."
        }
      },
      {
        "@type": "Question",
        "name": "How do I tailor my resume to a job description for free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Upload your resume at mycvbuddy.com, paste the job description, and our AI instantly generates a tailored, ATS-optimized version. The first adaptation is completely free — no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "Does My CV Buddy optimize resumes for ATS systems?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. My CV Buddy's AI matches keywords from the job description to your resume, uses clean ATS-parseable formatting, and achieves a 95% ATS pass rate in internal tests. This is critical for US job applications where 75%+ of resumes are filtered by ATS before a human sees them."
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
        "priceCurrency": "USD",
        "description": "Free tier with 1 resume/CV adaptation",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "price": "3.99",
        "priceCurrency": "USD",
        "description": "Pro Monthly - Unlimited resume adaptations",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "GBP",
        "description": "Free tier with 1 CV generation",
        "availability": "https://schema.org/InStock"
      },
      {
        "@type": "Offer",
        "price": "2.99",
        "priceCurrency": "GBP",
        "description": "Pro Monthly - Unlimited CV generations",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "312",
      "bestRating": "5",
      "worstRating": "1"
    },
    "description": "AI-powered CV adapter and tailoring tool. Upload your CV, paste a job description, and get a tailored ATS-optimised CV in seconds. Free for UK, US, and international job seekers.",
    "featureList": [
      "AI CV tailoring to job descriptions",
      "ATS optimization and keyword matching",
      "Multiple export formats (PDF, DOCX, TXT, HTML)",
      "AI-powered cover letter generation",
      "Professional CV templates",
      "Job description analysis",
      "Real-time CV editing",
      "Interview preparation tools"
    ],
    "screenshot": "https://www.mycvbuddy.com/og-image.png",
    "url": "https://www.mycvbuddy.com/",
    "image": "https://www.mycvbuddy.com/logo.png"
  }

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "My CV Buddy",
    "url": "https://www.mycvbuddy.com/",
    "logo": "https://www.mycvbuddy.com/logo.png",
    "alternateName": ["MyCVBuddy", "My CV Buddy", "mycvbuddy.com", "mycvbuddy.co.uk"],
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
    "description": "AI-powered CV adapter helping job seekers tailor their CV to any job description. ATS-optimised applications in seconds."
  }

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": "The 2-Minute CV Makeover",
    "description": "Discover why 75% of CVs get rejected by robots—and how CV Buddy fixes it in 2 minutes. Learn about ATS systems and how to optimize your CV.",
    "thumbnailUrl": "https://www.mycvbuddy.com/graph.png",
    "uploadDate": "2026-03-26T00:00:00Z",
    "duration": "PT2M30S",
    "contentUrl": "https://www.mycvbuddy.com/videos/cv-makeover.mp4",
    "embedUrl": "https://www.mycvbuddy.com/videos/cv-makeover.mp4",
    "publisher": {
      "@type": "Organization",
      "name": "My CV Buddy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mycvbuddy.com/logo.png"
      }
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.mycvbuddy.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Templates",
        "item": "https://www.mycvbuddy.com/templates"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "ATS Checker",
        "item": "https://www.mycvbuddy.com/ats-checker"
      }
    ]
  }

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "My CV Buddy - AI CV Adapter",
    "description": "AI-powered CV adapter that tailors your existing CV to any job description in seconds. ATS-optimised with 95% pass rate.",
    "image": "https://www.mycvbuddy.com/logo.png",
    "brand": {
      "@type": "Brand",
      "name": "My CV Buddy"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "0",
      "highPrice": "14.99",
      "priceCurrency": "GBP",
      "offerCount": "3",
      "availability": "https://schema.org/InStock",
      "url": "https://www.mycvbuddy.com/subscription"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "312",
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
        id="video-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="review-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
    </>
  )
}
