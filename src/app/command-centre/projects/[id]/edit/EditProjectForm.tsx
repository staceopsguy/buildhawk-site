"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type {
  HbnhProject,
  ProjectOverlay,
  ProjectSetup,
  BoqLine,
  RfqRecord,
  VariationRecord,
  CostToCompleteLine,
  RiskRecord,
  QuoteComparisonRow,
  AwardedSub,
  ClaimRecord,
  CashflowEntry,
  ProjectSupplier,
} from "@/lib/ghl-homesbynh";
import {
  TRADE_SECTIONS,
  REGIONS,
  PROJECT_TYPES,
  PROCUREMENT_MODELS,
  CONTRACT_TYPES,
  RFQ_STATUSES,
  VARIATION_STATUSES,
  RISK_STATUSES,
  STANDARD_CLAIM_STAGES,
  CLAIM_STATUSES,
  ALLIANCE_TIER_OPTIONS,
  AWARDED_INSURANCE_STATUSES,
} from "../../../reference";

type PipelineOption = {
  id: string;
  label: string;
  stages: { id: string; label: string }[];
};

type SaveState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "saved"; at: number }
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

const inputClass =
  "w-full bg-white border border-slate-300 rounded-md text-sm px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-bh-orange focus:border-bh-orange placeholder:text-slate-400 tabular-nums";

