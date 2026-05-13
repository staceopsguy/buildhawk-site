"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassBackground from "../_components/GlassBackground";
import BrandButton from "@/components/brand/BrandButton";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

const PLANS = [
  { id: "starter", label: "Starter", priceLabel: "$149 / month", lines: ["3 estimators", "25 active estimates", "Email support"] },
  { id: "pro", label: "Pro", priceLabel: "$399 / month", lines: ["10 estimators", "Unlimited estimates", "Buildxact + Xero connectors", "Hawktress benchmarks"] },
  { id: "enterprise", label: "Enterprise", priceLabel: "Contact us", lines: ["Unlimited seats", "SSO + audit log", "Custom benchmarks", "Dedicated CSM"] },
] as const;

export default function SignupForm({
  configured,
  initialPlan,
  orphan,
}: {
  configured: boolean;
  initialPlan?: string;
  orphan: boolean;
}) {
  const [tenantName, setTenantName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<string>(
    initialPlan && ["starter", "pro", "enterprise"].includes(initialPlan)
      ? initialPlan
      : "starter",
  );
  const [state, setState] = useState<State>({ status: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/command-centre/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, tenantName, plan }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState({ status: "sent", email });
      } else {
        setState({ status: "error", message: data.error ?? `Request failed (${res.status})` });
      }
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10 text-slate-900">
      <GlassBackground tone="light" />
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-center mb-8"
          aria-label="BuildHawk home"
        >
          <Image
            src="/brand/emblem-bh-dark.svg"
            alt="BuildHawk"
            width={42}
            height={32}
            priority
            className="block"
          />
          <div className="leading-tight">
            <div
              className="text-bh-black font-semibold uppercase"
              style={{ fontSize: 15, letterSpacing: "0.04em" }}
            >
              BUILDHAWK
            </div>
            <div
              className="text-bh-graphite mt-0.5 uppercase"
              style={{ fontSize: 10, letterSpacing: "0.16em" }}
            >
              Powered by Hawktress<sup style={{ fontSize: "0.7em", marginLeft: "0.1em" }}>™</sup>
            </div>
          </div>
        </Link>

        <div
          className="relative rounded-3xl border border-white/40 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 100%)",
            backdropFilter: "blur(28px) saturate(140%)",
            WebkitBackdropFilter: "blur(28px) saturate(140%)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            }}
          />

          <div className="p-6 sm:p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-bh-orange-700 font-bold">
              Founding-cohort signup
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Start your BuildHawk workspace
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              14-day trial. No credit card required. Connect your GHL location after signup to bring live data into the Cost Plan Console.
            </p>

            {orphan && (
              <div className="mt-4 rounded-xl border border-bh-warning-200 bg-bh-warning-50 p-3 text-xs text-bh-warning-500">
                Your email is verified but isn&apos;t attached to a workspace yet. Create one to continue.
              </div>
            )}

            {!configured && (
              <div className="mt-5 rounded-2xl border border-bh-orange-200/60 bg-bh-orange-50/70 backdrop-blur p-3 text-xs text-bh-orange-700">
                <strong className="block font-bold mb-0.5">Auth not configured.</strong>
                Set BH_AUTH_SECRET, DATABASE_URL, BH_ENCRYPTION_KEY and RESEND_API_KEY in Vercel env.
              </div>
            )}

            {state.status === "sent" ? (
              <div className="mt-6 rounded-xl border border-bh-success-200 bg-bh-success-50 p-4">
                <div className="font-bold text-bh-success-500 text-sm">Check your inbox.</div>
                <p className="mt-1 text-sm text-bh-success-500">
                  We sent a confirmation link to{" "}
                  <strong className="font-semibold">{state.email}</strong>. Click it to finish creating your workspace. The link expires in 30 minutes.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Company name
                  </span>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={80}
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Homes by NH"
                    className="mt-1 w-full bg-white/70 backdrop-blur border border-white/60 rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400 shadow-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Your name
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Director / owner"
                    className="mt-1 w-full bg-white/70 backdrop-blur border border-white/60 rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400 shadow-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Work email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourcompany.com.au"
                    className="mt-1 w-full bg-white/70 backdrop-blur border border-white/60 rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400 shadow-sm"
                  />
                </label>

                <div className="block">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Choose a plan
                  </span>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {PLANS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlan(p.id)}
                        className={`text-left rounded-xl border p-3 transition ${
                          plan === p.id
                            ? "border-bh-orange bg-bh-orange-50/70"
                            : "border-white/60 bg-white/50 hover:bg-white/80"
                        }`}
                      >
                        <div className="font-bold text-sm">{p.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{p.priceLabel}</div>
                        <ul className="mt-2 space-y-0.5 text-[11px] text-slate-600">
                          {p.lines.map((l) => (
                            <li key={l}>· {l}</li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>

                <BrandButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={state.status === "submitting"}
                  trailingIcon={state.status !== "submitting"}
                  disabled={state.status === "submitting"}
                >
                  {state.status === "submitting" ? "Sending confirmation…" : "Create workspace"}
                </BrandButton>

                {state.status === "error" && (
                  <div className="rounded-xl border border-bh-danger-200 bg-bh-danger-50 p-3 text-xs text-bh-danger-500">
                    {state.message}
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-slate-200/70 text-[11px] text-slate-500 leading-relaxed">
              Already have a workspace?{" "}
              <Link
                href="/command-centre/login"
                className="font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
