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

export function calculatePageOccupancy(rects: ElementRect[], pageCount: number, pageHeight: number = A4_HEIGHT_PX): PageOccupancy[] {
  return Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1
    const pageTop = index * pageHeight
    const pageBottom = pageTop + pageHeight
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
export function getPageBottomCoverage(measurement: Pick<RenderMeasurement, 'pageHeight' | 'actualPages' | 'sectionPlacements'>): number[] {
  const { pageHeight, actualPages, sectionPlacements } = measurement
  return Array.from({ length: actualPages }, (_, index) => {
    const pageTop = index * pageHeight
    const pageBottom = pageTop + pageHeight
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
    const scrollHeight = isHardClamped
      ? document.body.clientHeight || document.documentElement.clientHeight
      : Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          document.documentElement.offsetHeight,
          document.body.offsetHeight
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
  const pageOccupancy = calculatePageOccupancy(occupancyRects, actualPages, rawMeasurement.pageHeight)
  const underfilledPages = getUnderfilledPages(pageOccupancy)

  return {
    targetPages,
    actualPages,
    scrollHeight: rawMeasurement.scrollHeight,
    pageHeight: rawMeasurement.pageHeight,
    pageOccupancy,
    sectionPlacements: rawMeasurement.sectionPlacements,
    underfilledPages,
    clippedPages: rawMeasurement.clippedPages,
    clippedSections: rawMeasurement.clippedSectionDetails,
    overflowing: typeof targetPages === 'number' ? actualPages > targetPages || rawMeasurement.clippedPages.length > 0 : rawMeasurement.clippedPages.length > 0
  }
}
