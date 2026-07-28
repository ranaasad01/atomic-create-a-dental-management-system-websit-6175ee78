"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Clock, AlertCircle, Search, Filter, Plus, Download, Eye, ChevronDown, Check, X, TrendingUp, CreditCard } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import type { Invoice } from "@/lib/data";

// ── Inline mock data ──────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceWithItems extends Invoice {
  items: LineItem[];
}

const INVOICES: InvoiceWithItems[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-0041",
    patientId: "p-001",
    patientName: "Margaret Holloway",
    date: "2024-06-01",
    dueDate: "2024-06-15",
    amount: 1240.0,
    paid: 1240.0,
    status: "paid",
    items: [
      { id: "li-1", description: "Dental Crown (Porcelain)", quantity: 1, unitPrice: 950.0, total: 950.0 },
      { id: "li-2", description: "X-Ray (Full Mouth)", quantity: 1, unitPrice: 180.0, total: 180.0 },
      { id: "li-3", description: "Consultation", quantity: 1, unitPrice: 110.0, total: 110.0 },
    ],
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-0042",
    patientId: "p-002",
    patientName: "James Whitfield",
    date: "2024-06-03",
    dueDate: "2024-06-17",
    amount: 580.0,
    paid: 0,
    status: "pending",
    items: [
      { id: "li-4", description: "Root Canal Treatment", quantity: 1, unitPrice: 480.0, total: 480.0 },
      { id: "li-5", description: "Temporary Filling", quantity: 1, unitPrice: 100.0, total: 100.0 },
    ],
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-0039",
    patientId: "p-003",
    patientName: "Sophia Brennan",
    date: "2024-05-20",
    dueDate: "2024-06-03",
    amount: 320.0,
    paid: 0,
    status: "overdue",
    items: [
      { id: "li-6", description: "Teeth Whitening (In-Office)", quantity: 1, unitPrice: 280.0, total: 280.0 },
      { id: "li-7", description: "Fluoride Treatment", quantity: 1, unitPrice: 40.0, total: 40.0 },
    ],
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-0043",
    patientId: "p-004",
    patientName: "Daniel Okafor",
    date: "2024-06-05",
    dueDate: "2024-06-19",
    amount: 760.0,
    paid: 760.0,
    status: "paid",
    items: [
      { id: "li-8", description: "Dental Implant (Single)", quantity: 1, unitPrice: 650.0, total: 650.0 },
      { id: "li-9", description: "Post-Op Consultation", quantity: 1, unitPrice: 110.0, total: 110.0 },
    ],
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-0044",
    patientId: "p-005",
    patientName: "Claire Nguyen",
    date: "2024-06-07",
    dueDate: "2024-06-21",
    amount: 210.0,
    paid: 0,
    status: "draft",
    items: [
      { id: "li-10", description: "Routine Cleaning & Polish", quantity: 1, unitPrice: 120.0, total: 120.0 },
      { id: "li-11", description: "Bitewing X-Rays (2)", quantity: 2, unitPrice: 45.0, total: 90.0 },
    ],
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2024-0040",
    patientId: "p-006",
    patientName: "Robert Castillo",
    date: "2024-05-28",
    dueDate: "2024-06-11",
    amount: 1850.0,
    paid: 925.0,
    status: "pending",
    items: [
      { id: "li-12", description: "Orthodontic Braces (Initial)", quantity: 1, unitPrice: 1600.0, total: 1600.0 },
      { id: "li-13", description: "Retainer (Upper)", quantity: 1, unitPrice: 250.0, total: 250.0 },
    ],
  },
];

const REVENUE_DATA = [
  { month: "Jan", revenue: 18400, collected: 16200 },
  { month: "Feb", revenue: 21300, collected: 19800 },
  { month: "Mar", revenue: 19700, collected: 18100 },
  { month: "Apr", revenue: 24500, collected: 22900 },
  { month: "May", revenue: 22100, collected: 20400 },
  { month: "Jun", revenue: 26800, collected: 24100 },
];

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  paid: { badge: "bg-emerald-100 text-emerald-700", label: "Paid" },
  pending: { badge: "bg-amber-100 text-amber-700", label: "Pending" },
  overdue: { badge: "bg-red-100 text-red-700", label: "Overdue" },
  draft: { badge: "bg-slate-100 text-slate-600", label: "Draft" },
};

const FILTER_OPTIONS = ["All", "Paid", "Pending", "Overdue", "Draft"] as const;
type FilterOption = (typeof FILTER_OPTIONS)[number];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)" }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            accent ? "bg-[var(--accent)]/15" : "bg-[var(--primary)]/10"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${accent ? "text-[var(--accent)]" : "text-[var(--primary)]"}`}
          />
        </div>
        <TrendingUp className="h-4 w-4 text-emerald-500" />
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-[var(--foreground)]">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-[var(--muted)]">{label}</p>
      <p className="mt-1 text-xs text-[var(--muted)]/70">{sub}</p>
    </motion.div>
  );
}

