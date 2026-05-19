# Launchsmith Portfolio Site — Design Spec (v1)

## Goal
Build a standalone personal portfolio website for “Launchsmith” that showcases projects and makes it easy for visitors to contact the owner for web/app/mobile build work. The site must be professional, clean, slick, and easy to navigate.

## Hosting / Platform
- Target hosting: Vercel
- Framework: Next.js (App Router) + Tailwind CSS
- Routing style: hybrid site structure
  - Homepage is a scrollable summary page with clear CTAs
  - Dedicated pages for Portfolio and Contact

## Visual Direction
- Style: minimal / monochrome
- Accent: electric blue (links + primary CTA)
- Header: sticky
- Overall feel: slightly technical + friendly

## Information Architecture (Routes)
- `/` Home (scrollable overview)
- `/portfolio` Portfolio listing (featured + grid)
- `/portfolio/[slug]` Project detail page (internal case study)
- `/about` About (bio + photo + availability)
- `/services` Services (offerings + outcomes + FAQ)
- `/contact` Contact (form + brief context)
- `/thanks` Thank-you page (post-submit next steps)

## Global Layout
### Header (sticky)
- Left: Launchsmith wordmark
- Right: navigation links: Home, Portfolio, About, Services, Contact
- Primary CTA emphasis: Contact

### Footer
- Brand: Launchsmith
- Role line: Web & Mobile Developer
- “CV (coming soon)” placeholder
- No social links for now

## Homepage Content Sections
1. Hero
   - Headline: slightly technical + friendly
   - Subhead: who the owner helps + what they build
   - Primary CTA: “Send a message” → `/contact`
   - Secondary CTA: “View work” → `/portfolio`
2. Services Preview (4 cards)
   - Websites
   - Web Apps
   - Mobile Apps
   - Automation / AI Integrations
3. Featured Work (3 projects, placeholder data)
   - Each card links to internal project detail page
   - Buttons for GitHub + Live Demo (placeholders)
4. Testimonials (placeholders)
5. Final CTA (short, direct) → `/contact`

## Portfolio Page
### Featured Case Studies
- 3 featured projects with slightly richer summaries

### Project Grid
- 8–12 placeholder projects
- Each project card includes:
  - Name
  - Short description
  - Tech tags
  - Buttons: Case Study (internal), Live Demo (external placeholder), GitHub (external placeholder)

## Project Detail Page (`/portfolio/[slug]`)
Placeholder case-study layout:
- Overview (what it is, who it’s for)
- Problem
- Solution / approach
- Tech stack
- Key features (bulleted)
- Links (Live, GitHub)

## About Page
- Bio (placeholder)
- Photo/headshot placeholder
- Availability section
  - Accepting projects: yes (copy is editable later)
  - Typical response window (placeholder)

## Services Page
Service list (no pricing):
- Websites
- Web Apps
- Mobile Apps
- Automation / AI Integrations

Each service includes:
- Outcomes (what the visitor gets)
- Typical timeline (placeholder)
- What’s included (bulleted)

FAQ section (short, minimal), focused on:
- What info needed to start
- Typical timelines
- Ongoing support

## Contact Page
### Form Fields
- Name
- Email
- Message

### Submission Behavior
- Inline success message on submit
- Also provide a “Thanks” page (`/thanks`) for a more complete post-submit flow

### Delivery
- Form submission sends an email to the owner.
- Configuration uses environment variables for deliverability and privacy (no secrets in repo).

## Non-Goals (v1)
- Blog / notes section
- Pricing / packages displayed publicly
- Social links
- CMS/admin editing interface

## Success Criteria
- Clean, professional UI with consistent spacing and typography
- Fast navigation and clear CTAs
- Portfolio supports internal detail pages + external links
- Contact form sends email and shows successful submission UX
- Deploys cleanly to Vercel with minimal configuration

