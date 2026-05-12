"use client";

import { useState } from "react";
import { PLANS, type PlanTier } from "@/lib/billing/plans";

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

      <Section title="GHL connection">
        <GhlConnectionPanel tenantId={tenant.id} initial={ghl} isAdmin={isAdmin} />
      </Section>

      <Section title="Team">
        <TeamPanel tenantId={tenant.id} isAdmin={isAdmin} />
      </Section>
    </div>
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

function GhlConnectionPanel({
  tenantId,
  initial,
  isAdmin,
}: {
  tenantId: string;
  initial: GhlSummary | null;
  isAdmin: boolean;
}) {
  const [apiKey, setApiKey] = useState("");
  const [locationId, setLocationId] = useState(initial?.locationId ?? "");
  const [projectDataFieldId, setProjectDataFieldId] = useState(initial?.projectDataFieldId ?? "");
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
    <div>
      <p className="text-xs text-slate-600 mb-3">
        Bring your live GoHighLevel opportunities into the Cost Plan Console. Paste your Private
        Integration Token and the GHL location ID. The token is encrypted at rest and never
        appears in logs.{" "}
        <a
          className="text-bh-orange-700 underline"
          href="https://highlevel.stoplight.io/docs/integrations/private-integrations"
          target="_blank"
          rel="noreferrer"
        >
          How to create a token
        </a>
      </p>

      {!isAdmin && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2 mb-3">
          You need an owner or admin role to change integrations.
        </div>
      )}

      <form onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="sm:col-span-2 block">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            GHL Private Integration Token
          </span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={initial?.hasApiKey ? "•••••• (saved — leave blank to keep)" : "pit-…"}
            disabled={!isAdmin}
            className="mt-1 w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
          />
        </label>
        <label className="block">
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
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
          <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            Project data custom field ID <span className="font-normal opacity-60">(optional)</span>
          </span>
          <input
            type="text"
            value={projectDataFieldId}
            onChange={(e) => setProjectDataFieldId(e.target.value)}
            placeholder="custom field for bh_project_data"
            disabled={!isAdmin}
            className="mt-1 w-full bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange"
          />
        </label>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={!isAdmin || state.kind === "saving" || (!apiKey && !initial)}
            className="h-9 px-3 inline-flex items-center rounded-md bg-bh-ink text-white text-sm font-semibold disabled:opacity-60"
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
      </form>
      <input type="hidden" value={tenantId} readOnly />
    </div>
  );
}

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
