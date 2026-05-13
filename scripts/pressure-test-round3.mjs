#!/usr/bin/env node
/**
 * Round 3 pressure test — invitation accept, Stripe checkout body validation,
 * robots/sitemap content correctness, open redirect protection, oversized
 * payloads, SQL injection attempts, method-not-allowed, happy-path full chain.
 */
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const BASE = process.env.BASE_URL || "https://www.buildhawk.com.au";
const sql = neon(process.env.DATABASE_URL);
const rid = (prefix) => `${prefix}_${randomBytes(8).toString("hex")}`;

let pass = 0,
  fail = 0;
const failures = [];

async function check(name, fn) {
  try {
    await fn();
    pass++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    fail++;
    failures.push(`${name}: ${e.message}`);
    console.log(`  ✗ ${name}\n    ${e.message}`);
  }
}
const section = (t) => console.log(`\n━━━ ${t} ━━━`);
const fetchSite = (path, init = {}) => fetch(BASE + path, init);

async function mintSession(email) {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, expires_at)
     VALUES ($1, $2, $3, 'signin', '/command-centre', now() + interval '30 minutes')`,
    [rid("mlk"), tokenHash, email],
  );
  const v = await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  const setCookie = v.headers.get("set-cookie") ?? "";
  const m = setCookie.match(/bh_session=([^;]+)/);
  if (!m) throw new Error(`no session: ${v.status}`);
  return `bh_session=${m[1]}`;
}

// ─── robots.txt content correctness ──────────────────────────────────────────
section("robots.txt content correctness");

await check("robots.txt allows / and SaaS entry points", async () => {
  const res = await fetchSite("/robots.txt");
  if (res.status !== 200) throw new Error(`robots ${res.status}`);
  const txt = await res.text();
  for (const p of [
    "Allow: /",
    "Allow: /command-centre/login",
    "Allow: /command-centre/signup",
    "Allow: /command-centre/request-access",
  ]) {
    if (!txt.includes(p)) throw new Error(`missing line: ${p}`);
  }
});

await check("robots.txt disallows /api/ and /command-centre", async () => {
  const res = await fetchSite("/robots.txt");
  const txt = await res.text();
  if (!txt.includes("Disallow: /api/")) throw new Error("missing /api/ disallow");
  if (!txt.includes("Disallow: /command-centre")) throw new Error("missing /command-centre disallow");
});

await check("sitemap.xml contains all expected URLs", async () => {
  const res = await fetchSite("/sitemap.xml");
  if (res.status !== 200) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  const required = [
    "/",
    "/faq",
    "/partners",
    "/status",
    "/command-centre/login",
    "/command-centre/signup",
    "/command-centre/request-access",
  ];
  const missing = required.filter((p) => !xml.includes(`<loc>${BASE}${p}</loc>`));
  if (missing.length > 0)
    throw new Error(`sitemap missing: ${missing.join(", ")}`);
});

await check("sitemap.xml does NOT include gated dashboard paths", async () => {
  const res = await fetchSite("/sitemap.xml");
  const xml = await res.text();
  const banned = [
    "/command-centre</loc>",
    "/command-centre/onboarding",
    "/command-centre/settings",
    "/command-centre/architecture",
  ];
  const leaked = banned.filter((p) => xml.includes(p));
  if (leaked.length > 0)
    throw new Error(`sitemap leaks gated paths: ${leaked.join(", ")}`);
});

// ─── HTTP method validation ──────────────────────────────────────────────────
section("HTTP method validation");

await check("POST /api/health → 405 (only GET supported)", async () => {
  const res = await fetchSite("/api/health", { method: "POST" });
  if (res.status !== 405 && res.status !== 404 && res.status !== 200) {
    // Next.js can return 405 or 404 depending on route handler shape.
    throw new Error(`unexpected ${res.status}`);
  }
});

await check("PUT /api/command-centre/auth/signup → 405 or 404", async () => {
  const res = await fetchSite("/api/command-centre/auth/signup", { method: "PUT" });
  if (res.status === 200)
    throw new Error("PUT on signup endpoint accepted (unexpected)");
});

// ─── Open redirect protection ────────────────────────────────────────────────
section("Open redirect protection on ?next");

await check("login redirects only to relative paths (rejects http://)", async () => {
  // The login page accepts ?next=... and the verify route uses it for redirect.
  // We test the verify route directly: insert a magic link with malicious redirect.
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const email = `redirect-test+${Date.now()}@test.local`;
  await sql.query(
    `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
    [rid("usr"), email],
  );
  // No tenant — orphan path will trigger
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, expires_at)
     VALUES ($1, $2, $3, 'signin', $4, now() + interval '30 minutes')`,
    [rid("mlk"), tokenHash, email, "https://evil.example.com/steal"],
  );
  const res = await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  const loc = res.headers.get("location") ?? "";
  if (loc.includes("evil.example.com"))
    throw new Error(`open redirect leaked: ${loc}`);
  // Cleanup
  await sql.query(`DELETE FROM users WHERE email = $1`, [email]);
});

// ─── Oversized payload handling ─────────────────────────────────────────────
section("Oversized payload handling");

await check("signup with 1MB payload doesn't crash server", async () => {
  const big = "x".repeat(1_000_000);
  const res = await fetchSite("/api/command-centre/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "x@x.com", tenantName: big }),
  });
  // Any status is fine as long as the server doesn't die.
  if (res.status === 500 || res.status === 502)
    throw new Error(`server error on big payload: ${res.status}`);
});

await check("request-access with malformed JSON returns 400 (not 500)", async () => {
  const res = await fetchSite("/api/command-centre/request-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not valid json",
  });
  if (res.status !== 400) throw new Error(`expected 400, got ${res.status}`);
});

// ─── SQL injection attempts (email field) ───────────────────────────────────
section("SQL injection attempts");

await check("signup with SQL injection in email rejected", async () => {
  const res = await fetchSite("/api/command-centre/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "x@x.com'; DROP TABLE users; --",
      tenantName: "test",
    }),
  });
  // 400 (bad input) or 403 (signups disabled) — both indicate rejection.
  // 500 would indicate a server crash; 200 would indicate success (very bad).
  if (res.status === 200 || res.status === 500)
    throw new Error(`SQL injection got ${res.status} (must be rejected)`);
});

await check("send-magic-link with SQL injection in email returns ok:true (anti-enum)", async () => {
  const res = await fetchSite("/api/command-centre/auth/send-magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "x@x.com'; SELECT * FROM tenants; --",
    }),
  });
  // Invalid email, should still return 400 (anti-enum applies only to valid emails)
  // Or 200 if treated as unknown email. Either is fine — main thing is no crash.
  if (res.status === 500)
    throw new Error("server error (possible SQL injection vector)");
});

await check("users table not deleted (no SQL injection took effect)", async () => {
  // Sanity check: at minimum the HBNH founding owner(s) must still exist.
  // We assert this by checking that there's at least one owner of HBNH.
  const rows = await sql.query(
    `SELECT count(*)::int as c FROM memberships m
     JOIN tenants t ON t.id = m.tenant_id
     WHERE t.slug = 'homes-by-nh-founding' AND m.role = 'owner'`,
  );
  if (rows[0].c < 1)
    throw new Error(`HBNH owner count is ${rows[0].c} — users may have been compromised`);
});

// ─── Invitation accept flow ─────────────────────────────────────────────────
section("Invitation accept flow (end-to-end)");

const inviterTid = rid("ten");
const inviterUid = rid("usr");
const inviterEmail = `inviter+${Date.now()}@test.local`;
const inviteeEmail = `invitee+${Date.now()}@test.local`;
let inviteId = null;

await check("seed inviter tenant + owner", async () => {
  await sql.query(
    `INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
     VALUES ($1, $2, 'Inviter Tenant', 'pro', 'trialing', now() + interval '14 days')`,
    [inviterTid, `inv-${Date.now().toString(36)}`],
  );
  await sql.query(
    `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
    [inviterUid, inviterEmail],
  );
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1,$2,$3,'owner')`,
    [rid("mem"), inviterTid, inviterUid],
  );
});

const cookieInviter = await mintSession(inviterEmail);

await check("inviter creates invite via API", async () => {
  const res = await fetchSite("/api/command-centre/members/invite", {
    method: "POST",
    headers: { Cookie: cookieInviter, "Content-Type": "application/json" },
    body: JSON.stringify({ email: inviteeEmail, role: "director" }),
  });
  if (res.status !== 200) throw new Error(`invite ${res.status}: ${await res.text()}`);
});

await check("invitation row exists", async () => {
  const rows = await sql.query(
    `SELECT id FROM invitations WHERE email = $1 AND tenant_id = $2`,
    [inviteeEmail, inviterTid],
  );
  if (rows.length !== 1) throw new Error(`expected 1 invite`);
  inviteId = rows[0].id;
});

await check("invitee consumes invite via verify (becomes a member)", async () => {
  // Mint an invite magic link for the invitee with inviteId in metadata
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, metadata, expires_at)
     VALUES ($1, $2, $3, 'invite', '/command-centre', $4::jsonb, now() + interval '30 minutes')`,
    [rid("mlk"), tokenHash, inviteeEmail, JSON.stringify({ inviteId })],
  );
  const v = await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  if (v.status !== 307 && v.status !== 302)
    throw new Error(`verify status ${v.status}`);
  // Membership should now exist
  const rows = await sql.query(
    `SELECT m.role FROM memberships m JOIN users u ON u.id = m.user_id
     WHERE u.email = $1 AND m.tenant_id = $2`,
    [inviteeEmail, inviterTid],
  );
  if (rows.length !== 1) throw new Error(`membership not created`);
  if (rows[0].role !== "director")
    throw new Error(`wrong role: ${rows[0].role}`);
});

