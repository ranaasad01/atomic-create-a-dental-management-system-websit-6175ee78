# AGENTS.md

Project conventions for AI agents and humans editing this codebase.

## Original request
create a dental management system website complete

## Goal
Build DentaCore, a comprehensive dental practice management system with dashboard, patient management, appointment scheduling, treatment tracking, and billing pages.

## Project type
saas-app

## Design system — match this exactly
- Color tokens: `--background: #F0F9FF`, `--foreground: #1E293B`, `--muted: #64748B`, `--primary: #0EA5E9`, `--accent: #0369A1`, `--border: #BAE6FD`, `--brand-primary: #0EA5E9`, `--brand-accent: #0369A1`, `--brand-secondary: #2DD4BF`, `--brand-destructive: #DC2626`

## Existing components — reuse these, don't create near-duplicates
- Footer (components/Footer.tsx)
- LanguageToggle (components/LanguageToggle.tsx)
- LocaleProvider (components/LocaleProvider.tsx)
- Navbar (components/Navbar.tsx)

## Existing i18n namespaces
Every translation key must be namespaced (`hero.title`, never a bare `title`) so two components never collide on the same catalog slot. Reuse one of these, or pick a new, distinct name:
`appointments`, `appointments-page`, `billing`, `billing-page`, `bookingModal`, `calendar`, `cta`, `dashboard`, `features`, `footer`, `hero`, `howItWorks`, `insurance`, `insurance-page`, `integrations`, `listView`, `nav`, `patients`, `pricing`, `reminders`, `reports`, `reports-page`, `settings-page`, `signIn`, `staff-page`, `testimonials`, `treatments-page`

When editing or adding pages: preserve the design system above, reuse existing components and the shared nav data file, and keep the established structure and tone.
