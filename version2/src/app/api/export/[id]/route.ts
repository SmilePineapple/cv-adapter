import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TemplateSection } from "@/lib/cv-templates";
import { renderFilledTemplatePdf } from "@/lib/cv-fill";
import { renderSectionsToDocx } from "@/lib/docx-render";
import { isProUser } from "@/lib/subscription";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const format = request.nextUrl.searchParams.get("format") === "docx"
    ? "docx"
    : "pdf";
  const templateId = request.nextUrl.searchParams.get("template") || "classic";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: generation, error } = await supabase
    .from("generations")
    .select("id, job_title, output_sections")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !generation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sections = (
    generation.output_sections as { sections: TemplateSection[] }
  ).sections;

  const baseName = `CV-${(generation.job_title || "tailored").replace(/[^a-z0-9]+/gi, "-")}`;

  if (format === "docx") {
    if (!(await isProUser(supabase, user.id))) {
      return NextResponse.json(
        {
          error: "DOCX export is a Pro feature. Upgrade to download as DOCX, or export as PDF for free.",
          upgradeRequired: true,
        },
        { status: 402 }
      );
    }

    let docx: Buffer;
    try {
      docx = await renderSectionsToDocx(sections);
    } catch (err) {
      console.error("DOCX render failed:", err);
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

  let pdf: Buffer;
  try {
    pdf = await renderFilledTemplatePdf(templateId, sections);
  } catch (err) {
    console.error("PDF render failed:", err);
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
