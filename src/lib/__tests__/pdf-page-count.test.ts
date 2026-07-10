import { describe, expect, it } from 'vitest'
import { countPdfPages } from '../cv-render-measurer'

describe('countPdfPages', () => {
  it('counts /Type /Page object dictionaries, ignoring the /Type /Pages tree root', () => {
    const pdfBytes = Buffer.from(
      '%PDF-1.4\n' +
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n' +
      '2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj\n' +
      '3 0 obj << /Type /Page /Parent 2 0 R >> endobj\n' +
      '4 0 obj << /Type /Page /Parent 2 0 R >> endobj\n'
    )
    expect(countPdfPages(pdfBytes)).toBe(2)
  })

  it('returns 0 for a buffer with no page objects', () => {
    expect(countPdfPages(Buffer.from('not a pdf'))).toBe(0)
  })

  it('counts a single page correctly', () => {
    const pdfBytes = Buffer.from('1 0 obj << /Type /Pages /Kids [2 0 R] /Count 1 >> endobj\n2 0 obj << /Type /Page >> endobj\n')
    expect(countPdfPages(pdfBytes)).toBe(1)
  })
})
