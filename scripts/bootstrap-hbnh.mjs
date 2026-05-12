#!/usr/bin/env node
/**
 * Bootstrap the Homes by NH founding-subscriber tenant. Idempotent:
 *   - Creates tenant if absent (slug: homes-by-nh)
 *   - Creates user for services@buildhawk.com.au if absent
 *   - Creates owner membership if absent
 *   - Creates a GHL integration row from the existing HBNH env vars (encrypted)
 *
 * Run after Drizzle schema is pushed: `node scripts/bootstrap-hbnh.mjs`
 */

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import {
  createCipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
const encKey = process.env.BH_ENCRYPTION_KEY;
const ghlApiKey = process.env.GHL_HBNH_API_KEY;
const ghlLocationId = process.env.GHL_HBNH_LOCATION_ID;
const ghlFieldId = process.env.GHL_HBNH_PROJECT_DATA_FIELD_ID;

for (const [k, v] of Object.entries({
  DATABASE_URL: url,
  BH_ENCRYPTION_KEY: encKey,
  GHL_HBNH_API_KEY: ghlApiKey,
  GHL_HBNH_LOCATION_ID: ghlLocationId,
  GHL_HBNH_PROJECT_DATA_FIELD_ID: ghlFieldId,
})) {
  if (!v) {
    console.error(`Missing required env: ${k}`);
    process.exit(1);
  }
}

const sql = neon(url);

const ALPHA = "0123456789abcdefghijkmnpqrstuvwxyz";
const nano = (len = 16) => {
  const b = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += ALPHA[b[i] % ALPHA.length];
  return out;
};

const getKey = () => {
  const decoded = Buffer.from(encKey, "base64");
  if (decoded.length === 32) return decoded;
  return scryptSync(encKey, "buildhawk-saas-v1", 32);
};

const encryptJson = (value) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const ct = Buffer.concat([
    cipher.update(Buffer.from(JSON.stringify(value), "utf8")),
    cipher.final(),
  ]);
  return {
    ciphertext: ct.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
};

const TENANT_SLUG = "homes-by-nh";
const OWNER_EMAIL = "services@buildhawk.com.au";
const OWNER_NAME = "Nathan Holloway";
const TENANT_NAME = "Homes by NH";

// 1. Tenant
let [tenant] = await sql.query(
  `SELECT id FROM tenants WHERE slug = $1 LIMIT 1`,
  [TENANT_SLUG],
);
if (!tenant) {
  const id = `ten_${nano(16)}`;
  await sql.query(
    `INSERT INTO tenants (id, slug, name, primary_region, status, plan, trial_ends_at)
     VALUES ($1, $2, $3, $4, 'active', 'pro', NULL)`,
    [id, TENANT_SLUG, TENANT_NAME, "Geelong VIC"],
  );
  tenant = { id };
  console.log(`✓ created tenant ${id} (${TENANT_NAME})`);
} else {
  console.log(`~ tenant exists: ${tenant.id}`);
}

// 2. User
let [user] = await sql.query(
  `SELECT id FROM users WHERE email = $1 LIMIT 1`,
  [OWNER_EMAIL],
);
if (!user) {
  const id = `usr_${nano(16)}`;
  await sql.query(
    `INSERT INTO users (id, email, name, email_verified)
     VALUES ($1, $2, $3, true)`,
    [id, OWNER_EMAIL, OWNER_NAME],
  );
  user = { id };
  console.log(`✓ created user ${id} (${OWNER_EMAIL})`);
} else {
  console.log(`~ user exists: ${user.id}`);
}

// 3. Membership
const [existingMembership] = await sql.query(
  `SELECT id FROM memberships WHERE tenant_id = $1 AND user_id = $2 LIMIT 1`,
  [tenant.id, user.id],
);
if (!existingMembership) {
  const id = `mem_${nano(16)}`;
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role)
     VALUES ($1, $2, $3, 'owner')`,
    [id, tenant.id, user.id],
  );
  console.log(`✓ created owner membership ${id}`);
} else {
  console.log(`~ owner membership exists: ${existingMembership.id}`);
}

// 4. GHL integration (only create if none exists for this tenant + kind=ghl)
const [existingIntegration] = await sql.query(
  `SELECT id FROM integrations WHERE tenant_id = $1 AND kind = 'ghl' LIMIT 1`,
  [tenant.id],
);
if (!existingIntegration) {
  const id = `int_${nano(16)}`;
  const enc = encryptJson({
    apiKey: ghlApiKey,
    locationId: ghlLocationId,
    projectDataFieldId: ghlFieldId,
  });
  await sql.query(
    `INSERT INTO integrations
       (id, tenant_id, kind, label, encrypted_config, config_iv, config_tag, is_active)
     VALUES ($1, $2, 'ghl', $3, $4, $5, $6, true)`,
    [id, tenant.id, "BuildHawk Command Centre · HBNH", enc.ciphertext, enc.iv, enc.tag],
  );
  console.log(`✓ created GHL integration ${id}`);
} else {
  console.log(`~ GHL integration exists: ${existingIntegration.id}`);
}

console.log("\nBootstrap complete.");
console.log(`Nathan can now sign in at https://www.buildhawk.com.au/command-centre/login`);
console.log(`(Magic link will be sent to ${OWNER_EMAIL})`);
