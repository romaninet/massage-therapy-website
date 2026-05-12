# Olha Shelest — Massage Therapy Website

Bilingual (EN/FR) website for Olha Shelest, Professional Massage Therapist, Gatineau QC.  
Built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, **next-intl**, and **Resend**.

---

## Owner's Guide

> This section is for Olha — the massage therapist and website owner. No technical knowledge required. Everything here describes how to use the website day-to-day.

---

## Admin — Managing Your Business

### The Admin Dashboard

The admin dashboard is your private management page. There is a link to it in the website footer. Bookmark it on your phone and computer for quick access.

**Address:** `https://www.shelestwellness.ca/admin`

**Signing in:** click **Sign in with Google** and use your `shelestwellness@gmail.com` account. You will stay signed in until you sign out or clear your browser.

The dashboard has four tabs:

**Pending tab**

Shows all unconfirmed booking requests waiting for your response.

- Each request shows: client name, email, phone, preferred language, service, duration, date, time, and any notes.
- Two action buttons per request: **Accept** (green) and **Decline** (red). Both ask for confirmation before acting.
- A badge on the tab shows the number of pending requests at a glance.

**Confirmed tab**

Shows upcoming confirmed appointments.

- Same card layout as the Pending tab.
- One action button per booking: **Cancel Booking** (red) — asks for confirmation before cancelling.
- A badge shows the total number of confirmed upcoming bookings.

**Past tab**

Shows completed bookings. Use the month/year selectors to browse history.

- Each entry shows: client name, date, time, service, and duration.
- Click **Details** on any entry to open a read-only view of the full booking (client contact info, notes, etc.).

**Availability tab**

A monthly calendar view for managing your open time slots.

- Use **Previous / Next** arrows to navigate months (up to 12 months ahead, no past months).
- Days with a small amber dot already have a confirmed or pending booking — useful for spotting conflicts.
- Click **Today** to jump back to the current month.
- Click the **Refresh** button to force the dashboard to reload fresh data from your calendar.
- Click on any day to add an availability block for that day.

---

### Setting Your Availability

You set your availability from the **Availability tab** in the Admin Dashboard — the website then shows those times to clients automatically.

**To open a time slot for clients to book:**
1. Go to `https://www.shelestwellness.ca/admin` and sign in.
2. Click the **Availability** tab.
3. Navigate to the month you want using the Previous / Next arrows.
4. Click on any day to add an availability block for that day.
5. Choose the start and end time, then save.

The booking page on the website will show that time as available immediately.

**Tips:**
- You can add as many blocks as you like on a single day (e.g. morning and evening).
- You can set availability weeks or months in advance.
- Days with an amber dot already have a confirmed or pending booking — be mindful of those when adding new blocks.
- The website shows availability up to 12 months ahead.

**Alternative — via Google Calendar directly:**
You can also create availability by adding an event named exactly `open` (lowercase) in **Graphite (gray)** color in Google Calendar. The website reads these the same way. This is useful if you are already in Google Calendar and want to add several blocks at once. To remove availability added this way, delete the `open` event from Google Calendar.

---

### When a Client Makes a Booking Request

When a client submits a booking request through the website, here is what happens automatically:

1. A **yellow event** (marked `[PENDING]`) appears on your Google Calendar for that date and time.
2. You receive an **email** at `shelestwellness@gmail.com` with all the client's details: name, phone, email, service, duration, date, time, and any notes they left.
3. The email contains two buttons: **Accept Booking** and **Decline Booking**.
4. The client receives a brief acknowledgment email letting them know their request was received and is pending confirmation.

**Important:** the Accept and Decline buttons in your email expire after **7 days**. If you haven't acted on a request within 7 days, the buttons will stop working — use the **Pending** tab in the Admin Dashboard to accept or decline it instead.

---

### Accepting a Booking Request

**Option A — via email (easiest):**
1. Open the booking request email.
2. Click **Accept Booking**.
3. You may be asked to sign in with your Google account first (one-time, then it remembers you).
4. A confirmation page appears — click the confirm button to finalize.

**Option B — via the Admin Dashboard:**
1. Go to the **Pending** tab.
2. Find the request and click **Accept**.

**What happens automatically either way:**
- The calendar event turns **green** (`[CONFIRMED]`).
- A **purple** break block is added right after the session (buffer time between clients).
- The client receives a **confirmation email** with full appointment details: date, time, location, payment info, and cancellation policy.

---

### Declining a Booking Request

**Option A — via email:**
1. Open the booking request email.
2. Click **Decline Booking**.
3. Sign in with your Google account if prompted.
4. Confirm the decline.

**Option B — via the Admin Dashboard:**
1. Go to the **Pending** tab.
2. Find the request and click **Decline**.

**What happens automatically either way:**
- The pending calendar event is deleted.
- The client receives a polite email letting them know that time is no longer available and inviting them to rebook.

---

### Cancelling a Confirmed Booking

