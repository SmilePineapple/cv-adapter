import Link from "next/link";

import { Container } from "@/components/Container";

export default function ThanksPage() {
  return (
    <div className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Thanks
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            Message received. I’ll reply as soon as I can.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              {
                title: "What happens next",
                body: "I’ll review your message and respond with next steps and any clarifying questions.",
              },
              {
                title: "If you have links",
                body: "Feel free to send references (apps, sites, competitors) — it speeds up the build plan.",
              },
              {
                title: "Want to see examples?",
                body: "Browse the portfolio while you wait.",
              },
            ].map((s) => (
              <section
                key={s.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6"
              >
                <h2 className="text-sm font-semibold tracking-tight text-zinc-950">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{s.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/portfolio"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white hover:opacity-95"
            >
              View portfolio
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
            >
              Back to contact
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

