import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // @sparticuz/chromium ships its Chromium binary as a file asset, read via
  // fs at runtime (not imported as a JS module), so Next's build tracer
  // won't pick it up on its own — the package's own docs call this out
  // explicitly for serverless bundlers. Both settings are required:
  // serverExternalPackages keeps puppeteer-core/@sparticuz/chromium out of
  // the bundle so they aren't relocated, and outputFileTracingIncludes
  // forces the binary directory into the deployed function.
  // pdfjs-dist's legacy Node build dynamically imports pdf.worker.mjs as a
  // fallback "fake worker" - Turbopack's tracer doesn't follow that dynamic
  // import, so the worker file was missing from the deployed function
  // (confirmed directly: "Cannot find module '.../pdf.worker.mjs'" in
  // production only). Same fix shape as chromium below.
  serverExternalPackages: [
    "puppeteer-core",
    "@sparticuz/chromium",
    "pdfjs-dist",
  ],
  outputFileTracingIncludes: {
    "/api/export/\\[id\\]": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/upload": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
