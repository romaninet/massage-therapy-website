---
title: Architecture
focus: arch
last_mapped: 2026-05-07
---

# Architecture

## Pattern

**Next.js App Router — Static-first marketing site + booking system**

- Primarily a static/SSR marketing site; no database
- Google Calendar is the single source of truth for booking state
- i18n via next-intl with locale-prefixed routing (`/en/`, `/fr/`)
- Config-driven content model — all business data centralized in `src/lib/config.ts`

## Layers

```
┌─────────────────────────────────────────────────────┐
│                   Pages (App Router)                 │
│  src/app/[locale]/*/page.tsx  (public, bilingual)   │
│  src/app/admin/*.tsx          (protected, English)  │
├─────────────────────────────────────────────────────┤
│               Section Components                     │
│  src/components/sections/*.tsx                      │
│  Reusable page sections (Hero, Services, About...)  │
├─────────────────────────────────────────────────────┤
│              UI Primitives (shadcn)                  │
│  src/components/ui/*.tsx                            │
│  Button, Input, Card, Badge, Sheet, etc.            │
├─────────────────────────────────────────────────────┤
│              Layout Components                       │
│  src/components/layout/*.tsx                        │
│  Header (client), Footer (server), LanguageSwitcher │
├─────────────────────────────────────────────────────┤
│               Library / Config Layer                 │
│  src/lib/config.ts — business data + BOOKING flags  │
│  src/lib/jsonld.ts — Schema.org structured data     │
│  src/lib/fonts.ts — Google Fonts config             │
│  src/lib/validation.ts — form input validators      │
│  src/lib/emailTemplate.ts — contact form email      │
│  src/lib/googleCalendar.ts — Calendar API client    │
│  src/lib/bookingSlots.ts — slot availability algo   │
│  src/lib/bookingTokens.ts — HMAC sign/verify        │
│  src/lib/bookingEmails.ts — booking email templates │
│  src/lib/bookingEventParser.ts — parse Calendar     │
│      event descriptions → BookingDetails            │
│  src/lib/adminGuard.ts — requireAdminAccess()       │
│  src/lib/adminAuth.ts — session check helper        │
│  src/lib/csrfProtection.ts — Origin header check    │
│  src/lib/routeHelpers.ts — htmlResponse, jsonResponse│
├─────────────────────────────────────────────────────┤
│                  API Routes                          │
│  /api/contact             POST — contact form       │
│  /api/booking/slots       GET  — available slots    │
│  /api/booking/request     POST — submit booking     │
│  /api/booking/confirm     GET  — Olha accepts       │
│  /api/booking/decline     GET  — Olha declines      │
│  /api/admin/bookings      GET  — dashboard list     │
│  /api/admin/cancel        POST — cancel confirmed   │
│  /api/admin/decline       POST — decline pending    │
│  /api/auth/[...nextauth]  GET/POST — Google OAuth   │
└─────────────────────────────────────────────────────┘
```

## Routing

**Locale routing via next-intl middleware:**
- `middleware.ts` intercepts all requests, injects locale prefix
- `src/i18n/routing.ts` defines supported locales: `['en', 'fr']`, default: `'en'`
- Root `src/app/page.tsx` redirects to `/en/`

**Page routes:**

| Route | File |
|-------|------|
| `/[locale]/` | `src/app/[locale]/page.tsx` |
| `/[locale]/about` | `src/app/[locale]/about/page.tsx` |
| `/[locale]/services` | `src/app/[locale]/services/page.tsx` |
| `/[locale]/fees` | `src/app/[locale]/fees/page.tsx` |
| `/[locale]/contact` | `src/app/[locale]/contact/page.tsx` |
| `/[locale]/privacy-policy` | `src/app/[locale]/privacy-policy/page.tsx` |
| `/[locale]/articles` | `src/app/[locale]/articles/page.tsx` |
| `/[locale]/articles/[slug]` | `src/app/[locale]/articles/[slug]/page.tsx` |
| `/[locale]/massage-aylmer` | `src/app/[locale]/massage-aylmer/page.tsx` |
| `/[locale]/massage-hull` | `src/app/[locale]/massage-hull/page.tsx` |
| `/[locale]/massage-ottawa` | `src/app/[locale]/massage-ottawa/page.tsx` |
| `/[locale]/massage-outaouais` | `src/app/[locale]/massage-outaouais/page.tsx` |

