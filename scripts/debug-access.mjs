#!/usr/bin/env node
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);
const expiredId = "ten_debug_expired";
const userId = "usr_debug_001";

await sql.query(`DELETE FROM tenants WHERE id = $1`, [expiredId]);
await sql.query(`DELETE FROM users WHERE id = $1`, [userId]);

await sql.query(
  `INSERT INTO tenants (id, slug, name, plan, status, trial_ends_at)
   VALUES ($1, $2, $3, 'starter', 'trialing', now() - interval '1 day')`,
  [expiredId, "debug-expired", "Debug Expired"],
);
await sql.query(
  `INSERT INTO users (id, email, email_verified) VALUES ($1, $2, true)`,
  [userId, "debug+expired@test.local"],
);
await sql.query(
  `INSERT INTO memberships (id, tenant_id, user_id, role) VALUES ($1, $2, $3, 'owner')`,
  ["mem_debug_001", expiredId, userId],
);

// Direct DB read to confirm shape
const rows = await sql.query(
  `SELECT id, status, trial_ends_at,
          (trial_ends_at < now()) as is_past,
          extract(epoch from (trial_ends_at - now())) as remaining_sec
   FROM tenants WHERE id = $1`,
  [expiredId],
);
console.log("Raw row:", JSON.stringify(rows[0], null, 2));

// Cleanup
await sql.query(`DELETE FROM tenants WHERE id = $1`, [expiredId]);
await sql.query(`DELETE FROM users WHERE id = $1`, [userId]);
