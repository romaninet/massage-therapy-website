# Project Notes

## TODO

 - create new email address (similar to domain)
 - buy new domain
 - change email in resend.com, for contact form (maybe a new gmail account)
 - change the data in config.ts
 - fix prices and massage types
 - change business adress and make sure google link is correct
 - create googe business profile for SEO ((Google Maps listing with address, hours, phone) — this is one of the highest-impact local SEO actions and costs nothing.)
- phone number is not gatineau (can confuse google)
- Do you want Google Analytics tracking?
- Add contact form captcha?
 
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


# Thoughts about domain:
- Cloudflare Registrar
- Porkbun
- CanSpace



shelestrmt.ca

shelestrmt.gmail
-------------
Add a descriptor after a comma: Olha Shelest, massothérapeute or Olha Shelest, RMT — this is a title/credential, not a trade name, no registration required


## My recommendation: use Olha Shelest, massothérapeute as the display name everywhere. It's bilingual-friendly, professional, legally safe without registration, and unambiguous for search.
---------------

Problem 1: The 506 area code — this is a real SEO liability
For local search in Gatineau, Google uses NAP (Name + Address + Phone) signals to determine geographic relevance. A 506 prefix (New Brunswick) on a Gatineau business will create a geographic mismatch signal. It won't destroy your rankings, but it weakens them, and it may confuse potential clients.
Your options, in order of preference:

Get a local VoIP number with 819 or 873 area code — Fongo is a free Canadian app that gives you a real local number. Calls forward to your actual phone. Free. This is what I'd recommend.

------------
A free shelestrmt@gmail.com account works perfectly for Google Business Profile and Google Search Console
-------------
One useful middle ground: Porkbun includes free basic email forwarding with domain purchases. You can set up info@shelestrmt.ca to forward to shelestrmt@gmail.com. Clients see a professional address, mail lands in your Gmail. Free. Add this to Phase 1.
----------------

The Full Plan — In Correct Order

✅ Phase 0 — Prep (Do this first, same day)
Step 0.1 — Get a local phone number (if you choose Option 1 above)

Download Fongo, create account, select an 819 Gatineau number
Write it down — this becomes your public business phone number everywhere, forever
Time: ~15 minutes

Step 0.2 — Create shelestrmt@gmail.com

Go to accounts.google.com → Create account → "For personal use" (not business — that leads to Workspace)
Use Olha's real name in the profile
Enable 2-factor authentication immediately
This Gmail account becomes the master account for: GBP, Search Console, and Google Analytics if needed
Time: ~10 minutes


✅ Phase 1 — Purchase Domain on Porkbun
Step 1.1 — Buy shelestrmt.ca

Go to porkbun.com, search the domain, purchase it
Cost: ~$15–17 CAD/year for .ca
At checkout, use shelestrmt@gmail.com as the account email
Enable auto-renew — losing a domain by forgetting to renew is a real risk for small businesses
Enable domain privacy (Porkbun includes it free) — this hides Olha's personal info from WHOIS

Step 1.2 — Set up free email forwarding on Porkbun

In Porkbun dashboard → Email Routing → create a forward: info@shelestrmt.ca → shelestrmt@gmail.com
You can add more aliases later (e.g., contact@, bonjour@)
Do not set this up as a mailbox — just forwarding. Free.


✅ Phase 2 — Connect Domain to Vercel
This is a two-sided process: you configure Vercel first, then update DNS on Porkbun.
Step 2.1 — Add domain in Vercel

Go to your Vercel project dashboard → Settings → Domains
Add shelestrmt.ca (apex/root domain)
Also add www.shelestrmt.ca
Vercel will display the DNS records you need — keep this page open

Step 2.2 — Configure DNS on Porkbun

Go to Porkbun → DNS → manage records for shelestrmt.ca
Add the records Vercel specifies. Typically:

An A record for @ (root) pointing to Vercel's IP
A CNAME record for www pointing to cname.vercel-dns.com


Delete any default Porkbun placeholder records that conflict

Step 2.3 — Set canonical domain in Vercel

In Vercel → Settings → Domains, set shelestrmt.ca (without www) as the primary domain
Vercel will automatically redirect www.shelestrmt.ca → shelestrmt.ca
This is important: Google must only index one version

Step 2.4 — Wait for DNS propagation

Typically 30 minutes to 2 hours; worst case 48 hours
Test at dnschecker.org — check that shelestrmt.ca resolves worldwide
Also check that https:// works (Vercel provisions SSL automatically)
Do not proceed to Phase 3 until the domain fully resolves with HTTPS


