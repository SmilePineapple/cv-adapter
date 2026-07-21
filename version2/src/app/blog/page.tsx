import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata = { title: "Blog — MyCV Buddy" };

export default function BlogIndexPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        Blog
      </h1>
      <p className="mt-3 text-muted">
        Practical writing on CVs, ATS systems, and job applications.
      </p>

      <div className="mt-12 space-y-8">
        {BLOG_POSTS.slice()
          .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
            >
              <p className="text-xs text-muted">
                {new Date(post.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h2 className="mt-1.5 font-display text-xl tracking-tight">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{post.description}</p>
            </Link>
          ))}
      </div>
    </main>
  );
}
