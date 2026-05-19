import Link from "next/link";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const featured = projects.filter((p) => p.featured).slice(0, 3);

export default function HomePage() {
  return (
    <div className="bg-transparent">
      <section className="border-b border-white/10">
        <Container className="py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-[36px] border border-white/10 p-8 card-glass ring-glow sm:p-12">
            <div
              aria-hidden
              className="orb pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.75),transparent_70%)] blur-2xl"
            />
            <div
              aria-hidden
              className="orb2 pointer-events-none absolute -right-36 top-8 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.55),transparent_70%)] blur-2xl"
            />
            <div className="relative max-w-3xl">
              <div className="chip inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
                {site.role}
              </div>
              <h1 className="mt-7 font-serif text-5xl font-semibold tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-br from-white via-white to-[var(--accent-2)] bg-clip-text text-transparent">
                  Build. Launch. Iterate.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
                I build websites, web apps, and iOS apps — clean UX, modern stacks,
                and a professional finish. If you can describe what you want, we can
                ship it.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="btn-primary inline-flex h-12 items-center justify-center rounded-full px-7 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
                >
                  Send a message
                </Link>
                <Link
                  href="/portfolio"
                  className="btn-secondary inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10"
                >
                  View work
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-transparent">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Services
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white">
                What I build
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-2)] hover:underline"
            >
              See all services
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Websites",
                desc: "Fast, SEO-friendly sites with crisp design and clear messaging.",
              },
              {
                title: "Web Apps",
                desc: "Full-stack builds with auth, dashboards, and scalable foundations.",
              },
              {
                title: "Mobile Apps",
                desc: "Polished iOS/Android apps with great UX and solid performance.",
              },
              {
                title: "Automation / AI",
                desc: "Integrations, workflows, and AI features that remove busywork.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="rounded-3xl border border-white/10 p-6 card-glass"
              >
                <h3 className="font-serif text-xl font-semibold tracking-tight text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-white/10 bg-transparent">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Selected work
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white">
                Featured projects
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-2)] hover:underline"
            >
              Browse portfolio
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-14 sm:py-16">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Testimonials
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white">
            What clients say
          </h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              {
                quote:
                  "Clear communication, fast turnaround, and the build quality was spot on.",
                name: "Client Name",
                role: "Founder",
              },
              {
                quote:
                  "Took a vague idea and shipped something clean, stable, and easy to extend.",
                name: "Client Name",
                role: "Product Lead",
              },
              {
                quote:
                  "The end result feels premium. Great attention to details and edge cases.",
                name: "Client Name",
                role: "Operator",
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-white/10 p-6 card-glass"
              >
                <p className="text-sm leading-7 text-white/80">“{t.quote}”</p>
                <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {t.name}
                </div>
                <div className="mt-1 text-xs text-white/60">{t.role}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 bg-transparent">
        <Container className="py-14 sm:py-16">
          <div className="relative overflow-hidden flex flex-col items-start justify-between gap-6 rounded-[36px] border border-white/10 p-8 card-glass ring-glow sm:flex-row sm:items-center">
            <div
              aria-hidden
              className="orb pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.32),transparent_70%)] blur-2xl"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                Contact
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-white">
                Have something to build?
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Send a quick message with what you’re building and your timeline.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-primary inline-flex h-12 items-center justify-center rounded-full px-7 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
            >
              Send a message
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
