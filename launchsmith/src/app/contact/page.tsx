import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
              Contact
            </div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Contact
            </h1>
            <p className="mt-4 text-lg leading-8 text-white/70">
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
                  className="rounded-2xl border border-white/10 p-6 card-glass"
                >
                  <h2 className="text-sm font-semibold tracking-tight text-white">
                    {s.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-white/70">{s.body}</p>
                </section>
              ))}
            </div>
          </div>

          <div>
            <ContactForm />
            <div className="mt-4 text-xs text-white/55">
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
