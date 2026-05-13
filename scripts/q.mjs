import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
console.log("Users:", await sql.query("SELECT id, email, to_char(created_at,'YYYY-MM-DD HH24:MI') as c FROM users ORDER BY created_at"));
console.log("HBNH memberships:", await sql.query("SELECT m.role, u.email FROM memberships m JOIN tenants t ON t.id=m.tenant_id JOIN users u ON u.id=m.user_id WHERE t.slug='homes-by-nh-founding'"));
