/**
 * Centralized admin-email allowlist.
 *
 * Previously every route under `src/app/api/admin/**` hardcoded its own
 * literal `ADMIN_EMAILS` array (or, in a handful of email-campaign routes,
 * a hardcoded `ADMIN_USER_ID`). Those lists had drifted from each other
 * (some had 1 email, others had 3), so access differed route-to-route.
 * This reads a single source of truth from the `ADMIN_EMAILS` env var.
 *
 * Format: comma-separated string, e.g. `ADMIN_EMAILS="a@x.com,b@y.com"`
 * (matches the existing `.env.local` convention).
 *
 * Fails closed: if the env var is unset/empty, no email is treated as an
 * admin (never "allow everyone").
 */

function getAdminEmailSet(): Set<string> {
  const raw = process.env.ADMIN_EMAILS || ''

  return new Set(
    raw
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

/**
 * Returns true if the given email belongs to an admin, per the
 * `ADMIN_EMAILS` env var. Case-insensitive. Fails closed on
 * null/undefined/empty input or an unset env var.
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return getAdminEmailSet().has(email.trim().toLowerCase())
}

/** The current admin email allowlist (lowercased), for routes that need to filter/list admins. */
export function getAdminEmails(): string[] {
  return Array.from(getAdminEmailSet())
}
