import Link from "next/link";
import { LOCALES, LOCALE_NAMES, type LocaleId, localeContent } from "@/lib/locale-content";

export default function LocalizedLandingPage({ locale }: { locale: LocaleId }) {
  const t = localeContent[locale];
  const otherLocales = LOCALES.filter((l) => l !== locale);

  return (
    <div dir={t.dir} className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-lg tracking-tight">
            mycv<span className="text-accent">buddy</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-foreground">
              {t.langSwitchLabel}
            </Link>
            <Link
              href="/login"
              className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/40"
            >
              {t.signIn}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted">
              {t.kicker}
            </span>
            <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
              {t.headline}
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted">
              {t.subheadline}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/signup"
                className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90"
              >
                {t.ctaPrimary}
              </Link>
              <a
                href="#how-it-works"
                className="min-h-[44px] rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-foreground/40"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {t.howItWorksTitle}
            </h2>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {t.steps.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border p-7 transition-colors hover:border-foreground/30"
                >
                  <span className="font-display text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-medium">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {t.toolsTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              {t.toolsSubtitle}
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.tools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.free ? "/ats-checker" : "/signup"}
                  className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
                >
                  <h3 className="font-medium">{tool.title}</h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                    {tool.body}
                  </p>
                  {tool.free && (
                    <span className="mt-4 inline-flex w-fit items-center rounded-full border border-accent/40 px-2.5 py-1 text-xs text-accent">
                      {tool.free}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
              {t.pricingTitle}
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              {t.pricingBody}
            </p>
            <div className="mt-12 max-w-sm rounded-2xl border border-accent bg-background p-8">
              <h3 className="font-display text-xl">{t.pricingIncludedTitle}</h3>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl">£0</span>
              </div>
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="block min-h-[44px] rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-black transition-colors hover:bg-accent/90"
                >
                  {t.pricingCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-6 py-16 text-sm">
        <span className="font-display text-lg text-foreground">
          mycv<span className="text-accent">buddy</span>
        </span>
        <p className="mt-3 max-w-xs text-muted">{t.footerNote}</p>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-muted">
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
          {otherLocales.map((l) => (
            <Link
              key={l}
              href={`/${l}`}
              className="transition-colors hover:text-foreground"
            >
              {LOCALE_NAMES[l]}
            </Link>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} MyCV Buddy.
        </div>
      </footer>
    </div>
  );
}
