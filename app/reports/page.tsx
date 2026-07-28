"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, FileText, Download, Filter, ChevronDown, Activity, Star, Clock, CheckCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 42000, expenses: 18000, profit: 24000 },
  { month: "Feb", revenue: 38500, expenses: 16500, profit: 22000 },
  { month: "Mar", revenue: 51000, expenses: 20000, profit: 31000 },
  { month: "Apr", revenue: 47200, expenses: 19200, profit: 28000 },
  { month: "May", revenue: 55800, expenses: 21000, profit: 34800 },
  { month: "Jun", revenue: 61000, expenses: 22500, profit: 38500 },
  { month: "Jul", revenue: 58400, expenses: 21800, profit: 36600 },
  { month: "Aug", revenue: 63200, expenses: 23000, profit: 40200 },
  { month: "Sep", revenue: 59700, expenses: 22100, profit: 37600 },
  { month: "Oct", revenue: 67500, expenses: 24500, profit: 43000 },
  { month: "Nov", revenue: 71200, expenses: 25800, profit: 45400 },
  { month: "Dec", revenue: 74800, expenses: 26200, profit: 48600 },
];

const APPOINTMENT_TRENDS = [
  { month: "Jan", completed: 210, cancelled: 18, noShow: 12 },
  { month: "Feb", completed: 195, cancelled: 22, noShow: 9 },
  { month: "Mar", completed: 248, cancelled: 15, noShow: 11 },
  { month: "Apr", completed: 231, cancelled: 19, noShow: 14 },
  { month: "May", completed: 267, cancelled: 13, noShow: 8 },
  { month: "Jun", completed: 289, cancelled: 17, noShow: 10 },
  { month: "Jul", completed: 275, cancelled: 21, noShow: 13 },
  { month: "Aug", completed: 302, cancelled: 14, noShow: 7 },
  { month: "Sep", completed: 284, cancelled: 18, noShow: 11 },
  { month: "Oct", completed: 318, cancelled: 12, noShow: 9 },
  { month: "Nov", completed: 334, cancelled: 16, noShow: 8 },
  { month: "Dec", completed: 351, cancelled: 11, noShow: 6 },
];

const PROCEDURE_DISTRIBUTION = [
  { name: "Cleaning & Hygiene", value: 32, color: "#0ea5e9" },
  { name: "Fillings", value: 21, color: "#6366f1" },
  { name: "Root Canal", value: 12, color: "#f59e0b" },
  { name: "Orthodontics", value: 18, color: "#10b981" },
  { name: "Extractions", value: 9, color: "#ef4444" },
  { name: "Crowns & Bridges", value: 8, color: "#8b5cf6" },
];

const DENTIST_PERFORMANCE = [
  { name: "Dr. Sarah Chen", patients: 142, revenue: 89400, satisfaction: 4.9, appointments: 318 },
  { name: "Dr. Marcus Webb", patients: 118, revenue: 74200, satisfaction: 4.7, appointments: 264 },
  { name: "Dr. Priya Nair", patients: 97, revenue: 61800, satisfaction: 4.8, appointments: 218 },
  { name: "Dr. James Okafor", patients: 83, revenue: 52500, satisfaction: 4.6, appointments: 186 },
];

const PATIENT_ACQUISITION = [
  { month: "Jan", newPatients: 34, returning: 176 },
  { month: "Feb", newPatients: 28, returning: 167 },
  { month: "Mar", newPatients: 41, returning: 207 },
  { month: "Apr", newPatients: 37, returning: 194 },
  { month: "May", newPatients: 45, returning: 222 },
  { month: "Jun", newPatients: 52, returning: 237 },
  { month: "Jul", newPatients: 48, returning: 227 },
  { month: "Aug", newPatients: 56, returning: 246 },
  { month: "Sep", newPatients: 49, returning: 235 },
  { month: "Oct", newPatients: 61, returning: 257 },
  { month: "Nov", newPatients: 67, returning: 267 },
  { month: "Dec", newPatients: 72, returning: 279 },
];

const INSURANCE_SUMMARY = [
  { provider: "BlueCross BlueShield", claims: 184, approved: 171, pending: 9, denied: 4, amount: 128400 },
  { provider: "Aetna Dental", claims: 142, approved: 131, pending: 7, denied: 4, amount: 98700 },
  { provider: "Delta Dental", claims: 118, approved: 112, pending: 4, denied: 2, amount: 82100 },
  { provider: "Cigna", claims: 96, approved: 88, pending: 5, denied: 3, amount: 67300 },
  { provider: "MetLife", claims: 74, approved: 69, pending: 3, denied: 2, amount: 51800 },
];

