import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  let body: {
    module?: string;
    kind?: string;
    refId?: number;
    score?: number;
    detail?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { module, kind, refId, score, detail } = body;
  if (
    !module ||
    !kind ||
    typeof refId !== "number" ||
    !Number.isFinite(refId)
  ) {
    return NextResponse.json({ error: "module, kind and refId are required" }, { status: 400 });
  }

  const attempt = await db.attempt.create({
    data: {
      module,
      kind,
      refId,
      score: typeof score === "number" ? score : null,
      detail: detail === undefined ? null : JSON.stringify(detail).slice(0, 4000),
    },
  });
  return NextResponse.json(attempt, { status: 201 });
}
