/**
 * Builder Intelligence, Anthropic-powered briefs for the Cost Plan Console.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY      Anthropic API key.
 *   BH_AI_MODEL            Optional model override (default: claude-sonnet-4-6).
 *
 * Output is structured JSON so the UI can render bullets, flags, and
 * recommendations consistently — no free-form prose to render.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { HbnhProject, ProjectOverlay } from "./ghl-homesbynh";

const MODEL = process.env.BH_AI_MODEL ?? "claude-sonnet-4-6";

export const isAiConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY);

const getClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
};

export type IntelligenceBullet = {
  text: string;
  tone?: "info" | "good" | "warn" | "bad";
};

export type IntelligenceBrief = {
  headline: string;
  summary: string;
  focusToday: IntelligenceBullet[];
  flags: IntelligenceBullet[];
  recommendations: IntelligenceBullet[];
  confidence: "high" | "medium" | "low";
  generatedAt: string;
};

const SYSTEM_PROMPT = `You are Hawktress, BuildHawk's builder intelligence engine.

Your job: read estimate workbook data for an Australian / NZ residential builder and produce a concise, director-grade cost intelligence brief. Anchor language to "Precision Estimating. Disciplined Delivery." Refer to projects as estimates or engagements.

Rules:
- Plain Australian English. No emojis. No em dashes (use commas or periods).
- Currency in AUD. Round to nearest $1,000 in prose.
- Each bullet under 22 words.
- If a number is concerning, say what to do about it.
- Never invent figures that aren't in the input. If a field is empty, say "no data".
- Margin tolerance: target margin minus 2 percentage points triggers a "warn"; minus 5 triggers "bad".
- Variance threshold against Hawktress regional benchmark is 5%.
- Stay factual. No hype. Sound like an analyst, not a marketer.

Output STRICT JSON matching this shape, no markdown fences, no extra prose:

{
  "headline": "Short headline (under 60 chars)",
  "summary": "1 to 2 sentence summary of the state of the cost plan or estimate",
  "focusToday": [{"text":"...", "tone":"info|good|warn|bad"}, ...],
  "flags": [{"text":"...", "tone":"warn|bad"}, ...],
  "recommendations": [{"text":"...", "tone":"info|good"}, ...],
  "confidence": "high|medium|low"
}

Confidence reflects how much real workbook data backed your analysis. If most fields are empty, confidence is low.`;

const safeJson = (text: string): unknown => {
  // Anthropic sometimes wraps JSON in code fences despite instructions; strip.
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const parseBrief = (raw: unknown): IntelligenceBrief | null => {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const bullets = (key: string): IntelligenceBullet[] => {
    const arr = r[key];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((b) => (b && typeof b === "object" ? (b as Record<string, unknown>) : null))
      .filter(Boolean)
      .map((b) => ({
        text: typeof b!.text === "string" ? b!.text : "",
        tone:
          b!.tone === "good" || b!.tone === "warn" || b!.tone === "bad" || b!.tone === "info"
            ? (b!.tone as IntelligenceBullet["tone"])
            : "info",
      }))
      .filter((b) => b.text.length > 0)
      .slice(0, 8);
  };
  const headline = typeof r.headline === "string" ? r.headline : "";
  const summary = typeof r.summary === "string" ? r.summary : "";
  const confidence =
    r.confidence === "high" || r.confidence === "medium" || r.confidence === "low"
      ? r.confidence
      : "medium";
  if (!headline || !summary) return null;
  return {
    headline,
    summary,
    focusToday: bullets("focusToday"),
    flags: bullets("flags"),
    recommendations: bullets("recommendations"),
    confidence: confidence as IntelligenceBrief["confidence"],
    generatedAt: new Date().toISOString(),
  };
};

/* ------------------------------------------------------------------
 * Cost Plan brief, across all active estimates.
 * ----------------------------------------------------------------- */

type PortfolioContext = {
  builder: string;
  region: string;
  projectCount: number;
  totalContract: number;
  totalCommitted: number;
  totalInvoiced: number;
  blendedMargin: number;
  targetMargin: number;
  debtor90Plus: number;
  netCash90: number;
  projects: Array<{
    id: string;
    name: string;
    region: string;
    type: string;
    budget: number;
    committed: number;
    invoiced: number;
    percentComplete: number;
    liveMargin: number;
    targetMargin: number;
    status: string;
    flags: number;
  }>;
};

