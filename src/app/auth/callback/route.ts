import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseRouteClient } from '@/lib/supabase-server'
import { createAdminClient } from '@/lib/supabase-admin'

// New sign-ups are paused (see /auth/signup) - but OAuth sign-in silently
// creates a brand-new account on first use, and the "Continue with
// Google" button also lives on the login page, not just signup. Blocking
// only the signup page's form leaves that OAuth path wide open. A user
// account created in the last minute by this very request is, for all
// practical purposes, a new signup - not someone signing back in - so
// reject it here and undo the account creation rather than only
// signup-block the button that no longer exists.
const NEW_ACCOUNT_WINDOW_MS = 60_000

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createSupabaseRouteClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const isBrandNew = Date.now() - new Date(user.created_at).getTime() < NEW_ACCOUNT_WINDOW_MS
      if (isBrandNew) {
        // Signing out alone isn't enough - the account itself now exists,
        // so a second attempt a minute later would no longer look "brand
        // new" and would sail through. Delete the account OAuth just
        // created rather than leave an orphaned, policy-violating record
        // that can be used to bypass this on retry.
        await supabase.auth.signOut()
        try {
          await createAdminClient().auth.admin.deleteUser(user.id)
        } catch (err) {
          console.error('Failed to delete blocked new OAuth signup:', err)
        }
        return NextResponse.redirect(new URL('/auth/signup', requestUrl.origin))
      }
    }
  }

  // Redirect to dashboard after successful auth
  // OAuth metadata will be applied client-side in dashboard
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
