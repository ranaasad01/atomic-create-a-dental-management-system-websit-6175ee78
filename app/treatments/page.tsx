"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { TreatmentPlan } from "@/lib/data";
type TreatmentStage = any;
const TreatmentStage: any = [];
type Prescription = any;
const Prescription: any = [];
type STATUS_COLORS = any;
const STATUS_COLORS: any = [];
import { Plus, Search, ChevronDown, FileText, Edit, Trash2, Check, X, Clock, AlertCircle, Star, Activity, Calendar } from 'lucide-react';

// ─── Inline mock data ────────────────────────────────────────────────────────

const PATIENTS = [
  { id: "P001", name: "Sarah Mitchell" },
  { id: "P002", name: "James Thornton" },
  { id: "P003", name: "Emily Chen" },
  { id: "P004", name: "Robert Vasquez" },
  { id: "P005", name: "Olivia Patel" },
];

const MOCK_PLANS: TreatmentPlan[] = [
  {
    id: "TP001",
    planId: "PLN-2024-001",
    patientId: "P001",
    patientName: "Sarah Mitchell",
    procedure: "Full Mouth Rehabilitation",
    dentist: "Dr. Amanda Lee",
    startDate: "2024-01-15",
    estimatedCompletion: "2024-06-30",
    status: "active",
    stages: [
      {
        id: "S1",
        name: "Initial Assessment & X-Rays",
        status: "completed",
        scheduledDate: "2024-01-15",
        completedDate: "2024-01-15",
        notes: "Full panoramic X-ray completed.",
      },
      {
        id: "S2",
        name: "Deep Cleaning (Scaling & Root Planing)",
        status: "completed",
        scheduledDate: "2024-02-01",
        completedDate: "2024-02-03",
        notes: "Quadrant 1 & 2 completed.",
      },
      {
        id: "S3",
        name: "Crown Preparation – Tooth #14",
        status: "in-progress",
        scheduledDate: "2024-03-10",
        notes: "Temporary crown placed.",
      },
      {
        id: "S4",
        name: "Final Crown Placement",
        status: "planned",
        scheduledDate: "2024-04-05",
      },
      {
        id: "S5",
        name: "Whitening & Finishing",
        status: "planned",
        scheduledDate: "2024-05-20",
      },
    ],
  },
  {
    id: "TP002",
    planId: "PLN-2024-002",
    patientId: "P002",
    patientName: "James Thornton",
    procedure: "Orthodontic Treatment (Braces)",
    dentist: "Dr. Kevin Park",
    startDate: "2024-02-10",
    estimatedCompletion: "2025-08-10",
    status: "active",
    stages: [
      {
        id: "S1",
        name: "Consultation & Records",
        status: "completed",
        scheduledDate: "2024-02-10",
        completedDate: "2024-02-10",
      },
      {
        id: "S2",
        name: "Bracket Placement",
        status: "completed",
        scheduledDate: "2024-03-01",
        completedDate: "2024-03-01",
      },
      {
        id: "S3",
        name: "Monthly Adjustment #1",
        status: "in-progress",
        scheduledDate: "2024-04-01",
      },
    ],
  },
  {
    id: "TP003",
    planId: "PLN-2024-003",
    patientId: "P003",
    patientName: "Emily Chen",
    procedure: "Dental Implant – Tooth #19",
    dentist: "Dr. Amanda Lee",
    startDate: "2024-03-05",
    estimatedCompletion: "2024-09-05",
    status: "awaiting-approval",
    stages: [
      {
        id: "S1",
        name: "Bone Density Assessment",
        status: "completed",
        scheduledDate: "2024-03-05",
        completedDate: "2024-03-05",
      },
      {
        id: "S2",
        name: "Implant Surgery",
        status: "planned",
        scheduledDate: "2024-05-15",
      },
      {
        id: "S3",
        name: "Osseointegration Period",
        status: "planned",
      },
      {
        id: "S4",
        name: "Abutment & Crown Placement",
        status: "planned",
        scheduledDate: "2024-09-01",
      },
    ],
  },
  {
    id: "TP004",
    planId: "PLN-2023-041",
    patientId: "P004",
    patientName: "Robert Vasquez",
    procedure: "Root Canal – Tooth #30",
    dentist: "Dr. Kevin Park",
    startDate: "2023-11-20",
    estimatedCompletion: "2024-01-10",
    status: "completed",
    stages: [
      {
        id: "S1",
        name: "Pulp Removal",
        status: "completed",
        scheduledDate: "2023-11-20",
        completedDate: "2023-11-20",
      },
      {
        id: "S2",
        name: "Canal Shaping & Cleaning",
        status: "completed",
        scheduledDate: "2023-12-05",
        completedDate: "2023-12-05",
      },
      {
        id: "S3",
        name: "Obturation & Crown",
        status: "completed",
        scheduledDate: "2024-01-08",
        completedDate: "2024-01-08",
      },
    ],
  },
  {
    id: "TP005",
    planId: "PLN-2024-004",
    patientId: "P005",
    patientName: "Olivia Patel",
    procedure: "Veneers – Upper Anterior (6 teeth)",
    dentist: "Dr. Amanda Lee",
    startDate: "2024-04-01",
    estimatedCompletion: "2024-07-01",
    status: "on-hold",
    stages: [
      {
        id: "S1",
        name: "Shade Selection & Prep",
        status: "planned",
        scheduledDate: "2024-04-01",
      },
      {
        id: "S2",
        name: "Tooth Preparation & Temporaries",
        status: "planned",
        scheduledDate: "2024-05-01",
      },
      {
        id: "S3",
        name: "Veneer Bonding",
        status: "planned",
        scheduledDate: "2024-06-15",
      },
    ],
  },
];

