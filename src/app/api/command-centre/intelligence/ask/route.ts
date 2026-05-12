import { NextResponse } from "next/server";
import { answerQuestion, isAiConfigured } from "@/lib/intelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { ok: false, error: "AI not configured. Set ANTHROPIC_API_KEY in Vercel env." },
      { status: 503 },
    );
  }
  let body: Parameters<typeof answerQuestion>[0];
  try {
    body = (await req.json()) as Parameters<typeof answerQuestion>[0];
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.question || typeof body.question !== "string") {
    return NextResponse.json({ ok: false, error: "Missing question" }, { status: 400 });
  }
  const answer = await answerQuestion(body);
  if (!answer) {
    return NextResponse.json(
      { ok: false, error: "AI returned no usable answer." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, answer });
}
