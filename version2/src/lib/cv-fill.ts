import {
  renderTemplate,
  renderTwoColumn,
  classifyForTwoColumn,
  A4_CONTENT_HEIGHT_PX,
  type FillScale,
  type TemplateSection,
} from "./cv-templates";
import { launchBrowser, renderPdfOnPage } from "./pdf-render";

const A4_WIDTH_MM = 210;
const MARGIN_LEFT_RIGHT_MM = 18;
const MM_TO_PX = 96 / 25.4;

const CONTENT_HEIGHT_PX = A4_CONTENT_HEIGHT_PX;
const CONTENT_WIDTH_PX = Math.round(
  (A4_WIDTH_MM - 2 * MARGIN_LEFT_RIGHT_MM) * MM_TO_PX
);

const UNDERFILLED_THRESHOLD = 0.82;
const TARGET_OCCUPANCY = 0.9;
const TOLERANCE = 0.03;
const MAX_BISECTION_STEPS = 8;
// Upper bound for the fill dial `t`. 1.0 alone isn't enough headroom for
// very sparse CVs (e.g. a one-job graduate CV) to reach ~90% occupancy —
// verified visually that ~1.6 still reads as generously spaced, not
// broken or absurd.
const MAX_T = 1.6;

type Browser = Awaited<ReturnType<typeof launchBrowser>>;
type Page = Awaited<ReturnType<Browser["newPage"]>>;

// The single "fill" dial `t` (0-1+) maps to three independent CSS scale
// factors. Font-size gets a small ceiling (+20% at t=1) — pumping body
// text to fill genuinely sparse content quickly looks absurd. Section
// spacing and line-height get a much higher ceiling, since generous
// whitespace reads as normal CV design, not as a hack.
function scaleAt(t: number, center = false): FillScale {
  return {
    font: 1 + 0.2 * t,
    space: 1 + 2.6 * t,
    line: 1 + 0.4 * t,
    center,
  };
}

// Reuses one already-open page across every measurement in a bisection
// search, rather than opening a fresh page per call.
async function measureHeightPx(
  page: Page,
  html: string,
  selector?: string
): Promise<number> {
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });
  if (selector) {
    return await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      return el ? el.scrollHeight : 0;
    }, selector);
  }
  return await page.evaluate(() => document.body.scrollHeight);
}

async function countPdfPages(pdf: Buffer): Promise<number> {
  const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
  const data = await pdfParse(pdf);
  return data.numpages;
}

// puppeteer-core + @sparticuz/chromium occasionally hands back a
// corrupted/truncated PDF buffer (confirmed via production logs —
// pdf-parse throwing "bad XRef entry", i.e. a malformed cross-reference
// table, which only happens on a genuinely broken PDF) — a lower-level
// Chromium/serverless timing issue, not something the page-management
// fixes above are guaranteed to eliminate entirely. Defends against
// whatever's left by validating the buffer actually parses before
// accepting it, retrying on a brand new page if not.
async function capturePdfWithRetry(
  browser: Browser,
  html: string,
  attempts = 3
): Promise<Buffer> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    const page = await browser.newPage();
    try {
      const pdf = await renderPdfOnPage(page, html);
      await countPdfPages(pdf); // throws on a corrupted buffer
      return pdf;
    } catch (err) {
      lastErr = err;
      console.error(`PDF capture attempt ${i + 1}/${attempts} produced an invalid PDF, retrying:`, err);
    } finally {
      await page.close();
    }
  }
  throw lastErr;
}

// maxedOut: the search hit MAX_T and still fell well short of target
// occupancy - font/space/line scaling alone can't stretch the content any
// further. The caller uses this to switch the final render to vertical
// centering instead (see FillScale.center's doc comment) rather than
// shipping a page that trails off into empty space at the bottom.
type FillSearchResult = { t: number; pageCount: number; maxedOut: boolean };

