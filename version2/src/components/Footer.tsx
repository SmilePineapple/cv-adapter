const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Tools", href: "#tools" },
      { label: "Pricing", href: "#pricing" },
      { label: "Free ATS Checker", href: "/ats-checker" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Help", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    title: "Language",
    links: [
      { label: "Español", href: "/es" },
      { label: "Français", href: "/fr" },
      { label: "Deutsch", href: "/de" },
      { label: "Português", href: "/pt" },
      { label: "العربية", href: "/ar" },
      { label: "हिन्दी", href: "/hi" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 py-16 text-sm">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <div>
          <span className="font-display text-lg text-foreground">
            mycv<span className="text-accent">buddy</span>
          </span>
          <p className="mt-3 max-w-xs text-muted">
            AI-tailored CVs built for the job you actually want.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
              {col.title}
            </h4>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 border-t border-border pt-6 text-xs text-muted">
        &copy; {new Date().getFullYear()} MyCV Buddy. All rights reserved.
      </div>
    </footer>
  );
}
