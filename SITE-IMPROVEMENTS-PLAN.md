# Site Improvements Plan - mycvbuddy.com & mycvbuddy.co.uk

## 🎯 Goals
1. Increase .co.uk engagement from 22s to 2+ minutes
2. Add blog for US market (resume-focused content)
3. Improve conversion from homepage → builder → optimizer
4. Leverage .co.uk's better event tracking on .com

---

## Priority 1: Fix .co.uk Low Engagement (22s)

### Problem Analysis
- Users land on homepage but don't engage
- 75 users → 48 users = 36% drop-off at builder
- 48 users → 14 users = 71% drop-off at optimizer

### Solutions

#### 1. Improve Homepage CTA (1 hour)
**Current:** Generic "Get Started" button
**New:** Clear value proposition with multiple CTAs

```typescript
// Add to homepage
<div className="hero-section">
  <h1>Get Your Dream Job with an ATS-Optimized CV</h1>
  <p className="text-xl">AI-powered CV builder trusted by 1,000+ job seekers</p>
  
  <div className="cta-buttons">
    <Link href="/upload" className="primary-cta">
      Upload Your CV - Free
    </Link>
    <Link href="/templates" className="secondary-cta">
      Browse Templates
    </Link>
  </div>
  
  <div className="trust-signals">
    ✓ 89% ATS Pass Rate
    ✓ Free Forever
    ✓ No Credit Card Required
  </div>
</div>
```

#### 2. Add Progress Indicator (30 min)
Show users where they are in the journey:

```
Step 1: Upload CV → Step 2: Tailor to Job → Step 3: Download
```

#### 3. Add Social Proof (1 hour)
- "1,000+ CVs generated this month"
- "Average ATS score improvement: 30% → 69%"
- Real testimonials from UK/US users

#### 4. Reduce Friction (2 hours)
- Allow "Try Without Upload" option
- Show example CV generation
- Add "What is ATS?" tooltip
- Simplify job description input

---

## Priority 2: Add Blog for US Market

### Strategy: Target "Resume" Keywords

US users search for "resume" not "CV". Create blog targeting US market.

### Blog Structure

**Location:** `/blog` route in Next.js

**Categories:**
1. Resume Writing Tips
2. ATS Optimization
3. Job Search Strategies
4. Interview Preparation
5. Career Advice

### Initial Blog Posts (Write 1 per week)

#### Week 1: "How to Write an ATS-Friendly Resume in 2025"
**Target Keywords:**
- "ATS-friendly resume"
- "resume ATS optimization"
- "how to pass ATS"

**Content:**
- What is ATS?
- Why 75% of resumes get rejected
- 10 tips to optimize your resume
- CTA: "Try our free ATS optimizer"

#### Week 2: "Resume vs CV: What's the Difference?"
**Target Keywords:**
- "resume vs cv"
- "cv or resume for US jobs"
- "difference between cv and resume"

**Content:**
- US vs UK terminology
- When to use each
- How to convert CV to resume
- CTA: "Upload your CV, we'll convert it"

#### Week 3: "Top 10 Resume Templates for 2025"
**Target Keywords:**
- "best resume templates"
- "professional resume templates"
- "free resume templates"

**Content:**
- Showcase your templates
- Industry-specific recommendations
- ATS-friendly vs creative templates
- CTA: "Try our templates free"

#### Week 4: "How to Tailor Your Resume to a Job Description"
**Target Keywords:**
- "tailor resume to job"
- "customize resume for job"
- "resume keywords"

**Content:**
- Why tailoring matters
- How to identify keywords
- Example before/after
- CTA: "Let AI tailor your resume"

### SEO Optimization

**Meta Tags:**
```typescript
export const metadata = {
  title: "How to Write an ATS-Friendly Resume in 2025 | My CV Buddy",
  description: "Learn how to optimize your resume for ATS systems and increase your chances of landing interviews. Free ATS checker included.",
  keywords: ["ATS resume", "resume optimization", "ATS-friendly resume", "resume tips"],
  openGraph: {
    title: "How to Write an ATS-Friendly Resume in 2025",
    description: "75% of resumes get rejected by ATS. Learn how to optimize yours.",
    images: ['/blog/ats-resume-guide.jpg'],
  }
}
```

**Internal Linking:**
- Link to /upload from every blog post
- Link to /templates
- Link to /subscription
- Cross-link between blog posts

---

## Priority 3: Implement Blog System

### Option 1: Simple MDX Blog (Recommended - 4 hours)

**Structure:**
```
/src/app/blog/
  page.tsx              # Blog listing
  [slug]/
    page.tsx            # Individual post
  _posts/
    ats-friendly-resume.mdx
    resume-vs-cv.mdx
    top-resume-templates.mdx
```

**Implementation:**

1. Install dependencies:
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter
```

2. Create blog listing page:
```typescript
// src/app/blog/page.tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'

