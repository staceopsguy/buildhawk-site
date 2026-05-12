/**
 * Tenant-scoped integration credential resolver.
 *
 * Credentials are stored encrypted in the integrations table. Read them once
 * per request and pass into the relevant integration client.
 *
 * Legacy single-tenant deployments (env-var-driven Homes by NH) keep working
 * as a fallback when the DB has no tenant integration row.
 */

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { integrations } from "@/lib/db/schema";
import { decryptJson, encryptJson, isEncryptionConfigured } from "@/lib/crypto";
import { ids } from "@/lib/db/ids";

export type GhlConfig = {
  apiKey: string;
  locationId: string;
  projectDataFieldId?: string;
};

export async function getGhlConfig(tenantId: string): Promise<GhlConfig | null> {
  if (!isEncryptionConfigured()) return null;
  const row = (
    await db()
      .select()
      .from(integrations)
      .where(
        and(
          eq(integrations.tenantId, tenantId),
          eq(integrations.kind, "ghl"),
          eq(integrations.isActive, true),
        ),
      )
      .limit(1)
  )[0];
  if (!row) return null;
  try {
    return decryptJson<GhlConfig>(row.encryptedConfig, row.configIv, row.configTag);
  } catch (e) {
    console.error("[integrations] decrypt ghl error:", e);
    return null;
  }
}

export async function saveGhlConfig(tenantId: string, config: GhlConfig) {
  if (!isEncryptionConfigured()) {
    throw new Error("BH_ENCRYPTION_KEY not set");
  }
  const enc = encryptJson(config);
  const existing = (
    await db()
      .select()
      .from(integrations)
      .where(and(eq(integrations.tenantId, tenantId), eq(integrations.kind, "ghl")))
      .limit(1)
  )[0];
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
    return existing.id;
  }
  const id = ids.integration();
  await db().insert(integrations).values({
    id,
    tenantId,
    kind: "ghl",
    encryptedConfig: enc.ciphertext,
    configIv: enc.iv,
    configTag: enc.tag,
    isActive: true,
  });
  return id;
}

export async function disconnectGhl(tenantId: string) {
  await db()
    .update(integrations)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(integrations.tenantId, tenantId), eq(integrations.kind, "ghl")));
}

/**
 * Legacy single-tenant fallback. Returns the env-var-driven Homes by NH config
 * when present, so the single-tenant deployment keeps working until migrated.
 */
export function getLegacyGhlConfig(): GhlConfig | null {
  const apiKey = process.env.GHL_HBNH_API_KEY;
  const locationId = process.env.GHL_HBNH_LOCATION_ID || "faIZiavkSvyDcMVx7Dmf";
  if (!apiKey) return null;
  return {
    apiKey,
    locationId,
    projectDataFieldId: process.env.GHL_HBNH_PROJECT_DATA_FIELD_ID,
  };
}
