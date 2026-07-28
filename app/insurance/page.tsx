"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Shield, FileText, CheckCircle, XCircle, Clock, AlertCircle, Search, Filter, Plus, ChevronDown, Download, RefreshCw, Eye, Send, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { InsuranceClaim } from "@/lib/data";

const MOCK_CLAIMS: InsuranceClaim[] = [
  {
    id: "c1",
    claimNumber: "CLM-2024-0091",
    patientId: "p1",
    patientName: "Margaret Holloway",
    provider: "BlueCross BlueShield",
    submittedDate: "2024-06-01",
    amount: 1240.0,
    status: "approved",
    policyNumber: "BCB-774821",
  },
  {
    id: "c2",
    claimNumber: "CLM-2024-0092",
    patientId: "p2",
    patientName: "James Thornton",
    provider: "Aetna Dental",
    submittedDate: "2024-06-03",
    amount: 580.0,
    status: "pending",
    policyNumber: "AET-330192",
  },
  {
    id: "c3",
    claimNumber: "CLM-2024-0093",
    patientId: "p3",
    patientName: "Sofia Reyes",
    provider: "Delta Dental",
    submittedDate: "2024-05-28",
    amount: 2100.0,
    status: "denied",
    policyNumber: "DD-991043",
  },
  {
    id: "c4",
    claimNumber: "CLM-2024-0094",
    patientId: "p4",
    patientName: "David Kim",
    provider: "Cigna Dental",
    submittedDate: "2024-06-05",
    amount: 760.0,
    status: "submitted",
    policyNumber: "CIG-558820",
  },
  {
    id: "c5",
    claimNumber: "CLM-2024-0095",
    patientId: "p5",
    patientName: "Priya Nair",
    provider: "MetLife Dental",
    submittedDate: "2024-05-20",
    amount: 430.0,
    status: "approved",
    policyNumber: "MET-112934",
  },
  {
    id: "c6",
    claimNumber: "CLM-2024-0096",
    patientId: "p6",
    patientName: "Carlos Mendez",
    provider: "United Concordia",
    submittedDate: "2024-06-07",
    amount: 1890.0,
    status: "resubmitted",
    policyNumber: "UC-667741",
  },
  {
    id: "c7",
    claimNumber: "CLM-2024-0097",
    patientId: "p7",
    patientName: "Amelia Foster",
    provider: "BlueCross BlueShield",
    submittedDate: "2024-06-08",
    amount: 320.0,
    status: "pending",
    policyNumber: "BCB-882910",
  },
  {
    id: "c8",
    claimNumber: "CLM-2024-0098",
    patientId: "p8",
    patientName: "Noah Patel",
    provider: "Aetna Dental",
    submittedDate: "2024-05-15",
    amount: 3400.0,
    status: "approved",
    policyNumber: "AET-445566",
  },
];

const PROVIDERS = [
  "All Providers",
  "BlueCross BlueShield",
  "Aetna Dental",
  "Delta Dental",
  "Cigna Dental",
  "MetLife Dental",
  "United Concordia",
];

const STATUS_FILTERS = ["all", "pending", "submitted", "approved", "denied", "resubmitted"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; className: string; dot: string }
> = {
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  denied: {
    label: "Denied",
    icon: XCircle,
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    className: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    dot: "bg-sky-400",
  },
  resubmitted: {
    label: "Resubmitted",
    icon: RefreshCw,
    className: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    dot: "bg-violet-400",
  },
};

