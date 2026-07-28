"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_TAGLINE } from "@/lib/data";

const DEMO_CREDENTIALS = [
  { role: "Admin", email: "admin@dentacore.com", password: "admin123", color: "bg-violet-100 text-violet-700 border-violet-200" },
  { role: "Dentist", email: "dentist@dentacore.com", password: "dentist123", color: "bg-sky-100 text-sky-700 border-sky-200" },
  { role: "Receptionist", email: "reception@dentacore.com", password: "recept123", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

const FEATURES = [
  { icon: "🦷", title: "Patient Records", desc: "Complete dental history at a glance" },
  { icon: "📅", title: "Smart Scheduling", desc: "Conflict-free appointment management" },
  { icon: "💳", title: "Billing & Insurance", desc: "Streamlined claims and invoicing" },
  { icon: "📊", title: "Analytics", desc: "Practice performance insights" },
];

export default function SignInPage() {
  const t = useTranslations();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDemoLogin = (cred: { email: string; password: string }) => {
    setEmail(cred.email);
    setPassword(cred.password);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError(t("signIn.errorEmail"));
      return;
    }
    if (!password.trim()) {
      setError(t("signIn.errorPassword"));
      return;
    }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    setSuccess(true);

    await new Promise((r) => setTimeout(r, 800));
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between p-12 bg-[var(--primary)] overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, var(--accent) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--accent) 0%, transparent 50%)",
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg">
              <span className="text-xl">🦷</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>
          </div>
          <p className="mt-3 text-white/60 text-sm max-w-xs leading-relaxed">{APP_TAGLINE}</p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 space-y-4">
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-6">
            {t("signIn.everythingYouNeed")}
          </p>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: "easeOut" }}
              className="flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-lg">
                {f.icon}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{f.title}</p>
                <p className="text-white/50 text-xs mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <blockquote className="text-white/70 text-sm italic leading-relaxed border-l-2 border-[var(--accent)] pl-4">
            {t("signIn.quote")}
          </blockquote>
          <p className="mt-2 text-white/40 text-xs">{t("signIn.quoteAuthor")}</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24 bg-[var(--background)]">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md mx-auto"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center">
              <span className="text-base">🦷</span>
            </div>
            <span className="text-xl font-bold text-[var(--foreground)] tracking-tight">{APP_NAME}</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight text-balance">
              {t("signIn.heading")}
            </h1>
            <p className="mt-2 text-[var(--muted)] text-sm leading-relaxed">
              {t("signIn.subheading")}
            </p>
          </div>

          {/* Demo credentials */}
          <Reveal className="mb-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
                <span className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wide">
                  {t("signIn.demoAccess")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DEMO_CREDENTIALS.map((cred) => (
                  <button
                    key={cred.role}
                    type="button"
                    onClick={() => handleDemoLogin(cred)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 hover:opacity-80 hover:scale-105",
                      cred.color
                    )}
                  >
                    {cred.role}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[var(--muted)] text-xs">{t("signIn.demoNote")}</p>
            </div>
          </Reveal>

          {/* Success state */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3"
            >
              <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" aria-hidden="true" />
              <p className="text-emerald-700 text-sm font-medium">{t("signIn.successMessage")}</p>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl bg-red-50 border border-red-200 p-4 flex items-center gap-3"
            >
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" aria-hidden="true" />
              <p className="text-red-600 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
              >
                {t("signIn.emailLabel")}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("signIn.emailPlaceholder")}
                  className={cn(
                    "w-full pl-10 pr-4 py-3 rounded-xl border bg-[var(--surface)] text-[var(--foreground)] text-sm",
                    "placeholder:text-[var(--muted)] transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]",
                    "border-[var(--border)]"
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[var(--foreground)]"
                >
                  {t("signIn.passwordLabel")}
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--accent)] hover:underline focus:outline-none focus-visible:underline"
                >
                  {t("signIn.forgotPassword")}
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("signIn.passwordPlaceholder")}
                  className={cn(
                    "w-full pl-10 pr-12 py-3 rounded-xl border bg-[var(--surface)] text-[var(--foreground)] text-sm",
                    "placeholder:text-[var(--muted)] transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)]",
                    "border-[var(--border)]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("signIn.hidePassword") : t("signIn.showPassword")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)] cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-[var(--muted)] cursor-pointer select-none">
                {t("signIn.rememberMe")}
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || success}
              whileHover={{ scale: isLoading || success ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || success ? 1 : 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm",
                "bg-[var(--accent)] text-[var(--primary)] transition-all duration-200",
                "shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.18)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {t("signIn.signingIn")}
                </>
              ) : success ? (
                <>
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  {t("signIn.redirecting")}
                </>
              ) : (
                <>
                  {t("signIn.signInButton")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs text-[var(--muted)]">{t("signIn.orContinueWith")}</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* SSO options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)]",
                "bg-[var(--surface)] text-[var(--foreground)] text-sm font-medium",
                "hover:bg-[var(--border)]/30 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t("signIn.googleSSO")}
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[var(--border)]",
                "bg-[var(--surface)] text-[var(--foreground)] text-sm font-medium",
                "hover:bg-[var(--border)]/30 transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
              )}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>
              {t("signIn.githubSSO")}
            </button>
          </div>

          {/* Footer links */}
          <Reveal className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              {t("signIn.noAccount")}{" "}
              <Link
                href="/pricing"
                className="text-[var(--accent)] font-medium hover:underline focus:outline-none focus-visible:underline"
              >
                {t("signIn.getStarted")}
              </Link>
            </p>
            <p className="mt-3 text-xs text-[var(--muted)]">
              {t("signIn.termsNote")}{" "}
              <Link href="/terms" className="underline hover:text-[var(--foreground)] transition-colors">
                {t("signIn.terms")}
              </Link>{" "}
              {t("signIn.and")}{" "}
              <Link href="/privacy" className="underline hover:text-[var(--foreground)] transition-colors">
                {t("signIn.privacy")}
              </Link>
              .
            </p>
          </Reveal>
        </motion.div>
      </div>
    </main>
  );
}