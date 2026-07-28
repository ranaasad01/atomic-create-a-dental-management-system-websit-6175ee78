"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Calendar, List, Plus, ChevronLeft, ChevronRight, Search, Filter, Clock, User, Stethoscope, Bell, X, Check, AlertCircle, MoreHorizontal, Phone, Mail, FileText, ChevronDown } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DENTISTS = [
  { id: "d1", name: "Dr. Sarah Chen", specialty: "General Dentistry" },
  { id: "d2", name: "Dr. Marcus Webb", specialty: "Orthodontics" },
  { id: "d3", name: "Dr. Priya Nair", specialty: "Endodontics" },
  { id: "d4", name: "Dr. James Okafor", specialty: "Oral Surgery" },
];

const APPOINTMENT_TYPES = [
  "Routine Checkup",
  "Teeth Cleaning",
  "Cavity Filling",
  "Root Canal",
  "Orthodontic Adjustment",
  "Tooth Extraction",
  "Teeth Whitening",
  "Crown Fitting",
  "Implant Consultation",
  "Emergency Visit",
];

type ApptStatus = "confirmed" | "pending" | "cancelled" | "completed" | "no-show";

interface MockAppointment {
  id: string;
  patientName: string;
  patientId: string;
  dentist: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: string;
  duration: number; // minutes
  status: ApptStatus;
  room: string;
  phone: string;
  email: string;
  notes?: string;
  reminderSent: boolean;
}

const MOCK_APPOINTMENTS: MockAppointment[] = [
  { id: "a1", patientName: "Emily Hartwell", patientId: "p1", dentist: "Dr. Sarah Chen", dentistId: "d1", date: "2025-07-14", time: "09:00", type: "Routine Checkup", duration: 45, status: "confirmed", room: "Room 1", phone: "+1 555-0101", email: "emily.h@email.com", reminderSent: true },
  { id: "a2", patientName: "Marcus Johnson", patientId: "p2", dentist: "Dr. Marcus Webb", dentistId: "d2", date: "2025-07-14", time: "10:30", type: "Orthodontic Adjustment", duration: 30, status: "confirmed", room: "Room 3", phone: "+1 555-0102", email: "marcus.j@email.com", reminderSent: false },
  { id: "a3", patientName: "Sofia Reyes", patientId: "p3", dentist: "Dr. Priya Nair", dentistId: "d3", date: "2025-07-14", time: "11:00", type: "Root Canal", duration: 90, status: "pending", room: "Room 2", phone: "+1 555-0103", email: "sofia.r@email.com", reminderSent: false },
  { id: "a4", patientName: "David Kim", patientId: "p4", dentist: "Dr. Sarah Chen", dentistId: "d1", date: "2025-07-15", time: "09:30", type: "Cavity Filling", duration: 60, status: "confirmed", room: "Room 1", phone: "+1 555-0104", email: "david.k@email.com", reminderSent: true },
  { id: "a5", patientName: "Aisha Patel", patientId: "p5", dentist: "Dr. James Okafor", dentistId: "d4", date: "2025-07-15", time: "14:00", type: "Tooth Extraction", duration: 45, status: "pending", room: "Room 4", phone: "+1 555-0105", email: "aisha.p@email.com", reminderSent: false },
  { id: "a6", patientName: "Robert Nguyen", patientId: "p6", dentist: "Dr. Marcus Webb", dentistId: "d2", date: "2025-07-16", time: "10:00", type: "Orthodontic Adjustment", duration: 30, status: "confirmed", room: "Room 3", phone: "+1 555-0106", email: "robert.n@email.com", reminderSent: true },
  { id: "a7", patientName: "Clara Osei", patientId: "p7", dentist: "Dr. Sarah Chen", dentistId: "d1", date: "2025-07-17", time: "08:30", type: "Teeth Cleaning", duration: 45, status: "completed", room: "Room 1", phone: "+1 555-0107", email: "clara.o@email.com", reminderSent: true },
  { id: "a8", patientName: "Thomas Brennan", patientId: "p8", dentist: "Dr. Priya Nair", dentistId: "d3", date: "2025-07-17", time: "13:00", type: "Root Canal", duration: 90, status: "cancelled", room: "Room 2", phone: "+1 555-0108", email: "thomas.b@email.com", reminderSent: false },
  { id: "a9", patientName: "Yuki Tanaka", patientId: "p9", dentist: "Dr. James Okafor", dentistId: "d4", date: "2025-07-18", time: "11:30", type: "Implant Consultation", duration: 60, status: "confirmed", room: "Room 4", phone: "+1 555-0109", email: "yuki.t@email.com", reminderSent: false },
  { id: "a10", patientName: "Lena Müller", patientId: "p10", dentist: "Dr. Sarah Chen", dentistId: "d1", date: "2025-07-21", time: "09:00", type: "Crown Fitting", duration: 75, status: "pending", room: "Room 1", phone: "+1 555-0110", email: "lena.m@email.com", reminderSent: false },
  { id: "a11", patientName: "Carlos Vega", patientId: "p11", dentist: "Dr. Marcus Webb", dentistId: "d2", date: "2025-07-22", time: "15:00", type: "Routine Checkup", duration: 45, status: "confirmed", room: "Room 3", phone: "+1 555-0111", email: "carlos.v@email.com", reminderSent: true },
  { id: "a12", patientName: "Fatima Al-Hassan", patientId: "p12", dentist: "Dr. Priya Nair", dentistId: "d3", date: "2025-07-23", time: "10:00", type: "Teeth Whitening", duration: 60, status: "confirmed", room: "Room 2", phone: "+1 555-0112", email: "fatima.a@email.com", reminderSent: false },
  { id: "a13", patientName: "Noah Williams", patientId: "p13", dentist: "Dr. Sarah Chen", dentistId: "d1", date: "2025-07-07", time: "09:00", type: "Routine Checkup", duration: 45, status: "completed", room: "Room 1", phone: "+1 555-0113", email: "noah.w@email.com", reminderSent: true },
  { id: "a14", patientName: "Isabella Torres", patientId: "p14", dentist: "Dr. James Okafor", dentistId: "d4", date: "2025-07-08", time: "14:30", type: "Emergency Visit", duration: 30, status: "completed", room: "Room 4", phone: "+1 555-0114", email: "isabella.t@email.com", reminderSent: true },
  { id: "a15", patientName: "Ethan Park", patientId: "p15", dentist: "Dr. Marcus Webb", dentistId: "d2", date: "2025-07-28", time: "11:00", type: "Orthodontic Adjustment", duration: 30, status: "pending", room: "Room 3", phone: "+1 555-0115", email: "ethan.p@email.com", reminderSent: false },
];

