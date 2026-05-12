---
title: Directory Structure
focus: arch
last_mapped: 2026-05-07
---

# Directory Structure

## Top-Level Layout

```
Massage-therapy-website/
├── src/                    # All application source code
├── public/                 # Static assets (images, icons)
├── messages/               # i18n translation files
├── .planning/              # GSD planning artifacts
├── .claude/                # Claude Code settings & skills
├── .next/                  # Next.js build output (gitignored)
├── node_modules/           # Dependencies (gitignored)
├── CLAUDE.md               # Project instructions for Claude
├── AGENTS.md               # GSD agent instructions
├── README.md               # Project documentation
├── TODO.md                 # Outstanding tasks
├── NOTES.md                # Development notes
├── olha-shelest-seo-plan.md
├── AEO_optimization_plan.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts (via postcss.config.mjs)
├── eslint.config.mjs
├── components.json         # shadcn/ui registry
├── middleware.ts           # next-intl locale middleware
└── vitest.config.ts
```

## Source Tree (`src/`)

```
src/
├── app/
│   ├── layout.tsx              # Root layout (minimal)
│   ├── page.tsx                # Root redirect → /en/
│   ├── icon.tsx                # Favicon generation
│   ├── apple-icon.tsx          # Apple touch icon
│   ├── robots.ts               # /robots.txt generation
│   ├── sitemap.ts              # /sitemap.xml with hreflang
│   ├── manifest.ts             # /manifest.json (PWA)
│   ├── globals.css             # Global styles, Tailwind, custom tokens
│   ├── api/
│   │   ├── contact/route.ts        # Contact form POST handler
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth Google OAuth
│   │   ├── booking/
│   │   │   ├── slots/route.ts      # GET available time slots
│   │   │   ├── request/route.ts    # POST new booking request
│   │   │   ├── confirm/route.ts    # GET — Olha accepts (email link)
│   │   │   └── decline/route.ts    # GET — Olha declines (email link)
│   │   └── admin/
│   │       ├── bookings/route.ts   # GET all bookings for dashboard
│   │       ├── cancel/route.ts     # POST cancel confirmed booking
│   │       └── decline/route.ts    # POST decline pending from dashboard
│   ├── admin/
│   │   ├── layout.tsx              # Auth protection — redirects if not Olha; owns <html>/<body>
│   │   ├── page.tsx                # Admin dashboard (server component)
│   │   ├── AdminDashboard.tsx      # Dashboard UI (client component)
│   │   └── auth-error/page.tsx     # Access denied page
│   └── [locale]/
│       ├── layout.tsx          # Locale layout (fonts, GA, Header, Footer, <html>/<body>)
│       ├── page.tsx            # Home page
│       ├── about/page.tsx
│       ├── services/page.tsx
│       ├── fees/page.tsx
│       ├── contact/page.tsx
│       ├── privacy-policy/page.tsx
│       ├── booking/
│       │   ├── page.tsx        # Booking page (server component, Suspense key)
│       │   └── BookingWizard.tsx  # 4-step booking wizard (client component)
│       ├── articles/
│       │   ├── page.tsx        # Articles listing
│       │   └── [slug]/page.tsx # Individual article
│       ├── massage-aylmer/page.tsx     # Geo SEO pages
│       ├── massage-hull/page.tsx
│       ├── massage-ottawa/page.tsx
│       └── massage-outaouais/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # 'use client' — nav, mobile menu, lang switcher
│   │   ├── Footer.tsx          # Server — links, address, social
│   │   └── LanguageSwitcher.tsx # EN/FR toggle
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── AboutPreviewSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── PageHeaderSection.tsx   # Shared interior page header
│   │   ├── ServiceCard.tsx
│   │   ├── AreaPageTemplate.tsx    # Reusable geo page template
│   │   └── ArticleTemplate.tsx     # Reusable article layout
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── card.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── badge.tsx
│   │   └── sheet.tsx
│   ├── BotanicalDecor.tsx       # Decorative divider
│   ├── ContactForm.tsx          # 'use client' — full contact form
│   ├── FormField.tsx            # 'use client' — reusable form field
│   └── ServiceIcon.tsx          # SVG icon by service key
│
├── lib/
│   ├── config.ts               # Central business config (BUSINESS, SERVICES, BOOKING, etc.)
│   ├── jsonld.ts               # Schema.org JSON-LD builders
│   ├── fonts.ts                # Google Fonts (Playfair Display, DM Sans)
│   ├── validation.ts           # Form input validators
│   ├── validation.test.ts      # Vitest tests (19 tests)
│   ├── emailTemplate.ts        # Resend HTML email template
│   ├── googleCalendar.ts       # Google Calendar API client (service account)
│   ├── bookingSlots.ts         # Slot availability algorithm
│   ├── bookingSlots.test.ts    # Unit tests
│   ├── bookingTokens.ts        # HMAC sign/verify for Accept/Decline links
│   ├── bookingTokens.test.ts   # Unit tests
│   ├── bookingEmails.ts        # All 4 booking email templates (Resend)
│   ├── bookingEmails.test.ts   # Unit tests
│   ├── bookingEventParser.ts   # parseEventDescription + bookingDetailsFromEvent
│   ├── adminAuth.ts            # Session check helper for admin routes
│   ├── adminGuard.ts           # requireAdminAccess — feature flag + CSRF + auth
│   ├── csrfProtection.ts       # verifySameOrigin — Origin header check
│   └── routeHelpers.ts         # htmlResponse, jsonResponse, getClientIp
│
├── test/                       # Shared test utilities (Vitest)
│   ├── mockConfig.ts           # MOCK_BOOKING_BASE + MOCK_SERVICES for vi.mock(@/lib/config)
│   └── fixtures.ts             # ADMIN_SESSION, MOCK_BOOKING_DESCRIPTION, session dates
│
├── hooks/                      # Custom React hooks (client-side)
└── i18n/
    └── routing.ts              # next-intl locale routing config
```

## Translations (`messages/`)

```
messages/
├── en.json     # English translations
└── fr.json     # French translations
```

**Key namespaces:** `nav`, `home`, `about`, `services`, `fees`, `contact`, `footer`, `common`, `articles`, `areas`

## Public Assets (`public/`)

```
public/
├── images/
│   ├── hero-bg.jpg                 # Hero background
│   ├── about-olha.jpg              # About page portrait
│   ├── service-deep-tissue.jpg
│   ├── service-relaxation.jpg
│   ├── service-children.jpg
│   └── [other images]
└── [favicons, og-image.jpg, etc.]
```

## Key File Relationships

- `src/lib/config.ts` ← imported by almost every page and many components
- `src/lib/jsonld.ts` ← imported by page files for structured data
- `messages/*.json` ← consumed by all components via next-intl hooks
- `middleware.ts` ← runs on every request, controls locale routing
