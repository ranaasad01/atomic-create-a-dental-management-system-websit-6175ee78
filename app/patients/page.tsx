"use client";

import { useState, useMemo, useCallback, Fragment } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Search, Plus, ChevronDown, ChevronRight, Eye, Edit, Trash2, X, User, Phone, Mail, Calendar, Heart, AlertCircle, FileText, Clock, Check, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { type Patient, type Appointment, type TreatmentPlan } from "@/lib/data";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    patientId: "PT-0001",
    name: "Sophia Hartwell",
    dob: "1988-03-14",
    age: 36,
    phone: "(555) 201-4832",
    email: "sophia.hartwell@email.com",
    assignedDentist: "Dr. Elena Vasquez",
    lastVisit: "2024-05-10",
    nextAppointment: "2024-07-22",
    status: "active",
    bloodType: "A+",
    allergies: ["Penicillin", "Latex"],
    insuranceProvider: "BlueCross BlueShield",
    policyNumber: "BCB-88234-X",
  },
  {
    id: "p2",
    patientId: "PT-0002",
    name: "Marcus Delgado",
    dob: "1975-11-02",
    age: 48,
    phone: "(555) 374-9021",
    email: "m.delgado@webmail.com",
    assignedDentist: "Dr. James Okafor",
    lastVisit: "2024-04-28",
    nextAppointment: "2024-07-15",
    status: "active",
    bloodType: "O-",
    allergies: [],
    insuranceProvider: "Aetna Dental",
    policyNumber: "AET-55102-D",
  },
  {
    id: "p3",
    patientId: "PT-0003",
    name: "Priya Nair",
    dob: "1995-07-19",
    age: 29,
    phone: "(555) 482-6610",
    email: "priya.nair@inbox.io",
    assignedDentist: "Dr. Elena Vasquez",
    lastVisit: "2024-06-01",
    status: "active",
    bloodType: "B+",
    allergies: ["Aspirin"],
    insuranceProvider: "Cigna Dental",
    policyNumber: "CIG-30091-P",
  },
  {
    id: "p4",
    patientId: "PT-0004",
    name: "Thomas Brennan",
    dob: "1962-01-30",
    age: 62,
    phone: "(555) 519-7743",
    email: "tbrennan@oldmail.net",
    assignedDentist: "Dr. James Okafor",
    lastVisit: "2024-03-15",
    status: "inactive",
    bloodType: "AB+",
    allergies: ["Codeine"],
    insuranceProvider: "MetLife Dental",
    policyNumber: "MET-77654-T",
  },
  {
    id: "p5",
    patientId: "PT-0005",
    name: "Amara Osei",
    dob: "2001-09-08",
    age: 22,
    phone: "(555) 623-1190",
    email: "amara.osei@student.edu",
    assignedDentist: "Dr. Lena Park",
    lastVisit: "2024-05-22",
    nextAppointment: "2024-08-05",
    status: "active",
    bloodType: "O+",
    allergies: [],
    insuranceProvider: "Delta Dental",
    policyNumber: "DEL-44210-A",
  },
  {
    id: "p6",
    patientId: "PT-0006",
    name: "Nikolai Petrov",
    dob: "1980-04-17",
    age: 44,
    phone: "(555) 701-3388",
    email: "n.petrov@techcorp.com",
    assignedDentist: "Dr. Lena Park",
    lastVisit: "2024-02-10",
    status: "archived",
    bloodType: "A-",
    allergies: ["Sulfa"],
    insuranceProvider: "Humana Dental",
    policyNumber: "HUM-91023-N",
  },
  {
    id: "p7",
    patientId: "PT-0007",
    name: "Claire Fontaine",
    dob: "1991-12-25",
    age: 32,
    phone: "(555) 845-2267",
    email: "claire.f@designstudio.fr",
    assignedDentist: "Dr. Elena Vasquez",
    lastVisit: "2024-06-12",
    nextAppointment: "2024-07-30",
    status: "active",
    bloodType: "B-",
    allergies: [],
    insuranceProvider: "BlueCross BlueShield",
    policyNumber: "BCB-12987-C",
  },
  {
    id: "p8",
    patientId: "PT-0008",
    name: "Darius Whitfield",
    dob: "1969-06-03",
    age: 55,
    phone: "(555) 932-5541",
    email: "dwhitfield@lawfirm.com",
    assignedDentist: "Dr. James Okafor",
    lastVisit: "2024-04-05",
    status: "active",
    bloodType: "O+",
    allergies: ["Ibuprofen"],
    insuranceProvider: "Aetna Dental",
    policyNumber: "AET-66789-D",
  },
];

