"use client";

import { useState } from "react";

type Option = { id: number; text: string };
type Question = { id: number; text: string; options: Option[] };
type ReviewItem = {
  questionId: number;
  text: string;
  pickedText: string | null;
  correctText: string;
  isRight: boolean;
};
type Result = { score: number; total: number; review: ReviewItem[] };

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function Quiz() {
  const [phase, setPhase] = useState<"start" | "quiz" | "done">("start");
  const [name, setName] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function start() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/questions");
      if (!res.ok) throw new Error();
      const data: Question[] = await res.json();
      if (data.length === 0) {
        setError("No questions found.");
        return;
      }
      setQuestions(data);
      setIndex(0);
      setAnswers({});
      setResult(null);
      setPhase("quiz");
    } catch {
      setError("Can't load questions. Check your database connection.");
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          answers: Object.entries(answers).map(([questionId, optionId]) => ({
            questionId: Number(questionId),
            optionId,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
      setPhase("done");
    } catch {
      setError("Could not submit. Try again.");
    } finally {
      setBusy(false);
    }
  }

  
  if (phase === "start") {
    return (
      <main className="card card-sm">
        <div className="card-header">
          <h1>Quiz App</h1>
          <p>Enter your name to start. Your score will be saved.</p>
        </div>
        <div className="card-body">
          <form onSubmit={(e) => { e.preventDefault(); start(); }}>
            <div className="field">
              <label htmlFor="player-name">Your name</label>
              <input
                id="player-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                autoComplete="name"
                placeholder=""
                required
              />
            </div>
            <div className="actions start">
              <button className="btn btn-primary" disabled={busy || !name.trim()}>
                {busy ? "Loading…" : "Start quiz" }
              </button>
            </div>
          </form>
          {error && <p role="alert" className="error">{error}</p>}
        </div>
      </main>
    );
  }

  
  if (phase === "quiz") {
    const q = questions[index];
    const picked = answers[q.id];
    const last = index === questions.length - 1;
    const pct = Math.round(((index + (picked !== undefined ? 1 : 0)) / questions.length) * 100);

    return (
      <main className="card card-md">
        <div className="card-header">
          <h1>Quiz App</h1>
        </div>
        <div className="card-body">
          <div className="progress-bar">
            <div className="progress-label">
              <span>Question {index + 1} / {questions.length}</span>
              <span>{pct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="dots" role="img" aria-label={`Item ${index + 1} of ${questions.length}`}>
              {questions.map((item, i) => (
                <span
                  key={item.id}
                  className={`dot${answers[item.id] !== undefined ? " done" : ""}${i === index ? " now" : ""}`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>

          <div className="question-num">Question {index + 1}</div>
          <h2 id="question" className="question-text">{q.text}</h2>

          <div role="radiogroup" aria-labelledby="question" className="options">
            {q.options.map((o, i) => (
              <label key={o.id} className={`option${picked === o.id ? " selected" : ""}`}>
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={picked === o.id}
                  onChange={() => setAnswers({ ...answers, [q.id]: o.id })}
                />
                <span className="bubble" aria-hidden="true">{LETTERS[i]}</span>
                <span className="option-text">{o.text}</span>
              </label>
            ))}
          </div>

          <div className="actions">
            <button
              className="btn btn-primary"
              disabled={picked === undefined || busy}
              onClick={last ? submit : () => setIndex(index + 1)}
            >
              {last ? (busy ? "Submitting…" : "Submit →") : "Next →"}
            </button>
          </div>
          {error && <p role="alert" className="error">{error}</p>}
        </div>
      </main>
    );
  }
  
  /* results */
  const score = result?.score ?? 0;
  const total = result?.total ?? 0;
  const isPerfect = score === total;
  const isPassed = score >= total * 0.75;
  const verdict = isPerfect ? "Perfect score!" : isPassed ? "Passed" : "Review & retry";
  const verdictClass = isPerfect ? "perfect" : isPassed ? "passed" : "retry";

  return (
    <main className="card card-lg">
      <div className="card-header">
        <h1>Results — {name.trim()}</h1>
      </div>
      <div className="card-body">
        <div className="score-badge" role="img" aria-label={`Score ${score} of ${total}. ${verdict}`}>
          <span className="score-number">{score}/{total}</span>
          <span className={`score-verdict ${verdictClass}`}>{verdict}</span>
        </div>
        
        <div className="actions start">
          <button className="btn btn-secondary" onClick={() => setPhase("start")}>
             Try again
          </button>
        </div>
      </div>
    </main>
  );
}
