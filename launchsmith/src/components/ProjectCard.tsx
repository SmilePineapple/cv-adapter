import Link from "next/link";

import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-zinc-950">
            <Link href={`/portfolio/${project.slug}`} className="hover:underline">
              {project.name}
            </Link>
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-600">{project.summary}</p>
        </div>
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
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/portfolio/${project.slug}`}
          className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-950 px-4 text-sm font-semibold text-white hover:opacity-95"
        >
          Case study
        </Link>
        <a
          href={project.liveUrl ?? "#"}
          className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          Live
        </a>
        <a
          href={project.githubUrl ?? "#"}
          className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}

