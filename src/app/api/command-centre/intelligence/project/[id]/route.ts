import { NextResponse } from "next/server";
import { getProjectById } from "@/lib/ghl-homesbynh";
import { generateProjectBrief, isAiConfigured } from "@/lib/intelligence";

export const runtime = "nodejs";
export const maxDuration = 60;

type Params = Promise<{ id: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!isAiConfigured()) {
    return NextResponse.json(
      { ok: false, error: "AI not configured. Set ANTHROPIC_API_KEY in Vercel env." },
      { status: 503 },
    );
  }
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing project id" }, { status: 400 });
  }
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
  }
  const brief = await generateProjectBrief(project, project.overlay);
  if (!brief) {
    return NextResponse.json(
      { ok: false, error: "AI returned no usable brief. Try again in a moment." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, brief });
}
