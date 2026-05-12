/**
 * Neon-backed Drizzle client. Lazily instantiated so route handlers can import
 * `db` without crashing at build time if DATABASE_URL is not yet set.
 *
 * Use `db()` inside server code, not at module top-level.
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";

neonConfig.fetchConnectionCache = true;

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const isDbConfigured = () => Boolean(process.env.DATABASE_URL);

export function db() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL not set. Provision a Neon database via the Vercel dashboard and add DATABASE_URL to env.",
    );
  }
  if (_db) return _db;
  const client = neon(process.env.DATABASE_URL);
  _db = drizzle(client, { schema });
  return _db;
}

export { schema };
