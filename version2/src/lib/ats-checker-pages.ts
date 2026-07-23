export type AtsCheckerPage = {
  slug: string;
  title: string;
  h1: string;
  intro: string;
  tips: string[];
  keywords: string[];
};

export const ATS_CHECKER_PAGES: AtsCheckerPage[] = [
  {
    slug: "software-engineer",
    title: "Free ATS Checker for Software Engineer CVs",
    h1: "Free ATS Checker for Software Engineer CVs",
    intro:
      "Engineering CVs get filtered on very specific things: exact technology names, seniority signals, and whether your bullet points read like impact or just duties. Paste your CV and a job description below to see exactly what's missing.",
    tips: [
      "List technologies exactly as the job description spells them — \"JavaScript\" and \"Javascript\" can be read as different keywords by some parsers.",
      "Lead bullet points with outcomes and metrics (latency reduced, users served, uptime), not just \"responsible for\".",
      "Spell out both the acronym and the full term at least once (e.g. \"CI/CD (Continuous Integration/Continuous Deployment)\") so keyword matching catches either form.",
      "Group skills into a dedicated Skills or Tech Stack section — recruiters and parsers both scan for it separately from your experience bullets.",
    ],
    keywords: [
      "JavaScript", "TypeScript", "React", "Node.js", "AWS",
      "CI/CD", "REST APIs", "Agile", "Git", "microservices",
    ],
  },
  {
    slug: "marketing",
    title: "Free ATS Checker for Marketing CVs",
    h1: "Free ATS Checker for Marketing CVs",
    intro:
      "Marketing job descriptions are dense with channel names, tools, and metrics — and ATS systems weight all three heavily. Check your CV against a real job description below to see what's missing before you apply.",
    tips: [
      "Name the specific platforms you've used (Google Ads, HubSpot, Meta Business Suite) rather than generic phrases like \"digital marketing tools\".",
      "Quantify campaign results wherever you can — CTR, CAC, ROAS, or audience growth numbers carry real weight with both ATS and recruiters.",
      "Match the job description's own terms for your role: \"growth marketing\", \"performance marketing\" and \"demand generation\" aren't interchangeable to a keyword scan.",
      "Include certifications by name (Google Analytics, HubSpot Inbound) — they're commonly scanned as standalone keywords.",
    ],
    keywords: [
      "SEO", "Google Analytics", "content strategy", "campaign management", "HubSpot",
      "social media marketing", "A/B testing", "CRM", "brand strategy", "paid media",
    ],
  },
  {
    slug: "nursing",
    title: "Free ATS Checker for Nursing & Healthcare CVs",
    h1: "Free ATS Checker for Nursing & Healthcare CVs",
    intro:
      "Healthcare recruitment software often screens for qualifications, registration status, and clinical specialisms before a human ever reads your CV. Paste your CV and the job description below to check what's coming through.",
    tips: [
      "State your registration body and PIN status clearly and near the top (e.g. NMC-registered) — this is one of the first things ATS and recruiters filter on.",
      "Name your clinical specialisms and settings explicitly (acute medicine, ITU, paediatrics) rather than folding them into a general \"ward experience\" line.",
      "List mandatory training and certifications by their full names (BLS, ALS, safeguarding levels) — these are commonly required keywords.",
      "Use the same terminology as the job listing for shift patterns and settings (e.g. \"community\" vs \"inpatient\") since synonyms don't always match.",
    ],
    keywords: [
      "NMC registered", "patient care", "clinical assessment", "care planning", "safeguarding",
      "multidisciplinary team", "electronic health records", "BLS", "medication administration", "acute care",
    ],
  },
  {
    slug: "accounting-finance",
    title: "Free ATS Checker for Accounting & Finance CVs",
    h1: "Free ATS Checker for Accounting & Finance CVs",
    intro:
      "Finance CVs are judged heavily on qualifications, software, and precision — vague phrasing gets filtered out fast. Check yours against a real job description below.",
    tips: [
      "Spell out your qualification in full at least once (e.g. \"ACCA — Association of Chartered Certified Accountants\") alongside the abbreviation.",
      "Name the specific software you've used — Xero, SAP, Sage, QuickBooks, Excel (with the level: pivot tables, VLOOKUP, macros) — generic \"accounting software\" won't match.",
      "Quantify scope wherever possible: budget size managed, number of accounts reconciled, percentage cost savings delivered.",
      "Match the job description's exact terms for your specialism — \"financial reporting\", \"management accounting\" and \"financial planning & analysis\" are scored as distinct keywords.",
    ],
    keywords: [
      "ACCA", "ACA", "financial reporting", "reconciliation", "budgeting",
      "forecasting", "Excel", "Sage", "variance analysis", "month-end close",
    ],
  },
  {
    slug: "graduate",
    title: "Free ATS Checker for Graduate & Entry-Level CVs",
    h1: "Free ATS Checker for Graduate & Entry-Level CVs",
    intro:
      "With little or no work history, every keyword on a graduate CV has to earn its place. Check your CV against a real graduate job description below to see what's missing.",
    tips: [
      "Treat your degree modules, dissertation topic, and coursework projects as legitimate experience — name the tools and skills they involved explicitly.",
      "Reframe society roles, part-time jobs, and volunteering using the same skill language the job description uses (teamwork, stakeholder communication, project delivery).",
      "Include any tools, software, or languages from coursework or personal projects by name, even at a beginner level — many are still scanned keywords.",
      "Don't bury your degree classification or expected grade — it's one of the first things graduate-scheme ATS filters check.",
    ],
    keywords: [
      "teamwork", "communication", "project management", "problem solving", "Microsoft Excel",
      "stakeholder engagement", "time management", "research", "presentation skills", "data analysis",
    ],
  },
  {
    slug: "sales",
    title: "Free ATS Checker for Sales CVs",
    h1: "Free ATS Checker for Sales CVs",
    intro:
      "Sales roles are numbers-driven, and so is the software that screens sales CVs. Paste yours alongside a real job description below to check what's getting through.",
    tips: [
      "Lead every role with your numbers: quota attainment, revenue generated, deal size, or pipeline value — these are the first things both ATS and hiring managers look for.",
      "Name your CRM and sales tools explicitly (Salesforce, HubSpot, Outreach) rather than \"CRM software\".",
      "Match the job description's language for your sales motion — \"new business\", \"account management\" and \"business development\" aren't interchangeable keywords.",
      "Include methodology names if you've used them (SPIN, MEDDIC, Challenger) — they're often specifically screened for at senior levels.",
    ],
    keywords: [
      "Salesforce", "quota attainment", "pipeline management", "business development", "account management",
      "B2B sales", "negotiation", "lead generation", "CRM", "revenue growth",
    ],
  },
  {
    slug: "customer-service",
    title: "Free ATS Checker for Customer Service & Retail CVs",
    h1: "Free ATS Checker for Customer Service & Retail CVs",
    intro:
      "Customer service and retail roles often get the highest volume of applicants — which means ATS filtering matters even more. Check your CV against a real job description below.",
    tips: [
      "Name the specific systems you've used (POS systems, Zendesk, live chat platforms) rather than \"customer service software\".",
      "Quantify what you can: customer satisfaction scores, average handling time, sales targets hit, team size supervised.",
      "Match the job description's exact terms — \"customer service\", \"customer support\" and \"customer experience\" are scored separately, even though they sound similar.",
      "Mention availability and flexibility explicitly if the role calls for shift work — some ATS filters screen on this directly.",
    ],
    keywords: [
      "customer service", "POS systems", "conflict resolution", "upselling", "customer satisfaction",
      "team leadership", "stock management", "complaint handling", "Zendesk", "shift flexibility",
    ],
  },
  {
    slug: "administration",
    title: "Free ATS Checker for Admin & Office CVs",
    h1: "Free ATS Checker for Admin & Office CVs",
    intro:
      "Admin and office support roles are judged on software fluency and organisational scope as much as anything else. Check your CV against a real job description below.",
    tips: [
      "List every piece of software by name — Microsoft Office (and which parts: Excel, Outlook calendar management, PowerPoint), Google Workspace, specific booking or CRM systems.",
      "Quantify scope: number of calendars managed, team size supported, volume of correspondence handled, budget administered.",
      "Match the job description's exact title for your role — \"administrator\", \"coordinator\", \"PA\" and \"office manager\" are treated as distinct keywords even when duties overlap.",
      "Include typing speed, shorthand, or specific certifications (e.g. ECDL) if the listing mentions them — these are commonly literal keyword checks.",
    ],
    keywords: [
      "Microsoft Office", "diary management", "minute taking", "office administration", "scheduling",
      "data entry", "correspondence", "stakeholder liaison", "Excel", "organisational skills",
    ],
  },
];

export function getAtsCheckerPage(slug: string): AtsCheckerPage | undefined {
  return ATS_CHECKER_PAGES.find((p) => p.slug === slug);
}
