// Shared by renderHtmlToPdf and cv-fill.ts's content-height measurement —
// both need a real Chromium instance, dev/prod split is identical either
// way.
export async function launchBrowser() {
  const isProduction = process.env.NODE_ENV === "production";

  return isProduction
    ? await (
        await import("puppeteer-core")
      ).default.launch({
        args: (await import("@sparticuz/chromium")).default.args,
        executablePath: await (
          await import("@sparticuz/chromium")
        ).default.executablePath(),
        headless: true,
      })
    : await (
        await import("puppeteer")
      ).default.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
}

// Renders on an already-open page — no browser launch of its own. Exists
// so cv-fill.ts's fill search can do its measurement passes AND the final
// render on a single Chromium process, instead of launching a fresh one
// per render. Confirmed this matters: even after cutting page-open calls
// down to one per browser, exports still failed intermittently in
// production specifically when the fill search's retry/backoff paths
// triggered a second (or third+) `launchBrowser()` within one request —
// launching the actual Chromium subprocess more than once per serverless
// invocation is the expensive, failure-prone step, not page creation.
export async function renderPdfOnPage(
  page: Awaited<ReturnType<Awaited<ReturnType<typeof launchBrowser>>["newPage"]>>,
  html: string
): Promise<Buffer> {
  // domcontentloaded, not networkidle0 — networkidle0 caused Google Fonts
  // timeouts in v1's production; this template has no external fonts.
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 15000 });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  return Buffer.from(pdf);
}

export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    return await renderPdfOnPage(page, html);
  } finally {
    await browser.close();
  }
}
