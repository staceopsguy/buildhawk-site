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
  const checks = {
    ghlBuildHawk: Boolean(process.env.GHL_API_KEY),
    ghlHomesByNh: Boolean(process.env.GHL_HBNH_API_KEY),
    workbookField: Boolean(process.env.GHL_HBNH_PROJECT_DATA_FIELD_ID),
    authSecret: Boolean(process.env.BH_AUTH_SECRET),
    authAllowlist: Boolean(process.env.BH_AUTHORIZED_EMAILS),
    resend: Boolean(process.env.RESEND_API_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
  };
  const allGreen = Object.values(checks).every(Boolean);
  return NextResponse.json(
    {
      ok: true,
      status: allGreen ? "green" : "yellow",
      timestamp: new Date().toISOString(),
      checks,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
