---
title: Integrations
focus: tech
last_mapped: 2026-05-05
---

# External Integrations

## Email — Resend

- **Purpose:** Transactional email delivery for contact form submissions
- **SDK:** `resend` npm package (v6.12.0)
- **Implementation:** `src/app/api/contact/route.ts`
- **From:** `massage@shelestwellness.ca`
- **To:** `shelestwellness@gmail.com`
- **Auth:** `RESEND_API_KEY` environment variable
- **Template:** `src/lib/emailTemplate.ts`
- **Spam protection:** Honeypot field in `src/components/ContactForm.tsx`

## Analytics — Google Analytics 4

- **Purpose:** Website traffic and user behavior tracking
- **Implementation:** `src/app/[locale]/layout.tsx` via `next/script` (afterInteractive)
- **Auth:** `NEXT_PUBLIC_GA_ID` environment variable
- **Notes:** Optional — site functions without it

## Maps — Google Maps Embed

- **Purpose:** Show business location on contact page
- **Implementation:** iframe embed (no API key required)
- **Config:** `BUSINESS.mapsUrl` in `src/lib/config.ts`
- **Place ID:** `BUSINESS.placeId` in `src/lib/config.ts`
- **Notes:** Uses `pb=` embed URL — Place ID embed requires paid Maps API key

## Booking — Setmore

- **Purpose:** Online appointment booking
- **Implementation:** External link only (`https://shelestwellness.setmore.com/`)
- **Integration type:** Link out (no SDK, no webhook)
- **Used in:** Hero CTA buttons, service pages

## Credentialing — AMQ (Association des massothérapeutes du Québec)

- **Purpose:** Professional credential verification
- **Implementation:** External link in `src/lib/config.ts` (`BUSINESS.amqUrl`)
- **URL:** `https://membres.rmqmasso.ca/en/find-member/details/M-24-4471`
- **Used in:** About page, footer (trust signal)

## Structured Data — Schema.org JSON-LD

- **Purpose:** Rich search results and SEO
- **Implementation:** `src/lib/jsonld.ts`
- **Schemas used:**
  - `HealthAndBeautyBusiness` — home & contact pages
  - `Person` — about page
  - `ItemList` (services) — fees page
  - `Service` with `AggregateOffer` — services page (`servicesPageJsonLd`)
  - `Article` — blog/article pages
  - `FAQPage` — FAQ content
  - `BreadcrumbList` — breadcrumb navigation

## No Database / No Auth

This site has no database, no user accounts, and no authentication provider. All content is static/hardcoded in config and translation files.

## Domain & DNS — Porkbun

- **Registrar/Host:** Porkbun.com
- **Email forwarding:** Configured on Porkbun (`massage@shelestwellness.ca` → `shelestwellness@gmail.com`)
- **Phone:** Fongo.com virtual number (819 area code for local SEO)
