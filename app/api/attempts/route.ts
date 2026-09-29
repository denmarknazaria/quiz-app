import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Top 5 scores, best first, newest first on ties.
export async function GET() {
  const attempts = await prisma.attempt.findMany({
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take: 5,
  });
  return NextResponse.json(attempts);
}
