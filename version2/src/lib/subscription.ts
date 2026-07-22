import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export const PRO_FEATURE_MESSAGE =
  "This is a Pro feature. Upgrade for £2.99/month to unlock it.";

// Shared guard for the 6 Pro-only tools (Fix My CV, Roast My CV, Interview
// Prep/Simulator, Skills Assessment, Career Coach). Returns a 402 response
// to short-circuit the route, or null to let the caller proceed.
export async function requireProGate(
  supabase: SupabaseClient,
  userId: string
): Promise<NextResponse | null> {
  const pro = await isProUser(supabase, userId);
  if (pro) return null;

  return NextResponse.json(
    { error: PRO_FEATURE_MESSAGE, upgradeRequired: true },
    { status: 402 }
  );
}

// Free tier: this many tailored-CV generations per calendar month, PDF
// export only. Pro (£2.99/mo): unlimited generations, PDF+DOCX export,
// and access to Fix My CV, Roast My CV, Interview Prep/Simulator, Skills
// Assessment, and Career Coach.
export const FREE_MONTHLY_GENERATION_LIMIT = 1;

export type UsageRow = {
  user_id: string;
  current_month: string;
  generation_count: number;
  subscription_tier: string;
};

// `subscriptions` (written by the Stripe webhook — the source of truth for
// whether someone is actually paying) allows direct user-session reads
// under RLS (confirmed directly, unlike skill_assessment_*). Status
// 'active' or 'trialing' counts as Pro; anything else (past_due, canceled,
// incomplete, or no row at all) is free.
export async function isProUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .single();

  return data?.status === "active" || data?.status === "trialing";
}

function currentMonthStart(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

// A row is auto-created per user by an existing DB trigger (confirmed
// directly — inserting one manually for a fresh signup throws a duplicate
// key error), so this only ever needs to read/update, never insert.
export async function checkAndConsumeGeneration(
  supabase: SupabaseClient,
  userId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const pro = await isProUser(supabase, userId);
  if (pro) return { allowed: true, remaining: Infinity };

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("generation_count, current_month")
    .eq("user_id", userId)
    .single();

  const thisMonth = currentMonthStart();
  const count =
    usage && usage.current_month === thisMonth ? usage.generation_count : 0;

  if (count >= FREE_MONTHLY_GENERATION_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await supabase
    .from("usage_tracking")
    .update({
      generation_count: count + 1,
      current_month: thisMonth,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return { allowed: true, remaining: FREE_MONTHLY_GENERATION_LIMIT - (count + 1) };
}

// Read-only version of the same month/count logic in checkAndConsumeGeneration,
// for pages that need to *display* usage (dashboard, billing, the
// post-generation result page) without consuming a generation. Kept as a
// separate function rather than reusing checkAndConsumeGeneration with a
// "dry run" flag - that function's whole job is the atomic check-and-increment,
// mixing a read-only path into it risks the increment accidentally firing
// on a page load instead of an actual generation.
export async function getFreeUsageStatus(
  supabase: SupabaseClient,
  userId: string
): Promise<{ pro: boolean; generationsUsed: number; remaining: number }> {
  const pro = await isProUser(supabase, userId);
  if (pro) {
    return { pro: true, generationsUsed: 0, remaining: Infinity };
  }

  const { data: usage } = await supabase
    .from("usage_tracking")
    .select("generation_count, current_month")
    .eq("user_id", userId)
    .single();

  const thisMonth = currentMonthStart();
  const generationsUsed =
    usage && usage.current_month === thisMonth ? usage.generation_count : 0;

  return {
    pro: false,
    generationsUsed,
    remaining: Math.max(0, FREE_MONTHLY_GENERATION_LIMIT - generationsUsed),
  };
}
