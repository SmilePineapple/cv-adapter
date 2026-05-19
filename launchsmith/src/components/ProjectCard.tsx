import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-white/10 card-glass transition-transform hover:-translate-y-0.5">
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]">
          <Image
            src={project.coverImage}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-[1.07] group-hover:saturate-125"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          {project.category}
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight text-white">
          <Link href={`/portfolio/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-white/70">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="chip rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="btn-primary inline-flex h-10 items-center justify-center rounded-full px-5 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
          >
            Case study
          </Link>
          <a
            href={project.external.url}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary inline-flex h-10 items-center justify-center rounded-full border border-white/10 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-white/10"
          >
            {project.external.label}
          </a>
        </div>
      </div>
    </div>
  );
}
