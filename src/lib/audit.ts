/**
 * Tenant-scoped audit log helper.
 *
 * Fire-and-forget: callers don't await the write. Failures are logged but
 * never throw, so a flaky DB write never blocks the user-facing action.
 *
 * Actions follow a verb.object convention: "tenant.created", "member.invited",
 * "integration.ghl.connected", "overlay.saved", "subscription.activated".
 */

import { db } from "@/lib/db/client";
import { auditEvents } from "@/lib/db/schema";
import { ids } from "@/lib/db/ids";

export type AuditEntry = {
  tenantId: string;
  actorUserId?: string | null;
  actorEmail?: string | null;
  action: string;
  target?: string | null;
  metadata?: Record<string, unknown> | null;
};

export function recordAudit(entry: AuditEntry): void {
  // Fire-and-forget. Don't await; never throw.
  (async () => {
    try {
      await db().insert(auditEvents).values({
        id: ids.audit(),
        tenantId: entry.tenantId,
        actorUserId: entry.actorUserId ?? null,
        actorEmail: entry.actorEmail ?? null,
        action: entry.action,
        target: entry.target ?? null,
        metadata: entry.metadata ?? null,
      });
    } catch (e) {
      console.error("[audit] write failed:", entry.action, e);
    }
  })();
}
