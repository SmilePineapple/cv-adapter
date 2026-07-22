"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Tools", href: "#tools" },
  { label: "Pricing", href: "#pricing" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg tracking-tight">
          mycv<span className="text-accent">buddy</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Link href="/ats-checker" className="transition-colors hover:text-foreground">
            ATS Checker
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
          >
            Sign in
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border sm:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-border/60 bg-background px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-4 text-sm text-muted">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="min-h-[44px] py-2 transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/ats-checker"
              onClick={() => setOpen(false)}
              className="min-h-[44px] py-2 transition-colors hover:text-foreground"
            >
              ATS Checker
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