1. Go to the Admin Dashboard → **Confirmed** tab.
2. Find the booking and click **Cancel Booking**.

**What happens automatically:**
- The green confirmed event and the purple break block are both removed from your calendar.
- The client receives a cancellation email with your phone number and email so they can rebook.

---

### Getting Reviews from Clients

There is a short link you can share with clients after their appointment to leave a Google review:

`https://www.shelestwellness.ca/reviews`

This link goes directly to your Google Business Profile review form — clients do not need to search for you. Share it by text message, email, or print it on a card.

---

## Client Experience — What Clients See and Receive

### How Clients Book

Clients follow a step-by-step booking flow on the website:

1. **Select a service and duration** — e.g. Therapeutic Massage, 60 min.
2. **Choose a date** — only days with available slots are shown.
3. **Choose a time** — available start times for that day are listed.
4. **Enter their details** — name, phone, email, optional notes, and preferred language (English or French).
5. **Submit** — they receive an acknowledgment email and wait for your confirmation.

Once you accept, they receive a full confirmation email. If you decline, they receive a polite notice with a link to rebook.

---

### Emails Clients Receive

All emails are sent automatically from `massage@shelestwellness.ca` in the client's preferred language (English or French).

| When | What the client receives |
|---|---|
| After submitting a booking request | Acknowledgment — request received, pending your confirmation |
| After you accept | Confirmation — date, time, location, payment info, cancellation policy |
| After you decline | Decline notice — invitation to rebook |
| The day before their appointment | Reminder — date, time, location, cancellation policy |
| After you cancel a confirmed appointment | Cancellation notice — your contact details for rebooking |

---

### Appointment Reminder Emails

Every day at approximately **10:00 AM**, the website automatically checks for confirmed bookings scheduled for the **following day** and sends each client a reminder email.

The reminder includes: appointment date and time, service and duration, location, and a note about the cancellation policy (at least 12 hours notice required).

**You do not need to do anything** — this runs entirely on its own. If you ever need to turn reminders off temporarily, ask your developer.

---

### The Contact Form

When someone fills out the contact form on the website, the message is sent to `shelestwellness@gmail.com`. The email includes the sender's name, phone number, email address, inquiry type, and message.

You reply directly from Gmail — just hit reply. There is no separate inbox to check.

**Spam protection:** the contact form has invisible spam filters built in. You should almost never receive automated spam submissions.

---

### Couples Massage Bookings

Couples massage cannot be booked online (because it requires coordinating two therapists). When a visitor selects Couples Massage on the booking page, they are redirected to the contact form with the inquiry type pre-filled as "Couples Massage."

You handle these bookings manually by phone or email after receiving the inquiry.

---

### Languages — English and French

The entire website is available in both English and French. Visitors switch languages using the toggle in the top-right corner of any page.

When a client books, they choose their preferred language. All automated emails they receive (confirmation, reminder, cancellation) are sent in that language automatically.

You do not need to manage translations or languages — it all happens automatically.

---

### Payments

Payment is collected **at the time of the appointment**. The website reminds clients of this in their confirmation email. Accepted methods:

- **Cash**
- **Interac e-Transfer**

The website does not process payments online.

---

## Getting Started (Developer)

