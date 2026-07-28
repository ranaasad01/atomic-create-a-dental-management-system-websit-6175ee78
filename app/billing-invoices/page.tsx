"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileText, DollarSign, Clock, AlertCircle, Search, Filter, Download, Plus, Eye, ChevronDown, Check, X, TrendingUp, CreditCard } from 'lucide-react';
import { useTranslations } from "next-intl";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type, { Invoice } from "@/lib/data";
type InvoiceLineItem = any;
const InvoiceLineItem: any = [];

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INVOICES: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2024-0091",
    patientId: "p-001",
    patientName: "Margaret Collins",
    date: "2024-06-01",
    dueDate: "2024-06-15",
    amount: 1240.0,
    paid: 1240.0,
    status: "paid",
    items: [
      { id: "li-1", description: "Full Mouth X-Ray", quantity: 1, unitPrice: 180, total: 180 },
      { id: "li-2", description: "Dental Crown (Porcelain)", quantity: 2, unitPrice: 530, total: 1060 },
    ],
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2024-0092",
    patientId: "p-002",
    patientName: "James Thornton",
    date: "2024-06-03",
    dueDate: "2024-06-17",
    amount: 580.0,
    paid: 0,
    status: "pending",
    items: [
      { id: "li-3", description: "Root Canal Treatment", quantity: 1, unitPrice: 480, total: 480 },
      { id: "li-4", description: "Consultation Fee", quantity: 1, unitPrice: 100, total: 100 },
    ],
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2024-0093",
    patientId: "p-003",
    patientName: "Sophia Reyes",
    date: "2024-05-20",
    dueDate: "2024-06-03",
    amount: 320.0,
    paid: 0,
    status: "overdue",
    items: [
      { id: "li-5", description: "Teeth Whitening", quantity: 1, unitPrice: 250, total: 250 },
      { id: "li-6", description: "Fluoride Treatment", quantity: 1, unitPrice: 70, total: 70 },
    ],
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2024-0094",
    patientId: "p-004",
    patientName: "David Nakamura",
    date: "2024-06-05",
    dueDate: "2024-06-19",
    amount: 2100.0,
    paid: 1050.0,
    status: "pending",
    items: [
      { id: "li-7", description: "Dental Implant (Titanium)", quantity: 1, unitPrice: 1800, total: 1800 },
      { id: "li-8", description: "Bone Graft", quantity: 1, unitPrice: 300, total: 300 },
    ],
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2024-0095",
    patientId: "p-005",
    patientName: "Amelia Foster",
    date: "2024-06-06",
    dueDate: "2024-06-20",
    amount: 450.0,
    paid: 450.0,
    status: "paid",
    items: [
      { id: "li-9", description: "Orthodontic Consultation", quantity: 1, unitPrice: 150, total: 150 },
      { id: "li-10", description: "Retainer (Upper)", quantity: 1, unitPrice: 300, total: 300 },
    ],
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2024-0096",
    patientId: "p-006",
    patientName: "Robert Haines",
    date: "2024-06-07",
    dueDate: "2024-06-21",
    amount: 890.0,
    paid: 0,
    status: "draft",
    items: [
      { id: "li-11", description: "Periodontal Scaling", quantity: 1, unitPrice: 640, total: 640 },
      { id: "li-12", description: "Antibiotic Therapy", quantity: 1, unitPrice: 250, total: 250 },
    ],
  },
  {
    id: "inv-007",
    invoiceNumber: "INV-2024-0097",
    patientId: "p-007",
    patientName: "Natalie Brooks",
    date: "2024-05-28",
    dueDate: "2024-06-11",
    amount: 760.0,
    paid: 760.0,
    status: "paid",
    items: [
      { id: "li-13", description: "Composite Filling (x4)", quantity: 4, unitPrice: 190, total: 760 },
    ],
  },
  {
    id: "inv-008",
    invoiceNumber: "INV-2024-0098",
    patientId: "p-008",
    patientName: "Carlos Mendez",
    date: "2024-05-15",
    dueDate: "2024-05-29",
    amount: 1380.0,
    paid: 0,
    status: "overdue",
    items: [
      { id: "li-14", description: "Dental Bridge (3-unit)", quantity: 1, unitPrice: 1380, total: 1380 },
    ],
  },
];

const REVENUE_TREND = [
  { month: "Jan", revenue: 18400, collected: 16200 },
  { month: "Feb", revenue: 21000, collected: 19800 },
  { month: "Mar", revenue: 19500, collected: 17900 },
  { month: "Apr", revenue: 24300, collected: 22100 },
  { month: "May", revenue: 22800, collected: 20400 },
  { month: "Jun", revenue: 27600, collected: 24900 },
];

