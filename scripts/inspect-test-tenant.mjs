#!/usr/bin/env node
// Inspect what /command-centre actually returns for a tenant with no GHL
// integration. Used to debug the cross-tenant leak.
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const BASE = process.env.BASE_URL || "https://www.buildhawk.com.au";

const tid = `ten_inspect_${Date.now().toString(36)}`;
const uid = `usr_inspect_${Date.now().toString(36)}`;
const email = `inspect+${Date.now()}@test.local`;

await sql.query(`INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
                 VALUES ($1, $2, $3, 'starter', 'trialing', now() + interval '14 days')`,
  [tid, `inspect-${Date.now().toString(36)}`, "Inspect Tenant"]);
await sql.query(`INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`, [uid, email]);
await sql.query(`INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
  [`mem_${Date.now().toString(36)}`, tid, uid]);

// Mint session via real verify endpoint
const rawToken = randomBytes(32).toString("base64url");
const tokenHash = createHash("sha256").update(rawToken).digest("hex");
await sql.query(`INSERT INTO magic_links (id, token_hash, email, purpose, redirect, expires_at)
                 VALUES ($1, $2, $3, 'signin', '/command-centre', now() + interval '30 minutes')`,
  [`mlk_${Date.now().toString(36)}`, tokenHash, email]);
const verifyRes = await fetch(`${BASE}/api/command-centre/auth/verify?token=${encodeURIComponent(rawToken)}`, { redirect: "manual" });
const setCookie = verifyRes.headers.get("set-cookie") || "";
const m = setCookie.match(/bh_session=([^;]+)/);
if (!m) throw new Error("no session cookie");
const cookie = `bh_session=${m[1]}`;

const res = await fetch(`${BASE}/command-centre`, { headers: { Cookie: cookie }, redirect: "manual" });
const html = await res.text();
console.log("Status:", res.status);
console.log("HTML length:", html.length);

const markers = ["Autumn St", "Overview Cres", "Apollo Bay", "Stawell", "Homes by NH", "Awaiting data", "Connect", "Inspect Tenant"];
console.log("\nMarker presence:");
for (const m of markers) {
  console.log(`  ${html.includes(m) ? "✓" : "·"} ${m}`);
}

// Cleanup
await sql.query(`DELETE FROM tenants WHERE id = $1`, [tid]);
await sql.query(`DELETE FROM users WHERE id = $1`, [uid]);
