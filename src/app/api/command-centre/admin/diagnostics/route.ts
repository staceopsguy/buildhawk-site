/**
 * One-shot diagnostics endpoint. Verifies the full server-side SaaS plumbing:
 * DB connectivity, schema presence, encryption round-trip, and per-tenant GHL
 * decryption. Gated by SETUP_SECRET so it's safe to leave deployed.
 */

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, isDbConfigured } from "@/lib/db/client";
import {
  auditEvents,
  integrations,
  memberships,
  tenants,
  users,
} from "@/lib/db/schema";
import { isEncryptionConfigured } from "@/lib/crypto";
import { getGhlConfig } from "@/lib/integrations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const setup = req.headers.get("x-setup-secret");
  if (!setup || setup !== process.env.SETUP_SECRET) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const checks: { name: string; ok: boolean; detail?: unknown }[] = [];
  const add = (name: string, ok: boolean, detail?: unknown) =>
    checks.push({ name, ok, ...(detail !== undefined ? { detail } : {}) });

  add("DATABASE_URL set", isDbConfigured());
  add("BH_ENCRYPTION_KEY set", isEncryptionConfigured());
  add("BH_AUTH_SECRET set", Boolean(process.env.BH_AUTH_SECRET));
  add("RESEND_API_KEY set", Boolean(process.env.RESEND_API_KEY));
  add("ANTHROPIC_API_KEY set", Boolean(process.env.ANTHROPIC_API_KEY));

  try {
    const tenantCount = (await db().select().from(tenants)).length;
    const userCount = (await db().select().from(users)).length;
    const integrationCount = (await db().select().from(integrations)).length;
    const auditCount = (await db().select().from(auditEvents)).length;
    add("DB counts", true, {
      tenants: tenantCount,
      users: userCount,
      integrations: integrationCount,
      audit: auditCount,
    });
  } catch (e) {
    add("DB counts", false, { error: e instanceof Error ? e.message : String(e) });
  }

  try {
    const hbnh = (
      await db().select().from(tenants).where(eq(tenants.slug, "homes-by-nh-founding")).limit(1)
    )[0];
    if (!hbnh) {
      add("HBNH tenant exists", false);
    } else {
      add("HBNH tenant exists", true, { id: hbnh.id, name: hbnh.name });
      const members = await db()
        .select({ email: users.email, role: memberships.role })
        .from(memberships)
        .innerJoin(users, eq(users.id, memberships.userId))
        .where(eq(memberships.tenantId, hbnh.id));
      add("HBNH owners", members.length > 0, members);
      try {
        const cfg = await getGhlConfig(hbnh.id);
        if (cfg) {
          // Test live GHL call.
          const r = await fetch(
            `https://services.leadconnectorhq.com/opportunities/search?location_id=${cfg.locationId}&limit=3`,
            {
              headers: {
                Authorization: `Bearer ${cfg.apiKey}`,
                "Content-Type": "application/json",
                Version: "2021-07-28",
              },
            },
          );
          add("HBNH GHL decrypt", true, {
            locationId: cfg.locationId,
            projectDataFieldIdSet: Boolean(cfg.projectDataFieldId),
          });
          if (r.status === 200) {
            const data = await r.json();
            add("HBNH GHL live call", true, {
              opportunitiesReturned: data.opportunities?.length ?? 0,
            });
          } else {
            add("HBNH GHL live call", false, {
              status: r.status,
              body: (await r.text()).slice(0, 160),
            });
          }
        } else {
          add("HBNH GHL decrypt", false, "getGhlConfig returned null");
        }
      } catch (e) {
        add("HBNH GHL decrypt", false, {
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
  } catch (e) {
    add("HBNH tenant lookup", false, { error: e instanceof Error ? e.message : String(e) });
  }

  const allOk = checks.every((c) => c.ok);
  return NextResponse.json({ ok: allOk, checks });
}
