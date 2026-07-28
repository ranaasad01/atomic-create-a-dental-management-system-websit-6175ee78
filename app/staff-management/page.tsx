"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Filter, Mail, Phone, Edit, Trash2, User, Star, Check, X, ChevronDown, Activity } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer, fadeInUp, scaleIn } from "@/lib/motion";
import type { StaffMember } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

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
    name: "Dr. James Okafor",
    role: "dentist",
    specialty: "Oral Surgery",
    email: "j.okafor@dentacore.com",
    phone: "(555) 201-4403",
    status: "active",
    avatar: "/images/dentist-james-okafor.jpg",
  },
  {
    id: "s5",
    name: "Sandra Liu",
    role: "receptionist",
    email: "s.liu@dentacore.com",
    phone: "(555) 201-4410",
    status: "active",
    avatar: "/images/receptionist-sandra-liu.jpg",
  },
  {
    id: "s6",
    name: "Tom Reyes",
    role: "receptionist",
    email: "t.reyes@dentacore.com",
    phone: "(555) 201-4411",
    status: "inactive",
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
    name: "Nina Kowalski",
    role: "receptionist",
    email: "n.kowalski@dentacore.com",
    phone: "(555) 201-4412",
    status: "active",
    avatar: "/images/receptionist-nina-kowalski.jpg",
  },
];

type RoleFilter = "all" | "admin" | "dentist" | "receptionist";
type StatusFilter = "all" | "active" | "inactive";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  dentist: "Dentist",
  receptionist: "Receptionist",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  dentist: "bg-sky-100 text-sky-700",
  receptionist: "bg-teal-100 text-teal-700",
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-500",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent?: boolean;
}

function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`rounded-2xl border p-5 flex flex-col gap-3 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] ${
        accent
          ? "border-[var(--accent)]/30 bg-[var(--accent)]/5"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
        <span
          className={`p-2 rounded-xl ${accent ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-[var(--background)] text-[var(--muted)]"}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {value}
        </div>
        <div className="text-xs text-[var(--muted)] mt-0.5">{sub}</div>
      </div>
    </motion.div>
  );
}

// ─── Staff Card ───────────────────────────────────────────────────────────────

interface StaffCardProps {
  member: StaffMember;
  onEdit: (m: StaffMember) => void;
  onDelete: (id: string) => void;
}