```bash
npm install
npm run dev        # local dev server
npm test           # run all unit and integration tests (Vitest — 158 tests)
ANALYZE=true npm run build  # bundle analysis (opens HTML report in browser)
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Environment Variables

Create a `.env.local` file in the project root (never commit this file — it's in `.gitignore`):

```
RESEND_API_KEY=re_your_api_key_here
```

**How to get your Resend API key:**
1. Go to [resend.com](https://resend.com) and sign in
2. Navigate to **API Keys** in the dashboard
3. Create a new key and copy it
4. Paste it into `.env.local` as shown above

The key is used by the contact form (`/api/contact`) to send emails via `massage@shelestwellness.ca`.

**Resend domain setup:** the sending domain `shelestwellness.ca` must be verified in the [Resend dashboard](https://resend.com/domains) (add the DNS records Resend provides to Porkbun). Without verification, emails will be rejected with a 403 error.

**When deploying to Vercel:** add `RESEND_API_KEY` as an environment variable in the Vercel project settings — `.env.local` is not used in production.

---

## Business Details & Configuration

All contact info, phone, email, address, AMQ details, and the site URL are centralized in one file:

```
src/lib/config.ts
```

Update that single file to change any business details site-wide.

### Page header

The dark forest-green header section (pre-title, H1, subtitle, botanical corners) shared by About, Services, Fees, Contact, and Privacy Policy is a single component at `src/components/sections/PageHeaderSection.tsx`. Pass `preTitle`, `title`, `subtitle` (optional), and `pb` (optional bottom-padding class, defaults to `'pb-20'`).

### CSS component classes

Shared Tailwind patterns are extracted into `@layer components` in `src/app/globals.css`. **Use these classes instead of copy-pasting the utility strings:**

| Class | Expands to | Used for |
|---|---|---|
| `.section-pretitle` | `text-sage font-medium tracking-[0.25em] uppercase text-xs` | Small uppercase sage label above section headings |
| `.container-wide` | `max-w-7xl mx-auto px-6 lg:px-12` | Standard page/section content width with responsive horizontal padding |
| `.heading-section` | `font-semibold text-forest text-4xl lg:text-5xl` | In-flow section `<h2>` headings (not the hero H1) |
| `.btn-light` | White-on-forest CTA button with lift hover effect | Primary CTA on dark backgrounds (hero, fees CTA, CTA section) |
| `.icon-badge` | `w-12 h-12 rounded-full bg-pale-sage flex items-center justify-center flex-shrink-0` | Circular pale-sage icon container (contact info, values cards) |

Per-site spacing utilities (`mb-3`, `gap-3`, etc.) compose with these classes as normal — they override the component layer automatically per Tailwind's cascade order.

### Price formatting

`src/lib/format.ts` exports `formatPrice(price, locale)` — use this whenever displaying a CAD price. Returns `$X` for EN and `X $` for FR.

### Page metadata

All page `generateMetadata` functions use a shared helper at `src/lib/metadata.ts` (`generatePageMetadata`). Pass `locale`, `path`, bilingual `titles` and `descriptions`, and an optional `ogImage`/`ogImageAlt` — canonical URLs, hreflang alternates, Open Graph, and Twitter card are all built automatically.

### Domain

The live domain is `https://www.shelestwellness.ca`, set in `SITE.url` in `config.ts`. This single value propagates to:
- All canonical URLs and `hreflang` alternates
- Open Graph and Twitter card image URLs
- JSON-LD structured data (`@id`, `url`, `image`)
- `robots.txt` sitemap pointer
- `sitemap.xml` entries

---

## Languages

Translation strings are in:

```
messages/en.json
messages/fr.json
```

All user-facing text lives here. The site uses `next-intl` for routing and translations — locale is determined by the URL prefix (`/en/`, `/fr/`).

---

## SEO

The site is set up with:

- **Per-page metadata** — title, description, Open Graph, Twitter card on every page
- **JSON-LD structured data:**
  - `HealthAndBeautyBusiness` (with `hasOfferCatalog`, `aggregateRating`, and `review[]` from client testimonials) — home & contact pages
  - `Person` (with `hasCredential`, `knowsAbout`, `sameAs`) — About page
  - `ItemList` with `Service` schema (per-service with pricing and area served) — Services page
  - `ItemList` with `Offer` schema (per duration tier with pricing) — Fees page
  - `FAQPage` with 5 general Q&As — home page
  - `FAQPage` with 5 service-specific Q&As — Services page
  - `FAQPage` with 3 area-specific Q&As + `HealthAndBeautyBusiness` + `BreadcrumbList` — each local area landing page
  - `BreadcrumbList` — About, Services, Fees, Contact, Privacy Policy pages
  - `Article` (E-E-A-T: `author.sameAs`, `author.hasCredential`, `publisher.logo`, `keywords`, `about: MedicalTherapy`, `speakable`) + `FAQPage` + `BreadcrumbList` — each article page
  - `HowTo` (step-by-step schema) — `how-to-choose-massage-therapist-gatineau` and `amq-receipts-massage-insurance-coverage-gatineau` articles
  - `WebSite` with `SearchAction` — emitted on every page via locale layout (`src/app/[locale]/layout.tsx`)
- **Sitemap** — auto-generated at `/sitemap.xml` with `hreflang` alternates for both locales (`src/app/sitemap.ts`)
- **robots.txt** — auto-generated at `/robots.txt` (`src/app/robots.ts`); includes explicit opt-in rules for `GPTBot`, `Claude-Web`, and `PerplexityBot`
- **Semantic HTML** — address in footer uses `<address>` element; `<header>` carries `role="banner"`; `<main>` carries `id="main-content"`
- **Accessibility** — skip-to-content link in `Header.tsx` (visually hidden, appears on keyboard focus, targets `#main-content`); contact form error state uses `role="alert" aria-live="polite"` so screen readers announce it automatically; carousel prev/next buttons have `focus-visible` rings

**Google Analytics 4:** tracking is injected in `src/app/[locale]/layout.tsx` via `next/script` with `strategy="afterInteractive"`. Set `NEXT_PUBLIC_GA_ID` to your GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) to enable it. Omitting the variable disables tracking entirely.

**Google Business Profile:** created and linked. `BUSINESS.placeId` in `config.ts` holds the Google Place ID (`ChIJdWEcfCQFzkwRs-6HVpA9BB0`). `BUSINESS.googleMapsUrl` is the canonical Place ID URL included in the `sameAs` array of both `localBusinessJsonLd` and `personJsonLd` in `src/lib/jsonld.ts`, and used as the `hasMap` value in structured data. The contact page map embed uses `BUSINESS.mapsUrl` — the original `?pb=` embed URL (Place ID-based embed requires a paid Maps API key, so the `pb=` URL is kept for the iframe).

