"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

// Keep in sync with FREE_MONTHLY_GENERATION_LIMIT in src/lib/subscription.ts
// — duplicated here rather than imported since that file also imports
// next/server, which can't be pulled into a "use client" component.
const FREE_MONTHLY_GENERATION_LIMIT = 1;

const tiers = [
  {
    name: "Free",
    price: "£0",
    cadence: "forever",
    description: "Try it out, no card required.",
    features: [
      `${FREE_MONTHLY_GENERATION_LIMIT} tailored CV / month`,
      "PDF export",
      "ATS match scoring & free ATS Checker",
      "Cover letter generation",
    ],
    cta: "Get started free",
    href: "/signup",
    featured: false,
  },
  {
    name: "Pro",
    price: "£2.99",
    cadence: "/month",
    description: "For anyone actively job hunting.",
    features: [
      "Unlimited tailored CVs",
      "PDF & DOCX export",
      "Fix my CV, Roast my CV",
      "Interview prep & mock interviews",
      "Skills assessments & career coaching",
    ],
    cta: "Start Pro",
    href: "/signup",
    featured: true,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(".pricing-card", {
        opacity: 0,
        y: 32,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Simple pricing. Cancel anytime.
        </h2>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 sm:max-w-2xl">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card flex flex-col rounded-2xl border p-8 opacity-100 ${
                tier.featured
                  ? "border-accent bg-background"
                  : "border-border bg-background/50"
              }`}
            >
              <h3 className="font-display text-xl">{tier.name}</h3>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-4xl">{tier.price}</span>
                <span className="text-sm text-muted">{tier.cadence}</span>
              </div>
              <ul className="mt-8 flex-1 space-y-3 text-sm text-muted">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      strokeWidth={1.75}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MagneticButton
                  href={tier.href}
                  variant={tier.featured ? "primary" : "secondary"}
                >
                  {tier.cta}
                </MagneticButton>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-md text-xs text-muted">
          Sign up free, then upgrade to Pro from your dashboard whenever
          you&apos;re ready.
        </p>
      </div>
    </section>
  );
}
