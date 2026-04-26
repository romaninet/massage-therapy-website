# Olha Shelest — Massage Therapy Website

Bilingual (EN/FR) website for Olha Shelest, Professional Massage Therapist, Gatineau QC.  
Built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, **next-intl**, and **Resend**.

---

## Getting Started

```bash
npm install
npm run dev        # local dev server
npm test           # run validation unit tests (Vitest)
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
  - `HealthAndBeautyBusiness` (with `hasOfferCatalog` linking to all services) — home & contact pages
  - `Person` (with `hasCredential`, `knowsAbout`, `sameAs`) — About page
  - `ItemList` with `Service` schema (per-service with pricing and area served) — Services page
  - `ItemList` with `Offer` schema (per duration tier with pricing) — Fees page
  - `BreadcrumbList` — About, Services, Fees, Contact, Privacy Policy pages
- **Sitemap** — auto-generated at `/sitemap.xml` with `hreflang` alternates for both locales (`src/app/sitemap.ts`)
- **robots.txt** — auto-generated at `/robots.txt` (`src/app/robots.ts`)
- **Semantic HTML** — address in footer uses `<address>` element

**Google Analytics 4:** tracking is injected in `src/app/[locale]/layout.tsx` via `next/script` with `strategy="afterInteractive"`. Set `NEXT_PUBLIC_GA_ID` to your GA4 Measurement ID (e.g. `G-XXXXXXXXXX`) to enable it. Omitting the variable disables tracking entirely.

**Google Business Profile:** created and linked. `BUSINESS.placeId` in `config.ts` holds the Google Place ID (`ChIJdWEcfCQFzkwRs-6HVpA9BB0`). `BUSINESS.googleMapsUrl` is the canonical Place ID URL included in the `sameAs` array of both `localBusinessJsonLd` and `personJsonLd` in `src/lib/jsonld.ts`, and used as the `hasMap` value in structured data. The contact page map embed uses `BUSINESS.mapsUrl` — the original `?pb=` embed URL (Place ID-based embed requires a paid Maps API key, so the `pb=` URL is kept for the iframe).

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

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services teaser, about preview, CTA |
| `/about` | Olha's bio, values, AMQ credential |
| `/services` | Dedicated services page — detailed description, benefits, and pricing entry point for each massage type (Therapeutic, Deep Tissue, Relaxation, Lymphatic Drainage, Children's, Couples) |
| `/fees` | Pricing table grouped by service, with links to the services page |
| `/contact` | Contact info, map, contact form |
| `/privacy-policy` | Privacy policy (not in main nav) |

All routes are available under `/en/` and `/fr/` prefixes.

---

## Deployment

The site is deployed on **Vercel**. Pushing to `main` triggers an automatic deployment.

Make sure the following environment variables are set in Vercel project settings:
- `RESEND_API_KEY`
- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`). When set, the GA4 tracking script is injected into every page via `src/app/[locale]/layout.tsx`. Omit or leave blank to disable tracking (useful for local development).


## Backlinks & Directory Listings

Listings that have been created and must be kept up to date (NAP, hours, website URL) whenever business details change.

**NAP to keep consistent everywhere:**
Olha Shelest · 148 Rue Eddy Unit 2, Gatineau QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca

| Platform | URL | Date Created | Login / Account | Notes |
|----------|-----|--------------|-----------------|-------|
| AMQ (Association des massothérapeutes du Québec) | [membres.rmqmasso.ca/en/find-member/details/M-24-4471](https://membres.rmqmasso.ca/en/find-member/details/M-24-4471) | — | Member ID: M-24-4471 | Highest-value backlink. Add website URL if not already set. Update if address or phone changes |
| Yelp Canada | yelp.ca | 2026-04-25 | — | Free listing. Update if address, phone, or hours change |
| RateMDs | ratemds.com | 2026-04-25 | — | Free basic profile. Ranks well in Google name searches |
| Cylex Canada | cylex.ca | 2026-04-25 | — | Free business directory listing. Update if address, phone, or hours change |

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