---

## AEO (Answer Engine Optimization)

Optimizations targeting AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot). See `AEO_optimization_plan.md` for the full plan.

### Phase 1 — Crawler signals (complete)

- **`public/llms.txt`** — static plain-text entity file served at `/llms.txt`. AI crawlers (GPTBot, Claude-Web, PerplexityBot) read this to understand who the entity is, what pages to prioritize, and what services/articles are available. Update this file whenever services, prices, or articles change.
- **`src/app/robots.ts`** — explicit named rules for `GPTBot`, `Claude-Web`, and `PerplexityBot` alongside the existing wildcard rule.

### Phase 2 — Schema enhancements (complete)

All changes are schema/data only — no UI impact.

- **Article E-E-A-T** — `articleJsonLd()` in `src/lib/jsonld.ts` now emits `author.sameAs` (all directory listings), `author.hasCredential` (AMQ credential), `publisher.logo`, `keywords` (per-article, from translation files), `about: MedicalTherapy`, and a `SpeakableSpecification` targeting `h1`, `.article-excerpt`, and `.article-quick-answer`. The last two CSS selectors activate once Phase 3 Quick Answer boxes are added.
- **HowTo schema** — `howToJsonLd()` in `src/lib/jsonld.ts`; bilingual `howToSteps` arrays in `messages/en.json` and `messages/fr.json` for the two procedural articles (`how-to-choose` and `amq-receipts`). The article `page.tsx` conditionally emits the schema when steps are present.
- **Shared credential helper** — `amqCredential(locale)` extracted from `personJsonLd()` and reused in `articleAuthorPerson()` to avoid duplication.
- **WebSite + SearchAction** — `websiteSearchJsonLd()` emitted in `src/app/[locale]/layout.tsx` on every page; targets the articles index search endpoint.

### Adding keywords or HowTo steps to an article

Each article in `messages/en.json` / `messages/fr.json` supports two optional keys:
- `"keywords": ["...", "..."]` — comma-joined into the Article schema `keywords` field
- `"howToSteps": [{ "name": "...", "text": "..." }, ...]` — emits a `HowTo` schema block alongside the article; add for any article structured as a how-to guide

---

## Contact Form

The contact form logic is split across four files for maintainability:

| File | Purpose |
|---|---|
| `src/components/ContactForm.tsx` | State, submit handler, honeypot, layout (~110 lines) |
| `src/components/FormField.tsx` | `<FormField>` and `<TextareaField>` UI primitives |
| `src/lib/validation.ts` | `TEXT_FILTERS`, `isValidPhone`, `validateForm()`, shared types |
| `src/hooks/useInquiryTypes.ts` | Hook returning inquiry-type dropdown options in current locale |

## Contact Form Security

The contact form (`src/components/ContactForm.tsx`) uses a **honeypot** field to filter bots:

- A hidden `<input name="website">` field is rendered off-screen, invisible to real users
- Bots that auto-fill all fields will populate it
- If the field is non-empty, the client silently fakes a success response without hitting the server
- The API route (`src/app/api/contact/route.ts`) also checks and discards the submission server-side as a second line of defence

No third-party captcha service is used — no cost, no user friction, no additional privacy policy obligations.

---

## Booking System

The booking system lets clients pick a service, duration, date, and time slot, then submit a request. Olha receives an email with Accept/Decline links to confirm or decline the appointment.

### How it works

1. **Availability** — Olha creates events titled `"open"` in her Google Calendar using the **Graphite (gray)** color. These blocks define when clients can book.
2. **Slot generation** — the API reads those blocks and generates bookable start times (30-minute granularity, 30-minute buffer between sessions).
3. **Booking request** — the client submits the form; a `[PENDING]` event (yellow) is created on the calendar and an email is sent to Olha with Accept/Decline links.
4. **Accept** — Olha clicks Accept in email → re-checks for conflicts → event turns green (`[CONFIRMED]`) → purple `[BREAK]` event created → client receives confirmation email.
5. **Decline** — Olha clicks Decline in email → pending event deleted → client notified. Olha can also decline pending requests from the `/admin` dashboard.
6. **Cancel** — Olha cancels a confirmed booking from the `/admin` dashboard → confirmed event and break event deleted → client notified.
7. **Reminder** — a Vercel Cron Job fires daily at ~10 AM ET, queries the calendar for confirmed appointments the next day, and sends each client a reminder email in their preferred language (EN/FR). Controlled by `REMINDERS.enabled` in `config.ts`.
8. **Google Calendar is the source of truth** — no database; all state is stored as calendar event titles, colors, and JSON in event descriptions.

### Calendar event color conventions

