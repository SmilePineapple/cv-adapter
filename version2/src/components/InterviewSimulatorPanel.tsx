"use client";

import { useState } from "react";

type Turn = { question: string; answer: string };

type Feedback = {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
};

export default function InterviewSimulatorPanel({ generationId }: { generationId: string }) {
  const [started, setStarted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Turn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);

  async function callApi(payload: object) {
    const res = await fetch("/api/interview-simulator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
    return data;
  }

  async function handleStart() {
    setStarted(true);
    setPending(true);
    setError(null);

    try {
      const data = await callApi({ history: [] });
      setCurrentQuestion(data.nextQuestion);
      setPending(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPending(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!answer.trim() || !currentQuestion) return;
    setPending(true);
    setError(null);

    try {
      const data = await callApi({
        history,
        currentQuestion,
        currentAnswer: answer,
      });
      setCurrentFeedback(data.feedback);
      setHistory((prev) => [...prev, { question: currentQuestion, answer }]);
      setCurrentQuestion(data.nextQuestion);
      setDone(data.done);
      setAnswer("");
      setPending(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPending(false);
    }
  }

  function handleNext() {
    setCurrentFeedback(null);
  }

  if (!started) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-medium">Interview Simulator</h3>
        <p className="mt-1 text-sm text-muted">
          A live, one-question-at-a-time mock interview for this role — answer
          each question and get feedback before moving to the next.
        </p>
        <button
          onClick={handleStart}
          disabled={pending}
          className="mt-4 min-h-[44px] rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Starting…" : "Start mock interview"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="font-medium">Interview Simulator</h3>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {currentFeedback && (
        <div className="mt-4 space-y-3 rounded-xl border border-border bg-background p-4">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-accent">
              {currentFeedback.score}/10
            </span>
          </div>
          <p className="text-sm leading-relaxed">{currentFeedback.feedback}</p>
          {currentFeedback.improvements.length > 0 && (
            <ul className="space-y-1 text-xs text-muted">
              {currentFeedback.improvements.map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">•</span> {s}
                </li>
              ))}
            </ul>
          )}
          {!done && (
            <button
              onClick={handleNext}
              className="min-h-[36px] rounded-full border border-border px-4 py-1.5 text-xs font-medium transition-colors hover:border-foreground/40"
            >
              Next question
            </button>
          )}
        </div>
      )}

      {done && !currentFeedback && (
        <p className="mt-4 text-sm text-accent">
          Interview complete — {history.length} questions answered. Nice work.
        </p>
      )}

      {!currentFeedback && !done && currentQuestion && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium">
            Question {history.length + 1}: {currentQuestion}
          </p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder="Type your answer as you'd say it out loud…"
            aria-label={`Your answer to: ${currentQuestion}`}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent"
          />
          <button
            onClick={handleSubmitAnswer}
            disabled={pending || !answer.trim()}
            className="min-h-[44px] rounded-full bg-accent px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Evaluating…" : "Submit answer"}
          </button>
        </div>
      )}

      {pending && !currentQuestion && !done && (
        <p className="mt-4 text-sm text-muted">Loading first question…</p>
      )}
    </div>
  );
}
