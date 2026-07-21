import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetterHtml } from "@/lib/cover-letter-template";
import { renderHtmlToPdf } from "@/lib/pdf-render";
import { renderTextToDocx } from "@/lib/docx-render";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const format =
    request.nextUrl.searchParams.get("format") === "docx" ? "docx" : "pdf";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: coverLetter, error } = await supabase
    .from("cover_letters")
    .select("id, content, job_title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !coverLetter) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const baseName = `Cover-Letter-${(coverLetter.job_title || "role").replace(/[^a-z0-9]+/gi, "-")}`;

  if (format === "docx") {
    let docx: Buffer;
    try {
      docx = await renderTextToDocx(coverLetter.content);
    } catch (err) {
      console.error("Cover letter DOCX render failed:", err);
      return NextResponse.json(
        { error: "Failed to generate DOCX." },
        { status: 500 }
      );
    }
    return new NextResponse(new Uint8Array(docx), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${baseName}.docx"`,
      },
    });
  }

  const html = generateCoverLetterHtml(coverLetter.content);
  let pdf: Buffer;
  try {
    pdf = await renderHtmlToPdf(html);
  } catch (err) {
    console.error("Cover letter PDF render failed:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF." },
      { status: 500 }
    );
  }

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}.pdf"`,
    },
  });
}
