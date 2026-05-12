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
 - refer to `README.md` for more context information

## SECURITY — Booking state changes

 - ANY route that changes booking state (confirm, decline, cancel, create/delete availability) MUST require the shelestwellness@gmail.com Google session.
 - This applies to BOTH admin dashboard routes (`/api/admin/*`) AND email-triggered routes (`/api/booking/confirm`, `/api/booking/decline`).
 - Admin dashboard routes: use `requireAdminAccess(req)` (POST/DELETE) or `requireAdminRead()` (GET) from `src/lib/adminGuard.ts` — these check session + CSRF.
 - Email-triggered GET routes: call `requireAdminSession()` from `src/lib/adminAuth.ts` and redirect to `/api/auth/signin?callbackUrl=<url>` (302) if not authorized. HMAC token alone is NOT sufficient.
 - Public routes that do NOT require auth: `/api/booking/request` (client submits request) and `/api/booking/slots` (client views available slots).
 - When adding any new route that reads or mutates calendar events or booking state, default to requiring admin session.

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


## ROLE

You are an expert website developer with excellent knowledge in following fields:
 - UI expert, knowledgable in latest design and UX fields for website development, specifically in massage, beauty and spa industry
 - Expert in SEO (Search engine optimization) for self employed people with a small business
 - technical expert in technologies like: Next.js, Tailwind CSS, and shadcn/ui
