"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { APP_NAME, APP_TAGLINE } from "@/lib/data";
import { Heart } from 'lucide-react';

const footerSections = [
  {
    title: "Practice",
    links: [
      { label: "Dashboard", href: "/dashboard", key: "dashboard" },
      { label: "Patients", href: "/patients", key: "patients" },
      { label: "Appointments", href: "/appointments", key: "appointments" },
      { label: "Treatments", href: "/treatments", key: "treatments" },
    ],
  },
  {
    title: "Finance",
    links: [
      { label: "Billing", href: "/billing", key: "billing" },
      { label: "Insurance", href: "/insurance", key: "insurance" },
      { label: "Reports", href: "/reports", key: "reports" },
    ],
  },
  {
    title: "Admin",
    links: [
      { label: "Staff", href: "/staff", key: "staff" },
      { label: "Settings", href: "/settings", key: "settings" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const t = useTranslations();
  const navT = t.raw("nav") as Record<string, string>;

  return (
    <footer className="bg-[var(--foreground)] text-white mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/dashboard" className="flex items-center gap-2 mb-3 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.8 1.3 3.8C5.5 12 4 14.2 4 17c0 2.8 2.2 5 5 5h6c2.8 0 5-2.2 5-5 0-2.8-1.5-5-3.3-6.2C17.5 9.8 18 8.5 18 7c0-2.5-2.5-5-6-5z"
                    fill="white"
                    opacity="0.9"
                  />
                  <circle cx="12" cy="7" r="2" fill="white" opacity="0.6" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              {APP_TAGLINE}. Built for modern dental practices that demand efficiency and precision.
            </p>
          </div>

          {/* Nav sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => {
                  const label = navT[link.key] ?? link.label;
                  const isRoute = link.href.startsWith("/");
                  return (
                    <li key={link.key}>
                      {isRoute ? (
                        <Link
                          href={link.href}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                        >
                          {label}
                        </Link>
                      ) : (
                        <a
                          href={
                            pathname === "/"
                              ? link.href
                              : "/" + link.href
                          }
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; 2025 {APP_NAME}. All rights reserved.
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-white/40 flex items-center gap-1"
          >
            Built with{" "}
            <Heart className="w-3 h-3 text-[var(--primary)] inline" aria-hidden="true" />{" "}
            for dental professionals
          </motion.p>
        </div>
      </div>
    </footer>
  );
}