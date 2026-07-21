function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function generateCoverLetterHtml(content: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 25mm 25mm; }
  body {
    font-family: Georgia, 'Times New Roman', serif;
    color: #1a1a1a;
    font-size: 11.5pt;
    line-height: 1.7;
  }
  p { margin: 0 0 14px; white-space: pre-wrap; }
</style>
</head>
<body>
  <p>${escapeHtml(content).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>
</body>
</html>`;
}
