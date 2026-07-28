"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Calendar, Users, DollarSign, FileText, TrendingUp, TrendingDown, Clock, CheckCircle, UserPlus, Plus, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Inline mock data ────────────────────────────────────────────────────────

const MONTHLY_DATA = [
  { month: "Jan", revenue: 42000, visits: 210 },
  { month: "Feb", revenue: 38500, visits: 195 },
  { month: "Mar", revenue: 51200, visits: 248 },
  { month: "Apr", revenue: 47800, visits: 231 },
  { month: "May", revenue: 55300, visits: 267 },
  { month: "Jun", revenue: 61000, visits: 290 },
  { month: "Jul", revenue: 58400, visits: 278 },
  { month: "Aug", revenue: 63700, visits: 305 },
  { month: "Sep", revenue: 59100, visits: 284 },
  { month: "Oct", revenue: 67200, visits: 318 },
  { month: "Nov", revenue: 71500, visits: 340 },
  { month: "Dec", revenue: 74800, visits: 356 },
];

const UPCOMING_APPOINTMENTS = [
  {
    id: "a1",
    patient: "Sarah Mitchell",
    initials: "SM",
    time: "09:00 AM",
    procedure: "Root Canal",
    dentist: "Dr. Chen",
    status: "confirmed",
    color: "bg-violet-500",
  },
  {
    id: "a2",
    patient: "James Okafor",
    initials: "JO",
    time: "10:30 AM",
    procedure: "Teeth Whitening",
    dentist: "Dr. Patel",
    status: "confirmed",
    color: "bg-sky-500",
  },
  {
    id: "a3",
    patient: "Linda Zhao",
    initials: "LZ",
    time: "11:15 AM",
    procedure: "Dental Cleaning",
    dentist: "Dr. Chen",
    status: "pending",
    color: "bg-emerald-500",
  },
  {
    id: "a4",
    patient: "Marcus Webb",
    initials: "MW",
    time: "01:00 PM",
    procedure: "Crown Fitting",
    dentist: "Dr. Rivera",
    status: "confirmed",
    color: "bg-amber-500",
  },
  {
    id: "a5",
    patient: "Priya Nair",
    initials: "PN",
    time: "02:30 PM",
    procedure: "Orthodontic Review",
    dentist: "Dr. Patel",
    status: "pending",
    color: "bg-rose-500",
  },
  {
    id: "a6",
    patient: "Tom Erikson",
    initials: "TE",
    time: "04:00 PM",
    procedure: "X-Ray & Consultation",
    dentist: "Dr. Rivera",
    status: "confirmed",
    color: "bg-indigo-500",
  },
];

const ACTIVITY_FEED = [
  {
    id: "ev1",
    type: "registration",
    icon: UserPlus,
    color: "text-sky-500 bg-sky-500/10",
    title: "New patient registered",
    description: "Emily Hartman joined as a new patient under Dr. Chen.",
    time: "8 min ago",
  },
  {
    id: "ev2",
    type: "treatment",
    icon: CheckCircle,
    color: "text-emerald-500 bg-emerald-500/10",
    title: "Treatment completed",
    description: "Root canal for James Okafor marked complete by Dr. Patel.",
    time: "42 min ago",
  },
  {
    id: "ev3",
    type: "invoice",
    icon: DollarSign,
    color: "text-violet-500 bg-violet-500/10",
    title: "Invoice paid",
    description: "Invoice #INV-2024-0891 for $1,240 settled by Linda Zhao.",
    time: "1 hr ago",
  },
  {
    id: "ev4",
    type: "appointment",
    icon: Calendar,
    color: "text-amber-500 bg-amber-500/10",
    title: "Appointment rescheduled",
    description: "Marcus Webb moved his crown fitting to 1:00 PM today.",
    time: "2 hr ago",
  },
  {
    id: "ev5",
    type: "claim",
    icon: FileText,
    color: "text-rose-500 bg-rose-500/10",
    title: "Insurance claim approved",
    description: "Claim #CLM-7742 for Priya Nair approved by BlueCross for $860.",
    time: "3 hr ago",
  },
  {
    id: "ev6",
    type: "alert",
    icon: AlertCircle,
    color: "text-orange-500 bg-orange-500/10",
    title: "Overdue invoice alert",
    description: "Invoice #INV-2024-0874 for Tom Erikson is 7 days overdue.",
    time: "5 hr ago",
  },
];

const KPI_CARDS = [
  {
    id: "kpi1",
    label: "Today's Appointments",
    value: "24",
    trend: "+3 vs yesterday",
    up: true,
    icon: Calendar,
    accent: "text-sky-500",
    bg: "bg-sky-500/10",
    href: "/appointments",
  },
  {
    id: "kpi2",
    label: "Active Patients",
    value: "1,847",
    trend: "+12 this week",
    up: true,
    icon: Users,
    accent: "text-violet-500",
    bg: "bg-violet-500/10",
    href: "/patients",
  },
  {
    id: "kpi3",
    label: "Monthly Revenue",
    value: "$74,800",
    trend: "+8.2% vs last month",
    up: true,
    icon: DollarSign,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    href: "/billing",
  },
  {
    id: "kpi4",
    label: "Pending Claims",
    value: "18",
    trend: "-4 since Monday",
    up: false,
    icon: FileText,
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    href: "/insurance",
  },
];

