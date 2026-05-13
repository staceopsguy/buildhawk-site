#!/usr/bin/env node
/**
 * Full end-to-end pressure test for the BuildHawk SaaS.
 *
 * Auth strategy: rather than forging a session cookie locally (Vercel CLI
 * doesn't expose BH_AUTH_SECRET to env pulls), this test inserts a real
 * magic_links row into Neon, then has production /api/command-centre/auth/verify
 * consume it. The Set-Cookie that comes back is a genuine session cookie.
 *
 * The test then exercises every link in the chain — both as the HBNH owner
 * and as an ephemeral test tenant — to confirm multi-tenant isolation.
 * All test data is cleaned up at the end.
 */
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BASE = process.env.BASE_URL || "https://www.buildhawk.com.au";
const sql = neon(process.env.DATABASE_URL);
const rid = (prefix) => `${prefix}_${randomBytes(8).toString("hex")}`;

// --- harness ----------------------------------------------------------------
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
const eqStatus = (label, expected) => (res) => {
  if (res.status !== expected) throw new Error(`${label} expected ${expected}, got ${res.status}`);
};
async function expectJson(res, predicate) {
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`not JSON: ${text.slice(0, 200)}`);
  }
  if (!predicate(json)) {
    throw new Error(`payload predicate failed: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return json;
}
const fetchSite = (path, init = {}) => fetch(BASE + path, init);

// --- DB-backed session minting (mirrors lib/auth.ts) ------------------------
async function mintSession(userId, tenantId, email) {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, metadata, expires_at)
     VALUES ($1, $2, $3, 'signin', '/command-centre', NULL, $4)`,
    [rid("mlk"), tokenHash, email, expiresAt],
  );
  // Consume via the real verify endpoint to get a Set-Cookie.
  const res = await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  if (res.status !== 307 && res.status !== 302) {
    throw new Error(`verify expected redirect, got ${res.status}: ${await res.text()}`);
  }
  const setCookie = res.headers.get("set-cookie") ?? "";
  const m = setCookie.match(/bh_session=([^;]+)/);
  if (!m) throw new Error(`no bh_session in Set-Cookie: ${setCookie}`);
  return `bh_session=${m[1]}`;
}

// --- DB lookup --------------------------------------------------------------
section("DB lookup");
const tenants = await sql.query(
  `SELECT id, name, slug, plan, status FROM tenants WHERE slug = 'homes-by-nh-founding' LIMIT 1`,
);
if (!tenants.length) {
  console.error("HBNH tenant not found");
  process.exit(1);
}
const tenant = tenants[0];
const members = await sql.query(
  `SELECT u.id as user_id, u.email FROM memberships m
   JOIN users u ON u.id = m.user_id
   WHERE m.tenant_id = $1 LIMIT 1`,
  [tenant.id],
);
const member = members[0];
console.log(`  tenant: ${tenant.name} (${tenant.id}) status=${tenant.status} plan=${tenant.plan}`);
console.log(`  owner:  ${member.email}`);

// --- 1. Public marketing surface -------------------------------------------
section("Public marketing surface");
await check("GET /", async () => eqStatus("/", 200)(await fetchSite("/")));
await check("GET /faq", async () => eqStatus("/faq", 200)(await fetchSite("/faq")));
await check("GET /partners", async () => eqStatus("/partners", 200)(await fetchSite("/partners")));
await check("GET /status", async () => {
  const res = await fetchSite("/status");
  eqStatus("status", 200)(res);
  const html = await res.text();
  if (!html.includes("All systems operational") && !html.includes("Operating with"))
    throw new Error("status text missing");
});
await check("GET /sitemap.xml includes /status + request-access", async () => {
  const res = await fetchSite("/sitemap.xml");
  eqStatus("sitemap", 200)(res);
  const xml = await res.text();
  if (!xml.includes("/status")) throw new Error("/status missing");
  if (!xml.includes("/command-centre/request-access"))
    throw new Error("request-access missing");
});
await check("GET /robots.txt disallows /api/", async () => {
  const res = await fetchSite("/robots.txt");
  eqStatus("robots", 200)(res);
  if (!(await res.text()).includes("/api/")) throw new Error("api disallow missing");
});

// --- 2. Health endpoint ----------------------------------------------------
section("Health endpoint");
await check("GET /api/health returns green", async () => {
  const res = await fetchSite("/api/health");
  eqStatus("health", 200)(res);
  await expectJson(res, (j) => j.status === "green" && j.saas?.database === true);
});

