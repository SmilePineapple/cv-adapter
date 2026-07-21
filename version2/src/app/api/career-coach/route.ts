import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatWithCoach, type ChatMessage } from "@/lib/career-coach";
import { requireProGate } from "@/lib/subscription";
import type { CVSection } from "@/lib/cv-parsing";
import { normalizeSectionContent } from "@/lib/cv-content-normalize";

export const runtime = "nodejs";
export const maxDuration = 60;

function sectionsToText(sections: CVSection[]): string {
  // Historical sections can have non-string content in the DB - template
  // interpolation would silently stringify that to "[object Object]"
  // instead of throwing, feeding garbage into the coaching prompt.
  return sections
    .map((s) => `${s.type}: ${normalizeSectionContent(s.content)}`)
    .join("\n\n");
}

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
  const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
  const cvId = typeof body.cvId === "string" ? body.cvId : "";

  if (messages.length === 0) {
    return NextResponse.json({ error: "messages is required." }, { status: 400 });
  }

  let cvContext: string | undefined;
  if (cvId) {
    const { data: cv } = await supabase
      .from("cvs")
      .select("parsed_sections")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();

    if (cv) {
      const sections = (cv.parsed_sections as { sections: CVSection[] }).sections;
      cvContext = sectionsToText(sections);
    }
  }

  try {
    const reply = await chatWithCoach(messages, cvContext);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Career coach chat failed:", err);
    return NextResponse.json({ error: "Failed to get a reply." }, { status: 500 });
  }
}
