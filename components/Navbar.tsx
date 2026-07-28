"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { navLinks, APP_NAME } from "@/lib/data";
import { Menu, X, Bell, User, ChevronDown, Settings } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] shadow-[0_1px_3px_0_rgba(14,165,233,0.08)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.8 1.3 3.8C5.5 12 4 14.2 4 17c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5 0-2.8-1.5-5-3.3-6.2C17.5 9.8 18 8.5 18 7c0-2.5-2.5-5-6-5z"
                  fill="white"
                  opacity="0.9"
                />
                <circle cx="12" cy="7" r="2" fill="white" opacity="0.6" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[var(--foreground)] tracking-tight">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const label = navT[link.key] ?? link.label;
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-[var(--primary)] bg-[var(--background)]"
                      : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                  }`}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--primary)] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              aria-label="View notifications"
              className="relative p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-200"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--primary)] rounded-full border-2 border-[var(--surface)]" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-label="Open user menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--background)] transition-all duration-200"
              >
                <div className="w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-xs font-semibold">
                  DR
                </div>
                <span className="hidden sm:block text-sm font-medium text-[var(--foreground)]">
                  Dr. Reyes
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--muted)] transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-[0_4px_24px_rgba(14,165,233,0.12)] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[var(--border)]">
                      <p className="text-sm font-semibold text-[var(--foreground)]">Dr. Elena Reyes</p>
                      <p className="text-xs text-[var(--muted)]">Endodontist · Admin</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
                        Settings
                      </Link>
                      <Link
                        href="/staff"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--background)] transition-colors"
                      >
                        <User className="w-4 h-4 text-[var(--muted)]" aria-hidden="true" />
                        My Profile
                      </Link>
                    </div>
                    <div className="py-1 border-t border-[var(--border)]">
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--brand-destructive)] hover:bg-red-50 transition-colors"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-all duration-200"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] overflow-hidden"
          >
            <nav className="px-4 py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const label = navT[link.key] ?? link.label;
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-[var(--primary)] bg-[var(--background)] font-semibold"
                        : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--background)]"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}