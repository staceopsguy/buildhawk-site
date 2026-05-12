"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type PipelineOption = {
  id: string;
  label: string;
  stages: { id: string; label: string }[];
};

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; opportunityId: string; pipelineName: string }
  | { status: "error"; message: string };

const HawkEmblem = ({ size = 28 }: { size?: number }) => (
  <Image
    src="/brand/emblem-bh.svg"
    alt="BuildHawk"
    width={Math.round((size * 255.21) / 195.97)}
    height={size}
    priority
    className="block"
  />
);

const Field = ({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
      {label}
      {required && <span className="text-rose-600"> *</span>}
    </span>
    {children}
    {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
  </label>
);

const inputClass =
  "mt-1 w-full bg-white border border-slate-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400";

export default function NewProjectForm({
  pipelines,
  ghlConnected,
}: {
  pipelines: PipelineOption[];
  ghlConnected: boolean;
}) {
  const defaultPipeline = pipelines[0];
  const [pipelineId, setPipelineId] = useState(defaultPipeline.id);
  const [stageId, setStageId] = useState(defaultPipeline.stages[0].id);
  const [projectName, setProjectName] = useState("");
  const [address, setAddress] = useState("");
  const [budget, setBudget] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const currentPipeline = pipelines.find((p) => p.id === pipelineId) ?? defaultPipeline;

  const onPipelineChange = (id: string) => {
    setPipelineId(id);
    const p = pipelines.find((pp) => pp.id === id);
    if (p) setStageId(p.stages[0].id);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState({ status: "submitting" });
    const res = await fetch("/api/command-centre/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName,
        address: address || undefined,
        budget: Number(budget),
        pipelineId,
        pipelineStageId: stageId,
        contactName,
        contactEmail,
        contactPhone: contactPhone || undefined,
        notes: notes || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      setState({
        status: "success",
        opportunityId: data.opportunityId,
        pipelineName: data.pipelineName,
      });
    } else {
      setState({ status: "error", message: data.error ?? `Request failed (${res.status})` });
    }
  };

  const resetForSecondEntry = () => {
    setProjectName("");
    setAddress("");
    setBudget("");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setNotes("");
    setState({ status: "idle" });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/command-centre" className="flex items-center gap-2.5 group">
            <HawkEmblem size={28} />
            <div className="leading-tight">
              <div
                className="text-bh-black font-semibold uppercase"
                style={{ fontSize: 13, letterSpacing: "0.04em" }}
              >
                BUILDHAWK
              </div>
              <div
                className="text-bh-graphite mt-0.5 uppercase"
                style={{ fontSize: 9, letterSpacing: "0.16em" }}
              >
                Powered by Hawktress<sup style={{ fontSize: "0.7em", marginLeft: "0.1em" }}>™</sup>
              </div>
            </div>
          </Link>
          <div className="flex-1" />
          <Link
            href="/command-centre"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Cost Plan Console
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-6">
          <div className="text-[11px] uppercase tracking-[0.18em] text-bh-orange-700 font-bold">
            Homes by NH · Estimate intake
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
            New Estimate
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Creates a new engagement record attached to the customer contact. Will appear on the
            Cost Plan Console within a minute of creation.
          </p>
        </div>

        {!ghlConnected && (
          <div className="mb-5 bg-bh-orange-50 border border-bh-orange-200/60 rounded-lg p-4 text-sm text-bh-orange-700">
            <strong className="block font-bold mb-1">GHL not connected.</strong>
            Submitting this form will fail. Set <code className="font-mono bg-white px-1 rounded">GHL_HBNH_API_KEY</code> in Vercel env vars to enable.
          </div>
        )}

        {state.status === "success" ? (
          <div className="bg-white rounded-xl border border-emerald-200 p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center text-emerald-700 shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="m5 12 5 5L20 7" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-lg font-bold text-slate-900">Project created in GHL</div>
                <div className="mt-1 text-sm text-slate-600">
                  Added to <strong>{state.pipelineName}</strong>. Opportunity ID:{" "}
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                    {state.opportunityId}
                  </code>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/command-centre"
                    className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-bh-ink text-white text-sm font-semibold hover:bg-bh-ink/90"
                  >
                    View on dashboard →
                  </Link>
                  <button
                    type="button"
                    onClick={resetForSecondEntry}
                    className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Add another
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-3">Pipeline placement</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Pipeline" required>
                  <select
                    value={pipelineId}
                    onChange={(e) => onPipelineChange(e.target.value)}
                    className={inputClass}
                  >
                    {pipelines.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Stage" required>
                  <select
                    value={stageId}
                    onChange={(e) => setStageId(e.target.value)}
                    className={inputClass}
                  >
                    {currentPipeline.stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Project</h2>
              <div className="space-y-3">
                <Field
                  label="Project name"
                  required
                  hint="What appears on the dashboard. Often the address."
                >
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. 14 Smith St, Geelong West"
                    className={inputClass}
                  />
                </Field>
                <Field label="Site address">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="14 Smith St, Geelong West, VIC 3218"
                    className={inputClass}
                  />
                </Field>
                <Field label="Budget (AUD)" required hint="Total contract value, GST inclusive.">
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="850000"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Customer contact</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Name" required>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Smith"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+61 412 345 678"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <Field label="Notes" hint="Goes into the GHL opportunity notes field.">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Brief project description, special requirements, key dates."
                  className={inputClass}
                />
              </Field>
            </div>

            {state.status === "error" && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700">
                <strong className="block font-bold mb-0.5">Failed to create project</strong>
                {state.message}
              </div>
            )}

            <div className="border-t border-slate-100 pt-5 flex items-center justify-end gap-2">
              <Link
                href="/command-centre"
                className="h-10 px-4 inline-flex items-center rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={state.status === "submitting"}
                className="h-10 px-4 inline-flex items-center rounded-md bg-bh-ink text-white text-sm font-semibold hover:bg-bh-ink/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {state.status === "submitting" ? "Creating estimate…" : "Create estimate"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-[11px] text-slate-400">
          Writes to GHL Homes by NH location <span className="font-mono">faIZiavkSvyDcMVx7Dmf</span>.
          Audit trail visible in GHL opportunity history.
        </p>
      </main>
    </div>
  );
}
