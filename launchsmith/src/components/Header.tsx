"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems, site } from "@/lib/site";
import { Container } from "@/components/Container";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/65 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-zinc-950"
        >
          <span className="bg-gradient-to-br from-zinc-950 via-zinc-800 to-[var(--accent)] bg-clip-text text-transparent">
            {site.name}
          </span>
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
          className="btn-primary inline-flex h-10 items-center justify-center rounded-full px-4 text-xs font-semibold uppercase tracking-[0.14em] hover:opacity-95"
        >
          Contact
        </Link>
      </Container>
    </header>
  );
}
