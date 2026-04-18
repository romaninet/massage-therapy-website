# Project Notes
## Initial Promt
Build a high-end, fully responsive website for “Olha Shelest - Professional Massage Therapist".
Use the following technologies: Next.js, Tailwind CSS, and shadcn/ui. 

Use https://www.promassotherapie.com/ and https://alignyourbody.com/home as design inspiration, emulating its modern aesthetic, elegant serif headings, with clean sans-serif body text, and open layout with generous whitespaces.
Colour palette: deep forest green #2D6A4F as the primary brand color (navbars, buttons, headings, fills), sage green #52B788 for links and hover states, pale sage #F0F7F4 for light section backgrounds, and warm off-white #FAF9F5 as the base page background.
If design permits, use some elements from business card for general vibe reference when building the website (Business-card-front.jpg is a screenshot of the front of the business card)

Below are some mandatory requirements:
Website must support two languages for all pages and sections: English and French
Use logo from provided logo.png file
Must have a privacy policy page that is not part of the main menu (probably a half transparent link in the footer) (example is in following link  https://www.promassotherapie.com/general-5 and https://www.promassotherapie.com/fr/general-5 )
Website should have the following sections (pages):
Home - do not use Olha picture on the main page (maybe something simple like https://alignyourbody.com/home )
About Olha - picture of Olha (Olya-pic.jpg), with some background information (for beginning just come up with some random text)
Fees
Contact - should have both text with phone, email and address, as well as a contact form with input fields that will be send an email

About the massage therapist this website is for (can be used on about Olha page):
Name of the massage therapist: Olha Shelest
Olha is registered with AMQ https://membres.rmqmasso.ca/en/find-member/details/M-24-4471
Olha is professional massage therapist

For contact page, use the following:
Phone: (506) 426-6818
Email: olyashelest22@gmail.com
Address: 514 Rue Jacques-Poulin, Gatineau, QC J8P 5Z9

Keep the code clean and well structured

## General prompt
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

SEO & Online Presence Setup Plan
Olha Shelest — Massothérapeute, Gatineau QC
shelestrmt.ca · shelestrmt@gmail.com


Name to use everywhere: Olha Shelest on all legal and Google documents.
Display name on website and marketing: Olha Shelest, massothérapeute
Why this matters: Operating under your legal name as a Quebec sole proprietor requires no REQ registration. Adding any trade name (e.g., "Olha Shelest Massage Therapy") technically requires registration with the Registraire des entreprises du Québec (~$38 one-time). Stick with your name + title credential to stay fully compliant at zero cost.


🚩 Two Problems to Fix Before Starting
Problem 1 — The 506 area code is a local SEO liability
Google uses NAP (Name + Address + Phone) signals to determine geographic relevance. A 506 prefix (New Brunswick) on a Gatineau business creates a geographic mismatch that weakens local rankings and may confuse clients.
Fix: Get a free 819 local number via Fongo

Download the Fongo app (iOS or Android)
Create an account and select an 819 (Gatineau/Ottawa) or 873 area code number
Calls from this number forward to your real phone
Cost: free
This number becomes your permanent public business phone — used everywhere: website, GBP, AMQ listing
Your 506 number is never shown publicly

Problem 2 — Do not use Google Workspace
Google Workspace (~$8–10 USD/month) gives you a @shelestrmt.ca email address, but it's cosmetic and not worth the cost for a solo practice. A free Gmail account works perfectly for Google Business Profile and Google Search Console.
Middle-ground option (recommended): Porkbun includes free email forwarding. You can set up info@shelestrmt.ca to forward to shelestrmt@gmail.com. Clients see a professional address; mail lands in Gmail. Free.

Phase 0 — Preparation (Same day, do first)
Estimated time: ~25 minutes
Step 0.1 — Get a local 819 phone number

Download Fongo
Create account, choose an 819 Gatineau number
Write it down — this is your public business phone number forever
Time: ~15 min

Step 0.2 — Create shelestrmt@gmail.com

Go to accounts.google.com → Create account
Choose "For personal use" — not "For work or business" (that leads to paid Workspace)
Use Olha's real name in the profile fields
Enable 2-factor authentication immediately (use your phone number or an authenticator app)
This Gmail account becomes the master account for: Google Business Profile, Google Search Console, and optionally Google Analytics
Time: ~10 min


Phase 1 — Purchase Domain on Porkbun
Estimated time: ~20 minutes
Step 1.1 — Buy shelestrmt.ca

Go to porkbun.com
Search for shelestrmt.ca — confirm it is available
Purchase it (~$15–17 CAD/year for .ca)
At checkout, use shelestrmt@gmail.com as the Porkbun account email
Enable auto-renew — losing a domain by forgetting to renew is a common and costly mistake
Enable domain privacy (Porkbun includes it free) — this hides personal info from public WHOIS records

Step 1.2 — Set up free email forwarding on Porkbun

In Porkbun dashboard → Email Routing
Create a forward: info@shelestrmt.ca → shelestrmt@gmail.com
You can add more aliases later (e.g., contact@, bonjour@)
This is email forwarding, not a mailbox — it's free and requires no email app setup


Phase 2 — Connect Domain to Vercel
Estimated time: ~20 minutes + up to 48 hours DNS propagation
This is a two-sided process: configure Vercel first, then update DNS records on Porkbun.
Step 2.1 — Add domain in Vercel

Go to your Vercel project dashboard → Settings → Domains
Add shelestrmt.ca (the root/apex domain)
Also add www.shelestrmt.ca
Vercel will display the exact DNS records you need — keep this tab open

Step 2.2 — Configure DNS on Porkbun

Go to Porkbun → DNS → Manage records for shelestrmt.ca
Add the records Vercel specifies. Typically:

An A record for @ (root) pointing to Vercel's IP address
A CNAME record for www pointing to cname.vercel-dns.com


Delete any default Porkbun placeholder records that conflict with these

Step 2.3 — Set canonical domain in Vercel

In Vercel → Settings → Domains, set shelestrmt.ca (without www) as the primary domain
Vercel will automatically redirect www.shelestrmt.ca → shelestrmt.ca
This is critical: Google must only index one version of the URL

Step 2.4 — Wait for DNS propagation and verify

Propagation typically takes 30 minutes to 2 hours; worst case 48 hours
Test worldwide propagation at dnschecker.org — search shelestrmt.ca
Also verify that https://shelestrmt.ca loads with a valid SSL certificate (Vercel provisions this automatically)
Do not proceed to Phase 3 until the domain resolves with HTTPS everywhere


Phase 3 — Technical SEO on the Website
Estimated time: 2–4 hours

Do this before asking Google to index anything. Indexing an incomplete or misconfigured site creates cleanup work later that is slow to fix.

Step 3.1 — Verify robots.txt

Visit https://shelestrmt.ca/robots.txt — it must exist and must NOT block Googlebot
For a Next.js App Router project, add this file if not already present:

js// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://shelestrmt.ca/sitemap.xml',
  };
}
Step 3.2 — Generate a sitemap
The sitemap must include all pages in both languages. Example for next-intl with /en and /fr routes:
js// app/sitemap.ts
export default function sitemap() {
  const baseUrl = 'https://shelestrmt.ca';
  const locales = ['en', 'fr'];
  const routes = ['', '/services', '/contact', '/about']; // adjust to your actual pages

  return locales.flatMap(locale =>
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );
}