const SUMMARY_STATS = [
  {
    label: "Total Claims",
    value: "8",
    sub: "This month",
    icon: FileText,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    label: "Approved",
    value: "3",
    sub: "$4,970 recovered",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Pending Review",
    value: "2",
    sub: "$900 in queue",
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    label: "Denied",
    value: "1",
    sub: "Requires action",
    icon: AlertCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
];

const PROVIDER_BREAKDOWN = [
  { provider: "BlueCross BlueShield", claims: 2, amount: 1560, rate: 100 },
  { provider: "Aetna Dental", claims: 2, amount: 3980, rate: 50 },
  { provider: "Delta Dental", claims: 1, amount: 2100, rate: 0 },
  { provider: "Cigna Dental", claims: 1, amount: 760, rate: 0 },
  { provider: "MetLife Dental", claims: 1, amount: 430, rate: 100 },
  { provider: "United Concordia", claims: 1, amount: 1890, rate: 0 },
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    icon: Activity,
    className: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    dot: "bg-slate-400",
  };
  const Icon = cfg.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cfg.className
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

function ClaimDetailModal({
  claim,
  onClose,
}: {
  claim: InsuranceClaim;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--surface)] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-[var(--accent)]">
              Claim Details
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              {claim.claimNumber}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/8 hover:text-white"
            aria-label="Close"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { label: "Patient", value: claim.patientName },
            { label: "Insurance Provider", value: claim.provider },
            { label: "Policy Number", value: claim.policyNumber },
            { label: "Submitted Date", value: claim.submittedDate },
            {
              label: "Claim Amount",
              value: `$${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3"
            >
              <span className="text-sm text-white/50">{row.label}</span>
              <span className="text-sm font-medium text-white">{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl border border-white/6 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/50">Status</span>
            <StatusBadge status={claim.status} />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          {claim.status === "denied" && (
            <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">
              <RefreshCw className="h-4 w-4" />
              Resubmit Claim
            </button>
          )}
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/8">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function InsurancePage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providerFilter, setProviderFilter] = useState("All Providers");
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);

  const filtered = MOCK_CLAIMS.filter((c) => {
    const matchSearch =
      c.patientName.toLowerCase().includes(search.toLowerCase()) ||
      c.claimNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchProvider =
      providerFilter === "All Providers" || c.provider === providerFilter;
    return matchSearch && matchStatus && matchProvider;
  });

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Shield className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  {t("insurance.eyebrow")}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {t("insurance.heading")}
              </h1>
              <p className="mt-1 text-sm text-white/50">
                {t("insurance.subheading")}
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(var(--accent-rgb),0.25)] transition-all hover:opacity-90 hover:shadow-[0_0_28px_rgba(var(--accent-rgb),0.4)]">
              <Plus className="h-4 w-4" />
              {t("insurance.newClaim")}
            </button>
          </div>
        </Reveal>

        {/* Summary Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {SUMMARY_STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_8px_24px_-8px_rgba(0,0,0,0.2)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-white/50">{stat.label}</p>
                    <p className="mt-1.5 text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/40">{stat.sub}</p>
                  </div>
                  <div className={cn("rounded-xl p-2.5", stat.bg)}>
                    <Icon className={cn("h-5 w-5", stat.color)} aria-hidden="true" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Provider Breakdown */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.18)]">
            <div className="mb-5 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-white">
                {t("insurance.providerBreakdown")}
              </h2>
            </div>
            <div className="space-y-3">
              {PROVIDER_BREAKDOWN.map((pb) => (
                <div key={pb.provider} className="flex items-center gap-4">
                  <div className="w-36 shrink-0 truncate text-xs text-white/60">
                    {pb.provider}
                  </div>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full bg-[var(--accent)]"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pb.rate}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        style={{ minWidth: pb.rate > 0 ? "4px" : "0" }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-xs font-medium text-white/70">
                    ${pb.amount.toLocaleString("en-US")}
                  </div>
                  <div className="w-16 text-right text-xs text-white/40">
                    {pb.claims} claim{pb.claims !== 1 ? "s" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Filters & Search */}
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" aria-hidden="true" />
              <input
                type="text"
                placeholder={t("insurance.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--accent)]/50 focus:bg-white/[0.06]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status Filters */}
              <div className="flex items-center gap-1 rounded-xl border border-white/8 bg-white/[0.03] p-1">
                {STATUS_FILTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                      statusFilter === s
                        ? "bg-[var(--accent)] text-black shadow"
                        : "text-white/50 hover:text-white"
                    )}
                  >
                    {s === "all" ? t("insurance.filterAll") : s}
                  </button>
                ))}
              </div>

              {/* Provider Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProviderDropdown((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/8"
                >
                  <Filter className="h-3.5 w-3.5" aria-hidden="true" />
                  {providerFilter === "All Providers" ? t("insurance.allProviders") : providerFilter}
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {showProviderDropdown && (
                  <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-xl border border-white/10 bg-[var(--surface)] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                    {PROVIDERS.map((p) => (
                      <button
                        key={p}
                        onClick={() => {
                          setProviderFilter(p);
                          setShowProviderDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-xs transition-colors hover:bg-white/8",
                          providerFilter === p ? "text-[var(--accent)]" : "text-white/70"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Claims Table */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.18)]">
            <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
              <h2 className="text-sm font-semibold text-white">
                {t("insurance.claimsTable")}
                <span className="ml-2 rounded-full bg-white/8 px-2 py-0.5 text-xs font-normal text-white/50">
                  {filtered.length}
                </span>
              </h2>
              <button className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/8">
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                {t("insurance.export")}
              </button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/6">
                    {[
                      t("insurance.col.claimNo"),
                      t("insurance.col.patient"),
                      t("insurance.col.provider"),
                      t("insurance.col.policy"),
                      t("insurance.col.submitted"),
                      t("insurance.col.amount"),
                      t("insurance.col.status"),
                      t("insurance.col.actions"),
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/30"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-sm text-white/30">
                        {t("insurance.noResults")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((claim) => (
                      <motion.tr
                        key={claim.id}
                        className="group transition-colors hover:bg-white/[0.025]"
                        whileHover={{ x: 1 }}
                        transition={{ duration: 0.15 }}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-[var(--accent)]">
                          {claim.claimNumber}
                        </td>
                        <td className="px-5 py-4 font-medium text-white">
                          {claim.patientName}
                        </td>
                        <td className="px-5 py-4 text-white/60">{claim.provider}</td>
                        <td className="px-5 py-4 font-mono text-xs text-white/50">
                          {claim.policyNumber}
                        </td>
                        <td className="px-5 py-4 text-white/50">{claim.submittedDate}</td>
                        <td className="px-5 py-4 font-semibold text-white">
                          ${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={claim.status} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedClaim(claim)}
                              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/8 hover:text-white"
                              aria-label={`View claim ${claim.claimNumber}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {claim.status === "denied" && (
                              <button
                                className="rounded-lg p-1.5 text-amber-400/60 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                                aria-label={`Resubmit claim ${claim.claimNumber}`}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              className="rounded-lg p-1.5 text-white/30 transition-colors hover:bg-white/8 hover:text-white"
                              aria-label={`Download claim ${claim.claimNumber}`}
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-white/6 md:hidden">
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-sm text-white/30">
                  {t("insurance.noResults")}
                </div>
              ) : (
                filtered.map((claim) => (
                  <div key={claim.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-mono text-xs text-[var(--accent)]">
                          {claim.claimNumber}
                        </p>
                        <p className="mt-0.5 font-medium text-white">{claim.patientName}</p>
                        <p className="text-xs text-white/50">{claim.provider}</p>
                      </div>
                      <StatusBadge status={claim.status} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        ${claim.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 transition-colors hover:bg-white/8"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {t("insurance.view")}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Reveal>

        {/* Quick Actions */}
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Send,
                title: t("insurance.action.submit.title"),
                desc: t("insurance.action.submit.desc"),
                accent: true,
              },
              {
                icon: DollarSign,
                title: t("insurance.action.reconcile.title"),
                desc: t("insurance.action.reconcile.desc"),
                accent: false,
              },
              {
                icon: FileText,
                title: t("insurance.action.report.title"),
                desc: t("insurance.action.report.desc"),
                accent: false,
              },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.title}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all",
                    action.accent
                      ? "border-[var(--accent)]/30 bg-[var(--accent)]/5 hover:bg-[var(--accent)]/10"
                      : "border-white/8 bg-white/[0.03] hover:bg-white/[0.06]"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-xl p-2.5",
                      action.accent ? "bg-[var(--accent)]/15" : "bg-white/8"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        action.accent ? "text-[var(--accent)]" : "text-white/60"
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        action.accent ? "text-[var(--accent)]" : "text-white"
                      )}
                    >
                      {action.title}
                    </p>
                    <p className="mt-0.5 text-xs text-white/50">{action.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </main>
  );
}