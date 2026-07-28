"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Activity, Download, Filter, ChevronDown, Star, AlertCircle, Check } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { staggerContainer, fadeInUp } from "@/lib/motion";

const MONTHLY_REVENUE = [
  { month: "Jan", revenue: 42000, expenses: 18000, profit: 24000 },
  { month: "Feb", revenue: 38500, expenses: 16500, profit: 22000 },
  { month: "Mar", revenue: 51000, expenses: 20000, profit: 31000 },
  { month: "Apr", revenue: 47200, expenses: 19200, profit: 28000 },
  { month: "May", revenue: 55800, expenses: 21000, profit: 34800 },
  { month: "Jun", revenue: 61000, expenses: 22500, profit: 38500 },
  { month: "Jul", revenue: 58400, expenses: 21800, profit: 36600 },
  { month: "Aug", revenue: 63200, expenses: 23000, profit: 40200 },
  { month: "Sep", revenue: 59700, expenses: 22200, profit: 37500 },
  { month: "Oct", revenue: 67500, expenses: 24000, profit: 43500 },
  { month: "Nov", revenue: 71200, expenses: 25500, profit: 45700 },
  { month: "Dec", revenue: 74800, expenses: 26000, profit: 48800 },
];

const APPOINTMENT_TRENDS = [
  { month: "Jan", completed: 210, cancelled: 18, noShow: 12 },
  { month: "Feb", completed: 195, cancelled: 22, noShow: 15 },
  { month: "Mar", completed: 248, cancelled: 14, noShow: 10 },
  { month: "Apr", completed: 231, cancelled: 19, noShow: 13 },
  { month: "May", completed: 267, cancelled: 11, noShow: 8 },
  { month: "Jun", completed: 289, cancelled: 16, noShow: 11 },
  { month: "Jul", completed: 274, cancelled: 20, noShow: 14 },
  { month: "Aug", completed: 302, cancelled: 13, noShow: 9 },
  { month: "Sep", completed: 285, cancelled: 17, noShow: 12 },
  { month: "Oct", completed: 318, cancelled: 15, noShow: 10 },
  { month: "Nov", completed: 334, cancelled: 12, noShow: 8 },
  { month: "Dec", completed: 351, cancelled: 10, noShow: 7 },
];

const PROCEDURE_BREAKDOWN = [
  { name: "Cleanings", value: 34, color: "#38bdf8" },
  { name: "Fillings", value: 22, color: "#818cf8" },
  { name: "Root Canals", value: 12, color: "#fb923c" },
  { name: "Extractions", value: 10, color: "#34d399" },
  { name: "Crowns", value: 9, color: "#f472b6" },
  { name: "Orthodontics", value: 8, color: "#facc15" },
  { name: "Other", value: 5, color: "#94a3b8" },
];

const PATIENT_ACQUISITION = [
  { month: "Jan", newPatients: 28, returning: 182 },
  { month: "Feb", newPatients: 24, returning: 171 },
  { month: "Mar", newPatients: 35, returning: 213 },
  { month: "Apr", newPatients: 31, returning: 200 },
  { month: "May", newPatients: 42, returning: 225 },
  { month: "Jun", newPatients: 48, returning: 241 },
  { month: "Jul", newPatients: 39, returning: 235 },
  { month: "Aug", newPatients: 52, returning: 250 },
  { month: "Sep", newPatients: 45, returning: 240 },
  { month: "Oct", newPatients: 58, returning: 260 },
  { month: "Nov", newPatients: 63, returning: 271 },
  { month: "Dec", newPatients: 71, returning: 280 },
];

const TOP_DENTISTS = [
  {
    id: "d1",
    name: "Dr. Sarah Chen",
    specialty: "General Dentistry",
    patients: 312,
    revenue: 94200,
    satisfaction: 4.9,
    appointments: 418,
    trend: "up",
  },
  {
    id: "d2",
    name: "Dr. Marcus Webb",
    specialty: "Orthodontics",
    patients: 248,
    revenue: 87600,
    satisfaction: 4.8,
    appointments: 356,
    trend: "up",
  },
  {
    id: "d3",
    name: "Dr. Priya Nair",
    specialty: "Endodontics",
    patients: 195,
    revenue: 72400,
    satisfaction: 4.7,
    appointments: 289,
    trend: "down",
  },
  {
    id: "d4",
    name: "Dr. James Okafor",
    specialty: "Oral Surgery",
    patients: 178,
    revenue: 68900,
    satisfaction: 4.8,
    appointments: 241,
    trend: "up",
  },
  {
    id: "d5",
    name: "Dr. Elena Vasquez",
    specialty: "Periodontics",
    patients: 156,
    revenue: 61200,
    satisfaction: 4.6,
    appointments: 214,
    trend: "down",
  },
];