| Color | Meaning | `BOOKING.calendarColors` value |
|---|---|---|
| Gray (Graphite) | Available for massage — Olha marks these blocks herself | *(no value — event title drives detection)* |
| Yellow (Banana) | Pending booking request | `'5'` |
| Green (Basil) | Confirmed appointment | `'10'` |
| Purple (Grape) | Break / blocked time | `'3'` |

### Environment variables

Add these to `.env.local` (and to Vercel project settings for production):

```
# Google Calendar integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com

# Booking token signing (Accept/Decline links)
BOOKING_TOKEN_SECRET=a-long-random-secret-string

# NextAuth (admin dashboard authentication)
GOOGLE_OAUTH_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=your-oauth-client-secret
NEXTAUTH_SECRET=a-long-random-secret-string
NEXTAUTH_URL=https://www.shelestwellness.ca

# Appointment reminder cron job
CRON_SECRET=a-long-random-secret-string
```

### Feature flags (`BOOKING` in `src/lib/config.ts`)

| Flag | Default | Effect |
|---|---|---|
| `showBookingsService` | `true` | Enables the `/booking` page and wires all "Book Now" / "Book this session" CTAs to `/booking`. When `false`, CTAs fall back to `/contact`. `/booking` route also disappears from the sitemap. |
| `couplesMassageBookingEnabled` | `false` | When `false`, the Couples Massage entry in the booking wizard (Step 1) shows a single "Book via phone or contact form" button linking to `/contact?type=couples` (pre-selects Couples Massage in the inquiry dropdown) instead of the normal duration/price buttons. The service card on the Services page is unaffected. Set to `true` to restore the standard booking flow once a second therapist is available. |
| `showBookingsAdmin` | `true` | Enables the `/admin` dashboard route. |

### Appointment reminders (`REMINDERS` in `src/lib/config.ts`)

A Vercel Cron Job (`vercel.json`) calls `GET /api/cron/reminder` daily at `0 14 * * *` UTC (≈ 10:00 AM EDT / 9:00 AM EST). The route:

1. Verifies the `Authorization: Bearer {CRON_SECRET}` header Vercel injects automatically.
2. Checks `REMINDERS.enabled` — returns early if `false`.
3. Computes tomorrow's date in the `America/Toronto` timezone.
4. Fetches all `[CONFIRMED]` calendar events for that date.
5. Sends each client a reminder email in their preferred language (EN/FR) with the appointment date, time, location, and cancellation policy.

| Flag | Default | Effect |
|---|---|---|
| `enabled` | `true` | Master on/off switch. Set to `false` to disable reminder emails without touching the cron schedule. |
| `checkTime` | `'10:00'` | Reference only — the actual schedule lives in `vercel.json`. Documents the intended local time in `America/Toronto`. |

**Note:** The Vercel Hobby (free) plan supports one cron job per project. This reminder job uses that slot.

### Admin dashboard

Olha accesses the admin dashboard at `/admin` (linked in the site footer). Login uses Google OAuth restricted to her Gmail account.

**Tabs:**
- **Pending** — unconfirmed booking requests. Accept (`POST /api/admin/confirm`) and Decline (`POST /api/admin/decline`) actions with confirmation dialog. Badge shows count. Data fetched from `/api/admin/bookings?view=future`, filtered to `[PENDING]` events.
- **Confirmed** — upcoming confirmed bookings. Cancel action (`POST /api/admin/cancel`) with confirmation dialog. Badge shows count. Same data source as Pending tab, filtered to `[CONFIRMED]` events.
- **Past** — historical bookings with month/year selectors. Compact list with a Details modal (read-only). Fetched from `/api/admin/bookings?view=past&month={YYYY-MM}`. Per-month cache via `useRef` Map — revisiting a month is instant; cleared on page reload.
- **Availability** — monthly calendar view of open blocks. Features:
  - Prev/Next month navigation (current month → current+12, no past months)
  - Click any day to add an availability block directly from the dashboard (calls `POST /api/admin/availability`); existing blocks shown with delete buttons
  - Validates: minimum 60-min duration, no overlapping blocks
  - Amber dot on days that have confirmed or pending bookings (conflict indicator)
  - "Today" button to jump back to current month
  - "↺ Refresh" button to force-fetch fresh calendar data
  - In-session cache (React `useRef` Map) — revisiting a month is instant; cleared on page reload

**Event titles** are centralized in `BOOKING.eventTitles` in `config.ts` (`[PENDING]`, `[CONFIRMED]`, `[BREAK]`). The availability block title is `BOOKING.availabilityEventTitle` (`open`).

**Performance:** All data is fetched live from Google Calendar — no server-side caching (`force-dynamic`). The `fields` projection on all Calendar API calls reduces payload by ~70%.

`/admin` is excluded from `robots.txt` (`Disallow: /admin`) and is not in the sitemap.

### Booking security

**Bot protection** (`/api/booking/request`) — three invisible defences, no captcha, no user friction:

| Defence | How it works |
|---|---|
| Honeypot field | Hidden `<input name="website">` (`display:none`, `tabIndex={-1}`). Bots fill it; real users never see it. Non-empty → `400 bot_detected` + alert email to Olha. |
| Timing check | Timestamp recorded when step 4 loads is sent with the request. Submissions < 4 s after the form appeared → `400 bot_detected` + alert email. |
| Max pending per email | If the same email already has 3 `[PENDING]` events on the calendar, the request is rejected → `400 too_many_pending`. |

**HMAC token expiry** — Accept/Decline links in Olha's emails expire after 7 days. The timestamp is embedded in the signed token so no database is needed to enforce this. After 7 days the link returns `400 invalid_signature`.

**CSRF protection** — Admin POST routes (`/api/admin/cancel`, `/api/admin/decline`) check the `Origin` header. Requests from a different origin → `403 forbidden`. This prevents a malicious page from triggering admin actions if Olha is logged in and visits it. Absent `Origin` (curl, server-to-server) is allowed.

**Alert emails** — When bot protection blocks a submission, Olha receives an alert email with the detected reason and IP address. No action is required unless alerts become frequent — in that case, implement rate limiting (see TODO.md).

**Rate limiting** — `POST /api/booking/request` is limited to 5 requests per IP per hour (sliding window) using Upstash Redis + `@upstash/ratelimit`. The per-email pending cap (max 3 concurrent pending bookings) is also enforced. Both limits are bypassed for emails listed in `RATE_LIMITING.bypassEmails` (config.ts) and can be disabled via `RATE_LIMITING_ENABLED=false` in `.env.local` for local development. See the Vercel deployment section for required env vars.

### Testing with a non-production calendar

To avoid polluting Olha's real schedule during development, point `GOOGLE_CALENDAR_ID` at a dedicated test calendar in `.env.local` and in Vercel's **Preview** environment. Only the Vercel **Production** environment should use the real calendar ID.

See **`bookings_plan.md` → Testing Environments** for the full step-by-step setup guide.

---

## Images

Images are stored in `public/images/`. Paths referenced via `SITE` constants in `config.ts` can be swapped site-wide by changing the value there. Service images are managed per-service in the `SERVICES` array in `config.ts` (`SERVICES[n].image.src`).

| File | `config.ts` key | Usage |
|---|---|---|
| `logo.png` | — | Header & about preview panel (inverted white via CSS) |
| `image1.jpg` | `SITE.heroBgImage` | Home page hero section background |
| `service-therapeutic.jpg` | `SERVICES[0].image.src` | Therapeutic Massage section image on the Services page |
| `service-lymphatic.jpg` | `SERVICES[3].image.src` | Lymphatic Drainage section image on the Services page |
| `service-couples.jpg` | `SERVICES[5].image.src` | Couples Massage section image on the Services page |
| `service-deep-tissue.jpg` | `SERVICES[1].image.src` | Deep Tissue Massage section image on the Services page |
| `service-relaxation.jpg` | `SERVICES[2].image.src` | Relaxation Massage section image on the Services page |
| `service-children.jpg` | `SERVICES[4].image.src` | Children's Massage section image on the Services page |
| `image2b.jpg` | `SITE.aboutPreviewImage.src` | About preview section on the home page |
| `media-opengraph.jpg` | `SITE.ogImage` | Open Graph image — home, fees, contact, services, privacy pages |
| `olya-pic.jpg` | `SITE.portraitImage` | About page portrait + OG image for About page |
| `image2.jpg` | — | Currently unused |

Recommended minimum sizes: OG image (`media-opengraph.jpg`) — **1200×630 px**; portrait (`olya-pic.jpg`) — tall crop, at least 800×1000 px; service images — portrait aspect ratio (~4:5), at least 800×1000 px.

---

## FAQ Content

FAQ questions and answers live in the translation files under a top-level `"faq"` key:

```
messages/en.json  →  faq.home.items[]       (5 Q&As on the home page)
                     faq.home.preTitle / title
                     faq.services.items[]   (5 Q&As on the services page)
                     faq.services.preTitle / title
messages/fr.json  →  same structure in French
```

To add, edit, or remove a question, update the `items` array in the relevant file — no code changes needed. Each item is `{ "question": "...", "answer": "..." }`.

The shared display component is `src/components/sections/FAQSection.tsx` (server component, native `<details>/<summary>` — no JavaScript, content always in DOM for SEO). The JSON-LD `FAQPage` schema is generated by `faqJsonLd()` in `src/lib/jsonld.ts`.

---

## Local Area Landing Pages

Four geo-targeted landing pages exist to capture search traffic from specific areas:

| Route | Target audience |
|---|---|
| `/massage-hull` | Hull residents + federal employees at Place du Portage / Terrasses de la Chaudière |
| `/massage-ottawa` | Ottawa residents and cross-river workers (Portage/Alexandra bridges) |
| `/massage-aylmer` | West Gatineau / Aylmer residential area |
| `/massage-outaouais` | Regional catch-all for the full Outaouais (Gatineau, Chelsea, Wakefield, etc.) |

