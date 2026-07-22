import { normalizeSectionContent } from "../cv-content-normalize";

export type TemplateSection = {
  type: string;
  content: string;
  order: number;
};

export const SECTION_LABELS: Record<string, string> = {
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

export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function nl2br(text: string) {
  return escapeHtml(text).replace(/\n/g, "<br/>");
}

// experience/education commonly hold several distinct entries (jobs,
// degrees) inside one content string, blank-line separated. Splitting them
// into their own blocks lets pagination break *between* entries instead of
// being forced to treat the whole section as one atomic unit (see
// renderSectionBody's comment for why that matters).
const MULTI_ENTRY_TYPES = new Set(["experience", "education"]);

// Renders a section's body, splitting multi-entry sections (experience,
// education) into individually-protected blocks.
//
// Previously every section was one <p> wrapped in a `.cv-section` that had
// `break-inside: avoid` — fine for a short paragraph, but for something
// like Experience (several jobs, each with its own bullets) it meant the
// entire section had to fit in whatever page space was left or the browser
// would push the *whole thing* to the next page, stranding a gap behind it
// (confirmed directly: a CV with 4 jobs produced 3 pages, each mostly
// empty, because Experience alone didn't fit after Summary, then Skills
// alone didn't fit after Education, etc.). Splitting multi-entry sections
// into per-entry blocks — each individually protected from splitting
// mid-entry, but free to flow onto the next page between entries — lets
// the browser use the actual remaining space on each page instead of
// bailing out to a fresh one.
export function renderSectionBody(section: TemplateSection): string {
  if (!MULTI_ENTRY_TYPES.has(section.type)) {
    return `<p>${nl2br(section.content)}</p>`;
  }
  const entries = section.content
    .split(/\n\s*\n/)
    .map((e) => e.trim())
    .filter(Boolean);
  if (entries.length <= 1) {
    return `<p>${nl2br(section.content)}</p>`;
  }
  return entries.map((e) => `<div class="entry">${nl2br(e)}</div>`).join("");
}

export function splitSections(sections: TemplateSection[]) {
  // Historical generations (predating normalizeSectionContent's addition
  // at every write path) can still have non-string content sitting in the
  // DB — confirmed directly against production data, not hypothetical.
  // Normalizing once here, at the single choke point every template
  // renderer goes through, means nl2br()/escapeHtml() downstream never
  // has to worry about it (they'd throw outright on a non-string, since
  // String.prototype.replace doesn't exist on an object).
  const normalized = sections.map((s) => ({
    ...s,
    content: normalizeSectionContent(s.content),
  }));
  const sorted = [...normalized].sort((a, b) => a.order - b.order);
  const name = sorted.find((s) => s.type === "name")?.content || "";
  const contact = sorted.find((s) => s.type === "contact")?.content || "";
  // A CV commonly has an "additional"/optional section type present with
  // genuinely nothing in it (the AI leaves it blank rather than omitting
  // it outright). Rendering that as a heading with an empty paragraph
  // underneath produces a section header floating over dead white space
  // for no reason - drop it before it ever reaches a template.
  const rest = sorted.filter(
    (s) => s.type !== "name" && s.type !== "contact" && s.content.trim().length > 0
  );
  return { name, contact, rest };
}

export type FillScale = {
  font?: number;
  space?: number;
  line?: number;
  // Set when cv-fill.ts's bisection search hit its max fill amount and
  // still couldn't bring content up to target page occupancy (a sidebar
  // with just one short skills list, or a whole CV with barely any
  // content) - font/line/spacing scaling alone can't stretch three lines
  // of text to fill an A4 page without looking absurd. Vertically
  // centering the content block within the page reads as a deliberate,
  // balanced layout instead of "page trails off into empty space at the
  // bottom", which font/space/line scaling was already maxed out trying
  // (and failing) to fix.
  center?: boolean;
};

// One page's usable content height in px - same A4-minus-margins math
// cv-fill.ts uses to measure/target fill, kept here so the "center when
// maxed out" CSS and the measurement math never drift apart.
const A4_HEIGHT_MM = 297;
const MARGIN_TOP_BOTTOM_MM = 16;
const MM_TO_PX = 96 / 25.4;
export const A4_CONTENT_HEIGHT_PX =
  (A4_HEIGHT_MM - 2 * MARGIN_TOP_BOTTOM_MM) * MM_TO_PX;

// Emitted after a template's own body{} rule when scale.center is set, so
// its min-height/display:flex wins over the earlier declarations without
// needing !important. The header stays pinned at its natural top position
// (it's the first flex child); only `.content` (the second child, wrapping
// every section) gets flex:1 + justify-content:center, so it centers
// within whatever space is left under the header rather than moving the
// header itself away from the top.
export function centerModeStyle(center: boolean | undefined): string {
  if (!center) return "";
  return `
  body { display: flex; flex-direction: column; min-height: ${A4_CONTENT_HEIGHT_PX}px; }
  body > .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
`;
}

// Every template shares this print setup: fixed A4 page size, no forced page
// count. Content flows onto as many pages as it naturally needs — no
// character-budget targeting, no filler content. Two-column layouts use
// CSS floats (not flex/grid): Chromium's print engine doesn't fragment
// flex/grid children cleanly across page breaks, but floats paginate fine.
//
// Three independent scale dials fill a page that would otherwise leave a
// lot of empty space below short content (see cv-fill.ts, which measures
// actual rendered height and searches for values that fill the page
// without changing page count). Deliberately split rather than one
// uniform multiplier: pumping font-size alone to fill genuinely sparse
// content requires unnaturally huge text, whereas real CVs read fine with
// generous whitespace and slightly larger type — so `space` (section
// margins/padding) and `line` (line-height) get a much higher ceiling
// than `font` (font-size) in cv-fill.ts's search range. Page margins
// themselves never scale; only what's inside the content box does.
export function printBase(scale: FillScale = {}): string {
  const { font = 1, space = 1, line = 1 } = scale;
  return `
  :root { --font-scale: ${font}; --space-scale: ${space}; --line-scale: ${line}; }
  @page { size: A4; margin: 16mm 18mm; }
  * { box-sizing: border-box; }
  body { margin: 0; }
  ${centerModeStyle(scale.center)}
  /* A section's own content is allowed to flow/split across a page
     boundary (a paragraph breaking mid-sentence onto the next page reads
     fine, same as any normal document) - what must NOT happen is a
     heading left stranded alone at the bottom of a page with its content
     starting fresh on the next one, and a multi-entry section's own entry
     (one job, one degree) splitting in the middle of its bullets. */
  .cv-section { break-inside: auto; }
  .cv-section h2 { break-after: avoid-page; break-inside: avoid; }
  .cv-section .entry { break-inside: avoid; margin-bottom: calc(10px * var(--space-scale)); }
  .cv-section .entry:last-child { margin-bottom: 0; }
`;
}