const INSURANCE_SUMMARY = [
  { provider: "BlueCross BlueShield", claims: 142, approved: 128, pending: 10, denied: 4, amount: 38400 },
  { provider: "Aetna Dental", claims: 98, approved: 87, pending: 8, denied: 3, amount: 26700 },
  { provider: "Delta Dental", claims: 115, approved: 104, pending: 7, denied: 4, amount: 31200 },
  { provider: "Cigna", claims: 76, approved: 68, pending: 5, denied: 3, amount: 19800 },
  { provider: "MetLife", claims: 54, approved: 49, pending: 3, denied: 2, amount: 14600 },
];

const RANGE_OPTIONS = ["Last 30 days", "Last 90 days", "This Year", "Last Year"] as const;
type RangeOption = (typeof RANGE_OPTIONS)[number];

const KPI_STATS = [
  {
    label: "Total Revenue",
    value: "$689,300",
    change: "+14.2%",
    positive: true,
    icon: DollarSign,
    sub: "vs. last year",
  },
  {
    label: "Total Patients",
    value: "2,847",
    change: "+8.6%",
    positive: true,
    icon: Users,
    sub: "active patients",
  },
  {
    label: "Appointments",
    value: "3,304",
    change: "+11.3%",
    positive: true,
    icon: Calendar,
    sub: "completed this year",
  },
  {
    label: "Avg. Satisfaction",
    value: "4.76",
    change: "+0.12",
    positive: true,
    icon: Star,
    sub: "out of 5.0",
  },
  {
    label: "No-Show Rate",
    value: "3.8%",
    change: "-1.2%",
    positive: true,
    icon: AlertCircle,
    sub: "vs. 5.0% last year",
  },
  {
    label: "Collection Rate",
    value: "94.1%",
    change: "+2.3%",
    positive: true,
    icon: Activity,
    sub: "of billed amount",
  },
];

function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  sub: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)" }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/50">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)]/10">
          <Icon className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
        </span>
      </div>
      <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            positive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          )}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
          )}
          {change}
        </span>
        <span className="text-xs text-white/40">{sub}</span>
      </div>
    </motion.div>
  );
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "rgba(15,23,42,0.95)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  color: "#f1f5f9",
  fontSize: "13px",
};

