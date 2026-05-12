"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassBackground from "../_components/GlassBackground";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  projectsPerYear: string;
  primaryRegion: string;
  currentTools: string;
  notes: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string };

const empty: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  role: "",
  projectsPerYear: "",
  primaryRegion: "",
  currentTools: "",
  notes: "",
};

export default function RequestAccessForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/command-centre/request-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus({ kind: "sent", email: form.email });
      } else {
        setStatus({ kind: "error", message: data.error ?? `Request failed (${res.status})` });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 sm:py-14 text-slate-900 relative">
      <GlassBackground tone="light" />
      <div className="mx-auto max-w-2xl">
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
          <div className="p-6 sm:p-8">
            {status.kind === "sent" ? (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Request received</h1>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  Thanks. We&apos;ve sent a confirmation to{" "}
                  <strong className="text-slate-900">{status.email}</strong> and our team will
                  review your application within one business day.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-bh-ink text-white text-sm font-semibold hover:bg-bh-ink/90"
                  >
                    Back to home
                  </Link>
                  <Link
                    href="/#pricing"
                    className="inline-flex items-center justify-center h-10 px-4 rounded-md border border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    See pricing
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight">
                  Apply for Cost Plan Console access
                </h1>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Founding-cohort access is limited. Tell us about your business and we&apos;ll
                  reply within one business day with next steps.
                </p>

                <form className="mt-6 space-y-4" onSubmit={submit}>
                  <Row>
                    <Field label="Full name" required>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={set("name")}
                        autoComplete="name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Work email" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={set("email")}
                        autoComplete="email"
                        className={inputCls}
                      />
                    </Field>
                  </Row>
                  <Row>
                    <Field label="Company" required>
                      <input
                        type="text"
                        required
                        value={form.company}
                        onChange={set("company")}
                        autoComplete="organization"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Phone">
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        autoComplete="tel"
                        className={inputCls}
                      />
                    </Field>
                  </Row>
                  <Row>
                    <Field label="Your role">
                      <input
                        type="text"
                        value={form.role}
                        onChange={set("role")}
                        placeholder="Director, Estimator, GM..."
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Active projects / year">
                      <input
                        type="text"
                        value={form.projectsPerYear}
                        onChange={set("projectsPerYear")}
                        placeholder="6, 12, 30+..."
                        className={inputCls}
                      />
                    </Field>
                  </Row>
                  <Row>
                    <Field label="Primary region">
                      <input
                        type="text"
                        value={form.primaryRegion}
                        onChange={set("primaryRegion")}
                        placeholder="Geelong VIC, Sydney NSW..."
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Current tools">
                      <input
                        type="text"
                        value={form.currentTools}
                        onChange={set("currentTools")}
                        placeholder="Buildxact, Excel, Xero..."
                        className={inputCls}
                      />
                    </Field>
                  </Row>
                  <Field label="Anything you want us to know">
                    <textarea
                      value={form.notes}
                      onChange={set("notes")}
                      rows={4}
                      className={inputCls + " font-normal"}
                      placeholder="Pipeline mix, pain points, timing..."
                    />
                  </Field>

                  {status.kind === "error" && (
                    <div className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-md px-3 py-2">
                      {status.message}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <button
                      type="submit"
                      disabled={status.kind === "submitting"}
                      className="inline-flex items-center justify-center h-11 px-5 rounded-md bg-bh-orange text-white text-sm font-semibold hover:bg-bh-orange/90 disabled:opacity-60"
                    >
                      {status.kind === "submitting" ? "Submitting..." : "Submit request"}
                    </button>
                    <Link
                      href="/command-centre/login"
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 underline underline-offset-2"
                    >
                      Already approved? Sign in →
                    </Link>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          By applying you agree to our{" "}
          <Link href="/data-policy" className="font-semibold text-slate-700 underline underline-offset-2 hover:text-slate-900">
            data policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

const inputCls =
  "block w-full bg-white border border-slate-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange text-slate-900";

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
);

const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
      {label}
      {required && <span className="text-bh-orange ml-0.5">*</span>}
    </span>
    <div className="mt-1">{children}</div>
  </label>
);
