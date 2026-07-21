import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import type { TemplateSection } from "./cv-templates/shared";
import { normalizeSectionContent } from "./cv-content-normalize";

const LABELS: Record<string, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  hobbies: "Hobbies & Interests",
  groups: "Groups & Memberships",
  strengths: "Strengths",
  additional: "Additional Information",
};

export async function renderTextToDocx(content: string): Promise<Buffer> {
  const paragraphs = content
    .split("\n")
    .map((line) => new Paragraph({ text: line, spacing: { after: 160 } }));

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  return Packer.toBuffer(doc);
}

export async function renderSectionsToDocx(
  sections: TemplateSection[]
): Promise<Buffer> {
  // Same defensive normalization as cv-templates/shared.ts's splitSections
  // - historical generations can have non-string content in the DB
  // (confirmed against production data), which would otherwise crash
  // section.content.split() below outright.
  const normalizedSections = sections.map((s) => ({
    ...s,
    content: normalizeSectionContent(s.content),
  }));
  const sorted = [...normalizedSections].sort((a, b) => a.order - b.order);
  const name = sorted.find((s) => s.type === "name")?.content || "";
  const contact = sorted.find((s) => s.type === "contact")?.content || "";
  const rest = sorted.filter((s) => s.type !== "name" && s.type !== "contact");

  const children: Paragraph[] = [
    new Paragraph({
      text: name,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [new TextRun({ text: contact, color: "444444", size: 20 })],
      spacing: { after: 300 },
    }),
  ];

  for (const section of rest) {
    children.push(
      new Paragraph({
        text: LABELS[section.type] || section.type,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 },
      })
    );
    for (const line of section.content.split("\n")) {
      if (line.trim()) {
        children.push(new Paragraph({ text: line, spacing: { after: 80 } }));
      }
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(doc);
}