const MOCK_APPOINTMENTS: Record<string, Appointment[]> = {
  p1: [
    { id: "a1", patientId: "p1", patientName: "Sophia Hartwell", date: "2024-07-22", time: "10:00 AM", procedure: "Teeth Whitening", dentist: "Dr. Elena Vasquez", room: "Room 2", duration: 60, status: "confirmed" },
    { id: "a2", patientId: "p1", patientName: "Sophia Hartwell", date: "2024-05-10", time: "2:30 PM", procedure: "Routine Checkup", dentist: "Dr. Elena Vasquez", room: "Room 1", duration: 30, status: "completed" },
  ],
  p2: [
    { id: "a3", patientId: "p2", patientName: "Marcus Delgado", date: "2024-07-15", time: "9:00 AM", procedure: "Root Canal", dentist: "Dr. James Okafor", room: "Room 3", duration: 90, status: "confirmed" },
  ],
  p3: [
    { id: "a4", patientId: "p3", patientName: "Priya Nair", date: "2024-06-01", time: "11:00 AM", procedure: "Cavity Filling", dentist: "Dr. Elena Vasquez", room: "Room 1", duration: 45, status: "completed" },
  ],
  p5: [
    { id: "a5", patientId: "p5", patientName: "Amara Osei", date: "2024-08-05", time: "3:00 PM", procedure: "Orthodontic Consultation", dentist: "Dr. Lena Park", room: "Room 4", duration: 60, status: "pending" },
  ],
  p7: [
    { id: "a6", patientId: "p7", patientName: "Claire Fontaine", date: "2024-07-30", time: "1:00 PM", procedure: "Crown Fitting", dentist: "Dr. Elena Vasquez", room: "Room 2", duration: 75, status: "confirmed" },
  ],
};

const MOCK_TREATMENTS: Record<string, TreatmentPlan[]> = {
  p1: [
    { id: "t1", planId: "TP-0001", patientId: "p1", patientName: "Sophia Hartwell", procedure: "Teeth Whitening", dentist: "Dr. Elena Vasquez", startDate: "2024-07-22", status: "active" },
    { id: "t2", planId: "TP-0002", patientId: "p1", patientName: "Sophia Hartwell", procedure: "Dental Cleaning", dentist: "Dr. Elena Vasquez", startDate: "2024-05-10", status: "completed" },
  ],
  p2: [
    { id: "t3", planId: "TP-0003", patientId: "p2", patientName: "Marcus Delgado", procedure: "Root Canal Therapy", dentist: "Dr. James Okafor", startDate: "2024-07-15", estimatedCompletion: "2024-08-15", status: "active" },
  ],
  p7: [
    { id: "t4", planId: "TP-0004", patientId: "p7", patientName: "Claire Fontaine", procedure: "Porcelain Crown", dentist: "Dr. Elena Vasquez", startDate: "2024-06-01", estimatedCompletion: "2024-07-30", status: "active" },
  ],
};

const DENTISTS = ["All Dentists", "Dr. Elena Vasquez", "Dr. James Okafor", "Dr. Lena Park"];
const STATUSES = ["All Status", "active", "inactive", "archived"];
const PAGE_SIZE = 5;

// ─── Types ────────────────────────────────────────────────────────────────────

type SortField = "name" | "dob" | "lastVisit" | "assignedDentist";
type SortDir = "asc" | "desc";

interface FormData {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  policyNumber: string;
  assignedDentist: string;
  bloodType: string;
  allergies: string;
}