const PATIENTS_LIST = [
  "Emily Hartwell", "Marcus Johnson", "Sofia Reyes", "David Kim", "Aisha Patel",
  "Robert Nguyen", "Clara Osei", "Thomas Brennan", "Yuki Tanaka", "Lena Müller",
  "Carlos Vega", "Fatima Al-Hassan", "Noah Williams", "Isabella Torres", "Ethan Park",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const STATUS_CONFIG: Record<ApptStatus, { label: string; className: string; dot: string }> = {
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 border border-red-200", dot: "bg-red-500" },
  completed: { label: "Completed", className: "bg-sky-100 text-sky-700 border border-sky-200", dot: "bg-sky-500" },
  "no-show": { label: "No Show", className: "bg-slate-100 text-slate-600 border border-slate-200", dot: "bg-slate-400" },
};

const tabVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ApptStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", cfg.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

interface BookingModalProps {
  onClose: () => void;
}

function BookingModal({ onClose }: BookingModalProps) {
  const t = useTranslations();
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [dentist, setDentist] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [apptType, setApptType] = useState("");
  const [notes, setNotes] = useState("");
  const [reminder, setReminder] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const filteredPatients = PATIENTS_LIST.filter(p =>
    p.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">{t("bookingModal.title")}</h2>
            <p className="text-sm text-[var(--muted)]">{t("bookingModal.subtitle")}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
            aria-label={t("bookingModal.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-7 w-7 text-emerald-600" />
            </div>
            <p className="text-base font-semibold text-[var(--foreground)]">{t("bookingModal.success")}</p>
            <p className="text-sm text-[var(--muted)]">{t("bookingModal.successSub")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
            {/* Patient Search */}
            <div className="relative">
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.patient")}</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  type="text"
                  value={selectedPatient || patientSearch}
                  onChange={e => {
                    setPatientSearch(e.target.value);
                    setSelectedPatient("");
                    setShowPatientDropdown(true);
                  }}
                  onFocus={() => setShowPatientDropdown(true)}
                  placeholder={t("bookingModal.patientPlaceholder")}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </div>
              {showPatientDropdown && filteredPatients.length > 0 && !selectedPatient && (
                <div className="absolute z-20 mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
                  {filteredPatients.slice(0, 5).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { setSelectedPatient(p); setPatientSearch(""); setShowPatientDropdown(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
                    >
                      <User className="h-3.5 w-3.5 text-[var(--muted)]" />
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dentist */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.dentist")}</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <select
                  value={dentist}
                  onChange={e => setDentist(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-9 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                >
                  <option value="">{t("bookingModal.dentistPlaceholder")}</option>
                  {DENTISTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.date")}</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.time")}</label>
                <input
                  type="time"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                />
              </div>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.type")}</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
                <select
                  value={apptType}
                  onChange={e => setApptType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-2.5 pl-9 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
                >
                  <option value="">{t("bookingModal.typePlaceholder")}</option>
                  {APPOINTMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">{t("bookingModal.notes")}</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                placeholder={t("bookingModal.notesPlaceholder")}
                className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
              />
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-[var(--accent)]" />
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">{t("bookingModal.reminder")}</p>
                  <p className="text-xs text-[var(--muted)]">{t("bookingModal.reminderSub")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReminder(r => !r)}
                className={cn(
                  "relative h-6 w-11 rounded-full transition-colors duration-200",
                  reminder ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                )}
                aria-label={t("bookingModal.reminderToggle")}
              >
                <span className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                  reminder ? "translate-x-5" : "translate-x-0.5"
                )} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[var(--border)] bg-transparent py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
              >
                {t("bookingModal.cancel")}
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {t("bookingModal.confirm")}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Calendar View ────────────────────────────────────────────────────────────

interface CalendarViewProps {
  appointments: MockAppointment[];
}

function CalendarView({ appointments }: CalendarViewProps) {
  const t = useTranslations();
  const today = new Date(2025, 6, 14); // July 14, 2025 (fixed for demo)
  const [viewYear, setViewYear] = useState(2025);
  const [viewMonth, setViewMonth] = useState(6); // July
  const [selectedDay, setSelectedDay] = useState<number | null>(14);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const apptsByDay = useMemo(() => {
    const map: Record<number, MockAppointment[]> = {};
    appointments.forEach(a => {
      const [y, m, d] = a.date.split("-").map(Number);
      if (y === viewYear && m - 1 === viewMonth) {
        if (!map[d]) map[d] = [];
        map[d].push(a);
      }
    });
    return map;
  }, [appointments, viewYear, viewMonth]);

  const selectedDayAppts = selectedDay ? (apptsByDay[selectedDay] ?? []) : [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <div className="flex gap-6">
      {/* Calendar Grid */}
      <div className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
        {/* Month Nav */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              aria-label={t("calendar.prevMonth")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              aria-label={t("calendar.nextMonth")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {DAY_NAMES.map(d => (
            <div key={d} className="py-1 text-center text-xs font-medium text-[var(--muted)]">{d}</div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayAppts = apptsByDay[day] ?? [];
            const isSelected = selectedDay === day;
            const isTodayDay = isToday(day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={cn(
                  "relative flex min-h-[52px] flex-col items-center rounded-xl p-1.5 text-sm transition-all",
                  isSelected
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : isTodayDay
                    ? "bg-[var(--accent)]/10 text-[var(--accent)] font-semibold"
                    : "text-[var(--foreground)] hover:bg-[var(--background)]"
                )}
              >
                <span className="font-medium">{day}</span>
                {dayAppts.length > 0 && (
                  <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                    {dayAppts.slice(0, 3).map(a => (
                      <span
                        key={a.id}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          isSelected ? "bg-white/80" : STATUS_CONFIG[a.status].dot
                        )}
                      />
                    ))}
                    {dayAppts.length > 3 && (
                      <span className={cn("text-[9px] font-bold leading-none", isSelected ? "text-white/80" : "text-[var(--muted)]")}>
                        +{dayAppts.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--border)] pt-4">
          {(Object.entries(STATUS_CONFIG) as [ApptStatus, typeof STATUS_CONFIG[ApptStatus]][]).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
              <span className="text-xs text-[var(--muted)]">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day Panel */}
      <div className="w-80 shrink-0">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
          <h3 className="mb-4 text-sm font-semibold text-[var(--foreground)]">
            {selectedDay
              ? `${MONTH_NAMES[viewMonth]} ${selectedDay}, ${viewYear}`
              : t("calendar.selectDay")}
          </h3>
          {selectedDay === null ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Calendar className="h-8 w-8 text-[var(--muted)]" />
              <p className="text-sm text-[var(--muted)]">{t("calendar.clickDay")}</p>
            </div>
          ) : selectedDayAppts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <Check className="h-8 w-8 text-emerald-400" />
              <p className="text-sm font-medium text-[var(--foreground)]">{t("calendar.noAppts")}</p>
              <p className="text-xs text-[var(--muted)]">{t("calendar.freeDay")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayAppts.map(a => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--foreground)]">{a.patientName}</p>
                      <p className="text-xs text-[var(--muted)]">{a.type}</p>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(a.time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3" />
                      {a.dentist.replace("Dr. ", "")}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-[var(--muted)]">{a.room} · {a.duration} min</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────────────────────────────

interface ListViewProps {
  appointments: MockAppointment[];
}

function ListView({ appointments }: ListViewProps) {
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dentistFilter, setDentistFilter] = useState<string>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const STATUS_OPTIONS = ["all", "confirmed", "pending", "completed", "cancelled", "no-show"];

  const filtered = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch =
        a.patientName.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.dentist.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || a.status === statusFilter;
      const matchDentist = dentistFilter === "all" || a.dentistId === dentistFilter;
      return matchSearch && matchStatus && matchDentist;
    });
  }, [appointments, search, statusFilter, dentistFilter]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("listView.searchPlaceholder")}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-4 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === "all" ? t("listView.allStatuses") : STATUS_CONFIG[s as ApptStatus]?.label ?? s}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        </div>
        <div className="relative">
          <Stethoscope className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
          <select
            value={dentistFilter}
            onChange={e => setDentistFilter(e.target.value)}
            className="appearance-none rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-9 pr-8 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          >
            <option value="all">{t("listView.allDentists")}</option>
            {DENTISTS.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
        </div>
        <span className="ml-auto text-sm text-[var(--muted)]">
          {filtered.length} {t("listView.results")}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {[t("listView.colPatient"), t("listView.colDentist"), t("listView.colDateTime"), t("listView.colType"), t("listView.colDuration"), t("listView.colStatus"), t("listView.colActions")].map(col => (
                <th key={col} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--muted)]">
                  {t("listView.noResults")}
                </td>
              </tr>
            ) : (
              filtered.map((a, idx) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border-b border-[var(--border)] transition-colors hover:bg-[var(--background)]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">
                        {a.patientName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">{a.patientName}</p>
                        <p className="text-xs text-[var(--muted)]">{a.room}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[var(--foreground)]">{a.dentist}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-[var(--foreground)]">{formatDate(a.date)}</p>
                    <p className="text-xs text-[var(--muted)]">{formatTime(a.time)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-[var(--foreground)]">{a.type}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-[var(--foreground)]">{a.duration} min</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                        className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                        aria-label={t("listView.actions")}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {openMenu === a.id && (
                        <div className="absolute right-0 z-10 mt-1 w-40 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-1 shadow-lg">
                          {[
                            { label: t("listView.actionView"), icon: <User className="h-3.5 w-3.5" /> },
                            { label: t("listView.actionEdit"), icon: <FileText className="h-3.5 w-3.5" /> },
                            { label: t("listView.actionReminder"), icon: <Bell className="h-3.5 w-3.5" /> },
                            { label: t("listView.actionCancel"), icon: <X className="h-3.5 w-3.5" /> },
                          ].map(item => (
                            <button
                              key={item.label}
                              onClick={() => setOpenMenu(null)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--background)]"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Reminders Sidebar ────────────────────────────────────────────────────────

function RemindersSidebar({ appointments }: { appointments: MockAppointment[] }) {
  const t = useTranslations();
  const [sent, setSent] = useState<Set<string>>(new Set());

  const upcoming = useMemo(() =>
    appointments
      .filter(a => (a.status === "confirmed" || a.status === "pending") && !a.reminderSent)
      .slice(0, 6),
    [appointments]
  );

  const handleSend = useCallback((id: string) => {
    setSent(prev => new Set([...prev, id]));
  }, []);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.08)]">
      <div className="mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-[var(--accent)]" />
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{t("reminders.title")}</h3>
        <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
          {upcoming.filter(a => !sent.has(a.id)).length} {t("reminders.pending")}
        </span>
      </div>
      <p className="mb-4 text-xs text-[var(--muted)]">{t("reminders.subtitle")}</p>

      {upcoming.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <Check className="h-7 w-7 text-emerald-400" />
          <p className="text-sm text-[var(--muted)]">{t("reminders.allSent")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcoming.map(a => (
            <div
              key={a.id}
              className={cn(
                "rounded-xl border p-3 transition-all",
                sent.has(a.id)
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[var(--border)] bg-[var(--background)]"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--foreground)]">{a.patientName}</p>
                  <p className="text-xs text-[var(--muted)]">{a.type}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[var(--muted)]">
                    <span>{formatDate(a.date)}</span>
                    <span>·</span>
                    <span>{formatTime(a.time)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <a
                  href={`tel:${a.phone}`}
                  className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  aria-label={`${t("reminders.call")} ${a.patientName}`}
                >
                  <Phone className="h-3 w-3" />
                  {t("reminders.call")}
                </a>
                <a
                  href={`mailto:${a.email}`}
                  className="flex items-center gap-1 rounded-lg border border-[var(--border)] px-2 py-1 text-xs text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
                  aria-label={`${t("reminders.email")} ${a.patientName}`}
                >
                  <Mail className="h-3 w-3" />
                  {t("reminders.email")}
                </a>
                {sent.has(a.id) ? (
                  <span className="ml-auto flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <Check className="h-3 w-3" />
                    {t("reminders.sent")}
                  </span>
                ) : (
                  <button
                    onClick={() => handleSend(a.id)}
                    className="ml-auto flex items-center gap-1 rounded-lg bg-[var(--accent)] px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    <Bell className="h-3 w-3" />
                    {t("reminders.send")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4">
        <div className="rounded-xl bg-[var(--background)] p-3 text-center">
          <p className="text-xl font-bold text-[var(--foreground)]">
            {appointments.filter(a => a.status === "confirmed").length}
          </p>
          <p className="text-xs text-[var(--muted)]">{t("reminders.statConfirmed")}</p>
        </div>
        <div className="rounded-xl bg-[var(--background)] p-3 text-center">
          <p className="text-xl font-bold text-amber-600">
            {appointments.filter(a => a.status === "pending").length}
          </p>
          <p className="text-xs text-[var(--muted)]">{t("reminders.statPending")}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ViewMode = "calendar" | "list";

export default function AppointmentsPage() {
  const t = useTranslations();
  const [view, setView] = useState<ViewMode>("calendar");
  const [showModal, setShowModal] = useState(false);

  const todayStats = useMemo(() => {
    const today = MOCK_APPOINTMENTS.filter(a => a.date === "2025-07-14");
    return {
      total: today.length,
      confirmed: today.filter(a => a.status === "confirmed").length,
      pending: today.filter(a => a.status === "pending").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <Reveal>
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                {t("appointments.title")}
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("appointments.subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1">
                <button
                  onClick={() => setView("calendar")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    view === "calendar"
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Calendar className="h-4 w-4" />
                  {t("appointments.calendarView")}
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
                    view === "list"
                      ? "bg-[var(--accent)] text-white shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--foreground)]"
                  )}
                >
                  <List className="h-4 w-4" />
                  {t("appointments.listView")}
                </button>
              </div>

              {/* Book Button */}
              <motion.button
                onClick={() => setShowModal(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                {t("appointments.bookBtn")}
              </motion.button>
            </div>
          </div>
        </Reveal>

        {/* Quick Stats */}
        <Reveal delay={0.05}>
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t("appointments.statToday"), value: todayStats.total, color: "text-[var(--foreground)]", bg: "bg-[var(--surface)]" },
              { label: t("appointments.statConfirmed"), value: todayStats.confirmed, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: t("appointments.statPending"), value: todayStats.pending, color: "text-amber-600", bg: "bg-amber-50" },
              { label: t("appointments.statTotal"), value: MOCK_APPOINTMENTS.length, color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/5" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={cn("rounded-xl border border-[var(--border)] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]", stat.bg)}
              >
                <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* View Area */}
          <div className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              {view === "calendar" ? (
                <motion.div
                  key="calendar"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Reveal>
                    <CalendarView appointments={MOCK_APPOINTMENTS} />
                  </Reveal>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Reveal>
                    <ListView appointments={MOCK_APPOINTMENTS} />
                  </Reveal>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reminders Sidebar */}
          <div className="hidden w-72 shrink-0 xl:block">
            <Reveal delay={0.1}>
              <RemindersSidebar appointments={MOCK_APPOINTMENTS} />
            </Reveal>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && <BookingModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}