const PLAN_COSTS: Record<string, number> = {
  TP001: 4800,
  TP002: 5500,
  TP003: 3200,
  TP004: 1400,
  TP005: 6000,
};

const MOCK_PRESCRIPTIONS: Record<string, Prescription[]> = {
  TP001: [
    {
      id: "RX001",
      rxNumber: "RX-2024-0041",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "3x daily",
      duration: "7 days",
      issuedDate: "2024-02-03",
      dentist: "Dr. Amanda Lee",
      status: "completed",
      notes: "Post-scaling antibiotic course.",
    },
    {
      id: "RX002",
      rxNumber: "RX-2024-0089",
      medication: "Ibuprofen",
      dosage: "400mg",
      frequency: "As needed",
      duration: "5 days",
      issuedDate: "2024-03-10",
      dentist: "Dr. Amanda Lee",
      status: "active",
      notes: "Pain management post crown prep.",
    },
  ],
  TP003: [
    {
      id: "RX003",
      rxNumber: "RX-2024-0012",
      medication: "Chlorhexidine Mouthwash",
      dosage: "0.12%",
      frequency: "2x daily",
      duration: "14 days",
      issuedDate: "2024-03-05",
      dentist: "Dr. Amanda Lee",
      status: "active",
      notes: "Pre-surgical oral hygiene protocol.",
    },
  ],
  TP004: [
    {
      id: "RX004",
      rxNumber: "RX-2023-0198",
      medication: "Metronidazole",
      dosage: "250mg",
      frequency: "3x daily",
      duration: "5 days",
      issuedDate: "2023-11-20",
      dentist: "Dr. Kevin Park",
      status: "completed",
    },
  ],
};

// ─── Tooth chart data ─────────────────────────────────────────────────────────

type ToothState = "healthy" | "affected" | "treated";

interface Tooth {
  number: number;
  label: string;
}

const UPPER_TEETH: Tooth[] = [
  { number: 1, label: "UR8" },
  { number: 2, label: "UR7" },
  { number: 3, label: "UR6" },
  { number: 4, label: "UR5" },
  { number: 5, label: "UR4" },
  { number: 6, label: "UR3" },
  { number: 7, label: "UR2" },
  { number: 8, label: "UR1" },
  { number: 9, label: "UL1" },
  { number: 10, label: "UL2" },
  { number: 11, label: "UL3" },
  { number: 12, label: "UL4" },
  { number: 13, label: "UL5" },
  { number: 14, label: "UL6" },
  { number: 15, label: "UL7" },
  { number: 16, label: "UL8" },
];