const EMPTY_FORM: FormData = {
  name: "",
  dob: "",
  gender: "female",
  phone: "",
  email: "",
  address: "",
  insuranceProvider: "",
  policyNumber: "",
  assignedDentist: "Dr. Elena Vasquez",
  bloodType: "O+",
  allergies: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-sky-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

function getAvatarColor(id: string): string {
  const idx = id.charCodeAt(id.length - 1) % avatarColors.length;
  return avatarColors[idx];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  inactive: { label: "Inactive", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  archived: { label: "Archived", cls: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400" },
  confirmed: { label: "Confirmed", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  pending: { label: "Pending", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  completed: { label: "Completed", cls: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  cancelled: { label: "Cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { label: status, cls: "bg-gray-100 text-gray-500" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", s.cls)}>
      {s.label}
    </span>
  );
}

// ─── Slide-over Panel ─────────────────────────────────────────────────────────

const slideOver: Variants = {
  hidden: { opacity: 0, x: 400 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

function SlideOverPanel({
  patient,
  onClose,
  onEdit,
}: {
  patient: Patient | null;
  onClose: () => void;
  onEdit: (p: Patient) => void;
}) {
  const appointments = patient ? (MOCK_APPOINTMENTS[patient.id] ?? []) : [];
  const treatments = patient ? (MOCK_TREATMENTS[patient.id] ?? []) : [];

  return (
    <AnimatePresence>
      {patient && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[var(--surface)] shadow-2xl border-l border-[var(--border)]"
            variants={slideOver}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-full text-white text-sm font-bold", getAvatarColor(patient.id))}>
                  {getInitials(patient.name)}
                </div>
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{patient.name}</p>
                  <p className="text-xs text-[var(--muted)]">{patient.patientId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(patient)}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)]/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                  aria-label="Close panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Personal Info */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Calendar, label: "Date of Birth", value: formatDate(patient.dob) },
                    { icon: User, label: "Age", value: `${patient.age} years` },
                    { icon: Phone, label: "Phone", value: patient.phone },
                    { icon: Mail, label: "Email", value: patient.email },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">{label}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--foreground)] truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Medical Info */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Medical Details</h3>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                      <Heart className="h-4 w-4 text-rose-400" />
                      Blood Type
                    </div>
                    <span className="text-sm font-semibold text-[var(--foreground)]">{patient.bloodType ?? "Unknown"}</span>
                  </div>
                  <div className="border-t border-[var(--border)] pt-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-[var(--muted)] mb-1">Allergies</p>
                        {(patient.allergies ?? []).length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {(patient.allergies ?? []).map((a) => (
                              <span key={a} className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                {a}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-[var(--muted)]">No known allergies</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Insurance */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Insurance</h3>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Provider</span>
                    <span className="font-medium text-[var(--foreground)]">{patient.insuranceProvider ?? "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Policy Number</span>
                    <span className="font-mono text-xs font-medium text-[var(--foreground)]">{patient.policyNumber ?? "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted)]">Assigned Dentist</span>
                    <span className="font-medium text-[var(--foreground)]">{patient.assignedDentist}</span>
                  </div>
                </div>
              </section>

              {/* Treatment History */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Treatment History</h3>
                {treatments.length > 0 ? (
                  <div className="space-y-2">
                    {treatments.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[var(--accent)]" />
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{t.procedure}</p>
                            <p className="text-xs text-[var(--muted)]">{formatDate(t.startDate)}</p>
                          </div>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)] italic">No treatment records found.</p>
                )}
              </section>

              {/* Upcoming Appointments */}
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Appointments</h3>
                {appointments.length > 0 ? (
                  <div className="space-y-2">
                    {appointments.map((a) => (
                      <div key={a.id} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[var(--accent)]" />
                          <div>
                            <p className="text-sm font-medium text-[var(--foreground)]">{a.procedure}</p>
                            <p className="text-xs text-[var(--muted)]">{formatDate(a.date)} at {a.time}</p>
                          </div>
                        </div>
                        <StatusBadge status={a.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)] italic">No appointments scheduled.</p>
                )}
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function PatientModal({
  open,
  editingPatient,
  onClose,
  onSave,
}: {
  open: boolean;
  editingPatient: Patient | null;
  onClose: () => void;
  onSave: (data: FormData, id?: string) => void;
}) {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  // Sync form when editing patient changes
  useState(() => {
    if (editingPatient) {
      setForm({
        name: editingPatient.name,
        dob: editingPatient.dob,
        gender: "female",
        phone: editingPatient.phone,
        email: editingPatient.email,
        address: "",
        insuranceProvider: editingPatient.insuranceProvider ?? "",
        policyNumber: editingPatient.policyNumber ?? "",
        assignedDentist: editingPatient.assignedDentist,
        bloodType: editingPatient.bloodType ?? "O+",
        allergies: (editingPatient.allergies ?? []).join(", "),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form, editingPatient?.id);
    onClose();
  };

  const inputCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  {editingPatient ? "Edit Patient" : "Add New Patient"}
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5">
                <div className="space-y-5">
                  {/* Personal */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Personal Details</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Full Name *</label>
                        <input required className={inputCls} placeholder="e.g. Jane Smith" value={form.name} onChange={(e) => update("name", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Date of Birth *</label>
                        <input required type="date" className={inputCls} value={form.dob} onChange={(e) => update("dob", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Gender</label>
                        <select className={inputCls} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer-not">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Phone *</label>
                        <input required className={inputCls} placeholder="(555) 000-0000" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" className={inputCls} placeholder="patient@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Address</label>
                        <input className={inputCls} placeholder="123 Main St, City, State, ZIP" value={form.address} onChange={(e) => update("address", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Medical */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Medical Information</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Blood Type</label>
                        <select className={inputCls} value={form.bloodType} onChange={(e) => update("bloodType", e.target.value)}>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bt) => (
                            <option key={bt} value={bt}>{bt}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Assigned Dentist</label>
                        <select className={inputCls} value={form.assignedDentist} onChange={(e) => update("assignedDentist", e.target.value)}>
                          {DENTISTS.filter((d) => d !== "All Dentists").map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelCls}>Allergies (comma-separated)</label>
                        <input className={inputCls} placeholder="e.g. Penicillin, Latex" value={form.allergies} onChange={(e) => update("allergies", e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Insurance */}
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Insurance</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label className={labelCls}>Insurance Provider</label>
                        <input className={inputCls} placeholder="e.g. BlueCross BlueShield" value={form.insuranceProvider} onChange={(e) => update("insuranceProvider", e.target.value)} />
                      </div>
                      <div>
                        <label className={labelCls}>Policy Number</label>
                        <input className={inputCls} placeholder="e.g. BCB-12345-X" value={form.policyNumber} onChange={(e) => update("policyNumber", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {editingPatient ? "Save Changes" : "Add Patient"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ patient, onConfirm, onCancel }: { patient: Patient; onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-base font-semibold text-[var(--foreground)]">Remove Patient</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Are you sure you want to remove <strong className="text-[var(--foreground)]">{patient.name}</strong>? This action cannot be undone.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-lg border border-[var(--border)] py-2 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Remove
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="h-3.5 w-3.5 text-[var(--muted)]" />;
  return sortDir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-[var(--accent)]" />
    : <ArrowDown className="h-3.5 w-3.5 text-[var(--accent)]" />;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const t = useTranslations();

  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dentistFilter, setDentistFilter] = useState("All Dentists");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...patients];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.patientId.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.phone.includes(q)
      );
    }
    if (statusFilter !== "All Status") list = list.filter((p) => p.status === statusFilter);
    if (dentistFilter !== "All Dentists") list = list.filter((p) => p.assignedDentist === dentistFilter);

    list.sort((a, b) => {
      let av = "";
      let bv = "";
      if (sortField === "name") { av = a.name; bv = b.name; }
      else if (sortField === "dob") { av = a.dob; bv = b.dob; }
      else if (sortField === "lastVisit") { av = a.lastVisit; bv = b.lastVisit; }
      else if (sortField === "assignedDentist") { av = a.assignedDentist; bv = b.assignedDentist; }
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });

    return list;
  }, [patients, search, statusFilter, dentistFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else setSortDir("asc");
      return field;
    });
    setPage(1);
  }, []);

  const handleSave = useCallback((data: FormData, id?: string) => {
    if (id) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: data.name,
                dob: data.dob,
                phone: data.phone,
                email: data.email,
                assignedDentist: data.assignedDentist,
                insuranceProvider: data.insuranceProvider,
                policyNumber: data.policyNumber,
                bloodType: data.bloodType,
                allergies: data.allergies.split(",").map((a) => a.trim()).filter(Boolean),
              }
            : p
        )
      );
    } else {
      const newId = `p${Date.now()}`;
      const newPatient: Patient = {
        id: newId,
        patientId: `PT-${String(patients.length + 1).padStart(4, "0")}`,
        name: data.name,
        dob: data.dob,
        age: new Date().getFullYear() - new Date(data.dob).getFullYear(),
        phone: data.phone,
        email: data.email,
        assignedDentist: data.assignedDentist,
        lastVisit: "—",
        status: "active",
        bloodType: data.bloodType as Patient["bloodType"],
        allergies: data.allergies.split(",").map((a) => a.trim()).filter(Boolean),
        insuranceProvider: data.insuranceProvider || undefined,
        policyNumber: data.policyNumber || undefined,
      };
      setPatients((prev) => [newPatient, ...prev]);
    }
  }, [patients.length]);

  const handleDelete = useCallback(() => {
    if (!deletingPatient) return;
    setPatients((prev) => prev.filter((p) => p.id !== deletingPatient.id));
    if (selectedPatient?.id === deletingPatient.id) setSelectedPatient(null);
    setDeletingPatient(null);
  }, [deletingPatient, selectedPatient]);

  const openAdd = () => {
    setEditingPatient(null);
    setModalOpen(true);
  };

  const openEdit = (p: Patient) => {
    setEditingPatient(p);
    setModalOpen(true);
  };

  const thCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)] whitespace-nowrap";
  const tdCls = "px-4 py-3 text-sm text-[var(--foreground)]";

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Page Header ── */}
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* Breadcrumb */}
              <nav className="mb-1 flex items-center gap-1.5 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
                <span>{t("patients.breadcrumb.home")}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-[var(--foreground)] font-medium">{t("patients.breadcrumb.patients")}</span>
              </nav>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
                {t("patients.heading")}
              </h1>
              <p className="mt-0.5 text-sm text-[var(--muted)]">{t("patients.subheading")}</p>
            </div>
            <motion.button
              onClick={openAdd}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              {t("patients.addButton")}
            </motion.button>
          </div>
        </Reveal>

        {/* ── Search + Filters ── */}
        <Reveal delay={0.05}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="search"
                  placeholder={t("patients.searchPlaceholder")}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-3 pr-8 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all cursor-pointer"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>

              {/* Dentist filter */}
              <div className="relative">
                <select
                  value={dentistFilter}
                  onChange={(e) => { setDentistFilter(e.target.value); setPage(1); }}
                  className="appearance-none rounded-lg border border-[var(--border)] bg-[var(--background)] py-2 pl-3 pr-8 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 transition-all cursor-pointer"
                >
                  {DENTISTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>
            </div>

            {/* Result count */}
            <p className="mt-3 text-xs text-[var(--muted)]">
              {t("patients.resultCount", { count: filtered.length, total: patients.length })}
            </p>
          </div>
        </Reveal>

        {/* ── Data Table ── */}
        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="border-b border-[var(--border)] bg-[var(--background)]/60">
                  <tr>
                    {/* Name */}
                    <th className={thCls}>
                      <button
                        onClick={() => handleSort("name")}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                      >
                        {t("patients.table.name")}
                        <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                      </button>
                    </th>
                    {/* DOB */}
                    <th className={thCls}>
                      <button
                        onClick={() => handleSort("dob")}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                      >
                        {t("patients.table.dob")}
                        <SortIcon field="dob" sortField={sortField} sortDir={sortDir} />
                      </button>
                    </th>
                    <th className={thCls}>{t("patients.table.phone")}</th>
                    {/* Last Visit */}
                    <th className={thCls}>
                      <button
                        onClick={() => handleSort("lastVisit")}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                      >
                        {t("patients.table.lastVisit")}
                        <SortIcon field="lastVisit" sortField={sortField} sortDir={sortDir} />
                      </button>
                    </th>
                    {/* Dentist */}
                    <th className={thCls}>
                      <button
                        onClick={() => handleSort("assignedDentist")}
                        className="inline-flex items-center gap-1.5 hover:text-[var(--foreground)] transition-colors"
                      >
                        {t("patients.table.dentist")}
                        <SortIcon field="assignedDentist" sortField={sortField} sortDir={sortDir} />
                      </button>
                    </th>
                    <th className={thCls}>{t("patients.table.status")}</th>
                    <th className={cn(thCls, "text-right")}>{t("patients.table.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <AnimatePresence mode="popLayout">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-sm text-[var(--muted)]">
                          {t("patients.empty")}
                        </td>
                      </tr>
                    ) : (
                      paginated.map((patient, i) => (
                        <motion.tr
                          key={patient.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className={cn(
                            "group hover:bg-[var(--accent)]/5 transition-colors cursor-pointer",
                            selectedPatient?.id === patient.id && "bg-[var(--accent)]/8"
                          )}
                          onClick={() => setSelectedPatient(patient)}
                        >
                          {/* Name + Avatar */}
                          <td className={tdCls}>
                            <div className="flex items-center gap-3">
                              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold", getAvatarColor(patient.id))}>
                                {getInitials(patient.name)}
                              </div>
                              <div>
                                <p className="font-medium text-[var(--foreground)]">{patient.name}</p>
                                <p className="text-xs text-[var(--muted)]">{patient.patientId}</p>
                              </div>
                            </div>
                          </td>
                          {/* DOB */}
                          <td className={tdCls}>
                            <span className="text-[var(--muted)]">{formatDate(patient.dob)}</span>
                          </td>
                          {/* Phone */}
                          <td className={tdCls}>{patient.phone}</td>
                          {/* Last Visit */}
                          <td className={tdCls}>
                            <span className="text-[var(--muted)]">{formatDate(patient.lastVisit)}</span>
                          </td>
                          {/* Dentist */}
                          <td className={tdCls}>
                            <span className="text-sm">{patient.assignedDentist}</span>
                          </td>
                          {/* Status */}
                          <td className={tdCls}>
                            <StatusBadge status={patient.status} />
                          </td>
                          {/* Actions */}
                          <td className={cn(tdCls, "text-right")}>
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}
                                className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                                aria-label={`View ${patient.name}`}
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); openEdit(patient); }}
                                className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] transition-colors"
                                aria-label={`Edit ${patient.name}`}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setDeletingPatient(patient); }}
                                className="rounded-lg p-1.5 text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                aria-label={`Delete ${patient.name}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
                <p className="text-xs text-[var(--muted)]">
                  {t("patients.pagination.showing", {
                    from: (page - 1) * PAGE_SIZE + 1,
                    to: Math.min(page * PAGE_SIZE, filtered.length),
                    total: filtered.length,
                  })}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={cn(
                        "h-7 w-7 rounded-lg text-xs font-medium transition-colors",
                        pg === page
                          ? "bg-[var(--accent)] text-white"
                          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
                      )}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* ── Stats Row ── */}
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: t("patients.stats.total"), value: patients.length, color: "text-[var(--accent)]" },
              { label: t("patients.stats.active"), value: patients.filter((p) => p.status === "active").length, color: "text-emerald-500" },
              { label: t("patients.stats.inactive"), value: patients.filter((p) => p.status === "inactive").length, color: "text-amber-500" },
              { label: t("patients.stats.archived"), value: patients.filter((p) => p.status === "archived").length, color: "text-slate-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              >
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
                <p className={cn("mt-1 text-2xl font-bold", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Slide-over Detail Panel ── */}
      <SlideOverPanel
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onEdit={(p) => { openEdit(p); setSelectedPatient(null); }}
      />

      {/* ── Add/Edit Modal ── */}
      <PatientModal
        open={modalOpen}
        editingPatient={editingPatient}
        onClose={() => { setModalOpen(false); setEditingPatient(null); }}
        onSave={handleSave}
      />

      {/* ── Delete Confirm ── */}
      {deletingPatient && (
        <DeleteConfirm
          patient={deletingPatient}
          onConfirm={handleDelete}
          onCancel={() => setDeletingPatient(null)}
        />
      )}
    </main>
  );
}