import Link from "next/link";

import { Container } from "@/components/Container";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur">
      <Container className="py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-serif text-lg font-semibold tracking-tight text-white">
              <span className="bg-gradient-to-br from-white via-white to-[var(--accent-2)] bg-clip-text text-transparent">
                {site.name}
              </span>
            </div>
            <div className="mt-2 text-sm text-white/70">{site.role}</div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              CV (coming soon)
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 text-xs text-white/55">
          © {new Date().getFullYear()} {site.name}
        </div>
      </Container>
    </footer>
  );
}