// --- 3. Signed-out auth gates ----------------------------------------------
section("Signed-out auth gates");
await check("GET /command-centre → login", async () => {
  const res = await fetchSite("/command-centre", { redirect: "manual" });
  if (res.status !== 307 && res.status !== 302)
    throw new Error(`expected redirect, got ${res.status}`);
  if (!res.headers.get("location")?.includes("/command-centre/login"))
    throw new Error(`bad location: ${res.headers.get("location")}`);
});
await check("GET /command-centre/settings → login", async () => {
  const res = await fetchSite("/command-centre/settings", { redirect: "manual" });
  if (res.status < 300 || res.status >= 400)
    throw new Error(`expected redirect, got ${res.status}`);
});
await check("GET /command-centre/login renders 200", async () =>
  eqStatus("login", 200)(await fetchSite("/command-centre/login")),
);
await check("GET /command-centre/signup renders 200", async () =>
  eqStatus("signup", 200)(await fetchSite("/command-centre/signup")),
);
await check("GET /command-centre/request-access renders 200", async () =>
  eqStatus("request-access", 200)(await fetchSite("/command-centre/request-access")),
);

// --- 4. Signed-out API contracts -------------------------------------------
section("Signed-out API contracts");
await check("whoami signedIn:false", async () => {
  const res = await fetchSite("/api/command-centre/auth/whoami");
  eqStatus("whoami", 200)(res);
  await expectJson(res, (j) => j.signedIn === false);
});
await check("audit 401", async () =>
  eqStatus("audit", 401)(await fetchSite("/api/command-centre/audit")),
);
await check("members 401", async () =>
  eqStatus("members", 401)(await fetchSite("/api/command-centre/members")),
);
await check("hawktress benchmarks 401", async () =>
  eqStatus("benchmarks", 401)(await fetchSite("/api/command-centre/hawktress/benchmarks")),
);
await check("integrations/ghl GET 401", async () =>
  eqStatus("ghl", 401)(await fetchSite("/api/command-centre/integrations/ghl")),
);
await check("stripe webhook NOT gated", async () => {
  const res = await fetchSite("/api/command-centre/stripe/webhook", { method: "POST" });
  if (res.status === 401) throw new Error("stripe webhook is gated");
});
await check("send-magic-link returns ok:true for unknown email", async () => {
  const res = await fetchSite("/api/command-centre/auth/send-magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `nonexistent-${Date.now()}@example.com` }),
  });
  eqStatus("send-magic-link", 200)(res);
  await expectJson(res, (j) => j.ok === true);
});
await check("request-access 400 on empty body", async () => {
  const res = await fetchSite("/api/command-centre/request-access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  eqStatus("request-access bad", 400)(res);
});
await check("seed-founding inaccessible (deleted + gated)", async () => {
  // The route file is deleted. The proxy still gates everything under
  // /api/command-centre/ that isn't an auth/stripe-webhook/request-access
  // exception, so unauth GET returns 401 (which is a better disclosure
  // posture than 404 — never reveals whether the path exists).
  const res = await fetchSite("/api/command-centre/admin/seed-founding");
  if (res.status !== 401 && res.status !== 404)
    throw new Error(`expected 401 or 404, got ${res.status}`);
});

// --- 5. Authenticated as HBNH owner ----------------------------------------
section("Authenticated as HBNH owner (real session via DB-minted magic link)");
const hbnhCookie = await mintSession(member.user_id, tenant.id, member.email);
const authHeaders = { Cookie: hbnhCookie };

await check("whoami returns owner email", async () => {
  const res = await fetchSite("/api/command-centre/auth/whoami", { headers: authHeaders });
  eqStatus("whoami", 200)(res);
  await expectJson(res, (j) => j.signedIn === true && j.email === member.email);
});
await check("dashboard renders 200", async () =>
  eqStatus("dashboard", 200)(
    await fetchSite("/command-centre", { headers: authHeaders, redirect: "manual" }),
  ),
);
await check("settings renders 200", async () =>
  eqStatus("settings", 200)(
    await fetchSite("/command-centre/settings", { headers: authHeaders, redirect: "manual" }),
  ),
);
await check("onboarding redirects (tenant has GHL)", async () => {
  const res = await fetchSite("/command-centre/onboarding", {
    headers: authHeaders,
    redirect: "manual",
  });
  if (res.status !== 307 && res.status !== 302)
    throw new Error(`expected redirect, got ${res.status}`);
});
await check("members list returns members", async () => {
  const res = await fetchSite("/api/command-centre/members", { headers: authHeaders });
  eqStatus("members", 200)(res);
  const j = await expectJson(res, (x) => x.ok && Array.isArray(x.members));
  if (j.members.length < 1) throw new Error("no members");
});
await check("audit log returns array", async () => {
  const res = await fetchSite("/api/command-centre/audit", { headers: authHeaders });
  eqStatus("audit", 200)(res);
  await expectJson(res, (j) => j.ok && Array.isArray(j.events));
});
await check("integrations/ghl returns saved config (locationId visible)", async () => {
  const res = await fetchSite("/api/command-centre/integrations/ghl", { headers: authHeaders });
  eqStatus("ghl GET", 200)(res);
  const j = await expectJson(res, (x) => x.ok);
  if (!j.config) throw new Error("no GHL config");
  if (!j.config.locationId) throw new Error("no locationId");
});
await check("hawktress benchmarks returns cohort shape", async () => {
  const res = await fetchSite("/api/command-centre/hawktress/benchmarks", {
    headers: authHeaders,
  });
  eqStatus("benchmarks", 200)(res);
  await expectJson(
    res,
    (j) => j.ok && Array.isArray(j.cells) && typeof j.totalSamples === "number",
  );
});

// --- 6. Cross-tenant isolation --------------------------------------------
section("Cross-tenant isolation");
const testTenantId = rid("ten");
const testUserId = rid("usr");
const testEmail = `pressure-test+${Date.now()}@example.com`;

await check("seed ephemeral test tenant + user + membership", async () => {
  await sql.query(
    `INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
     VALUES ($1, $2, $3, 'starter', 'trialing', now() + interval '14 days')`,
    [testTenantId, `pressure-${Date.now().toString(36)}`, "Pressure Test Tenant"],
  );
  await sql.query(
    `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
    [testUserId, testEmail],
  );
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
    [rid("mem"), testTenantId, testUserId],
  );
});

const testCookie = await mintSession(testUserId, testTenantId, testEmail);

await check("test tenant has no GHL integration row", async () => {
  const rows = await sql.query(
    `SELECT id FROM integrations WHERE tenant_id = $1`,
    [testTenantId],
  );
  if (rows.length !== 0) throw new Error(`expected 0, got ${rows.length}`);
});
await check("test tenant integrations/ghl returns config:null", async () => {
  const res = await fetchSite("/api/command-centre/integrations/ghl", {
    headers: { Cookie: testCookie },
  });
  eqStatus("ghl GET", 200)(res);
  await expectJson(res, (j) => j.ok && j.config === null);
});
await check("test tenant does NOT see HBNH project markers", async () => {
  const res = await fetchSite("/command-centre", {
    headers: { Cookie: testCookie },
    redirect: "manual",
  });
  eqStatus("dashboard", 200)(res);
  const html = await res.text();
  const markers = ["Autumn St", "Overview Cres", "Apollo Bay", "Stawell"];
  const leaked = markers.filter((m) => html.includes(m));
  if (leaked.length > 0)
    throw new Error(`LEAK: HBNH markers in test tenant view: ${leaked.join(", ")}`);
});
await check("test tenant audit empty", async () => {
  const res = await fetchSite("/api/command-centre/audit", { headers: { Cookie: testCookie } });
  eqStatus("audit", 200)(res);
  const j = await expectJson(res, (x) => x.ok);
  if (j.events.length > 0)
    throw new Error(`cross-tenant audit leak: ${j.events.length}`);
});
await check("test tenant members contains only itself", async () => {
  const res = await fetchSite("/api/command-centre/members", {
    headers: { Cookie: testCookie },
  });
  eqStatus("members", 200)(res);
  const j = await expectJson(res, (x) => x.ok);
  if (j.members.length !== 1) throw new Error(`expected 1, got ${j.members.length}`);
  if (j.members[0].email !== testEmail)
    throw new Error(`wrong email: ${j.members[0].email}`);
});

// --- 6.5 End-to-end signup flow ---------------------------------------------
section("End-to-end signup flow (issueMagicLink path)");

// Simulate the signup POST by inserting a magic_links row with metadata
// (purpose=signup + tenantName + plan), then consume via verify, and check
// that a tenant + owner membership were created with the right shape.
const signupEmail = `signup-test+${Date.now()}@example.com`;
const signupTenantName = `Signup Test ${Date.now().toString(36)}`;
let createdTenantId = null;
let createdUserId = null;

await check("seed signup magic link with metadata", async () => {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken).digest("hex");
  await sql.query(
    `INSERT INTO magic_links (id, token_hash, email, purpose, redirect, metadata, expires_at)
     VALUES ($1, $2, $3, 'signup', '/command-centre', $4::jsonb, now() + interval '30 minutes')`,
    [rid("mlk"), tokenHash, signupEmail, JSON.stringify({ tenantName: signupTenantName, plan: "starter" })],
  );
  // Consume via verify
  const v = await fetchSite(
    `/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`,
    { redirect: "manual" },
  );
  if (v.status !== 307 && v.status !== 302) {
    throw new Error(`verify did not redirect: ${v.status}`);
  }
  // Signup flow should redirect to /command-centre/onboarding
  const loc = v.headers.get("location") ?? "";
  if (!loc.includes("/command-centre/onboarding")) {
    throw new Error(`expected redirect to onboarding, got ${loc}`);
  }
});

await check("user row created for signup email", async () => {
  const rows = await sql.query(`SELECT id FROM users WHERE email = $1`, [signupEmail]);
  if (rows.length !== 1) throw new Error(`expected 1 user, got ${rows.length}`);
  createdUserId = rows[0].id;
});

await check("tenant row created with name + plan + trial", async () => {
  const rows = await sql.query(
    `SELECT id, name, plan, status, trial_ends_at FROM tenants WHERE name = $1`,
    [signupTenantName],
  );
  if (rows.length !== 1) throw new Error(`expected 1 tenant, got ${rows.length}`);
  const t = rows[0];
  if (t.plan !== "starter") throw new Error(`expected plan=starter, got ${t.plan}`);
  if (t.status !== "trialing") throw new Error(`expected status=trialing, got ${t.status}`);
  if (!t.trial_ends_at) throw new Error("trial_ends_at not set");
  createdTenantId = t.id;
});

await check("owner membership created tying user to tenant", async () => {
  const rows = await sql.query(
    `SELECT role FROM memberships WHERE tenant_id = $1 AND user_id = $2`,
    [createdTenantId, createdUserId],
  );
  if (rows.length !== 1) throw new Error(`expected 1 membership, got ${rows.length}`);
  if (rows[0].role !== "owner")
    throw new Error(`expected role=owner, got ${rows[0].role}`);
});

await check("audit event 'tenant.created' recorded", async () => {
  // Audit writes are fire-and-forget; give them a tick to land.
  await new Promise((r) => setTimeout(r, 750));
  const rows = await sql.query(
    `SELECT action FROM audit_events WHERE tenant_id = $1`,
    [createdTenantId],
  );
  if (rows.length === 0) throw new Error("no audit events for new tenant");
  if (!rows.some((r) => r.action === "tenant.created"))
    throw new Error(`no tenant.created event; got: ${rows.map((r) => r.action).join(",")}`);
});

await check("cleanup signup tenant + user", async () => {
  await sql.query(`DELETE FROM tenants WHERE id = $1`, [createdTenantId]);
  await sql.query(`DELETE FROM users WHERE id = $1`, [createdUserId]);
});

// --- 7. Trial expiration enforcement --------------------------------------
section("Trial expiration enforcement");
const expiredTenantId = rid("ten");
const expiredUserId = rid("usr");
const expiredEmail = `pressure-expired+${Date.now()}@example.com`;

await check("seed expired-trial tenant with dedicated user", async () => {
  await sql.query(
    `INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
     VALUES ($1, $2, $3, 'starter', 'trialing', now() - interval '1 day')`,
    [expiredTenantId, `expired-${Date.now().toString(36)}`, "Expired Trial Tenant"],
  );
  await sql.query(
    `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
    [expiredUserId, expiredEmail],
  );
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
    [rid("mem"), expiredTenantId, expiredUserId],
  );
});

