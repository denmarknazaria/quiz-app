import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Answer = { questionId: number; optionId: number };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim().slice(0, 40) || "Anonymous";
  const answers: Answer[] = Array.isArray(body?.answers) ? body.answers : [];

  const questions = await prisma.question.findMany({
    orderBy: { id: "asc" },
    include: { options: { orderBy: { id: "asc" } } },
  });

  const chosen = new Map(answers.map((a) => [a.questionId, a.optionId]));

  const review = questions.map((q) => {
    const correct = q.options.find((o) => o.isCorrect);
    const picked = q.options.find((o) => o.id === chosen.get(q.id));
    return {
      questionId: q.id,
      text: q.text,
      pickedText: picked?.text ?? null,
      correctText: correct?.text ?? "",
      isRight: picked?.isCorrect === true,
    };
  });

  const score = review.filter((r) => r.isRight).length;
  const total = questions.length;

  await prisma.attempt.create({ data: { name, score, total } });

  return NextResponse.json({ score, total, review });
}