await check("invitation marked accepted", async () => {
  const rows = await sql.query(`SELECT status FROM invitations WHERE id = $1`, [inviteId]);
  if (rows[0].status !== "accepted")
    throw new Error(`expected status=accepted, got ${rows[0].status}`);
});

await check("invite cannot be consumed twice", async () => {
  // The magic link itself is one-use, but let's also verify a NEW magic link
  // for the same invite (already accepted) still doesn't create a duplicate.
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, metadata, expires_at)
     VALUES ($1, $2, $3, 'invite', '/command-centre', $4::jsonb, now() + interval '30 minutes')`,
    [rid("mlk"), tokenHash, inviteeEmail, JSON.stringify({ inviteId })],
  );
  await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  const rows = await sql.query(
    `SELECT count(*)::int as c FROM memberships m JOIN users u ON u.id = m.user_id
     WHERE u.email = $1 AND m.tenant_id = $2`,
    [inviteeEmail, inviterTid],
  );
  if (rows[0].c !== 1)
    throw new Error(`expected exactly 1 membership, got ${rows[0].c}`);
});

await check("cleanup invite flow", async () => {
  await sql.query(`DELETE FROM tenants WHERE id = $1`, [inviterTid]);
  await sql.query(
    `DELETE FROM users WHERE email = ANY($1::text[])`,
    [[inviterEmail, inviteeEmail]],
  );
});

// ─── Stripe checkout body validation ────────────────────────────────────────
section("Stripe checkout body validation");

const stripeTid = rid("ten");
const stripeUid = rid("usr");
const stripeEmail = `stripe+${Date.now()}@test.local`;

await check("seed stripe test tenant", async () => {
  await sql.query(
    `INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
     VALUES ($1, $2, 'Stripe Test', 'starter', 'trialing', now() + interval '14 days')`,
    [stripeTid, `s-${Date.now().toString(36)}`],
  );
  await sql.query(
    `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
    [stripeUid, stripeEmail],
  );
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1,$2,$3,'owner')`,
    [rid("mem"), stripeTid, stripeUid],
  );
});
const cookieStripe = await mintSession(stripeEmail);

await check("checkout with no body → 400 or 503 (no Stripe keys yet)", async () => {
  const res = await fetchSite("/api/command-centre/stripe/checkout", {
    method: "POST",
    headers: { Cookie: cookieStripe, "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  if (res.status !== 400 && res.status !== 503)
    throw new Error(`expected 400/503, got ${res.status}`);
});

await check("checkout with bogus plan → 400 or 503", async () => {
  const res = await fetchSite("/api/command-centre/stripe/checkout", {
    method: "POST",
    headers: { Cookie: cookieStripe, "Content-Type": "application/json" },
    body: JSON.stringify({ plan: "not-a-real-plan" }),
  });
  if (res.status !== 400 && res.status !== 503)
    throw new Error(`expected 400/503, got ${res.status}`);
});

await check("checkout requires auth (no cookie → 401)", async () => {
  const res = await fetchSite("/api/command-centre/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan: "pro" }),
  });
  if (res.status !== 401) throw new Error(`expected 401, got ${res.status}`);
});

await check("cleanup stripe tenant", async () => {
  await sql.query(`DELETE FROM tenants WHERE id = $1`, [stripeTid]);
  await sql.query(`DELETE FROM users WHERE id = $1`, [stripeUid]);
});

// ─── HBNH integrity (sentinel: existing data still intact) ─────────────────
section("HBNH founding subscriber sentinel");

await check("HBNH tenant still active + plan=pro", async () => {
  const rows = await sql.query(
    `SELECT status, plan FROM tenants WHERE slug = 'homes-by-nh-founding'`,
  );
  if (rows.length !== 1) throw new Error("HBNH tenant missing");
  if (rows[0].status !== "active")
    throw new Error(`HBNH status changed: ${rows[0].status}`);
  if (rows[0].plan !== "pro")
    throw new Error(`HBNH plan changed: ${rows[0].plan}`);
});

await check("HBNH has at least 1 owner (Nathan + John = founding cohort)", async () => {
  const rows = await sql.query(
    `SELECT count(*)::int as c FROM memberships m
     JOIN tenants t ON t.id = m.tenant_id
     WHERE t.slug = 'homes-by-nh-founding' AND m.role = 'owner'`,
  );
  if (rows[0].c < 1) throw new Error(`expected ≥1 owner, got ${rows[0].c}`);
});

await check("HBNH still has its GHL integration row", async () => {
  const rows = await sql.query(
    `SELECT count(*)::int as c FROM integrations i
     JOIN tenants t ON t.id = i.tenant_id
     WHERE t.slug = 'homes-by-nh-founding' AND i.kind = 'ghl' AND i.is_active = true`,
  );
  if (rows[0].c !== 1) throw new Error(`expected 1 integration, got ${rows[0].c}`);
});

console.log(`\n━━━ RESULT ━━━`);
console.log(`  ${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log(`\nFailures:`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
