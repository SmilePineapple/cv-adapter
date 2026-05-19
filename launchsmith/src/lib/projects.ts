export type ProjectExternal = {
  label: "Visit site" | "App Store";
  url: string;
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  stack: string[];
  highlights: string[];
  featured?: boolean;
  coverImage: string;
  galleryImages: string[];
  external: ProjectExternal;
};

export const projects: Project[] = [
  {
    slug: "rankalert",
    title: "RankAlert",
    category: "SEO Monitoring",
    summary:
      "Search Console-based rank change alerts, indexing diagnostics, and AI visibility monitoring for AI Overviews and LLMs.",
    problem:
      "SEO teams often find out about ranking or indexing problems too late, after traffic has already dropped. Traditional rank trackers also rely on scraped or estimated data.",
    solution:
      "RankAlert uses Search Console signals to detect meaningful changes quickly, then turns them into actionable alerts and diagnostics — including visibility tracking for AI-powered search results.",
    stack: ["Google Search Console", "SEO", "Alerts", "AI"],
    highlights: [
      "Same-morning alerts on meaningful performance changes",
      "Avoids scraped/estimated rank data by using Search Console signals",
      "AI visibility monitoring + prioritised action plan",
    ],
    featured: true,
    coverImage: "/portfolio/rankalert/cover.png",
    galleryImages: ["/portfolio/rankalert/cover.png", "/portfolio/rankalert/page.png"],
    external: { label: "Visit site", url: "https://www.rankalert.co.uk/" },
  },
  {
    slug: "bulkzip",
    title: "BulkZip",
    category: "Productivity",
    summary:
      "Download Gmail attachments in bulk into one clean ZIP. Filter emails, preview attachments, export fast.",
    problem:
      "Gmail makes it painful to download attachments at scale, especially when you need a clean export of invoices, receipts, documents, or photos across many emails.",
    solution:
      "BulkZip connects via read-only Gmail access, lets you filter and preview attachments, then exports selected files into a single ZIP download in a fast, low-friction flow.",
    stack: ["Google OAuth", "Gmail", "Export", "Security"],
    highlights: [
      "Connect Gmail (read-only) and export selected attachments as a ZIP",
      "Filter by inbox/sender/date/subject/filename",
      "Privacy-forward: scoped permissions and on-demand export flow",
    ],
    featured: true,
    coverImage: "/portfolio/bulkzip/cover.png",
    galleryImages: ["/portfolio/bulkzip/cover.png", "/portfolio/bulkzip/page.png"],
    external: { label: "Visit site", url: "https://bulkattachmentdownload.com/" },
  },
  {
    slug: "tournament-generator",
    title: "Tournament Generator",
    category: "iOS App",
    summary:
      "Run round robins and brackets on iPhone/iPad with fast setup, scoring, and multi-court management.",
    problem:
      "Clubs and social leagues need quick tournament setup and match tracking without spreadsheets, complicated software, or expensive subscriptions.",
    solution:
      "Tournament Generator provides a clean mobile-first workflow for creating formats, generating matches, tracking scores, and running multi-court events on the go.",
    stack: ["iOS", "Scheduling", "Scoring"],
    highlights: [
      "Quick tournament setup for clubs and social leagues",
      "Round robin + bracket formats with clean match tracking",
      "Designed for on-court use: simple UI and fast interactions",
    ],
    featured: true,
    coverImage: "/portfolio/tournament-generator/shot-1.jpg",
    galleryImages: [
      "/portfolio/tournament-generator/shot-1.jpg",
      "/portfolio/tournament-generator/shot-2.jpg",
      "/portfolio/tournament-generator/shot-3.jpg",
    ],
    external: {
      label: "App Store",
      url: "https://apps.apple.com/gb/app/tournament-generator-brackets/id6740823846",
    },
  },
  {
    slug: "mycvbuddy",
    title: "MyCVBuddy",
    category: "Web App",
    summary:
      "AI-powered CV tailoring for UK job seekers: upload a CV, add a job spec, export ATS-friendly documents.",
    problem:
      "Tailoring a CV manually for each job is time-consuming, and many candidates lose out due to missing role-specific keywords and ATS formatting issues.",
    solution:
      "MyCVBuddy streamlines the workflow: upload CV + paste job description → generate ATS-friendly, UK-specific tailored outputs with export-ready formatting.",
    stack: ["AI", "UK ATS", "PDF/DOCX", "Templates"],
    highlights: [
      "Tailors CV content to a specific job description",
      "ATS-friendly optimisation and exports",
      "Built for clarity and speed under real job-search pressure",
    ],
    coverImage: "/portfolio/mycvbuddy/cover.png",
    galleryImages: ["/portfolio/mycvbuddy/cover.png", "/portfolio/mycvbuddy/page.png"],
    external: { label: "Visit site", url: "https://www.mycvbuddy.com/" },
  },
  {
    slug: "heartcentred-playtherapy",
    title: "Heart Centred Play Therapy",
    category: "Website",
    summary:
      "A calm, approachable practice site communicating services, location, and an easy enquiry pathway.",
    problem:
      "Therapy practices need trust-first communication that is easy to understand for parents and carers, with clear services and a simple route to enquiry.",
    solution:
      "The site is structured around services and outcomes, with a calm tone and mobile-friendly layout that makes it easy to learn, trust, and get in touch.",
    stack: ["Content", "UX", "Accessibility"],
    highlights: [
      "Clear service structure (Play Therapy / Filial Therapy / Psycho-education)",
      "Trust-forward tone and readability",
      "Mobile-friendly enquiry flow",
    ],
    coverImage: "/portfolio/heartcentred-playtherapy/cover.png",
    galleryImages: [
      "/portfolio/heartcentred-playtherapy/cover.png",
      "/portfolio/heartcentred-playtherapy/page.png",
    ],
    external: { label: "Visit site", url: "https://www.heartcentredplaytherapy.co.uk/" },
  },
  {
    slug: "cm-confapp",
    title: "Conference App (Communication Matters)",
    category: "Web App",
    summary:
      "An accessibility-first conference companion with programme browsing, agenda, venue map, and announcements.",
    problem:
      "Conference schedules are dense and time-based, and attendees need to find sessions quickly on mobile — often under accessibility constraints.",
    solution:
      "This companion experience prioritises readability and navigation with accessibility controls, clear IA, and quick access to programme, agenda, and venue info.",
    stack: ["Accessibility", "PWA-style UX", "Navigation"],
    highlights: [
      "High contrast mode and adjustable text size",
      "Clear information architecture for time-based schedules",
      "Built to be usable quickly under event conditions",
    ],
    coverImage: "/portfolio/cm-confapp/cover.png",
    galleryImages: ["/portfolio/cm-confapp/cover.png", "/portfolio/cm-confapp/page.png"],
    external: {
      label: "Visit site",
      url: "https://confapp.communicationmatters.org.uk/",
    },
  },
  {
    slug: "communikey",
    title: "CommuniKey",
    category: "iOS App",
    summary:
      "An AAC text-to-speech keyboard with prediction, phrase banking, and accessibility features for fast communication.",
    problem:
      "AAC users need a communication tool that is fast, accessible, and reliable day-to-day, with minimal friction when composing speech.",
    solution:
      "CommuniKey focuses on speed and accessibility through prediction, phrase banking, and an interface built for confident communication.",
    stack: ["iPad", "AAC", "TTS", "Accessibility"],
    highlights: [
      "Prediction + phrase banking for speed",
      "Designed for accessibility and real-world daily use",
      "Clear, calm UI focused on communication",
    ],
    coverImage: "/portfolio/communikey/shot-1.jpg",
    galleryImages: [
      "/portfolio/communikey/shot-1.jpg",
      "/portfolio/communikey/shot-2.jpg",
      "/portfolio/communikey/shot-3.jpg",
    ],
    external: { label: "App Store", url: "https://apps.apple.com/gb/app/communikey/id6736987829" },
  },
  {
    slug: "voice-journal",
    title: "Voice Journal",
    category: "iOS App",
    summary:
      "Voice-first journaling: speak naturally and get transcripts, reflections, and mood/theme insights over time.",
    problem:
      "Many people find typing journaling inconsistent; the friction is too high and entries don’t happen regularly.",
    solution:
      "Voice Journal reduces friction by making voice the primary input, then extracting reflections and long-term patterns in a calm, private-feeling experience.",
    stack: ["iOS", "Audio", "AI", "Privacy"],
    highlights: [
      "Voice → transcript → reflection flow",
      "Designed to feel calm, not like a productivity tool",
      "Insight tracking for themes and mood",
    ],
    coverImage: "/portfolio/voice-journal/shot-1.jpg",
    galleryImages: [
      "/portfolio/voice-journal/shot-1.jpg",
      "/portfolio/voice-journal/shot-2.jpg",
      "/portfolio/voice-journal/shot-3.jpg",
    ],
    external: { label: "App Store", url: "https://apps.apple.com/gb/app/voice-journal/id6768273622" },
  },
  {
    slug: "satisfy-sounds",
    title: "Satisfy Sounds",
    category: "iOS App",
    summary:
      "A simple stress-relief sound toy: satisfying taps, pops, and calming loops designed for quick decompression.",
    problem:
      "Stress relief tools often feel cluttered or overly “wellness” branded; users want something instant and lightweight.",
    solution:
      "Satisfy Sounds provides immediate calming interactions with low-friction UX and offline-friendly playback.",
    stack: ["iOS", "Audio", "Haptics"],
    highlights: [
      "Instant interaction, minimal friction",
      "Offline-friendly relaxation sounds",
      "Focused UI that stays out of the way",
    ],
    coverImage: "/portfolio/satisfy-sounds/shot-1.jpg",
    galleryImages: [
      "/portfolio/satisfy-sounds/shot-1.jpg",
      "/portfolio/satisfy-sounds/shot-2.jpg",
      "/portfolio/satisfy-sounds/shot-3.jpg",
    ],
    external: { label: "App Store", url: "https://apps.apple.com/gb/app/satisfy-sounds/id6752653608" },
  },
  {
    slug: "birthday-reminder-pro",
    title: "Birthday Reminder Pro",
    category: "iOS App",
    summary:
      "A lightweight birthday manager with reliable reminders, contact import, and gifting notes.",
    problem:
      "Missing birthdays is easy when reminders are inconsistent or scattered across calendars and notes.",
    solution:
      "Birthday Reminder Pro focuses on dependable reminders and quick management, with contact import and simple gifting notes.",
    stack: ["iOS", "Notifications", "Contacts"],
    highlights: [
      "Custom reminder schedules",
      "Contact import and quick actions",
      "Designed for speed and clarity",
    ],
    coverImage: "/portfolio/birthday-reminder-pro/shot-1.jpg",
    galleryImages: [
      "/portfolio/birthday-reminder-pro/shot-1.jpg",
      "/portfolio/birthday-reminder-pro/shot-2.jpg",
      "/portfolio/birthday-reminder-pro/shot-3.jpg",
    ],
    external: {
      label: "App Store",
      url: "https://apps.apple.com/gb/app/birthday-reminder-pro/id6741428143",
    },
  },
  {
    slug: "board-game-scanner",
    title: "Board Game Scanner",
    category: "iOS App",
    summary:
      "Scan shelf photos and sync your board game collection to BoardGameGeek with AI-assisted recognition.",
    problem:
      "Manually entering a board game collection is slow, and sharing what you own with a group is awkward.",
    solution:
      "Board Game Scanner speeds up cataloguing by scanning shelves and syncing to BoardGameGeek for enriched game details.",
    stack: ["iOS", "OCR/AI", "BGG"],
    highlights: [
      "Photo-based scanning to avoid manual entry",
      "Sync/enrichment via BoardGameGeek",
      "Built for collectors and groups",
    ],
    coverImage: "/portfolio/board-game-scanner/shot-1.jpg",
    galleryImages: [
      "/portfolio/board-game-scanner/shot-1.jpg",
      "/portfolio/board-game-scanner/shot-2.jpg",
      "/portfolio/board-game-scanner/shot-3.jpg",
    ],
    external: {
      label: "App Store",
      url: "https://apps.apple.com/gb/app/board-game-scanner-bgg-sync/id6755399454",
    },
  },
  {
    slug: "generate-invoice-pro",
    title: "Generate Invoice Pro",
    category: "iOS App",
    summary:
      "Minimal invoicing on iPhone/iPad: create invoices fast with clean templates and PDF export.",
    problem:
      "Freelancers need invoicing that’s quick and professional without heavyweight accounting software.",
    solution:
      "Generate Invoice Pro provides a fast invoice/estimate workflow with clean templates and export-ready PDFs.",
    stack: ["iOS", "PDF", "Templates"],
    highlights: [
      "Fast invoice + estimate creation",
      "Polished templates and export flow",
      "Designed for freelancers who want simplicity",
    ],
    coverImage: "/portfolio/generate-invoice-pro/shot-1.jpg",
    galleryImages: [
      "/portfolio/generate-invoice-pro/shot-1.jpg",
      "/portfolio/generate-invoice-pro/shot-2.jpg",
      "/portfolio/generate-invoice-pro/shot-3.jpg",
    ],
    external: {
      label: "App Store",
      url: "https://apps.apple.com/gb/app/generate-invoice-pro/id6743435066",
    },
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}
