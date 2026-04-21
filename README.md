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

The key is used by the contact form (`/api/contact`) to send emails to the business address.

**When deploying to Vercel:** add `RESEND_API_KEY` as an environment variable in the Vercel project settings — `.env.local` is not used in production.

---

## Business Details & Configuration

All contact info, phone, email, address, AMQ details, and the site URL are centralized in one file:

```
src/lib/config.ts
```

Update that single file to change any business details site-wide.

### When you get a domain

Update `SITE.url` in `config.ts` — this single change propagates to:
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
- **JSON-LD structured data** — `HealthAndBeautyBusiness` on home & contact pages, `Person` on About, `ItemList` (services) on Fees
- **Sitemap** — auto-generated at `/sitemap.xml` with `hreflang` alternates for both locales (`src/app/sitemap.ts`)
- **robots.txt** — auto-generated at `/robots.txt` (`src/app/robots.ts`)
- **Semantic HTML** — address in footer uses `<address>` element

**Still to add when available:**
- `openingHours` in JSON-LD (`src/lib/jsonld.ts` → `businessEntity`)
- Google Business Profile (links to it via `sameAs` once created)

---

## Contact Form Security

The contact form (`src/components/ContactForm.tsx`) uses a **honeypot** field to filter bots:

- A hidden `<input name="website">` field is rendered off-screen, invisible to real users
- Bots that auto-fill all fields will populate it
- If the field is non-empty, the client silently fakes a success response without hitting the server
- The API route (`src/app/api/contact/route.ts`) also checks and discards the submission server-side as a second line of defence

No third-party captcha service is used — no cost, no user friction, no additional privacy policy obligations.

---

## Images

Images are stored in `public/images/`:

| File | Usage |
|---|---|
| `logo.png` | Header logo (inverted white via CSS) |
| `image1.jpg` | Hero section & Open Graph default image |
| `olya-pic.jpg` | About page portrait & OG image for About |

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services, about preview, CTA |
| `/about` | Olha's bio, values, AMQ credential |
| `/fees` | Pricing table with service list |
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

