# Olha Shelest — Massage Therapy Website

Bilingual (EN/FR) website for Olha Shelest, Registered Massage Therapist, Gatineau QC.
Built with Next.js, Tailwind CSS, next-intl, and Resend.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

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

**When deploying** (e.g. Vercel): add `RESEND_API_KEY` as an environment variable in your hosting platform's settings — do not rely on `.env.local` in production.

## Business Details

All contact info, phone, email, address, and AMQ details are centralized in:

```
src/lib/config.ts
```

Update that single file to change any business details site-wide.

## Languages

Translation strings are in `messages/en.json` and `messages/fr.json`.


## General TODO list:
- fix email for contact form (maybe a new gmail account)
- fix prices
- fix business address

## SEO TODO list
- buy new domain
- create googe business profile for SEO ((Google Maps listing with address, hours, phone) — this is one of the highest-impact local SEO actions and costs nothing.)
- phone number is not gatineau (can confuse google)
- Do you want Google Analytics tracking?

## SEO notes from CLaude code ( TODO in near future)
1.	lang attribute + per-page metadata (EN+FR)	Google needs unique titles/descriptions per page & language
2.	robots.ts + sitemap.ts	Tell search engines how to crawl the site
3.	JSON-LD structured data	Unlock rich results (map pin, business info, therapist credentials)
4.	Open Graph + hreflang	Social sharing previews + bilingual canonicalization
5.	Favicon + manifest	Small but checked by Google
6.	Google Search Console setup	Submit the site, monitor indexing
-----------------
7. Domain — we can start now.
Use the Vercel URL for now. When you buy a domain, we update one constant in the code and everything propagates. I'd recommend buying a domain soon though — Google builds trust in a domain over time, so earlier is better. Something like massotherapiegatiineau.ca or olyashelest.ca would be ideal for local search.

8. Google Business Profile — yes, one small update needed later.
Once Olha creates it, Google gives a "Place ID". We add it to the structured data in the website so Google links the website to the verified business listing. One line of code change. Not urgent.

9. Phone number (506) — not blocking, but worth knowing.
Google uses phone area code as a local signal. A 819 (Gatineau/Outaouais) number would slightly strengthen local search ranking. A 506 number won't hurt badly — Google has many other signals. Not worth changing if it's her real number.

10. Google Analytics — free, recommended.
It's a free Google service. You add a small tracking code to the website, and Google shows you a dashboard: how many people visit, which pages they read, where they found the site (Google search, direct, social), what city they're from. Completely free. We can add it in Phase 4 — it's useful once the site is live and indexed.


---------------
How to verify — open the site and right-click → View Page Source. You should see:

<html lang="en"> (or lang="fr" on the French version)
<title>Massage Therapy in Gatineau | Olha Shelest</title>
<meta name="description" content="..."> unique per page
<link rel="canonical" href="..."> pointing to the right URL
<link rel="alternate" hreflang="en" href="..."> and hreflang="fr" on every page
When you buy a domain, open src/lib/config.ts and change just the SITE.url value — everything updates automatically.

Ready to move to Phase 2 (robots.txt + sitemap) whenever you are.

------
to verify — share any page URL in WhatsApp or on Facebook. You should see a preview card with the image, title, and description instead of a plain link. You can also test it without actually sharing by using opengraph.xyz — just paste any page URL and it shows you exactly what the card will look like.

Ready for Phase 5 (favicon) when you are.


# phase 6

Phase 6 — Google Search Console
This is the last phase and it's not code — it's registering the site with Google so it gets indexed and you can monitor its performance.

What you'll do:

Go to Google Search Console
Sign in with a Google account
Add the site URL (https://massage-therapy-website-ecru.vercel.app)
Google gives you a verification file or meta tag — I add it to the website (1 minute of code)
Submit the sitemap (/sitemap.xml) so Google crawls all pages immediately
Done — Google starts indexing within a few days
What you get:

Google knows the site exists
You can see which search terms people use to find it
You can monitor indexing errors
Free, no ongoing maintenance needed
One thing to do first: The site should ideally be on a real domain before submitting to Search Console. With the Vercel URL, Google will index it but when you switch domains later, you'd need to re-verify.

Have you purchased the domain yet? If yes, let's connect it to Vercel first, then do Search Console. If not, we can proceed with the Vercel URL for now.
