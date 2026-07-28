"use client";

import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Calendar, Users, FileText, Shield, BarChart, Clock, CheckCircle, Star, ArrowRight, Sparkles, Activity, Heart } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const FEATURES = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description:
      "Intelligent appointment booking with automated reminders, conflict detection, and real-time availability across all treatment rooms.",
  },
  {
    icon: Users,
    title: "Patient Records",
    description:
      "Comprehensive digital patient files with medical history, X-rays, treatment notes, and insurance details in one secure place.",
  },
  {
    icon: FileText,
    title: "Billing & Invoicing",
    description:
      "Generate invoices instantly, track payments, and manage outstanding balances with automated follow-up workflows.",
  },
  {
    icon: Shield,
    title: "Insurance Claims",
    description:
      "Submit, track, and manage insurance claims electronically. Reduce denials with built-in eligibility verification.",
  },
  {
    icon: BarChart,
    title: "Practice Analytics",
    description:
      "Actionable insights on revenue, patient retention, appointment trends, and staff performance to grow your practice.",
  },
  {
    icon: Activity,
    title: "Treatment Planning",
    description:
      "Build multi-stage treatment plans, track progress, and keep patients informed at every step of their care journey.",
  },
];

const STATS = [
  { value: "2,400+", label: "Dental Practices" },
  { value: "1.2M", label: "Patients Managed" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "4.9/5", label: "Average Rating" },
];

const TESTIMONIALS = [
  {
    name: "Dr. Sarah Chen",
    role: "Principal Dentist, Bright Smile Clinic",
    avatar: "/images/dentist-sarah-chen-portrait.jpg",
    quote:
      "DentaCore cut our admin time by 60%. The scheduling system alone paid for itself in the first month. Our front desk team finally has time to focus on patients.",
    rating: 5,
  },
  {
    name: "Dr. Marcus Webb",
    role: "Orthodontist, Webb Orthodontics",
    avatar: "/images/orthodontist-marcus-webb-portrait.jpg",
    quote:
      "The treatment planning module is exceptional. I can map out a full orthodontic journey, share it with patients visually, and track every stage without paperwork.",
    rating: 5,
  },
  {
    name: "Dr. Priya Nair",
    role: "Practice Owner, Family Dental Group",
    avatar: "/images/dentist-priya-nair-portrait.jpg",
    quote:
      "Insurance claim management used to be our biggest headache. DentaCore's automated submission and tracking has reduced our denial rate to under 3%.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Set Up Your Practice",
    description:
      "Import existing patient records, configure your treatment rooms, and add your team in under 30 minutes. Our onboarding team guides you every step.",
  },
  {
    step: "02",
    title: "Manage Daily Operations",
    description:
      "Handle appointments, patient check-ins, treatment notes, and billing from a single unified dashboard designed for clinical workflows.",
  },
  {
    step: "03",
    title: "Grow With Confidence",
    description:
      "Use real-time analytics to identify revenue opportunities, improve patient retention, and make data-driven decisions for your practice.",
  },
];

const INTEGRATIONS = [
  "Dentsply Sirona",
  "Carestream Dental",
  "Planmeca",
  "Apteryx Imaging",
  "Eaglesoft",
  "Dentrix",
];

