import Link from "next/link";

import { Container } from "@/components/Container";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

const featured = projects.filter((p) => p.featured);
const more = projects.filter((p) => !p.featured);

export default function PortfolioPage() {
  return (
    <div className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Portfolio
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Case studies and builds. Links are placeholders for now and can be swapped
            to your real GitHub and live URLs anytime.
          </p>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              Featured
            </h2>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              More projects
            </h2>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Contact
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {more.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

