import type { Page } from 'puppeteer-core'

export interface ElementRect {
  top: number
  bottom: number
  height: number
}

export interface SectionPlacement extends ElementRect {
  type: string
  pageStart: number
  pageEnd: number
}

// One of the two `.zone-column-left`/`.zone-column-right` divs a two-column zone renders
// (see page-plan-renderer.ts's renderPagePlanHTML). Tracked separately from sectionPlacements
// because occupancy/whitespace on a two-column page depends on the SHORTER column's reach,
// not the union of every section's vertical extent regardless of which column it's in.
export interface ColumnPlacement extends ElementRect {
  side: 'left' | 'right'
  pageStart: number
  pageEnd: number
}

export interface ClippedSection {
  type: string
  page: number
  overflowPx: number
}

export interface PageOccupancy {
  page: number
  occupancy: number
  usedHeight: number
  availableHeight: number
}

export interface RenderMeasurement {
  targetPages?: number
  actualPages: number
  scrollHeight: number
  pageHeight: number
  pageOccupancy: PageOccupancy[]
  sectionPlacements: SectionPlacement[]
  columnPlacements: ColumnPlacement[]
  underfilledPages: PageOccupancy[]
  clippedPages: number[]
  clippedSections: ClippedSection[]
  overflowing: boolean
}

export const A4_HEIGHT_PX = 1122.52
export const UNDERFILLED_PAGE_THRESHOLD = 0.72

export function getActualPageCount(scrollHeight: number, pageHeight: number = A4_HEIGHT_PX): number {
  if (scrollHeight <= 0) return 1
  // Allow 0.5px tolerance to prevent float rounding errors (e.g. clientHeight=1123, A4=1122.52 → 1.0004 → rounds to 2 without tolerance)
  const tolerance = 0.5
  return Math.max(1, Math.ceil((scrollHeight - tolerance) / pageHeight))
}

// On a two-column page, the visible bottom white space is bounded by whichever column's
// content ends FIRST - a section rect from the taller column reaching deep down the page
// says nothing about whether the shorter column is empty underneath it. Returns the shared
// (left, right) column bottoms clipped to this page, or null if this page doesn't have a
// genuine two-column split (e.g. a single-column zone, or no column data at all) - callers
// should fall back to section-based measurement in that case.
function getColumnBottomsForPage(columnPlacements: ColumnPlacement[], pageTop: number, pageBottom: number): { left: number; right: number } | null {
  const onPage = columnPlacements.filter(column => column.bottom > pageTop && column.top < pageBottom)
  const leftColumns = onPage.filter(column => column.side === 'left')
  const rightColumns = onPage.filter(column => column.side === 'right')
  if (leftColumns.length === 0 || rightColumns.length === 0) return null

  return {
    left: Math.max(...leftColumns.map(column => Math.min(column.bottom, pageBottom))),
    right: Math.max(...rightColumns.map(column => Math.min(column.bottom, pageBottom)))
  }
}

export function calculatePageOccupancy(rects: ElementRect[], pageCount: number, pageHeight: number = A4_HEIGHT_PX, columnPlacements: ColumnPlacement[] = []): PageOccupancy[] {
  return Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1
    const pageTop = index * pageHeight
    const pageBottom = pageTop + pageHeight

    const columnBottoms = getColumnBottomsForPage(columnPlacements, pageTop, pageBottom)
    if (columnBottoms) {
      const shallowBottom = Math.min(columnBottoms.left, columnBottoms.right)
      const usedHeight = Math.max(0, shallowBottom - pageTop)
      return {
        page,
        occupancy: Math.min(1, usedHeight / pageHeight),
        usedHeight,
        availableHeight: pageHeight
      }
    }

    const intervals = rects
      .map(rect => ({ top: Math.max(rect.top, pageTop), bottom: Math.min(rect.bottom, pageBottom) }))
      .filter(interval => interval.bottom > interval.top)
      .sort((a, b) => a.top - b.top)

    const merged = intervals.reduce<Array<{ top: number; bottom: number }>>((acc, interval) => {
      const previous = acc[acc.length - 1]
      if (!previous || interval.top > previous.bottom) {
        acc.push(interval)
      } else {
        previous.bottom = Math.max(previous.bottom, interval.bottom)
      }
      return acc
    }, [])

    const usedHeight = merged.reduce((sum, interval) => sum + interval.bottom - interval.top, 0)

    return {
      page,
      occupancy: Math.min(1, usedHeight / pageHeight),
      usedHeight,
      availableHeight: pageHeight
    }
  })
}

export function getUnderfilledPages(pageOccupancy: PageOccupancy[], threshold: number = UNDERFILLED_PAGE_THRESHOLD): PageOccupancy[] {
  return pageOccupancy.filter(page => page.occupancy < threshold)
}

