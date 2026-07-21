const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "our", "are", "will", "have",
  "this", "that", "from", "who", "role", "job", "work", "team", "able",
  "must", "can", "all", "has", "was", "not", "but", "they", "their",
  "into", "such", "some", "than", "then", "over", "also", "any", "may",
]);

function extractKeywords(text: string, limit: number): string[] {
  const counts = new Map<string, number>();
  const words = text.toLowerCase().match(/[a-z][a-z0-9+.#-]{2,}/g) || [];
  for (const raw of words) {
    const word = raw.replace(/[.#-]+$/, "");
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export type AtsResult = {
  score: number;
  keywordMatchPercent: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  issues: string[];
};

const SECTION_HEADERS = [
  { label: "experience", pattern: /experience|employment|work history/i },
  { label: "education", pattern: /education|qualifications/i },
  { label: "skills", pattern: /skills|competenc/i },
];

export function scoreAgainstJob(cvText: string, jobDescription: string): AtsResult {
  const jdKeywords = extractKeywords(jobDescription, 25);
  const cvLower = cvText.toLowerCase();
  const matched = jdKeywords.filter((k) => cvLower.includes(k));
  const missing = jdKeywords.filter((k) => !cvLower.includes(k));
  const keywordMatchPercent = jdKeywords.length
    ? Math.round((matched.length / jdKeywords.length) * 100)
    : 0;
  const keywordScore = Math.round((matched.length / Math.max(jdKeywords.length, 1)) * 50);

  const sectionsPresent = SECTION_HEADERS.filter((s) => s.pattern.test(cvText));
  const sectionScore = Math.round((sectionsPresent.length / SECTION_HEADERS.length) * 20);

  const hasEmail = /[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(cvText);
  const hasPhone = /(\+?\d[\d\s().-]{8,}\d)/.test(cvText);
  const contactScore = (hasEmail ? 10 : 0) + (hasPhone ? 5 : 0);

  const wordCount = cvText.trim().split(/\s+/).length;
  const lengthScore = wordCount >= 250 && wordCount <= 900 ? 10 : wordCount > 100 ? 5 : 0;

  const bulletCount = (cvText.match(/^[\s]*[•\-*]\s/gm) || []).length;
  const formattingScore = bulletCount >= 3 ? 5 : 0;

  const score = Math.max(
    0,
    Math.min(100, keywordScore + sectionScore + contactScore + lengthScore + formattingScore)
  );

  const strengths: string[] = [];
  const issues: string[] = [];

  if (keywordMatchPercent >= 60) strengths.push("Strong keyword overlap with the job description.");
  else issues.push("Low keyword overlap — the CV doesn't use much of the job description's language.");

  if (sectionsPresent.length === SECTION_HEADERS.length) strengths.push("Has clear Experience, Education and Skills sections.");
  else issues.push(`Missing a clear ${SECTION_HEADERS.filter((s) => !sectionsPresent.includes(s)).map((s) => s.label).join("/")} section header.`);

  if (hasEmail && hasPhone) strengths.push("Contact details (email + phone) are present and machine-readable.");
  else issues.push("Missing an email or phone number ATS systems can parse.");

  if (wordCount < 200) issues.push("CV looks quite short — ATS systems and recruiters often expect more detail.");
  if (wordCount > 1000) issues.push("CV is very long — consider trimming to keep it focused.");

  if (bulletCount < 3) issues.push("Few bullet points detected — bulleted achievements parse better than dense paragraphs.");
  else strengths.push("Uses bullet points, which most ATS parsers handle well.");

  return {
    score,
    keywordMatchPercent,
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 15),
    strengths,
    issues,
  };
}