const fmtCurrency = (n: number) =>
  "$" + n.toLocaleString("en-AU", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const newId = () => Math.random().toString(36).slice(2, 10);

type Tab =
  | "setup"
  | "boq"
  | "rfqs"
  | "compare"
  | "awarded"
  | "variations"
  | "cost"
  | "claims"
  | "cashflow"
  | "risks"
  | "suppliers"
  | "export";

const TAB_LABELS: { id: Tab; label: string; sub: string }[] = [
  { id: "setup", label: "Setup", sub: "Project metadata + commercials" },
  { id: "boq", label: "BOQ", sub: "Bill of quantities" },
  { id: "rfqs", label: "RFQs", sub: "Quote register" },
  { id: "compare", label: "Quote compare", sub: "3-way side-by-side" },
  { id: "awarded", label: "Awarded subs", sub: "Final awarded scopes" },
  { id: "variations", label: "Variations", sub: "Change orders" },
  { id: "cost", label: "Cost to complete", sub: "Budget vs committed vs spent" },
  { id: "claims", label: "Claims", sub: "Progress claims schedule" },
  { id: "cashflow", label: "Cashflow", sub: "12-week forecast" },
  { id: "risks", label: "Risks", sub: "Risk register" },
  { id: "suppliers", label: "Suppliers", sub: "Project-specific directory" },
  { id: "export", label: "Hawktress export", sub: "What ships to the benchmark engine" },
];

export default function EditProjectForm({
  project,
  projectId,
  pipelines,
  ghlConnected,
  overlayFieldConfigured,
}: {
  project: HbnhProject | null;
  projectId: string;
  pipelines: PipelineOption[];
  ghlConnected: boolean;
  overlayFieldConfigured: boolean;
}) {
  const initialOverlay: ProjectOverlay = useMemo(() => project?.overlay ?? {}, [project]);

  const [tab, setTab] = useState<Tab>("setup");
  const [overlay, setOverlay] = useState<ProjectOverlay>(initialOverlay);
  const [budget, setBudget] = useState(String(project?.budget ?? ""));
  const [pipelineId, setPipelineId] = useState(project?.pipelineId ?? pipelines[0].id);
  const [stageId, setStageId] = useState(project?.pipelineStageId ?? pipelines[0].stages[0].id);
  const [updatedBy, setUpdatedBy] = useState("");
  const [save, setSave] = useState<SaveState>({ status: "idle" });

  const currentPipeline = pipelines.find((p) => p.id === pipelineId) ?? pipelines[0];

  // Derived: BOQ total feeds into committed if user hasn't set it manually.
  const boqTotal = useMemo(
    () =>
      (overlay.boq ?? []).reduce(
        (a, l) =>
          a +
          (l.qty ?? 0) *
            ((l.labourRate ?? 0) + (l.materialRate ?? 0) + (l.subRate ?? 0)),
        0,
      ),
    [overlay.boq],
  );
  const committedFromCost = useMemo(
    () => (overlay.costToComplete ?? []).reduce((a, l) => a + (l.committed ?? 0), 0),
    [overlay.costToComplete],
  );
  const spentFromCost = useMemo(
    () => (overlay.costToComplete ?? []).reduce((a, l) => a + (l.spentToDate ?? 0), 0),
    [overlay.costToComplete],
  );

  const onPipelineChange = (id: string) => {
    setPipelineId(id);
    const p = pipelines.find((pp) => pp.id === id);
    if (p) setStageId(p.stages[0].id);
  };

  const onSave = async () => {
    setSave({ status: "saving" });
    const res = await fetch(`/api/command-centre/projects/${projectId}/overlay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        overlay,
        pipelineStageId: stageId,
        budget: budget || undefined,
        updatedBy: updatedBy || undefined,
      }),
    });
    const data = await res.json();
    if (res.ok && data.ok) setSave({ status: "saved", at: Date.now() });
    else setSave({ status: "error", message: data.error ?? `Request failed (${res.status})` });
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/command-centre" className="flex items-center gap-2.5">
            <HawkEmblem size={28} />
            <div className="leading-tight">
              <div
                className="text-bh-black font-semibold uppercase"
                style={{ fontSize: 13, letterSpacing: "0.04em" }}
              >
                BUILDHAWK
              </div>
              <div
                className="text-bh-graphite mt-0.5 uppercase font-semibold"
                style={{ fontSize: 9, letterSpacing: "0.18em" }}
              >
                Estimate Workbook
              </div>
            </div>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            {save.status === "saved" && (
              <span className="text-xs text-emerald-600 font-semibold">
                Saved {new Date(save.at).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {save.status === "error" && (
              <span className="text-xs text-rose-600 font-semibold">Save failed</span>
            )}
            <input
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder="Your name"
              className="hidden sm:block h-9 px-2.5 text-sm border border-slate-200 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-bh-orange"
            />
            <button
              onClick={onSave}
              disabled={save.status === "saving"}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md bg-bh-ink text-white text-sm font-semibold hover:bg-bh-ink/90 disabled:opacity-60"
            >
              {save.status === "saving" ? "Saving…" : "Save workbook"}
            </button>
            <Link
              href="/command-centre"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Cost Plan Console
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-bh-orange-700 font-bold">
            Homes by NH · Estimate Workbook
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {project?.name ?? "Estimate"}
          </h1>
          {project && (
            <div className="mt-1.5 text-sm text-slate-500">
              {project.region} · {project.type} · Contract {fmtCurrency(project.budget)}
              {project.contactName && ` · ${project.contactName}`}
            </div>
          )}
        </div>

        {!ghlConnected && (
          <Banner tone="warn">
            <strong className="font-bold">GHL not connected.</strong>{" "}
            Set <code className="font-mono bg-white px-1 rounded">GHL_HBNH_API_KEY</code> in Vercel
            env vars to load and save real workbook data.
          </Banner>
        )}
        {ghlConnected && !overlayFieldConfigured && (
          <Banner tone="warn">
            <strong className="font-bold">One more step to enable saving.</strong> In GHL Homes by NH, create a
            multi-line text custom field (suggested key{" "}
            <code className="font-mono bg-white px-1 rounded">bh_project_data</code>), copy the
            field ID, set it as <code className="font-mono bg-white px-1 rounded">GHL_HBNH_PROJECT_DATA_FIELD_ID</code> in Vercel env, then
            redeploy.
          </Banner>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex overflow-x-auto border-b border-slate-100">
            {TAB_LABELS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  tab === t.id
                    ? "text-bh-ink border-bh-orange bg-bh-orange-50/40"
                    : "text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-6">
            {tab === "setup" && (
              <SetupPanel
                overlay={overlay}
                setOverlay={setOverlay}
                pipelines={pipelines}
                pipelineId={pipelineId}
                onPipelineChange={onPipelineChange}
                stageId={stageId}
                setStageId={setStageId}
                currentPipeline={currentPipeline}
                budget={budget}
                setBudget={setBudget}
              />
            )}
            {tab === "boq" && (
              <BoqPanel
                overlay={overlay}
                setOverlay={setOverlay}
                boqTotal={boqTotal}
                contractValue={Number(budget) || 0}
              />
            )}
            {tab === "rfqs" && <RfqPanel overlay={overlay} setOverlay={setOverlay} />}
            {tab === "compare" && (
              <QuoteComparePanel overlay={overlay} setOverlay={setOverlay} />
            )}
            {tab === "awarded" && (
              <AwardedSubsPanel overlay={overlay} setOverlay={setOverlay} />
            )}
            {tab === "variations" && (
              <VariationsPanel overlay={overlay} setOverlay={setOverlay} />
            )}
            {tab === "cost" && (
              <CostPanel
                overlay={overlay}
                setOverlay={setOverlay}
                committedTotal={committedFromCost}
                spentTotal={spentFromCost}
              />
            )}
            {tab === "claims" && (
              <ClaimsPanel
                overlay={overlay}
                setOverlay={setOverlay}
                contractValue={Number(budget) || 0}
              />
            )}
            {tab === "cashflow" && (
              <CashflowPanel overlay={overlay} setOverlay={setOverlay} />
            )}
            {tab === "risks" && <RisksPanel overlay={overlay} setOverlay={setOverlay} />}
            {tab === "suppliers" && (
              <SuppliersPanel overlay={overlay} setOverlay={setOverlay} />
            )}
            {tab === "export" && (
              <HawktressExportPanel overlay={overlay} project={project} projectId={projectId} />
            )}
          </div>
        </div>

        {save.status === "error" && (
          <Banner tone="error">
            <strong className="font-bold block mb-0.5">Save failed</strong>
            {save.message}
          </Banner>
        )}

        <p className="text-[11px] text-slate-400">
          Stored in GHL Homes by NH custom field <span className="font-mono">bh_project_data</span>.
          Opportunity <span className="font-mono">{projectId}</span>.
        </p>
      </main>
    </div>
  );
}

const Banner = ({
  tone,
  children,
}: {
  tone: "warn" | "error" | "info";
  children: React.ReactNode;
}) => {
  const cls =
    tone === "warn"
      ? "bg-bh-orange-50 border-bh-orange-200/60 text-bh-orange-700"
      : tone === "error"
        ? "bg-rose-50 border-rose-200 text-rose-700"
        : "bg-slate-50 border-slate-200 text-slate-700";
  return <div className={`rounded-lg border px-4 py-2.5 text-sm ${cls}`}>{children}</div>;
};

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
      {label}
    </span>
    <div className="mt-1">{children}</div>
    {hint && <span className="block text-[11px] text-slate-500 mt-1">{hint}</span>}
  </label>
);

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold text-slate-900">{title}</h2>
    {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
  </div>
);

/* ------------------------------------------------------------------
 * Setup panel
 * ----------------------------------------------------------------- */

function SetupPanel({
  overlay,
  setOverlay,
  pipelines,
  pipelineId,
  onPipelineChange,
  stageId,
  setStageId,
  currentPipeline,
  budget,
  setBudget,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
  pipelines: PipelineOption[];
  pipelineId: string;
  onPipelineChange: (id: string) => void;
  stageId: string;
  setStageId: (id: string) => void;
  currentPipeline: PipelineOption;
  budget: string;
  setBudget: (s: string) => void;
}) {
  const setup: ProjectSetup = overlay.setup ?? {};
  const updateSetup = (patch: Partial<ProjectSetup>) =>
    setOverlay({ ...overlay, setup: { ...setup, ...patch } });
  const num = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <div className="space-y-7">
      <section>
        <SectionHeader title="Pipeline placement" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Pipeline">
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
          <Field label="Stage">
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
      </section>

      <section>
        <SectionHeader title="Project identity" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Project code">
            <input
              type="text"
              value={setup.projectCode ?? ""}
              onChange={(e) => updateSetup({ projectCode: e.target.value })}
              placeholder="BH-2026-001"
              className={inputClass}
            />
          </Field>
          <Field label="Builder business name">
            <input
              type="text"
              value={setup.builderBusinessName ?? "Homes by NH"}
              onChange={(e) => updateSetup({ builderBusinessName: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Builder ABN">
            <input
              type="text"
              value={setup.builderABN ?? ""}
              onChange={(e) => updateSetup({ builderABN: e.target.value })}
              placeholder="11 digit ABN"
              className={inputClass}
            />
          </Field>
          <Field label="Client name">
            <input
              type="text"
              value={setup.clientName ?? ""}
              onChange={(e) => updateSetup({ clientName: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Site address">
            <input
              type="text"
              value={setup.siteAddress ?? ""}
              onChange={(e) => updateSetup({ siteAddress: e.target.value })}
              placeholder="14 Smith St, Geelong West, VIC 3218"
              className={inputClass}
            />
          </Field>
          <Field label="Region (drives benchmarks)">
            <select
              value={setup.regionCode ?? ""}
              onChange={(e) => updateSetup({ regionCode: e.target.value })}
              className={inputClass}
            >
              <option value="">Select region</option>
              {REGIONS.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.country} · {r.code} · {r.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Project type">
            <select
              value={setup.projectType ?? ""}
              onChange={(e) => updateSetup({ projectType: e.target.value })}
              className={inputClass}
            >
              <option value="">Select project type</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Procurement model">
            <select
              value={setup.procurementModel ?? ""}
              onChange={(e) => updateSetup({ procurementModel: e.target.value })}
              className={inputClass}
            >
              <option value="">Select model</option>
              {PROCUREMENT_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Contract type">
            <select
              value={setup.contractType ?? ""}
              onChange={(e) => updateSetup({ contractType: e.target.value })}
              className={inputClass}
            >
              <option value="">Select contract</option>
              {CONTRACT_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader title="Commercials" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Contract value (excl GST)" hint="Mirrors monetaryValue in GHL.">
            <input
              type="number"
              min={0}
              step={1000}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="GST rate" hint="0.10 AU, 0.15 NZ">
            <input
              type="number"
              min={0}
              max={1}
              step={0.01}
              value={setup.gstRate ?? 0.1}
              onChange={(e) => updateSetup({ gstRate: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Contract value (incl GST)">
            <input
              type="number"
              min={0}
              step={1000}
              value={setup.contractValueIncGst ?? ""}
              onChange={(e) => updateSetup({ contractValueIncGst: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Target margin %">
            <input
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={overlay.targetMarginPct ?? 17}
              onChange={(e) => setOverlay({ ...overlay, targetMarginPct: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Budgeted COGS">
            <input
              type="number"
              min={0}
              step={1000}
              value={setup.budgetedCogs ?? ""}
              onChange={(e) => updateSetup({ budgetedCogs: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Live margin %" hint="Director-set, leave blank to derive">
            <input
              type="number"
              min={-20}
              max={50}
              step={0.1}
              value={overlay.liveMarginPct ?? ""}
              onChange={(e) => setOverlay({ ...overlay, liveMarginPct: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Variance threshold %" hint="5% is BuildHawk standard">
            <input
              type="number"
              min={0}
              max={50}
              step={0.1}
              value={setup.varianceThresholdPct ?? 5}
              onChange={(e) => updateSetup({ varianceThresholdPct: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
          <Field label="Director approval threshold $">
            <input
              type="number"
              min={0}
              step={500}
              value={setup.directorApprovalThreshold ?? ""}
              onChange={(e) =>
                updateSetup({ directorApprovalThreshold: num(e.target.value) })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Status override">
            <select
              value={overlay.status ?? "On track"}
              onChange={(e) =>
                setOverlay({
                  ...overlay,
                  status: e.target.value as ProjectOverlay["status"],
                })
              }
              className={inputClass}
            >
              <option value="On track">On track</option>
              <option value="Variation pending">Variation pending</option>
              <option value="Margin erosion">Margin erosion</option>
            </select>
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader title="Programme" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label="Contract signed">
            <input
              type="date"
              value={setup.contractSignedDate ?? ""}
              onChange={(e) => updateSetup({ contractSignedDate: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Site start">
            <input
              type="date"
              value={setup.siteStartDate ?? ""}
              onChange={(e) => updateSetup({ siteStartDate: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Practical completion target">
            <input
              type="date"
              value={setup.practicalCompletionTarget ?? ""}
              onChange={(e) => updateSetup({ practicalCompletionTarget: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="% complete">
            <input
              type="number"
              min={0}
              max={100}
              value={overlay.percentComplete ?? ""}
              onChange={(e) =>
                setOverlay({ ...overlay, percentComplete: num(e.target.value) })
              }
              className={inputClass}
            />
          </Field>
          <Field label="Programme (months)">
            <input
              type="number"
              min={1}
              max={48}
              value={setup.programmeMonths ?? overlay.durationMonths ?? ""}
              onChange={(e) => {
                const n = num(e.target.value);
                updateSetup({ programmeMonths: n });
                setOverlay({ ...overlay, durationMonths: n, setup: { ...setup, programmeMonths: n } });
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Defects liability (months)" hint="Typically 12">
            <input
              type="number"
              min={0}
              max={36}
              value={setup.defectsLiabilityMonths ?? 12}
              onChange={(e) => updateSetup({ defectsLiabilityMonths: num(e.target.value) })}
              className={inputClass}
            />
          </Field>
        </div>
      </section>

      <section>
        <SectionHeader title="Status notes" />
        <textarea
          value={overlay.notes ?? ""}
          onChange={(e) => setOverlay({ ...overlay, notes: e.target.value })}
          rows={4}
          placeholder="Director-facing status notes."
          className={inputClass}
        />
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------
 * BOQ panel
 * ----------------------------------------------------------------- */

function BoqPanel({
  overlay,
  setOverlay,
  boqTotal,
  contractValue,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
  boqTotal: number;
  contractValue: number;
}) {
  const lines = overlay.boq ?? [];
  const setLines = (next: BoqLine[]) => setOverlay({ ...overlay, boq: next });
  const update = (id: string, patch: Partial<BoqLine>) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const margin = contractValue > 0 ? ((contractValue - boqTotal) / contractValue) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Bill of quantities"
          sub="Trade-by-trade build-up. Each line = qty × (labour + material + sub rate)."
        />
        <div className="flex items-center gap-4 text-xs">
          <Stat label="BOQ total" value={fmtCurrency(boqTotal)} />
          <Stat
            label="vs contract"
            value={contractValue > 0 ? `${margin.toFixed(1)}% margin` : "set contract"}
            tone={contractValue > 0 ? (margin >= 15 ? "good" : margin >= 8 ? "warn" : "bad") : "neutral"}
          />
          <Stat label="Lines" value={String(lines.length)} />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">Code</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left w-44">Trade section</th>
              <th className="px-3 py-2 text-left w-16">Unit</th>
              <th className="px-3 py-2 text-right w-20">Qty</th>
              <th className="px-3 py-2 text-right w-24">Labour $</th>
              <th className="px-3 py-2 text-right w-24">Material $</th>
              <th className="px-3 py-2 text-right w-24">Sub $</th>
              <th className="px-3 py-2 text-right w-28">Line total</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-400 text-sm">
                  No BOQ lines yet. Add the first one below.
                </td>
              </tr>
            )}
            {lines.map((l) => {
              const total =
                (l.qty ?? 0) * ((l.labourRate ?? 0) + (l.materialRate ?? 0) + (l.subRate ?? 0));
              return (
                <tr key={l.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5">
                    <input
                      value={l.code ?? ""}
                      onChange={(e) => update(l.id, { code: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={l.description ?? ""}
                      onChange={(e) => update(l.id, { description: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={l.tradeSection ?? ""}
                      onChange={(e) => update(l.id, { tradeSection: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">—</option>
                      {TRADE_SECTIONS.map((t) => (
                        <option key={t.code} value={t.section}>
                          {t.code} {t.section}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={l.unit ?? ""}
                      onChange={(e) => update(l.id, { unit: e.target.value })}
                      placeholder="ea / m²"
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={l.qty ?? ""}
                      onChange={(e) => update(l.id, { qty: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={l.labourRate ?? ""}
                      onChange={(e) => update(l.id, { labourRate: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={l.materialRate ?? ""}
                      onChange={(e) => update(l.id, { materialRate: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={l.subRate ?? ""}
                      onChange={(e) => update(l.id, { subRate: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-semibold">
                    {fmtCurrency(total)}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      onClick={() => setLines(lines.filter((x) => x.id !== l.id))}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                      aria-label="Remove line"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setLines([...lines, { id: newId() }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add BOQ line
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * RFQ panel
 * ----------------------------------------------------------------- */

function RfqPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const records = overlay.rfqs ?? [];
  const setRecords = (next: RfqRecord[]) => setOverlay({ ...overlay, rfqs: next });
  const update = (id: string, patch: Partial<RfqRecord>) =>
    setRecords(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const totalQuoted = records.reduce((a, r) => a + (r.quotedValue ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="RFQ register"
          sub="Every RFQ issued. Logs feed Hawktress benchmark dataset on award."
        />
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Open RFQs" value={String(records.filter((r) => r.status !== "Validated" && r.status !== "Declined").length)} />
          <Stat label="Quoted value" value={fmtCurrency(totalQuoted)} />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-24">RFQ ID</th>
              <th className="px-3 py-2 text-left w-44">Trade</th>
              <th className="px-3 py-2 text-left">Scope</th>
              <th className="px-3 py-2 text-left w-40">Supplier</th>
              <th className="px-3 py-2 text-left w-28">Sent</th>
              <th className="px-3 py-2 text-left w-28">Due</th>
              <th className="px-3 py-2 text-left w-28">Status</th>
              <th className="px-3 py-2 text-right w-28">Quoted $</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400 text-sm">
                  No RFQs yet. Add one to log a quote request.
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">
                  <input
                    value={r.rfqId ?? ""}
                    onChange={(e) => update(r.id, { rfqId: e.target.value })}
                    placeholder="RFQ-001"
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.tradeSection ?? ""}
                    onChange={(e) => update(r.id, { tradeSection: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {TRADE_SECTIONS.map((t) => (
                      <option key={t.code} value={t.section}>
                        {t.code} {t.section}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.scopeSummary ?? ""}
                    onChange={(e) => update(r.id, { scopeSummary: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.supplier ?? ""}
                    onChange={(e) => update(r.id, { supplier: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="date"
                    value={r.dateSent ?? ""}
                    onChange={(e) => update(r.id, { dateSent: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="date"
                    value={r.responseDue ?? ""}
                    onChange={(e) => update(r.id, { responseDue: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.status ?? "Drafted"}
                    onChange={(e) => update(r.id, { status: e.target.value })}
                    className={inputClass}
                  >
                    {RFQ_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={r.quotedValue ?? ""}
                    onChange={(e) => update(r.id, { quotedValue: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button
                    onClick={() => setRecords(records.filter((x) => x.id !== r.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRecords([...records, { id: newId(), status: "Drafted" }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add RFQ
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Variations panel
 * ----------------------------------------------------------------- */

function VariationsPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const records = overlay.variations ?? [];
  const setRecords = (next: VariationRecord[]) => setOverlay({ ...overlay, variations: next });
  const update = (id: string, patch: Partial<VariationRecord>) =>
    setRecords(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const costImpact = records.reduce((a, r) => a + (r.costImpact ?? 0), 0);
  const revenueImpact = records.reduce((a, r) => a + (r.revenueImpact ?? 0), 0);
  const marginImpact = revenueImpact - costImpact;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Variation register"
          sub="Every change order. Cost impact + revenue impact = margin impact."
        />
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Cost impact" value={fmtCurrency(costImpact)} />
          <Stat label="Revenue impact" value={fmtCurrency(revenueImpact)} />
          <Stat
            label="Margin impact"
            value={fmtCurrency(marginImpact)}
            tone={marginImpact >= 0 ? "good" : "bad"}
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1200px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">VO #</th>
              <th className="px-3 py-2 text-left w-28">Date</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left w-44">Trade</th>
              <th className="px-3 py-2 text-right w-24">Cost $</th>
              <th className="px-3 py-2 text-right w-24">Revenue $</th>
              <th className="px-3 py-2 text-right w-20">Days</th>
              <th className="px-3 py-2 text-left w-32">Director</th>
              <th className="px-3 py-2 text-left w-32">Status</th>
              <th className="px-3 py-2 text-center w-20">Signed</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={11} className="text-center py-10 text-slate-400 text-sm">
                  No variations recorded. Add one when scope changes.
                </td>
              </tr>
            )}
            {records.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">
                  <input
                    value={r.voNumber ?? ""}
                    onChange={(e) => update(r.id, { voNumber: e.target.value })}
                    placeholder="VO-001"
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="date"
                    value={r.dateRaised ?? ""}
                    onChange={(e) => update(r.id, { dateRaised: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.description ?? ""}
                    onChange={(e) => update(r.id, { description: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.tradeSection ?? ""}
                    onChange={(e) => update(r.id, { tradeSection: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {TRADE_SECTIONS.map((t) => (
                      <option key={t.code} value={t.section}>
                        {t.code} {t.section}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={r.costImpact ?? ""}
                    onChange={(e) => update(r.id, { costImpact: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={r.revenueImpact ?? ""}
                    onChange={(e) => update(r.id, { revenueImpact: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={r.daysImpact ?? ""}
                    onChange={(e) => update(r.id, { daysImpact: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.directorGate ?? "Not required"}
                    onChange={(e) =>
                      update(r.id, { directorGate: e.target.value as VariationRecord["directorGate"] })
                    }
                    className={inputClass}
                  >
                    <option value="Not required">Not required</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.status ?? "Draft"}
                    onChange={(e) => update(r.id, { status: e.target.value })}
                    className={inputClass}
                  >
                    {VARIATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5 text-center">
                  <input
                    type="checkbox"
                    checked={!!r.clientSigned}
                    onChange={(e) => update(r.id, { clientSigned: e.target.checked })}
                    className="rounded border-slate-300 text-bh-orange focus:ring-bh-orange"
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button
                    onClick={() => setRecords(records.filter((x) => x.id !== r.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRecords([...records, { id: newId(), status: "Draft" }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add variation
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Cost-to-Complete panel
 * ----------------------------------------------------------------- */

function CostPanel({
  overlay,
  setOverlay,
  committedTotal,
  spentTotal,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
  committedTotal: number;
  spentTotal: number;
}) {
  const lines = overlay.costToComplete ?? [];
  const setLines = (next: CostToCompleteLine[]) =>
    setOverlay({ ...overlay, costToComplete: next });
  const update = (id: string, patch: Partial<CostToCompleteLine>) =>
    setLines(lines.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const totalBudget = lines.reduce((a, l) => a + (l.budget ?? 0), 0);
  const totalForecast = lines.reduce((a, l) => a + (l.forecastAtCompletion ?? 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Cost to complete"
          sub="Per-trade rollup. Pulls into the dashboard's WIP and live margin tiles."
        />
        <div className="flex items-center gap-4 text-xs">
          <Stat label="Budget" value={fmtCurrency(totalBudget)} />
          <Stat label="Committed" value={fmtCurrency(committedTotal)} />
          <Stat label="Spent" value={fmtCurrency(spentTotal)} />
          <Stat label="Forecast" value={fmtCurrency(totalForecast)} />
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">Code</th>
              <th className="px-3 py-2 text-left">Trade section</th>
              <th className="px-3 py-2 text-right w-28">Budget</th>
              <th className="px-3 py-2 text-right w-28">Committed</th>
              <th className="px-3 py-2 text-right w-28">Spent</th>
              <th className="px-3 py-2 text-right w-20">% complete</th>
              <th className="px-3 py-2 text-right w-32">Forecast</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {lines.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400 text-sm">
                  No cost lines yet. Add a trade to begin tracking.
                </td>
              </tr>
            )}
            {lines.map((l) => (
              <tr key={l.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">
                  <input
                    value={l.code ?? ""}
                    onChange={(e) => update(l.id, { code: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={l.tradeSection ?? ""}
                    onChange={(e) => update(l.id, { tradeSection: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {TRADE_SECTIONS.map((t) => (
                      <option key={t.code} value={t.section}>
                        {t.code} {t.section}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={l.budget ?? ""}
                    onChange={(e) => update(l.id, { budget: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={l.committed ?? ""}
                    onChange={(e) => update(l.id, { committed: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={l.spentToDate ?? ""}
                    onChange={(e) => update(l.id, { spentToDate: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={l.percentComplete ?? ""}
                    onChange={(e) => update(l.id, { percentComplete: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={l.forecastAtCompletion ?? ""}
                    onChange={(e) =>
                      update(l.id, { forecastAtCompletion: num(e.target.value) })
                    }
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button
                    onClick={() => setLines(lines.filter((x) => x.id !== l.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLines([...lines, { id: newId() }])}
          className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
        >
          + Add cost line
        </button>
        {(overlay.boq ?? []).length > 0 && lines.length === 0 && (
          <button
            type="button"
            onClick={() => {
              const seed = (overlay.boq ?? [])
                .filter((b) => b.tradeSection)
                .reduce<Record<string, CostToCompleteLine>>((map, b) => {
                  const key = b.tradeSection!;
                  const lineTotal =
                    (b.qty ?? 0) *
                    ((b.labourRate ?? 0) + (b.materialRate ?? 0) + (b.subRate ?? 0));
                  if (!map[key]) {
                    map[key] = { id: newId(), code: b.code, tradeSection: key, budget: 0 };
                  }
                  map[key].budget = (map[key].budget ?? 0) + lineTotal;
                  return map;
                }, {});
              setLines(Object.values(seed));
            }}
            className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Seed from BOQ
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Risks panel
 * ----------------------------------------------------------------- */

function RisksPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const records = overlay.risks ?? [];
  const setRecords = (next: RiskRecord[]) => setOverlay({ ...overlay, risks: next });
  const update = (id: string, patch: Partial<RiskRecord>) =>
    setRecords(records.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Risk register"
          sub="Construction and commercial risks. Score = likelihood × impact (1–25)."
        />
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">ID</th>
              <th className="px-3 py-2 text-left">Risk</th>
              <th className="px-3 py-2 text-left">Mitigation</th>
              <th className="px-3 py-2 text-right w-24">Likely</th>
              <th className="px-3 py-2 text-right w-24">Impact</th>
              <th className="px-3 py-2 text-right w-20">Score</th>
              <th className="px-3 py-2 text-left w-32">Owner</th>
              <th className="px-3 py-2 text-left w-28">Review</th>
              <th className="px-3 py-2 text-left w-28">Status</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {records.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-400 text-sm">
                  No risks logged yet.
                </td>
              </tr>
            )}
            {records.map((r) => {
              const score = (r.likelihood ?? 0) * (r.impact ?? 0);
              return (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5">
                    <input
                      value={r.riskId ?? ""}
                      onChange={(e) => update(r.id, { riskId: e.target.value })}
                      placeholder="R001"
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.description ?? ""}
                      onChange={(e) => update(r.id, { description: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.mitigation ?? ""}
                      onChange={(e) => update(r.id, { mitigation: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={r.likelihood ?? ""}
                      onChange={(e) => update(r.id, { likelihood: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      min={0}
                      max={5}
                      value={r.impact ?? ""}
                      onChange={(e) => update(r.id, { impact: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td
                    className={`px-3 py-1.5 text-right tabular-nums font-bold ${
                      score >= 15 ? "text-rose-600" : score >= 8 ? "text-bh-orange-700" : "text-emerald-600"
                    }`}
                  >
                    {score || "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.owner ?? ""}
                      onChange={(e) => update(r.id, { owner: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="date"
                      value={r.reviewDate ?? ""}
                      onChange={(e) => update(r.id, { reviewDate: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={r.status ?? "Open"}
                      onChange={(e) => update(r.id, { status: e.target.value })}
                      className={inputClass}
                    >
                      {RISK_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      onClick={() => setRecords(records.filter((x) => x.id !== r.id))}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRecords([...records, { id: newId(), status: "Open" }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add risk
      </button>
    </div>
  );
}

const Stat = ({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn" | "bad";
}) => {
  const cls = {
    neutral: "text-slate-900",
    good: "text-emerald-600",
    warn: "text-bh-orange-700",
    bad: "text-rose-600",
  }[tone];
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
        {label}
      </span>
      <span className={`font-bold tabular-nums ${cls}`}>{value}</span>
    </div>
  );
};

/* ------------------------------------------------------------------
 * Quote Comparison panel
 * ----------------------------------------------------------------- */

function QuoteComparePanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const rows = overlay.quoteComparisons ?? [];
  const setRows = (next: QuoteComparisonRow[]) =>
    setOverlay({ ...overlay, quoteComparisons: next });
  const update = (id: string, patch: Partial<QuoteComparisonRow>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));

  const lowestOf = (r: QuoteComparisonRow) => {
    const xs = [r.quoteA, r.quoteB, r.quoteC].filter(
      (x): x is number => typeof x === "number" && x > 0,
    );
    return xs.length ? Math.min(...xs) : undefined;
  };
  const variancePct = (r: QuoteComparisonRow) => {
    const lo = lowestOf(r);
    if (!lo || !r.hawktressBenchmark) return undefined;
    return ((lo - r.hawktressBenchmark) / r.hawktressBenchmark) * 100;
  };

  const seedFromRfqs = () => {
    const grouped = (overlay.rfqs ?? []).reduce<Record<string, RfqRecord[]>>((m, r) => {
      const k = `${r.tradeSection ?? "—"}::${r.scopeSummary ?? r.rfqId ?? r.id}`;
      (m[k] = m[k] ?? []).push(r);
      return m;
    }, {});
    const seeded: QuoteComparisonRow[] = Object.entries(grouped).map(([k, list]) => {
      const [trade, scope] = k.split("::");
      const sorted = [...list].sort((a, b) => (a.dateSent ?? "").localeCompare(b.dateSent ?? ""));
      return {
        id: newId(),
        tradeSection: trade === "—" ? undefined : trade,
        scope,
        supplierA: sorted[0]?.supplier,
        quoteA: sorted[0]?.quotedValue,
        supplierB: sorted[1]?.supplier,
        quoteB: sorted[1]?.quotedValue,
        supplierC: sorted[2]?.supplier,
        quoteC: sorted[2]?.quotedValue,
      };
    });
    setRows(seeded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Quote comparison"
          sub="Up to three quotes per scope. Variance vs Hawktress benchmark drives the 5% flag."
        />
        <div className="flex items-center gap-2">
          {(overlay.rfqs ?? []).length > 0 && rows.length === 0 && (
            <button
              type="button"
              onClick={seedFromRfqs}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Seed from RFQs
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1300px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-44">Trade</th>
              <th className="px-3 py-2 text-left">Scope</th>
              <th className="px-3 py-2 text-right w-28">Hawktress bm</th>
              <th className="px-3 py-2 text-left w-36">Supplier A</th>
              <th className="px-3 py-2 text-right w-24">Quote A</th>
              <th className="px-3 py-2 text-left w-36">Supplier B</th>
              <th className="px-3 py-2 text-right w-24">Quote B</th>
              <th className="px-3 py-2 text-left w-36">Supplier C</th>
              <th className="px-3 py-2 text-right w-24">Quote C</th>
              <th className="px-3 py-2 text-right w-28">Lowest</th>
              <th className="px-3 py-2 text-right w-24">vs bm</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-10 text-slate-400 text-sm">
                  No comparisons yet. Add a row or seed from the RFQ register.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const lo = lowestOf(r);
              const v = variancePct(r);
              const flagged = v !== undefined && v > 5;
              return (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5">
                    <select
                      value={r.tradeSection ?? ""}
                      onChange={(e) => update(r.id, { tradeSection: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">—</option>
                      {TRADE_SECTIONS.map((t) => (
                        <option key={t.code} value={t.section}>
                          {t.code} {t.section}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.scope ?? ""}
                      onChange={(e) => update(r.id, { scope: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.hawktressBenchmark ?? ""}
                      onChange={(e) =>
                        update(r.id, { hawktressBenchmark: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.supplierA ?? ""}
                      onChange={(e) => update(r.id, { supplierA: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.quoteA ?? ""}
                      onChange={(e) => update(r.id, { quoteA: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.supplierB ?? ""}
                      onChange={(e) => update(r.id, { supplierB: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.quoteB ?? ""}
                      onChange={(e) => update(r.id, { quoteB: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      value={r.supplierC ?? ""}
                      onChange={(e) => update(r.id, { supplierC: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.quoteC ?? ""}
                      onChange={(e) => update(r.id, { quoteC: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-semibold">
                    {lo !== undefined ? fmtCurrency(lo) : "—"}
                  </td>
                  <td
                    className={`px-3 py-1.5 text-right tabular-nums font-bold ${
                      v === undefined
                        ? "text-slate-400"
                        : flagged
                          ? "text-rose-600"
                          : v < 0
                            ? "text-emerald-600"
                            : "text-slate-700"
                    }`}
                  >
                    {v === undefined ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRows([...rows, { id: newId() }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add comparison row
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Awarded Subs panel
 * ----------------------------------------------------------------- */

function AwardedSubsPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const rows = overlay.awardedSubs ?? [];
  const setRows = (next: AwardedSub[]) => setOverlay({ ...overlay, awardedSubs: next });
  const update = (id: string, patch: Partial<AwardedSub>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));
  const total = rows.reduce((a, r) => a + (r.awardedValue ?? 0), 0);

  const seedFromValidatedRfqs = () => {
    const validated = (overlay.rfqs ?? []).filter((r) => r.status === "Validated");
    const seeded: AwardedSub[] = validated.map((r, i) => ({
      id: newId(),
      subId: `SUB-${String(i + 1).padStart(3, "0")}`,
      tradeSection: r.tradeSection,
      supplier: r.supplier,
      scope: r.scopeSummary,
      awardedValue: r.quotedValue,
      awardDate: new Date().toISOString().slice(0, 10),
      insuranceStatus: "Pending",
    }));
    setRows([...rows, ...seeded]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Awarded subcontracts"
          sub="Final awarded scopes. Award date locks the line into Hawktress."
        />
        <div className="flex items-center gap-3">
          <Stat label="Awarded total" value={fmtCurrency(total)} />
          {(overlay.rfqs ?? []).some((r) => r.status === "Validated") && (
            <button
              type="button"
              onClick={seedFromValidatedRfqs}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Seed from validated RFQs
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1200px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-24">Sub ID</th>
              <th className="px-3 py-2 text-left w-44">Trade</th>
              <th className="px-3 py-2 text-left w-40">Supplier</th>
              <th className="px-3 py-2 text-left">Scope</th>
              <th className="px-3 py-2 text-right w-28">Awarded $</th>
              <th className="px-3 py-2 text-left w-28">PO #</th>
              <th className="px-3 py-2 text-left w-28">Award date</th>
              <th className="px-3 py-2 text-left w-32">Insurance</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400 text-sm">
                  No subs awarded yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">
                  <input
                    value={r.subId ?? ""}
                    onChange={(e) => update(r.id, { subId: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.tradeSection ?? ""}
                    onChange={(e) => update(r.id, { tradeSection: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {TRADE_SECTIONS.map((t) => (
                      <option key={t.code} value={t.section}>
                        {t.code} {t.section}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.supplier ?? ""}
                    onChange={(e) => update(r.id, { supplier: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.scope ?? ""}
                    onChange={(e) => update(r.id, { scope: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    value={r.awardedValue ?? ""}
                    onChange={(e) => update(r.id, { awardedValue: num(e.target.value) })}
                    className={inputClass + " text-right"}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.poNumber ?? ""}
                    onChange={(e) => update(r.id, { poNumber: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="date"
                    value={r.awardDate ?? ""}
                    onChange={(e) => update(r.id, { awardDate: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.insuranceStatus ?? ""}
                    onChange={(e) => update(r.id, { insuranceStatus: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {AWARDED_INSURANCE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button
                    onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRows([...rows, { id: newId(), insuranceStatus: "Pending" }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add awarded sub
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Claims Schedule panel
 * ----------------------------------------------------------------- */

function ClaimsPanel({
  overlay,
  setOverlay,
  contractValue,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
  contractValue: number;
}) {
  const rows = overlay.claims ?? [];
  const setRows = (next: ClaimRecord[]) => setOverlay({ ...overlay, claims: next });
  const update = (id: string, patch: Partial<ClaimRecord>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));

  const grossTotal = rows.reduce((a, r) => a + (r.claimGross ?? 0), 0);
  const netTotal = rows.reduce(
    (a, r) => a + (r.claimGross ?? 0) * (1 - (r.retentionPct ?? 0) / 100),
    0,
  );
  const paidTotal = rows
    .filter((r) => r.status === "Paid")
    .reduce((a, r) => a + (r.claimGross ?? 0) * (1 - (r.retentionPct ?? 0) / 100), 0);

  const seedStandard = () => {
    const seeded: ClaimRecord[] = STANDARD_CLAIM_STAGES.map((stage, i) => ({
      id: newId(),
      claimNumber: `PC-${String(i + 1).padStart(2, "0")}`,
      stage,
      retentionPct: 5,
      status: "Drafted",
    }));
    setRows(seeded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Progress claims schedule"
          sub="Standard 7-stage HIA milestones. Net = gross × (1 − retention)."
        />
        <div className="flex items-center gap-3">
          <Stat label="Gross claimed" value={fmtCurrency(grossTotal)} />
          <Stat label="Net claimed" value={fmtCurrency(netTotal)} />
          <Stat label="Paid" value={fmtCurrency(paidTotal)} tone="good" />
          {rows.length === 0 && (
            <button
              type="button"
              onClick={seedStandard}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Seed standard 7 stages
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1200px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">Claim #</th>
              <th className="px-3 py-2 text-left w-44">Stage</th>
              <th className="px-3 py-2 text-left w-28">Date raised</th>
              <th className="px-3 py-2 text-right w-20">% complete</th>
              <th className="px-3 py-2 text-right w-28">Stage value</th>
              <th className="px-3 py-2 text-right w-28">Gross $</th>
              <th className="px-3 py-2 text-right w-20">Ret %</th>
              <th className="px-3 py-2 text-right w-28">Net $</th>
              <th className="px-3 py-2 text-left w-28">Approved</th>
              <th className="px-3 py-2 text-left w-28">Paid</th>
              <th className="px-3 py-2 text-left w-28">Status</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-10 text-slate-400 text-sm">
                  No claims yet. Seed the standard 7 stages above or add rows manually.
                </td>
              </tr>
            )}
            {rows.map((r) => {
              const net =
                (r.claimGross ?? 0) * (1 - (r.retentionPct ?? 0) / 100);
              return (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5">
                    <input
                      value={r.claimNumber ?? ""}
                      onChange={(e) => update(r.id, { claimNumber: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={r.stage ?? ""}
                      onChange={(e) => update(r.id, { stage: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">—</option>
                      {STANDARD_CLAIM_STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="date"
                      value={r.dateRaised ?? ""}
                      onChange={(e) => update(r.id, { dateRaised: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={r.percentCompleteThisStage ?? ""}
                      onChange={(e) =>
                        update(r.id, { percentCompleteThisStage: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.stageValue ?? ""}
                      onChange={(e) => update(r.id, { stageValue: num(e.target.value) })}
                      className={inputClass + " text-right"}
                      placeholder={
                        contractValue > 0 ? String(Math.round(contractValue / 7)) : ""
                      }
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.claimGross ?? ""}
                      onChange={(e) => update(r.id, { claimGross: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={r.retentionPct ?? 5}
                      onChange={(e) => update(r.id, { retentionPct: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums font-semibold">
                    {net > 0 ? fmtCurrency(net) : "—"}
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="date"
                      value={r.approvedDate ?? ""}
                      onChange={(e) => update(r.id, { approvedDate: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="date"
                      value={r.paidDate ?? ""}
                      onChange={(e) => update(r.id, { paidDate: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={r.status ?? "Drafted"}
                      onChange={(e) => update(r.id, { status: e.target.value })}
                      className={inputClass}
                    >
                      {CLAIM_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setRows([
            ...rows,
            {
              id: newId(),
              claimNumber: `PC-${String(rows.length + 1).padStart(2, "0")}`,
              retentionPct: 5,
              status: "Drafted",
            },
          ])
        }
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add claim
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Cashflow panel (12-week weekly forecast)
 * ----------------------------------------------------------------- */

function CashflowPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const rows = overlay.cashflow ?? [];
  const setRows = (next: CashflowEntry[]) => setOverlay({ ...overlay, cashflow: next });
  const update = (id: string, patch: Partial<CashflowEntry>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const num = (v: string) => (v === "" ? undefined : Number(v));

  const weekTotals = rows.map((r) => {
    const inflow =
      (r.inflowsProgressClaims ?? 0) +
      (r.inflowsRetention ?? 0) +
      (r.inflowsVariations ?? 0) +
      (r.inflowsOther ?? 0);
    const outflow =
      (r.outflowsSubs ?? 0) +
      (r.outflowsMaterials ?? 0) +
      (r.outflowsOverheads ?? 0) +
      (r.outflowsOther ?? 0);
    return { inflow, outflow, net: inflow - outflow };
  });
  const totalIn = weekTotals.reduce((a, w) => a + w.inflow, 0);
  const totalOut = weekTotals.reduce((a, w) => a + w.outflow, 0);

  const seedTwelveWeeks = () => {
    const start = new Date();
    const seeded: CashflowEntry[] = Array.from({ length: 12 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i * 7);
      return {
        id: newId(),
        weekNumber: i + 1,
        weekStarting: d.toISOString().slice(0, 10),
      };
    });
    setRows(seeded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="12-week cashflow forecast"
          sub="Weekly inflows + outflows. Feeds the dashboard's 90-day cashflow chart when entered."
        />
        <div className="flex items-center gap-3">
          <Stat label="Total inflow" value={fmtCurrency(totalIn)} tone="good" />
          <Stat label="Total outflow" value={fmtCurrency(totalOut)} tone="bad" />
          <Stat
            label="Net 90-day"
            value={fmtCurrency(totalIn - totalOut)}
            tone={totalIn - totalOut >= 0 ? "good" : "bad"}
          />
          {rows.length === 0 && (
            <button
              type="button"
              onClick={seedTwelveWeeks}
              className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Seed 12 weeks
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1300px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-16">Wk</th>
              <th className="px-3 py-2 text-left w-32">Start</th>
              <th className="px-3 py-2 text-right w-28">PC claims +</th>
              <th className="px-3 py-2 text-right w-24">Retention +</th>
              <th className="px-3 py-2 text-right w-24">VOs +</th>
              <th className="px-3 py-2 text-right w-24">Other +</th>
              <th className="px-3 py-2 text-right w-24">Subs −</th>
              <th className="px-3 py-2 text-right w-28">Materials −</th>
              <th className="px-3 py-2 text-right w-28">Overheads −</th>
              <th className="px-3 py-2 text-right w-24">Other −</th>
              <th className="px-3 py-2 text-right w-28">Net</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="text-center py-10 text-slate-400 text-sm">
                  No cashflow entered. Seed 12 weeks above to start.
                </td>
              </tr>
            )}
            {rows.map((r, i) => {
              const t = weekTotals[i];
              return (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-3 py-1.5 text-center font-semibold tabular-nums">
                    W{r.weekNumber}
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="date"
                      value={r.weekStarting ?? ""}
                      onChange={(e) => update(r.id, { weekStarting: e.target.value })}
                      className={inputClass}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.inflowsProgressClaims ?? ""}
                      onChange={(e) =>
                        update(r.id, { inflowsProgressClaims: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.inflowsRetention ?? ""}
                      onChange={(e) => update(r.id, { inflowsRetention: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.inflowsVariations ?? ""}
                      onChange={(e) =>
                        update(r.id, { inflowsVariations: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.inflowsOther ?? ""}
                      onChange={(e) => update(r.id, { inflowsOther: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.outflowsSubs ?? ""}
                      onChange={(e) => update(r.id, { outflowsSubs: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.outflowsMaterials ?? ""}
                      onChange={(e) =>
                        update(r.id, { outflowsMaterials: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.outflowsOverheads ?? ""}
                      onChange={(e) =>
                        update(r.id, { outflowsOverheads: num(e.target.value) })
                      }
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      value={r.outflowsOther ?? ""}
                      onChange={(e) => update(r.id, { outflowsOther: num(e.target.value) })}
                      className={inputClass + " text-right"}
                    />
                  </td>
                  <td
                    className={`px-3 py-1.5 text-right tabular-nums font-bold ${
                      t.net >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {t.inflow + t.outflow > 0 ? fmtCurrency(t.net) : "—"}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                      className="text-rose-500 hover:text-rose-700 text-xs"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() =>
          setRows([
            ...rows,
            { id: newId(), weekNumber: rows.length + 1 },
          ])
        }
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add week
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Suppliers panel
 * ----------------------------------------------------------------- */

function SuppliersPanel({
  overlay,
  setOverlay,
}: {
  overlay: ProjectOverlay;
  setOverlay: (o: ProjectOverlay) => void;
}) {
  const rows = overlay.suppliers ?? [];
  const setRows = (next: ProjectSupplier[]) => setOverlay({ ...overlay, suppliers: next });
  const update = (id: string, patch: Partial<ProjectSupplier>) =>
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <SectionHeader
          title="Project suppliers"
          sub="Pre-qualified subbies and suppliers used on this project. Cross-project Alliance directory lives in Procurement."
        />
        <Stat label="Suppliers" value={String(rows.length)} />
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6">
        <table className="w-full text-sm min-w-[1200px]">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-50 border-y border-slate-200">
              <th className="px-3 py-2 text-left w-20">ID</th>
              <th className="px-3 py-2 text-left w-44">Business name</th>
              <th className="px-3 py-2 text-left w-44">Primary trade</th>
              <th className="px-3 py-2 text-left w-32">ABN</th>
              <th className="px-3 py-2 text-left w-32">Region</th>
              <th className="px-3 py-2 text-left w-28">Tier</th>
              <th className="px-3 py-2 text-left w-44">Email</th>
              <th className="px-3 py-2 text-left w-32">Phone</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-10 text-slate-400 text-sm">
                  No project suppliers yet.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5">
                  <input
                    value={r.supplierId ?? ""}
                    onChange={(e) => update(r.id, { supplierId: e.target.value })}
                    placeholder="S001"
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.businessName ?? ""}
                    onChange={(e) => update(r.id, { businessName: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.primaryTrade ?? ""}
                    onChange={(e) => update(r.id, { primaryTrade: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {TRADE_SECTIONS.map((t) => (
                      <option key={t.code} value={t.section}>
                        {t.code} {t.section}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    value={r.abn ?? ""}
                    onChange={(e) => update(r.id, { abn: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.primaryRegion ?? ""}
                    onChange={(e) => update(r.id, { primaryRegion: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">—</option>
                    {REGIONS.map((rg) => (
                      <option key={rg.code} value={rg.code}>
                        {rg.code}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={r.allianceTier ?? "None"}
                    onChange={(e) => update(r.id, { allianceTier: e.target.value })}
                    className={inputClass}
                  >
                    {ALLIANCE_TIER_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="email"
                    value={r.contactEmail ?? ""}
                    onChange={(e) => update(r.id, { contactEmail: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="tel"
                    value={r.phone ?? ""}
                    onChange={(e) => update(r.id, { phone: e.target.value })}
                    className={inputClass}
                  />
                </td>
                <td className="px-3 py-1.5 text-center">
                  <button
                    onClick={() => setRows(rows.filter((x) => x.id !== r.id))}
                    className="text-rose-500 hover:text-rose-700 text-xs"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => setRows([...rows, { id: newId(), allianceTier: "None" }])}
        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-md border border-bh-orange-200/60 bg-bh-orange-50 text-bh-orange-700 text-sm font-semibold hover:bg-bh-orange-100"
      >
        + Add supplier
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Hawktress Export panel (read-only)
 * ----------------------------------------------------------------- */

function HawktressExportPanel({
  overlay,
  project,
  projectId,
}: {
  overlay: ProjectOverlay;
  project: HbnhProject | null;
  projectId: string;
}) {
  const buildExport = () => {
    const awarded = overlay.awardedSubs ?? [];
    const variations = overlay.variations ?? [];
    return {
      meta: {
        opportunityId: projectId,
        projectName: project?.name,
        regionCode: overlay.setup?.regionCode ?? null,
        projectType: overlay.setup?.projectType ?? project?.type,
        builder: "Homes by NH",
        anonymisedAt: new Date().toISOString(),
      },
      awardedQuotes: awarded.map((a) => ({
        tradeSection: a.tradeSection,
        awardedValue: a.awardedValue,
        awardDate: a.awardDate,
      })),
      variations: variations
        .filter((v) => v.directorGate === "Approved" || v.status === "Approved")
        .map((v) => ({
          tradeSection: v.tradeSection,
          costImpact: v.costImpact,
          revenueImpact: v.revenueImpact,
          dateRaised: v.dateRaised,
        })),
      actuals: (overlay.costToComplete ?? []).map((c) => ({
        tradeSection: c.tradeSection,
        budget: c.budget,
        committed: c.committed,
        spentToDate: c.spentToDate,
        forecastAtCompletion: c.forecastAtCompletion,
      })),
    };
  };

  const exportObj = buildExport();
  const json = JSON.stringify(exportObj, null, 2);
  const counts = {
    awarded: exportObj.awardedQuotes.length,
    variations: exportObj.variations.length,
    actuals: exportObj.actuals.length,
  };

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Hawktress export preview"
        sub="Anonymised payload sent to the Hawktress benchmark engine. Project + builder identifiers stripped at write."
      />
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Awarded quotes" value={String(counts.awarded)} />
        <Stat label="Approved variations" value={String(counts.variations)} />
        <Stat label="Actuals lines" value={String(counts.actuals)} />
      </div>
      <div className="bg-bh-ink rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-black/30 border-b border-white/10">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/60 font-bold">
            Payload
          </span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(json).catch(() => null)}
            className="text-xs text-white/70 hover:text-white"
          >
            Copy JSON
          </button>
        </div>
        <pre className="p-4 text-xs text-emerald-200 overflow-x-auto whitespace-pre max-h-[60vh]">
          {json}
        </pre>
      </div>
      <p className="text-[11px] text-slate-500">
        On production, the Hawktress ETL job ships only awarded quotes and approved variations,
        tagged by region + trade + project type. Project ID, builder ID, and supplier identity
        never leave the tenant boundary.
      </p>
    </div>
  );
}
