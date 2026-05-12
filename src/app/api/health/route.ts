import { NextResponse } from "next/server";

export const runtime = "nodejs";
// Always run fresh; never cache health checks.
export const dynamic = "force-dynamic";

/**
 * Lightweight uptime endpoint for external monitoring (Better Uptime, Pingdom,
 * UptimeRobot). Reports green/yellow based on whether critical env vars are
 * configured. Never reveals secret values or per-tenant data.
 */
export async function GET() {
  // Core SaaS dependencies (required for signup/signin/per-tenant data).
  const saas = {
    authSecret: Boolean(process.env.BH_AUTH_SECRET),
    database: Boolean(process.env.DATABASE_URL),
    encryptionKey: Boolean(process.env.BH_ENCRYPTION_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
  };
  // Optional integrations (founding subscriber path + AI).
  const optional = {
    ghlLeadCapture: Boolean(process.env.GHL_API_KEY),
    ghlHomesByNh: Boolean(process.env.GHL_HBNH_API_KEY),
    workbookField: Boolean(process.env.GHL_HBNH_PROJECT_DATA_FIELD_ID),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
  };
  const saasReady = Object.values(saas).every(Boolean);
  const allGreen = saasReady && Object.values(optional).every(Boolean);
  return NextResponse.json(
    {
      ok: true,
      status: allGreen ? "green" : saasReady ? "yellow" : "red",
      timestamp: new Date().toISOString(),
      saas,
      optional,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
