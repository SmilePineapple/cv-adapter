"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import HeroScene from "./HeroScene";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          [kickerRef.current, headlineRef.current, subRef.current, ctaRef.current],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const split = new SplitText(headlineRef.current, {
        type: "words,chars",
        wordsClass: "inline-block overflow-hidden",
        charsClass: "inline-block will-change-transform",
      });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.set(headlineRef.current, { opacity: 1 })
        .from(kickerRef.current, { opacity: 0, y: 12, duration: 0.5 })
        .from(
          split.chars,
          {
            yPercent: 120,
            rotate: 6,
            duration: 0.9,
            stagger: 0.012,
          },
          "-=0.2"
        )
        .from(
          subRef.current,
          { opacity: 0, y: 16, duration: 0.7 },
          "-=0.5"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 16, duration: 0.7 },
          "-=0.45"
        );

      return () => split.revert();
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden border-b border-border">
      <div className="pointer-events-none absolute right-[-45%] top-[-8%] h-[220px] w-[220px] opacity-25 sm:right-[-10%] sm:top-1/2 sm:h-[420px] sm:w-[420px] sm:-translate-y-1/2 sm:opacity-100 md:right-[2%] md:h-[560px] md:w-[560px]">
        <HeroScene />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        <span
          ref={kickerRef}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted"
        >
          AI-powered CV tailoring
        </span>

        <h1
          ref={headlineRef}
          className="max-w-3xl font-display text-5xl font-medium leading-[1.05] tracking-tight opacity-0 sm:text-6xl md:text-7xl"
        >
          CVs that get you seen.
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-md text-lg leading-relaxed text-muted"
        >
          Upload your CV once. MyCV Buddy rewrites it for every job you apply
          to — matched to the role, readable by any ATS, still unmistakably
          you.
        </p>

        <div ref={ctaRef} className="mt-10 flex flex-wrap gap-4">
          <MagneticButton href="/signup" variant="primary">
            Tailor my CV
          </MagneticButton>
          <MagneticButton href="#how-it-works" variant="secondary">
            See how it works
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
