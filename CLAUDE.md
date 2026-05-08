# High level context

This is a bilingual (EN/FR) website for Olha Shelest. 

Here are some details about Olha Shelest and her self-employment business:
 - full name: Olha Shelest
 - self employed as professional massage therapist from Gatineau, QC in Canada.
 - For legal purposes, this is not a registerred business. It is self-employment operating under her name only (no company name)
 - Olha is registered with AMQ https://membres.rmqmasso.ca/en/find-member/details/M-24-4471


## Services and technology:

 - Website supports two languages (mandatory): English and French.
 - Developed using the following technologies: Next.js, Tailwind CSS, shadcn/ui, next-intl
 - production domain name is shelestwellness.ca and hosted on porkbun.com. Also https://www.shelestwellness.ca (shelestwellness.ca redirects to www.shelestwellness.ca)
 - we also have email forwarding configured on porkbun.com to forward massage@shelestwellness.ca to shelestwellness@gmail.com
 - Resend.com is used for contact form email sending. API key is configured using RESEND_API_KEY variable. Emails are sent to shelestwellness@gmail.com
 - the phone number was created using fongo.com to have an 819 area code for SEO purposes
 - website is deployed on vercel.com (currently free tier)
 - more information about website is in README.md file
 - The contact form (src/components/ContactForm.tsx) uses a honeypot field to filter bots
	 

## Best Practices to follow:

 - Site must use two languages (English, French)
 - Avoid duplications. Use dedicated file for all business details and configurations - config.ts file (also for data that may be shared and reused).
 - Use coding best practices. Code should be clean, well structured and use design patterns where applicable, avoid duplications, support two languages.
 - Every change should take into consideration priority for SEO best practices (Search engine optimization)
 - Remember to update README.md file after important changes that should be mentioned there 
 - I am keeping my TODO in `TODO.md`. If there is a suggested task for future, suggest a new task there. Don't delete tasks from this file yourself. just sujjest removing them if it is done already.
 
## RULES

 - When in doubt or when you need an additional context for better results, state it clearly and ask relevant questions that will help you to get the best results before you continue.
 - Take all the time that you need. The priority is always for correct response, rather than quick results.
 - if the currect change or few recent changes justify an update of *.md files like architecture or README, then update them

## UI, UX and Design guidelines

 - Should be high-end, fully responsive website
 - Looks well on desktop and mobile devices (mobile browsers)
 - Website should emulate modern aesthetic, elegant headings. Colour palette: deep forest green #2D6A4F as the primary brand color (navbars, buttons, headings, fills), sage green #52B788 for links and hover states, pale sage #F0F7F4 for light section backgrounds, and warm off-white #FAF9F5 as the base page background.
 - Website design could have different styles for full view on a desktop computer vs a narrow view on a phone browser
	- If needed for reference, review session summary of changes we made in `session-with-phone-styles-adjustments` below
 - Use the following websites for design inspiration:
	- https://www.natalimosh.com/
	- https://www.ommassage.net/en/
	- https://www.nateherk.com/

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services, about preview, CTA |
| `/about` | Olha's bio, values, AMQ credential |
| `/fees` | Pricing table with service list |
| `/contact` | Contact info, map, contact form |
| `/privacy-policy` | Privacy policy (not in main nav) |

All routes are available under `/en/` and `/fr/` prefixes.

## SEO (Search Engine Optimization)

 - Refer to `olha-shelest-seo-plan.md` for details
 - Uses best SEO practices, especially for small local businesses.
 - utilizing:
	- All canonical URLs and hreflang alternates
	- Open Graph and Twitter card image URLs
	- Per-page metadata — title, description, Open Graph, Twitter card on every page
	- JSON-LD structured data — HealthAndBeautyBusiness on home & contact pages, Person on About, ItemList (services) on Fees
	- Sitemap — auto-generated at /sitemap.xml with hreflang alternates for both locales (src/app/sitemap.ts)
	- robots.txt — auto-generated at /robots.txt (src/app/robots.ts)
	- Semantic HTML — address in footer uses <address> element
 - Still to add when available:
	- Google Business Profile URL — add to BUSINESS in config.ts and append to the sameAs array in src/lib/jsonld.ts
 

## ROLE

You are an expert website developer with excellent knowledge in following fields:
 - UI expert, knowledgable in latest design and UX fields for website development, specifically in massage, beauty and spa industry
 - Expert in SEO (Search engine optimization) for self employed people with a small business
 - technical expert in technologies like: Next.js, Tailwind CSS, and shadcn/ui


