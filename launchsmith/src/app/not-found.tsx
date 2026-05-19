import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <div className="bg-white">
      <Container className="py-14 sm:py-16">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Page not found
          </h1>
          <p className="mt-4 text-lg leading-8 text-zinc-600">
            The page you’re looking for doesn’t exist.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white hover:opacity-95"
            >
              Go home
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-950 hover:bg-zinc-50"
            >
              Contact
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

