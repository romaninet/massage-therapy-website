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