const QUICK_ACTIONS = [
  {
    id: "qa1",
    label: "New Patient",
    icon: UserPlus,
    href: "/patients",
    color: "bg-sky-500 hover:bg-sky-600",
  },
  {
    id: "qa2",
    label: "Book Appointment",
    icon: Calendar,
    href: "/appointments",
    color: "bg-violet-500 hover:bg-violet-600",
  },
  {
    id: "qa3",
    label: "Create Invoice",
    icon: FileText,
    href: "/billing",
    color: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    id: "qa4",
    label: "Add Treatment",
    icon: Plus,
    href: "/treatments",
    color: "bg-amber-500 hover:bg-amber-600",
  },
];

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  completed: "bg-sky-100 text-sky-700",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--surface)] p-3 shadow-xl text-sm">
      <p className="font-semibold text-[var(--foreground)] mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--muted)]">{p.name}:</span>
          <span className="font-medium text-[var(--foreground)]">
            {p.name === "Revenue" ? `$${p.value.toLocaleString("en-US")}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const t = useTranslations();
  const [activeChart, setActiveChart] = useState<"revenue" | "visits">("revenue");

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8 lg:px-12">
      {/* Page header */}
      <Reveal>
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] md:text-3xl">
              {t("dashboard.title")}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("dashboard.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span>{t("dashboard.systemStatus")}</span>
          </div>
        </div>
      </Reveal>

      {/* ── Section 1: KPI Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.id} variants={fadeInUp}>
              <Link href={card.href} className="block group">
                <div className="rounded-2xl border border-white/8 bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.2)] hover:-translate-y-0.5">
                  <div className="flex items-start justify-between">
                    <div className={cn("rounded-xl p-2.5", card.bg)}>
                      <Icon className={cn("h-5 w-5", card.accent)} />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                      {card.value}
                    </div>
                    <div className="mt-0.5 text-sm text-[var(--muted)]">{card.label}</div>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs">
                    {card.up ? (
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                    )}
                    <span className={card.up ? "text-emerald-600" : "text-rose-600"}>
                      {card.trend}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Section 2: Chart + Upcoming Appointments ── */}
      <Reveal className="mb-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Chart — 60% */}
          <div className="lg:col-span-3 rounded-2xl border border-white/8 bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  {t("dashboard.chart.title")}
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">{t("dashboard.chart.subtitle")}</p>
              </div>
              <div className="flex gap-2">
                {(["revenue", "visits"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                      activeChart === tab
                        ? "bg-[var(--accent)] text-white"
                        : "bg-white/5 text-[var(--muted)] hover:bg-white/10"
                    )}
                  >
                    {tab === "revenue" ? t("dashboard.chart.revenue") : t("dashboard.chart.visits")}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    activeChart === "revenue" ? `$${(v / 1000).toFixed(0)}k` : String(v)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                {activeChart === "revenue" ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#gradRevenue)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#6366f1" }}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="visits"
                    name="Visits"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    fill="url(#gradVisits)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#0ea5e9" }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming Appointments — 40% */}
          <div className="lg:col-span-2 rounded-2xl border border-white/8 bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                {t("dashboard.appointments.title")}
              </h2>
              <Link
                href="/appointments"
                className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                {t("dashboard.appointments.viewAll")}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
              {UPCOMING_APPOINTMENTS.map((appt) => (
                <motion.div
                  key={appt.id}
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors duration-200"
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                      appt.color
                    )}
                  >
                    {appt.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[var(--foreground)]">
                      {appt.patient}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-3 w-3 text-[var(--muted)]" />
                      <span className="text-xs text-[var(--muted)]">{appt.time}</span>
                      <span className="text-xs text-[var(--muted)]">·</span>
                      <span className="text-xs text-[var(--muted)] truncate">{appt.dentist}</span>
                    </div>
                    <div className="mt-1 text-xs text-[var(--muted)] truncate">{appt.procedure}</div>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                      STATUS_BADGE[appt.status] ?? "bg-gray-100 text-gray-600"
                    )}
                  >
                    {appt.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── Section 3: Activity Feed ── */}
      <Reveal className="mb-8">
        <div className="rounded-2xl border border-white/8 bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {t("dashboard.activity.title")}
            </h2>
            <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
              {t("dashboard.activity.today")}
            </span>
          </div>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-white/8" />
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="space-y-5"
            >
              {ACTIVITY_FEED.map((event) => {
                const Icon = event.icon;
                return (
                  <motion.li key={event.id} variants={fadeInUp} className="flex gap-4 pl-1">
                    <div
                      className={cn(
                        "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                        event.color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm font-medium text-[var(--foreground)]">
                          {event.title}
                        </span>
                        <span className="text-xs text-[var(--muted)]">{event.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </Reveal>

      {/* ── Section 4: Quick Actions ── */}
      <Reveal>
        <div className="rounded-2xl border border-white/8 bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)]">
          <h2 className="mb-4 text-base font-semibold text-[var(--foreground)]">
            {t("dashboard.quickActions.title")}
          </h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div key={action.id} variants={fadeInUp}>
                  <Link href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 rounded-xl p-5 text-white transition-all duration-200 cursor-pointer",
                        action.color
                      )}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-semibold text-center leading-tight">
                        {action.label}
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Reveal>
    </main>
  );
}