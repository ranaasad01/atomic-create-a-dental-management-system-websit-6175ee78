"use client";

import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, X, Zap, Shield, Users, BarChart3, HeadphonesIcon, Star, ArrowRight, ChevronDown } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for solo practitioners",
    monthlyPrice: 49,
    annualPrice: 39,
    color: "border-white/10 bg-white/[0.02]",
    highlighted: false,
    badge: null,
    features: [
      { text: "Up to 200 active patients", included: true },
      { text: "1 dentist seat", included: true },
      { text: "Appointment scheduling", included: true },
      { text: "Basic billing & invoicing", included: true },
      { text: "Patient records", included: true },
      { text: "Email reminders", included: true },
      { text: "Insurance claims", included: false },
      { text: "Treatment planning", included: false },
      { text: "Advanced analytics", included: false },
      { text: "Multi-location support", included: false },
      { text: "API access", included: false },
      { text: "Dedicated account manager", included: false },
    ],
    cta: "Start free trial",
    ctaVariant: "outline",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "For growing dental practices",
    monthlyPrice: 129,
    annualPrice: 99,
    color: "border-[var(--accent)]/40 bg-[var(--accent)]/5",
    highlighted: true,
    badge: "Most Popular",
    features: [
      { text: "Up to 2,000 active patients", included: true },
      { text: "Up to 5 dentist seats", included: true },
      { text: "Appointment scheduling", included: true },
      { text: "Full billing & invoicing", included: true },
      { text: "Patient records", included: true },
      { text: "SMS & email reminders", included: true },
      { text: "Insurance claims", included: true },
      { text: "Treatment planning", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Multi-location support", included: false },
      { text: "API access", included: false },
      { text: "Dedicated account manager", included: false },
    ],
    cta: "Start free trial",
    ctaVariant: "accent",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For large clinics and groups",
    monthlyPrice: 299,
    annualPrice: 239,
    color: "border-white/10 bg-white/[0.02]",
    highlighted: false,
    badge: null,
    features: [
      { text: "Unlimited active patients", included: true },
      { text: "Unlimited dentist seats", included: true },
      { text: "Appointment scheduling", included: true },
      { text: "Full billing & invoicing", included: true },
      { text: "Patient records", included: true },
      { text: "SMS & email reminders", included: true },
      { text: "Insurance claims", included: true },
      { text: "Treatment planning", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Multi-location support", included: true },
      { text: "API access", included: true },
      { text: "Dedicated account manager", included: true },
    ],
    cta: "Contact sales",
    ctaVariant: "outline",
  },
];

const FEATURES_COMPARISON = [
  { category: "Patient Management", features: [
    { name: "Active patient records", starter: "200", professional: "2,000", enterprise: "Unlimited" },
    { name: "Patient history & notes", starter: true, professional: true, enterprise: true },
    { name: "Medical alerts & allergies", starter: true, professional: true, enterprise: true },
    { name: "X-ray & document storage", starter: "2 GB", professional: "50 GB", enterprise: "Unlimited" },
  ]},
  { category: "Scheduling", features: [
    { name: "Online appointment booking", starter: true, professional: true, enterprise: true },
    { name: "Automated reminders", starter: "Email only", professional: "SMS + Email", enterprise: "SMS + Email + Voice" },
    { name: "Recurring appointments", starter: false, professional: true, enterprise: true },
    { name: "Multi-room scheduling", starter: false, professional: true, enterprise: true },
  ]},
  { category: "Billing & Finance", features: [
    { name: "Invoice generation", starter: true, professional: true, enterprise: true },
    { name: "Insurance claim submission", starter: false, professional: true, enterprise: true },
    { name: "Payment processing", starter: true, professional: true, enterprise: true },
    { name: "Financial reports", starter: "Basic", professional: "Advanced", enterprise: "Custom" },
  ]},
  { category: "Support", features: [
    { name: "Help center access", starter: true, professional: true, enterprise: true },
    { name: "Email support", starter: true, professional: true, enterprise: true },
    { name: "Priority phone support", starter: false, professional: true, enterprise: true },
    { name: "Dedicated account manager", starter: false, professional: false, enterprise: true },
  ]},
];