function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: InvoiceWithItems;
  onClose: () => void;
}) {
  const s = STATUS_STYLES[invoice.status];
  const balance = invoice.amount - invoice.paid;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[var(--border)] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Invoice
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-[var(--foreground)]">
              {invoice.invoiceNumber}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{invoice.patientName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.badge}`}>
              {s.label}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 border-b border-[var(--border)] px-6 py-4">
          <div>
            <p className="text-xs text-[var(--muted)]">Issue Date</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
              {formatDate(invoice.date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Due Date</p>
            <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-6 py-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
            Services
          </p>
          <div className="space-y-2">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-[var(--background)] px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {item.description}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {item.quantity} × {fmt(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {fmt(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-[var(--border)] px-6 py-4">
          <div className="flex justify-between text-sm text-[var(--muted)]">
            <span>Subtotal</span>
            <span>{fmt(invoice.amount)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-emerald-600">
            <span>Paid</span>
            <span>{fmt(invoice.paid)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-[var(--border)] pt-2 text-base font-bold text-[var(--foreground)]">
            <span>Balance Due</span>
            <span className={balance > 0 ? "text-red-600" : "text-emerald-600"}>
              {fmt(balance)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-[var(--border)] px-6 py-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            <CreditCard className="h-4 w-4" />
            Record Payment
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--border)]">
            <Download className="h-4 w-4" />
            PDF
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [filter, setFilter] = useState<FilterOption>("All");
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithItems | null>(null);

  const totalRevenue = INVOICES.reduce((s, i) => s + i.amount, 0);
  const totalCollected = INVOICES.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const overdueCount = INVOICES.filter((i) => i.status === "overdue").length;

  const filtered = INVOICES.filter((inv) => {
    const matchFilter =
      filter === "All" || inv.status.toLowerCase() === filter.toLowerCase();
    const matchSearch =
      search === "" ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Billing &amp; Invoices
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage patient invoices, track payments, and monitor revenue.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] shadow-sm transition-colors hover:bg-[var(--border)]">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                <Plus className="h-4 w-4" />
                New Invoice
              </button>
            </div>
          </div>
        </Reveal>

        {/* Stat cards */}
        <Reveal delay={0.05}>
          <motion.div
            className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: DollarSign,
                label: "Total Revenue",
                value: fmt(totalRevenue),
                sub: "June 2024",
                accent: true,
              },
              {
                icon: Check,
                label: "Collected",
                value: fmt(totalCollected),
                sub: `${Math.round((totalCollected / totalRevenue) * 100)}% of total`,
                accent: false,
              },
              {
                icon: Clock,
                label: "Outstanding",
                value: fmt(totalOutstanding),
                sub: "Across all invoices",
                accent: false,
              },
              {
                icon: AlertCircle,
                label: "Overdue",
                value: `${overdueCount} invoice${overdueCount !== 1 ? "s" : ""}`,
                sub: "Require follow-up",
                accent: false,
              },
            ].map((s) => (
              <motion.div key={s.label} variants={fadeInUp}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Revenue chart */}
        <Reveal delay={0.1}>
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[var(--foreground)]">
                  Revenue Overview
                </h2>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  Billed vs. collected — last 6 months
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]/60" />
                  Billed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                  Collected
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
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
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [fmt(value)]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  strokeOpacity={0.5}
                  fill="url(#gradRevenue)"
                  dot={false}
                />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  fill="url(#gradCollected)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Reveal>

        {/* Invoice table */}
        <Reveal delay={0.15}>
          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_-4px_rgba(0,0,0,0.08)]">
            {/* Table toolbar */}
            <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                All Invoices
              </h2>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Search patient or invoice..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 sm:w-56"
                  />
                </div>
                {/* Filter pills */}
                <div className="flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-[var(--muted)]" />
                  {FILTER_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFilter(opt)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        filter === opt
                          ? "bg-[var(--accent)] text-white"
                          : "border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {["Invoice", "Patient", "Date", "Due Date", "Amount", "Paid", "Balance", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-5 py-12 text-center text-sm text-[var(--muted)]"
                      >
                        No invoices match your search.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inv, idx) => {
                      const s = STATUS_STYLES[inv.status];
                      const balance = inv.amount - inv.paid;
                      return (
                        <motion.tr
                          key={inv.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04, duration: 0.3 }}
                          className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--background)]"
                        >
                          <td className="px-5 py-4 font-mono text-xs font-medium text-[var(--foreground)]">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-5 py-4 font-medium text-[var(--foreground)]">
                            {inv.patientName}
                          </td>
                          <td className="px-5 py-4 text-[var(--muted)]">
                            {formatDate(inv.date)}
                          </td>
                          <td className="px-5 py-4 text-[var(--muted)]">
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="px-5 py-4 font-semibold text-[var(--foreground)]">
                            {fmt(inv.amount)}
                          </td>
                          <td className="px-5 py-4 text-emerald-600">
                            {fmt(inv.paid)}
                          </td>
                          <td
                            className={`px-5 py-4 font-semibold ${
                              balance > 0 ? "text-red-500" : "text-emerald-600"
                            }`}
                          >
                            {fmt(balance)}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}
                            >
                              {s.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectedInvoice(inv)}
                              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="flex items-center justify-between border-t border-[var(--border)] px-5 py-3">
              <p className="text-xs text-[var(--muted)]">
                Showing {filtered.length} of {INVOICES.length} invoices
              </p>
              <div className="flex items-center gap-1 text-xs text-[var(--muted)]">
                <FileText className="h-3.5 w-3.5" />
                Last updated: Jun 7, 2024
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick summary strip */}
        <Reveal delay={0.2}>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Paid this month",
                value: fmt(INVOICES.filter((i) => i.status === "paid").reduce((s, i) => s + i.paid, 0)),
                icon: Check,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                label: "Pending collection",
                value: fmt(INVOICES.filter((i) => i.status === "pending").reduce((s, i) => s + (i.amount - i.paid), 0)),
                icon: Clock,
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                label: "Overdue balance",
                value: fmt(INVOICES.filter((i) => i.status === "overdue").reduce((s, i) => s + (i.amount - i.paid), 0)),
                icon: AlertCircle,
                color: "text-red-600",
                bg: "bg-red-50",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 shadow-sm"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted)]">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Invoice detail modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}