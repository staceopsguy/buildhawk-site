#!/usr/bin/env node
// Idempotently ensure the HBNH founding subscriber (Nathan) has a user row
// and an owner membership. Safe to run anytime.
import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const NATHAN_EMAIL = "services@buildhawk.com.au";

const tenant = (
  await sql.query(`SELECT id FROM tenants WHERE slug = 'homes-by-nh-founding'`)
)[0];
if (!tenant) {
  console.error("HBNH tenant not found");
  process.exit(1);
}

const existing = await sql.query(`SELECT id FROM users WHERE email = $1`, [NATHAN_EMAIL]);
let userId;
if (existing.length > 0) {
  userId = existing[0].id;
  console.log(`Nathan user already exists: ${userId}`);
} else {
  userId = `usr_${randomBytes(8).toString("hex")}`;
  await sql.query(
    `INSERT INTO users (id, email, name, email_verified) VALUES ($1, $2, $3, true)`,
    [userId, NATHAN_EMAIL, "Nathan Holloway"],
  );
  console.log(`Created Nathan user: ${userId}`);
}

const membership = await sql.query(
  `SELECT id FROM memberships WHERE tenant_id = $1 AND user_id = $2`,
  [tenant.id, userId],
);
if (membership.length > 0) {
  console.log("HBNH owner membership already exists");
} else {
  await sql.query(
    `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
    [`mem_${randomBytes(8).toString("hex")}`, tenant.id, userId],
  );
  console.log("Created HBNH owner membership for Nathan");
}
