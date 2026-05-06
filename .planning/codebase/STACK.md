---
title: Tech Stack
focus: tech
last_mapped: 2026-05-05
---

# Tech Stack

## Languages & Runtime

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | 5.x |
| Templates | TSX (React) | — |
| Runtime | Node.js | via Next.js |

## Core Frameworks

| Framework | Version | Role |
|-----------|---------|------|
| Next.js | 16.2.4 | Full-stack framework (App Router) |
| React | 19.x | UI rendering |
| next-intl | 4.9.1 | EN/FR bilingual routing and translations |

**i18n routing:** `src/i18n/routing.ts`, `middleware.ts` — all routes prefixed with `/en/` or `/fr/`

## UI Layer

| Library | Version | Role |
|---------|---------|------|
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | 4.3.0 | Component library (based on Radix UI) |
| @base-ui/react | 1.4.0 | Accessible UI primitives |
| next/font/google | — | Self-hosted Google Fonts |

**Fonts:** Playfair Display, DM Sans, Geist Mono — configured in `src/lib/fonts.ts`

**Design tokens:** Deep forest green `#2D6A4F` (primary), sage green `#52B788` (links/hover), pale sage `#F0F7F4` (light backgrounds), warm off-white `#FAF9F5` (base)

## Email

| Library | Version | Role |
|---------|---------|------|
| resend | 6.12.0 | Transactional email via contact form |

## Testing

| Library | Version | Role |
|---------|---------|------|
| Vitest | 4.1.5 | Unit testing |

Config: `vitest.config.ts`
Tests: `src/lib/validation.test.ts` (19 tests covering validators and text filters)

## Build & Tooling

| Tool | Version | Role |
|------|---------|------|
| ESLint | — | Linting (`eslint.config.mjs`) |
| @next/bundle-analyzer | — | Bundle analysis (gated on `ANALYZE=true`) |
| PostCSS | — | CSS processing (`postcss.config.mjs`) |

## Configuration

**Environment variables:**

| Variable | Required | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Yes | Contact form email delivery |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 tracking |
| `ANALYZE` | Optional | Enable bundle analyzer on build |

Config: `.env.local` (not committed)

## Deployment

- **Platform:** Vercel (free tier)
- **Domain:** `www.shelestwellness.ca` (hosted on Porkbun)
- **Redirect:** `shelestwellness.ca` → `www.shelestwellness.ca`
- **Email forwarding:** `massage@shelestwellness.ca` → `shelestwellness@gmail.com`

## Key Config Files

- `next.config.ts` — Next.js config with bundle analyzer
- `tsconfig.json` — TypeScript config
- `components.json` — shadcn/ui component registry
- `src/lib/config.ts` — Central business config (BUSINESS, SERVICES, NAV_LINKS, SITE)
- `src/i18n/routing.ts` — Locale routing config
- `middleware.ts` — next-intl locale middleware