const TESTIMONIALS = [
  {
    quote: "DentaCore cut our admin time in half. The billing module alone paid for itself in the first month.",
    author: "Dr. Sarah Chen",
    role: "Principal Dentist, Bright Smile Clinic",
    plan: "Professional",
    avatar: "/images/dentist-sarah-chen-portrait.jpg",
    stars: 5,
  },
  {
    quote: "We manage four locations from one dashboard. The enterprise plan scales exactly as we need it to.",
    author: "Dr. Marcus Webb",
    role: "CEO, Webb Dental Group",
    plan: "Enterprise",
    avatar: "/images/dentist-marcus-webb-portrait.jpg",
    stars: 5,
  },
  {
    quote: "As a solo practitioner, the Starter plan gives me everything I need without paying for features I don't use.",
    author: "Dr. Priya Nair",
    role: "Private Practice, Nair Family Dentistry",
    plan: "Starter",
    avatar: "/images/dentist-priya-nair-portrait.jpg",
    stars: 5,
  },
];

const FAQS = [
  {
    question: "Is there a free trial available?",
    answer: "Yes. Every plan includes a 14-day free trial with full access to all features in that tier. No credit card required to start.",
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    question: "How does per-seat pricing work?",
    answer: "Each dentist who needs their own login and schedule counts as one seat. Receptionists and admin staff are included at no extra cost on Professional and Enterprise plans.",
  },
  {
    question: "Is patient data secure and HIPAA compliant?",
    answer: "Yes. DentaCore is fully HIPAA compliant. All data is encrypted at rest and in transit, stored in SOC 2 Type II certified data centers, and backed up daily.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes. Paying annually saves you up to 24% compared to monthly billing. The discounted price is shown when you toggle to annual on the pricing cards above.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "You retain full access to export your data for 30 days after cancellation. We provide exports in standard formats (CSV, PDF) so you're never locked in.",
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Zap, label: "99.9% Uptime SLA" },
  { icon: Users, label: "10,000+ Practices" },
  { icon: BarChart3, label: "SOC 2 Type II" },
];

function renderCellValue(val: boolean | string) {
  if (val === true) return <Check className="mx-auto h-4 w-4 text-[var(--accent)]" aria-label="Included" />;
  if (val === false) return <X className="mx-auto h-4 w-4 text-white/20" aria-label="Not included" />;
  return <span className="text-sm text-white/70">{val}</span>;
}

