"use client";

import { useState } from "react";

type Question = {
  id: string | null;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type CvOption = { id: string; label: string };

export default function SkillsQuizPanel({ cvOptions }: { cvOptions: CvOption[] }) {
  const [cvId, setCvId] = useState(cvOptions[0]?.id || "");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSubmitted(false);
    setAnswers({});

    try {
      const res = await fetch("/api/skills-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId: skills ? undefined : cvId, skills, jobTitle }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setPending(false);
        return;
      }

      setQuestions(data.questions);
      setAssessmentId(data.assessmentId);
      setPending(false);
    } catch {
      setError("Something went wrong. Please check your connection.");
      setPending(false);
    }
  }

  function handleSubmit() {
    setSubmitted(true);

    if (assessmentId && questions) {
      const answerPayload = questions
        .map((q, i) => ({ questionId: q.id, selectedIndex: answers[i] }))
        .filter((a): a is { questionId: string; selectedIndex: number } => !!a.questionId);

      if (answerPayload.length > 0) {
        fetch("/api/skills-assessment/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId, answers: answerPayload }),
        }).catch(() => {
          // Best-effort persistence — the results are already shown from
          // client-side scoring either way.
        });
      }
    }
  }

  const score = questions
    ? questions.reduce((sum, q, i) => (answers[i] === q.correctIndex ? sum + 1 : sum), 0)
    : 0;

  if (!questions) {
    return (
      <form onSubmit={handleGenerate} className="space-y-5">
        {cvOptions.length > 0 && (
          <div>
            <label htmlFor="cvSelect" className="mb-1.5 block text-sm font-medium">
              Test the skills from
            </label>
            <select
              id="cvSelect"
              value={cvId}
              onChange={(e) => setCvId(e.target.value)}
              disabled={!!skills}
              className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent disabled:opacity-50"
            >
              {cvOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="skills" className="mb-1.5 block text-sm font-medium">
            Or type skills to test {cvOptions.length > 0 && "(overrides the CV above)"}
          </label>
          <input
            id="skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, SQL, project management"
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label htmlFor="jobTitle" className="mb-1.5 block text-sm font-medium">
            Target role (optional)
          </label>
          <input
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full min-h-[44px] rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Generating quiz…" : "Start assessment"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {submitted && (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="font-display text-3xl tracking-tight text-accent">
            {score} / {questions.length}
          </p>
          <p className="mt-1 text-sm text-muted">correct</p>
        </div>
      )}

      {questions.map((q, i) => (
        <div key={i} className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-medium">
            {i + 1}. {q.question}
          </p>
          <div className="mt-3 space-y-2">
            {q.options.map((opt, oi) => {
              const isSelected = answers[i] === oi;
              const isCorrect = submitted && oi === q.correctIndex;
              const isWrongSelected = submitted && isSelected && oi !== q.correctIndex;
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((prev) => ({ ...prev, [i]: oi }))}
                  className={`block w-full rounded-lg border px-4 py-2.5 text-left text-sm transition-colors ${
                    isCorrect
                      ? "border-accent bg-accent/10"
                      : isWrongSelected
                        ? "border-red-400 bg-red-400/10"
                        : isSelected
                          ? "border-foreground/40"
                          : "border-border hover:border-foreground/30"
                  } disabled:cursor-default`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="mt-3 text-xs text-muted">{q.explanation}</p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Submit answers
        </button>
      )}

      {submitted && (
        <button
          type="button"
          onClick={() => {
            setQuestions(null);
            setAssessmentId(null);
            setAnswers({});
            setSubmitted(false);
          }}
          className="min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40"
        >
          Take another assessment
        </button>
      )}
    </div>
  );
}
