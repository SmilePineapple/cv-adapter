import {
  printBase,
  SECTION_LABELS,
  escapeHtml,
  splitSections,
  renderSectionBody,
  A4_CONTENT_HEIGHT_PX,
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

// Each column is independently floated, so a column that maxed out its
// fill search (see FillScale.center's doc comment) needs its own
// vertical-centering styles applied directly to it - unlike the
// single-column templates, there's no shared page-level flex wrapper that
// could center both columns at once, since one column can be fine while
// the other is genuinely sparse.
//
// No explicit height here - `.wrap` becomes a flex row when centering is
// active (see below), and the default `align-items: stretch` already
// gives each column the container's full height; an explicit
// `height: 100%` here was tried first and confirmed NOT to resolve
// reliably against a flex-row ancestor's computed height in Chromium
// (measured directly: column stayed at its shrink-to-fit content height
// instead of stretching), so this relies on stretch instead of fighting
// it with an explicit value.
function cssVars(scale: FillScale): string {
  const { font = 1, space = 1, line = 1, center = false } = scale;
  const vars = `--font-scale: ${font}; --space-scale: ${space}; --line-scale: ${line};`;
  const centering = center
    ? ` display: flex; flex-direction: column; justify-content: center;`
    : "";
  return vars + centering;
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
  const anyCenter = Boolean(mainScale.center || sidebarScale.center);

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
  ${
    anyCenter
      ? `/* Gives .wrap/.main--full a definite height equal to whatever's
           left under the header (not a full page). Floated children don't
           reliably resolve height:100% against a merely flex-stretched
           block ancestor (confirmed directly - they kept their natural
           content height instead) - .wrap itself becomes a flex row here,
           making .sidebar/.main genuine flex items that stretch to fill
           it via the default align-items:stretch, same effect as their
           height:100% but actually resolves. Only reachable when content
           is confirmed single-page (see FillScale.center's doc comment),
           so this never has to fragment across a page break the way
           dense multi-page two-column content relies on floats for. */
         body { display: flex; flex-direction: column; min-height: ${A4_CONTENT_HEIGHT_PX}px; }
         body > .wrap, body > .main--full { flex: 1 0 auto; }
         .wrap { display: flex; }`
      : ""
  }
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
