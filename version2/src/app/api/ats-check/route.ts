import { NextRequest, NextResponse } from "next/server";
import { scoreAgainstJob } from "@/lib/ats-score";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const cvText = typeof body?.cvText === "string" ? body.cvText.trim() : "";
  const jobDescription =
    typeof body?.jobDescription === "string" ? body.jobDescription.trim() : "";

  if (!cvText || !jobDescription) {
    return NextResponse.json(
      { error: "Paste both your CV text and the job description." },
      { status: 400 }
    );
  }

  const result = scoreAgainstJob(cvText.slice(0, 20000), jobDescription.slice(0, 10000));
  return NextResponse.json(result);
}