// Vertical coverage = how far the lowest section on a page reaches down the page (0-1).
// This captures the visible bottom white space a user sees, independent of text density.
export function getPageBottomCoverage(measurement: Pick<RenderMeasurement, 'pageHeight' | 'actualPages' | 'sectionPlacements' | 'columnPlacements'>): number[] {
  const { pageHeight, actualPages, sectionPlacements, columnPlacements } = measurement
  return Array.from({ length: actualPages }, (_, index) => {
    const pageTop = index * pageHeight
    const pageBottom = pageTop + pageHeight

    const columnBottoms = getColumnBottomsForPage(columnPlacements ?? [], pageTop, pageBottom)
    if (columnBottoms) {
      const shallowBottom = Math.min(columnBottoms.left, columnBottoms.right)
      return Math.min(1, Math.max(0, (shallowBottom - pageTop) / pageHeight))
    }

    const bottoms = sectionPlacements
      .filter(section => section.bottom > pageTop && section.top < pageBottom)
      .map(section => Math.min(section.bottom, pageBottom))
    const lowest = bottoms.length > 0 ? Math.max(...bottoms) : pageTop
    return Math.min(1, Math.max(0, (lowest - pageTop) / pageHeight))
  })
}

export interface FillScaleOptions {
  maxScale?: number
  targetCoverage?: number
  fullPageCap?: number
}

// Computes a single global spacing multiplier that pushes underfilled page content toward
// the bottom of the page without overflowing the fullest page. Returns 1 when no fill is
// needed (single-page target, overflowing, or pages already near-full).
export function computeFillScale(measurement: RenderMeasurement, options: FillScaleOptions = {}): number {
  const { maxScale = 1.5, targetCoverage = 0.95, fullPageCap = 0.97 } = options

  if (!measurement.targetPages || measurement.targetPages <= 1) return 1
  if (measurement.overflowing) return 1

  const coverage = getPageBottomCoverage(measurement)
  if (coverage.length === 0) return 1

  const bindingMax = Math.max(...coverage)
  if (bindingMax <= 0) return 1

  // Pages expected to be full are every page except the final one (the last page may be short).
  const nonFinal = coverage.length > 1 ? coverage.slice(0, coverage.length - 1) : coverage
  const minNonFinal = Math.min(...nonFinal)
  if (minNonFinal >= 0.9) return 1

  const safeScale = fullPageCap / bindingMax
  const wantScale = targetCoverage / minNonFinal

  return Math.min(maxScale, Math.max(1, Math.min(safeScale, wantScale)))
}

export interface ShrinkScaleOptions {
  minScale?: number
  safetyMarginPx?: number
}

// Last-resort deterministic safety net: if AI condense rounds are exhausted and content is
// STILL clipped, compress spacing/line-height by exactly enough to clear the worst overflow
// rather than shipping a PDF with visibly missing words. Only applies when the content
// already fits the target page count (actualPages === targetPages) - if it genuinely needs
// another physical page, no amount of spacing compression fixes that, and this deliberately
// returns 1 (no-op) so callers don't mask a real overflow-into-extra-pages case.
export function computeShrinkScale(measurement: RenderMeasurement, options: ShrinkScaleOptions = {}): number {
  const { minScale = 0.85, safetyMarginPx = 6 } = options

  if (!measurement.targetPages) return 1
  if (measurement.actualPages > measurement.targetPages) return 1
  if (!measurement.clippedSections || measurement.clippedSections.length === 0) return 1

  const maxOverflowPx = Math.max(...measurement.clippedSections.map(section => section.overflowPx))
  if (maxOverflowPx <= 0) return 1

  const scale = measurement.pageHeight / (measurement.pageHeight + maxOverflowPx + safetyMarginPx)
  return Math.max(minScale, Math.min(1, scale))
}

export interface TemplateShrinkScaleOptions {
  minScale?: number
  safetyMarginPx?: number
}

// Last-resort deterministic safety net for single-page template-rendered exports
// (generateTemplateHtml output), which don't have the .cv-page wrapper page-plan-renderer
// relies on for clippedSections detection - so computeShrinkScale's per-section overflow
// math never fires for them. Falls back to whole-document scrollHeight vs the single-page
// target height instead. Meant to be applied via CSS `zoom` (not `transform: scale`, which
// doesn't affect layout/scrollHeight in Chromium and so wouldn't be reflected on re-measure).
export function computeTemplateShrinkScale(measurement: RenderMeasurement, options: TemplateShrinkScaleOptions = {}): number {
  const { minScale = 0.82, safetyMarginPx = 6 } = options

  if (measurement.targetPages !== 1) return 1
  if (measurement.actualPages <= 1) return 1

  const overflowPx = measurement.scrollHeight - measurement.pageHeight
  if (overflowPx <= 0) return 1

  const scale = measurement.pageHeight / (measurement.pageHeight + overflowPx + safetyMarginPx)
  return Math.max(minScale, Math.min(1, scale))
}

