---
title: Coding Conventions
focus: quality
last_mapped: 2026-05-05
---

# Coding Conventions

## Naming

| Pattern | Convention | Example |
|---------|-----------|---------|
| React components | PascalCase | `HeroSection.tsx`, `ContactForm.tsx` |
| Lib utilities / hooks | camelCase | `emailTemplate.ts`, `validation.ts` |
| Config constants | SCREAMING_SNAKE_CASE | `BUSINESS`, `SERVICES`, `NAV_LINKS`, `SITE` |
| Route segments | kebab-case | `[locale]/services/page.tsx` |
| Translation keys | camelCase nested | `services.deepTissue.title` |

## Component Rules

**Server vs Client split:**
- Default: Server Components (no directive needed)
- `'use client'` added only when needed: interactive forms, event handlers, hooks
- Client components: `src/components/Header.tsx`, `src/components/ContactForm.tsx`, `src/components/FormField.tsx`, all `src/hooks/`

**Bilingual data shape:**
```ts
// Bilingual strings in config always use:
{ en: 'English text', fr: 'French text' }

// Accessed with locale:
label[locale as 'en' | 'fr']
```

## Config-Driven Pattern

All business data lives in `src/lib/config.ts` — never hardcoded in components:
- `BUSINESS` — name, address, phone, email, hours, social links, booking URL
- `SERVICES` — service definitions with keys, names (bilingual), prices, images
- `NAV_LINKS` — navigation structure with keys and hrefs
- `SITE` — domain, OG image, sitemap priority defaults

## Tailwind Usage

**Custom design tokens** (configured in Tailwind):
- `forest` → `#2D6A4F` (primary brand, navbars, buttons, headings)
- `sage` → `#52B788` (links, hover states)
- `pale-sage` → `#F0F7F4` (light section backgrounds)
- Off-white `#FAF9F5` (base page background)

**Reusable utility classes** (defined in `src/app/globals.css`):
- `.container-wide` — max-width container with horizontal padding
- `.heading-section` — section heading style
- `.section-pretitle` — small uppercase pre-title above headings
- `.btn-light` — light variant button
- `.icon-badge` — service icon container

**Mobile-first responsive breakpoints:**
- All styles mobile-first; desktop overrides use `lg:` prefix
- Phone-specific overrides often use `sm:` or `md:`

## Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json`):
```ts
import { BUSINESS } from '@/lib/config';
import HeroSection from '@/components/sections/HeroSection';
```

## Error Handling

- API routes (`src/app/api/contact/route.ts`) return JSON with `{ success: boolean, message: string }`
- Contact form uses string error codes (not error messages) for i18n-safe display
- Form state managed as a state machine (idle → submitting → success/error)

## Import Order Convention

1. React/Next.js built-ins
2. Third-party packages
3. Internal aliases (`@/lib`, `@/components`)
4. Relative imports

## i18n Pattern

- All user-facing strings in `messages/en.json` and `messages/fr.json`
- Components use `useTranslations('namespace')` from next-intl
- Server components use `getTranslations('namespace')`
- Locale passed via `[locale]` route segment, accessed with `getLocale()` or params