const SUMMARY_STATS = [
  {
    label: "Total Revenue",
    value: "$689,400",
    change: "+14.2%",
    positive: true,
    icon: DollarSign,
    sub: "vs. last year",
  },
  {
    label: "Total Patients",
    value: "1,847",
    change: "+8.6%",
    positive: true,
    icon: Users,
    sub: "active patients",
  },
  {
    label: "Appointments",
    value: "3,104",
    change: "+11.3%",
    positive: true,
    icon: Calendar,
    sub: "completed this year",
  },
  {
    label: "Avg. Satisfaction",
    value: "4.75",
    change: "+0.12",
    positive: true,
    icon: Star,
    sub: "out of 5.0",
  },
  {
    label: "Cancellation Rate",
    value: "5.4%",
    change: "-1.8%",
    positive: true,
    icon: Clock,
    sub: "vs. 7.2% last year",
  },
  {
    label: "Insurance Claims",
    value: "614",
    change: "93.2% approved",
    positive: true,
    icon: FileText,
    sub: "submitted this year",
  },
];

const REPORT_PERIODS = ["This Year", "Last 6 Months", "Last Quarter", "Last Month"] as const;
type ReportPeriod = (typeof REPORT_PERIODS)[number];

const CUSTOM_TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "var(--foreground)",
  fontSize: "13px",
};