const expiredCookie = await mintSession(expiredUserId, expiredTenantId, expiredEmail);

await check("expired-trial tenant sees BillingRequired page", async () => {
  const res = await fetchSite("/command-centre", {
    headers: { Cookie: expiredCookie },
    redirect: "manual",
  });
  eqStatus("dashboard", 200)(res);
  const html = await res.text();
  if (!html.includes("Trial ended") && !html.includes("Manage billing"))
    throw new Error("BillingRequired page missing for expired trial");
});

// --- 8. Cleanup ----------------------------------------------------------
section("Cleanup");
await check("delete expired tenant", async () => {
  await sql.query(`DELETE FROM tenants WHERE id = $1`, [expiredTenantId]);
});
await check("delete expired-user", async () => {
  await sql.query(`DELETE FROM users WHERE id = $1`, [expiredUserId]);
});
await check("delete test tenant", async () => {
  await sql.query(`DELETE FROM tenants WHERE id = $1`, [testTenantId]);
});
await check("delete test user", async () => {
  await sql.query(`DELETE FROM users WHERE id = $1`, [testUserId]);
});

console.log(`\n━━━ RESULT ━━━`);
console.log(`  ${pass} passed, ${fail} failed`);
if (failures.length) {
  console.log(`\nFailures:`);
  failures.forEach((f) => console.log(`  - ${f}`));
  process.exit(1);
}
