import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <Link href={`/portfolio/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface)]">
          <Image
            src={project.coverImage}
            alt={`${project.title} screenshot`}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div className="p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
          {project.category}
        </div>
        <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight text-zinc-950">
          <Link href={`/portfolio/${project.slug}`} className="hover:underline">
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:opacity-95"
          >
            Case study
          </Link>
          <a
            href={project.external.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-950 hover:bg-zinc-50"
          >
            {project.external.label}
          </a>
        </div>
      </div>
    </div>
  );
}
