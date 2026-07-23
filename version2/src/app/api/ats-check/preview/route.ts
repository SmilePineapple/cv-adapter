import { NextRequest, NextResponse } from "next/server";
import { checkAndConsumeAnonLimit, getClientIp } from "@/lib/anon-rate-limit";
import { previewTailoredLine } from "@/lib/ats-preview";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const cvText = typeof body?.cvText === "string" ? body.cvText.trim() : "";
  const jobDescription =
    typeof body?.jobDescription === "string" ? body.jobDescription.trim() : "";
  const missingKeywords = Array.isArray(body?.missingKeywords)
    ? body.missingKeywords.filter((k: unknown) => typeof k === "string")
    : [];

  if (!cvText || !jobDescription) {
    return NextResponse.json(
      { error: "Paste both your CV text and the job description." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const { allowed } = await checkAndConsumeAnonLimit(ip);

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          "You've used today's free previews. Sign up free for unlimited tailored CVs.",
        limitReached: true,
      },
      { status: 429 }
    );
  }

  try {
    const preview = await previewTailoredLine(cvText, jobDescription, missingKeywords);
    return NextResponse.json(preview);
  } catch (err) {
    console.error("ATS preview generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate a preview. Please try again." },
      { status: 500 }
    );
  }
}
