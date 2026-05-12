/**
 * One-shot seed endpoint for the Homes by NH founding tenant.
 *
 * Reads from the legacy single-tenant env vars and writes:
 *   - tenants  ("Homes by NH", plan=pro, status=active)
 *   - users    (one per email in BH_AUTHORIZED_EMAILS)
 *   - memberships (each founder = owner)
 *   - integrations (encrypted GHL credentials attached to the tenant)
 *
 * Gated by SETUP_SECRET in the X-Setup-Secret header. Idempotent.
 *
 * Once the founding cohort is seeded, this route should be removed (or its
 * SETUP_SECRET rotated).
 */

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  integrations,
  memberships,
  tenants,
  users,
} from "@/lib/db/schema";
import { ids } from "@/lib/db/ids";
import { encryptJson, isEncryptionConfigured } from "@/lib/crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TENANT_NAME = "Homes by NH";
const TENANT_SLUG = "homes-by-nh-founding";

export async function POST(req: Request) {
  const setup = req.headers.get("x-setup-secret");
  if (!setup || setup !== process.env.SETUP_SECRET) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  if (!isEncryptionConfigured()) {
    return NextResponse.json(
      { ok: false, error: "BH_ENCRYPTION_KEY not set" },
      { status: 503 },
    );
  }

  const founderEmails = (process.env.BH_AUTHORIZED_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (founderEmails.length === 0) {
    return NextResponse.json(
      { ok: false, error: "BH_AUTHORIZED_EMAILS not set in production" },
      { status: 503 },
    );
  }

  const log: string[] = [];

  let tenant = (
    await db().select().from(tenants).where(eq(tenants.slug, TENANT_SLUG)).limit(1)
  )[0];
  if (!tenant) {
    const tenantId = ids.tenant();
    [tenant] = await db()
      .insert(tenants)
      .values({
        id: tenantId,
        slug: TENANT_SLUG,
        name: TENANT_NAME,
        plan: "pro",
        status: "active",
        primaryRegion: "Geelong VIC",
        settings: { targetMarginPct: 17, varianceThresholdPct: 5 },
      })
      .returning();
    log.push(`Created tenant ${tenant.id} (${TENANT_NAME})`);
  } else {
    log.push(`Tenant exists: ${tenant.id}`);
  }

  for (const email of founderEmails) {
    let user = (
      await db().select().from(users).where(eq(users.email, email)).limit(1)
    )[0];
    if (!user) {
      const userId = ids.user();
      [user] = await db()
        .insert(users)
        .values({ id: userId, email, emailVerified: true })
        .returning();
      log.push(`Created user ${user.id} (${email})`);
    } else {
      log.push(`User exists: ${email}`);
    }

    const existing = (
      await db()
        .select()
        .from(memberships)
        .where(and(eq(memberships.tenantId, tenant.id), eq(memberships.userId, user.id)))
        .limit(1)
    )[0];
    if (!existing) {
      await db().insert(memberships).values({
        id: ids.membership(),
        tenantId: tenant.id,
        userId: user.id,
        role: "owner",
      });
      log.push(`  → granted owner role to ${email}`);
    }
  }

  const apiKey = process.env.GHL_HBNH_API_KEY;
  const locationId = process.env.GHL_HBNH_LOCATION_ID || "faIZiavkSvyDcMVx7Dmf";
  const projectDataFieldId = process.env.GHL_HBNH_PROJECT_DATA_FIELD_ID;
  if (apiKey) {
    const existing = (
      await db()
        .select()
        .from(integrations)
        .where(and(eq(integrations.tenantId, tenant.id), eq(integrations.kind, "ghl")))
        .limit(1)
    )[0];
    const enc = encryptJson({ apiKey, locationId, projectDataFieldId });
    if (existing) {
      await db()
        .update(integrations)
        .set({
          encryptedConfig: enc.ciphertext,
          configIv: enc.iv,
          configTag: enc.tag,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, existing.id));
      log.push("Updated GHL integration");
    } else {
      await db().insert(integrations).values({
        id: ids.integration(),
        tenantId: tenant.id,
        kind: "ghl",
        encryptedConfig: enc.ciphertext,
        configIv: enc.iv,
        configTag: enc.tag,
        isActive: true,
      });
      log.push("Created GHL integration");
    }
  } else {
    log.push("Skipped GHL: no GHL_HBNH_API_KEY in env");
  }

  return NextResponse.json({
    ok: true,
    tenantId: tenant.id,
    tenantSlug: tenant.slug,
    founderCount: founderEmails.length,
    log,
  });
}
