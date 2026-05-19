import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/Container";
import { getProjectBySlug, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) notFound();

  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="max-w-3xl">
          <Link
            href="/portfolio"
            className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)] hover:underline"
          >
            Back to portfolio
          </Link>
          <div className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            {project.category}
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-700">{project.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={project.external.url}
              target="_blank"
              rel="noreferrer"
              className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
            >
              {project.external.label}
            </a>
            <Link
              href="/contact"
              className="btn-secondary inline-flex h-11 items-center justify-center rounded-full border border-zinc-200/70 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950 hover:bg-white/80"
            >
              Enquire
            </Link>
          </div>

          <div className="mt-10 overflow-hidden rounded-3xl border border-zinc-200/70 bg-[var(--surface-muted)] shadow-sm shadow-zinc-950/5">
            <div className="relative aspect-[16/10]">
              <Image
                src={project.coverImage}
                alt={`${project.title} cover`}
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-5">
            <section className="rounded-3xl border border-zinc-200/70 p-7 card-glass shadow-sm shadow-zinc-950/5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Highlights
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-700">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-zinc-200/70 p-7 card-glass shadow-sm shadow-zinc-950/5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Problem
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-700">{project.problem}</p>
            </section>

            <section className="rounded-3xl border border-zinc-200/70 p-7 card-glass shadow-sm shadow-zinc-950/5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Solution
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-700">{project.solution}</p>
            </section>

            <section className="rounded-3xl border border-zinc-200/70 p-7 card-glass shadow-sm shadow-zinc-950/5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Tech
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200/70 p-7 card-glass shadow-sm shadow-zinc-950/5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Gallery
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {project.galleryImages.slice(0, 4).map((src) => (
                  <div
                    key={src}
                    className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-[var(--surface-muted)]"
                  >
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={src}
                        alt={`${project.title} screenshot`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-12 border-t border-zinc-200 pt-10">
            <div className="flex flex-wrap gap-3">
              <a
                href={project.external.url}
                target="_blank"
                rel="noreferrer"
                className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
              >
                {project.external.label}
              </a>
              <Link
                href="/contact"
                className="btn-secondary inline-flex h-11 items-center justify-center rounded-full border border-zinc-200/70 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950 hover:bg-white/80"
              >
                Build something similar
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