// Bisection-searches the fill dial `t` for one column's worth of content
// (or a whole single-column page) so its rendered height lands near
// TARGET_OCCUPANCY of a full page. `measureFn` isolates whatever's being
// measured — a single column's scrollHeight, or the whole page's — so
// this same search works for both the simple single-column templates and
// each half of the two-column template independently.
//
// Generalized to N pages, not just one: content that naturally spans
// several pages (e.g. 1.75 pages) still gets its *trailing* page topped
// up towards TARGET_OCCUPANCY, instead of being left alone entirely
// (confirmed as a real complaint — a CV whose content landed at ~1.75
// pages left the back half of page 2 almost completely blank, because
// the old version only ever compared against a single page's height and
// bailed out the moment content exceeded it). `pageCount` here is a
// measurement-time estimate (unconstrained content height ÷ one page's
// height) used only to pick a sensible target — the actual renderer's
// own page-budget safety net is what confirms/corrects the real
// rendered page count afterwards.
async function bisectFillT(
  measureFn: (t: number) => Promise<number>
): Promise<FillSearchResult> {
  const baseHeight = await measureFn(0);
  const pageCount = Math.max(1, Math.ceil(baseHeight / CONTENT_HEIGHT_PX));
  const targetPx = (pageCount - 1 + TARGET_OCCUPANCY) * CONTENT_HEIGHT_PX;
  const lastPageHeight = baseHeight - (pageCount - 1) * CONTENT_HEIGHT_PX;

  if (
    lastPageHeight >= UNDERFILLED_THRESHOLD * CONTENT_HEIGHT_PX ||
    lastPageHeight > 1.05 * CONTENT_HEIGHT_PX
  ) {
    return { t: 0, pageCount, maxedOut: false };
  }

  let lo = 0;
  let hi = MAX_T;
  const hiHeight = await measureFn(hi);

  // Even max fill doesn't reach target (extremely sparse content) — use
  // the maximum we're willing to apply rather than searching, and flag it
  // so the caller can fall back to vertical centering instead.
  if (hiHeight < targetPx) return { t: MAX_T, pageCount, maxedOut: true };

  let best = 0;
  for (let i = 0; i < MAX_BISECTION_STEPS; i++) {
    const mid = (lo + hi) / 2;
    const height = await measureFn(mid);

    if (Math.abs(height - targetPx) <= TOLERANCE * CONTENT_HEIGHT_PX) {
      best = mid;
      break;
    }
    if (height < targetPx) {
      lo = mid;
    } else {
      hi = mid;
    }
    best = lo;
  }
  return { t: best, pageCount, maxedOut: false };
}

// Renders the final PDF and, if it overflowed past `expectedPages` (the
// page count bisectFillT estimated from unscaled content — the fill
// scale it picked shouldn't itself push content onto an extra page, but
// the measurement is an approximation, not a guarantee), backs off the
// fill amount(s) in steps and re-renders. `render(t)` produces the HTML
// for a candidate fill amount. Takes a *browser* (not a page) and opens a
// fresh page per render attempt — deliberately not the same page used for
// the measurement bisection. Confirmed directly via production logs
// (pdf-parse throwing "bad XRef entry" — a corrupted/truncated PDF) that
// capturing page.pdf() on a page that just went through many setContent()
// measurement calls is what was producing occasional bad output; a page
// dedicated to PDF capture doesn't have that problem. Attempt count here
// is small (1, occasionally up to 5), unlike the ~10 measurement calls
// that made per-call page creation a real cost during the bisection
// search — so a fresh page per attempt is cheap here.
async function renderWithPageBudgetSafetyNet(
  browser: Browser,
  render: (t: number) => string,
  startT: number,
  expectedPages: number
): Promise<Buffer> {
  let t = startT;
  let pdf = await capturePdfWithRetry(browser, render(t));
  let pages = await countPdfPages(pdf);

  let attempts = 0;
  while (pages > expectedPages && t > 0 && attempts < 4) {
    t = Math.max(0, t - 0.2);
    pdf = await capturePdfWithRetry(browser, render(t));
    pages = await countPdfPages(pdf);
    attempts++;
  }

  if (pages > expectedPages && t > 0) {
    return capturePdfWithRetry(browser, render(0));
  }

  return pdf;
}

// Everything for one export — the fill-amount measurement search AND the
// final render(s), including any overflow-backoff retries — happens
// within a single browser launch (never a second Chromium process per
// request — confirmed that mattered too), but the measurement page and
// the PDF-capture page(s) are kept separate (see
// renderWithPageBudgetSafetyNet's comment for why).
async function renderFilledSingleColumnPdf(
  templateId: string,
  sections: TemplateSection[]
): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const measurePage = await browser.newPage();
    await measurePage.setViewport({ width: CONTENT_WIDTH_PX, height: 200 });
    await measurePage.emulateMediaType("print");

    let fill: FillSearchResult;
    try {
      fill = await bisectFillT((t) =>
        measureHeightPx(measurePage, renderTemplate(templateId, sections, scaleAt(t)))
      );
    } finally {
      await measurePage.close();
    }

    if (fill.t === 0) {
      return await capturePdfWithRetry(browser, renderTemplate(templateId, sections, scaleAt(0)));
    }

    return await renderWithPageBudgetSafetyNet(
      browser,
      (t) => renderTemplate(templateId, sections, scaleAt(t, fill.maxedOut)),
      fill.t,
      fill.pageCount
    );
  } finally {
    await browser.close();
  }
}

