"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Upload once",
    body: "Drop in your existing CV. We parse every section — experience, skills, education — in seconds.",
  },
  {
    n: "02",
    title: "Paste the job",
    body: "Add the job description you're applying to. Our model reads what it's actually asking for.",
  },
  {
    n: "03",
    title: "Get a tailored CV",
    body: "A rewritten, ATS-safe CV matched to that role — still recognisably yours, ready to export.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".step-card");
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Three steps. No guesswork.
        </h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="step-card rounded-2xl border border-border p-7 opacity-100 transition-colors hover:border-foreground/30"
            >
              <span className="font-display text-sm text-accent">{step.n}</span>
              <h3 className="mt-4 text-xl font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
