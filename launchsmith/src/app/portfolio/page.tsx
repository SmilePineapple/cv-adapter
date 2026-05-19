import Link from "next/link";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

export default function PortfolioPage() {
  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 p-8 card-glass ring-glow sm:p-10">
          <div
            aria-hidden
            className="orb pointer-events-none absolute -right-32 -top-28 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.5),transparent_70%)] blur-2xl"
          />
          <div className="relative max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Portfolio
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Selected work
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
              A mix of web products, websites, and iOS apps — with clean case studies and
              direct links to each live project.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-white">
              Featured
            </h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-white">
              More projects
            </h2>
            <Link
              href="/contact"
              className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-2)] hover:underline"
            >
              Contact
            </Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
