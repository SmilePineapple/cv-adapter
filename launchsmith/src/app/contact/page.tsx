import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Contact
            </h1>
            <p className="mt-4 text-lg leading-8 text-zinc-600">
              Tell me what you want to build. A few lines is enough — I’ll reply
              with next steps and any questions.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                {
                  title: "Best for",
                  body: "New builds, rebuilds, MVPs, automation, and AI integrations.",
                },
                {
                  title: "What to include",
                  body: "What you’re building, any links/examples, and your timeline.",
                },
                {
                  title: "Response time",
                  body: "Placeholder: typically within 24–48 hours.",
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
          </div>

          <div>
            <ContactForm />
            <div className="mt-4 text-xs text-zinc-500">
              If email sending isn’t configured yet, submissions may fail in this
              sandbox. This is expected until you add environment variables in
              Vercel.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

