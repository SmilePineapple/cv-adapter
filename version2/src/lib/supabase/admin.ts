import { createClient } from "@supabase/supabase-js";

// Service-role client, bypasses RLS. A few tables reused from legacy-v1's
// schema (skill_assessment_questions, skill_assessment_results) only have
// RLS policies allowing backend/service writes, not the requesting user's
// own session — confirmed directly (inserting as a normal authenticated
// user throws 42501 "new row violates row-level security policy"). Use
// only after the caller has already verified the user owns whatever
// parent row (assessment, generation, etc.) is being written against.
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
