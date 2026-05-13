"use client";

import { useEffect, useState } from "react";
import { PLANS, type PlanTier } from "@/lib/billing/plans";
import {
  CONNECTORS,
  connectorGroups,
  statusLabel,
  type Connector,
} from "@/lib/integrations/connectors";

type TenantSummary = {
  id: string;
  name: string;
  plan: PlanTier;
  status: string;
  stripeCustomerId: string | null;
};

type GhlSummary = {
  locationId: string;
  hasApiKey: boolean;
  projectDataFieldId: string | null;
};

export default function SettingsClient({
  tenant,
  membership,
  ghl,
  stripeReady,
}: {
  tenant: TenantSummary;
  membership: { role: string };
  ghl: GhlSummary | null;
  stripeReady: boolean;
}) {
  const isAdmin = membership.role === "owner" || membership.role === "admin";
  return (
    <div className="space-y-8">
      <Section title="Plan + billing">
        <PlanGrid currentTier={tenant.plan} isAdmin={isAdmin} stripeReady={stripeReady} />
        {tenant.stripeCustomerId && isAdmin && (
          <div className="mt-3 text-xs">
            <PortalButton />
          </div>
        )}
      </Section>

      <Section title="Integrations">
        <IntegrationsCatalog tenantId={tenant.id} ghl={ghl} isAdmin={isAdmin} />
      </Section>

      <Section title="Team">
        <TeamPanel tenantId={tenant.id} isAdmin={isAdmin} />
      </Section>

      {isAdmin && (
        <Section title="Activity log">
          <AuditPanel />
        </Section>
      )}
    </div>
  );
}

