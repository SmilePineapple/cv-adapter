"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems, site } from "@/lib/site";
import { Container } from "@/components/Container";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-zinc-950"
        >
          {site.name}
        </Link>
        <nav className="hidden items-center gap-7 sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={[
                "text-xs font-semibold uppercase tracking-[0.16em]",
                pathname === item.href
                  ? "text-zinc-950 underline decoration-[var(--accent)] decoration-2 underline-offset-8"
                  : "text-zinc-600 hover:text-zinc-950",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:opacity-95"
        >
          Contact
        </Link>
      </Container>
    </header>
  );
}