export interface TemplateFillScaleOptions {
  maxScale?: number
  targetOccupancy?: number
  minOccupancyToFill?: number
}

// Counterpart to computeTemplateShrinkScale for the underfilled case: single-page template
// exports have no equivalent of computeFillScale (which only applies to the multi-page
// page-plan renderer), so a short CV renders with a mostly-blank page instead of the
// spacing being stretched to use it. Scales content up toward targetOccupancy via the same
// `zoom` mechanism, capped conservatively (multi-page's fill scale caps at 1.5x, but that
// pushes underfilled *interior* pages toward a full one; here we're inflating the only page,
// so oversized text is a much more visible failure mode - keep the cap tight).
export function computeTemplateFillScale(measurement: RenderMeasurement, options: TemplateFillScaleOptions = {}): number {
  const { maxScale = 1.18, targetOccupancy = 0.9, minOccupancyToFill = 0.75 } = options

  if (measurement.targetPages !== 1) return 1
  if (measurement.actualPages > 1 || measurement.overflowing) return 1

  const page1 = measurement.pageOccupancy.find(p => p.page === 1)
  if (!page1 || page1.occupancy <= 0) return 1
  if (page1.occupancy >= minOccupancyToFill) return 1

  const scale = targetOccupancy / page1.occupancy
  return Math.min(maxScale, Math.max(1, scale))
}

// For the single-column overflow fallback (a CV that couldn't be shrunk to 1 page and now
// spans N pages): the last page is very often mostly empty, since it only holds whatever
// spilled past page N-1's boundary. Unlike computeTemplateFillScale (which only fires for a
// genuinely single-page result), this targets whichever page is actually last, regardless of
// total page count - the goal is "use the space on the page you shipped", not "get to 1 page".
export function computeTemplateLastPageFillScale(measurement: RenderMeasurement, options: TemplateFillScaleOptions = {}): number {
  const { maxScale = 1.15, targetOccupancy = 0.85, minOccupancyToFill = 0.7 } = options

  // Deliberately does NOT check measurement.overflowing: that flag compares actualPages
  // against the original single-page target, which this function is called after already
  // accepting as a multi-page result. Only bail if content is genuinely being clipped -
  // that's the real "don't make this worse" signal here.
  if (measurement.clippedPages && measurement.clippedPages.length > 0) return 1
  if (!measurement.actualPages || measurement.actualPages < 1) return 1

  const lastPage = measurement.pageOccupancy.find(p => p.page === measurement.actualPages)
  if (!lastPage || lastPage.occupancy <= 0) return 1
  if (lastPage.occupancy >= minOccupancyToFill) return 1

  const scale = targetOccupancy / lastPage.occupancy
  return Math.min(maxScale, Math.max(1, scale))
}