✅ Phase 3 — Technical SEO on the Website
Do this before asking Google to index anything. Indexing a broken or incomplete site is worse than not being indexed at all.
Step 3.1 — Verify robots.txt

Visit https://shelestrmt.ca/robots.txt — it must exist and must NOT block Googlebot
For a Next.js App Router site, add this to your project if not present:

js// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://shelestrmt.ca/sitemap.xml',
  };
}
Step 3.2 — Generate a sitemap

The sitemap must include all pages in both languages
Example for next-intl with /en and /fr routes:

js// app/sitemap.ts
export default function sitemap() {
  const baseUrl = 'https://shelestrmt.ca';
  const locales = ['en', 'fr'];
  const routes = ['', '/services', '/contact', '/about']; // adjust to your actual pages

  return locales.flatMap(locale =>
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
    }))
  );
}

Verify it at https://shelestrmt.ca/sitemap.xml — you should see a list of URLs

Step 3.3 — Hreflang tags (critical for bilingual sites — often missed)

Google needs to know that the French and English pages are translations of each other, not duplicate content
With next-intl and App Router, add this to your root layout or middleware
Each page needs to declare its alternates:

js// In your page metadata (app/[locale]/page.tsx or layout.tsx)
export const metadata = {
  alternates: {
    canonical: 'https://shelestrmt.ca/en',
    languages: {
      'en': 'https://shelestrmt.ca/en',
      'fr': 'https://shelestrmt.ca/fr',
    },
  },
};

Verify this worked by viewing page source and searching for hreflang
Without this, Google may penalize both language versions as duplicate content

Step 3.4 — Meta titles and descriptions (both languages)
Every page needs a unique, keyword-rich title and description in the correct language. Examples:
PageEnglishFrenchHome titleMassage Therapy in Gatineau | Olha Shelest RMTMassothérapie à Gatineau | Olha Shelest RMTHome descriptionRegistered massage therapist in Gatineau, QC. Member of AMQ. Therapeutic, relaxation, and deep tissue massage. Book your appointment today.Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ. Massage thérapeutique, relaxation et tissus profonds. Prenez rendez-vous aujourd'hui.
Keywords to include in French pages: massothérapie Gatineau, massothérapeute Gatineau, membre AMQ
Keywords to include in English pages: massage therapy Gatineau, registered massage therapist Gatineau, AMQ member
Step 3.5 — LocalBusiness structured data (JSON-LD)
This is a machine-readable block that tells Google exactly what kind of business this is, where it is, and how to contact it. Add this to your root layout or home page:
json{
  "@context": "https://schema.org",
  "@type": "MassageTherapist",
  "name": "Olha Shelest Massage Therapy",
  "image": "https://shelestrmt.ca/og-image.jpg",
  "url": "https://shelestrmt.ca",
  "telephone": "+1-819-XXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[Current street address]",
    "addressLocality": "Gatineau",
    "addressRegion": "QC",
    "postalCode": "[Postal code]",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [latitude],
    "longitude": [longitude]
  },
  "openingHours": ["Mo-Fr 09:00-18:00"],
  "priceRange": "$$",
  "description": "Registered massage therapist in Gatineau, QC. Member of AMQ.",
  "memberOf": {
    "@type": "Organization",
    "name": "Association des massothérapeutes du Québec (AMQ)"
  }
}

Use MassageTherapist (not just LocalBusiness) — it's a more specific schema type and Google uses it for health service filtering
Validate this at schema.org/docs/gs.html

Step 3.6 — Open Graph tags