function StaffCard({ member, onEdit, onDelete }: StaffCardProps) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col gap-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={member.avatar}
              alt={member.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[var(--border)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0ea5e9&color=fff&size=96`;
              }}
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--surface)] ${member.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`}
            />
          </div>
          <div>
            <div className="font-semibold text-[var(--foreground)] leading-tight">
              {member.name}
            </div>
            {member.specialty && (
              <div className="text-xs text-[var(--muted)] mt-0.5">
                {member.specialty}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(member)}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
            aria-label="Edit staff member"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(member.id)}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove staff member"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[member.role]}`}
        >
          {ROLE_LABELS[member.role]}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[member.status]}`}
        >
          {member.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="space-y-1.5 border-t border-[var(--border)] pt-3">
        <a
          href={`mailto:${member.email}`}
          className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{member.email}</span>
        </a>
        <a
          href={`tel:${member.phone}`}
          className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 shrink-0" />
          <span>{member.phone}</span>
        </a>
      </div>
    </motion.div>
  );
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

interface ModalProps {
  member: Partial<StaffMember> | null;
  onClose: () => void;
  onSave: (m: StaffMember) => void;
}

function StaffModal({ member, onClose, onSave }: ModalProps) {
  const isNew = !member?.id;
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

  function handleChange(
    field: keyof StaffMember,
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) return;
    onSave({
      id: member?.id ?? `s${Date.now()}`,
      name: form.name!,
      role: (form.role as StaffMember["role"]) ?? "dentist",
      specialty: form.specialty,
      email: form.email!,
      phone: form.phone!,
      status: (form.status as StaffMember["status"]) ?? "active",
      avatar: form.avatar,
    });
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.25)] p-6"
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              {isNew ? "Add Staff Member" : "Edit Staff Member"}
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name ?? ""}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Dr. Jane Smith"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={form.role ?? "dentist"}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition pr-8"
                  >
                    <option value="admin">Admin</option>
                    <option value="dentist">Dentist</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={form.status ?? "active"}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition pr-8"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Specialty (optional)
              </label>
              <input
                type="text"
                value={form.specialty ?? ""}
                onChange={(e) => handleChange("specialty", e.target.value)}
                placeholder="e.g. Orthodontics"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="jane@dentacore.com"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--muted)] mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 000-0000"
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isNew ? "Add Member" : "Save Changes"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>(STAFF_MEMBERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modalMember, setModalMember] = useState<Partial<StaffMember> | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    return staff.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        (m.specialty ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || m.role === roleFilter;
      const matchStatus =
        statusFilter === "all" || m.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [staff, search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    const active = staff.filter((m) => m.status === "active").length;
    const dentists = staff.filter((m) => m.role === "dentist").length;
    const receptionists = staff.filter(
      (m) => m.role === "receptionist"
    ).length;
    const admins = staff.filter((m) => m.role === "admin").length;
    return { total: staff.length, active, dentists, receptionists, admins };
  }, [staff]);

  function openAdd() {
    setModalMember(null);
    setModalOpen(true);
  }

  function openEdit(m: StaffMember) {
    setModalMember(m);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    setStaff((prev) => prev.filter((m) => m.id !== id));
  }

  function handleSave(saved: StaffMember) {
    setStaff((prev) => {
      const exists = prev.find((m) => m.id === saved.id);
      if (exists) return prev.map((m) => (m.id === saved.id ? saved : m));
      return [...prev, saved];
    });
    setModalOpen(false);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10">

        {/* Header */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Staff Management
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Manage your clinic team, roles, and contact details.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Staff Member
            </motion.button>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {[
              {
                label: "Total Staff",
                value: stats.total,
                sub: "All roles combined",
                icon: <User className="w-4 h-4" />,
                accent: true,
              },
              {
                label: "Active Members",
                value: stats.active,
                sub: `${stats.total - stats.active} inactive`,
                icon: <Activity className="w-4 h-4" />,
              },
              {
                label: "Dentists",
                value: stats.dentists,
                sub: "Clinical staff",
                icon: <Star className="w-4 h-4" />,
              },
              {
                label: "Receptionists",
                value: stats.receptionists,
                sub: `${stats.admins} admin`,
                icon: <Check className="w-4 h-4" />,
              },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeInUp}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>
        </Reveal>

        {/* Filters */}
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, specialty..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition"
              />
            </div>

            {/* Role + Status filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-[var(--muted)] shrink-0" />
              {(["all", "admin", "dentist", "receptionist"] as RoleFilter[]).map(
                (r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      roleFilter === r
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {r === "all" ? "All Roles" : ROLE_LABELS[r]}
                  </button>
                )
              )}
              <div className="w-px h-5 bg-[var(--border)]" />
              {(["all", "active", "inactive"] as StatusFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    statusFilter === s
                      ? "bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                      : "bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Results count */}
        <Reveal>
          <p className="text-xs text-[var(--muted)]">
            Showing{" "}
            <span className="font-semibold text-[var(--foreground)]">
              {filtered.length}
            </span>{" "}
            of {staff.length} staff members
          </p>
        </Reveal>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filtered.map((member, i) => (
                <motion.div
                  key={member.id}
                  variants={fadeInUp}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <StaffCard
                    member={member}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-[var(--muted)]" />
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                No staff members found
              </p>
              <p className="text-xs text-[var(--muted)] mt-1">
                Try adjusting your search or filters.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Role breakdown table */}
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-base font-semibold text-[var(--foreground)]">
                Role Breakdown
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Distribution of staff across all roles and statuses.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                    {["Name", "Role", "Specialty", "Email", "Phone", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {staff.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.3 }}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-[var(--border)]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=0ea5e9&color=fff&size=64`;
                            }}
                          />
                          <span className="font-medium text-[var(--foreground)]">
                            {m.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_COLORS[m.role]}`}
                        >
                          {ROLE_LABELS[m.role]}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted)]">
                        {m.specialty ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted)]">
                        {m.email}
                      </td>
                      <td className="px-5 py-3.5 text-[var(--muted)]">
                        {m.phone}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[m.status]}`}
                        >
                          {m.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modal */}
      {modalOpen && (
        <StaffModal
          member={modalMember}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </main>
  );
}