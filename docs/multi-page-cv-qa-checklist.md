# Multi-Page CV QA Checklist

## Scope

Use this checklist to validate deterministic 2/3/4-page CV generation after the blueprint, validation, render measurement, repair, and page-plan renderer changes.

## Pre-Test Setup

- Confirm OpenAI API access is configured.
- Use a CV with real content in these sections where possible:
  - name
  - contact
  - summary
  - experience
  - skills
  - education
  - certifications
- Use a realistic job description with enough detail for tailoring.
- Test with PDF export first because page-plan rendering currently applies to multi-page PDF export.

## Generation Tests

### 2-Page CV

- Select `2 pages — Standard`.
- Generate the CV.
- Confirm generation completes without timeout.
- Confirm review/download output includes core sections.
- Confirm content is more detailed than a 1-page CV but not padded with fake claims.

### 3-Page CV

- Select `3 pages — Detailed`.
- Generate the CV.
- Confirm sections include enough detail for senior-role positioning.
- Confirm optional sections such as projects or achievements appear only when relevant.
- Confirm no fake employers, dates, qualifications, or certifications are added.

### 4-Page CV

- Select `4 pages — Comprehensive`.
- Generate the CV.
- Confirm the CV has substantial but factual content.
- Confirm generated content aligns with the selected job.
- Confirm no old-style arbitrary expansion appears.

## Export Tests

For each page count, export as PDF.

- Confirm progress shows page-plan/layout optimization messaging.
- Confirm the exported PDF opens successfully.
- Confirm the PDF has the selected number of pages or is repaired closer to it.
- Confirm page containers do not visibly overlap.
- Confirm section headings are readable.
- Confirm text is not clipped at the bottom of pages.
- Confirm final page is not mostly empty unless source content is genuinely too short.

## Server Log Checks

During PDF export, check logs for:

- `Using deterministic page-plan renderer`
- `Render measurement`
- `Render repair plan`
- `Running one-pass render-based layout repair` only when repair is actually needed

For each export, record:

- selected page count
- actual rendered pages
- underfilled pages
- repair action: `none`, `expand`, or `condense`

## Regression Checks

- 1-page PDF export still works.
- DOCX export still works.
- TXT export still works.
- Existing advanced template previews still render in the download page.
- Edited CV sections are still respected during export.
- Name and contact sections are preserved.

## Failure Cases To Watch

- AI repair adds fake companies, dates, degrees, or certifications.
- Page-plan renderer clips large sections due to fixed page containers.
- Final PDF produces an extra blank page.
- Render repair repeatedly changes content but still misses target.
- Multi-page PDF ignores template styling because deterministic page-plan styling intentionally takes over for `maxPages > 1`.

## Pass Criteria

A page count is considered passing when:

- The PDF exports successfully.
- The page count matches the selected target, or logs show a clear repair attempt and the result is materially closer.
- Content remains truthful and job-relevant.
- No major clipping, overlap, or unreadable section formatting appears.
