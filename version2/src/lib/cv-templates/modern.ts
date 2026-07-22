import {
  printBase,
  SECTION_LABELS,
  escapeHtml,
  splitSections,
  renderSectionBody,
  type FillScale,
  type TemplateSection,
} from "./shared";

// Clean sans-serif, single column, coral header band + teal secondary
// accent. Good default for tech/creative/marketing roles — more visual
// than Classic without sacrificing ATS-parseable structure (still plain
// text flow, no tables, no columns - the header band and section markers
// are decorative CSS, not images, so text extraction is unaffected).
export function renderModern(sections: TemplateSection[], scale: FillScale = {}): string {
  const { name, contact, rest } = splitSections(sections);

  // A colored left border on the section itself, not a separate flex
  // sibling - Chromium's print engine never fragments a flex container
  // across a page break regardless of break-inside, which would silently
  // undo shared.ts's section-flow fix for this template specifically. A
  // bordered block element fragments normally.
  const body = rest
    .map(
      (s, i) => `
        <section class="cv-section ${i % 2 === 0 ? "cv-section--accent" : "cv-section--secondary"}">
          <h2>${SECTION_LABELS[s.type] || s.type}</h2>
          ${renderSectionBody(s)}
        </section>`
    )
    .join("\n");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  ${printBase(scale)}
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #1c1c1c;
    font-size: calc(10.5pt * var(--font-scale));
    line-height: calc(1.55 * var(--line-scale));
  }
  header {
    background: linear-gradient(120deg, #e35d3a 0%, #d6482e 100%);
    color: #fff;
    padding: calc(20px * var(--space-scale)) 22px;
    margin-bottom: calc(22px * var(--space-scale));
    border-radius: 8px;
    border-bottom: 4px solid #1c6e6e;
  }
  h1 {
    font-size: calc(25pt * var(--font-scale));
    margin: 0 0 6px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .contact {
    font-size: calc(9.5pt * var(--font-scale));
    color: rgba(255, 255, 255, 0.9);
  }
  .cv-section {
    border-left: 4px solid #e35d3a;
    padding-left: 12px;
    margin-bottom: calc(16px * var(--space-scale));
  }
  .cv-section--accent { border-left-color: #e35d3a; }
  .cv-section--secondary { border-left-color: #1c6e6e; }
  h2 {
    font-size: calc(9.5pt * var(--font-scale));
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #1c1c1c;
    margin: 0 0 calc(6px * var(--space-scale));
    font-weight: 700;
  }
  p, .entry { margin: 0; white-space: pre-wrap; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(name)}</h1>
    <div class="contact">${escapeHtml(contact)}</div>
  </header>
  <div class="content">${body}</div>
</body>
</html>`;
}
