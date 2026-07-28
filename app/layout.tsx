import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocaleProvider from "@/components/LocaleProvider";
import LanguageToggle from "@/components/LanguageToggle";

export const metadata: Metadata = {
  formatDetection: { telephone: false, date: false, email: false, address: false },
  title: {
    default: "DentaCore — Dental Practice Management System",
    template: "%s | DentaCore",
  },
  description:
    "DentaCore is a comprehensive dental practice management system for scheduling, patient records, billing, insurance, and clinical workflows.",
  openGraph: {
    title: "DentaCore — Dental Practice Management System",
    description:
      "Manage your entire dental practice from one place. Appointments, patients, billing, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] font-sans antialiased">
        <LocaleProvider>
          <LanguageToggle />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}