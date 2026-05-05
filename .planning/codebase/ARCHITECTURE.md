---
title: Architecture
focus: arch
last_mapped: 2026-05-05
---

# Architecture

## Pattern

**Next.js App Router — Static-first with one API route**

- Primarily a static/SSR marketing site with no database or auth
- Single dynamic API endpoint: contact form submission
- i18n via next-intl with locale-prefixed routing (`/en/`, `/fr/`)
- Config-driven content model — all business data centralized in `src/lib/config.ts`

## Layers

```
┌─────────────────────────────────────────────────────┐
│                   Pages (App Router)                 │
│  src/app/[locale]/*/page.tsx                        │
│  Server Components — compose layout + fetch data    │
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
│  src/lib/config.ts — business data                  │
│  src/lib/jsonld.ts — Schema.org structured data     │
│  src/lib/fonts.ts — Google Fonts config             │
│  src/lib/validation.ts — form input validators      │
│  src/lib/emailTemplate.ts — Resend HTML template    │
├─────────────────────────────────────────────────────┤
│                  API Routes                          │
│  src/app/api/contact/route.ts — POST handler        │
│  Validates input → sends email via Resend           │
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

**API routes:**

| Route | File | Method |
|-------|------|--------|
| `/api/contact` | `src/app/api/contact/route.ts` | POST |

**SEO routes:**

| Route | File |
|-------|------|
| `/sitemap.xml` | `src/app/sitemap.ts` |
| `/robots.txt` | `src/app/robots.ts` |
| `/manifest.json` | `src/app/manifest.ts` |

## Data Flow

```
Config (src/lib/config.ts)
  └─ Page components read BUSINESS, SERVICES, NAV_LINKS, SITE
       └─ Pass as props to Section components
            └─ Section components render UI

Translation (messages/en.json, messages/fr.json)
  └─ next-intl loads based on [locale] param
       └─ Components call useTranslations() / getTranslations()

Contact Form Flow:
  User submits form
  → ContactForm.tsx (client) validates via src/lib/validation.ts
  → POST /api/contact
  → route.ts validates + honeypot check + Resend API
  → Email delivered to shelestwellness@gmail.com
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
