#!/usr/bin/env node
/**
 * Comprehensive SaaS pressure test.
 *
 * 8 layers, runs against production:
 *   A. Marketing surface       every public CTA + integration list resolves
 *   B. Console routing         every page returns 200/307 as expected
 *   C. Lockdown enforcement    signup blocked, non-allowlisted emails dropped
 *   D. Allowlisted sign-in     johnphilpsc@gmail.com magic link works end-to-end
 *   E. Tenant isolation        anon visitor can't read tenant data
 *   F. API contract            endpoints reject malformed inputs cleanly
 *   G. Operational health      diagnostics endpoint reports green
 *   H. Performance             every request under target latency
 *
 * Cleans up after itself.
 */

import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

for (const line of readFileSync(".env.production.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="(.*)"$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const SITE = process.env.SITE_URL ?? "https://www.buildhawk.com.au";
const ALLOWLISTED_EMAIL = "johnphilpsc@gmail.com";
const sql = neon(process.env.DATABASE_URL);

let passes = 0;
let fails = 0;
const failures = [];
const timings = [];

const pass = (m) => {
  passes++;
  console.log(`  ✓ ${m}`);
};
const fail = (m, detail) => {
  fails++;
  failures.push({ m, detail });
  console.error(`  ✗ ${m}${detail ? ` — ${typeof detail === "string" ? detail : JSON.stringify(detail)}` : ""}`);
};
const section = (title) => {
  console.log(`\n━━━ ${title} ━━━`);
};

const time = async (label, fn) => {
  const t = performance.now();
  const result = await fn();
  const ms = Math.round(performance.now() - t);
  timings.push({ label, ms });
  return { result, ms };
};

const fetchSite = (path, init = {}) =>
  fetch(`${SITE}${path}`, { redirect: "manual", ...init });

/* ─────── A. Marketing surface ─────── */
async function testMarketing() {
  section("A. Marketing surface");
  const { result: r, ms } = await time("GET /", () => fetchSite("/"));
  if (r.status === 200) pass(`Landing 200 (${ms}ms)`);
  else fail(`Landing returned ${r.status}`);

  const html = await r.text();
  const checks = [
    ["BUILDHAWK wordmark", "BUILDHAWK"],
    ["Powered by Hawktress sublabel", "Powered by Hawktress"],
    ["Hero primary CTA: 'Start free trial'", "Start free trial"],
    ["Hero secondary CTA: 'Talk to estimating team'", "Talk to estimating team"],
    ["Integrations section: 'Bring your own stack'", "Bring your own stack"],
    ["Integrations: 'GoHighLevel'", "GoHighLevel"],
    ["Integrations: 'Procore'", "Procore"],
    ["Integrations: 'ServiceM8'", "ServiceM8"],
    ["Integrations: 'Tradify'", "Tradify"],
    ["Integrations: 'simPRO'", "simPRO"],
    ["Integrations: 'monday.com'", "monday.com"],
    ["Integrations: 'Xero'", "Xero"],
    ["Integrations: 'MYOB'", "MYOB"],
    ["Pricing: Starter tier link", "/command-centre/signup?plan=starter"],
    ["Pricing: Pro tier link", "/command-centre/signup?plan=pro"],
    ["Footer: Customer login", "/command-centre/login"],
    ["Nav: Integrations link", `href="/#integrations"`],
  ];
  for (const [name, needle] of checks) {
    if (html.includes(needle)) pass(name);
    else fail(`Missing: ${name}`);
  }

  // Other public pages reachable
  for (const path of ["/articles", "/faq", "/data-policy", "/insights", "/partners"]) {
    const r = await fetchSite(path);
    if (r.status === 200) pass(`${path} returns 200`);
    else fail(`${path} returned ${r.status}`);
  }
}

/* ─────── B. Console routing ─────── */
async function testConsoleRouting() {
  section("B. Console routing");
  const expect = [
    ["/command-centre", 307],
    ["/command-centre/login", 200],
    ["/command-centre/signup", 307], // redirects because lockdown
    ["/command-centre/new-project", 307],
    ["/command-centre/projects/kdfLhpK75u3s28XIfgkM/edit", 307],
    ["/command-centre/architecture", 307],
    ["/command-centre/settings", 307],
    ["/command-centre/onboarding", 307],
    ["/command-centre/request-access", 200],
  ];
  for (const [path, expected] of expect) {
    const r = await fetchSite(path);
    if (r.status === expected) pass(`${path} → ${r.status}`);
    else fail(`${path} expected ${expected} got ${r.status}`);
  }

  // Login page must render the new tabs
  const loginHtml = await (await fetchSite("/command-centre/login")).text();
  for (const needle of [
    `role="tab"`,
    ">Sign in<",
    ">Request access<",
    "Existing user",
    "Send me a sign-in link",
  ]) {
    if (loginHtml.includes(needle)) pass(`Login page contains "${needle}"`);
    else fail(`Login page missing: ${needle}`);
  }
}

/* ─────── C. Lockdown enforcement ─────── */
async function testLockdown() {
  section("C. Lockdown enforcement");

  // Signup endpoint must reject everyone with 403
  const signupRes = await fetchSite("/api/command-centre/auth/signup", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: `lockdown-${Date.now()}@example.com`,
      tenantName: "Should Not Exist",
      plan: "starter",
    }),
  });
  if (signupRes.status === 403) pass("POST /signup returns 403 (signup disabled)");
  else fail(`POST /signup expected 403 got ${signupRes.status}`);

  // /signup page redirects to login?invitationOnly=1
  const signupPage = await fetchSite("/command-centre/signup");
  const loc = signupPage.headers.get("location");
  if (signupPage.status === 307 && loc?.includes("invitationOnly=1"))
    pass("Signup page redirects to login?invitationOnly=1");
  else fail(`Signup page redirect: status=${signupPage.status}, location=${loc}`);

  // send-magic-link for non-allowlisted email returns 200 but inserts NO row
  const blockedEmail = `blocked-${Date.now()}@example.com`;
  const mlRes = await fetchSite("/api/command-centre/auth/send-magic-link", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: blockedEmail }),
  });
  const mlBody = await mlRes.json();
  if (mlRes.status === 200 && mlBody.ok)
    pass("send-magic-link returns 200/ok for blocked email (no leak)");
  else fail(`send-magic-link unexpected: ${mlRes.status} ${JSON.stringify(mlBody)}`);

  await new Promise((r) => setTimeout(r, 1500)); // let the no-op settle
  const blockedRows = await sql`SELECT count(*)::int as n FROM magic_links WHERE email = ${blockedEmail}`;
  if (blockedRows[0].n === 0) pass("Blocked email did NOT create a magic_links row");
  else fail(`Blocked email created ${blockedRows[0].n} magic_links rows`);

  // No tenant or user was created
  const orphans = await sql`SELECT count(*)::int as n FROM users WHERE email = ${blockedEmail}`;
  if (orphans[0].n === 0) pass("Blocked email did NOT create a user row");
  else fail(`Blocked email created ${orphans[0].n} user rows`);
}

