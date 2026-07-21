"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "ATS-safe by default",
    body: "Every export is checked against the same parsers real applicant tracking systems use, so your CV actually gets read.",
  },
  {
    title: "Tailored per job, not templated",
    body: "We don't just swap a keyword. The model rewrites emphasis and framing to match what the job description is actually asking for.",
  },
  {
    title: "Unlimited versions",
    body: "Applying to ten roles this week? Generate ten tailored CVs from the same base profile, no extra work.",
  },
  {
    title: "ATS match scoring",
    body: "Every tailored CV comes back with an estimated match score against the job description, so you know how strong the fit is before you apply.",
  },
  {
    title: "Cover letters included",
    body: "Generate a matching cover letter from the same tailored CV — grounded in your real experience, addressed to the right company and hiring manager.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".feature-row");
      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          x: -24,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Built to be read by humans and machines.
        </h2>
        <div className="mt-16 divide-y divide-border border-t border-border">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="feature-row grid gap-3 py-8 opacity-100 sm:grid-cols-[80px_1fr_2fr] sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-medium">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
