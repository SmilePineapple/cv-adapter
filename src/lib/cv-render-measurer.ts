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
  overflowing: boolean
}

export const A4_HEIGHT_PX = 1122.52
export const UNDERFILLED_PAGE_THRESHOLD = 0.72

export function getActualPageCount(scrollHeight: number, pageHeight: number = A4_HEIGHT_PX): number {
  if (scrollHeight <= 0) return 1
  return Math.max(1, Math.ceil(scrollHeight / pageHeight))
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

export async function measureRenderedCV(page: Page, targetPages?: number): Promise<RenderMeasurement> {
  const rawMeasurement = await page.evaluate((fallbackPageHeight) => {
    const pageHeight = fallbackPageHeight
    const scrollHeight = Math.max(
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
    const clippedPages = Array.from(document.querySelectorAll('.cv-page'))
      .map((node, index) => {
        const element = node as HTMLElement
        const hasClippedContent = element.scrollHeight > element.clientHeight + 4 || element.scrollWidth > element.clientWidth + 4
        return hasClippedContent ? index + 1 : null
      })
      .filter((pageNumber): pageNumber is number => pageNumber !== null)

    return {
      scrollHeight,
      pageHeight,
      sectionPlacements,
      clippedPages,
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
    overflowing: typeof targetPages === 'number' ? actualPages > targetPages || rawMeasurement.clippedPages.length > 0 : rawMeasurement.clippedPages.length > 0
  }
}