Verify it works at https://shelestrmt.ca/sitemap.xml — you should see a list of URLs

Step 3.3 — Hreflang tags (critical for bilingual sites — often missed)
Google needs to know that the French and English pages are translations of each other, not duplicate content. Without this, Google may penalize both language versions.
With Next.js App Router and next-intl, add this to your page metadata:
js// In your page metadata (app/[locale]/page.tsx or layout.tsx)
export const metadata = {
  alternates: {
    canonical: 'https://shelestrmt.ca/en', // change per page/locale
    languages: {
      'en': 'https://shelestrmt.ca/en',
      'fr': 'https://shelestrmt.ca/fr',
    },
  },
};

Verify by viewing page source (Ctrl+U) and searching for hreflang — it must appear in the <head>

Step 3.4 — Meta titles and descriptions (both languages)
Every page needs a unique, keyword-rich title and description in the correct language.
PageEnglishFrenchHome titleMassage Therapy in Gatineau · Olha ShelestMassothérapie à Gatineau · Olha ShelestHome descriptionRegistered massage therapist in Gatineau, QC. Member of AMQ. Therapeutic, relaxation, and deep tissue massage. Book your appointment today.Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ. Massage thérapeutique, relaxation et tissus profonds. Prenez rendez-vous aujourd'hui.
Keywords to target:

