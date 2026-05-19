import Link from "next/link";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

const featured = projects.filter((p) => p.featured).slice(0, 3);

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200">
        <Container className="py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
              {site.role}
            </div>
            <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              Build. Launch. Iterate.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              I build websites, web apps, and iOS apps — clean UX, modern stacks,
              and a professional finish. If you can describe what you want, we can
              ship it.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:opacity-95"
              >
                Send a message
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-7 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950 hover:bg-zinc-50"
              >
                View work
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[var(--surface)]">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Services
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                What I build
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] hover:underline"
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
                className="rounded-3xl border border-zinc-200 bg-white p-6"
              >
                <h3 className="font-serif text-xl font-semibold tracking-tight text-zinc-950">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Selected work
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                Featured projects
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] hover:underline"
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
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Testimonials
          </div>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
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
                className="rounded-3xl border border-zinc-200 bg-white p-6"
              >
                <p className="text-sm leading-7 text-zinc-800">“{t.quote}”</p>
                <div className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-950">
                  {t.name}
                </div>
                <div className="mt-1 text-xs text-zinc-600">{t.role}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-zinc-200 bg-[var(--surface)]">
        <Container className="py-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-zinc-200 bg-white p-8 sm:flex-row sm:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Contact
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-zinc-950">
                Have something to build?
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Send a quick message with what you’re building and your timeline.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--accent)] px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:opacity-95"
            >
              Send a message
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
