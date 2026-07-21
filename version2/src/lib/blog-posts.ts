export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-tailor-a-cv-to-a-job-description",
    title: "How to Tailor Your CV to a Job Description",
    description:
      "Sending the same CV to every job is the single biggest reason good candidates get filtered out. Here's what tailoring actually means.",
    date: "2026-06-02",
    body: [
      "Most people either send one generic CV to every job, or spend an hour rewriting it from scratch each time. Both are wrong. Tailoring is smaller and more mechanical than it sounds: it's about matching the language of the job description, not rewriting your career.",
      "Start with the job description itself. Read it twice and underline the recurring nouns — the tools, the responsibilities, the seniority signals. Job descriptions repeat what they actually care about, whether or not it's the most important skill on paper.",
      "Then look at your CV's summary and top bullet points. These are what get read first, by a human or a keyword scanner. If the words you underlined don't appear anywhere near the top of your CV, that's the gap to close — using experience you genuinely have, described in the job description's terms.",
      "Don't touch your job titles, dates, or employers. Tailoring is about emphasis and language, not fabrication. If a job description asks for something you've never done, the honest move is to not claim it, not to quietly slip it in.",
      "Finally, re-check length and structure. A tailored CV should still be scannable in ten seconds: clear section headers, consistent bullet formatting, no walls of text. Tailoring the words and ignoring the shape defeats the purpose.",
    ],
  },
  {
    slug: "beating-ats-systems-what-actually-matters",
    title: "Beating ATS Systems: What Actually Matters",
    description:
      "Applicant tracking systems get a lot of superstition. Here's what genuinely affects whether your CV gets past one.",
    date: "2026-06-09",
    body: [
      "Most advice about ATS systems is exaggerated. They don't reject CVs for using tables, and they don't have some secret blacklist of words. What they actually do, in the vast majority of cases, is index your CV's text and rank it by keyword overlap with the job description, then show a recruiter the top matches first.",
      "That means the highest-leverage thing you can do is make sure the exact terms from the job posting — tool names, certifications, job-title language — appear somewhere in your CV, assuming you genuinely have that experience.",
      "Formatting still matters, but for a simpler reason: if your CV can't be parsed into plain text cleanly, none of your keywords get indexed at all. Stick to standard section headers, avoid text inside images or complex multi-column graphics, and export to PDF from a tool that produces real selectable text, not a scanned image.",
      "Beyond that, most of what determines whether you get an interview is the human reading it after the ATS ranking — which is why tailoring your CV's actual content, not just gaming keyword density, is what moves the needle.",
    ],
  },
  {
    slug: "cv-vs-resume-whats-the-difference",
    title: "CV vs Resume: What's the Difference?",
    description:
      "The terms get used interchangeably, but the expected length, content, and audience genuinely differ by region and industry.",
    date: "2026-06-16",
    body: [
      "In the UK, Ireland, and most of Europe, \"CV\" is the standard term for the one-to-two-page document you send with a job application — functionally what Americans call a resume.",
      "In the US and Canada, \"CV\" specifically means a longer, comprehensive academic document — used for research, teaching, and postdoctoral positions — listing publications, grants, and academic history in full, with no length limit. A US \"resume\" is the short, targeted document.",
      "If you're applying outside your home region, match local convention rather than translating literally. A UK candidate applying to a US company should send a resume-style document unless the role is academic; a US academic applying in the UK for a research post should expect \"CV\" to mean the long-form document, not the short one.",
      "The practical takeaway: when a job posting says \"CV,\" check the country and industry before assuming which format they mean.",
    ],
  },
  {
    slug: "what-to-put-on-a-cv-the-complete-checklist",
    title: "What to Put on a CV: The Complete Checklist",
    description:
      "The sections that belong on almost every CV, and the ones that are optional depending on your situation.",
    date: "2026-06-23",
    body: [
      "Every CV needs, at minimum: your name and contact details, a short summary or profile statement, work experience in reverse-chronological order, education, and a skills section. That's the core structure most ATS parsers and human readers expect.",
      "Your summary should be three to four lines, not a paragraph — what you do, your strongest relevant skill, and what you're looking for. Skip generic filler like \"hard-working team player\"; be specific about the actual work.",
      "For each role in your experience section, lead with what you achieved, not just what you were responsible for. \"Reduced page load time by 40%\" tells an interviewer more than \"responsible for site performance.\"",
      "Optional sections worth including if relevant: certifications, notable projects, languages, and — for early-career candidates with limited work history — a slightly expanded education section covering relevant coursework or academic projects.",
      "Sections to leave off unless specifically asked: a photo (illegal to require in most English-speaking hiring markets and can introduce bias), references (\"available on request\" is assumed, don't waste space), and hobbies, unless genuinely relevant to the role or a strong conversation starter.",
    ],
  },
  {
    slug: "how-long-should-a-cv-be",
    title: "How Long Should a CV Be?",
    description:
      "One page, two pages, or more — the real answer depends on your experience level, not a universal rule.",
    date: "2026-06-30",
    body: [
      "The safest default for most candidates is two pages. Long enough to show real substance, short enough that a recruiter will actually read the whole thing.",
      "If you're early career — under three years of experience — one page is usually enough, and padding it to two with weak content hurts more than it helps. Recruiters can tell the difference between substance and filler.",
      "If you're senior, with ten-plus years or multiple significant roles, two to three pages is reasonable, but every section still needs to earn its place. The instinct to list every project from every job going back two decades usually makes a CV harder to read, not more impressive — prioritize relevance to the specific role over completeness.",
      "The one length rule that's actually universal: never let formatting decide the page count. If your CV spills onto a near-empty third page because of one long bullet point, tighten the wording rather than accept the extra page.",
    ],
  },
  {
    slug: "cover-letters-that-dont-sound-generic",
    title: "How to Write a Cover Letter That Doesn't Sound Generic",
    description:
      "Most cover letters restate the CV in paragraph form. Here's what actually makes one worth reading.",
    date: "2026-07-07",
    body: [
      "A cover letter's job isn't to summarize your CV — the reader already has that. Its job is to answer one question the CV can't: why this role, at this company, specifically, and why you.",
      "The generic opener (\"I am writing to apply for...\") wastes the one paragraph you're guaranteed will be read. Open with the specific thing that connects you to the role — a project the company shipped that you'd want to work on, a problem in the job description you've solved before, anything that couldn't be copy-pasted into a different application.",
      "Pick one or two achievements from your CV and go one level deeper than the bullet point allows — the context, the decision you made, the actual outcome. A cover letter that just re-lists three bullet points from the CV in sentence form has added nothing.",
      "Address it to an actual name whenever you can find one. \"Dear Hiring Manager\" isn't wrong, but a name signals you did five minutes of research most applicants skip.",
      "Keep it under a page, ideally three to four short paragraphs. A cover letter's length should be inversely proportional to how well-known the company is — a well-known company gets a shorter, sharper letter; a niche role you're genuinely excited about can support a bit more detail on why.",
    ],
  },
  {
    slug: "common-interview-questions-how-to-answer-them",
    title: "Common Interview Questions and How to Actually Answer Them",
    description:
      "\"Tell me about yourself\" and \"what's your biggest weakness\" trip people up every time. Here's a working approach to each.",
    date: "2026-07-14",
    body: [
      "\"Tell me about yourself\" isn't an invitation to recite your CV chronologically. The strongest answers are a 60-90 second arc: where you are now, the thread connecting your last couple of roles, and why that leads to this one. Practice it out loud — it's the question people prepare least for despite being asked it almost every time.",
      "\"What's your biggest weakness\" is really asking whether you're self-aware and whether you do anything about the gaps you have. A real weakness with a concrete thing you're doing about it beats a humble-brag disguised as a weakness (\"I work too hard\") every time — interviewers have heard the humble-brag version hundreds of times and it reads as evasive.",
      "Behavioral questions (\"tell me about a time you...\") reward structure over eloquence. State the situation in one sentence, the specific action you took (not \"we\" — what did you do), and the measurable-if-possible result. Rambling through the backstory before getting to what you actually did is the most common way these answers go wrong.",
      "\"Why do you want to work here\" is checking whether you've done any research at all. A specific answer — something about the product, the team's recent work, the problem space — beats anything generic about \"growth opportunities,\" which could apply to any company.",
      "For technical or role-specific questions, thinking out loud is usually worth more than a fast right answer. Interviewers are often assessing how you approach a problem, not just whether you land on the correct one.",
    ],
  },
  {
    slug: "should-you-list-every-job-youve-ever-had",
    title: "Should You List Every Job You've Ever Had?",
    description:
      "No — and knowing what to leave off is as important as knowing what to include.",
    date: "2026-07-16",
    body: [
      "A CV isn't a legal record of your employment history — it's a pitch for a specific role. Every job you list should be earning its place by making the case for the role you're applying to now.",
      "As a rough guide, the last ten to fifteen years of relevant experience is usually enough. Older roles, especially ones unrelated to your current direction, can be condensed into a single \"Earlier career\" line with job titles and dates, rather than full bullet-pointed entries.",
      "Short stints — a role you left after a few months — don't need to be hidden, but they also don't need the same detail as a three-year role. One line explaining what it was is usually enough; over-explaining a short stint often draws more attention to it than leaving it plain.",
      "The exception: if an older or shorter role is the single most relevant thing you've done for this specific application, it's fine to give it more space than its recency would otherwise justify. Relevance beats recency when the two conflict.",
      "What you leave off entirely should be roles that add nothing to the story you're telling — not because they're something to hide, but because a CV that includes everything reads as a CV that hasn't been edited.",
    ],
  },
  {
    slug: "how-to-explain-a-career-gap-on-your-cv",
    title: "How to Explain a Career Gap on Your CV",
    description:
      "Gaps are far more common — and far less disqualifying — than most candidates assume.",
    date: "2026-07-18",
    body: [
      "The instinct to hide a gap by fudging dates almost always backfires — it's easy to spot and turns a non-issue into a trust issue. A clearly stated gap is far less costly than a vague one that looks like it's being concealed.",
      "You don't owe a detailed personal explanation on the CV itself. A single honest line is enough: \"Career break — caregiving,\" \"Career break — travel,\" \"Redundancy, active job search.\" Save the fuller story, if you want to tell it, for the interview, where tone and context land better than a CV bullet point.",
      "If you did anything during the gap that's remotely relevant — freelance work, a course, volunteering, an independent project — it belongs on the CV as its own line, not folded quietly into the explanation. It shows the time wasn't idle, which is usually the underlying concern an interviewer has.",
      "For longer gaps, a brief \"what I'm looking for now\" note in your summary can preempt the question productively — framing the gap as background to your current search rather than something the reader has to ask about.",
      "Most interviewers have either had a gap themselves or hired someone who has. The honest, brief approach reads as confidence; an over-long justification tends to read as anxiety about the gap, which draws more attention to it than the gap itself would.",
    ],
  },
  {
    slug: "soft-skills-vs-hard-skills-what-to-include",
    title: "Soft Skills vs Hard Skills: What to Include and How",
    description:
      "Both matter, but they need to be shown differently on a CV — and one of them is far more commonly done badly.",
    date: "2026-07-19",
    body: [
      "Hard skills — languages, tools, certifications, technical methods — belong in a dedicated skills section, scannable at a glance, and ideally matched to the exact terms used in the job description.",
      "Soft skills — communication, leadership, adaptability — are the ones people get wrong most often, because listing them as bare words (\"strong communicator,\" \"team player\") is nearly worthless. Anyone can claim any soft skill; a CV that lists them without evidence tells an interviewer nothing they can trust.",
      "The fix is to demonstrate soft skills through your experience bullets instead of naming them directly. \"Led a cross-functional team of 8 through a product launch\" shows leadership and collaboration without ever using either word — and it's far more convincing than the word alone.",
      "A short list of bare soft-skill words is still worth keeping in some form for ATS keyword matching, since some systems and recruiters do scan for them — but treat that list as a supplement to the evidence in your experience section, never a replacement for it.",
      "If you're unsure which soft skills to emphasize, work backward from the job description: it usually states directly what the employer cares about (\"works well under pressure,\" \"strong stakeholder management\") — match your strongest genuine examples to those specific phrases rather than guessing.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
