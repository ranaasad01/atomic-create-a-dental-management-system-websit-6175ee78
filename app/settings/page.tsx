"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Bell, Shield, Building2, CreditCard, Mail, Phone, Globe, Clock, Save, Eye, EyeOff, Check, AlertCircle, Palette, Database, FileText, ChevronRight } from 'lucide-react';
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const SETTINGS_TABS = [
  { id: "practice", label: "Practice Info", icon: Building2 },
  { id: "profile", label: "My Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Subscription", icon: CreditCard },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "data", label: "Data & Privacy", icon: Database },
] as const;

type TabId = (typeof SETTINGS_TABS)[number]["id"];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
];

const LANGUAGES = ["English (US)", "English (UK)", "Spanish", "French", "German", "Portuguese"];

const THEMES = [
  { id: "system", label: "System Default" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
];

const ACCENT_COLORS = [
  { id: "blue", label: "Ocean Blue", value: "#3B82F6" },
  { id: "teal", label: "Teal", value: "#14B8A6" },
  { id: "violet", label: "Violet", value: "#8B5CF6" },
  { id: "emerald", label: "Emerald", value: "#10B981" },
  { id: "rose", label: "Rose", value: "#F43F5E" },
];

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

function FormField({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 transition-all duration-200"
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[var(--muted)]">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30",
          checked ? "bg-[var(--accent)]" : "bg-[var(--border)]"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300",
        saved
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          : "bg-[var(--accent)] text-white hover:opacity-90"
      )}
    >
      {saved ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save Changes
        </>
      )}
    </motion.button>
  );
}

