"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navItems, site } from "@/lib/site";
import { Container } from "@/components/Container";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-white"
        >
          <span className="bg-gradient-to-br from-white via-white to-[var(--accent-2)] bg-clip-text text-transparent">
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
                  ? "text-white underline decoration-[var(--accent-2)] decoration-2 underline-offset-8"
                  : "text-white/70 hover:text-white",
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