**Booking & admin routes:**

| Route | File | Method |
|-------|------|--------|
| `/[locale]/booking` | `src/app/[locale]/booking/page.tsx` | — |
| `/admin` | `src/app/admin/page.tsx` | — |

**API routes:**

| Route | File | Method |
|-------|------|--------|
| `/api/contact` | `src/app/api/contact/route.ts` | POST |
| `/api/booking/slots` | `src/app/api/booking/slots/route.ts` | GET |
| `/api/booking/request` | `src/app/api/booking/request/route.ts` | POST |
| `/api/booking/confirm` | `src/app/api/booking/confirm/route.ts` | GET |
| `/api/booking/decline` | `src/app/api/booking/decline/route.ts` | GET |
| `/api/admin/bookings` | `src/app/api/admin/bookings/route.ts` | GET |
| `/api/admin/cancel` | `src/app/api/admin/cancel/route.ts` | POST |
| `/api/admin/decline` | `src/app/api/admin/decline/route.ts` | POST |
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | GET/POST |

**SEO routes:**

| Route | File |
|-------|------|
| `/sitemap.xml` | `src/app/sitemap.ts` |
| `/robots.txt` | `src/app/robots.ts` |
| `/manifest.json` | `src/app/manifest.ts` |

## Data Flow

```
Config (src/lib/config.ts)
  └─ Page components read BUSINESS, SERVICES, NAV_LINKS, SITE, BOOKING
       └─ Pass as props to Section components
            └─ Section components render UI

Translation (messages/en.json, messages/fr.json)
  └─ next-intl loads based on [locale] param
       └─ Components call useTranslations() / getTranslations()

Contact Form Flow:
  User submits form
  → ContactForm.tsx validates via src/lib/validation.ts
  → POST /api/contact → Resend API
  → Email delivered to shelestwellness@gmail.com

Booking Flow:
  Client fills 4-step wizard (BookingWizard.tsx)
  → GET /api/booking/slots — reads Google Calendar, returns available times
  → POST /api/booking/request — validates, creates [PENDING] calendar event,
      sends email to Olha with HMAC-signed Accept/Decline links
  → Olha clicks Accept → GET /api/booking/confirm
      → re-checks conflicts → updates event to [CONFIRMED] (green)
      → creates [BREAK] event (purple) → sends confirmation email to client
  → Olha clicks Decline → GET /api/booking/decline
      → deletes event → sends decline email to client

Admin Flow:
  Olha visits /admin → NextAuth Google OAuth (restricted to adminEmail)
  → AdminDashboard.tsx fetches GET /api/admin/bookings
  → Decline → POST /api/admin/decline (CSRF-checked)
  → Cancel → POST /api/admin/cancel (CSRF-checked, also deletes linked [BREAK])
```

## Entry Points

- `src/app/[locale]/layout.tsx` — root layout with fonts, GA script, Header, Footer
- `src/app/[locale]/page.tsx` — home page (HeroSection, ServicesSection, AboutPreviewSection, CTASection)
- `middleware.ts` — locale detection and routing

## Key Abstractions

- **`AreaPageTemplate`** (`src/components/sections/AreaPageTemplate.tsx`) — reusable template for geo-targeted area pages (Aylmer, Hull, Ottawa, Outaouais)
- **`ArticleTemplate`** (`src/components/sections/ArticleTemplate.tsx`) — reusable article/blog post layout
- **`PageHeaderSection`** — shared dark header banner for interior pages
- **`ServiceIcon`** — renders SVG icon by service key (single source of truth)
- **`BotanicalDecor`** — decorative botanical divider element
- **`bookingDetailsFromEvent`** (`src/lib/bookingEventParser.ts`) — single function that parses a Calendar event description JSON and builds a typed `BookingDetails` object; used by all 4 booking action routes
- **`requireAdminAccess`** (`src/lib/adminGuard.ts`) — single call that enforces feature flag + CSRF origin + NextAuth session; used by both admin POST routes
- **`routeHelpers`** (`src/lib/routeHelpers.ts`) — `htmlResponse`/`jsonResponse`/`getClientIp` shared across booking email-link routes and request route
