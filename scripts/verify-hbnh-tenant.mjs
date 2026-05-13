#!/usr/bin/env node
/**
 * Verifies the seeded Homes by NH tenant: tenant + users + memberships exist,
 * the GHL integration row decrypts cleanly with BH_ENCRYPTION_KEY, and the
 * tenant config produces a live GHL response.
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import { createDecipheriv, scryptSync } from "node:crypto";

for (const line of readFileSync(".env.production.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="(.*)"$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const sql = neon(process.env.DATABASE_URL);
const pass = (m) => console.log(`✓ ${m}`);
const fail = (m) => {
  console.error(`✗ ${m}`);
  process.exitCode = 1;
};

function decryptJson(ciphertext, iv, tag) {
  const raw = process.env.BH_ENCRYPTION_KEY;
  let key;
  try {
    const d = Buffer.from(raw, "base64");
    key = d.length === 32 ? d : scryptSync(raw, "buildhawk-saas-v1", 32);
  } catch {
    key = scryptSync(raw, "buildhawk-saas-v1", 32);
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const plain = Buffer.concat([decipher.update(Buffer.from(ciphertext, "base64")), decipher.final()]);
  return JSON.parse(plain.toString("utf8"));
}

async function main() {
  const tenants = await sql`SELECT * FROM tenants WHERE slug = 'homes-by-nh-founding' LIMIT 1`;
  if (tenants.length !== 1) {
    fail("Homes by NH tenant not found");
    return;
  }
  const tenant = tenants[0];
  pass(`Tenant: ${tenant.id} (${tenant.name}), plan=${tenant.plan}, status=${tenant.status}`);

  const founders = await sql`SELECT u.email, m.role FROM users u
    INNER JOIN memberships m ON m.user_id = u.id
    WHERE m.tenant_id = ${tenant.id}`;
  if (founders.length >= 1) pass(`${founders.length} founder${founders.length > 1 ? "s" : ""}: ${founders.map((f) => `${f.email} (${f.role})`).join(", ")}`);
  else fail("No founders attached");

  const integrations = await sql`SELECT * FROM integrations
    WHERE tenant_id = ${tenant.id} AND kind = 'ghl' AND is_active = true LIMIT 1`;
  if (integrations.length !== 1) {
    fail("GHL integration not found for HBNH tenant");
    return;
  }
  const integration = integrations[0];
  pass(`GHL integration row: ${integration.id}`);

  let cfg;
  try {
    cfg = decryptJson(integration.encrypted_config, integration.config_iv, integration.config_tag);
    pass(`GHL credentials decrypt cleanly (locationId=${cfg.locationId}, projectDataFieldId=${cfg.projectDataFieldId ? "set" : "unset"})`);
  } catch (e) {
    fail(`GHL credentials failed to decrypt: ${e.message}`);
    return;
  }

  /* Hit the GHL API with the decrypted token to confirm it's valid + see real opportunities */
  const res = await fetch(
    `https://services.leadconnectorhq.com/opportunities/search?location_id=${cfg.locationId}&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        "Content-Type": "application/json",
        Version: "2021-07-28",
      },
    },
  );
  if (res.status === 200) {
    const data = await res.json();
    pass(`GHL live data flowing (${data.opportunities?.length ?? 0} opportunities returned in sample)`);
  } else {
    fail(`GHL responded ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
}

main().catch((e) => fail(`Crash: ${e?.stack ?? e}`));