export async function measureRenderedCV(page: Page, targetPages?: number): Promise<RenderMeasurement> {
  const rawMeasurement = await page.evaluate((fallbackPageHeight) => {
    const pageHeight = fallbackPageHeight
    // When the body/html has overflow:hidden (single-page templates), scrollHeight still
    // includes hidden overflow content. Use clientHeight in that case so we measure
    // the actual visible/rendered height, not the overflowing content.
    const bodyStyle = window.getComputedStyle(document.body)
    const htmlStyle = window.getComputedStyle(document.documentElement)
    const isHardClamped = (bodyStyle.overflow === 'hidden' || bodyStyle.overflowY === 'hidden') &&
                          (htmlStyle.overflow === 'hidden' || htmlStyle.overflowY === 'hidden')
    // When the template-shrink safety net applies `body { zoom }`, Chromium reports
    // body.scrollHeight/offsetHeight in the body's own zoomed coordinate space, NOT root
    // pixels - so an already-fitting page still measures as overflowing and the shrink
    // loop can never converge. Normalize body-based metrics back to root pixels.
    const bodyZoom = parseFloat((bodyStyle as CSSStyleDeclaration & { zoom?: string }).zoom || '1') || 1
    const scrollHeight = isHardClamped
      ? document.body.clientHeight || document.documentElement.clientHeight
      : Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight * bodyZoom,
          document.documentElement.offsetHeight,
          document.body.offsetHeight * bodyZoom
        )

    const sectionNodes = Array.from(document.querySelectorAll('[data-section-type], [data-type], .section'))
    const sectionPlacements = sectionNodes.map((node) => {
      const element = node as HTMLElement
      const rect = element.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = rect.bottom + window.scrollY
      const type = element.dataset.sectionType || element.dataset.type || element.className || 'unknown'
      return {
        type,
        top,
        bottom,
        height: bottom - top,
        pageStart: Math.floor(top / pageHeight) + 1,
        pageEnd: Math.floor(Math.max(bottom - 1, top) / pageHeight) + 1
      }
    }).filter(section => section.height > 0)

    const columnNodes = Array.from(document.querySelectorAll('.zone-column-left, .zone-column-right'))
    const columnPlacements = columnNodes.map((node) => {
      const element = node as HTMLElement
      const rect = element.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const bottom = rect.bottom + window.scrollY
      const side: 'left' | 'right' = element.classList.contains('zone-column-left') ? 'left' : 'right'
      return {
        side,
        top,
        bottom,
        height: bottom - top,
        pageStart: Math.floor(top / pageHeight) + 1,
        pageEnd: Math.floor(Math.max(bottom - 1, top) / pageHeight) + 1
      }
    }).filter(column => column.height > 0)

    const bodyRect = document.body.getBoundingClientRect()
    const bodyTop = bodyRect.top + window.scrollY
    const bodyBottom = Math.max(bodyRect.bottom + window.scrollY, scrollHeight)
    // Track which specific sections overflow their page container (not just which pages),
    // so a condense repair can target only the actual offender instead of every section on
    // that page - a broad target caused large overcorrections in practice.
    const clippedSectionDetails: { type: string; page: number; overflowPx: number }[] = []
    const clippedPages = Array.from(document.querySelectorAll('.cv-page'))
      .map((node, index) => {
        const element = node as HTMLElement
        const pageRect = element.getBoundingClientRect()
        const contentNodes = Array.from(element.querySelectorAll('[data-section-type], [data-type], .section'))
        let hasClippedContent = false
        contentNodes.forEach((contentNode) => {
          const el = contentNode as HTMLElement
          const contentRect = el.getBoundingClientRect()
          const overflowPx = Math.max(contentRect.bottom - (pageRect.bottom + 4), contentRect.right - (pageRect.right + 4))
          if (overflowPx > 0) {
            hasClippedContent = true
            const type = el.dataset.sectionType || el.dataset.type || el.className || 'unknown'
            clippedSectionDetails.push({ type, page: index + 1, overflowPx })
          }
        })
        return hasClippedContent ? index + 1 : null
      })
      .filter((pageNumber): pageNumber is number => pageNumber !== null)

    return {
      scrollHeight,
      pageHeight,
      sectionPlacements,
      columnPlacements,
      clippedPages,
      clippedSectionDetails,
      bodyRect: {
        top: bodyTop,
        bottom: bodyBottom,
        height: bodyBottom - bodyTop
      }
    }
  }, A4_HEIGHT_PX)

  const actualPages = getActualPageCount(rawMeasurement.scrollHeight, rawMeasurement.pageHeight)
  const occupancyRects = rawMeasurement.sectionPlacements.length > 0
    ? rawMeasurement.sectionPlacements
    : [rawMeasurement.bodyRect]
  const pageOccupancy = calculatePageOccupancy(occupancyRects, actualPages, rawMeasurement.pageHeight, rawMeasurement.columnPlacements)
  const underfilledPages = getUnderfilledPages(pageOccupancy)

  return {
    targetPages,
    actualPages,
    scrollHeight: rawMeasurement.scrollHeight,
    pageHeight: rawMeasurement.pageHeight,
    pageOccupancy,
    sectionPlacements: rawMeasurement.sectionPlacements,
    columnPlacements: rawMeasurement.columnPlacements,
    underfilledPages,
    clippedPages: rawMeasurement.clippedPages,
    clippedSections: rawMeasurement.clippedSectionDetails,
    overflowing: typeof targetPages === 'number' ? actualPages > targetPages || rawMeasurement.clippedPages.length > 0 : rawMeasurement.clippedPages.length > 0
  }
}

// Counts physical pages in a PDF buffer by counting distinct /Type /Page object
// dictionaries in the raw bytes. Puppeteer/Chromium's PDF writer emits these
// uncompressed, so this is a reliable, dependency-free ground-truth page count - used
// because DOM scrollHeight measurement can diverge from actual print pagination (e.g.
// flex/grid two-column layouts paginate independently per column under print).
export function countPdfPages(buffer: Buffer): number {
  const text = buffer.toString('latin1')
  const matches = text.match(/\/Type\s*\/Page(?!s)\b/g)
  return matches ? matches.length : 0
}
