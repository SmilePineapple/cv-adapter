"use client";

import { useForm, ValidationError } from "@formspree/react";

export default function ContactForm() {
  const [state, handleSubmit] = useForm("mrenqvov");

  if (state.succeeded) {
    return (
      <div className="rounded-2xl border border-accent/40 bg-surface p-6 text-center">
        <p className="font-medium">Message sent — thanks.</p>
        <p className="mt-1 text-sm text-muted">
          We typically reply within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent"
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
          className="mt-1.5 text-xs text-red-400"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Questions, bug reports, feedback, or a data-deletion request..."
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1.5 text-xs text-red-400"
        />
      </div>

      <ValidationError
        errors={state.errors}
        className="text-sm text-red-400"
      />

      <button
        type="submit"
        disabled={state.submitting}
        className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.submitting ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
