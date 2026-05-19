import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <div className="bg-transparent">
      <Container className="py-14 sm:py-16">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Page not found
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/70">
            The page you’re looking for doesn’t exist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold hover:opacity-95"
            >
              Go home
            </Link>
            <Link
              href="/contact"
              className="btn-secondary inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