## Previous Sessions summary for context management

# Summary of changes made in `session-with-phone-styles-adjustments`
Mobile Spacing Fixes — Session Summary
All changes are mobile-only (scoped with sm:/md:/lg: prefixes). Desktop layout is untouched.

Problem
Excessive vertical whitespace on narrow/phone screens across all pages.

Changes Made
src/components/sections/HeroSection.tsx

Removed min-h-screen and min-h-[calc(100vh-5rem)] on mobile (now lg: only) — was forcing full viewport height
Reduced text column padding: py-20 → pt-8 pb-6 lg:py-0
Reduced gap before "GATINEAU, QC" tag: mt-14 → mt-7 lg:mt-14
src/components/sections/ServicesSection.tsx

Section padding: py-24 → py-6 md:py-16 lg:py-32
Header bottom margin: mb-16 → mb-4 lg:mb-16
Pre-title margin: mb-4 → mb-3 lg:mb-4
Heading margin: mb-6 → mb-3 lg:mb-6
BotanicalDivider: w-72 my-6 → w-48 lg:w-72 my-2 lg:my-6
CTA margin: mt-14 → mt-8 lg:mt-14
src/components/sections/AboutPreviewSection.tsx

Section padding: py-24 → py-12 md:py-16 lg:py-32
Grid gap: gap-16 → gap-8 lg:gap-16
Green logo box: hidden on mobile (hidden lg:flex) — not needed on phones
src/app/[locale]/about/page.tsx

Bio section padding: py-20 → py-10 md:py-16 lg:py-28
Bio grid gap: gap-16 → gap-8 lg:gap-24
Values section padding: py-20 → py-10 md:py-16 lg:py-28
Values title margin: mb-14 → mb-4 lg:mb-14
Values BotanicalDivider: mt-6 → mt-2 lg:mt-6, w-64 → w-48 lg:w-64
src/app/[locale]/fees/page.tsx

Hero bottom padding: pb-20 → pb-8 lg:pb-20
Content section padding: py-20 → py-5 md:py-16 lg:py-28
Divider wrapper margin: mb-14 → mb-3 lg:mb-14
src/app/[locale]/contact/page.tsx

Hero bottom padding: pb-20 → pb-4 lg:pb-20
Content section padding: py-20 → py-3 md:py-16 lg:py-28
Divider wrapper margin: mb-14 → mb-2 lg:mb-14
Grid gap between form and contact info: gap-8 → gap-16 (doubled on mobile, intentional)

