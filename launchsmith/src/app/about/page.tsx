import Link from "next/link";

import { Container } from "@/components/Container";
import { site } from "@/lib/site";

export default function AboutPage() {
  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[320px_1fr] lg:items-start">
          <div>
            <div className="aspect-square w-full max-w-[320px] rounded-3xl border border-white/10 bg-[var(--surface-muted)] card-glass ring-glow" />
            <div className="mt-4 text-sm text-white/70">
              Replace this with your headshot later.
            </div>
          </div>
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              About
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              About
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              Launchsmith is a solo builder focused on shipping clean websites, web
              apps, and mobile apps. This is placeholder copy — you can swap it for
              your real story later.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                {
                  title: "What I do",
                  body: "End-to-end product builds: UX, frontend, backend, integrations, and deployment.",
                },
                {
                  title: "How I work",
                  body: "Fast iteration, clear communication, and a focus on shipping with quality.",
                },
                {
                  title: "Availability",
                  body: "Currently taking on new projects. Send a message with what you’re building and your timeline.",
                },
              ].map((s) => (
                <section
                  key={s.title}
                  className="rounded-2xl border border-white/10 p-6 card-glass"
                >
                  <h2 className="text-base font-semibold tracking-tight text-white">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/70">{s.body}</p>
                </section>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold hover:opacity-95"
              >
                Send a message
              </Link>
              <Link
                href="/portfolio"
                className="btn-secondary inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/10"
              >
                View work
              </Link>
            </div>

            <div className="mt-10 text-sm text-white/55">
              {site.name} · {site.role}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