function PracticeTab() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "Bright Smile Dental Clinic",
    tagline: "Your comfort is our priority",
    address: "1420 Harbor Blvd, Suite 300",
    city: "Newport Beach",
    state: "CA",
    zip: "92660",
    phone: "(949) 555-0182",
    email: "hello@brightsmile.com",
    website: "www.brightsmile.com",
    timezone: "America/Los_Angeles",
    language: "English (US)",
    taxId: "82-4571039",
    licenseNumber: "DN-2024-00471",
  });

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Practice Information"
        description="Manage your clinic's public-facing details and regional settings."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Clinic Identity
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Practice Name" required>
            <Input value={form.name} onChange={set("name")} placeholder="Clinic name" />
          </FormField>
          <FormField label="Tagline">
            <Input value={form.tagline} onChange={set("tagline")} placeholder="Short description" />
          </FormField>
          <FormField label="Tax ID / EIN">
            <Input value={form.taxId} onChange={set("taxId")} placeholder="XX-XXXXXXX" />
          </FormField>
          <FormField label="License Number">
            <Input value={form.licenseNumber} onChange={set("licenseNumber")} placeholder="License #" />
          </FormField>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Contact Details
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Street Address">
            <Input value={form.address} onChange={set("address")} placeholder="Street address" />
          </FormField>
          <FormField label="City">
            <Input value={form.city} onChange={set("city")} placeholder="City" />
          </FormField>
          <FormField label="State">
            <Input value={form.state} onChange={set("state")} placeholder="State" />
          </FormField>
          <FormField label="ZIP Code">
            <Input value={form.zip} onChange={set("zip")} placeholder="ZIP" />
          </FormField>
          <FormField label="Phone">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => set("phone")(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
              />
            </div>
          </FormField>
          <FormField label="Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email")(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
              />
            </div>
          </FormField>
          <FormField label="Website">
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
              <input
                type="url"
                value={form.website}
                onChange={(e) => set("website")(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
              />
            </div>
          </FormField>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Regional Settings
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Timezone">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)] pointer-events-none z-10" />
              <select
                value={form.timezone}
                onChange={(e) => set("timezone")(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
          </FormField>
          <FormField label="Language">
            <Select value={form.language} onChange={set("language")} options={LANGUAGES} />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function ProfileTab() {
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "Dr. Sarah",
    lastName: "Mitchell",
    email: "sarah.mitchell@brightsmile.com",
    phone: "(949) 555-0199",
    role: "Dentist",
    specialty: "Orthodontics",
    bio: "Board-certified orthodontist with 12 years of experience specializing in Invisalign and traditional braces.",
    currentPassword: "",
    newPassword: "",
  });

  const set = (key: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="My Profile"
        description="Update your personal information and professional details."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-2xl font-bold text-[var(--accent)]">
            SM
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Profile Photo</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">JPG, PNG or GIF. Max 2MB.</p>
            <button className="mt-2 text-xs font-medium text-[var(--accent)] hover:underline">
              Upload new photo
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="First Name" required>
            <Input value={form.firstName} onChange={set("firstName")} />
          </FormField>
          <FormField label="Last Name" required>
            <Input value={form.lastName} onChange={set("lastName")} />
          </FormField>
          <FormField label="Email Address" required>
            <Input value={form.email} onChange={set("email")} type="email" />
          </FormField>
          <FormField label="Phone">
            <Input value={form.phone} onChange={set("phone")} type="tel" />
          </FormField>
          <FormField label="Role">
            <Input value={form.role} onChange={set("role")} disabled />
          </FormField>
          <FormField label="Specialty">
            <Input value={form.specialty} onChange={set("specialty")} />
          </FormField>
        </div>
        <FormField label="Professional Bio">
          <textarea
            value={form.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200 resize-none"
          />
        </FormField>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState({
    appointmentReminders: true,
    newPatientAlerts: true,
    billingAlerts: true,
    insuranceUpdates: false,
    staffMessages: true,
    systemUpdates: false,
    weeklyReports: true,
    smsReminders: false,
    emailDigest: true,
    pushNotifications: true,
  });

  const toggle = (key: keyof typeof prefs) => () =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Notification Preferences"
        description="Control which alerts and updates you receive and how they are delivered."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
          Clinical Alerts
        </h3>
        <div className="divide-y divide-[var(--border)]">
          <Toggle
            checked={prefs.appointmentReminders}
            onChange={toggle("appointmentReminders")}
            label="Appointment Reminders"
            description="Get notified 24 hours before scheduled appointments."
          />
          <Toggle
            checked={prefs.newPatientAlerts}
            onChange={toggle("newPatientAlerts")}
            label="New Patient Registrations"
            description="Alert when a new patient is added to your roster."
          />
          <Toggle
            checked={prefs.staffMessages}
            onChange={toggle("staffMessages")}
            label="Staff Messages"
            description="Receive in-app messages from colleagues and front desk."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
          Financial Alerts
        </h3>
        <div className="divide-y divide-[var(--border)]">
          <Toggle
            checked={prefs.billingAlerts}
            onChange={toggle("billingAlerts")}
            label="Billing & Payment Alerts"
            description="Notify when invoices are paid, overdue, or disputed."
          />
          <Toggle
            checked={prefs.insuranceUpdates}
            onChange={toggle("insuranceUpdates")}
            label="Insurance Claim Updates"
            description="Track claim approvals, denials, and resubmissions."
          />
          <Toggle
            checked={prefs.weeklyReports}
            onChange={toggle("weeklyReports")}
            label="Weekly Revenue Summary"
            description="Receive a weekly digest of billing and collection metrics."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)] mb-2">
          Delivery Channels
        </h3>
        <div className="divide-y divide-[var(--border)]">
          <Toggle
            checked={prefs.emailDigest}
            onChange={toggle("emailDigest")}
            label="Email Digest"
            description="Daily summary email of all activity."
          />
          <Toggle
            checked={prefs.smsReminders}
            onChange={toggle("smsReminders")}
            label="SMS Reminders"
            description="Text message alerts for urgent items."
          />
          <Toggle
            checked={prefs.pushNotifications}
            onChange={toggle("pushNotifications")}
            label="Push Notifications"
            description="Browser push notifications while using DentaCore."
          />
          <Toggle
            checked={prefs.systemUpdates}
            onChange={toggle("systemUpdates")}
            label="System & Maintenance Updates"
            description="Scheduled downtime and feature release announcements."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const SESSIONS = [
    { device: "Chrome on macOS", location: "Newport Beach, CA", time: "Active now", current: true },
    { device: "Safari on iPhone 15", location: "Newport Beach, CA", time: "2 hours ago", current: false },
    { device: "Chrome on Windows", location: "Los Angeles, CA", time: "Yesterday, 4:12 PM", current: false },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Security Settings"
        description="Manage your password, two-factor authentication, and active sessions."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Change Password
        </h3>
        <div className="space-y-4 max-w-md">
          {[
            { label: "Current Password", key: "current" as const, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
            { label: "New Password", key: "next" as const, show: showNew, toggle: () => setShowNew((v) => !v) },
            { label: "Confirm New Password", key: "confirm" as const, show: showConfirm, toggle: () => setShowConfirm((v) => !v) },
          ].map(({ label, key, show, toggle }) => (
            <FormField key={key} label={label}>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={passwords[key]}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 pr-10 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Two-Factor Authentication
        </h3>
        <Toggle
          checked={twoFactor}
          onChange={setTwoFactor}
          label="Enable 2FA via Authenticator App"
          description="Require a one-time code from Google Authenticator or Authy on each login."
        />
        <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/20 p-4">
          <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-600">
            Two-factor authentication is strongly recommended for HIPAA compliance. Disabling it may affect your practice's security posture.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Session Management
        </h3>
        <FormField label="Auto-logout After Inactivity">
          <Select
            value={sessionTimeout}
            onChange={setSessionTimeout}
            options={["15 minutes", "30 minutes", "1 hour", "2 hours", "4 hours"]}
          />
        </FormField>
        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium text-[var(--foreground)]">Active Sessions</p>
          {SESSIONS.map((s) => (
            <div
              key={s.device}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{s.device}</p>
                <p className="text-xs text-[var(--muted)]">
                  {s.location} · {s.time}
                </p>
              </div>
              {s.current ? (
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                  Current
                </span>
              ) : (
                <button className="text-xs font-medium text-rose-500 hover:underline">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function BillingTab() {
  const PLAN_FEATURES = [
    "Up to 5 dentists",
    "Unlimited patients",
    "Insurance claim management",
    "Advanced reporting",
    "Priority support",
    "HIPAA-compliant storage",
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Subscription & Billing"
        description="Manage your DentaCore plan, payment method, and billing history."
      />

      <div className="rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[var(--foreground)]">Professional Plan</span>
              <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Billed annually. Next renewal: March 15, 2026.
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--foreground)]">
              $149<span className="text-base font-normal text-[var(--muted)]">/month</span>
            </p>
          </div>
          <button className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground)] hover:border-[var(--accent)] transition-colors">
            Change Plan
          </button>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PLAN_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
              <Check className="h-4 w-4 text-[var(--accent)]" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Payment Method
        </h3>
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-12 rounded-md bg-slate-700 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Visa ending in 4821</p>
              <p className="text-xs text-[var(--muted)]">Expires 09/2027</p>
            </div>
          </div>
          <button className="text-xs font-medium text-[var(--accent)] hover:underline">
            Update
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Billing History
        </h3>
        <div className="space-y-2">
          {[
            { date: "Mar 15, 2025", amount: "$1,788.00", status: "Paid", invoice: "INV-2025-003" },
            { date: "Mar 15, 2024", amount: "$1,788.00", status: "Paid", invoice: "INV-2024-003" },
            { date: "Mar 15, 2023", amount: "$1,548.00", status: "Paid", invoice: "INV-2023-003" },
          ].map((row) => (
            <div
              key={row.invoice}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">{row.invoice}</p>
                <p className="text-xs text-[var(--muted)]">{row.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[var(--foreground)]">{row.amount}</span>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                  {row.status}
                </span>
                <button aria-label="Download invoice" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                  <FileText className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const [theme, setTheme] = useState("dark");
  const [accent, setAccent] = useState("blue");
  const [density, setDensity] = useState("comfortable");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Appearance"
        description="Customize how DentaCore looks and feels for your workflow."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Color Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                theme === t.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)]/50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Accent Color
        </h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccent(c.id)}
              aria-label={`Select ${c.label} accent`}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200",
                accent === c.id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)]/50"
              )}
            >
              <span
                className="h-3.5 w-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: c.value }}
              />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Layout Density
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {["compact", "comfortable", "spacious"].map((d) => (
            <button
              key={d}
              onClick={() => setDensity(d)}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all duration-200",
                density === d
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)]/50"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton onClick={handleSave} saved={saved} />
      </div>
    </div>
  );
}

function DataTab() {
  const [exportFormat, setExportFormat] = useState("CSV");

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Data & Privacy"
        description="Export your data, manage retention policies, and review HIPAA compliance settings."
      />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          Export Practice Data
        </h3>
        <p className="text-sm text-[var(--muted)]">
          Download a complete export of your patient records, appointments, billing data, and treatment plans. Exports are encrypted and HIPAA-compliant.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            value={exportFormat}
            onChange={setExportFormat}
            options={["CSV", "JSON", "PDF Report"]}
          />
          <button className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
            <Database className="h-4 w-4" />
            Request Export
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          HIPAA Compliance
        </h3>
        {[
          { label: "Data Encryption at Rest", status: "Enabled", ok: true },
          { label: "TLS 1.3 Encryption in Transit", status: "Enabled", ok: true },
          { label: "Audit Log Retention (7 years)", status: "Active", ok: true },
          { label: "Business Associate Agreement (BAA)", status: "Signed", ok: true },
          { label: "Automatic Session Timeout", status: "30 min", ok: true },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
          >
            <p className="text-sm text-[var(--foreground)]">{item.label}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[var(--muted)]">{item.status}</span>
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-500">
          Danger Zone
        </h3>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Delete Practice Account</p>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Permanently remove all data. This action cannot be undone and requires written confirmation.
            </p>
          </div>
          <button className="rounded-xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-500 hover:bg-rose-500/10 transition-colors">
            Request Deletion
          </button>
        </div>
      </div>
    </div>
  );
}

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  practice: PracticeTab,
  profile: ProfileTab,
  notifications: NotificationsTab,
  security: SecurityTab,
  billing: BillingTab,
  appearance: AppearanceTab,
  data: DataTab,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("practice");
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <main className="min-h-screen bg-[var(--background)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Settings
            </h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Configure your practice, profile, and system preferences.
            </p>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Sidebar */}
          <Reveal className="lg:w-60 flex-shrink-0">
            <nav className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 space-y-0.5">
              {SETTINGS_TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 text-left",
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "text-[var(--muted)] hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">{tab.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                  </button>
                );
              })}
            </nav>
          </Reveal>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Reveal key={activeTab}>
              <ActiveComponent />
            </Reveal>
          </div>
        </div>
      </div>
    </main>
  );
}