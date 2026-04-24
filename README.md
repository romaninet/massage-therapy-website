# Olha Shelest — Massage Therapy Website

Bilingual (EN/FR) website for Olha Shelest, Professional Massage Therapist, Gatineau QC.  
Built with **Next.js**, **Tailwind CSS**, **shadcn/ui**, **next-intl**, and **Resend**.

---

## Getting Started

```bash
npm install
npm run dev
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
  - `Person` — About page
  - `ItemList` with `Service` schema (per-service with pricing and area served) — Services page
  - `ItemList` with `Offer` schema (per duration tier with pricing) — Fees page
  - `BreadcrumbList` — About, Services, Fees, Contact, Privacy Policy pages
- **Sitemap** — auto-generated at `/sitemap.xml` with `hreflang` alternates for both locales (`src/app/sitemap.ts`)
- **robots.txt** — auto-generated at `/robots.txt` (`src/app/robots.ts`)
- **Semantic HTML** — address in footer uses `<address>` element

**Google Business Profile:** created and linked. `BUSINESS.googleMapsUrl` in `config.ts` holds the Maps short link. It is included in the `sameAs` array in `src/lib/jsonld.ts` and used as the `hasMap` value in structured data. The contact page map embed (`BUSINESS.mapsUrl`) is hardcoded to Olha's verified listing via the `?pb=` embed URL.

---

## Contact Form

The contact form logic is split across three files for maintainability:

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
| `service-swedish.jpg` | `SERVICES[0].image.src` | Swedish Massage section image on the Services page |
| `service-deep-tissue.jpg` | `SERVICES[1].image.src` | Deep Tissue Massage section image on the Services page |
| `service-relaxation.jpg` | `SERVICES[2].image.src` | Relaxation Massage section image on the Services page |
| `service-children.jpg` | `SERVICES[3].image.src` | Children's Massage section image on the Services page |
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
| `/services` | Dedicated services page — detailed description, benefits, and pricing entry point for each massage type |
| `/fees` | Pricing table grouped by service, with links to the services page |
| `/contact` | Contact info, map, contact form |
| `/privacy-policy` | Privacy policy (not in main nav) |

All routes are available under `/en/` and `/fr/` prefixes.

---

## Deployment

The site is deployed on **Vercel**. Pushing to `main` triggers an automatic deployment.

Make sure the following environment variable is set in Vercel project settings:
- `RESEND_API_KEY`


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