// Two-column's sidebar and main column heights are independent of each
// other (floats don't share a height constraint) — a sparse main column
// next to a content-dense sidebar (or vice versa) is exactly the "looks
// unbalanced" case a single page-wide scale can't fix, since the taller
// column already reads as "page is full" while the shorter one is still
// half-empty. Search each column's fill amount independently, both
// targeting the same page-height reference.
async function renderFilledTwoColumnPdf(sections: TemplateSection[]): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const measurePage = await browser.newPage();
    await measurePage.setViewport({ width: CONTENT_WIDTH_PX, height: 200 });
    await measurePage.emulateMediaType("print");

    let mainFill: FillSearchResult;
    let sidebarFill: FillSearchResult;
    try {
      // Sequential, not parallel — both searches reuse the same page,
      // which is safe since they never run concurrently.
      mainFill = await bisectFillT((t) =>
        measureHeightPx(measurePage, renderTwoColumn(sections, scaleAt(t), scaleAt(0)), ".main")
      );
      sidebarFill = await bisectFillT((t) =>
        measureHeightPx(measurePage, renderTwoColumn(sections, scaleAt(0), scaleAt(t)), ".sidebar")
      );
    } finally {
      await measurePage.close();
    }

    const renderColumns = (mainT: number, sidebarT: number) =>
      renderTwoColumn(
        sections,
        scaleAt(mainT, mainFill.maxedOut),
        scaleAt(sidebarT, sidebarFill.maxedOut)
      );

    if (mainFill.t === 0 && sidebarFill.t === 0) {
      return await capturePdfWithRetry(browser, renderColumns(0, 0));
    }

    // Floated columns share the physical page: the render needs as many
    // pages as whichever column is taller, not the sum of both.
    const expectedPages = Math.max(mainFill.pageCount, sidebarFill.pageCount);

    let pdf = await capturePdfWithRetry(browser, renderColumns(mainFill.t, sidebarFill.t));
    let pages = await countPdfPages(pdf);

    let mainT = mainFill.t;
    let sidebarT = sidebarFill.t;
    let attempts = 0;
    while (pages > expectedPages && (mainT > 0 || sidebarT > 0) && attempts < 4) {
      mainT = Math.max(0, mainT - 0.2);
      sidebarT = Math.max(0, sidebarT - 0.2);
      pdf = await capturePdfWithRetry(browser, renderColumns(mainT, sidebarT));
      pages = await countPdfPages(pdf);
      attempts++;
    }

    if (pages > expectedPages) {
      return await capturePdfWithRetry(browser, renderColumns(0, 0));
    }

    return pdf;
  } finally {
    await browser.close();
  }
}

// Renders a template to PDF, but first checks whether the content would
// leave a lot of empty space on its last page (a short CV on a
// fixed-size A4 template, or content that naturally spills a bit onto a
// 2nd/3rd page and leaves most of it blank) and, if so, searches for a
// fill amount that brings that last page's occupancy close to ~90% —
// rather than shipping a CV with a near-empty tail. Deliberately a
// deterministic bisection over real measured output, not an AI repair
// pass — that's exactly the fragile pattern legacy-v1's pipeline was
// flagged for, and fabricating filler content/sections to physically pad
// space is worse still (a resume padded with invented text is a
// trust problem, not a layout one). Content that already fills its pages
// well (no meaningfully underfilled trailing page) is left untouched.
export async function renderFilledTemplatePdf(
  templateId: string,
  sections: TemplateSection[]
): Promise<Buffer> {
  const attempt = () =>
    templateId === "two-column" && classifyForTwoColumn(sections).hasTwoColumns
      ? renderFilledTwoColumnPdf(sections)
      : renderFilledSingleColumnPdf(templateId, sections);

  // Outermost retry with an entirely fresh browser — covers failure modes
  // below capturePdfWithRetry's own per-page retry, like the browser
  // launch itself failing intermittently under serverless resource
  // pressure (observed happening even after the page-level fixes above,
  // concentrated on cold-start requests specifically — the one failure
  // in a 30-request production stress test was the very first request
  // of the run). Two retries, not one: plenty of time budget headroom
  // (observed 1-6s per attempt against a 60s function limit) to spend on
  // resilience here.
  let lastErr: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      return await attempt();
    } catch (err) {
      lastErr = err;
      console.error(`PDF export attempt ${i + 1}/3 failed:`, err);
    }
  }
  throw lastErr;
}