export default function ReportsPage() {
  const t = useTranslations();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("This Year");
  const [periodOpen, setPeriodOpen] = useState(false);

  const totalRevenue = MONTHLY_REVENUE.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = MONTHLY_REVENUE.reduce((s, m) => s + m.profit, 0);
  const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Header */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                {t("reports.title")}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {t("reports.subtitle")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Period Selector */}
              <div className="relative">
                <button
                  onClick={() => setPeriodOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[var(--foreground)] transition-all hover:bg-white/10"
                >
                  <Filter className="h-4 w-4 text-[var(--muted)]" />
                  {selectedPeriod}
                  <ChevronDown className={cn("h-4 w-4 text-[var(--muted)] transition-transform", periodOpen && "rotate-180")} />
                </button>
                {periodOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[var(--surface)] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    {REPORT_PERIODS.map((p) => (
                      <button
                        key={p}
                        onClick={() => { setSelectedPeriod(p); setPeriodOpen(false); }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm transition-colors hover:bg-white/5",
                          selectedPeriod === p ? "text-[var(--accent)] font-medium" : "text-[var(--foreground)]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95">
                <Download className="h-4 w-4" />
                {t("reports.exportBtn")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Summary Stats Grid */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {SUMMARY_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                    <span
                      className={cn(
                        "flex items-center gap-0.5 text-xs font-medium",
                        stat.positive ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-[var(--foreground)]">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-[var(--muted)]">{stat.label}</div>
                  <div className="mt-0.5 text-[10px] text-[var(--muted)]/60">{stat.sub}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </Reveal>

        {/* Revenue Chart + Profit Margin */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[var(--foreground)]">{t("reports.revenueChart.title")}</h2>
                  <p className="text-xs text-[var(--muted)]">{t("reports.revenueChart.subtitle")}</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400">+14.2%</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={MONTHLY_REVENUE} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="rgba(239,68,68,0.5)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="rgba(16,185,129,0.6)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal>
            <div className="flex h-full flex-col gap-4">
              {/* Profit Margin Card */}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <h3 className="mb-1 text-sm font-semibold text-[var(--foreground)]">{t("reports.profitMargin.title")}</h3>
                <p className="text-xs text-[var(--muted)]">{t("reports.profitMargin.subtitle")}</p>
                <div className="mt-4 text-5xl font-bold text-[var(--accent)]">{profitMargin}%</div>
                <div className="mt-1 text-xs text-[var(--muted)]">
                  ${totalProfit.toLocaleString("en-US")} net of ${totalRevenue.toLocaleString("en-US")} gross
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${profitMargin}%` }}
                  />
                </div>
              </div>

              {/* Procedure Distribution Pie */}
              <div className="flex-1 rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
                <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">{t("reports.procedureMix.title")}</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie
                      data={PROCEDURE_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {PROCEDURE_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                  {PROCEDURE_DISTRIBUTION.map((p) => (
                    <div key={p.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <span className="truncate text-[10px] text-[var(--muted)]">{p.name}</span>
                      <span className="ml-auto text-[10px] font-medium text-[var(--foreground)]">{p.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Appointment Trends + Patient Acquisition */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[var(--foreground)]">{t("reports.appointmentTrends.title")}</h2>
                <p className="text-xs text-[var(--muted)]">{t("reports.appointmentTrends.subtitle")}</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={APPOINTMENT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="noShow" name="No-Show" stroke="#ef4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-[var(--foreground)]">{t("reports.patientAcquisition.title")}</h2>
                <p className="text-xs text-[var(--muted)]">{t("reports.patientAcquisition.subtitle")}</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={PATIENT_ACQUISITION} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CUSTOM_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12, color: "var(--muted)" }} />
                  <Bar dataKey="newPatients" name="New Patients" fill="var(--accent)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" fill="rgba(99,102,241,0.6)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>

        {/* Dentist Performance Table */}
        <Reveal>
          <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">{t("reports.dentistPerformance.title")}</h2>
                <p className="text-xs text-[var(--muted)]">{t("reports.dentistPerformance.subtitle")}</p>
              </div>
              <Activity className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.dentistPerformance.colDentist")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.dentistPerformance.colPatients")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.dentistPerformance.colAppointments")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.dentistPerformance.colRevenue")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.dentistPerformance.colSatisfaction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {DENTIST_PERFORMANCE.map((d, i) => (
                    <tr key={d.name} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                            {d.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-[var(--foreground)]">{d.name}</span>
                          {i === 0 && (
                            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                              Top Performer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-right text-[var(--foreground)]">{d.patients}</td>
                      <td className="py-3.5 text-right text-[var(--foreground)]">{d.appointments}</td>
                      <td className="py-3.5 text-right font-medium text-[var(--foreground)]">
                        ${d.revenue.toLocaleString("en-US")}
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                          <span className="font-semibold text-[var(--foreground)]">{d.satisfaction}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Insurance Claims Summary */}
        <Reveal>
          <div className="mb-8 rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">{t("reports.insuranceSummary.title")}</h2>
                <p className="text-xs text-[var(--muted)]">{t("reports.insuranceSummary.subtitle")}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colProvider")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colClaims")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colApproved")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colPending")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colDenied")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colAmount")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-[var(--muted)]">{t("reports.insuranceSummary.colRate")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INSURANCE_SUMMARY.map((ins) => {
                    const approvalRate = ((ins.approved / ins.claims) * 100).toFixed(0);
                    return (
                      <tr key={ins.provider} className="group transition-colors hover:bg-white/[0.02]">
                        <td className="py-3.5 font-medium text-[var(--foreground)]">{ins.provider}</td>
                        <td className="py-3.5 text-right text-[var(--foreground)]">{ins.claims}</td>
                        <td className="py-3.5 text-right text-emerald-400">{ins.approved}</td>
                        <td className="py-3.5 text-right text-amber-400">{ins.pending}</td>
                        <td className="py-3.5 text-right text-red-400">{ins.denied}</td>
                        <td className="py-3.5 text-right font-medium text-[var(--foreground)]">
                          ${ins.amount.toLocaleString("en-US")}
                        </td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-emerald-400"
                                style={{ width: `${approvalRate}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-emerald-400">{approvalRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Quick Export Cards */}
        <Reveal>
          <div>
            <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">{t("reports.quickExports.title")}</h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {[
                { label: t("reports.quickExports.financial"), desc: t("reports.quickExports.financialDesc"), icon: DollarSign, color: "text-sky-400" },
                { label: t("reports.quickExports.patient"), desc: t("reports.quickExports.patientDesc"), icon: Users, color: "text-indigo-400" },
                { label: t("reports.quickExports.appointment"), desc: t("reports.quickExports.appointmentDesc"), icon: Calendar, color: "text-amber-400" },
                { label: t("reports.quickExports.insurance"), desc: t("reports.quickExports.insuranceDesc"), icon: FileText, color: "text-emerald-400" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.label}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all hover:border-white/15 hover:bg-white/[0.06]"
                  >
                    <div className={cn("mt-0.5 rounded-xl bg-white/5 p-2.5", item.color)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--foreground)]">{item.label}</div>
                      <div className="mt-0.5 text-xs text-[var(--muted)]">{item.desc}</div>
                    </div>
                    <Download className="h-4 w-4 flex-shrink-0 text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}