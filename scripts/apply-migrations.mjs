#!/usr/bin/env node
// Apply Drizzle SQL migrations directly via the Neon HTTP driver. Used when
// `drizzle-kit push` hangs on websocket negotiation in restricted shells.
//
// Usage: node scripts/apply-migrations.mjs [--file drizzle/0000_init.sql]

import { readFileSync, readdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL not set in .env.local");
  process.exit(1);
}

const sql = neon(url);

const args = process.argv.slice(2);
const fileFlag = args.indexOf("--file");
let files;
if (fileFlag >= 0 && args[fileFlag + 1]) {
  files = [args[fileFlag + 1]];
} else {
  const dir = resolve("drizzle");
  files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((f) => join("drizzle", f));
}

for (const file of files) {
  console.log(`\n→ ${file}`);
  const raw = readFileSync(file, "utf8");
  // Split on Drizzle's statement-breakpoint marker.
  const statements = raw
    .split(/--> statement-breakpoint/)
    .map((s) => s.trim())
    .filter(Boolean);
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.replace(/\s+/g, " ").slice(0, 80);
    try {
      await sql.query(stmt);
      console.log(`  ✓ [${i + 1}/${statements.length}] ${preview}`);
    } catch (e) {
      if (
        e.message?.includes("already exists") ||
        e.message?.includes("does not exist")
      ) {
        console.log(`  ~ [${i + 1}/${statements.length}] ${e.message.replace(/\n.*/s, "")}`);
      } else {
        console.error(`  ✗ [${i + 1}/${statements.length}] ${preview}`);
        console.error(`    ${e.message}`);
        process.exit(1);
      }
    }
  }
}

console.log("\nDone.");
