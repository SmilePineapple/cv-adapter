import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roastCV, type RoastLevel, type RoastStyle } from "@/lib/cv-roast";
import { requireProGate } from "@/lib/subscription";
import type { CVSection } from "@/lib/cv-parsing";

export const runtime = "nodejs";
export const maxDuration = 60;

const LEVELS: RoastLevel[] = ["mild", "medium", "brutal"];
const STYLES: RoastStyle[] = ["funny", "sarcastic", "professional", "savage"];

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gate = await requireProGate(supabase, user.id);
  if (gate) return gate;

  const body = await request.json();
  const cvId = String(body.cvId || "");
  const level = LEVELS.includes(body.level) ? (body.level as RoastLevel) : "medium";
  const style = STYLES.includes(body.style) ? (body.style as RoastStyle) : "funny";

  if (!cvId) {
    return NextResponse.json({ error: "cvId is required." }, { status: 400 });
  }

  const { data: cv, error } = await supabase
    .from("cvs")
    .select("id, parsed_sections")
    .eq("id", cvId)
    .eq("user_id", user.id)
    .single();

  if (error || !cv) {
    return NextResponse.json({ error: "CV not found." }, { status: 404 });
  }

  const sections = (cv.parsed_sections as { sections: CVSection[] }).sections;

  try {
    const roast = await roastCV(sections, level, style);
    return NextResponse.json({ roast });
  } catch (err) {
    console.error("Roast failed:", err);
    return NextResponse.json({ error: "Failed to roast CV." }, { status: 500 });
  }
}