export async function generatePortfolioBrief(
  context: PortfolioContext,
): Promise<IntelligenceBrief | null> {
  const client = getClient();
  if (!client) return null;

  const userPrompt = `Builder: ${context.builder}
Primary region: ${context.region}
Active estimates: ${context.projectCount}
Total contract value: $${context.totalContract.toLocaleString("en-AU")}
Committed cost: $${context.totalCommitted.toLocaleString("en-AU")}
Invoiced to date: $${context.totalInvoiced.toLocaleString("en-AU")}
Blended margin: ${context.blendedMargin.toFixed(1)}% (target ${context.targetMargin.toFixed(1)}%)
Debtor 90+ days: $${context.debtor90Plus.toLocaleString("en-AU")}
Forecast net cash next 90 days: $${context.netCash90.toLocaleString("en-AU")}

Estimate list:
${context.projects
  .map(
    (p) =>
      `- ${p.name} | ${p.region} | ${p.type} | $${p.budget.toLocaleString("en-AU")} contract | ${p.percentComplete}% complete | live margin ${p.liveMargin}% (target ${p.targetMargin}%) | status ${p.status}${p.flags ? ` | ${p.flags} flag(s)` : ""}`,
  )
  .join("\n")}

Produce the Cost Plan brief. Focus on what the director should do today, what is at risk on the cost plan, and one or two concrete recommendations. Confidence high if all estimates have margin data, medium if some, low if mostly placeholder.`;

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = resp.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");
    return parseBrief(safeJson(text));
  } catch (e) {
    console.error("[intelligence] cost plan brief error:", e);
    return null;
  }
}

/* ------------------------------------------------------------------
 * Ask Hawktress, natural-language Q&A grounded in cost plan context.
 * Module 4.10 of Product Spec v1.1.
 * ----------------------------------------------------------------- */

export type AskAnswer = {
  answer: string;
  citations: { kind: "project" | "metric" | "policy"; ref: string; note?: string }[];
  confidence: "high" | "medium" | "low";
};

const ASK_SYSTEM_PROMPT = `You are Hawktress, BuildHawk's natural-language Cost Plan Console Q&A.

Rules:
- Plain Australian English. No emojis. No em dashes. AUD currency.
- Ground every claim in the data provided. Cite the estimate, metric, or policy.
- If you cannot answer with the data given, say so. Suggest where to look.
- Never invent figures. If a number isn't in the input, say "no data".
- "Suggest, never auto-apply": you may recommend, never claim a decision was made on the user's behalf.
- Keep answers under 120 words. Be a senior analyst, not a chatbot.

Output STRICT JSON, no markdown, no fences:

{
  "answer": "Direct answer in plain English",
  "citations": [{"kind":"project|metric|policy", "ref":"<short label>", "note":"<optional 12-word note>"}, ...],
  "confidence": "high|medium|low"
}`;

type AskContext = {
  question: string;
  builder: string;
  region: string;
  projectCount: number;
  totalContract: number;
  blendedMargin: number;
  targetMargin: number;
  projects: Array<{
    id: string;
    name: string;
    region: string;
    type: string;
    budget: number;
    committed: number;
    invoiced: number;
    percentComplete: number;
    liveMargin: number;
    targetMargin: number;
    status: string;
  }>;
};

export async function answerQuestion(ctx: AskContext): Promise<AskAnswer | null> {
  const client = getClient();
  if (!client) return null;
  if (!ctx.question || ctx.question.length > 600) return null;

  const userPrompt = `Question: ${ctx.question}

Builder: ${ctx.builder} (${ctx.region})
Active estimates: ${ctx.projectCount}
Total contract: $${ctx.totalContract.toLocaleString("en-AU")}
Blended margin: ${ctx.blendedMargin.toFixed(1)}% (target ${ctx.targetMargin.toFixed(1)}%)

Estimates:
${ctx.projects
  .slice(0, 30)
  .map(
    (p) =>
      `- ${p.name} | ${p.region} | ${p.type} | $${p.budget.toLocaleString("en-AU")} | ${p.percentComplete}% complete | margin ${p.liveMargin}% (target ${p.targetMargin}%) | ${p.status}`,
  )
  .join("\n")}

Policies in effect:
- Variance threshold: 5% above regional benchmark triggers a flag.
- Director approval threshold: configured per estimate.
- Anonymisation: insufficient-data response if fewer than 5 estimates in benchmark sample.
- "Suggest, never auto-apply" for AI outputs.

Answer the question.`;

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 600,
      system: ASK_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = resp.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");
    const raw = safeJson(text);
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const citations = Array.isArray(r.citations)
      ? r.citations
          .filter((c): c is Record<string, unknown> => !!c && typeof c === "object")
          .map((c) => ({
            kind:
              c.kind === "project" || c.kind === "metric" || c.kind === "policy"
                ? c.kind
                : "metric",
            ref: typeof c.ref === "string" ? c.ref : "",
            note: typeof c.note === "string" ? c.note : undefined,
          }))
          .filter((c) => c.ref.length > 0)
          .slice(0, 6)
      : [];
    const conf =
      r.confidence === "high" || r.confidence === "medium" || r.confidence === "low"
        ? (r.confidence as AskAnswer["confidence"])
        : "medium";
    const answer = typeof r.answer === "string" ? r.answer : "";
    if (!answer) return null;
    return { answer, citations: citations as AskAnswer["citations"], confidence: conf };
  } catch (e) {
    console.error("[intelligence] ask error:", e);
    return null;
  }
}