# Summary of changes made in `Services Page & Contact Form Enhancements`
- New: Dedicated Services Page (/en/services, /fr/services)
	- Created src/app/[locale]/services/page.tsx — compact dark header (same style as About/Fees), 4 service sections with alternating image/text layout on desktop, full-width image above text on mobile
	- Each section has anchor ID (#deepTissue, #relaxation, #children) for deep-linking
	- Per-service: extended description, benefits list, "who it's for" callout, starting price, "Book this session" → /contact?type=key, "See full pricing" → /fees#key
	- Added to navigation (between About and Fees), sitemap (priority 0.9), JSON-LD (servicesPageJsonLd with Service schema + areaServed)
	- localBusinessJsonLd on home/contact pages now includes hasOfferCatalog linking to all services

- Config changes (src/lib/config.ts)
	- Each service in SERVICES array now has an image field (src + bilingual alt) — user renamed files to service-deep-tissue.jpg, service-relaxation.jpg, service-children.jpg
	- NAV_LINKS — added { key: 'services', href: '/services' }

- Home Page Hero
	- Added "Our Services" button alongside "Book Your Session" and "Meet Olha"
	- Button sizing adjusted for 3-in-a-row on desktop, stacked on mobile

-Fees Page Restructure
	- Pricing table now grouped by service (was a flat list)
	- Each service group header has: service name + "About this service →" (→ /services#key) + "Book this session →" (→ /contact?type=key), stacked vertically

- Home Page ServicesSection
	- Each service card now has "Learn more →" link to /services#key
	- Bottom CTA now shows both "Explore All Services" and "View Fees & Pricing"

- Contact Form — Inquiry Type Dropdown
	- New "Type" dropdown field in ContactForm.tsx, options built from SERVICES config (no hardcoding)
	- Default: "General Inquiry"; other options: 4 massage services in current locale
	- Pre-selects service when navigating from "Book this session" button via ?type=service-key URL param
	- Contact page reads searchParams server-side, passes initialType prop to form (no useSearchParams, no Suspense needed)
	- Email template shows a "Type" row at the top of the email table; value always resolved to English for Olha

- Duplication & Code Quality
	- Extracted ServiceIcon.tsx component — single source for SVG icon paths, accepts serviceKey + className prop; used in both ServicesSection and services/page.tsx
	- Removed pre-existing unused BUSINESS import from emailTemplate.ts

- SEO / JSON-LD
	- servicesPageJsonLd — Service schema per massage type with areaServed (Gatineau + Ottawa) and AggregateOffer pricing
	- localBusinessJsonLd — added hasOfferCatalog with all services linking to anchor URLs
	- LCP fix on services page: priority + loading="eager" on first service image only

- Fixes
	- Privacy policy date corrected: "April 2025" → "April 2026" in both en.json and fr.json
	- scroll-mt-32 on fees service groups, scroll-mt-24 on services sections — prevents fixed header from covering anchor targets
	- Service images shown on mobile: order-first aspect-[4/3] on mobile, aspect-[4/5] on desktop; sizes updated from 0vw to 100vw

- README
	- Pages table updated (added /services)
	- Images table corrected: SITE.heroBgImage key fixed, all 4 per-service image filenames listed with their SERVICES[n].image.src config key
	- SEO section updated to accurately describe all 4 JSON-LD schemas
	
# Summary of changes made in Place ID + Low-priority improvements session
- Config:
	BUSINESS.placeId, BUSINESS.googleMapsUrl (canonical Place ID URL), BUSINESS.mapsUrl (kept original pb= embed — Place ID embed requires a paid API key) added/updated in src/lib/config.ts

- Testing:
	Vitest installed; run with npm test. 19 tests in src/lib/validation.test.ts covering all validators and text filters.

- Bundle analysis:
	@next/bundle-analyzer wired into next.config.ts, gated on ANALYZE=true. Run with ANALYZE=true npm run build. Bundle is clean — no heavy unexpected client libraries.

- React.memo — permanently skip for this codebase:
	BotanicalDecor and ServiceIcon are only used by Server Components. React.memo is a no-op on server components. Don't suggest memoizing them.

# Summary of changes made for new bookings functionality (Custom Booking System)

## What was built

A custom online booking system for shelestwellness.ca. Clients pick a service,
duration, date, and time slot, then submit a request. Olha receives an email with
Accept/Decline links. Payment is always in-person (cash or e-transfer).

**Key principle: Google Calendar is the single source of truth — no database.**

## New pages

| Route | Description |
|---|---|
| `/[locale]/booking` | Public 4-step booking wizard (bilingual EN/FR) |
| `/admin` | Olha's private dashboard — NOT in nav, NOT in sitemap |

## New files

| File | Purpose |
|---|---|
| `src/lib/googleCalendar.ts` | Google Calendar API client (service account) |
| `src/lib/bookingSlots.ts` | Slot availability algorithm |
| `src/lib/bookingTokens.ts` | HMAC sign/verify for Accept/Decline links |
| `src/lib/bookingEmails.ts` | All 4 email templates (Resend) |
| `src/lib/adminAuth.ts` | Session check helper for admin routes |
| `src/app/[locale]/booking/page.tsx` | Booking page (server component) |
| `src/app/[locale]/booking/BookingWizard.tsx` | 4-step booking wizard (client component) |
| `src/app/admin/page.tsx` | Admin dashboard |
| `src/app/admin/AdminDashboard.tsx` | Dashboard UI (client component) |
| `src/app/admin/layout.tsx` | Auth protection — redirects if not Olha |
| `src/app/admin/auth-error/page.tsx` | Access denied page |
| `src/app/api/booking/slots/route.ts` | GET available time slots |
| `src/app/api/booking/request/route.ts` | POST new booking request |
| `src/app/api/booking/confirm/route.ts` | GET — Olha accepts (email link) |
| `src/app/api/booking/decline/route.ts` | GET — Olha declines (email link) |
| `src/app/api/admin/bookings/route.ts` | GET all bookings for dashboard |
| `src/app/api/admin/cancel/route.ts` | POST cancel confirmed booking |
| `src/app/api/admin/decline/route.ts` | POST decline pending from dashboard |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth Google OAuth handler |

## Modified files

- `src/lib/config.ts` — added `BOOKING` config block
- `src/components/layout/Header.tsx` — "Book Now" CTA (conditional on `showBookingsService`)
- `src/components/sections/HeroSection.tsx` — hero CTA href → `/booking` when enabled
- `src/components/ServiceCard.tsx` — "Book this session" → `/booking?service=key`
- `src/app/sitemap.ts` — `/booking` added (conditional), `/admin` excluded
- `src/app/robots.ts` — `Disallow: /admin`
- `messages/en.json` + `messages/fr.json` — added `booking` namespace
- `vitest.config.ts` — added jsdom, `@/` alias, test-setup
- `src/test-setup.ts` — `@testing-library/jest-dom` setup

## Calendar event conventions

| Color | Google colorId | Meaning |
|---|---|---|
| Gray (Graphite) | set by Olha | "open" — availability blocks |
| Yellow (Banana) | `'5'` | `[PENDING]` — awaiting confirmation |
| Green (Basil) | `'10'` | `[CONFIRMED]` — accepted appointment |
| Purple (Grape) | `'3'` | `[BREAK]` — buffer after each session |

## BOOKING config block (src/lib/config.ts)

```ts
export const BOOKING = {
  showBookingsService: true,       // false = /booking 404, nav link hidden, CTAs → /contact
  showBookingsAdmin: true,         // false = /admin 404
  breakAfterSession: 30,           // minutes buffer between sessions
  slotInterval: 30,                // granularity of bookable start times
  cancellationNoticeHours: 12,
  availabilityEventTitle: 'open',  // English only — Olha's calendar
  adminEmail: 'shelestwellness@gmail.com',
  calendarColors: { pending: '5', confirmed: '10', break: '3' },
} as const
Feature flags
showBookingsService: false → /booking returns 404, "Book Now" nav hidden, hero CTA falls back to /contact, all /api/booking/* return 503, /booking removed from sitemap
showBookingsAdmin: false → /admin returns 404, all /api/admin/* return 503
Both flags are independent
Security details
HMAC tokens: BOOKING_TOKEN_SECRET (must be 32+ chars) signs eventId in Accept/Decline links. Uses timingSafeEqual for verification.
Admin auth: NextAuth.js + Google OAuth restricted to BOOKING.adminEmail
Confirm route re-checks for slot conflicts before accepting (prevents race conditions)
Email is sent BEFORE deleting calendar events (prevents data loss on email failure)
/admin excluded from sitemap and robots.txt
New env vars required

GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_CALENDAR_ID
BOOKING_TOKEN_SECRET        # 32+ chars, openssl rand -base64 32
GOOGLE_OAUTH_CLIENT_ID
GOOGLE_OAUTH_CLIENT_SECRET
NEXTAUTH_SECRET             # 32+ chars, openssl rand -base64 32
NEXTAUTH_URL=https://www.shelestwellness.ca
See bookings_plan.md for full Google Cloud Console setup steps.

Test coverage
100 tests across 13 files. Run with npm test.
Full test matrix in bookings_plan.md → Testing Plan section.

Flow diagrams
Mermaid diagrams for all 5 flows are in bookings_plan.md → Flow Diagrams section.


# Summary of changes made in `Booking Security & UX Hardening` session

## UX improvements

- **Book Now resets wizard**: Header's Book Now button now calls `router.push` with `?t=timestamp`. `page.tsx` passes `t` as `key` on the `<Suspense>` wrapper, forcing a full remount. Both desktop and mobile Book Now converted from `<Link>` to `<button onClick={handleBookNow}>`.
- **Date picker keyboard input blocked**: `onKeyDown={(e) => e.preventDefault()}` on the date input — selection only via calendar picker.

## Security additions

### Priority 1 (implemented)
- **HMAC token expiry (7 days)**: Token format changed from plain hex to `${issuedAt}.${hmac(eventId:issuedAt)}`. `verifyToken` now rejects tokens older than 7 days without a database. Exported `TOKEN_TTL_MS` constant. `src/lib/bookingTokens.ts`.
- **Max 3 pending bookings per email**: `POST /api/booking/request` calls new `listEventsInRange()` to scan the next 90 days of calendar events, counts `[PENDING]` events matching the submitted email. ≥ 3 → `400 too_many_pending`. `src/lib/googleCalendar.ts` (added `listEventsInRange`).

### Priority 2 (planned — see TODO.md)
- Rate limiting per IP — not yet implemented. Requires Upstash Redis free tier. Documented in `TODO.md` as HIGH PRIORITY and in `bookings_plan.md → Security → Priority 2`.

### Priority 3 (implemented)
- **CSRF origin check**: `src/lib/csrfProtection.ts` — `verifySameOrigin(request)` checks `Origin` header against `NEXTAUTH_URL`. Wrong origin → `403`. Applied to `POST /api/admin/cancel` and `POST /api/admin/decline`.
- **Bot alert emails**: `sendBotAlertEmail(reason, ip?)` added to `src/lib/bookingEmails.ts`. Called fire-and-forget (`.catch(() => {})`) when honeypot or timing check blocks a submission. Sends reason + IP to `BOOKING.adminEmail`.

## New / modified files

| File | Change |
|---|---|
| `src/lib/bookingTokens.ts` | New token format with expiry |
| `src/lib/googleCalendar.ts` | Added `listEventsInRange(timeMin, timeMax)` |
| `src/lib/bookingEmails.ts` | Added `sendBotAlertEmail(reason, ip?)` |
| `src/lib/csrfProtection.ts` | New — `verifySameOrigin()` helper |
| `src/app/api/booking/request/route.ts` | Max pending per email, bot alert calls |
| `src/app/api/admin/cancel/route.ts` | CSRF check |
| `src/app/api/admin/decline/route.ts` | CSRF check |
| `src/app/[locale]/booking/page.tsx` | Accepts `searchParams`, passes `t` as Suspense key |
| `src/components/layout/Header.tsx` | Book Now → `router.push` with timestamp |
| `src/app/[locale]/booking/BookingWizard.tsx` | Honeypot field, `formStartedAt`, keyboard block on date |

## Test count
111 tests across 13 files (up from 100). New tests: token expiry/malformed, bot alert sent on detection, max pending per email (at/below threshold), CSRF wrong origin on cancel and decline.

# Summary of changes made in `Bug fixes, rename "open", and code quality refactoring`

## Bug fixes
- **Admin layout** — `src/app/admin/layout.tsx` now renders `<html>/<body>` tags. The `/admin` route is outside the `[locale]` group which provides those tags, so it was missing them.
- **Admin dashboard data** — `GET /api/admin/bookings` returns `{ bookings: [...] }` but the client was setting state to the whole object. Fixed with `data.bookings ?? data` in `AdminDashboard.tsx`.

## Availability event title renamed
- `BOOKING.availabilityEventTitle` changed from `'available for massage'` to `'open'` in `src/lib/config.ts`.
- Updated everywhere: `CLAUDE.md`, `bookings_plan.md`, `README.md`, and all test files. Existing Google Calendar events must be renamed manually.

## Code quality — shared utilities extracted

### New lib files
| File | Exports |
|---|---|
| `src/lib/routeHelpers.ts` | `htmlResponse`, `jsonResponse`, `getClientIp` |
| `src/lib/bookingEventParser.ts` | `parseEventDescription`, `bookingDetailsFromEvent` |
| `src/lib/adminGuard.ts` | `requireAdminAccess` (feature flag + CSRF + session auth in one call) |

### New test utilities
| File | Exports |
|---|---|
| `src/test/mockConfig.ts` | `MOCK_BOOKING_BASE`, `MOCK_SERVICES` — shared Vitest mock for `@/lib/config` |
| `src/test/fixtures.ts` | `ADMIN_SESSION`, `MOCK_BOOKING_DESCRIPTION`, `BOOKING_SESSION_START/END/BREAK_END` |

### Routes simplified
- `booking/confirm/route.ts` and `booking/decline/route.ts` — removed duplicate `htmlResponse`/`jsonResponse` helpers and inline `BookingDetails` construction
- `admin/cancel/route.ts` and `admin/decline/route.ts` — 12-line guard + 14-line object construction replaced with 2-line calls to `requireAdminAccess` and `bookingDetailsFromEvent`
- `booking/request/route.ts` — inline IP extraction replaced with `getClientIp(request)`

### Test files simplified
- 4 route test files now use async `vi.mock` factory importing from `src/test/mockConfig.ts`
- 2 admin test files now import `ADMIN_SESSION`, `MOCK_BOOKING_DESCRIPTION`, and session dates from `src/test/fixtures.ts`
- `bookingSlots.test.ts` — `const AVAIL` now derives from real `BOOKING.availabilityEventTitle` instead of a hardcoded string

