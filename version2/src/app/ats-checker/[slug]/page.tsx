import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ATS_CHECKER_PAGES, getAtsCheckerPage } from "@/lib/ats-checker-pages";
import AtsCheckerForm from "@/components/AtsCheckerForm";

export function generateStaticParams() {
  return ATS_CHECKER_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAtsCheckerPage(slug);
  return {
    title: page ? `${page.title} — MyCV Buddy` : "Free ATS Checker — MyCV Buddy",
    description: page?.intro,
  };
}

export default async function AtsCheckerIndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getAtsCheckerPage(slug);
  if (!page) notFound();

  const otherPages = ATS_CHECKER_PAGES.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <Link
        href="/ats-checker"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Free ATS Checker
      </Link>

      <h1 className="mt-6 font-display text-3xl tracking-tight sm:text-4xl">
        {page.h1}
      </h1>
      <p className="mt-3 max-w-2xl text-muted">{page.intro}</p>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        No account needed — nothing you paste here is saved.
      </p>

      <div className="mt-12">
        <AtsCheckerForm />
      </div>

      <div className="mt-16 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Tips for this field
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {page.tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">+</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Keywords ATS commonly looks for
          </h2>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {page.keywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-border px-2.5 py-1 text-xs text-muted"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm">
          Want your CV automatically rewritten to close these gaps?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Create a free account
          </Link>{" "}
          and let MyCV Buddy tailor it for you.
        </p>
      </div>

      {otherPages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Other fields
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherPages.map((p) => (
              <Link
                key={p.slug}
                href={`/ats-checker/${p.slug}`}
                className="text-sm text-foreground underline underline-offset-4"
              >
                {p.h1}
              </Link>
            ))}
            <Link
              href="/blog"
              className="text-sm text-foreground underline underline-offset-4"
            >
              Read the blog
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