/* ------------------------------------------------------------------
 * Estimate brief, single engagement deep-dive.
 * ----------------------------------------------------------------- */

export async function generateProjectBrief(
  project: HbnhProject,
  overlay: ProjectOverlay | null,
): Promise<IntelligenceBrief | null> {
  const client = getClient();
  if (!client) return null;

  const o = overlay ?? {};
  const boqTotal = (o.boq ?? []).reduce(
    (a, l) =>
      a +
      (l.qty ?? 0) *
        ((l.labourRate ?? 0) + (l.materialRate ?? 0) + (l.subRate ?? 0)),
    0,
  );
  const cccCommitted = (o.costToComplete ?? []).reduce((a, l) => a + (l.committed ?? 0), 0);
  const cccSpent = (o.costToComplete ?? []).reduce((a, l) => a + (l.spentToDate ?? 0), 0);
  const cccForecast = (o.costToComplete ?? []).reduce(
    (a, l) => a + (l.forecastAtCompletion ?? 0),
    0,
  );
  const variations = o.variations ?? [];
  const openVOs = variations.filter(
    (v) => v.directorGate === "Pending" || v.status === "Pending director",
  );
  const flaggedTrades = (o.costToComplete ?? [])
    .filter((l) => (l.forecastAtCompletion ?? 0) > (l.budget ?? 0) * 1.05)
    .map(
      (l) =>
        `${l.tradeSection} forecast $${(l.forecastAtCompletion ?? 0).toLocaleString("en-AU")} vs budget $${(l.budget ?? 0).toLocaleString("en-AU")}`,
    );
  const risksHigh = (o.risks ?? []).filter(
    (r) => (r.likelihood ?? 0) * (r.impact ?? 0) >= 15,
  );

  const userPrompt = `Estimate: ${project.name}
Region: ${project.region}
Type: ${project.type}
Contract value: $${project.budget.toLocaleString("en-AU")}
Stage: ${project.derivedStatus} (${project.percentComplete}% complete)
Target margin: ${o.targetMarginPct ?? 17}%
Live margin: ${o.liveMarginPct ?? "not entered"}

Workbook entered:
- BOQ lines: ${(o.boq ?? []).length}, total $${boqTotal.toLocaleString("en-AU")}
- RFQs: ${(o.rfqs ?? []).length}, open: ${(o.rfqs ?? []).filter((r) => r.status !== "Validated" && r.status !== "Declined").length}
- Awarded subs: ${(o.awardedSubs ?? []).length}, total $${(o.awardedSubs ?? []).reduce((a, s) => a + (s.awardedValue ?? 0), 0).toLocaleString("en-AU")}
- Variations: ${variations.length}, open for director: ${openVOs.length}
  Open VOs: ${openVOs.map((v) => `${v.voNumber ?? v.id} ${v.description ?? ""} cost $${(v.costImpact ?? 0).toLocaleString("en-AU")}`).join("; ") || "none"}
- Cost to complete entered for ${(o.costToComplete ?? []).length} trade(s). Committed $${cccCommitted.toLocaleString("en-AU")}, spent $${cccSpent.toLocaleString("en-AU")}, forecast $${cccForecast.toLocaleString("en-AU")}.
${flaggedTrades.length ? `  Trades over budget: ${flaggedTrades.join("; ")}` : ""}
- Claims raised: ${(o.claims ?? []).length}, paid: ${(o.claims ?? []).filter((c) => c.status === "Paid").length}
- Cashflow weeks entered: ${(o.cashflow ?? []).length}
- High-score risks: ${risksHigh.length}${risksHigh.length ? ` (${risksHigh.map((r) => r.description).filter(Boolean).join("; ")})` : ""}

Produce the Estimate brief. Director needs a fast read on margin position, what is decision-ready today, and what is brewing. Confidence high if most workbook fields entered, medium if half, low if mostly empty.`;

  try {
    const resp = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    const text = resp.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");
    return parseBrief(safeJson(text));
  } catch (e) {
    console.error("[intelligence] estimate brief error:", e);
    return null;
  }
}
