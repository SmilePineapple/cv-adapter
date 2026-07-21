import Link from "next/link";

export const metadata = { title: "Help — MyCV Buddy" };

const FAQS = [
  {
    q: "What file formats can I upload?",
    a: "PDF and DOCX. We extract the text and use AI to split it into sections (summary, experience, education, skills, and so on).",
  },
  {
    q: "How does tailoring work?",
    a: "Paste a job title and description on any uploaded CV. AI rewrites your summary, experience and skills to emphasize what's relevant and mirror the job description's language — without inventing employers, dates or qualifications you didn't have.",
  },
  {
    q: "What's the difference between the ATS Checker and tailoring?",
    a: "The free ATS Checker (no account needed) scores how well your existing CV matches a job description and lists what's missing. Tailoring actually rewrites your CV to close those gaps and saves the result to your account.",
  },
  {
    q: "What does \"Fix my CV\" do?",
    a: "On any tailored version, it reviews the CV against the job description and suggests specific improvements. You can apply them with one click — we only save the update if it doesn't lower your keyword match score.",
  },
  {
    q: "What's \"Roast my CV\"?",
    a: "A just-for-fun comedic critique of your CV, with adjustable intensity and style. It doesn't change your CV or affect your ATS score — pure entertainment.",
  },
  {
    q: "Can I export as PDF and Word?",
    a: "Yes, both, from any tailored version. Pick from three visual templates (Classic, Modern, Two-Column) before exporting.",
  },
  {
    q: "Do you offer cover letters and interview prep?",
    a: "Yes. Generate a matching cover letter from any tailored CV, and interview prep with likely questions, why they're asked, and how to answer them based on your actual background.",
  },
  {
    q: "Is there a paid plan?",
    a: "Yes. Free accounts get 3 tailored CVs a month and PDF export. Pro is £2.99/month for unlimited tailored CVs, DOCX export, and every extra tool — Fix My CV, Roast My CV, Interview Prep, Interview Simulator, Skills Assessment, and Career Coach. Cover letters stay free either way.",
  },
  {
    q: "How do I delete my data?",
    a: "Delete individual CVs from your dashboard any time. To delete your whole account and all associated data, email support@mycvbuddy.com.",
  },
];

export default function HelpPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="font-display text-lg tracking-tight">
        mycv<span className="text-accent">buddy</span>
      </Link>

      <h1 className="mt-8 font-display text-3xl tracking-tight sm:text-4xl">
        Help &amp; FAQ
      </h1>

      <div className="mt-10 space-y-8">
        {FAQS.map((item) => (
          <div key={item.q}>
            <h2 className="text-base font-medium">{item.q}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.a}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted">
        Still stuck?{" "}
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-4"
        >
          Send us a message
        </Link>
        .
      </p>
    </main>
  );
}
