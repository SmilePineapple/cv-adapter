export function CVWritingGuideSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long should a CV be in the UK?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the UK, a CV should typically be 2 pages long. One page looks inexperienced for most roles, while three pages can appear unfocused. Recent graduates may use 1 page, while senior executives with 15+ years experience may extend to 3 pages."
        }
      },
      {
        "@type": "Question",
        "name": "What should I include in my CV personal statement?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Your personal statement should be 3-4 sentences highlighting: your current role or status, your key skills and experience, your career goals, and your unique value proposition. Tailor it to each specific job application."
        }
      },
      {
        "@type": "Question",
        "name": "How do I make my CV ATS-friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To optimize for ATS: use standard fonts (Arial, Calibri), avoid tables and text boxes, use standard section headings (Work Experience, Education, Skills), save as .docx or PDF, include keywords from the job description, and keep formatting simple."
        }
      },
      {
        "@type": "Question",
        "name": "Should I include a photo on my UK CV?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, you should not include a photo on a UK CV unless specifically requested (e.g., for acting or modeling roles). Photos can introduce unconscious bias and are not expected in UK job applications."
        }
      },
      {
        "@type": "Question",
        "name": "How far back should my work history go?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Generally, include the last 10-15 years of work experience. For older roles, you can briefly mention them or group under 'Earlier Career' without detailed descriptions. Focus on recent, relevant experience."
        }
      },
      {
        "@type": "Question",
        "name": "What's the difference between a CV and a resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "In the UK, CV (Curriculum Vitae) is the standard term for a 2-page document used for job applications. In the US, a resume is typically 1 page and used for most jobs, while a CV is longer and used primarily in academia. The UK CV is equivalent to a US resume."
        }
      }
    ]
  }

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Write a Professional CV",
    "description": "Step-by-step guide to writing a professional CV that gets you interviews",
    "totalTime": "PT2H",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Add Contact Information",
        "text": "Include your name, phone number, email address, city/postcode, and LinkedIn profile. Avoid including full home address, date of birth, or photo.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Write Personal Statement",
        "text": "Create a 3-4 sentence summary highlighting your current role, key skills, experience level, and career goals. Tailor this to each job application.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "List Work Experience",
        "text": "Detail your work history in reverse chronological order. For each role, include job title, company name, dates, and 3-5 bullet points of achievements using the STAR method with quantified results.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Add Education",
        "text": "List your educational qualifications in reverse chronological order, including degree title, institution, graduation year, and classification. Include relevant certifications and professional qualifications.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "Include Skills Section",
        "text": "List both technical skills (software, tools, languages) and soft skills (leadership, communication) relevant to the target role. Organize into categories for clarity.",
        "position": 5
      },
      {
        "@type": "HowToStep",
        "name": "Optimize for ATS",
        "text": "Use standard fonts, avoid tables and graphics, include keywords from the job description, use standard section headings, and save as .docx or PDF format.",
        "position": 6
      },
      {
        "@type": "HowToStep",
        "name": "Proofread and Format",
        "text": "Check for spelling and grammar errors, ensure consistent formatting, verify all dates are accurate, and ask someone else to review before submitting.",
        "position": 7
      }
    ]
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "CV Writing Guide 2026: Complete Step-by-Step Tutorial",
    "description": "Master CV writing with our comprehensive 2026 guide. Learn how to write a winning CV, optimize for ATS systems, and land more interviews.",
    "author": {
      "@type": "Organization",
      "name": "My CV Buddy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "My CV Buddy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.mycvbuddy.com/og-image.png"
      }
    },
    "datePublished": "2026-03-07",
    "dateModified": "2026-03-07"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  )
}
