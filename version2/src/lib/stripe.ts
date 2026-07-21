import Stripe from "stripe";

let client: Stripe | null = null;

// Lazy, matching openai.ts's pattern — avoids throwing at module load time
// (e.g. during build) when the env var isn't set yet.
export function getStripeClient(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set.");

  client = new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
  return client;
}

export const PRO_MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_ID_PRO_MONTHLY;