French pages: massothérapie Gatineau, massothérapeute Gatineau, massage Gatineau, membre AMQ
English pages: massage therapy Gatineau, registered massage therapist Gatineau, AMQ member

Step 3.5 — LocalBusiness structured data (JSON-LD)
This is a machine-readable block that tells Google exactly what kind of business this is, where it is, and how to contact it. Add this to your root layout or home page component:
json{
  "@context": "https://schema.org",
  "@type": "MassageTherapist",
  "name": "Olha Shelest",
  "jobTitle": "Massothérapeute / Registered Massage Therapist",
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
  "description": "Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ. Registered massage therapist in Gatineau, QC. AMQ member.",
  "memberOf": {
    "@type": "Organization",
    "name": "Association des massothérapeutes du Québec (AMQ)"
  }
}

Use MassageTherapist as the schema type (not just LocalBusiness) — it is a more specific type and Google uses it for health service filtering.


Validate at validator.schema.org

Step 3.6 — Open Graph tags
These control how the site looks when shared on social media or messaging apps.
Add to your layout metadata:
jsexport const metadata = {
  openGraph: {
    title: 'Olha Shelest — Massothérapeute à Gatineau',
    description: 'Massothérapeute agréée à Gatineau, QC. Membre de l\'AMQ.',
    url: 'https://shelestrmt.ca',
    images: [{ url: 'https://shelestrmt.ca/og-image.jpg', width: 1200, height: 630 }],
  },
};

The og:image should be at least 1200×630px — ideally a professional photo of Olha or the treatment room

Step 3.7 — Final checks before requesting indexing

Test mobile layout at search.google.com/test/mobile-friendly
Check page speed at pagespeed.web.dev — Vercel + Next.js should score well
Manually visit every page in both languages and confirm they load correctly on the new domain
Confirm that the old Vercel deployment domain (e.g., your-project.vercel.app) no longer resolves as the primary URL, or if it does, that Vercel is redirecting it to shelestrmt.ca


Phase 4 — Google Search Console
Estimated time: ~30 minutes
Step 4.1 — Create Search Console property

Go to search.google.com/search-console
Log in with shelestrmt@gmail.com
Click Add property → choose Domain property type (not "URL prefix")
Enter: shelestrmt.ca
Google will give you a TXT record value to verify ownership

Step 4.2 — Verify via DNS on Porkbun

In Porkbun → DNS → add a TXT record for @ with the value Google provides
Return to Search Console → click Verify
Verification usually confirms within a few minutes

Step 4.3 — Submit sitemap

In Search Console → Sitemaps
Enter sitemap.xml in the field and click Submit
Google begins crawling — this does not guarantee immediate indexing but tells Google where to start

Step 4.4 — Request indexing of key pages

In Search Console → URL Inspection
Enter each important URL → click "Request Indexing"
Do this for: homepage (EN), homepage (FR), services page (EN), services page (FR)
Google does not guarantee timing — typically 1–2 weeks to appear in search results, sometimes faster for new sites with clean setup


Phase 5 — Google Business Profile
Estimated time: ~30 minutes setup + 5–14 days for postcard verification

Do this after the website is live and indexed. GBP links to your website, and having a live indexed site strengthens the profile's credibility from day one.

Step 5.1 — Create the profile

Go to business.google.com
Log in with shelestrmt@gmail.com
Business name: Olha Shelest (legal name only — no trade name descriptor)
Primary category: Massage therapist
Enter the current Gatineau address


Why the name is just "Olha Shelest": Google Business Profile terms require the business name to reflect your real-world legal name. Since there is no registered trade name, using "Olha Shelest Massage Therapy" on GBP could trigger a competitor flag or Google's own review process. The category field handles the service descriptor. This is correct and intentional.

Step 5.2 — Address configuration for your situation
Because she is renting a room in a multi-office building, and the address may change:

✅ Enter the full street address — clients need it to find her
✅ Check the box confirming clients can visit at this address
⚠️ Do not include the building name or clinic name in the business name field — Google may merge or confuse her profile with the building's own profile
⚠️ When the address changes in the future: update GBP immediately, then update the website structured data and AMQ listing the same day. Expect Google to require re-verification (usually by postcard or video call). NAP mismatch during an address transition is a temporary ranking hit — minimise the window by doing all updates on the same day.

