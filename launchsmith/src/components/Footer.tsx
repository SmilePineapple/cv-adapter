import Link from "next/link";

import { Container } from "@/components/Container";
import { navItems, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container className="py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight text-zinc-950">
              {site.name}
            </div>
            <div className="mt-1 text-sm text-zinc-600">{site.role}</div>
            <div className="mt-2 text-sm text-zinc-500">CV (coming soon)</div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 hover:text-zinc-950"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} {site.name}
        </div>
      </Container>
    </footer>
  );
}

