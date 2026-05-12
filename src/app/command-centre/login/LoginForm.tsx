"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassBackground from "../_components/GlassBackground";

type State =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

export default function LoginForm({
  next,
  error,
  configured,
}: {
  next?: string;
  error?: string;
  configured: boolean;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/command-centre/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirect: next }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setState({ status: "sent", email });
      } else {
        setState({
          status: "error",
          message: data.error ?? `Request failed (${res.status})`,
        });
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
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center gap-2.5 justify-center mb-8"
          aria-label="BuildHawk home"
        >
          <Image
            src="/brand/emblem-bh.svg"
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
              className="text-bh-graphite mt-0.5 uppercase font-semibold"
              style={{ fontSize: 10, letterSpacing: "0.18em" }}
            >
              Cost Plan Console
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
          {/* Top inner highlight strip — gives the glass its "edge of light" */}
          <div
            className="pointer-events-none absolute inset-x-6 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
            }}
          />

          <div className="p-6 sm:p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-bh-orange-700 font-bold">
              Director access
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
              Sign in to your Cost Plan Console
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              We send a one-time link to your email. No passwords. Access is limited to invited
              builders and the BuildHawk team.
            </p>

            {!configured && (
              <div className="mt-5 rounded-2xl border border-bh-orange-200/60 bg-bh-orange-50/70 backdrop-blur p-3 text-xs text-bh-orange-700">
                <strong className="block font-bold mb-0.5">Auth not configured.</strong>
                Set <code className="font-mono bg-white/70 px-1 rounded">BH_AUTH_SECRET</code>,{" "}
                <code className="font-mono bg-white/70 px-1 rounded">BH_AUTHORIZED_EMAILS</code>{" "}
                and <code className="font-mono bg-white/70 px-1 rounded">RESEND_API_KEY</code> in
                Vercel env. Until set, the gate stays open.
              </div>
            )}

            {error === "expired" && state.status === "idle" && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50/70 backdrop-blur p-3 text-xs text-rose-700">
                That sign-in link has expired or is invalid. Request a new one.
              </div>
            )}

            {state.status === "sent" ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 backdrop-blur p-4">
                <div className="font-bold text-emerald-800 text-sm">Check your inbox.</div>
                <p className="mt-1 text-sm text-emerald-700">
                  We sent a sign-in link to{" "}
                  <strong className="font-semibold">{state.email}</strong>. The link expires in 30
                  minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setState({ status: "idle" })}
                  className="mt-3 text-xs font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
                >
                  Try a different email
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                    Email
                  </span>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com.au"
                    className="mt-1 w-full bg-white/70 backdrop-blur border border-white/60 rounded-xl text-sm px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400 shadow-sm"
                  />
                </label>
                <button
                  type="submit"
                  disabled={state.status === "submitting"}
                  className="w-full h-11 rounded-xl bg-bh-ink text-white font-semibold text-sm hover:bg-bh-ink/90 disabled:opacity-60 shadow-[0_8px_24px_-8px_rgba(17,17,17,0.45)]"
                >
                  {state.status === "submitting"
                    ? "Sending link…"
                    : "Send me a sign-in link"}
                </button>
                {state.status === "error" && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/70 backdrop-blur p-3 text-xs text-rose-700">
                    {state.message}
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-slate-200/70 text-[11px] text-slate-500 leading-relaxed">
              New to BuildHawk?{" "}
              <Link
                href="/command-centre/signup"
                className="font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                Start your workspace
              </Link>
              . 14-day trial, no credit card. By signing in you agree to our{" "}
              <Link
                href="/data-policy"
                className="font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900"
              >
                data policy
              </Link>
              .
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Powered by Hawktress™ · Magic-link auth via Resend
        </p>
      </div>
    </div>
  );
}
