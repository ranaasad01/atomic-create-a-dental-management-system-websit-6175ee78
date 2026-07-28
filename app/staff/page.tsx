"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Filter, Mail, Phone, Edit, Trash2, User, Star, Activity, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { StaffMember } from "@/lib/data";

// ─── Inline mock data ────────────────────────────────────────────────────────

const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "s1",
    name: "Dr. Evelyn Carter",
    role: "admin",
    specialty: "Orthodontics",
    email: "e.carter@dentacore.com",
    phone: "(555) 201-4400",
    status: "active",
    avatar: "/images/dentist-evelyn-carter.jpg",
  },
  {
    id: "s2",
    name: "Dr. Marcus Webb",
    role: "dentist",
    specialty: "Endodontics",
    email: "m.webb@dentacore.com",
    phone: "(555) 201-4401",
    status: "active",
    avatar: "/images/dentist-marcus-webb.jpg",
  },
  {
    id: "s3",
    name: "Dr. Priya Nair",
    role: "dentist",
    specialty: "Periodontics",
    email: "p.nair@dentacore.com",
    phone: "(555) 201-4402",
    status: "active",
    avatar: "/images/dentist-priya-nair.jpg",
  },
  {
    id: "s4",
    name: "Dr. James Holloway",
    role: "dentist",
    specialty: "Oral Surgery",
    email: "j.holloway@dentacore.com",
    phone: "(555) 201-4403",
    status: "inactive",
    avatar: "/images/dentist-james-holloway.jpg",
  },
  {
    id: "s5",
    name: "Sandra Okafor",
    role: "receptionist",
    email: "s.okafor@dentacore.com",
    phone: "(555) 201-4410",
    status: "active",
    avatar: "/images/receptionist-sandra-okafor.jpg",
  },
  {
    id: "s6",
    name: "Tom Reyes",
    role: "receptionist",
    email: "t.reyes@dentacore.com",
    phone: "(555) 201-4411",
    status: "active",
    avatar: "/images/receptionist-tom-reyes.jpg",
  },
  {
    id: "s7",
    name: "Dr. Aisha Patel",
    role: "dentist",
    specialty: "Cosmetic Dentistry",
    email: "a.patel@dentacore.com",
    phone: "(555) 201-4404",
    status: "active",
    avatar: "/images/dentist-aisha-patel.jpg",
  },
  {
    id: "s8",
    name: "Linda Cheng",
    role: "receptionist",
    email: "l.cheng@dentacore.com",
    phone: "(555) 201-4412",
    status: "inactive",
    avatar: "/images/receptionist-linda-cheng.jpg",
  },
];

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  dentist: "Dentist",
  receptionist: "Receptionist",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  dentist: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  receptionist: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

const STATS = [
  { label: "Total Staff", value: "8", icon: User, color: "text-[var(--accent)]" },
  { label: "Active Members", value: "6", icon: Activity, color: "text-green-500" },
  { label: "Dentists", value: "5", icon: Star, color: "text-sky-500" },
  { label: "Receptionists", value: "3", icon: CheckCircle, color: "text-teal-500" },
];