const LOWER_TEETH: Tooth[] = [
  { number: 17, label: "LL8" },
  { number: 18, label: "LL7" },
  { number: 19, label: "LL6" },
  { number: 20, label: "LL5" },
  { number: 21, label: "LL4" },
  { number: 22, label: "LL3" },
  { number: 23, label: "LL2" },
  { number: 24, label: "LL1" },
  { number: 25, label: "LR1" },
  { number: 26, label: "LR2" },
  { number: 27, label: "LR3" },
  { number: 28, label: "LR4" },
  { number: 29, label: "LR5" },
  { number: 30, label: "LR6" },
  { number: 31, label: "LR7" },
  { number: 32, label: "LR8" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    active: "bg-sky-100 text-sky-700 border-sky-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    "on-hold": "bg-amber-100 text-amber-700 border-amber-200",
    "awaiting-approval": "bg-purple-100 text-purple-700 border-purple-200",
    planned: "bg-slate-100 text-slate-600 border-slate-200",
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    expired: "bg-red-100 text-red-700 border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
}

function stageIcon(status: TreatmentStage["status"]) {
  if (status === "completed") return <Check className="h-3.5 w-3.5 text-green-600" />;
  if (status === "in-progress") return <Activity className="h-3.5 w-3.5 text-blue-600" />;
  return <Clock className="h-3.5 w-3.5 text-slate-400" />;
}

// ─── Prescription form default ────────────────────────────────────────────────

interface RxForm {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

const EMPTY_RX: RxForm = {
  medication: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: "",
};

// ─── Tooth SVG component ──────────────────────────────────────────────────────

const toothFill: Record<ToothState, string> = {
  healthy: "#ffffff",
  affected: "#fbbf24",
  treated: "#38bdf8",
};

const toothStroke: Record<ToothState, string> = {
  healthy: "#cbd5e1",
  affected: "#d97706",
  treated: "#0284c7",
};

function ToothShape({
  tooth,
  state,
  onClick,
  isMolar,
}: {
  tooth: Tooth;
  state: ToothState;
  onClick: () => void;
  isMolar: boolean;
}) {
  const w = isMolar ? 28 : 22;
  const h = isMolar ? 32 : 28;
  const rx = isMolar ? 6 : 5;

  return (
    <button
      onClick={onClick}
      title={`Tooth #${tooth.number} (${tooth.label}) — ${state}`}
      className="flex flex-col items-center gap-0.5 group focus:outline-none"
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="transition-transform duration-150 group-hover:scale-110">
        <rect
          x="1"
          y="1"
          width={w - 2}
          height={h - 2}
          rx={rx}
          fill={toothFill[state]}
          stroke={toothStroke[state]}
          strokeWidth="1.5"
        />
        {isMolar && (
          <>
            <line x1="9" y1="8" x2="9" y2={h - 8} stroke={toothStroke[state]} strokeWidth="0.8" opacity="0.5" />
            <line x1="19" y1="8" x2="19" y2={h - 8} stroke={toothStroke[state]} strokeWidth="0.8" opacity="0.5" />
          </>
        )}
      </svg>
      <span className="text-[9px] text-slate-400 font-mono leading-none">{tooth.number}</span>
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const panelVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function TreatmentsPage() {
  // Patient selector
  const [selectedPatientId, setSelectedPatientId] = useState<string>("all");

  // Search
  const [search, setSearch] = useState("");

  // Selected plan
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>("TP001");

  // Tooth chart state
  const [toothStates, setToothStates] = useState<Record<number, ToothState>>({
    14: "treated",
    19: "affected",
    30: "treated",
  });

  // Prescription state
  const [prescriptions, setPrescriptions] = useState<Record<string, Prescription[]>>(MOCK_PRESCRIPTIONS);
  const [rxForm, setRxForm] = useState<RxForm>(EMPTY_RX);
  const [rxEditId, setRxEditId] = useState<string | null>(null);
  const [showRxForm, setShowRxForm] = useState(false);

  // New plan modal (simple toggle)
  const [showNewPlan, setShowNewPlan] = useState(false);

  // Derived
  const filteredPlans = MOCK_PLANS.filter((p) => {
    const matchPatient = selectedPatientId === "all" || p.patientId === selectedPatientId;
    const matchSearch =
      search === "" ||
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.procedure.toLowerCase().includes(search.toLowerCase()) ||
      p.planId.toLowerCase().includes(search.toLowerCase());
    return matchPatient && matchSearch;
  });

  const selectedPlan = MOCK_PLANS.find((p) => p.id === selectedPlanId) ?? null;
  const planPrescriptions = selectedPlanId ? (prescriptions[selectedPlanId] ?? []) : [];

  // Tooth cycle: healthy → affected → treated → healthy
  const cycleTooth = useCallback((num: number) => {
    setToothStates((prev) => {
      const cur = prev[num] ?? "healthy";
      const next: ToothState = cur === "healthy" ? "affected" : cur === "affected" ? "treated" : "healthy";
      return { ...prev, [num]: next };
    });
  }, []);

  // Prescription handlers
  function handleRxSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPlanId) return;
    if (rxEditId) {
      setPrescriptions((prev) => ({
        ...prev,
        [selectedPlanId]: (prev[selectedPlanId] ?? []).map((rx) =>
          rx.id === rxEditId
            ? {
                ...rx,
                medication: rxForm.medication,
                dosage: rxForm.dosage,
                frequency: rxForm.frequency,
                duration: rxForm.duration,
                notes: rxForm.notes,
              }
            : rx
        ),
      }));
      setRxEditId(null);
    } else {
      const newRx: Prescription = {
        id: `RX${Date.now()}`,
        rxNumber: `RX-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        medication: rxForm.medication,
        dosage: rxForm.dosage,
        frequency: rxForm.frequency,
        duration: rxForm.duration,
        issuedDate: new Date().toISOString().split("T")[0],
        dentist: selectedPlan?.dentist ?? "Dr. Amanda Lee",
        status: "active",
        notes: rxForm.notes,
      };
      setPrescriptions((prev) => ({
        ...prev,
        [selectedPlanId]: [...(prev[selectedPlanId] ?? []), newRx],
      }));
    }
    setRxForm(EMPTY_RX);
    setShowRxForm(false);
  }

  function handleRxEdit(rx: Prescription) {
    setRxEditId(rx.id);
    setRxForm({
      medication: rx.medication,
      dosage: rx.dosage,
      frequency: rx.frequency,
      duration: rx.duration,
      notes: rx.notes ?? "",
    });
    setShowRxForm(true);
  }

  function handleRxDelete(rxId: string) {
    if (!selectedPlanId) return;
    setPrescriptions((prev) => ({
      ...prev,
      [selectedPlanId]: (prev[selectedPlanId] ?? []).filter((rx) => rx.id !== rxId),
    }));
  }

  const isMolar = (n: number) => {
    const molars = [1, 2, 3, 14, 15, 16, 17, 18, 19, 30, 31, 32];
    return molars.includes(n);
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">

        {/* ── Page Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Treatment Plans
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage clinical treatment plans, odontogram, and prescriptions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Patient selector */}
              <div className="relative">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 pr-9 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 cursor-pointer"
                >
                  <option value="all">All Patients</option>
                  {PATIENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              </div>
              {/* New plan button */}
              <button
                onClick={() => setShowNewPlan(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                New Treatment Plan
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── Treatment Plans Table ── */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Table toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Active Plans
                <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                  ({filteredPlans.length} records)
                </span>
              </h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] pl-9 pr-4 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                    {["Patient", "Plan / Procedure", "Start Date", "Stages", "Est. Cost", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredPlans.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-10 text-center text-sm text-[var(--muted)]">
                        No treatment plans match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredPlans.map((plan) => (
                      <motion.tr
                        key={plan.id}
                        whileHover={{ backgroundColor: "rgba(var(--accent-rgb, 14,165,233), 0.03)" }}
                        className={cn(
                          "cursor-pointer transition-colors",
                          selectedPlanId === plan.id ? "bg-[var(--accent)]/5" : ""
                        )}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <td className="px-5 py-3.5 font-medium text-[var(--foreground)]">
                          {plan.patientName}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-[var(--foreground)]">{plan.procedure}</div>
                          <div className="text-xs text-[var(--muted)]">{plan.planId}</div>
                        </td>
                        <td className="px-5 py-3.5 text-[var(--muted)]">{plan.startDate}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold">
                            {plan.stages?.length ?? 0}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-[var(--foreground)]">
                          ${(PLAN_COSTS[plan.id] ?? 0).toLocaleString("en-US")}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize", statusBadge(plan.status))}>
                            {plan.status.replace("-", " ")}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedPlanId(plan.id); }}
                              className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                              title="View details"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-lg p-1.5 text-[var(--muted)] hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Edit plan"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* ── Odontogram + Detail Panel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Tooth Chart */}
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[var(--foreground)]">Odontogram</h2>
                <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm border border-slate-300 bg-white" />
                    Healthy
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-amber-400" />
                    Affected
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-3 h-3 rounded-sm bg-sky-400" />
                    Treated
                  </span>
                </div>
              </div>

              <p className="text-xs text-[var(--muted)] mb-4">
                Click a tooth to cycle its status: healthy → affected → treated.
              </p>

              {/* Upper arch */}
              <div className="mb-1">
                <div className="text-[10px] text-[var(--muted)] text-center mb-1 font-medium uppercase tracking-widest">Upper Arch</div>
                <div className="flex justify-center gap-1 flex-wrap">
                  {UPPER_TEETH.map((tooth) => (
                    <ToothShape
                      key={tooth.number}
                      tooth={tooth}
                      state={toothStates[tooth.number] ?? "healthy"}
                      onClick={() => cycleTooth(tooth.number)}
                      isMolar={isMolar(tooth.number)}
                    />
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-dashed border-[var(--border)]" />

              {/* Lower arch */}
              <div>
                <div className="flex justify-center gap-1 flex-wrap">
                  {LOWER_TEETH.map((tooth) => (
                    <ToothShape
                      key={tooth.number}
                      tooth={tooth}
                      state={toothStates[tooth.number] ?? "healthy"}
                      onClick={() => cycleTooth(tooth.number)}
                      isMolar={isMolar(tooth.number)}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-[var(--muted)] text-center mt-1 font-medium uppercase tracking-widest">Lower Arch</div>
              </div>

              {/* Summary */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {(["healthy", "affected", "treated"] as ToothState[]).map((s) => {
                  const count = Object.values(toothStates).filter((v) => v === s).length;
                  const total = s === "healthy" ? 32 - Object.keys(toothStates).length + count : count;
                  return (
                    <div key={s} className="rounded-xl border border-[var(--border)] bg-[var(--background)] py-2">
                      <div className={cn("text-lg font-bold", s === "healthy" ? "text-slate-600" : s === "affected" ? "text-amber-500" : "text-sky-500")}>
                        {s === "healthy" ? 32 - Object.values(toothStates).filter((v) => v !== "healthy").length : count}
                      </div>
                      <div className="text-[10px] text-[var(--muted)] capitalize">{s}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Treatment Detail Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedPlan ? (
                <motion.div
                  key={selectedPlan.id}
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 10, transition: { duration: 0.2 } }}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-5 space-y-5"
                >
                  {/* Plan header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-[var(--foreground)]">
                        {selectedPlan.procedure}
                      </h2>
                      <p className="text-xs text-[var(--muted)] mt-0.5">
                        {selectedPlan.planId} · {selectedPlan.patientName} · {selectedPlan.dentist}
                      </p>
                    </div>
                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize shrink-0", statusBadge(selectedPlan.status))}>
                      {selectedPlan.status.replace("-", " ")}
                    </span>
                  </div>

                  {/* Meta row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Start Date", value: selectedPlan.startDate },
                      { label: "Est. Completion", value: selectedPlan.estimatedCompletion ?? "TBD" },
                      { label: "Est. Cost", value: `$${(PLAN_COSTS[selectedPlan.id] ?? 0).toLocaleString("en-US")}` },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2">
                        <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] font-medium">{m.label}</div>
                        <div className="text-sm font-semibold text-[var(--foreground)] mt-0.5">{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Stages */}
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">Treatment Stages</h3>
                    <div className="space-y-2">
                      {(selectedPlan.stages ?? []).map((stage, idx) => (
                        <div
                          key={stage.id}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border px-3 py-2.5",
                            stage.status === "completed"
                              ? "border-green-200 bg-green-50"
                              : stage.status === "in-progress"
                              ? "border-blue-200 bg-blue-50"
                              : "border-[var(--border)] bg-[var(--background)]"
                          )}
                        >
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current bg-white">
                            {stageIcon(stage.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-[var(--foreground)] truncate">
                                {idx + 1}. {stage.name}
                              </span>
                              <span className={cn("text-[10px] font-medium capitalize shrink-0", stage.status === "completed" ? "text-green-600" : stage.status === "in-progress" ? "text-blue-600" : "text-slate-400")}>
                                {stage.status.replace("-", " ")}
                              </span>
                            </div>
                            {stage.scheduledDate && (
                              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-[var(--muted)]">
                                <Calendar className="h-3 w-3" />
                                {stage.completedDate ? `Completed ${stage.completedDate}` : `Scheduled ${stage.scheduledDate}`}
                              </div>
                            )}
                            {stage.notes && (
                              <p className="mt-1 text-[11px] text-[var(--muted)] italic">{stage.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]"
                >
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-[var(--muted)] mb-2" />
                    <p className="text-sm text-[var(--muted)]">Select a treatment plan to view details.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Prescriptions Section ── */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">Prescriptions</h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  {selectedPlan
                    ? `Attached to: ${selectedPlan.procedure} — ${selectedPlan.patientName}`
                    : "Select a treatment plan to manage prescriptions."}
                </p>
              </div>
              {selectedPlan && (
                <button
                  onClick={() => { setShowRxForm((v) => !v); setRxEditId(null); setRxForm(EMPTY_RX); }}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Prescription
                </button>
              )}
            </div>

            {/* Prescription form */}
            <AnimatePresence>
              {showRxForm && selectedPlan && (
                <motion.form
                  key="rx-form"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleRxSubmit}
                  className="mb-5 overflow-hidden"
                >
                  <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)] mb-3">
                      {rxEditId ? "Edit Prescription" : "New Prescription"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { label: "Medication", key: "medication", placeholder: "e.g. Amoxicillin" },
                        { label: "Dosage", key: "dosage", placeholder: "e.g. 500mg" },
                        { label: "Frequency", key: "frequency", placeholder: "e.g. 3x daily" },
                        { label: "Duration", key: "duration", placeholder: "e.g. 7 days" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-medium text-[var(--muted)] mb-1">{field.label}</label>
                          <input
                            type="text"
                            required
                            placeholder={field.placeholder}
                            value={rxForm[field.key as keyof RxForm]}
                            onChange={(e) => setRxForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                          />
                        </div>
                      ))}
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">Notes (optional)</label>
                        <input
                          type="text"
                          placeholder="Clinical notes..."
                          value={rxForm.notes}
                          onChange={(e) => setRxForm((prev) => ({ ...prev, notes: e.target.value }))}
                          className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        <Check className="h-3.5 w-3.5" />
                        {rxEditId ? "Save Changes" : "Add Prescription"}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowRxForm(false); setRxEditId(null); setRxForm(EMPTY_RX); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Prescription list */}
            {!selectedPlan ? (
              <div className="flex items-center justify-center py-10 text-sm text-[var(--muted)]">
                <AlertCircle className="mr-2 h-4 w-4" />
                No plan selected.
              </div>
            ) : planPrescriptions.length === 0 ? (
              <div className="flex items-center justify-center py-10 text-sm text-[var(--muted)]">
                No prescriptions attached to this plan yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {planPrescriptions.map((rx) => (
                  <motion.div
                    key={rx.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">{rx.medication}</div>
                        <div className="text-xs text-[var(--muted)] mt-0.5">{rx.rxNumber}</div>
                      </div>
                      <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize shrink-0", statusBadge(rx.status))}>
                        {rx.status}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[var(--muted)]">
                      <span><span className="font-medium text-[var(--foreground)]">Dosage:</span> {rx.dosage}</span>
                      <span><span className="font-medium text-[var(--foreground)]">Freq:</span> {rx.frequency}</span>
                      <span><span className="font-medium text-[var(--foreground)]">Duration:</span> {rx.duration}</span>
                      <span><span className="font-medium text-[var(--foreground)]">Issued:</span> {rx.issuedDate}</span>
                    </div>
                    {rx.notes && (
                      <p className="mt-2 text-[11px] text-[var(--muted)] italic border-t border-[var(--border)] pt-2">
                        {rx.notes}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleRxEdit(rx)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleRxDelete(rx.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)] hover:text-red-600 hover:border-red-300 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* ── New Plan Modal ── */}
        <AnimatePresence>
          {showNewPlan && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowNewPlan(false)}
              />
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">New Treatment Plan</h3>
                    <button
                      onClick={() => setShowNewPlan(false)}
                      className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Patient", placeholder: "Select or search patient" },
                      { label: "Procedure / Plan Name", placeholder: "e.g. Full Mouth Rehabilitation" },
                      { label: "Assigned Dentist", placeholder: "e.g. Dr. Amanda Lee" },
                      { label: "Start Date", placeholder: "YYYY-MM-DD" },
                      { label: "Estimated Completion", placeholder: "YYYY-MM-DD" },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-[var(--muted)] mb-1">{f.label}</label>
                        <input
                          type="text"
                          placeholder={f.placeholder}
                          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-5">
                    <button
                      onClick={() => setShowNewPlan(false)}
                      className="flex-1 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                    >
                      Create Plan
                    </button>
                    <button
                      onClick={() => setShowNewPlan(false)}
                      className="flex-1 rounded-xl border border-[var(--border)] py-2.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}