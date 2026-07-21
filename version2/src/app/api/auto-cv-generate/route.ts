import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCVFromBackground } from "@/lib/cv-generate";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const contact = String(body.contact || "").trim();
  const background = String(body.background || "").trim();

  if (!name || !contact || !background) {
    return NextResponse.json(
      { error: "Name, contact details, and your background are required." },
      { status: 400 }
    );
  }

  if (background.length < 50) {
    return NextResponse.json(
      { error: "Please add a bit more detail about your background." },
      { status: 400 }
    );
  }

  let sections;
  try {
    sections = await generateCVFromBackground(name, contact, background);
  } catch (err) {
    console.error("Auto-CV generation failed:", err);
    return NextResponse.json({ error: "Failed to generate CV." }, { status: 500 });
  }

  const { data: cv, error: dbError } = await supabase
    .from("cvs")
    .insert({
      user_id: user.id,
      original_text: background,
      parsed_sections: { sections },
      file_meta: { name: `${name} — AI-generated CV`, source: "auto-cv" },
    })
    .select("id")
    .single();

  if (dbError) {
    return NextResponse.json(
      { error: "Failed to save CV: " + dbError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: cv.id });
}