type RoleFilter = "all" | "admin" | "dentist" | "receptionist";
type StatusFilter = "all" | "active" | "inactive";

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] dark:border-white/8 dark:bg-white/[0.03]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-white/50">{label}</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
              {value}
            </p>
          </div>
          <div className={cn("rounded-xl bg-slate-50 p-3 dark:bg-white/5", color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

function StaffCard({
  member,
  onEdit,
  onDelete,
}: {
  member: StaffMember;
  onEdit: (m: StaffMember) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.14)] dark:border-white/8 dark:bg-white/[0.03]"
    >
      {/* Status badge */}
      <span
        className={cn(
          "absolute right-4 top-4 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
          member.status === "active"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/40"
        )}
      >
        {member.status === "active" ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )}
        {member.status === "active" ? "Active" : "Inactive"}
      </span>

      {/* Avatar */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--accent)]/20 bg-slate-100 dark:bg-white/10">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-400 dark:text-white/30">
            {member.name.charAt(0)}
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-800 dark:text-white">
            {member.name}
          </h3>
          {member.specialty && (
            <p className="truncate text-xs text-slate-500 dark:text-white/40">
              {member.specialty}
            </p>
          )}
        </div>
      </div>

      {/* Role badge */}
      <span
        className={cn(
          "mb-4 w-fit rounded-full px-3 py-0.5 text-xs font-semibold",
          ROLE_COLORS[member.role]
        )}
      >
        {ROLE_LABELS[member.role]}
      </span>

      {/* Contact */}
      <div className="mt-auto space-y-1.5 text-sm text-slate-500 dark:text-white/50">
        <div className="flex items-center gap-2 truncate">
          <Mail className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">{member.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{member.phone}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2 border-t border-black/5 pt-4 dark:border-white/5">
        <button
          onClick={() => onEdit(member)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-black/8 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-[var(--accent)] hover:text-white dark:border-white/8 dark:bg-white/5 dark:text-white/60 dark:hover:bg-[var(--accent)] dark:hover:text-white"
        >
          <Edit className="h-3.5 w-3.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(member.id)}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function StaffRow({
  member,
  onEdit,
  onDelete,
}: {
  member: StaffMember;
  onEdit: (m: StaffMember) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <motion.tr
      variants={fadeInUp}
      className="group border-b border-black/5 transition-colors hover:bg-slate-50/60 dark:border-white/5 dark:hover:bg-white/[0.02]"
    >
      <td className="py-3 pl-4 pr-3">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-black/5 bg-slate-100 dark:border-white/8 dark:bg-white/10">
            {member.avatar && (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-400 dark:text-white/30">
              {member.name.charAt(0)}
            </div>
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">{member.name}</p>
            {member.specialty && (
              <p className="text-xs text-slate-400 dark:text-white/40">{member.specialty}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", ROLE_COLORS[member.role])}>
          {ROLE_LABELS[member.role]}
        </span>
      </td>
      <td className="px-3 py-3 text-sm text-slate-500 dark:text-white/50">{member.email}</td>
      <td className="px-3 py-3 text-sm text-slate-500 dark:text-white/50">{member.phone}</td>
      <td className="px-3 py-3">
        <span
          className={cn(
            "flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            member.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-white/40"
          )}
        >
          {member.status === "active" ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {member.status === "active" ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(member)}
            className="rounded-lg border border-black/8 bg-slate-50 p-1.5 text-slate-500 transition-colors hover:bg-[var(--accent)] hover:text-white dark:border-white/8 dark:bg-white/5 dark:text-white/50"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-400 transition-colors hover:bg-red-500 hover:text-white dark:border-red-900/30 dark:bg-red-900/10"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

// ─── Add/Edit Modal ──────────────────────────────────────────────────────────

function StaffModal({
  member,
  onClose,
  onSave,
}: {
  member: StaffMember | null;
  onClose: () => void;
  onSave: (data: Partial<StaffMember>) => void;
}) {
  const isEdit = member !== null;
  const [form, setForm] = useState<Partial<StaffMember>>(
    member ?? {
      name: "",
      role: "dentist",
      specialty: "",
      email: "",
      phone: "",
      status: "active",
    }
  );

  function handleChange(field: keyof StaffMember, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg rounded-2xl border border-black/8 bg-white p-6 shadow-[0_8px_48px_-8px_rgba(0,0,0,0.2)] dark:border-white/10 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold text-slate-800 dark:text-white">
          {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
              Full Name
            </label>
            <input
              type="text"
              value={form.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Dr. Jane Smith"
              className="w-full rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
                Role
              </label>
              <div className="relative">
                <select
                  value={form.role ?? "dentist"}
                  onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="admin">Admin</option>
                  <option value="dentist">Dentist</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
                Status
              </label>
              <div className="relative">
                <select
                  value={form.status ?? "active"}
                  onChange={(e) => handleChange("status", e.target.value)}
                  className="w-full appearance-none rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
              Specialty (optional)
            </label>
            <input
              type="text"
              value={form.specialty ?? ""}
              onChange={(e) => handleChange("specialty", e.target.value)}
              placeholder="e.g. Orthodontics"
              className="w-full rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
              Email
            </label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@dentacore.com"
              className="w-full rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-white/50">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="(555) 000-0000"
              className="w-full rounded-xl border border-black/10 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-black/10 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="rounded-xl bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {isEdit ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  const filtered = useMemo(() => {
    return staff.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.specialty ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      const matchesStatus = statusFilter === "all" || m.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  function handleEdit(member: StaffMember) {
    setEditingMember(member);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    setStaff((prev) => prev.filter((m) => m.id !== id));
  }

  function handleSave(data: Partial<StaffMember>) {
    if (editingMember) {
      setStaff((prev) =>
        prev.map((m) => (m.id === editingMember.id ? { ...m, ...data } : m))
      );
    } else {
      const newMember: StaffMember = {
        id: `s${Date.now()}`,
        name: data.name ?? "New Member",
        role: (data.role as StaffMember["role"]) ?? "receptionist",
        specialty: data.specialty,
        email: data.email ?? "",
        phone: data.phone ?? "",
        status: (data.status as StaffMember["status"]) ?? "active",
      };
      setStaff((prev) => [...prev, newMember]);
    }
    setModalOpen(false);
    setEditingMember(null);
  }

  function openAddModal() {
    setEditingMember(null);
    setModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <Reveal>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white sm:text-3xl">
                Staff Management
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-white/50">
                Manage your clinic team, roles, and contact details.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition hover:opacity-90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add Staff Member
            </button>
          </div>
        </Reveal>

        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              color={s.color}
              delay={i * 0.07}
            />
          ))}
        </div>

        {/* Filters & view toggle */}
        <Reveal>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search staff..."
                  className="w-full rounded-xl border border-black/10 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/30"
                />
              </div>

              {/* Role filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
                  className="appearance-none rounded-xl border border-black/10 bg-white py-2 pl-8 pr-8 text-sm text-slate-700 outline-none transition focus:border-[var(--accent)] dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="dentist">Dentist</option>
                  <option value="receptionist">Receptionist</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="appearance-none rounded-xl border border-black/10 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 outline-none transition focus:border-[var(--accent)] dark:border-white/10 dark:bg-white/5 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 rounded-xl border border-black/10 bg-white p-1 dark:border-white/10 dark:bg-white/5">
              {(["grid", "table"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition",
                    viewMode === mode
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-white/40 dark:hover:text-white/70"
                  )}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Results count */}
        <Reveal>
          <p className="mb-4 text-xs text-slate-400 dark:text-white/30">
            Showing {filtered.length} of {staff.length} staff members
          </p>
        </Reveal>

        {/* Grid view */}
        {viewMode === "grid" && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filtered.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 dark:text-white/30">
                <User className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">No staff members match your filters.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Table view */}
        {viewMode === "table" && (
          <Reveal>
            <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] dark:border-white/8 dark:bg-white/[0.03]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-black/5 dark:border-white/5">
                      {["Name", "Role", "Email", "Phone", "Status", "Actions"].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 first:pl-4 last:pr-4 dark:text-white/30"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {filtered.map((member) => (
                      <StaffRow
                        key={member.id}
                        member={member}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </motion.tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-16 text-center text-slate-400 dark:text-white/30">
                    <User className="mx-auto mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm">No staff members match your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <StaffModal
          member={editingMember}
          onClose={() => {
            setModalOpen(false);
            setEditingMember(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}