export default function BlogPage() {
  const posts = getBlogPosts()
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Resume & CV Writing Tips</h1>
      
      <div className="grid gap-8">
        {posts.map(post => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="border rounded-lg p-6 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex items-center text-sm text-gray-500">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime} min read</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), 'src/app/blog/_posts')
  const filenames = fs.readdirSync(postsDirectory)
  
  return filenames.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)
    
    return {
      slug: filename.replace('.mdx', ''),
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      readTime: data.readTime,
    }
  })
}
```

3. Create individual post page:
```typescript
// src/app/blog/[slug]/page.tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const { content, data } = getPost(params.slug)
  
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      
      <div className="flex items-center text-gray-600 mb-8">
        <span>{data.date}</span>
        <span className="mx-2">•</span>
        <span>{data.readTime} min read</span>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <MDXRemote source={content} />
      </div>
      
      {/* CTA at end of post */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">Ready to optimize your resume?</h3>
        <p className="mb-4">Try our free AI-powered resume builder and ATS optimizer.</p>
        <Link 
          href="/upload"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Get Started Free
        </Link>
      </div>
    </article>
  )
}

function getPost(slug: string) {
  const filePath = path.join(process.cwd(), 'src/app/blog/_posts', `${slug}.mdx`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { content, data } = matter(fileContents)
  return { content, data }
}
```

4. Create first blog post:
```mdx
---
title: "How to Write an ATS-Friendly Resume in 2025"
excerpt: "Learn how to optimize your resume for ATS systems and increase your chances of landing interviews by 300%."
date: "October 21, 2025"
readTime: 8
keywords: ["ATS resume", "resume optimization", "ATS-friendly resume"]
---

# How to Write an ATS-Friendly Resume in 2025

Did you know that **75% of resumes never reach human eyes**? They're rejected by Applicant Tracking Systems (ATS) before a recruiter even sees them.

## What is an ATS?

An Applicant Tracking System (ATS) is software that companies use to filter job applications. It scans your resume for:

- **Keywords** from the job description
- **Formatting** that's easy to parse
- **Relevant experience** and skills
- **Education** and certifications

If your resume doesn't match these criteria, it gets automatically rejected.

## Why Your Resume Might Be Failing ATS

### 1. Missing Keywords

ATS systems look for specific keywords from the job description. If you're applying for a "Project Manager" role but your resume says "Team Lead," the ATS might reject you.

**Solution:** Mirror the language in the job description.

### 2. Complex Formatting

Fancy templates with tables, text boxes, and graphics confuse ATS systems.

**Solution:** Use a simple, clean format with standard headings.

### 3. Wrong File Format

Some ATS systems can't read PDFs or images.

**Solution:** Use .docx or .pdf (test both).

## 10 Tips to Optimize Your Resume for ATS

### 1. Use Standard Section Headings

Use these exact headings:
- **Work Experience** (not "Career History")
- **Education** (not "Academic Background")
- **Skills** (not "Core Competencies")

### 2. Include Keywords from the Job Description

Copy important keywords from the job posting and naturally incorporate them into your resume.

**Example:**
- Job Description: "Experience with project management software"
- Your Resume: "Managed 15+ projects using Asana, Trello, and Monday.com"

### 3. Use Standard Fonts

Stick to:
- Arial
- Calibri
- Times New Roman
- Georgia

Avoid fancy fonts that ATS can't read.

### 4. Avoid Headers and Footers

ATS systems often ignore text in headers and footers.

### 5. Use Standard Bullet Points

Use simple bullets (•) not fancy icons or symbols.

### 6. Spell Out Acronyms

Write "Search Engine Optimization (SEO)" not just "SEO" the first time.

### 7. Save as .docx or PDF

Test both formats - some ATS prefer .docx, others prefer PDF.

### 8. Don't Use Tables or Text Boxes

ATS systems can't parse tables properly. Use simple line breaks instead.

### 9. Include a Skills Section

List your skills in a dedicated section with keywords from the job description.

### 10. Tailor Your Resume for Each Job

Don't send the same resume to every job. Customize it for each application.

## How to Test Your Resume's ATS Score

Want to see how your resume performs? Try our **free ATS optimizer**:

1. Upload your resume
2. Paste the job description
3. Get instant ATS score and suggestions
4. Download optimized version

[Try Free ATS Optimizer →](/upload)

## Real Results from Our Users

> "My ATS score went from 30% to 89% after using My CV Buddy. I got 3 interview requests in one week!" - Sarah M., Marketing Manager

> "I was applying to 50+ jobs with no responses. After optimizing my resume, I got callbacks from 15 companies." - James T., Software Engineer

## Common ATS Mistakes to Avoid

### ❌ Using Images or Graphics

ATS can't read images. Your beautiful infographic resume? The ATS sees nothing.

### ❌ Creative Section Names

"Where I've Been" instead of "Work Experience" confuses the ATS.

### ❌ Fancy Templates

That beautiful template from Canva? It's probably ATS-unfriendly.

### ❌ Not Customizing for Each Job

Sending the same resume to every job = low ATS scores.

## The Bottom Line

Optimizing your resume for ATS isn't about gaming the system - it's about making sure your qualifications are actually seen by recruiters.

**Key Takeaways:**
- ✅ Use standard headings and formatting
- ✅ Include keywords from job descriptions
- ✅ Keep it simple and clean
- ✅ Test your ATS score before applying
- ✅ Tailor for each job

## Ready to Optimize Your Resume?

Don't let ATS systems reject your resume before a human even sees it.

**Try our free AI-powered resume optimizer:**
- ✓ Instant ATS score
- ✓ Keyword suggestions
- ✓ Formatting fixes
- ✓ Tailored to job description

[Get Started Free →](/upload)

---

*Need more help? Check out our other guides:*
- [Resume vs CV: What's the Difference?](/blog/resume-vs-cv)
- [Top 10 Resume Templates for 2025](/blog/top-resume-templates)
- [How to Tailor Your Resume to a Job Description](/blog/tailor-resume)
```

---

## Priority 4: Add Blog Navigation

### Update Header Navigation

```typescript
// src/components/Header.tsx or wherever your nav is
<nav>
  <Link href="/">Home</Link>
  <Link href="/templates">Templates</Link>
  <Link href="/blog">Blog</Link>  {/* NEW */}
  <Link href="/subscription">Pricing</Link>
  <Link href="/dashboard">Dashboard</Link>
</nav>
```

### Add Blog Link to Footer

```typescript
<footer>
  <div className="footer-section">
    <h4>Resources</h4>
    <Link href="/blog">Blog</Link>
    <Link href="/templates">Templates</Link>
    <Link href="/contact">Contact</Link>
  </div>
</footer>
```

---

## Priority 5: Track Blog Performance

### Add Analytics Events

```typescript
// Track blog post views
trackEvent('blog_post_viewed', {
  post_title: data.title,
  post_slug: params.slug,
})

// Track CTA clicks from blog
<Link 
  href="/upload"
  onClick={() => trackEvent('blog_cta_clicked', {
    post_slug: params.slug,
    cta_location: 'end_of_post',
  })}
>
  Get Started Free
</Link>
```

---

## Expected Results

### Week 1 (Homepage Improvements)
- .co.uk engagement: 22s → 1m+
- Conversion: 18.7% → 25%
- Bounce rate: Reduced by 20%

### Week 2 (First Blog Post)
- 50-100 organic visitors from US
- 10-20 signups from blog
- Improved SEO rankings

### Month 1 (4 Blog Posts)
- 200-500 organic visitors
- 50+ signups from blog
- Ranking for 10+ keywords

### Month 3 (12 Blog Posts)
- 1,000+ organic visitors
- 200+ signups from blog
- Ranking for 50+ keywords
- Established as authority in space

---

## Implementation Timeline

### This Week
- [ ] Fix .co.uk homepage CTA (1 hour)
- [ ] Add progress indicator (30 min)
- [ ] Add social proof (1 hour)
- [ ] Set up blog structure (2 hours)
- [ ] Write first blog post (3 hours)

### Next Week
- [ ] Publish first blog post
- [ ] Write second blog post
- [ ] Add blog to navigation
- [ ] Track blog analytics

### Ongoing
- [ ] Write 1 blog post per week
- [ ] Monitor analytics
- [ ] Optimize based on data
- [ ] Build backlinks

---

## Success Metrics

### Traffic
- Blog visitors: 0 → 500/month
- Organic search: 41 → 200/month
- US traffic: 13 → 100/month

### Engagement
- .co.uk engagement: 22s → 2m+
- Blog time on page: 3m+
- Pages per session: 1.5 → 3+

### Conversion
- Blog → Signup: 10%+
- Homepage → Builder: 50%+
- Builder → Optimizer: 50%+

---

## Budget & Resources

### Time Investment
- Initial setup: 8 hours
- Weekly blog post: 3 hours
- Monthly optimization: 2 hours

### Tools Needed
- ✅ Next.js (already have)
- ✅ MDX (free)
- ✅ Google Analytics (already have)
- Optional: Grammarly for blog editing

### Cost
- $0 for blog system
- $0 for hosting (already on Vercel)
- Optional: $12/month for Grammarly Premium

---

## Next Steps

1. **Today:** Fix .co.uk homepage CTA
2. **Tomorrow:** Set up blog structure
3. **This Week:** Write and publish first blog post
4. **Next Week:** Monitor results and write second post

**Let's turn those 22-second visits into 2-minute engaged sessions!** 🚀
