import {
  printBase,
  SECTION_LABELS,
  escapeHtml,
  splitSections,
  renderSectionBody,
  type FillScale,
  type TemplateSection,
} from "./shared";

const SIDEBAR_TYPES = new Set([
  "skills",
  "certifications",
  "hobbies",
  "groups",
  "strengths",
]);

// A real fraction of CVs have none of skills/certifications/hobbies/
// groups/strengths as their own section (skills folded into summary, no
// certifications, etc.) — rendering an empty 30%-wide sidebar in that case
// wastes horizontal space. cv-fill.ts needs to know this up front (without
// a browser render) to decide whether to run the two-column-aware
// balanced fill search or the single-column one.
export function classifyForTwoColumn(sections: TemplateSection[]): {
  hasTwoColumns: boolean;
} {
  const { rest } = splitSections(sections);
  const hasSidebar = rest.some((s) => SIDEBAR_TYPES.has(s.type));
  const hasMain = rest.some((s) => !SIDEBAR_TYPES.has(s.type));
  return { hasTwoColumns: hasSidebar && hasMain };
}

function cssVars(scale: FillScale): string {
  const { font = 1, space = 1, line = 1 } = scale;
  return `--font-scale: ${font}; --space-scale: ${space}; --line-scale: ${line};`;
}

// Sidebar + main content. Deliberately built with CSS floats, not
// flex/grid: Chromium's print engine doesn't fragment flex/grid children
// across page breaks, but floated columns reflow correctly onto
// subsequent pages. Good for content-dense CVs that benefit from a denser
// layout than a single column.
//
// mainScale/sidebarScale are independent: a floated column's height
// depends only on its own content and its own scale, not the other
// column's — so cv-fill.ts can fill a sparse main column to match a
// content-dense sidebar (or vice versa) without one column's fill amount
// affecting the other's layout, which is exactly the "one column looks
// empty next to a full one" case a single page-wide scale can't fix.
export function renderTwoColumn(
  sections: TemplateSection[],
  mainScale: FillScale = {},
  sidebarScale: FillScale = mainScale
): string {
  const { name, contact, rest } = splitSections(sections);
  const sidebar = rest.filter((s) => SIDEBAR_TYPES.has(s.type));
  const main = rest.filter((s) => !SIDEBAR_TYPES.has(s.type));
  const hasTwoColumns = sidebar.length > 0 && main.length > 0;

  const renderSection = (s: TemplateSection) => `
    <section class="cv-section">
      <h2>${SECTION_LABELS[s.type] || s.type}</h2>
      ${renderSectionBody(s)}
    </section>`;

  const columnsHtml = hasTwoColumns
    ? `<div class="wrap">
    <aside class="sidebar" style="${cssVars(sidebarScale)}">
      ${sidebar.map(renderSection).join("\n")}
    </aside>
    <div class="main" style="${cssVars(mainScale)}">
      ${main.map(renderSection).join("\n")}
    </div>
  </div>`
    : `<div class="main main--full" style="${cssVars(mainScale)}">
      ${rest.map(renderSection).join("\n")}
    </div>`;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  ${printBase()}
  body {
    font-family: Arial, Helvetica, sans-serif;
    color: #1c1c1c;
    font-size: calc(10pt * var(--font-scale));
    line-height: calc(1.5 * var(--line-scale));
  }
  .wrap::after { content: ""; display: table; clear: both; }
  header {
    background: #17181c;
    color: #fff;
    padding: 18px 20px;
    margin-bottom: 18px;
  }
  h1 { font-size: 20pt; margin: 0 0 4px; font-weight: 700; }
  .contact { font-size: 9pt; color: #cfd0d4; }
  .sidebar {
    float: left;
    width: 30%;
    box-sizing: border-box;
    padding-right: 16px;
  }
  .main {
    float: left;
    width: 70%;
    box-sizing: border-box;
    padding-left: 16px;
  }
  .cv-section { margin-bottom: calc(14px * var(--space-scale)); }
  .sidebar h2 {
    font-size: calc(8.5pt * var(--font-scale));
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #e35d3a;
    margin: 0 0 calc(5px * var(--space-scale));
    font-weight: 700;
  }
  .main h2 {
    font-size: calc(9.5pt * var(--font-scale));
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: #17181c;
    border-bottom: 2px solid #e35d3a;
    padding-bottom: 3px;
    margin: 0 0 calc(6px * var(--space-scale));
    font-weight: 700;
  }
  p, .entry { margin: 0; white-space: pre-wrap; }
  .sidebar p, .sidebar .entry { font-size: calc(9pt * var(--font-scale)); }
  .main--full { float: none; width: 100%; padding-left: 0; }
</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(name)}</h1>
    <div class="contact">${escapeHtml(contact)}</div>
  </header>
  ${columnsHtml}
</body>
</html>`;
}
