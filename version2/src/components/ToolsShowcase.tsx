import Link from "next/link";
import {
  Sparkles,
  FilePlus,
  CheckCircle2,
  Wrench,
  Flame,
  MessagesSquare,
  Target,
  Compass,
  Mail,
} from "lucide-react";

const tools = [
  {
    icon: Sparkles,
    title: "Tailor to a job",
    body: "Paste a job description and get a rewritten, ATS-safe version of your CV in seconds.",
    href: "/signup",
    tag: null,
  },
  {
    icon: FilePlus,
    title: "Build from scratch",
    body: "No CV to upload? Describe your background in your own words and we'll structure it into one.",
    href: "/signup",
    tag: null,
  },
  {
    icon: CheckCircle2,
    title: "Free ATS Checker",
    body: "Paste your CV and a job description, no account needed — get a match score and missing keywords.",
    href: "/ats-checker",
    tag: "Free, no account",
  },
  {
    icon: Wrench,
    title: "Fix my CV",
    body: "Get a specific AI review of a tailored version, then apply the improvements in one click.",
    href: "/signup",
    tag: null,
  },
  {
    icon: Flame,
    title: "Roast my CV",
    body: "A brutally honest (and genuinely funny) critique, if you want the unfiltered version.",
    href: "/signup",
    tag: null,
  },
  {
    icon: MessagesSquare,
    title: "Interview prep & simulator",
    body: "Get likely interview questions with model answers, or run a live one-question-at-a-time mock interview.",
    href: "/signup",
    tag: null,
  },
  {
    icon: Target,
    title: "Skills assessment",
    body: "A quick quiz built from your CV's skills, so you know what to brush up on before you apply.",
    href: "/signup",
    tag: null,
  },
  {
    icon: Compass,
    title: "Career coach",
    body: "Ask anything about your career — grounded in your actual CV, not generic advice.",
    href: "/signup",
    tag: null,
  },
  {
    icon: Mail,
    title: "Cover letters",
    body: "Generate a matching cover letter from any tailored CV, addressed to the right company.",
    href: "/signup",
    tag: null,
  },
];

export default function ToolsShowcase() {
  return (
    <section id="tools" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="max-w-lg font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Everything you need for one application — or fifty.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
          One account, one profile, every tool that touches your job search.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-foreground/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                <tool.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 font-medium">{tool.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                {tool.body}
              </p>
              {tool.tag && (
                <span className="mt-4 inline-flex w-fit items-center rounded-full border border-accent/40 px-2.5 py-1 text-xs text-accent">
                  {tool.tag}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