export default function HomePage() {
  const t = useTranslations();

  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-20">
        {/* Background mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-0 bg-[var(--background)]" />
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--accent)]/8 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-[400px] w-[500px] rounded-full bg-sky-500/5 blur-[100px]" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left: copy */}
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={heroVariants}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("hero.badge")}
                </span>
              </motion.div>

              <motion.h1
                variants={heroVariants}
                className="mt-6 text-5xl font-bold leading-[1.08] tracking-tight text-balance text-[var(--foreground)] md:text-6xl lg:text-[4.5rem]"
              >
                {t("hero.headline1")}
                <span className="block text-[var(--accent)]">
                  {t("hero.headline2")}
                </span>
              </motion.h1>

              <motion.p
                variants={heroVariants}
                className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--muted)]"
              >
                {t("hero.subheadline")}
              </motion.p>

              <motion.div
                variants={heroVariants}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_24px_-4px_var(--accent)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_8px_32px_-4px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("hero.cta.primary")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/sign-in"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-sm font-semibold text-[var(--foreground)] transition-all duration-300 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  {t("hero.cta.secondary")}
                </Link>
              </motion.div>

              <motion.div
                variants={heroVariants}
                className="mt-10 flex flex-wrap items-center gap-6 text-sm text-[var(--muted)]"
              >
                {[
                  t("hero.trust.hipaa"),
                  t("hero.trust.setup"),
                  t("hero.trust.support"),
                ].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle
                      className="h-4 w-4 text-[var(--accent)]"
                      aria-hidden="true"
                    />
                    {item}
                  </span>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: dashboard preview card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_2px_4px_rgba(0,0,0,0.06),0_24px_64px_-12px_rgba(0,0,0,0.22)]">
                {/* Mini dashboard header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-[var(--muted)]">
                      {t("hero.preview.title")}
                    </p>
                    <p className="mt-0.5 text-lg font-bold text-[var(--foreground)]">
                      {t("hero.preview.date")}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    {t("hero.preview.live")}
                  </span>
                </div>

                {/* Mini stat row */}
                <div className="mb-5 grid grid-cols-3 gap-3">
                  {[
                    { label: t("hero.preview.stat1.label"), value: "14" },
                    { label: t("hero.preview.stat2.label"), value: "3" },
                    { label: t("hero.preview.stat3.label"), value: "$4,820" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-3 text-center"
                    >
                      <p className="text-xl font-bold text-[var(--accent)]">
                        {s.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[var(--muted)]">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Mini appointment list */}
                <div className="space-y-2">
                  {[
                    {
                      name: "Emma Rodriguez",
                      time: "9:00 AM",
                      type: t("hero.preview.appt.cleaning"),
                      status: "confirmed",
                    },
                    {
                      name: "James Okafor",
                      time: "10:30 AM",
                      type: t("hero.preview.appt.rootCanal"),
                      status: "confirmed",
                    },
                    {
                      name: "Lily Thompson",
                      time: "12:00 PM",
                      type: t("hero.preview.appt.consultation"),
                      status: "pending",
                    },
                  ].map((appt) => (
                    <div
                      key={appt.name}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/15 text-xs font-bold text-[var(--accent)]">
                          {appt.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[var(--foreground)]">
                            {appt.name}
                          </p>
                          <p className="text-[10px] text-[var(--muted)]">
                            {appt.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-[var(--foreground)]">
                          {appt.time}
                        </p>
                        <span
                          className={cn(
                            "text-[10px] font-semibold",
                            appt.status === "confirmed"
                              ? "text-green-500"
                              : "text-amber-500"
                          )}
                        >
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-5 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
              >
                <Heart
                  className="h-4 w-4 text-rose-500"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold text-[var(--foreground)]">
                  {t("hero.floatingBadge")}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <Reveal>
        <section className="border-y border-[var(--border)] bg-[var(--surface)] py-14">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08}>
                  <div className="text-center">
                    <p className="text-4xl font-bold tracking-tight text-[var(--accent)]">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-sm text-[var(--muted)]">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── Features ── */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("features.eyebrow")}
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance text-[var(--foreground)] md:text-5xl">
                {t("features.heading")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--muted)]">
                {t("features.subheading")}
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon;
              const isLarge = i === 0 || i === 5;
              return (
                <Reveal key={feature.title} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={cn(
                      "group relative rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)] transition-all duration-300 hover:border-[var(--accent)]/30 hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.18)]",
                      isLarge && "lg:col-span-1"
                    )}
                  >
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/12 text-[var(--accent)] transition-colors duration-300 group-hover:bg-[var(--accent)]/20">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {feature.description}
                    </p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="bg-[var(--surface)] py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("howItWorks.eyebrow")}
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance text-[var(--foreground)] md:text-5xl">
                {t("howItWorks.heading")}
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="relative flex flex-col items-start">
                  {/* Connector line */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute left-[calc(50%+2.5rem)] top-6 hidden h-px w-[calc(100%-5rem)] bg-gradient-to-r from-[var(--accent)]/40 to-transparent lg:block"
                    />
                  )}
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent)]/30 bg-[var(--accent)]/10">
                    <span className="text-xl font-bold text-[var(--accent)]">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                {t("testimonials.eyebrow")}
              </span>
              <h2 className="mt-4 text-4xl font-bold tracking-tight text-balance text-[var(--foreground)] md:text-5xl">
                {t("testimonials.heading")}
              </h2>
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t_item, i) => (
              <Reveal key={t_item.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]"
                >
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: t_item.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-[var(--muted)]">
                    {t_item.quote}
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-5">
                    <img
                      src={t_item.avatar}
                      alt={t_item.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        const fallback = target.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="hidden h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)]/15 text-sm font-bold text-[var(--accent)]"
                      aria-hidden="true"
                    >
                      {t_item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {t_item.name}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {t_item.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Integrations ── */}
      <Reveal>
        <section className="border-y border-[var(--border)] bg-[var(--surface)] py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
              {t("integrations.label")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {INTEGRATIONS.map((name) => (
                <span
                  key={name}
                  className="text-base font-semibold text-[var(--muted)] opacity-60 transition-opacity duration-200 hover:opacity-100"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── CTA ── */}
      <Reveal>
        <section id="contact" className="py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-[var(--accent)] px-8 py-20 text-center shadow-[0_8px_48px_-8px_var(--accent)]">
              {/* Background glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
                <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
              </div>

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("cta.badge")}
                </span>
                <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-bold tracking-tight text-white text-balance md:text-5xl">
                  {t("cta.heading")}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
                  {t("cta.subheading")}
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-[var(--accent)] shadow-[0_4px_16px_rgba(0,0,0,0.15)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {t("cta.primary")}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {t("cta.secondary")}
                  </Link>
                </div>
                <p className="mt-6 text-sm text-white/60">
                  {t("cta.footnote")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </Reveal>
    </main>
  );
}