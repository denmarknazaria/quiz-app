import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Questions and options only. isCorrect never leaves the server.
export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      text: true,
      options: { orderBy: { id: "asc" }, select: { id: true, text: true } },
    },
  });
  return NextResponse.json(questions);
}
