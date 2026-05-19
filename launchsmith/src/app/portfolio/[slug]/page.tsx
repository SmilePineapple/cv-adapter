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
    <div className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="max-w-3xl">
          <Link
            href="/portfolio"
            className="text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Back to portfolio
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">{project.summary}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-6">
            {[
              {
                title: "Overview",
                body: "Short overview of what this project is and who it’s for. Replace this placeholder with a real intro later.",
              },
              {
                title: "Problem",
                body: "What needed solving and what constraints existed. Replace with the real story later.",
              },
              {
                title: "Solution",
                body: "How the project was designed and built, including key technical decisions. Replace later.",
              },
              {
                title: "Key features",
                list: [
                  "Feature placeholder",
                  "Feature placeholder",
                  "Feature placeholder",
                ],
              },
            ].map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <h2 className="text-base font-semibold tracking-tight text-zinc-950">
                  {section.title}
                </h2>
                {"body" in section ? (
                  <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {section.body}
                  </p>
                ) : (
                  <ul className="mt-3 list-disc pl-5 text-sm leading-6 text-zinc-600">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={project.liveUrl ?? "#"}
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white hover:opacity-95"
            >
              Live
            </a>
            <a
              href={project.githubUrl ?? "#"}
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
            >
              GitHub
            </a>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
            >
              Build something similar
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