const STATUS_BREAKDOWN = [
  { name: "Paid", value: 2450, color: "#22c55e" },
  { name: "Pending", value: 2680, color: "#f59e0b" },
  { name: "Overdue", value: 1700, color: "#ef4444" },
  { name: "Draft", value: 890, color: "#94a3b8" },
];

const STATUS_FILTERS = ["All", "paid", "pending", "overdue", "draft"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  draft: "bg-slate-100 text-slate-600 border-slate-200",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  paid: <Check className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  overdue: <AlertCircle className="h-3 w-3" />,
  draft: <FileText className="h-3 w-3" />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 32px -8px rgba(0,0,0,0.18)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border p-5 flex flex-col gap-3",
        accent
          ? "border-[var(--accent)]/30 bg-[var(--accent)]/8"
          : "border-[var(--border)] bg-[var(--surface)]",
      )}
    >
      <div
        className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center",
          accent ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-[var(--primary)]/10 text-[var(--primary)]",
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-[var(--foreground)] mt-0.5">{value}</p>
        <p className="text-xs text-[var(--muted)] mt-1">{sub}</p>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600 border-gray-200",
      )}
    >
      {STATUS_ICONS[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function InvoiceDetailModal({
  invoice,
  onClose,
}: {
  invoice: Invoice;
  onClose: () => void;
}) {
  const balance = invoice.amount - invoice.paid;
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl overflow-hidden"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--muted)] font-medium uppercase tracking-wide">Invoice</p>
            <h2 className="text-xl font-bold text-[var(--foreground)] mt-0.5">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-[var(--muted)] mt-1">{invoice.patientName}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={invoice.status} />
            <button
              onClick={onClose}
              className="ml-2 h-8 w-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 border-b border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--muted)]">Issue Date</p>
            <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">{formatDate(invoice.date)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Due Date</p>
            <p className="text-sm font-medium text-[var(--foreground)] mt-0.5">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        {/* Line Items */}
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wide mb-3">Services</p>
          <div className="space-y-2">
            {(invoice.items ?? []).map((item: InvoiceLineItem) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-[var(--foreground)]">{item.description}</span>
                  {item.quantity > 1 && (
                    <span className="text-[var(--muted)] ml-1">x{item.quantity}</span>
                  )}
                </div>
                <span className="font-medium text-[var(--foreground)]">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Subtotal</span>
            <span className="text-[var(--foreground)]">{formatCurrency(invoice.amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted)]">Amount Paid</span>
            <span className="text-green-600 font-medium">{formatCurrency(invoice.paid)}</span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-[var(--border)] pt-2 mt-2">
            <span className="text-[var(--foreground)]">Balance Due</span>
            <span className={balance > 0 ? "text-red-600" : "text-green-600"}>{formatCurrency(balance)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          {invoice.status !== "paid" && (
            <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              <CreditCard className="h-4 w-4" />
              Record Payment
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingInvoicesPage() {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const totalRevenue = INVOICES.reduce((s, i) => s + i.amount, 0);
  const totalCollected = INVOICES.reduce((s, i) => s + i.paid, 0);
  const totalOutstanding = totalRevenue - totalCollected;
  const overdueCount = INVOICES.filter((i) => i.status === "overdue").length;

  const filtered = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchSearch =
        inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Page Header */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                {t("billing.title")}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("billing.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-colors">
                <Download className="h-4 w-4" />
                {t("billing.exportBtn")}
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                <Plus className="h-4 w-4" />
                {t("billing.newInvoiceBtn")}
              </button>
            </div>
          </div>
        </Reveal>

        {/* Stat Cards */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-4 lg:grid-cols-4"
          >
            {[
              {
                icon: <DollarSign className="h-5 w-5" />,
                label: t("billing.stats.totalRevenue"),
                value: formatCurrency(totalRevenue),
                sub: t("billing.stats.totalRevenueSub"),
                accent: true,
              },
              {
                icon: <Check className="h-5 w-5" />,
                label: t("billing.stats.collected"),
                value: formatCurrency(totalCollected),
                sub: t("billing.stats.collectedSub"),
              },
              {
                icon: <Clock className="h-5 w-5" />,
                label: t("billing.stats.outstanding"),
                value: formatCurrency(totalOutstanding),
                sub: t("billing.stats.outstandingSub"),
              },
              {
                icon: <AlertCircle className="h-5 w-5" />,
                label: t("billing.stats.overdue"),
                value: String(overdueCount),
                sub: t("billing.stats.overdueSub"),
              },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeInUp}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Charts Row */}
        <Reveal>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Revenue Trend */}
            <div className="lg:col-span-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-[var(--foreground)]">
                    {t("billing.chart.revenueTitle")}
                  </h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{t("billing.chart.revenueSubtitle")}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.4%
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={REVENUE_TREND} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: number) => [formatCurrency(value)]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--accent)" strokeWidth={2} fill="url(#revGrad)" name="Billed" />
                  <Area type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} fill="url(#colGrad)" name="Collected" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Status Breakdown */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-base font-semibold text-[var(--foreground)] mb-1">
                {t("billing.chart.breakdownTitle")}
              </h2>
              <p className="text-xs text-[var(--muted)] mb-4">{t("billing.chart.breakdownSubtitle")}</p>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={STATUS_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {STATUS_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: number) => [formatCurrency(value)]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {STATUS_BREAKDOWN.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-[var(--muted)]">{item.name}</span>
                    </div>
                    <span className="font-medium text-[var(--foreground)]">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Invoice Table */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col gap-3 p-5 border-b border-[var(--border)] sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-[var(--foreground)]">{t("billing.table.title")}</h2>
              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder={t("billing.table.searchPlaceholder")}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 w-48"
                  />
                </div>
                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu((v) => !v)}
                    className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
                  >
                    <Filter className="h-4 w-4 text-[var(--muted)]" />
                    {statusFilter === "All" ? t("billing.table.filterAll") : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    <ChevronDown className="h-3.5 w-3.5 text-[var(--muted)]" />
                  </button>
                  {showFilterMenu && (
                    <div className="absolute right-0 top-full mt-1 z-20 w-36 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden">
                      {STATUS_FILTERS.map((f) => (
                        <button
                          key={f}
                          onClick={() => { setStatusFilter(f); setShowFilterMenu(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm transition-colors",
                            statusFilter === f
                              ? "bg-[var(--accent)]/10 text-[var(--accent)] font-medium"
                              : "text-[var(--foreground)] hover:bg-[var(--border)]",
                          )}
                        >
                          {f === "All" ? t("billing.table.filterAll") : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{t("billing.table.colInvoice")}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{t("billing.table.colPatient")}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden md:table-cell">{t("billing.table.colDate")}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden lg:table-cell">{t("billing.table.colDue")}</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{t("billing.table.colAmount")}</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide hidden sm:table-cell">{t("billing.table.colBalance")}</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--muted)] uppercase tracking-wide">{t("billing.table.colStatus")}</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[var(--muted)] text-sm">
                        {t("billing.table.empty")}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((inv) => {
                      const balance = inv.amount - inv.paid;
                      return (
                        <motion.tr
                          key={inv.id}
                          whileHover={{ backgroundColor: "rgba(var(--accent-rgb, 99,102,241),0.04)" }}
                          className="transition-colors cursor-pointer"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <td className="px-5 py-4 font-mono text-xs text-[var(--accent)] font-semibold">
                            {inv.invoiceNumber}
                          </td>
                          <td className="px-5 py-4 font-medium text-[var(--foreground)]">{inv.patientName}</td>
                          <td className="px-5 py-4 text-[var(--muted)] hidden md:table-cell">{formatDate(inv.date)}</td>
                          <td className="px-5 py-4 text-[var(--muted)] hidden lg:table-cell">{formatDate(inv.dueDate)}</td>
                          <td className="px-5 py-4 text-right font-semibold text-[var(--foreground)]">{formatCurrency(inv.amount)}</td>
                          <td className="px-5 py-4 text-right hidden sm:table-cell">
                            <span className={balance > 0 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                              {formatCurrency(balance)}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={inv.status} />
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }}
                              className="h-8 w-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-colors"
                              aria-label={`View invoice ${inv.invoiceNumber}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--border)] bg-[var(--background)]/30">
              <p className="text-xs text-[var(--muted)]">
                {t("billing.table.showing")} {filtered.length} {t("billing.table.of")} {INVOICES.length} {t("billing.table.invoices")}
              </p>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors disabled:opacity-40" disabled>
                  {t("billing.table.prev")}
                </button>
                <button className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] bg-[var(--accent)] text-white font-medium">
                  1
                </button>
                <button className="px-3 py-1.5 text-xs rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)] transition-colors">
                  {t("billing.table.next")}
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick Actions */}
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: <FileText className="h-5 w-5" />,
                title: t("billing.actions.statementTitle"),
                desc: t("billing.actions.statementDesc"),
              },
              {
                icon: <CreditCard className="h-5 w-5" />,
                title: t("billing.actions.paymentTitle"),
                desc: t("billing.actions.paymentDesc"),
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                title: t("billing.actions.reportTitle"),
                desc: t("billing.actions.reportDesc"),
              },
            ].map((action) => (
              <motion.button
                key={action.title}
                whileHover={{ y: -2, boxShadow: "0 8px 24px -8px rgba(0,0,0,0.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left hover:border-[var(--accent)]/40 transition-colors group"
              >
                <div className="h-10 w-10 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--accent)]/20 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)] text-sm">{action.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">{action.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </main>
  );
}