Step 5.3 — Fill out the profile completely (this directly affects ranking)
FieldWhat to enterPhoneThe 819 Fongo number only — never the 506 numberWebsitehttps://shelestrmt.caHoursComplete and accurateDescriptionUp to 750 characters. Write in both French and English. Include: city name, key services, AMQ membership number, and that she is a registered massage therapist. Example: "Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ (no. XXXXX). Spécialisée en massage thérapeutique, relaxation et tissus profonds. / Registered massage therapist in Gatineau, QC. AMQ member. Specializing in therapeutic, relaxation, and deep tissue massage."ServicesAdd individual services with prices if possiblePhotosMinimum: professional headshot, photo of treatment room, logo
Step 5.4 — Verify the profile

Google typically offers: postcard by mail (5–14 days to Gatineau address), video call, or instant verification
Postcard is the most common method for new profiles
Do not make major changes to the profile while waiting for the postcard — it can reset the verification process
Enter the code from the postcard once it arrives


Phase 6 — NAP Consistency Audit
Estimated time: ~30 minutes
NAP = Name, Address, Phone. These three pieces of information must be exactly identical everywhere online. Even minor differences (e.g., "Rue Principale" vs "Principal Street", or "819-555-0100" vs "(819) 555-0100") create inconsistency signals that weaken local SEO.
Your canonical NAP:
FieldValueNameOlha ShelestAddressExact address as entered in GBP, same formatPhone819-XXX-XXXX (the Fongo number, formatted consistently)Websitehttps://shelestrmt.ca
Apply consistently to:

Website footer and contact page
AMQ member directory — log in and update your listing to match GBP exactly. This is important: AMQ is a trusted, authoritative domain in Quebec. A link from AMQ to your website is a valuable backlink, and inconsistent NAP between AMQ and GBP creates a real SEO problem.
Any future directories you join (RMT directories, YellowPages, Yelp, etc.)


Phase 7 — Ongoing (First 3 Months)
Google Reviews — highest ROI action after GBP is verified

Once GBP is verified, Google provides a shareable review link in your dashboard
Ask your first clients personally to leave a review using that link
Even 3–5 genuine reviews in the first month significantly boosts local map ranking
Never offer incentives for reviews — Google's policy prohibits this and it can get your profile suspended

Search Console monitoring

Check every 2 weeks in the first few months
Watch for: which search queries bring people to the site, crawl errors, indexing coverage
If a page is "Discovered but not indexed," use URL Inspection to request indexing again

Social media (not urgent, plan ahead)
For massage therapy in Gatineau, in order of ROI:

Instagram — visual platform, strong for wellness businesses. Show the treatment space, share brief educational content about massage benefits. Start when Olha has time to post consistently (even once a week is enough to start).
Facebook — useful for local discovery and allows a separate business page linked to GBP
Create both profiles using shelestrmt@gmail.com when ready
Username on both platforms: shelestrmt if available, otherwise olhashelest

Address change checklist (for when it happens)
On the day of the address change, in this order:

Update GBP address → expect re-verification to follow
Update structured data (JSON-LD) on the website → redeploy
Update AMQ member listing
Update every other directory listing
Update Search Console if you added a new property
Do all of the above on the same day to minimize the NAP mismatch window


Summary: Order of Operations
StepActionTime0.1Get 819 Fongo number15 min0.2Create shelestrmt@gmail.com10 min1.1Buy shelestrmt.ca on Porkbun + enable auto-renew15 min1.2Set up email forwarding (info@shelestrmt.ca → Gmail)5 min2.1–2.3Add domain in Vercel + configure DNS on Porkbun20 min2.4Wait for DNS propagation + verify HTTPSup to 48h3.1–3.7Technical SEO on website (robots, sitemap, hreflang, schema, OG, meta)2–4 hours4.1–4.4Google Search Console: verify + submit sitemap + request indexing30 min5.1–5.4Google Business Profile: create + fill + verify30 min + 5–14 days6NAP audit: AMQ listing + website footer consistency check30 min7First review requests from clientsOngoing

Costs Summary
ItemCostshelestrmt.ca domain~$15–17 CAD/yearVercel hostingFree (Hobby plan)GmailFreePorkbun email forwardingFreeFongo 819 numberFreeGoogle Business ProfileFreeGoogle Search ConsoleFreeREQ trade name registrationNot needed (using legal name only)Total first year~$15–17 CAD

Document prepared for Olha Shelest, sole proprietor, Gatineau QC.
Last updated: April 2026
