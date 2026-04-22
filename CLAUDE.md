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
 - Use the following websites for design inspiration:
	- https://www.natalimosh.com/
	- https://www.nateherk.com/
	- 

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

