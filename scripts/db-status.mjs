#!/usr/bin/env node
// Quick DB inspection: list tables, row counts. Run with `node scripts/db-status.mjs`.

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

const tables = await sql.query(
  `SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public' ORDER BY table_name`,
);

console.log(`Tables (${tables.length}):`);
for (const t of tables) {
  const [{ count }] = await sql.query(
    `SELECT COUNT(*)::int as count FROM "${t.table_name}"`,
  );
  console.log(`  ${t.table_name.padEnd(30)} rows=${count}`);
}
