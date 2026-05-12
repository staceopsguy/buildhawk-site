import { NextResponse } from "next/server";
import { generatePortfolioBrief, isAiConfigured } from "@/lib/intelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

type PortfolioContext = Parameters<typeof generatePortfolioBrief>[0];

export async function POST(req: Request) {
  if (!isAiConfigured()) {
    return NextResponse.json(
      { ok: false, error: "AI not configured. Set ANTHROPIC_API_KEY in Vercel env." },
      { status: 503 },
    );
  }
  let body: PortfolioContext;
  try {
    body = (await req.json()) as PortfolioContext;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const brief = await generatePortfolioBrief(body);
  if (!brief) {
    return NextResponse.json(
      { ok: false, error: "AI returned no usable brief. Try again in a moment." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, brief });
}
