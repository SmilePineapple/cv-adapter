import Link from "next/link";

import { Container } from "@/components/Container";

const services = [
  {
    title: "Websites",
    outcomes: [
      "Fast, responsive, modern design",
      "SEO-ready structure and metadata",
      "Clean copy layout and clear CTAs",
    ],
    included: ["Landing pages", "Marketing sites", "Portfolio sites", "Content pages"],
  },
  {
    title: "Web Apps",
    outcomes: [
      "Solid foundations for scaling",
      "Auth, dashboards, admin flows",
      "Clean UI and maintainable code",
    ],
    included: ["App shells", "CRUD + workflows", "Integrations", "Deployment"],
  },
  {
    title: "Mobile Apps",
    outcomes: [
      "Polished UX for iOS and Android",
      "Performance and reliability focus",
      "Clean releases and iteration",
    ],
    included: ["MVPs", "Companion apps", "App store prep", "API integration"],
  },
  {
    title: "Automation / AI Integrations",
    outcomes: [
      "Automate manual workflows",
      "Connect tools via APIs and webhooks",
      "Add AI features where they make sense",
    ],
    included: ["Webhook automations", "Internal tools", "AI features", "System glue"],
  },
] as const;

const faq = [
  {
    q: "What do you need to start?",
    a: "A short description of what you’re building, any references you like, and your timeline. If you have designs, great — if not, we can start from structure and iterate.",
  },
  {
    q: "How long does a typical build take?",
    a: "It depends on scope. A clean website can be quick; apps take longer. I’ll give you a clear plan once I understand the requirements.",
  },
  {
    q: "Do you offer ongoing support?",
    a: "Yes. We can agree a lightweight support setup after launch (fixes, improvements, iterations).",
  },
] as const;

export default function ServicesPage() {
  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Services
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Services
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/70">
            No packages and no hard pricing here — just a clean conversation about
            what you need, and a build plan that fits.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {services.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl border border-white/10 p-6 card-glass"
            >
              <h2 className="text-base font-semibold tracking-tight text-white">
                {s.title}
              </h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Outcomes
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-white/70">
                    {s.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Includes
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-white/70">
                    {s.included.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-[var(--accent-2)] hover:underline"
                >
                  Ask about {s.title.toLowerCase()}
                </Link>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight text-white">FAQ</h2>
          <div className="mt-6 grid gap-4">
            {faq.map((item) => (
              <section
                key={item.q}
                className="rounded-2xl border border-white/10 p-6 card-glass"
              >
                <h3 className="text-sm font-semibold tracking-tight text-white">
                  {item.q}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{item.a}</p>
              </section>
            ))}
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-[36px] border border-white/10 p-8 card-glass ring-glow">
          <div
            aria-hidden
            className="orb pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.38),transparent_70%)] blur-2xl"
          />
          <div className="relative">
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Ready to start?
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Send a message with what you’re building and your timeline.
            </p>
            <div className="mt-6">
              <Link
                href="/contact"
                className="btn-primary inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold hover:opacity-95"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