All four share a single layout component at `src/components/sections/AreaPageTemplate.tsx`. Each page file (`src/app/[locale]/massage-*/page.tsx`) is a thin wrapper that reads its content from the `"areas"` namespace in the translation files.

**To edit area page content** — update `messages/en.json` and `messages/fr.json` under `areas.<slug>`:
- `paragraphs[]` — intro body paragraphs
- `gettingHere.title` / `gettingHere.body` — directions block
- `servicesTitle` — heading above the services list
- `faq.items[]` — 3 area-specific Q&As (also emitted as `FAQPage` JSON-LD)

The services list is rendered automatically from the `SERVICES` config — no translation needed.

**To add a new area page:**
1. Add translation entries under `areas.<new-slug>` in both `messages/en.json` and `messages/fr.json`
2. Create `src/app/[locale]/massage-<new-slug>/page.tsx` following the pattern of an existing area page
3. Add the path to `src/app/sitemap.ts`
4. Add a link to the footer service areas row in `src/components/layout/Footer.tsx`

**Footer service areas row** — the area page links in the footer are hardcoded in `src/components/layout/Footer.tsx` (the semi-transparent row between the main grid and the copyright bar). The label "Service Areas" / "Zones desservies" comes from `footer.serviceAreas` in the translation files.

---

## Customer Testimonials

Client reviews are managed in one dedicated file:

```
src/lib/customer-feedback.ts
```

Each entry has `id`, `author` (first name), `rating` (always `5` — used in JSON-LD only, not displayed visually), and `quote` with `en`/`fr` strings. To add, edit, or remove a review, only this file needs to change.

The `TestimonialsSection` component (`src/components/sections/TestimonialsSection.tsx`) renders all reviews in the server HTML at all times (so search crawlers index every review), showing 2 side by side on desktop and 1 on mobile. Left/right arrows let visitors navigate manually; the starting pair is randomised client-side after hydration.

