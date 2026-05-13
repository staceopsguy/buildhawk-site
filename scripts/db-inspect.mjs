#!/usr/bin/env node
// Deep inspection: dump current state of every multi-tenant table for
// pressure testing. Reads only; never writes.

import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

const section = (title) => console.log(`\n━━━ ${title} ━━━`);

section("tenants");
const tenants = await sql.query(`
  SELECT id, slug, name, plan, status,
         to_char(trial_ends_at, 'YYYY-MM-DD') as trial_ends,
         stripe_customer_id is not null as has_stripe_customer,
         to_char(created_at, 'YYYY-MM-DD HH24:MI') as created
  FROM tenants ORDER BY created_at DESC LIMIT 10
`);
console.table(tenants);

section("users");
const users = await sql.query(`
  SELECT id, email, name, email_verified,
         to_char(created_at, 'YYYY-MM-DD HH24:MI') as created
  FROM users ORDER BY created_at DESC LIMIT 10
`);
console.table(users);

section("memberships (joined to user + tenant)");
const memberships = await sql.query(`
  SELECT m.id, t.name as tenant, u.email as user, m.role,
         to_char(m.created_at, 'YYYY-MM-DD HH24:MI') as created
  FROM memberships m
  JOIN tenants t on t.id = m.tenant_id
  JOIN users u on u.id = m.user_id
  ORDER BY m.created_at DESC LIMIT 20
`);
console.table(memberships);

section("integrations (config blob length only — never decrypt here)");
const integrations = await sql.query(`
  SELECT i.id, t.name as tenant, i.kind, i.label,
         length(i.encrypted_config) as cfg_len,
         i.is_active, to_char(i.last_sync_at, 'YYYY-MM-DD HH24:MI') as last_sync
  FROM integrations i
  JOIN tenants t on t.id = i.tenant_id
  ORDER BY i.created_at DESC LIMIT 20
`);
console.table(integrations);

section("invitations");
const invitations = await sql.query(`
  SELECT i.id, t.name as tenant, i.email, i.role, i.status,
         to_char(i.expires_at, 'YYYY-MM-DD HH24:MI') as expires
  FROM invitations i
  JOIN tenants t on t.id = i.tenant_id
  ORDER BY i.created_at DESC LIMIT 10
`);
console.table(invitations);

section("audit_events (last 20)");
const audit = await sql.query(`
  SELECT a.action, a.actor_email, a.target,
         to_char(a.created_at, 'YYYY-MM-DD HH24:MI') as created,
         t.name as tenant
  FROM audit_events a
  JOIN tenants t on t.id = a.tenant_id
  ORDER BY a.created_at DESC LIMIT 20
`);
console.table(audit);

section("magic_links (last 5; only structural fields)");
const magic = await sql.query(`
  SELECT email, purpose, redirect,
         to_char(expires_at, 'YYYY-MM-DD HH24:MI') as expires,
         to_char(consumed_at, 'YYYY-MM-DD HH24:MI') as consumed
  FROM magic_links ORDER BY id DESC LIMIT 5
`);
console.table(magic);

section("benchmark_samples (counts only)");
const benchTotal = await sql.query(`SELECT count(*)::int as total FROM benchmark_samples`);
console.log(`  Total rows: ${benchTotal[0].total}`);
const benchByDim = await sql.query(`
  SELECT region, trade_section, project_type, count(*)::int as samples,
         round(avg(awarded_value)::numeric, 2)::text as avg_value
  FROM benchmark_samples
  GROUP BY region, trade_section, project_type
  ORDER BY count(*) DESC LIMIT 10
`);
console.table(benchByDim);

section("usage_counters");
const usage = await sql.query(`
  SELECT t.name as tenant, u.metric, u.count,
         to_char(u.period_start, 'YYYY-MM') as period
  FROM usage_counters u
  JOIN tenants t on t.id = u.tenant_id
  ORDER BY u.period_start DESC LIMIT 10
`);
console.table(usage);