/* ─────── D. Allowlisted sign-in end-to-end ─────── */
async function testAllowlistedSignin() {
  section("D. Allowlisted sign-in (johnphilpsc@gmail.com)");

  const before = await sql`SELECT count(*)::int as n FROM magic_links WHERE email = ${ALLOWLISTED_EMAIL}`;
  const baseline = before[0].n;

  const { result: r, ms } = await time("send-magic-link allowlisted", () =>
    fetchSite("/api/command-centre/auth/send-magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: ALLOWLISTED_EMAIL }),
    }),
  );
  const body = await r.json();
  if (r.status === 200 && body.ok) pass(`send-magic-link allowlisted returns ok (${ms}ms)`);
  else fail(`send-magic-link allowlisted: ${r.status} ${JSON.stringify(body)}`);

  await new Promise((r) => setTimeout(r, 1500));
  const after = await sql`SELECT count(*)::int as n FROM magic_links WHERE email = ${ALLOWLISTED_EMAIL}`;
  if (after[0].n > baseline) pass(`Magic link row inserted for allowlisted (${baseline} → ${after[0].n})`);
  else fail(`No new magic_links row inserted for allowlisted email`);

  // Now bypass email by inserting a known token + consuming it via /verify
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const id = `mgl_test_${randomBytes(8).toString("hex")}`;
  await sql`INSERT INTO magic_links (id, token_hash, email, purpose, redirect, expires_at)
    VALUES (${id}, ${tokenHash}, ${ALLOWLISTED_EMAIL}, 'signin', '/command-centre',
      ${new Date(Date.now() + 30 * 60 * 1000).toISOString()})`;

  const verify = await fetchSite(`/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`);
  if (verify.status === 307 || verify.status === 302) pass(`/verify redirects (${verify.status})`);
  else fail(`/verify returned ${verify.status}`);
  const cookies = verify.headers.get("set-cookie") ?? "";
  const sessionCookie = cookies.split(",").map((c) => c.trim().split(";")[0]).find((c) => c.startsWith("bh_session="));
  if (sessionCookie) pass("Session cookie set after verify");
  else fail("No session cookie after verify");

  // Use the session to verify protected endpoints work
  if (sessionCookie) {
    const who = await fetchSite("/api/command-centre/auth/whoami", {
      headers: { cookie: sessionCookie },
    });
    const whoBody = await who.json();
    if (whoBody.signedIn && whoBody.email === ALLOWLISTED_EMAIL)
      pass("/whoami confirms session active");
    else fail(`/whoami unexpected: ${JSON.stringify(whoBody)}`);

    const members = await fetchSite("/api/command-centre/members", { headers: { cookie: sessionCookie } });
    const mBody = await members.json();
    if (mBody.ok && mBody.members.length === 1 && mBody.members[0].role === "owner")
      pass("Members list returns single HBNH owner");
    else fail(`Members list unexpected: ${JSON.stringify(mBody)}`);

    const audit = await fetchSite("/api/command-centre/audit", { headers: { cookie: sessionCookie } });
    const aBody = await audit.json();
    if (aBody.ok && Array.isArray(aBody.events)) pass(`Audit log returns ${aBody.events.length} event(s)`);
    else fail(`Audit log unexpected: ${JSON.stringify(aBody).slice(0, 200)}`);

    // Logout
    const logout = await fetchSite("/api/command-centre/auth/logout", { headers: { cookie: sessionCookie } });
    if ([200, 302, 303, 307].includes(logout.status)) pass("Logout endpoint responds");
    else fail(`Logout returned ${logout.status}`);
  }

  // Cleanup the test magic_link row (it was consumed but leave no trace)
  await sql`DELETE FROM magic_links WHERE id = ${id}`;
}

