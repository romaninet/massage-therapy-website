# SEO & Online Presence Setup Plan
## Olha Shelest — Massothérapeute, Gatineau QC
### shelestwellness.ca · shelestwellness@gmail.com

---

> **Name to use everywhere:** `Olha Shelest` on all legal and Google documents.  
> **Display name on website and marketing:** `Olha Shelest, massothérapeute`  
> **Why this matters:** Operating under your legal name as a Quebec sole proprietor requires no REQ registration. Adding any trade name (e.g., "Olha Shelest Massage Therapy") technically requires registration with the Registraire des entreprises du Québec (~$38 one-time). Stick with your name + title credential to stay fully compliant at zero cost.

---

## 🚩 Two Problems to Fix Before Starting

### Problem 1 — The 506 area code is a local SEO liability

Google uses NAP (Name + Address + Phone) signals to determine geographic relevance. A 506 prefix (New Brunswick) on a Gatineau business creates a geographic mismatch that weakens local rankings and may confuse clients.

**Fix: Get a free 819 local number via Fongo**

- Download the [Fongo app](https://www.fongo.com) (iOS or Android)
- Create an account and select an **819 (Gatineau/Ottawa)** or **873** area code number
- Calls from this number forward to your real phone
- Cost: free
- This number becomes your permanent public business phone — used everywhere: website, GBP, AMQ listing
- Your 506 number is never shown publicly

### Problem 2 — Do not use Google Workspace

Google Workspace (~$8–10 USD/month) gives you a `@shelestwellness.ca` email address, but it's cosmetic and not worth the cost for a solo practice. A free Gmail account works perfectly for Google Business Profile and Google Search Console.

**Middle-ground option (recommended):** Porkbun includes free email forwarding. You can set up `info@shelestwellness.ca` to forward to `shelestwellness@gmail.com`. Clients see a professional address; mail lands in Gmail. Free.

---

## Phase 0 — Preparation (Same day, do first)

**Estimated time: ~25 minutes**

### Step 0.1 — Get a local 819 phone number

- Download Fongo
- Create account, choose an 819 Gatineau number
- Write it down — this is your public business phone number forever
- Time: ~15 min

### Step 0.2 — Create shelestwellness@gmail.com

- Go to [accounts.google.com](https://accounts.google.com) → Create account
- Choose **"For personal use"** — not "For work or business" (that leads to paid Workspace)
- Use Olha's real name in the profile fields
- Enable 2-factor authentication immediately (use your phone number or an authenticator app)
- **This Gmail account becomes the master account for: Google Business Profile, Google Search Console, and optionally Google Analytics**
- Time: ~10 min

---

## Phase 1 — Purchase Domain on Porkbun

**Estimated time: ~20 minutes**

### Step 1.1 — Buy shelestwellness.ca

- Go to [porkbun.com](https://porkbun.com)
- Search for `shelestwellness.ca` — confirm it is available
- Purchase it (~$15–17 CAD/year for .ca)
- At checkout, use `shelestwellness@gmail.com` as the Porkbun account email
- **Enable auto-renew** — losing a domain by forgetting to renew is a common and costly mistake
- Enable domain privacy (Porkbun includes it free) — this hides personal info from public WHOIS records

### Step 1.2 — Set up free email forwarding on Porkbun

- In Porkbun dashboard → Email Routing
- Create a forward: `info@shelestwellness.ca` → `shelestwellness@gmail.com`
- You can add more aliases later (e.g., `contact@`, `bonjour@`)
- This is email *forwarding*, not a mailbox — it's free and requires no email app setup

---

## Phase 2 — Connect Domain to Vercel

**Estimated time: ~20 minutes + up to 48 hours DNS propagation**

This is a two-sided process: configure Vercel first, then update DNS records on Porkbun.

### Step 2.1 — Add domain in Vercel

- Go to your Vercel project dashboard → Settings → Domains
- Add `shelestwellness.ca` (the root/apex domain)
- Also add `www.shelestwellness.ca`
- Vercel will display the exact DNS records you need — keep this tab open

### Step 2.2 — Configure DNS on Porkbun

- Go to Porkbun → DNS → Manage records for `shelestwellness.ca`
- Add the records Vercel specifies. Typically:
  - An **A record** for `@` (root) pointing to Vercel's IP address
  - A **CNAME record** for `www` pointing to `cname.vercel-dns.com`
- Delete any default Porkbun placeholder records that conflict with these

### Step 2.3 — Set canonical domain in Vercel

- In Vercel → Settings → Domains, set `shelestwellness.ca` (without www) as the **primary domain**
- Vercel will automatically redirect `www.shelestwellness.ca` → `shelestwellness.ca`
- This is critical: Google must only index one version of the URL

### Step 2.4 — Wait for DNS propagation and verify

- Propagation typically takes 30 minutes to 2 hours; worst case 48 hours
- Test worldwide propagation at [dnschecker.org](https://dnschecker.org) — search `shelestwellness.ca`
- Also verify that `https://shelestwellness.ca` loads with a valid SSL certificate (Vercel provisions this automatically)
- **Do not proceed to Phase 3 until the domain resolves with HTTPS everywhere**

---

## Phase 3 — Technical SEO on the Website

**Estimated time: 2–4 hours**

> Do this before asking Google to index anything. Indexing an incomplete or misconfigured site creates cleanup work later that is slow to fix.

### Step 3.1 — Verify robots.txt

- Visit `https://shelestwellness.ca/robots.txt` — it must exist and must NOT block Googlebot
- For a Next.js App Router project, add this file if not already present:

```js
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://shelestwellness.ca/sitemap.xml',
  };
}
```

### Step 3.2 — Generate a sitemap

The sitemap must include all pages in **both languages**. Example for next-intl with `/en` and `/fr` routes:

```js
// app/sitemap.ts
export default function sitemap() {
  const baseUrl = 'https://shelestwellness.ca';
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
```

- Verify it works at `https://shelestwellness.ca/sitemap.xml` — you should see a list of URLs

### Step 3.3 — Hreflang tags (critical for bilingual sites — often missed)

Google needs to know that the French and English pages are translations of each other, not duplicate content. Without this, Google may penalize both language versions.

With Next.js App Router and next-intl, add this to your page metadata:

```js
// In your page metadata (app/[locale]/page.tsx or layout.tsx)
export const metadata = {
  alternates: {
    canonical: 'https://shelestwellness.ca/en', // change per page/locale
    languages: {
      'en': 'https://shelestwellness.ca/en',
      'fr': 'https://shelestwellness.ca/fr',
    },
  },
};
```

- Verify by viewing page source (Ctrl+U) and searching for `hreflang` — it must appear in the `<head>`

### Step 3.4 — Meta titles and descriptions (both languages)

Every page needs a unique, keyword-rich title and description in the correct language.

| Page | English | French |
|---|---|---|
| Home title | `Massage Therapy in Gatineau · Olha Shelest` | `Massothérapie à Gatineau · Olha Shelest` |
| Home description | `Registered massage therapist in Gatineau, QC. Member of AMQ. Therapeutic, relaxation, and deep tissue massage. Book your appointment today.` | `Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ. Massage thérapeutique, relaxation et tissus profonds. Prenez rendez-vous aujourd'hui.` |

**Keywords to target:**

- French pages: `massothérapie Gatineau`, `massothérapeute Gatineau`, `massage Gatineau`, `membre AMQ`
- English pages: `massage therapy Gatineau`, `registered massage therapist Gatineau`, `AMQ member`

### Step 3.5 — LocalBusiness structured data (JSON-LD)

This is a machine-readable block that tells Google exactly what kind of business this is, where it is, and how to contact it. Add this to your root layout or home page component:

```json
{
  "@context": "https://schema.org",
  "@type": "MassageTherapist",
  "name": "Olha Shelest",
  "jobTitle": "Massothérapeute / Registered Massage Therapist",
  "image": "https://shelestwellness.ca/og-image.jpg",
  "url": "https://shelestwellness.ca",
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
```

> Use `MassageTherapist` as the schema type (not just `LocalBusiness`) — it is a more specific type and Google uses it for health service filtering.

- Validate at [validator.schema.org](https://validator.schema.org/)

### Step 3.6 — Open Graph tags

These control how the site looks when shared on social media or messaging apps.

Add to your layout metadata:

```js
export const metadata = {
  openGraph: {
    title: 'Olha Shelest — Massothérapeute à Gatineau',
    description: 'Massothérapeute agréée à Gatineau, QC. Membre de l\'AMQ.',
    url: 'https://shelestwellness.ca',
    images: [{ url: 'https://shelestwellness.ca/og-image.jpg', width: 1200, height: 630 }],
  },
};
```

- The `og:image` should be at least 1200×630px — ideally a professional photo of Olha or the treatment room

### Step 3.7 — Final checks before requesting indexing

- Test mobile layout at [search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly)
- Check page speed at [pagespeed.web.dev](https://pagespeed.web.dev) — Vercel + Next.js should score well
- Manually visit every page in both languages and confirm they load correctly on the new domain
- Confirm that the old Vercel deployment domain (e.g., `your-project.vercel.app`) no longer resolves as the primary URL, or if it does, that Vercel is redirecting it to `shelestwellness.ca`

---

## Phase 4 — Google Search Console

**Estimated time: ~30 minutes**

### Step 4.1 — Create Search Console property

- Go to [search.google.com/search-console](https://search.google.com/search-console)
- Log in with `shelestwellness@gmail.com`
- Click **Add property** → choose **Domain** property type (not "URL prefix")
- Enter: `shelestwellness.ca`
- Google will give you a TXT record value to verify ownership

### Step 4.2 — Verify via DNS on Porkbun

- In Porkbun → DNS → add a **TXT record** for `@` with the value Google provides
- Return to Search Console → click **Verify**
- Verification usually confirms within a few minutes

### Step 4.3 — Submit sitemap

The sitemap is already auto-generated by Next.js at `https://www.shelestwellness.ca/sitemap.xml`. It includes all pages in both languages with `hreflang` alternates.

- In Search Console → left sidebar → **Sitemaps**
- In the "Add a new sitemap" field enter: `sitemap.xml` (Search Console prepends the domain automatically)
- Click **Submit**
- The status column will show **"Pending"** for a few minutes, then change to **"Success"** with a count of discovered URLs — expect ~10 URLs (5 pages × 2 languages)
- If it shows an error, visit `https://www.shelestwellness.ca/sitemap.xml` directly in the browser to confirm it loads and shows valid XML

> Submitting the sitemap does not force immediate indexing — it tells Google where all the pages are so the crawler can find them efficiently. Actual indexing happens on Google's schedule.

### Step 4.4 — Request indexing of key pages

Submitting the sitemap is passive. URL Inspection actively asks Google to crawl specific pages now.

- In Search Console → top search bar (says "Inspect any URL")
- Enter each URL below, one at a time → wait for analysis → click **"Request Indexing"**

**Pages to submit (in this order — highest priority first):**

| URL | Why |
|---|---|
| `https://www.shelestwellness.ca/en` | English homepage — primary landing page |
| `https://www.shelestwellness.ca/fr` | French homepage |
| `https://www.shelestwellness.ca/en/about` | About page — Person entity, E-E-A-T signals |
| `https://www.shelestwellness.ca/fr/about` | French about |
| `https://www.shelestwellness.ca/en/services` | Services  |
| `https://www.shelestwellness.ca/fr/services` | services in French |
| `https://www.shelestwellness.ca/en/fees` | Services + pricing — keyword-rich |
| `https://www.shelestwellness.ca/fr/fees` | French fees |
| `https://www.shelestwellness.ca/en/contact` | Contact page — local SEO anchor |
| `https://www.shelestwellness.ca/fr/contact` | French contact |

> Google throttles indexing requests — if the button is greyed out after a few requests, wait 24 hours and continue. You do not need to submit the privacy policy page.

**What to expect:**
- 1–3 days: pages appear in Search Console coverage report
- 1–2 weeks: pages start appearing in Google search results
- 4–8 weeks: rankings stabilize as Google builds confidence in the domain

---

## Phase 5 — Google Business Profile

**Estimated time: ~30 minutes setup + 5–14 days for postcard verification**

> Do this **after** the website is live and indexed. GBP links to your website, and having a live indexed site strengthens the profile's credibility from day one.

### Step 5.1 — Create the profile

- Go to [business.google.com](https://business.google.com)
- Log in with `shelestwellness@gmail.com`
- Business name: **`Olha Shelest`** (legal name only — no trade name descriptor)
- Primary category: **Massage therapist**
- Enter the current Gatineau address

> **Why the name is just "Olha Shelest":** Google Business Profile terms require the business name to reflect your real-world legal name. Since there is no registered trade name, using "Olha Shelest Massage Therapy" on GBP could trigger a competitor flag or Google's own review process. The category field handles the service descriptor. This is correct and intentional.

### Step 5.2 — Address configuration for your situation

Because she is renting a room in a multi-office building, and the address may change:

- ✅ Enter the full street address — clients need it to find her
- ✅ Check the box confirming clients can visit at this address
- ⚠️ Do **not** include the building name or clinic name in the business name field — Google may merge or confuse her profile with the building's own profile
- ⚠️ When the address changes in the future: update GBP immediately, then update the website structured data and AMQ listing the same day. Expect Google to require re-verification (usually by postcard or video call). NAP mismatch during an address transition is a temporary ranking hit — minimise the window by doing all updates on the same day.

### Step 5.3 — Fill out the profile completely (this directly affects ranking)

| Field | What to enter |
|---|---|
| Phone | The 819 Fongo number only — never the 506 number |
| Website | `https://www.shelestwellness.ca` |
| Hours | Complete and accurate |
| Description | Up to 750 characters. Write in both French and English. Include: city name, key services, AMQ membership number, and that she is a registered massage therapist. Example: *"Massothérapeute agréée à Gatineau, QC. Membre de l'AMQ (no. XXXXX). Spécialisée en massage thérapeutique, relaxation et tissus profonds. / Registered massage therapist in Gatineau, QC. AMQ member. Specializing in therapeutic, relaxation, and deep tissue massage."* |
| Services | Add individual services with prices if possible |
| Photos | Minimum: professional headshot, photo of treatment room, logo |

### Step 5.4 — Verify the profile

- Google typically offers: postcard by mail (5–14 days to Gatineau address), video call, or instant verification
- Postcard is the most common method for new profiles
- **Do not make major changes to the profile while waiting for the postcard** — it can reset the verification process
- Enter the code from the postcard once it arrives

### Step 5.5 — Add Place ID to the website (after verification, 5 minutes)

Once the GBP profile is verified, Google assigns it a **Place ID** — a unique identifier that links your verified business listing to structured data on the website.

- In your GBP dashboard → find the Place ID (or look it up at [developers.google.com/maps/documentation/places/web-service/place-id](https://developers.google.com/maps/documentation/places/web-service/place-id))
- Add it to `BUSINESS` in `src/lib/config.ts`:
  ```ts
  gbpPlaceId: 'ChIJ...your-place-id...',
  ```
- Add it to the `sameAs` array in `src/lib/jsonld.ts`:
  ```ts
  sameAs: [
    BUSINESS.amqUrl,
    `https://maps.google.com/?cid=${BUSINESS.gbpPlaceId}`,
  ],
  ```
- This tells Google's Knowledge Graph that the website and the GBP listing are the same entity — strengthens local ranking signals

---

## Phase 6 — NAP Consistency Audit

**Estimated time: ~30 minutes**

NAP = **Name, Address, Phone**. These three pieces of information must be **exactly identical** everywhere online. Even minor differences (e.g., "Rue Principale" vs "Principal Street", or "819-555-0100" vs "(819) 555-0100") create inconsistency signals that weaken local SEO.

**Your canonical NAP:**

| Field | Value |
|---|---|
| Name | `Olha Shelest` |
| Address | Exact address as entered in GBP, same format |
| Phone | `819-XXX-XXXX` (the Fongo number, formatted consistently) |
| Website | `https://www.shelestwellness.ca` |

**Apply consistently to:**

- Website footer and contact page
- AMQ member directory — log in and update your listing to match GBP exactly. This is important: AMQ is a trusted, authoritative domain in Quebec. A link from AMQ to your website is a valuable backlink, and inconsistent NAP between AMQ and GBP creates a real SEO problem.
- Any future directories you join (RMT directories, YellowPages, Yelp, etc.)

---

## Phase 7 — Ongoing (First 3 Months)

### Google Reviews — highest ROI action after GBP is verified

- Once GBP is verified, Google provides a shareable review link in your dashboard
- Ask your first clients personally to leave a review using that link
- Even 3–5 genuine reviews in the first month significantly boosts local map ranking
- Never offer incentives for reviews — Google's policy prohibits this and it can get your profile suspended

### Search Console monitoring

- Check every 2 weeks in the first few months
- Watch for: which search queries bring people to the site, crawl errors, indexing coverage
- If a page is "Discovered but not indexed," use URL Inspection to request indexing again

### Social media (not urgent, plan ahead)

For massage therapy in Gatineau, in order of ROI:

1. **Instagram** — visual platform, strong for wellness businesses. Show the treatment space, share brief educational content about massage benefits. Start when Olha has time to post consistently (even once a week is enough to start).
2. **Facebook** — useful for local discovery and allows a separate business page linked to GBP
3. Create both profiles using `shelestwellness@gmail.com` when ready
4. Username on both platforms: `shelestwellness` if available, otherwise `olhashelest`

### Address change checklist (for when it happens)

On the day of the address change, in this order:

1. Update GBP address → expect re-verification to follow
2. Update structured data (JSON-LD) on the website → redeploy
3. Update AMQ member listing
4. Update every other directory listing
5. Update Search Console if you added a new property
6. Do all of the above on the same day to minimize the NAP mismatch window

---

## Summary: Order of Operations

| Step | Action | Time |
|---|---|---|
| 0.1 | Get 819 Fongo number | 15 min |
| 0.2 | Create shelestwellness@gmail.com | 10 min |
| 1.1 | Buy shelestwellness.ca on Porkbun + enable auto-renew | 15 min |
| 1.2 | Set up email forwarding (info@shelestwellness.ca → Gmail) | 5 min |
| 2.1–2.3 | Add domain in Vercel + configure DNS on Porkbun | 20 min |
| 2.4 | Wait for DNS propagation + verify HTTPS | up to 48h |
| 3.1–3.7 | Technical SEO on website (robots, sitemap, hreflang, schema, OG, meta) | 2–4 hours |
| 4.1–4.4 | Google Search Console: verify + submit sitemap + request indexing | 30 min |
| 5.1–5.4 | Google Business Profile: create + fill + verify | 30 min + 5–14 days |
| 6 | NAP audit: AMQ listing + website footer consistency check | 30 min |
| 7 | First review requests from clients | Ongoing |

---

## Costs Summary

| Item | Cost |
|---|---|
| shelestwellness.ca domain | ~$15–17 CAD/year |
| Vercel hosting | Free (Hobby plan) |
| Gmail | Free |
| Porkbun email forwarding | Free |
| Fongo 819 number | Free |
| Google Business Profile | Free |
| Google Search Console | Free |
| REQ trade name registration | Not needed (using legal name only) |
| **Total first year** | **~$15–17 CAD** |

---

*Document prepared for Olha Shelest, sole proprietor, Gatineau QC.*  
*Last updated: April 2026*

# backlinks!!!
How backlinks actually work for local SEO
There are two different things links do for you:
Citations — directories that list your NAP (name, address, phone). These don't necessarily send traffic, but they confirm to Google that your business is real and located where you say. Quantity and consistency matter here.
Authority backlinks — links from relevant, trusted websites that Google actually weighs as endorsements. Quality matters far more than quantity. One link from AMQ is worth more than 50 links from random directories.
For a solo massage therapist in Gatineau, your realistic goal is: 4–6 high-quality authority backlinks + 10–15 consistent citations. That's enough to dominate local results. You don't need hundreds of links.

Tier 1 — Highest priority (do these first)
AMQ member directory
You already have this. It's your single most valuable backlink. Make sure:

Your AMQ listing links directly to https://shelestwellness.ca
The name, address, and phone on your AMQ profile match GBP exactly
Your membership number is visible on your website (builds trust signal)

Jane App
Jane is the dominant practice management and booking platform for Canadian RMTs and health practitioners. It has a public practitioner directory that Google indexes well. Even if you don't use Jane for booking, creating a profile there is worth doing.

Go to jane.app → create a practitioner profile
Free public profile is available
This is a high-authority Canadian health domain — the backlink has real value
Many clients in Canada specifically search Jane for practitioners

PagesJaunes / Yellow Pages Canada
For Quebec in particular, PagesJaunes (the French version of Yellow Pages) carries significant weight. Google treats it as an authoritative local source in the Quebec market.

pagesjaunes.ca — create a free business listing
Also create the English counterpart at yellowpages.ca
NAP must match GBP exactly


Tier 2 — Worth doing, lower effort
Yelp Canada
Yelp has genuine authority and ranks well in Google search results for service queries like "massage Gatineau." Even if it doesn't send much direct traffic initially, it appears in search results alongside your website and GBP — which increases the total footprint of visible results for searches about you.

yelp.ca → claim or create a business listing
Free basic listing

Canada411 / 411.ca
Pure citation directory — low effort, consistent NAP signal, indexed by Google.

canada411.ca → add your business

Cylex Canada
Another indexed Canadian business directory. Low authority individually but adds to citation consistency.

cylex.ca

Chambre de commerce de Gatineau
This one is different from the others — it's a local business association, not a generic directory. A link from the Gatineau Chamber of Commerce is a genuine local authority signal.

Check membership costs at ccgap.ca — there may be a fee
If cost is a concern, skip for now and revisit when the practice is established
If they have a free member listing or business finder, prioritize that


Tier 3 — Worthwhile but requires effort or time
RateMDs
Canadian health practitioner review site. Google frequently surfaces RateMDs profiles in search results for practitioner name searches. Worth creating a profile so that when someone searches "Olha Shelest Gatineau," RateMDs appears and shows positive reviews — reinforcing trust.

ratemds.com → create a free practitioner profile

Wellness/health local blogs or publications
This requires active outreach but produces the highest-quality backlinks. The approach:

Search for French-language wellness bloggers in the Gatineau/Ottawa region
Offer to write a short guest post (in French) on a topic like "les bienfaits du massage thérapeutique" or "comment choisir un massothérapeute à Gatineau"
The post links back to shelestwellness.ca
This is the hardest to execute but the most valuable link type because it's editorial, not just a directory listing

Realistic target: 1–2 of these in the first year.
Le Droit / Ottawa Citizen
Local newspapers with high domain authority. Getting listed or mentioned in a local news article (even a small business spotlight) produces a genuinely powerful backlink. This isn't something you can buy — it requires pitching a story angle.
Realistic angle: "Gatineau massothérapeute ouvre sa pratique" as a local business item. Le Droit sometimes does short business spotlight features. Worth a cold email to their local desk once the business is established and has reviews.

What to avoid
Generic link farms and "submit to 500 directories" services — these are either useless or actively harmful. Google has been penalizing mass low-quality directory submissions since 2012. Don't pay anyone to "build backlinks" unless you can see exactly where those links will appear.
Reciprocal link schemes — "I'll link to you if you link to me" between unrelated businesses. Google detects and discounts these.
Buying links — any service offering guaranteed links for money is either selling low-quality spam or links that violate Google's guidelines. Either outcome is bad.

Practical order of operations
PriorityActionCostEffort1Verify AMQ listing links to your site with correct NAPFree10 min2Create Jane App practitioner profileFree20 min3Create PagesJaunes + YellowPages listingsFree20 min4Create Yelp Canada listingFree15 min5Create Canada411 + Cylex citationsFree15 min6Create RateMDs profileFree15 min7Research Chambre de commerce de Gatineau membershipLow cost30 min8Outreach to local wellness bloggers for guest postFreeOngoing9Pitch Le Droit for local business mentionFreeOngoing
Total for steps 1–6: about 1.5 hours and $0. Do these before pursuing anything else.
One thing to watch: every time you create one of these listings, record the login credentials and the exact NAP format you used. When the address changes in the future, you'll need to update every single one of them on the same day, and you'll need to remember where they all are.