The `localBusinessJsonLd` function (`src/lib/jsonld.ts`) automatically includes all reviews as `Review` structured data with an `AggregateRating` — this appears on the home and contact pages and can unlock star ratings in Google Search results.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services teaser, about preview, testimonials, FAQ section, CTA |
| `/about` | Olha's bio, values, AMQ credential, testimonials |
| `/services` | Dedicated services page — detailed description, benefits, and pricing entry point for each massage type (Therapeutic, Deep Tissue, Relaxation, Lymphatic Drainage, Children's, Couples) — includes service-specific FAQ section |
| `/fees` | Pricing table grouped by service, with links to the services page |
| `/contact` | Contact info, map, contact form |
| `/booking` | Online booking flow — service & duration selection, monthly calendar view (days with available slots highlighted), time slot picker, client details form (enabled when `BOOKING.showBookingsService === true`) |
| `/privacy-policy` | Privacy policy (not in main nav) |
| `/massage-hull` | Local landing page — Hull residents and Ottawa federal workers (Place du Portage) |
| `/massage-ottawa` | Local landing page — Ottawa cross-river angle via Portage bridge |
| `/massage-aylmer` | Local landing page — Aylmer / west Gatineau residents |
| `/massage-outaouais` | Local landing page — regional catch-all for the full Outaouais |
| `/articles` | Articles index — bilingual blog listing |
| `/articles/how-to-choose-massage-therapist-gatineau` | Article: How to choose a massage therapist in Gatineau |
| `/articles/deep-tissue-massage-runners-athletes-gatineau` | Article: Deep tissue massage for runners and athletes |
| `/articles/therapeutic-vs-relaxation-massage-gatineau` | Article: Therapeutic vs relaxation massage — how to choose |
| `/articles/amq-receipts-massage-insurance-coverage-gatineau` | Article: AMQ receipts and getting massage covered by insurance |
| `/articles/lymphatic-drainage-massage-gatineau` | Article: Lymphatic drainage massage — benefits, technique, and who it's for |

All routes are available under `/en/` and `/fr/` prefixes.

---

## Deployment

The site is deployed on **Vercel**. Pushing to `main` triggers an automatic deployment.

Make sure the following environment variables are set in Vercel project settings:

**Existing:**
- `RESEND_API_KEY`
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`). When set, the GA4 tracking script is injected into every page via `src/app/[locale]/layout.tsx`. Omit or leave blank to disable tracking (useful for local development).

**Booking system (required when `BOOKING.showBookingsService === true`):**
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — service account email from Google Cloud Console
- `GOOGLE_PRIVATE_KEY` — full private key from service account JSON (include `\n` escaped)
- `GOOGLE_CALENDAR_ID` — Olha's Google Calendar ID
- `BOOKING_TOKEN_SECRET` — random 32+ char secret for signing Accept/Decline links (`openssl rand -base64 32`)
- `GOOGLE_OAUTH_CLIENT_ID` — OAuth client ID for `/admin` Google sign-in
- `GOOGLE_OAUTH_CLIENT_SECRET` — OAuth client secret
- `NEXTAUTH_SECRET` — random 32+ char secret for NextAuth sessions (`openssl rand -base64 32`)
- `NEXTAUTH_URL` — `https://www.shelestwellness.ca`

**Rate limiting (required in production for IP abuse protection):**
- `UPSTASH_REDIS_REST_URL` — REST URL from [Upstash console](https://console.upstash.com) (free tier)
- `UPSTASH_REDIS_REST_TOKEN` — REST token from Upstash console
- `RATE_LIMITING_ENABLED` — set to `false` in `.env.local` to disable all rate limits during local development (defaults to `true`)

**Appointment reminders (cron job):**
- `CRON_SECRET` — random secret used to authenticate the daily reminder cron job (`openssl rand -base64 32`). Vercel sets this automatically for cron job requests; set the same value in `.env.local` to test locally.

See `bookings_plan.md` for full step-by-step Google Cloud setup instructions.


## Redirects

| Source | Destination | Type | Purpose |
|--------|------------|------|---------|
| `/reviews` | `https://g.page/r/CbPuh1aQPQQdEAI/review` | 301 permanent | Short vanity URL for QR cards and post-session messages → lands client directly on GBP review form |

Redirects are configured in the `redirects()` function in `next.config.ts`.

---

## Backlinks & Directory Listings

Listings that have been created and must be kept up to date (NAP, hours, website URL) whenever business details change.

**NAP to keep consistent everywhere:**
Olha Shelest · 148 Rue Eddy, Unit 2, Gatineau, QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca

| Platform | URL | Date Created | Login / Account | Notes |
|----------|-----|--------------|-----------------|-------|
| AMQ (Association des massothérapeutes du Québec) | [membres.rmqmasso.ca/en/find-member/details/M-24-4471](https://membres.rmqmasso.ca/en/find-member/details/M-24-4471) | — | Member ID: M-24-4471 | Highest-value backlink. Add website URL if not already set. Update if address or phone changes |
| Yelp Canada | [yelp.ca/biz/olha-shelest-massothérapeute-gatineau](https://www.yelp.ca/biz/olha-shelest-massoth%C3%A9rapeute-gatineau) | 2026-04-25 | — | Free listing. Update if address, phone, or hours change |
| Yellow pages | [yellowpages.ca](https://ypforbusiness.yellowpages.ca/) [olha yellow pages](https://www.yellowpages.ca/bus/Quebec/Gatineau/Olha-Shelest/105279173.html) | 2026-04-25 | — | Free listing. Update if address, phone, or hours change |
| RateMDs | [ratemds.com](https://www.ratemds.com/clinic/ca-qc-gatineau-olha-shelest/), [manage](https://help.ratemds.com/support/tickets/new?ticket_form=managing_facilities&utm_source=gsc_managefacilities&utm_medium=gsc_managefacilitiesbanner&utm_campaign=gsc_claimprofile) | 2026-04-25 | — | Free basic profile. Ranks well in Google name searches |
| Cylex Canada | https://www.cylex-canada.ca/company/olha-shelest--massoth%c3%a9rapeute-25186483.html | 2026-04-25 | — | Free business directory listing. Update if address, phone, or hours change |
| Setmore | [shelestwellness.setmore.com](https://shelestwellness.setmore.com/) | 2026-04-26 | — | Booking page / directory listing. Update if address, phone, hours, or services change |
| Bing Places for Business | [bingplaces.com](https://www.bingplaces.com/) (manage) | 2026-04-29 | — | Microsoft Bing business listing. Also powers Apple Maps in Canada (Apple uses Bing data). Update if address, phone, or hours change |
| Apple Business Connect | [business.apple.com](https://business.apple.com/) (manage) | 2026-04-29 | — | Controls how the business appears on Apple Maps, Siri, and Spotlight. Verified via domain TXT record + AMQ professional certificate. Update if address, phone, or hours change |

---

## Claude Code Setup

This project uses [Claude Code](https://www.youtube.com/watch?v=eRS3CmvrOvA&list=LL&index=2) as the AI coding assistant. The following plugins and skill packs are installed to enhance the workflow:

```bash
# Official Anthropic skill packs
/plugin install skill-creator@claude-plugins-official
/plugin install superpowers@claude-plugins-official
/plugin install frontend-design@claude-plugins-official

# GSD (Get Shit Done) — structured task planning and execution workflow
npx get-shit-done-cc --claude --global

# Context mode — toggle focused context windows
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode

# Claude Mem — persistent memory across sessions
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

---

## List of services used

- following emails (gmail + porkbun)
    - shelestwellness@gmail.com
    - info@shelestwellness.ca
    - contact@shelestwellness.ca
    - massage@shelestwellness.ca
- fongo.com
    - (819) 815 5603
- porkbun.com
    - http://shelestwellness.ca/
    - http://www.shelestwellness.ca/
- vercel.com
- resend.com