export default function PricingPage() {
  const t = useTranslations();
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="h-[500px] w-[800px] rounded-full bg-[var(--accent)]/8 blur-[120px]" />
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative mx-auto max-w-3xl"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
                <Zap className="h-3.5 w-3.5" />
                {t("pricing.badge")}
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              {t("pricing.hero.title")}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 text-lg leading-relaxed text-white/60 text-pretty"
            >
              {t("pricing.hero.subtitle")}
            </motion.p>

            {/* Billing toggle */}
            <motion.div variants={fadeInUp} className="mt-8 flex items-center justify-center gap-4">
              <span className={cn("text-sm font-medium", !annual ? "text-white" : "text-white/40")}>
                {t("pricing.toggle.monthly")}
              </span>
              <button
                onClick={() => setAnnual((v) => !v)}
                aria-label="Toggle billing period"
                className={cn(
                  "relative h-7 w-12 rounded-full border transition-colors duration-300",
                  annual
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/20"
                    : "border-white/20 bg-white/10"
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-6 w-6 rounded-full bg-[var(--accent)] shadow transition-transform duration-300",
                    annual ? "translate-x-5" : "translate-x-0.5"
                  )}
                />
              </button>
              <span className={cn("text-sm font-medium", annual ? "text-white" : "text-white/40")}>
                {t("pricing.toggle.annual")}
                <span className="ml-2 rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-xs text-[var(--accent)]">
                  {t("pricing.toggle.saveBadge")}
                </span>
              </span>
            </motion.div>
          </motion.div>
        </section>
      </Reveal>

      {/* Pricing Cards */}
      <Reveal>
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.id}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-8 shadow-[0_1px_2px_rgba(0,0,0,0.12),0_8px_32px_-8px_rgba(0,0,0,0.3)]",
                  plan.color
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-semibold text-black">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold">{plan.name}</h2>
                  <p className="mt-1 text-sm text-white/50">{plan.tagline}</p>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight">
                      ${annual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="mb-1 text-sm text-white/40">/mo</span>
                  </div>
                  {annual && (
                    <p className="mt-1 text-xs text-white/40">
                      Billed annually (${plan.annualPrice * 12}/yr)
                    </p>
                  )}
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-3">
                      {f.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-white/20" />
                      )}
                      <span className={cn("text-sm", f.included ? "text-white/80" : "text-white/30")}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <a
                    href={plan.id === "enterprise" ? "/sign-in" : "/sign-in"}
                    className={cn(
                      "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200",
                      plan.highlighted
                        ? "bg-[var(--accent)] text-black hover:bg-[var(--accent)]/90 hover:shadow-[0_0_24px_rgba(var(--accent-rgb),0.35)]"
                        : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                    )}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-6">
            {TRUST_BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-2 text-sm text-white/40">
                <b.icon className="h-4 w-4 text-[var(--accent)]/70" />
                {b.label}
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Feature Comparison Table */}
      <Reveal>
        <section className="border-t border-white/8 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{t("pricing.comparison.title")}</h2>
              <p className="mt-3 text-white/50">{t("pricing.comparison.subtitle")}</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/8">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03]">
                    <th className="px-6 py-4 text-left font-medium text-white/50">Feature</th>
                    {PLANS.map((p) => (
                      <th
                        key={p.id}
                        className={cn(
                          "px-6 py-4 text-center font-semibold",
                          p.highlighted ? "text-[var(--accent)]" : "text-white/80"
                        )}
                      >
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES_COMPARISON.map((cat, _fk0) => (
                    <Fragment key={_fk0}>
                      <tr key={cat.category} className="border-b border-white/5 bg-white/[0.015]">
                        <td
                          colSpan={4}
                          className="px-6 py-3 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]/70"
                        >
                          {cat.category}
                        </td>
                      </tr>
                      {cat.features.map((feat) => (
                        <tr
                          key={feat.name}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-6 py-3.5 text-white/70">{feat.name}</td>
                          <td className="px-6 py-3.5 text-center">{renderCellValue(feat.starter)}</td>
                          <td className="px-6 py-3.5 text-center">{renderCellValue(feat.professional)}</td>
                          <td className="px-6 py-3.5 text-center">{renderCellValue(feat.enterprise)}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Testimonials */}
      <Reveal>
        <section className="border-t border-white/8 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{t("pricing.testimonials.title")}</h2>
              <p className="mt-3 text-white/50">{t("pricing.testimonials.subtitle")}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t_item, i) => (
                <Reveal key={t_item.author} delay={i * 0.1}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_24px_-8px_rgba(0,0,0,0.2)]">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t_item.stars }).map((_, si) => (
                        <Star key={si} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                      ))}
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/70">
                      &ldquo;{t_item.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <img
                        src={t_item.avatar}
                        alt={t_item.author}
                        className="h-10 w-10 rounded-full border border-white/10 object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(t_item.author)}&background=1a1a2e&color=7c9ef5&size=80`;
                        }}
                      />
                      <div>
                        <div className="text-sm font-semibold">{t_item.author}</div>
                        <div className="text-xs text-white/40">{t_item.role}</div>
                      </div>
                      <span className="ml-auto rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs text-[var(--accent)]">
                        {t_item.plan}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* FAQ */}
      <Reveal>
        <section className="border-t border-white/8 px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight">{t("pricing.faq.title")}</h2>
              <p className="mt-3 text-white/50">{t("pricing.faq.subtitle")}</p>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-sm font-medium text-white/90 hover:text-white transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    {faq.question}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
                        openFaq === i && "rotate-180"
                      )}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="px-6 pb-5"
                    >
                      <p className="text-sm leading-relaxed text-white/55">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* CTA Banner */}
      <Reveal>
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[var(--accent)]/20 bg-gradient-to-br from-[var(--accent)]/10 via-[var(--accent)]/5 to-transparent p-12 text-center shadow-[0_0_80px_-20px_rgba(var(--accent-rgb),0.2)]">
            <HeadphonesIcon className="mx-auto h-10 w-10 text-[var(--accent)]/70" />
            <h2 className="mt-5 text-3xl font-bold tracking-tight">{t("pricing.cta.title")}</h2>
            <p className="mt-3 text-white/55 text-pretty">{t("pricing.cta.subtitle")}</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="/sign-in"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-[var(--accent)]/90 hover:shadow-[0_0_24px_rgba(var(--accent-rgb),0.4)]"
              >
                {t("pricing.cta.primary")}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="mailto:sales@dentacore.io"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/10"
              >
                {t("pricing.cta.secondary")}
              </a>
            </div>
            <p className="mt-5 text-xs text-white/30">{t("pricing.cta.footnote")}</p>
          </div>
        </section>
      </Reveal>
    </main>
  );
}