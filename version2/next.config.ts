import type { NextConfig } from "next";

// The migration from legacy-v1 to this app dropped ~65 previously-live URLs
// with no redirects - confirmed directly that Google's top indexed results
// for this domain are now dead 404s (e.g. /ats-optimization-guide,
// /blog/cv-personal-statement-examples), which is a real, ongoing leak of
// whatever search visibility/backlinks those pages had. All `permanent`
// (308) so search engines transfer ranking signal to the new destination
// instead of eventually just dropping the dead page from the index.
// Legacy blog slugs appear twice in places (once from legacy-v1's actual
// src/app/blog/* directory, once from its separately-maintained, already
// out-of-sync-with-itself sitemap.xml) - both variants are included since
// Google may have indexed either depending on when it last crawled.
const LEGACY_REDIRECTS: { source: string; destination: string }[] = [
  // Static/info pages
  { source: "/about-us", destination: "/about" },
  { source: "/cookies", destination: "/privacy" },
  { source: "/pricing-comparison", destination: "/" },
  { source: "/landing", destination: "/" },
  { source: "/uk-cv-builder", destination: "/" },
  { source: "/resume-builder-usa", destination: "/" },
  { source: "/usa-resume-builder", destination: "/" },
  { source: "/unsubscribe", destination: "/contact" },

  // Tool/feature pages -> closest current equivalent
  { source: "/ats-friendly-cv-checklist", destination: "/ats-checker" },
  { source: "/ats-optimization-guide", destination: "/ats-checker" },
  { source: "/ats-resume-rewrite", destination: "/ats-checker" },
  { source: "/auto-cv", destination: "/dashboard/auto-cv" },
  { source: "/career-coach", destination: "/dashboard/career-coach" },
  { source: "/cover-letter", destination: "/signup" },
  { source: "/customize-resume-for-each-job", destination: "/" },
  { source: "/fix-my-cv", destination: "/signup" },
  { source: "/how-to-tailor-a-cv", destination: "/blog/how-to-tailor-a-cv-to-a-job-description" },
  { source: "/interview-prep", destination: "/signup" },
  { source: "/interview-simulator", destination: "/signup" },
  { source: "/resume-adapter", destination: "/" },
  { source: "/rewrite-cv-for-job-application", destination: "/" },
  { source: "/roast-cv", destination: "/signup" },
  { source: "/skills-assessment", destination: "/signup" },
  { source: "/subscription", destination: "/dashboard/billing" },
  { source: "/tailor-cv-to-job-description", destination: "/" },
  { source: "/upload", destination: "/signup" },
  { source: "/history", destination: "/signup" },
  { source: "/career-advice", destination: "/blog" },
  { source: "/cv-examples", destination: "/blog" },
  { source: "/cv-template", destination: "/blog" },
  { source: "/cv-templates", destination: "/blog" },
  { source: "/cv-writing-guide", destination: "/blog" },
  { source: "/resume-samples", destination: "/blog" },
  { source: "/resume-tips", destination: "/blog" },
  { source: "/resume-writing-services", destination: "/blog" },
  { source: "/templates", destination: "/blog" },
  { source: "/cv-vs-resume", destination: "/blog/cv-vs-resume-whats-the-difference" },

  // Dynamic per-record pages - the underlying IDs don't exist in this
  // app's database at all (different schema from legacy-v1), so there's no
  // sensible per-ID destination. Sends to the dashboard, which itself
  // bounces an anonymous visitor to login - a much better dead end than a
  // blank 404.
  { source: "/download/:id", destination: "/dashboard" },
  { source: "/edit/:cvId", destination: "/dashboard" },
  { source: "/generate/:id", destination: "/dashboard" },
  { source: "/review/:id", destination: "/dashboard" },
  { source: "/hobbies/:cvId", destination: "/dashboard" },
  { source: "/cover-letter/:id", destination: "/dashboard" },
  { source: "/cover-letter/view/:id", destination: "/dashboard" },
  { source: "/interview-prep/view/:id", destination: "/dashboard" },
  { source: "/skills-assessment/results/:id", destination: "/dashboard" },
  { source: "/skills-assessment/take/:id", destination: "/dashboard" },

  // Blog posts - legacy-v1's actual src/app/blog/* directory slugs
  { source: "/blog/ai-cv-generator-guide", destination: "/blog" },
  { source: "/blog/ai-powered-cv-optimization-2025", destination: "/blog" },
  { source: "/blog/ats-cv-tips-uk-2025", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/ats-friendly-cv-builder", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/best-free-cv-builders-uk-2025", destination: "/blog" },
  { source: "/blog/career-change-cv-guide-uk", destination: "/blog" },
  { source: "/blog/complete-resume-adapter-guide-2026", destination: "/blog" },
  { source: "/blog/cover-letter-template-uk-2025", destination: "/blog/cover-letters-that-dont-sound-generic" },
  { source: "/blog/cv-buddy-vs-canva", destination: "/blog" },
  { source: "/blog/cv-examples-by-industry-uk", destination: "/blog" },
  { source: "/blog/cv-format-best-layouts-uk", destination: "/blog" },
  { source: "/blog/cv-keywords-for-ats-2025", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/cv-personal-statement-examples", destination: "/blog" },
  { source: "/blog/cv-skills-section-guide", destination: "/blog/what-to-put-on-a-cv-the-complete-checklist" },
  { source: "/blog/cv-template-uk-2025", destination: "/blog" },
  { source: "/blog/cv-writing-tips", destination: "/blog" },
  { source: "/blog/first-job-cv-no-experience", destination: "/blog" },
  { source: "/blog/free-cv-builder-no-sign-up", destination: "/ats-checker" },
  { source: "/blog/graduate-cv-no-experience-uk", destination: "/ats-checker/graduate" },
  { source: "/blog/how-long-should-cv-be-uk", destination: "/blog/how-long-should-a-cv-be" },
  { source: "/blog/how-to-beat-ats-systems", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/professional-cv-how-to-create", destination: "/blog" },
  { source: "/blog/resume-vs-cv-difference", destination: "/blog/cv-vs-resume-whats-the-difference" },
  { source: "/blog/what-to-put-on-cv-complete-guide", destination: "/blog/what-to-put-on-a-cv-the-complete-checklist" },

  // Blog posts - legacy-v1's separately-maintained sitemap.xml slugs that
  // differ from the directory above (the sitemap generator had drifted out
  // of sync with the app itself even before this migration)
  { source: "/blog/ats-friendly-cv-builder-uk", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/career-change-cv", destination: "/blog" },
  { source: "/blog/graduate-cv-no-experience", destination: "/ats-checker/graduate" },
  { source: "/blog/ai-cv-optimization", destination: "/blog" },
  { source: "/blog/professional-cv-guide", destination: "/blog" },
  { source: "/blog/cv-keywords-ats", destination: "/blog/beating-ats-systems-what-actually-matters" },
  { source: "/blog/cv-format-guide", destination: "/blog" },
  { source: "/blog/first-job-cv", destination: "/blog" },
  { source: "/blog/what-to-put-on-cv", destination: "/blog/what-to-put-on-a-cv-the-complete-checklist" },
  { source: "/blog/tailor-cv-to-job", destination: "/blog/how-to-tailor-a-cv-to-a-job-description" },
  { source: "/blog/resume-vs-cv", destination: "/blog/cv-vs-resume-whats-the-difference" },
  { source: "/blog/best-free-cv-builders-uk", destination: "/blog" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
  turbopack: {
    root: __dirname,
  },
  // @sparticuz/chromium ships its Chromium binary as a file asset, read via
  // fs at runtime (not imported as a JS module), so Next's build tracer
  // won't pick it up on its own — the package's own docs call this out
  // explicitly for serverless bundlers. Both settings are required:
  // serverExternalPackages keeps puppeteer-core/@sparticuz/chromium out of
  // the bundle so they aren't relocated, and outputFileTracingIncludes
  // forces the binary directory into the deployed function.
  // pdfjs-dist's legacy Node build dynamically imports pdf.worker.mjs as a
  // fallback "fake worker" - Turbopack's tracer doesn't follow that dynamic
  // import, so the worker file was missing from the deployed function
  // (confirmed directly: "Cannot find module '.../pdf.worker.mjs'" in
  // production only). Same fix shape as chromium below.
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium",
    "pdfjs-dist",
  ],
  outputFileTracingIncludes: {
    "/api/export/\\[id\\]": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/upload": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
