export type Project = {
  slug: string;
  name: string;
  summary: string;
  stack: string[];
  featured?: boolean;
  githubUrl?: string;
  liveUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "mvp-builder",
    name: "MVP Builder",
    summary:
      "A fast-launch platform for validating ideas with clean UX and a modern stack.",
    stack: ["Next.js", "TypeScript", "Postgres"],
    featured: true,
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "mobile-companion",
    name: "Mobile Companion App",
    summary:
      "A mobile-first experience designed for speed, offline resilience, and polish.",
    stack: ["React Native", "Expo", "API Integration"],
    featured: true,
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "automation-suite",
    name: "Automation Suite",
    summary:
      "Workflow automation and AI integrations to remove busywork and unlock growth.",
    stack: ["Node.js", "Webhooks", "AI"],
    featured: true,
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "product-landing",
    name: "Product Landing Page",
    summary: "A conversion-focused landing page with crisp typography and fast load times.",
    stack: ["Next.js", "Tailwind", "SEO"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "dashboard-ui",
    name: "Dashboard UI",
    summary: "A responsive dashboard layout with clear hierarchy and accessible components.",
    stack: ["React", "TypeScript", "Design System"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "booking-site",
    name: "Booking Website",
    summary:
      "A clean service site with enquiry flow, structured content, and simple analytics hooks.",
    stack: ["Next.js", "Forms", "Analytics"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "marketplace-prototype",
    name: "Marketplace Prototype",
    summary:
      "A prototype marketplace experience with listings, search, and secure account flows.",
    stack: ["Next.js", "Auth", "Database"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "content-engine",
    name: "Content Engine",
    summary:
      "A lightweight content system for publishing updates and keeping product pages fresh.",
    stack: ["MDX", "Next.js", "Static Generation"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "api-integration",
    name: "API Integration",
    summary:
      "A production integration connecting external services reliably with retries and monitoring.",
    stack: ["APIs", "Queues", "Observability"],
    githubUrl: "#",
    liveUrl: "#",
  },
  {
    slug: "micro-saas",
    name: "Micro-SaaS Starter",
    summary:
      "A ready-to-extend starter including auth, billing hooks, and a clean app shell.",
    stack: ["Next.js", "Auth", "Stripe"],
    githubUrl: "#",
    liveUrl: "#",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

