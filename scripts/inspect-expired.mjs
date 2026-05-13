#!/usr/bin/env node
import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes } from "node:crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
const BASE = "https://www.buildhawk.com.au";

const tid = `ten_exp_${Date.now().toString(36)}`;
const uid = `usr_exp_${Date.now().toString(36)}`;
const email = `exp+${Date.now()}@t.l`;

await sql.query(`INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
                 VALUES ($1, $2, $3, 'starter', 'trialing', now() - interval '1 day')`,
  [tid, `exp-${Date.now().toString(36)}`, "ExpiredTest"]);
await sql.query(`INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`, [uid, email]);
await sql.query(`INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1,$2,$3,'owner')`,
  [`m_${Date.now().toString(36)}`, tid, uid]);

const tenantRow = (await sql.query(`SELECT id, status, trial_ends_at, plan FROM tenants WHERE id = $1`, [tid]))[0];
console.log("Tenant row (raw):", tenantRow);
console.log("trial_ends_at type:", typeof tenantRow.trial_ends_at);

const raw = randomBytes(32).toString("base64url");
const hash = createHash("sha256").update(raw).digest("hex");
await sql.query(`INSERT INTO magic_links (id, token_hash, email, purpose, redirect, expires_at)
                 VALUES ($1,$2,$3,'signin','/command-centre', now()+interval '30 min')`,
  [`l_${Date.now().toString(36)}`, hash, email]);

const v = await fetch(`${BASE}/api/command-centre/auth/verify?token=${encodeURIComponent(raw)}`, { redirect: "manual" });
const c = (v.headers.get("set-cookie") || "").match(/bh_session=([^;]+)/);
console.log("Verify redirect to:", v.headers.get("location"));
const cookie = `bh_session=${c[1]}`;

const r = await fetch(`${BASE}/command-centre`, { headers: { Cookie: cookie }, redirect: "manual" });
console.log("Dashboard status:", r.status);
const html = await r.text();
const probes = ["Trial ended", "Manage billing", "trial_expired", "Billing required",
                "Awaiting data", "ExpiredTest", "Subscription canceled", "BUILDHAWK"];
for (const p of probes) {
  console.log(`  ${html.includes(p) ? "✓" : "·"} ${p}`);
}
console.log("\nFirst 800 chars of body:");
const bodyStart = html.indexOf("<body");
console.log(html.substring(bodyStart, bodyStart + 800).replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));

await sql.query(`DELETE FROM tenants WHERE id = $1`, [tid]);
await sql.query(`DELETE FROM users WHERE id = $1`, [uid]);
