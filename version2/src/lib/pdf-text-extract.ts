// Text extraction via pdfjs-dist directly, not the `pdf-parse` wrapper -
// confirmed directly against production that pdf-parse@1.1.1's vendored
// pdf.js build (circa 2017) throws on byte-identical, fully valid PDF
// buffers specifically under Vercel's Node runtime ("bad XRef entry" /
// "Invalid PDF structure"), while the same buffer parses fine locally
// under an actual `next build && next start`. pdfjs-dist is the actively
// maintained library pdf-parse wraps a decade-old copy of.
async function extractOnce(
  buffer: Buffer
): Promise<{ text: string; numPages: number; perPageLength: number[] }> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const doc = await getDocument({
    data: new Uint8Array(buffer),
    // No canvas/worker in a serverless function - disable font/worker
    // features that assume a browser or a real filesystem-backed worker.
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
  }).promise;

  let text = "";
  const perPageLength: number[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    text += pageText + "\n";
    perPageLength.push(pageText.trim().length);
  }

  return { text, numPages: doc.numPages, perPageLength };
}

function looksSuspect(result: { numPages: number; perPageLength: number[] }): boolean {
  if (result.numPages <= 1) return false;
  const maxLen = Math.max(...result.perPageLength);
  return maxLen > 0 && result.perPageLength.some((len) => len < maxLen * 0.1);
}

// Falls back to pdf-parse's independent (much older, differently-behaved)
// decoder when pdfjs-dist's result looks incomplete - confirmed directly
// against production that a multi-page PDF can come back with an earlier
// page's text silently empty while later pages extract fully (a 2-page CV
// returning only page 2's ~500 characters instead of the full ~3500, no
// error thrown), specifically for certain PDF encoders' multi-page output,
// while the identical buffer extracts every page correctly every time
// locally. Root cause traced to pdfjs-dist logging "Bad encoding in flate
// stream" for an early page's content stream and silently skipping it -
// pdf-parse's differently-implemented flate handling doesn't necessarily
// hit the same edge case, so it's a reasonable second opinion rather than
// a guaranteed fix. Two independently-implemented decoders disagreeing
// production-only (not reproducible in any local configuration, including
// an actual `next build && next start`) points at a Node/zlib runtime
// difference between this machine and Vercel's build image, which is out
// of this codebase's control - this fallback chain is the pragmatic
// mitigation available without pinning an exact Node version Vercel may
// not even offer as a build target.
export async function extractPdfText(
  buffer: Buffer
): Promise<{ text: string; numPages: number }> {
  const primary = await extractOnce(buffer);
  if (!looksSuspect(primary)) return primary;

  console.error(
    `pdfjs-dist extraction looked incomplete (per-page lengths: ${primary.perPageLength.join(", ")}), trying pdf-parse as a fallback`
  );

  try {
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const fallback = await pdfParse(buffer);
    if (fallback.text.trim().length > primary.text.trim().length) {
      return { text: fallback.text, numPages: fallback.numpages };
    }
  } catch (err) {
    console.error("pdf-parse fallback also failed:", err);
  }

  return primary;
}
