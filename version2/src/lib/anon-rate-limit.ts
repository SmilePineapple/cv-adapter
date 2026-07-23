import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const ANON_PREVIEW_DAILY_LIMIT = 5;
const WINDOW_SECONDS = 24 * 60 * 60;

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

// Reuses the `rate_limits` table + `upsert_rate_limit` RPC already live in
// this Supabase project (confirmed directly against the DB - both exist,
// carried over from legacy-v1's src/lib/rate-limit-simple.ts, which this
// mirrors). No new table/migration needed. The RPC does an atomic
// upsert-and-increment server-side, avoiding the read-then-write race a
// hand-rolled check-then-upsert would have. Namespaced with an
// "ats-preview:" prefix on the identifier since this table may be shared
// with other rate-limited endpoints. sha256-hashes the IP rather than
// storing it raw (UK/GDPR-facing product). Fails open on any DB error -
// a rate-limiter outage should never block the free tool itself.
export async function checkAndConsumeAnonLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const identifier = `ats-preview:${hashIp(ip)}`;
  const resetAt = new Date(Date.now() + WINDOW_SECONDS * 1000).toISOString();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("upsert_rate_limit", {
      p_identifier: identifier,
      p_limit: ANON_PREVIEW_DAILY_LIMIT,
      p_window_seconds: WINDOW_SECONDS,
      p_reset_at: resetAt,
    });

    if (error) {
      console.error("Anon rate limit check failed, allowing through:", error.message);
      return { allowed: true, remaining: ANON_PREVIEW_DAILY_LIMIT - 1 };
    }

    const { count } = data as { count: number };
    if (count > ANON_PREVIEW_DAILY_LIMIT) {
      return { allowed: false, remaining: 0 };
    }
    return { allowed: true, remaining: Math.max(0, ANON_PREVIEW_DAILY_LIMIT - count) };
  } catch (err) {
    console.error("Anon rate limit check errored, allowing through:", err);
    return { allowed: true, remaining: ANON_PREVIEW_DAILY_LIMIT - 1 };
  }
}

// Vercel sets x-forwarded-for on every request; take the first (client)
// address in the comma-separated chain. Falls back to a constant when
// absent (local dev without a proxy) so the endpoint still works, at the
// cost of every local request sharing one bucket - fine outside production.
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
