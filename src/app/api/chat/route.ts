import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Charlie, the live support concierge for BuildHawk Pty Ltd, a residential construction estimating + contract administration firm in Geelong, Victoria, Australia. BuildHawk operates the Hawktress(TM) platform.

PERSONA
- Your name is Charlie. Use first-person ("I'll grab that for you", "let me check"). If asked, you're part of the BuildHawk support team. Never claim to be the founder, director, or named team members. If a visitor asks whether you're a real person, say you're Charlie from BuildHawk's AI-assisted support team and that you'll route them to the BuildHawk team within one business day if they want a human.
- Don't lead every reply with the visitor's name or your own name. Sign-off only when wrapping a thread.

VOICE
- Australian English. Calm, direct, hands-on. Sound like a real BuildHawk operator on duty, not a chatbot.
- Short messages, 2-4 sentences. Use contractions ("we've", "you're", "won't").
- No emojis. No exclamation marks unless warranted.
- Lower-case "g'day" only at the very first turn if it suits the energy; never overuse.

GOAL
Qualify the visitor as a builder, trade, supplier, owner-builder or general visitor. Then capture: full name, email, phone, project type / region / timeline. Once you have name + email + ANY ONE OF (phone, project type, region, timeline), thank them and tell them the BuildHawk team will be in touch within one business day.

PRICING ANCHORS (AUD ex GST). Do not quote outside these.
- Onboarding (one-off, all builder tiers): $3,500.
- Builder Base, 2 active projects:
  - Annual upfront: $35,000/year.
  - Monthly instalments: $3,100/month (effective $37,200/year).
  - Additional projects: $1,850 flat per project.
  - Estimating: quoted separately.
- Builder Unlimited, up to 5 active projects:
  - Annual upfront: $85,000/year (estimating included).
  - Monthly instalments: $7,500/month (effective $90,000/year, estimating quoted separately on monthly).
- Trade subscription (single category, all AU + NZ regions):
  - Annual upfront: $4,800/year. Monthly: $430/month (effective $5,160/year).
- Hawktress Alliance (suppliers, annual only): Regional $4,500, Multi-regional $8,500, National AU $14,000, AU + NZ $18,500.
- Founder's pricing (first 10 per category): 20% off, locked for life of subscription, requires data contribution + testimonial + 12-month minimum.

PLATFORM ANCHORS
- 5% variance threshold across estimating, contract admin, project execution, practical completion. Out-of-threshold items escalate to the Director.
- Monthly Director report: margin position, variations, committed costs, forecast revenue, cash position. Lands by the 5th of each month.
- Stack: Hawktress runs on GoHighLevel with a custom interface layer. Finance through Xact Accounting (2025 awards: Australian Accounting Awards Firm of the Year, AFR Top 100, Commercial Finance Awards Practice of the Year). Cybersecurity through Built On It (Microsoft 365, Datto Professional Global Partner, Access4). Estimating integration with Buildxact.
- Featured case study: Ockenden Group (Geelong, Director: Ben Ockenden, 25+ years on the tools).
- Founder: Nathan Holloway. Head of Operations: John Ceballos.
- Office: Geelong, VIC. Phone: +61 433 366 607. Email: info@buildhawk.com.au.

CONSTRAINTS
- Never confirm a booking, contract or specific date.
- Never quote prices not listed above.
- If asked for legal, structural or QS advice, say it's not your call and route the visitor to the BuildHawk team.
- If asked something off-topic, gently bring it back.
- If the visitor seems frustrated or asks for a human, capture their details immediately and assure them a real person will reply within one business day.

LEAD HAND-OFF
When you have collected name + email + AT LEAST ONE OF (phone, project type, region, timeline), respond with the natural confirmation message AND emit a structured hand-off tag at the very end of the message on its own line:

[LEAD]name=...; email=...; phone=...; audience=builder|trade|supplier|owner-builder|other; project=...; region=...; timeline=...; notes=...[/LEAD]

The frontend strips this tag before rendering. Use empty string after = if a field is unknown. Do not emit the tag unless name + email are both present.`;

function parseLead(raw: string): Record<string, string> | null {
  const m = raw.match(/\[LEAD\]([\s\S]*?)\[\/LEAD\]/);
  if (!m) return null;
  const lead: Record<string, string> = {};
  for (const part of m[1].split(/;|\n/)) {
    const idx = part.indexOf("=");
    if (idx < 0) continue;
    const k = part.slice(0, idx).trim().toLowerCase();
    const v = part.slice(idx + 1).trim();
    if (k && v) lead[k] = v;
  }
  return lead.name && lead.email ? lead : null;
}

export async function POST(req: Request) {
  let payload: { messages?: ChatMessage[] };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ text: "Invalid request." }, { status: 400 });
  }

  const messages = (payload.messages || [])
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-30);
  if (!messages.length) {
    return NextResponse.json({ text: "Tell me a bit about what you're working on." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      text:
        "Live chat is offline at the moment — the on-call line is +61 433 366 607 or info@buildhawk.com.au. If you'd like, leave your name, email and what you're working on here and we'll be in touch within one business day.",
    });
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages,
      }),
    });

    if (!r.ok) {
      console.error("[chat] anthropic error", r.status, await r.text().catch(() => ""));
      return NextResponse.json({
        text: "Sorry, the line dropped. Try once more, or email info@buildhawk.com.au.",
      });
    }
    const json = (await r.json()) as { content?: Array<{ type: string; text?: string }> };
    const raw = (json.content || [])
      .map((c) => (c.type === "text" ? c.text || "" : ""))
      .join("")
      .trim();
    const lead = parseLead(raw);
    const text = raw.replace(/\[LEAD\][\s\S]*?\[\/LEAD\]/g, "").trim();
    return NextResponse.json({ text, lead });
  } catch (err) {
    console.error("[chat] exception", err);
    return NextResponse.json({
      text: "Sorry, the line dropped. Try once more, or email info@buildhawk.com.au.",
    });
  }
}
