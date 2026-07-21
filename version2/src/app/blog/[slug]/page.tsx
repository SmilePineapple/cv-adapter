import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BLOG_POSTS, getBlogPost } from "@/lib/blog-posts";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return { title: post ? `${post.title} — MyCV Buddy` : "Blog — MyCV Buddy" };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        Back to blog
      </Link>

      <p className="mt-6 text-xs text-muted">
        {new Date(post.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
        {post.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm">
          Ready to put this into practice?{" "}
          <Link href="/signup" className="text-foreground underline underline-offset-4">
            Tailor your CV free
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