function AuditPanel() {
  const [events, setEvents] = useState<
    Array<{
      id: string;
      action: string;
      target: string | null;
      actorEmail: string | null;
      metadata: Record<string, unknown> | null;
      createdAt: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/command-centre/audit", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.ok) setEvents(data.events);
        else setError(data.error ?? `Request failed (${res.status})`);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="text-sm text-slate-500">Loading…</div>;
  }
  if (error) {
    return <div className="text-sm text-rose-700">{error}</div>;
  }
  if (events.length === 0) {
    return (
      <div className="text-sm text-slate-500">
        No activity yet. Saves, integration changes and member events will show here.
      </div>
    );
  }
  return (
    <ul className="divide-y divide-slate-200/70 text-sm">
      {events.map((e) => (
        <li key={e.id} className="flex items-center justify-between gap-3 py-2">
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 truncate">{e.action}</div>
            <div className="text-[11px] text-slate-500 truncate">
              {e.actorEmail ?? "system"}
              {e.target ? ` · ${e.target}` : ""}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
            {new Date(e.createdAt).toLocaleString("en-AU", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white/65 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.18)] p-5">
      <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-3">
        {title}
      </div>
      {children}
    </section>
  );
}

function PlanGrid({
  currentTier,
  isAdmin,
  stripeReady,
}: {
  currentTier: PlanTier;
  isAdmin: boolean;
  stripeReady: boolean;
}) {
  const [pending, setPending] = useState<PlanTier | null>(null);
  const upgrade = async (tier: PlanTier) => {
    setPending(tier);
    try {
      const res = await fetch("/api/command-centre/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout failed");
        setPending(null);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
      setPending(null);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {Object.values(PLANS).map((p) => {
        const isCurrent = p.id === currentTier;
        const canUpgrade = isAdmin && stripeReady && p.id !== "enterprise" && !isCurrent;
        return (
          <div
            key={p.id}
            className={`rounded-xl border p-4 ${
              isCurrent ? "border-bh-orange bg-bh-orange-50/70" : "border-white/60 bg-white/50"
            }`}
          >
            <div className="flex items-baseline justify-between">
              <div className="font-bold">{p.name}</div>
              <div className="text-[11px] text-slate-500">{p.priceLabel}</div>
            </div>
            <p className="mt-1 text-xs text-slate-600">{p.blurb}</p>
            <ul className="mt-3 text-[11px] text-slate-600 space-y-0.5">
              {p.highlights.map((h) => (
                <li key={h}>· {h}</li>
              ))}
            </ul>
            {isCurrent && (
              <div className="mt-3 text-[11px] uppercase tracking-wider font-bold text-bh-orange-700">
                Current plan
              </div>
            )}
            {canUpgrade && (
              <button
                onClick={() => upgrade(p.id)}
                disabled={pending !== null}
                className="mt-3 w-full h-9 rounded-md bg-bh-ink text-white text-sm font-semibold hover:bg-bh-ink/90 disabled:opacity-60"
              >
                {pending === p.id ? "Redirecting…" : p.ctaLabel}
              </button>
            )}
            {p.id === "enterprise" && !isCurrent && (
              <a
                href="mailto:sales@buildhawk.com.au?subject=Enterprise%20enquiry"
                className="mt-3 w-full inline-flex items-center justify-center h-9 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Talk to sales
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PortalButton() {
  const [busy, setBusy] = useState(false);
  const open = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/command-centre/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.ok && data.url) window.location.href = data.url;
      else alert(data.error ?? "Portal failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <button
      onClick={open}
      disabled={busy}
      className="text-bh-orange-700 font-semibold underline underline-offset-2"
    >
      {busy ? "Opening…" : "Open Stripe customer portal"}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Integrations catalog
 * ─────────────────────────────────────────────────────────────────── */

function IntegrationsCatalog({
  tenantId,
  ghl,
  isAdmin,
}: {
  tenantId: string;
  ghl: GhlSummary | null;
  isAdmin: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(ghl ? null : "ghl");
  return (
    <div>
      <p className="text-xs text-slate-600 mb-4">
        Hawktress connects to whatever PM, CRM or accounting tool you already run. Bring your own
        data in via the live connectors, or request the one you need.
      </p>

      {connectorGroups.map((group) => {
        const inGroup = CONNECTORS.filter((c) => c.group === group);
        if (inGroup.length === 0) return null;
        return (
          <div key={group} className="mb-5">
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-bold mb-2">
              {group}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {inGroup.map((c) => (
                <ConnectorCard
                  key={c.id}
                  connector={c}
                  isExpanded={expanded === c.id}
                  toggle={() => setExpanded(expanded === c.id ? null : c.id)}
                  isAdmin={isAdmin}
                  ghl={c.id === "ghl" ? ghl : null}
                  tenantId={tenantId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  live: "bg-emerald-100 text-emerald-700 border-emerald-200",
  beta: "bg-sky-100 text-sky-700 border-sky-200",
  planned: "bg-amber-100 text-amber-700 border-amber-200",
  "on-request": "bg-slate-100 text-slate-600 border-slate-200",
};

function ConnectorCard({
  connector,
  isExpanded,
  toggle,
  isAdmin,
  ghl,
  tenantId,
}: {
  connector: Connector;
  isExpanded: boolean;
  toggle: () => void;
  isAdmin: boolean;
  ghl: GhlSummary | null;
  tenantId: string;
}) {
  const liveConnected = connector.id === "ghl" && ghl?.hasApiKey;
  return (
    <div className="rounded-xl border border-white/60 bg-white/55 overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-white/80 transition"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{connector.name}</span>
            <span
              className={`text-[9px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5 border ${
                STATUS_TONE[connector.status]
              }`}
            >
              {statusLabel[connector.status]}
            </span>
            {liveConnected && (
              <span className="text-[9px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5 border bg-bh-orange-50 text-bh-orange-700 border-bh-orange-200">
                Connected
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-0.5">{connector.blurb}</div>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      {isExpanded && (
        <div className="border-t border-slate-200/60 bg-slate-50/80 px-3.5 py-3 text-xs text-slate-600 space-y-2">
          <p>{connector.flow}</p>
          {connector.setupHint && (
            <p className="text-slate-500">
              <strong className="text-slate-700">Setup:</strong> {connector.setupHint}
            </p>
          )}
          {connector.id === "ghl" && (
            <GhlPanel ghl={ghl} isAdmin={isAdmin} tenantId={tenantId} />
          )}
          {connector.id !== "ghl" && (
            <RequestConnectorPanel connector={connector} isAdmin={isAdmin} />
          )}
        </div>
      )}
    </div>
  );
}

function GhlPanel({
  ghl,
  isAdmin,
  tenantId,
}: {
  ghl: GhlSummary | null;
  isAdmin: boolean;
  tenantId: string;
}) {
  const [apiKey, setApiKey] = useState("");
  const [locationId, setLocationId] = useState(ghl?.locationId ?? "");
  const [projectDataFieldId, setProjectDataFieldId] = useState(ghl?.projectDataFieldId ?? "");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "saving" }
    | { kind: "saved" }
    | { kind: "error"; msg: string }
  >({ kind: "idle" });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ kind: "saving" });
    try {
      const res = await fetch("/api/command-centre/integrations/ghl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          locationId,
          projectDataFieldId: projectDataFieldId || undefined,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setState({ kind: "saved" });
        setApiKey("");
      } else {
        setState({ kind: "error", msg: data.error ?? "Save failed" });
      }
    } catch (e) {
      setState({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  };

  return (
    <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
      {!isAdmin && (
        <div className="sm:col-span-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2">
          You need an owner or admin role to change integrations.
        </div>
      )}
      <label className="sm:col-span-2 block">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Private Integration Token
        </span>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={ghl?.hasApiKey ? "•••••• (saved — leave blank to keep)" : "pit-…"}
          disabled={!isAdmin}
          className="mt-1 w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
        />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Location ID
        </span>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="faIZiavkSvyDcMVx7Dmf"
          disabled={!isAdmin}
          className="mt-1 w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
        />
      </label>
      <label className="block">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          Project-data custom field ID <span className="font-normal opacity-60">(optional)</span>
        </span>
        <input
          type="text"
          value={projectDataFieldId}
          onChange={(e) => setProjectDataFieldId(e.target.value)}
          disabled={!isAdmin}
          className="mt-1 w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
        />
      </label>
      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={!isAdmin || state.kind === "saving" || (!apiKey && !ghl)}
          className="h-9 px-3 inline-flex items-center rounded-md bg-bh-ink text-white text-xs font-semibold disabled:opacity-60"
        >
          {state.kind === "saving" ? "Saving…" : "Save GHL connection"}
        </button>
        {state.kind === "saved" && (
          <span className="text-emerald-700 text-xs font-semibold">Saved · encrypted</span>
        )}
        {state.kind === "error" && (
          <span className="text-rose-700 text-xs">{state.msg}</span>
        )}
      </div>
      <input type="hidden" value={tenantId} readOnly />
    </form>
  );
}

function RequestConnectorPanel({
  connector,
  isAdmin,
}: {
  connector: Connector;
  isAdmin: boolean;
}) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "requesting" }
    | { kind: "requested" }
    | { kind: "error"; msg: string }
  >({ kind: "idle" });
  const [note, setNote] = useState("");

  const request = async () => {
    setState({ kind: "requesting" });
    try {
      const res = await fetch("/api/command-centre/integrations/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ connectorId: connector.id, note }),
      });
      const data = await res.json();
      if (data.ok) setState({ kind: "requested" });
      else setState({ kind: "error", msg: data.error ?? "Request failed" });
    } catch (e) {
      setState({ kind: "error", msg: e instanceof Error ? e.message : String(e) });
    }
  };

  if (state.kind === "requested") {
    return (
      <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-2.5">
        Request received. We'll be in touch to scope the {connector.name} connector.
      </div>
    );
  }
  return (
    <div className="space-y-2 pt-1">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={`Tell us how you use ${connector.name} (account size, must-have data, anything specific). Optional.`}
        rows={2}
        className="w-full bg-white border border-slate-200 rounded-lg text-xs px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
      />
      <button
        onClick={request}
        disabled={!isAdmin || state.kind === "requesting"}
        className="h-8 px-3 inline-flex items-center rounded-md bg-bh-ink text-white text-xs font-semibold disabled:opacity-60"
      >
        {state.kind === "requesting" ? "Sending…" : `Request ${connector.name}`}
      </button>
      {state.kind === "error" && (
        <span className="text-rose-700 text-xs ml-2">{state.msg}</span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Team panel
 * ─────────────────────────────────────────────────────────────────── */

type Member = { id: string; email: string; name: string | null; role: string; isInvite?: boolean };

function TeamPanel({ tenantId, isAdmin }: { tenantId: string; isAdmin: boolean }) {
  const [members, setMembers] = useState<Member[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("director");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!members && !loading) {
    setLoading(true);
    fetch("/api/command-centre/members", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setMembers(data.members ?? []))
      .finally(() => setLoading(false));
  }

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/command-centre/members/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (data.ok) {
        setMsg(`Invite sent to ${inviteEmail}`);
        setInviteEmail("");
        const r2 = await fetch("/api/command-centre/members", { cache: "no-store" });
        setMembers((await r2.json()).members ?? []);
      } else {
        setMsg(data.error ?? "Invite failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {isAdmin && (
        <form onSubmit={invite} className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="teammate@yourcompany.com.au"
            className="flex-1 h-9 px-3 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-bh-orange"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="h-9 px-2 text-sm border border-slate-200 rounded-md"
          >
            <option value="director">Director</option>
            <option value="admin">Admin</option>
            <option value="estimator">Estimator</option>
            <option value="viewer">Viewer</option>
          </select>
          <button
            type="submit"
            disabled={busy}
            className="h-9 px-3 inline-flex items-center rounded-md bg-bh-ink text-white text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send invite"}
          </button>
        </form>
      )}
      {msg && <div className="mb-3 text-xs text-emerald-700 font-semibold">{msg}</div>}
      <div className="border-t border-slate-200 divide-y divide-slate-200">
        {(members ?? []).map((m) => (
          <div key={m.id} className="py-2 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm font-semibold">{m.name ?? m.email}</div>
              <div className="text-[11px] text-slate-500">
                {m.email} {m.isInvite ? "· pending invite" : ""}
              </div>
            </div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500">
              {m.role}
            </div>
          </div>
        ))}
        {!members && <div className="py-3 text-xs text-slate-500">Loading…</div>}
        {members && members.length === 0 && (
          <div className="py-3 text-xs text-slate-500">No members yet.</div>
        )}
      </div>
      <input type="hidden" value={tenantId} readOnly />
    </div>
  );
}
