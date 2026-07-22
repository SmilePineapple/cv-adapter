import {
  printBase,
  SECTION_LABELS,
  escapeHtml,
  splitSections,
  renderSectionBody,
  type FillScale,
  type TemplateSection,
} from "./shared";

// Restrained serif, single column. The safest choice for ATS parsers and
// conservative industries (law, finance, academia) - so the color here
// stays as accent, never as a background behind body text (keeps contrast
// and copy-paste/parsing behavior identical to plain black-on-white).
export function renderClassic(sections: TemplateSection[], scale: FillScale = {}): string {
  const { name, contact, rest } = splitSections(sections);

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const body = rest
    .map(
      (s) => `
        <section class="cv-section">
          <h2><span class="mark"></span>${SECTION_LABELS[s.type] || s.type}</h2>
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
    font-family: Georgia, 'Times New Roman', serif;
    color: #1a1a1a;
    font-size: calc(10.5pt * var(--font-scale));
    line-height: calc(1.5 * var(--line-scale));
  }
  header {
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 3px solid #b5442e;
    padding-bottom: calc(12px * var(--space-scale));
    margin-bottom: calc(20px * var(--space-scale));
  }
  .monogram {
    flex: 0 0 auto;
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: #b5442e;
    color: #fff;
    font-family: Arial, sans-serif;
    font-weight: 700;
    font-size: 16pt;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h1 { font-size: calc(21pt * var(--font-scale)); margin: 0 0 4px; font-weight: 600; }
  .contact { font-size: calc(9.5pt * var(--font-scale)); color: #444; }
  .cv-section { margin-bottom: calc(15px * var(--space-scale)); }
  h2 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: calc(10pt * var(--font-scale));
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #7a2e1e;
    margin: 0 0 calc(6px * var(--space-scale));
    font-family: Arial, sans-serif;
  }
  .mark {
    display: inline-block;
    width: 9px;
    height: 9px;
    background: #b5442e;
    transform: rotate(45deg);
    flex: 0 0 auto;
  }
  p, .entry { margin: 0; white-space: pre-wrap; }
</style>
</head>
<body>
  <header>
    ${initials ? `<div class="monogram">${escapeHtml(initials)}</div>` : ""}
    <div>
      <h1>${escapeHtml(name)}</h1>
      <div class="contact">${escapeHtml(contact)}</div>
    </div>
  </header>
  <div class="content">${body}</div>
</body>
</html>`;
}