These control how the site looks when shared on social media (even if you're not active yet, people may share it)
Add og:title, og:description, og:image, og:url to your layout
The og:image should be at least 1200×630px — ideally a professional photo of Olha or the practice space

Step 3.7 — Final checks before indexing

Test mobile layout at search.google.com/test/mobile-friendly
Check page speed at pagespeed.web.dev — Vercel + Next.js should score well out of the box
Manually visit every page in both languages and confirm they load correctly on the new domain
Confirm that https://shelestrmt.ca redirects properly (not landing on the old Vercel domain)


✅ Phase 4 — Google Search Console
Step 4.1 — Create Search Console property

Go to search.google.com/search-console — log in with shelestrmt@gmail.com
Choose "Domain" property type (not URL prefix) → enter shelestrmt.ca
Google will give you a TXT record to add to Porkbun DNS

Step 4.2 — Verify via DNS in Porkbun

In Porkbun → DNS → add a TXT record for @ with the value Google provides
Go back to Search Console → click Verify
This can take a few minutes

Step 4.3 — Submit sitemap

In Search Console → Sitemaps → enter sitemap.xml → Submit
Google will begin crawling — this does not guarantee immediate indexing but it tells Google where to start

Step 4.4 — Request indexing of key pages

In Search Console → URL Inspection → enter your homepage URL → click "Request Indexing"
Do this for: homepage (EN), homepage (FR), services page (EN), services page (FR)
Google does not guarantee timing — typically 1–2 weeks to appear in results, sometimes faster


✅ Phase 5 — Google Business Profile
Do this after the website is live and indexed — GBP links to your website, and having a live, indexed site strengthens the profile's credibility from day one.
Step 5.1 — Create GBP

Go to business.google.com — log in with shelestrmt@gmail.com
Business name: Olha Shelest Massage Therapy (or Massothérapie Olha Shelest — pick one, use it everywhere)
Category: Massage therapist (primary) — you can add secondary categories later
Add the current Gatineau address

Step 5.2 — Important settings for your address situation
Because she is renting a room in a multi-office building, and the address may change:

✅ Do enter the full street address — clients need it to find her
✅ Check the box that says clients can visit at this address
⚠️ Do not list the building/clinic name in her business name — Google may merge or confuse her profile with the building's profile
⚠️ When the address changes: update GBP immediately, expect to re-verify (usually by postcard or video call)

Step 5.3 — Fill out the profile completely — this directly affects ranking

Phone: the 819 Fongo number (not 506)
Website: https://shelestrmt.ca
Hours: complete and accurate
Description (up to 750 characters): write it in both English and French, include the city name and key services
Services: add individual services with prices if possible (therapeutic massage, relaxation massage, deep tissue, etc.)
Photos: upload at minimum — a professional headshot, a photo of the treatment room, and your logo
AMQ membership number: mention it in the description

Step 5.4 — Verify GBP

Google typically offers: postcard by mail (5–14 days), video call, or instant verification for some accounts
Postcard is the most common — the card goes to the Gatineau address, you enter the code online
Do not make any major changes to the profile while waiting for verification — it can reset the process


✅ Phase 6 — NAP Consistency (Name, Address, Phone)
Once GBP is live, these three pieces of information must be identical everywhere online:
FieldValueNameOlha Shelest Massage Therapy (pick one form, never deviate)AddressExact GBP address, same formatPhone819-XXX-XXXX (the Fongo number)
Apply this to:

Website footer and contact page
AMQ member directory (update your listing to match GBP exactly)
Any future directories (YellowPages, Yelp, RMT-specific directories)

About AMQ specifically: Check whether your AMQ listing is publicly indexed by Google. If yes, make sure the name, address, phone, and website URL on that listing matches GBP exactly. A link from AMQ to your website is also a valuable backlink for SEO.

✅ Phase 7 — Ongoing (First 3 Months)

Google Reviews: Once GBP is verified, ask your first few clients to leave a Google review. Even 3–5 genuine reviews in the first month significantly boosts local ranking. Google provides a shareable review link in your GBP dashboard.
Search Console monitoring: Check every 2 weeks — look at which queries bring people to the site, and whether there are crawl errors
Social media: Not urgent, but when ready, Instagram is the highest-ROI platform for massage therapy. Facebook is useful for local discovery. Create profiles using shelestrmt@gmail.com when the time comes.
Address change: When it happens — update GBP, website structured data, AMQ listing, and every directory listing on the same day. NAP mismatch during a transition is a temporary ranking hit.


Summary Order of Operations
OrderActionTime estimate1Get 819 Fongo number15 min2Create shelestrmt@gmail.com10 min3Buy shelestrmt.ca on Porkbun + set up email forwarding20 min4Add domain in Vercel + configure DNS on Porkbun20 min5Wait for DNS propagationup to 48h6Technical SEO on website (robots, sitemap, hreflang, schema, meta)2–4 hours7Google Search Console: verify domain + submit sitemap + request indexing30 min8Google Business Profile: create + fill out + verify30 min + 5–14 days for postcard9NAP audit: AMQ listing + website footer30 min10First review requestsongoing

Let me know when you hit a specific step and I can go deeper on any of them — especially the Next.js/next-intl implementation for hreflang and sitemap, which is where most bilingual sites get it wrong.