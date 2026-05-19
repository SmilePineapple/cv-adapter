# Launchsmith Portfolio Site — Premium Editorial Redesign Spec (v2)

## Goal
Upgrade the existing Launchsmith portfolio site from a functional scaffold to a high-professional, premium “editorial minimal” portfolio that showcases real work with real visuals and stronger case-study storytelling.

## Constraints / Decisions (locked)
- Visual direction: Editorial Minimal
- Theme: Light-only (no dark mode)
- Typography: Serif headlines + sans body
- Portfolio layout: Image-led case study grid
- Featured projects (homepage + top of portfolio):
  1. RankAlert
  2. BulkZip
  3. Tournament Generator
- Per-project CTAs:
  - Websites/web apps: Visit site / Live demo
  - iOS apps: App Store link
  - Internal case study page: always
  - GitHub: hidden for now

## Project List (source links)
Web
- https://www.rankalert.co.uk/
- https://bulkattachmentdownload.com/ (BulkZip)
- https://www.mycvbuddy.com/
- https://www.heartcentredplaytherapy.co.uk/
- https://confapp.communicationmatters.org.uk/

iOS (App Store)
- https://apps.apple.com/gb/app/communikey/id6736987829
- https://apps.apple.com/gb/app/voice-journal/id6768273622
- https://apps.apple.com/gb/app/satisfy-sounds/id6752653608
- https://apps.apple.com/gb/app/birthday-reminder-pro/id6741428143
- https://apps.apple.com/gb/app/board-game-scanner-bgg-sync/id6755399454
- https://apps.apple.com/gb/app/generate-invoice-pro/id6743435066
- https://apps.apple.com/gb/app/tournament-generator-brackets/id6740823846

## Look & Feel (what changes vs v1)
### Visual hierarchy
- Oversized serif H1/H2, compact sans supporting text
- Larger negative space and calmer pacing between sections
- “Editorial” dividers: thin rules, small caps labels, subtle metadata lines

### Interaction polish
- Subtle hover motion on portfolio cards (translate + shadow + image zoom)
- Focus states that feel premium (thin accent ring, no harsh outlines)

### Palette
- Background: white, with very subtle warm tint for secondary sections
- Text: near-black, not pure black
- Accent: electric blue for links, active nav states, primary CTA
- Borders: thin zinc borders

## Layout
### Header (sticky)
- Left: Launchsmith wordmark (serif)
- Right: minimal nav; active link state (underline + accent)
- Primary CTA: “Contact” pill in accent, smaller than v1

### Footer
- Minimal: Launchsmith, role line, “CV (coming soon)”
- No social links

## Routes (same structure as v1)
- `/` Home (editorial landing)
- `/portfolio` Portfolio listing (featured + grid)
- `/portfolio/[slug]` Case study
- `/about` About (bio + photo + availability)
- `/services` Services
- `/contact` Contact (form)
- `/thanks` Thank-you

## Homepage Content (v2)
1. Hero (editorial)
   - Serif headline, short technical-friendly subhead
   - Compact metadata line (role, location optional placeholder)
   - CTA row: Contact (primary), View work (secondary)
2. Featured work (3)
   - Large image-led cards using real screenshots
3. Services (minimal editorial list)
   - 4 services with short outcomes, not “big boxes”
4. Proof / trust
   - Testimonials (placeholder quotes retained, upgraded styling)
   - Optional “Selected clients” later (not in scope now)
5. Final CTA block

## Portfolio Page (v2)
### Card spec (image-led)
Each project card shows:
- Large cover image (screenshot or App Store/OG image)
- Small label (category)
- Project title (serif)
- One-sentence summary
- Tags (small)
- CTAs: Case study + (Visit site OR App Store)

### Sorting / grouping
- Featured section at top (RankAlert, BulkZip, Tournament Generator)
- Rest as grid underneath
- No filters initially (keep premium/minimal); add later if needed

## Case Study Page (v2)
Structure:
1. Title + one-liner + CTAs row
2. Cover image (large)
3. Narrative sections (editorial):
   - Overview
   - Problem
   - Solution
   - Results / impact (placeholder where unknown)
4. Screenshot gallery (2–6 images)
5. Tech notes (compact bulleted list)

## Real Visuals Acquisition Plan
### Websites
- Capture clean screenshots of public pages (no logged-in/private screens).
- Use either:
  - First-choice: Open Graph images if present (fast, consistent)
  - Otherwise: browser screenshots of the homepage hero area and one product page

### App Store apps
- Use the App Store icon + 1–3 App Store screenshots per app (public marketing visuals).

### Storage in repo
- Save all images locally for reliability:
  - `public/portfolio/<slug>/cover.png`
  - `public/portfolio/<slug>/<n>.png`
  - `public/portfolio/<slug>/icon.png` (apps)

## Content / Copy (v2)
### Tone
- Slightly technical, friendly, confident
- Short sentences, high clarity, no fluff

### Backlink copy patterns
For each project card and case study, include short “what it is” and a clear outbound CTA label:
- “Visit RankAlert”
- “Visit BulkZip”
- “View on App Store”

## Implementation Notes
- Keep current Next.js app, update styling, components, and project data model
- Add serif headline font via `next/font/google` and set CSS variables
- Replace placeholder projects with a structured data model for:
  - category, label, summary, tags
  - externalUrl + externalLabel (Visit site/App Store)
  - local image paths (cover + gallery)

## Success Criteria
- Immediately reads as “designed” and premium (typography + spacing + cards)
- Portfolio shows real screenshots for all provided projects/apps
- Featured projects are first-class and easy to click through
- Outbound links are clear and trustworthy

