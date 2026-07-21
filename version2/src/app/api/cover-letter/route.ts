import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetter } from "@/lib/cover-letter";
import type { CVSection } from "@/lib/cv-parsing";

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
  const generationId = String(body.generationId || "");
  const companyName = body.companyName ? String(body.companyName) : undefined;
  const hiringManagerName = body.hiringManagerName
    ? String(body.hiringManagerName)
    : undefined;

  if (!generationId) {
    return NextResponse.json(
      { error: "generationId is required." },
      { status: 400 }
    );
  }

  const { data: generation, error: genError } = await supabase
    .from("generations")
    .select("id, job_title, job_description, output_sections")
    .eq("id", generationId)
    .eq("user_id", user.id)
    .single();

  if (genError || !generation) {
    return NextResponse.json({ error: "Generation not found." }, { status: 404 });
  }

  const sections = (
    generation.output_sections as { sections: CVSection[] }
  ).sections;

  let content: string;
  try {
    content = await generateCoverLetter(
      sections,
      generation.job_title,
      generation.job_description,
      companyName,
      hiringManagerName
    );
  } catch (err) {
    console.error("Cover letter generation failed:", err);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }

  const { data: coverLetter, error: insertError } = await supabase
    .from("cover_letters")
    .insert({
      user_id: user.id,
      generation_id: generation.id,
      content,
      job_title: generation.job_title,
      company_name: companyName,
      hiring_manager_name: hiringManagerName,
    })
    .select("id")
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save cover letter: " + insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: coverLetter.id });
}