export default function ReportsAnalyticsPage() {
  const t = useTranslations();
  const [selectedRange, setSelectedRange] = useState<RangeOption>("This Year");
  const [rangeOpen, setRangeOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* Page Header */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {t("reports.heading")}
              </h1>
              <p className="mt-1 text-sm text-white/50">{t("reports.subheading")}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Range selector */}
              <div className="relative">
                <button
                  onClick={() => setRangeOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.08]"
                  aria-haspopup="listbox"
                  aria-expanded={rangeOpen}
                >
                  <Filter className="h-4 w-4 text-white/40" aria-hidden="true" />
                  {selectedRange}
                  <ChevronDown className="h-4 w-4 text-white/40" aria-hidden="true" />
                </button>
                {rangeOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl border border-white/10 bg-[var(--surface)] py-1 shadow-xl">
                    {RANGE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setSelectedRange(opt); setRangeOpen(false); }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-white/[0.06]",
                          selectedRange === opt ? "text-[var(--accent)]" : "text-white/70"
                        )}
                      >
                        {selectedRange === opt && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--background)] transition-opacity hover:opacity-90">
                <Download className="h-4 w-4" aria-hidden="true" />
                {t("reports.export")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* KPI Stats Grid */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
          >
            {KPI_STATS.map((stat, i) => (
              <motion.div key={stat.label} variants={fadeInUp} custom={i}>
                <StatCard {...stat} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Revenue Chart + Procedure Breakdown */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-white">{t("reports.revenueChart.title")}</h2>
                  <p className="text-xs text-white/40">{t("reports.revenueChart.subtitle")}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={MONTHLY_REVENUE} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v: number) => [`$${v.toLocaleString("en-US")}`, ""]} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }} />
                  <Bar dataKey="revenue" name="Revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-white">{t("reports.procedureBreakdown.title")}</h2>
                <p className="text-xs text-white/40">{t("reports.procedureBreakdown.subtitle")}</p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={PROCEDURE_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {PROCEDURE_BREAKDOWN.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v: number) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="mt-2 space-y-1.5">
                {PROCEDURE_BREAKDOWN.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-white/60">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-medium text-white/80">{item.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* Appointment Trends + Patient Acquisition */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-white">{t("reports.appointmentTrends.title")}</h2>
                <p className="text-xs text-white/40">{t("reports.appointmentTrends.subtitle")}</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={APPOINTMENT_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }} />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--accent)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cancelled" name="Cancelled" stroke="#fb923c" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="noShow" name="No-Show" stroke="#f472b6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-white">{t("reports.patientAcquisition.title")}</h2>
                <p className="text-xs text-white/40">{t("reports.patientAcquisition.subtitle")}</p>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={PATIENT_ACQUISITION} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }} />
                  <Bar dataKey="newPatients" name="New Patients" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returning" name="Returning" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </div>

        {/* Top Performing Dentists */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">{t("reports.topDentists.title")}</h2>
                <p className="text-xs text-white/40">{t("reports.topDentists.subtitle")}</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colDentist")}</th>
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colSpecialty")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colPatients")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colAppointments")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colRevenue")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colSatisfaction")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.topDentists.colTrend")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {TOP_DENTISTS.map((dentist, i) => (
                    <motion.tr
                      key={dentist.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      className="group"
                    >
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                            {dentist.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-white">{dentist.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-white/50">{dentist.specialty}</td>
                      <td className="py-3.5 text-right text-white/80">{dentist.patients.toLocaleString("en-US")}</td>
                      <td className="py-3.5 text-right text-white/80">{dentist.appointments.toLocaleString("en-US")}</td>
                      <td className="py-3.5 text-right font-medium text-white">${dentist.revenue.toLocaleString("en-US")}</td>
                      <td className="py-3.5 text-right">
                        <span className="flex items-center justify-end gap-1 text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-400" aria-hidden="true" />
                          {dentist.satisfaction}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        {dentist.trend === "up" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                            <TrendingUp className="h-3 w-3" aria-hidden="true" /> Up
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-400">
                            <TrendingDown className="h-3 w-3" aria-hidden="true" /> Down
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Insurance Claims Summary */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <div className="mb-6">
              <h2 className="text-base font-semibold text-white">{t("reports.insuranceSummary.title")}</h2>
              <p className="text-xs text-white/40">{t("reports.insuranceSummary.subtitle")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colProvider")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colClaims")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colApproved")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colPending")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colDenied")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colAmount")}</th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-white/40">{t("reports.insuranceSummary.colApprovalRate")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INSURANCE_SUMMARY.map((row, i) => {
                    const approvalRate = Math.round((row.approved / row.claims) * 100);
                    return (
                      <motion.tr
                        key={row.provider}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                      >
                        <td className="py-3.5 font-medium text-white">{row.provider}</td>
                        <td className="py-3.5 text-right text-white/70">{row.claims}</td>
                        <td className="py-3.5 text-right text-emerald-400">{row.approved}</td>
                        <td className="py-3.5 text-right text-amber-400">{row.pending}</td>
                        <td className="py-3.5 text-right text-red-400">{row.denied}</td>
                        <td className="py-3.5 text-right font-medium text-white">${row.amount.toLocaleString("en-US")}</td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-[var(--accent)]"
                                style={{ width: `${approvalRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-white/60">{approvalRate}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Quick Insights */}
        <Reveal>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
            <h2 className="mb-5 text-base font-semibold text-white">{t("reports.insights.title")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                  titleKey: "reports.insights.revenueGrowth.title",
                  bodyKey: "reports.insights.revenueGrowth.body",
                },
                {
                  icon: Users,
                  color: "text-sky-400",
                  bg: "bg-sky-500/10",
                  titleKey: "reports.insights.patientRetention.title",
                  bodyKey: "reports.insights.patientRetention.body",
                },
                {
                  icon: AlertCircle,
                  color: "text-amber-400",
                  bg: "bg-amber-500/10",
                  titleKey: "reports.insights.noShowAlert.title",
                  bodyKey: "reports.insights.noShowAlert.body",
                },
              ].map((insight) => (
                <div
                  key={insight.titleKey}
                  className="flex gap-4 rounded-xl border border-white/6 bg-white/[0.02] p-4"
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", insight.bg)}>
                    <insight.icon className={cn("h-4 w-4", insight.color)} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{t(insight.titleKey)}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/50">{t(insight.bodyKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </div>
    </main>
  );
}