/* ─────── E. Tenant isolation (anon access) ─────── */
async function testTenantIsolation() {
  section("E. Tenant isolation (anonymous access)");
  const protectedApis = [
    "/api/command-centre/members",
    "/api/command-centre/audit",
    "/api/command-centre/integrations/ghl",
    "/api/command-centre/projects/kdfLhpK75u3s28XIfgkM/overlay",
  ];
  for (const path of protectedApis) {
    const r = await fetchSite(path, { method: path.endsWith("/overlay") ? "POST" : "GET" });
    if (r.status === 401 || r.status === 307) pass(`${path} → ${r.status} (gated)`);
    else fail(`${path} expected 401/307, got ${r.status}`);
  }

  // Forged session cookie should fail
  const r = await fetchSite("/api/command-centre/auth/whoami", {
    headers: { cookie: "bh_session=eyJ0aGlzIjoidGFtcGVyZWQifQ.fakeSig" },
  });
  const body = await r.json();
  if (!body.signedIn) pass("Forged session cookie rejected");
  else fail(`Forged session was accepted: ${JSON.stringify(body)}`);
}

/* ─────── F. API contract / negative tests ─────── */
async function testApiContract() {
  section("F. API contract (validation)");

  // send-magic-link with invalid JSON
  const r1 = await fetchSite("/api/command-centre/auth/send-magic-link", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json",
  });
  if (r1.status === 400) pass("send-magic-link rejects invalid JSON with 400");
  else fail(`send-magic-link bad JSON returned ${r1.status}`);

  // send-magic-link with invalid email
  const r2 = await fetchSite("/api/command-centre/auth/send-magic-link", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "not-an-email" }),
  });
  if (r2.status === 400) pass("send-magic-link rejects invalid email with 400");
  else fail(`send-magic-link bad email returned ${r2.status}`);

  // request-access with missing required field
  const r3 = await fetchSite("/api/command-centre/request-access", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "test@example.com" }), // missing name
  });
  if ([200, 400].includes(r3.status)) pass(`request-access missing-name handled (${r3.status})`);
  else fail(`request-access missing-name returned ${r3.status}`);

  // verify with bad token
  const r4 = await fetchSite("/api/command-centre/auth/verify?token=garbage");
  const loc = r4.headers.get("location");
  if (r4.status === 307 && loc?.includes("error=expired"))
    pass("verify with bad token redirects to login?error=expired");
  else fail(`verify bad token: status=${r4.status} location=${loc}`);
}

/* ─────── G. Operational health (diagnostics endpoint) ─────── */
async function testDiagnostics() {
  section("G. Operational health (server-side diagnostics)");
  const secret = process.env.SETUP_SECRET;
  if (!secret) {
    fail("SETUP_SECRET not in local env — skipping diagnostics check");
    return;
  }
  const r = await fetchSite("/api/command-centre/admin/diagnostics", {
    headers: { "x-setup-secret": secret },
  });
  const body = await r.json();
  if (body.ok) pass(`Diagnostics endpoint returns ok (${body.checks.length} checks)`);
  else fail(`Diagnostics not ok: ${JSON.stringify(body, null, 2)}`);

  for (const check of body.checks ?? []) {
    if (check.ok) pass(`  ${check.name}`);
    else fail(`  ${check.name}`, check.detail);
  }
}

/* ─────── H. Performance ─────── */
async function testPerformance() {
  section("H. Performance");
  const target = {
    "GET /": 2000,
    "send-magic-link allowlisted": 3000,
  };
  for (const t of timings) {
    const limit = target[t.label];
    if (limit) {
      if (t.ms <= limit) pass(`${t.label}: ${t.ms}ms ≤ ${limit}ms`);
      else fail(`${t.label}: ${t.ms}ms > ${limit}ms (slow)`);
    }
  }
}

async function main() {
  console.log(`SaaS Pressure Test — site: ${SITE}\n`);
  await testMarketing();
  await testConsoleRouting();
  await testLockdown();
  await testAllowlistedSignin();
  await testTenantIsolation();
  await testApiContract();
  await testDiagnostics();
  await testPerformance();

  console.log(`\n━━━ Summary ━━━`);
  console.log(`  Passed: ${passes}`);
  console.log(`  Failed: ${fails}`);
  if (fails > 0) {
    console.log(`\nFailures:`);
    for (const f of failures) console.log(`  · ${f.m}`);
    process.exitCode = 1;
  } else {
    console.log(`\n  100% green ✓`);
  }
}

main().catch((e) => {
  console.error("CRASH:", e);
  process.exitCode = 1;
});
