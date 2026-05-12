import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  createMagicToken,
  isAuthorizedEmail,
  isAuthConfigured,
  normalizeEmail,
} from "@/lib/auth";

export const runtime = "nodejs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.buildhawk.com.au");

const FROM = process.env.BH_AUTH_FROM_EMAIL || "BuildHawk Cost Plan Console <noreply@buildhawk.com.au>";

const renderEmail = (link: string) => {
  const text = `Sign in to BuildHawk Cost Plan Console

Click this link to sign in. It expires in 30 minutes.

${link}

If you didn't request this, ignore this email.`;
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#F6F7F9;font-family:Inter,system-ui,sans-serif;color:#111;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px;">
      <div style="width:36px;height:28px;background:#DE5123;border-radius:6px;"></div>
      <div>
        <div style="font-weight:700;font-size:13px;letter-spacing:0.04em;">BUILDHAWK</div>
        <div style="font-weight:600;font-size:9px;letter-spacing:0.18em;color:#6e7180;text-transform:uppercase;">Cost Plan Console</div>
      </div>
    </div>
    <h1 style="font-size:24px;font-weight:800;letter-spacing:-0.01em;margin:0 0 12px;">Your sign-in link</h1>
    <p style="font-size:14px;color:#475569;margin:0 0 24px;line-height:1.5;">Click below to access the BuildHawk Cost Plan Console. This link expires in 30 minutes and can only be used once.</p>
    <a href="${link}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 18px;border-radius:8px;">Sign in →</a>
    <p style="font-size:12px;color:#94a3b8;margin:32px 0 0;line-height:1.5;word-break:break-all;">Trouble with the button? Paste this URL into your browser:<br/>${link}</p>
    <p style="font-size:11px;color:#94a3b8;margin:32px 0 0;">If you didn't request this, ignore this email. Your account stays safe.</p>
  </div>
</body></html>`;
  return { text, html };
};

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Auth not configured. Set BH_AUTH_SECRET, BH_AUTHORIZED_EMAILS and RESEND_API_KEY in Vercel env.",
      },
      { status: 503 },
    );
  }
  let body: { email?: string; redirect?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email" }, { status: 400 });
  }

  // Always respond OK to avoid leaking the allowlist. Only actually send if authorized.
  if (isAuthorizedEmail(email)) {
    try {
      const token = await createMagicToken(email, body.redirect);
      const link = `${SITE_URL}/api/command-centre/auth/verify?token=${encodeURIComponent(token)}`;
      const resend = new Resend(process.env.RESEND_API_KEY!);
      const { text, html } = renderEmail(link);
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Your BuildHawk Cost Plan Console sign-in link",
        html,
        text,
      });
    } catch (e) {
      console.error("[auth] send-magic-link error:", e);
      // Don't reveal the error in the response.
    }
  }

  return NextResponse.json({ ok: true });
}
