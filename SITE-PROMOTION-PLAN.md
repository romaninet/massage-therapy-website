# Site Promotion Plan — shelestwellness.ca
## Olha Shelest, Massothérapeute · Gatineau, QC

**Goal:** Reach **page 1, top 5** of Google for the queries clients in the Outaouais–Ottawa region actually type.

**Strategy:** Pure organic. $0 monthly budget. Gatineau-first, Ottawa-second. Realistic timeline to top 5 for primary Gatineau keywords: **4–8 months**.

**Last updated:** 2026-04-28

---

## 1. Goals & Realistic Expectations

### Primary keywords (must rank top 5 within 6–9 months)
- `massage Gatineau`
- `massothérapie Gatineau`
- `massothérapeute Gatineau`
- `massage thérapeutique Gatineau`
- `registered massage therapist Gatineau`

### Secondary keywords (achievable within 6–12 months)
- `massage Hull`
- `massage Aylmer`
- `drainage lymphatique Gatineau`
- `massage en profondeur Gatineau` / `deep tissue massage Gatineau`
- `massage en duo Gatineau` / `couples massage Gatineau`
- `massage enfant Gatineau` / `children's massage Gatineau`
- `massothérapie Outaouais`

### Stretch keywords (Ottawa-side)
- `massage Ottawa` — **realistically top 5 is unlikely without an Ottawa physical address.** Google's local pack heavily favors businesses inside the queried city.
- The realistic Ottawa play: rank for `massage near me` from Ottawa-side users who are willing to cross the river (Portage/Alexandra/Macdonald-Cartier bridges), plus `cross-river massage`, `bilingual massage Ottawa-Gatineau`.
- Best Ottawa-side angle: target **federal employees and downtown Ottawa workers** who already cross the bridge daily — many work in Place du Portage or Terrasses de la Chaudière (literally a 5-min walk to 148 Rue Eddy).

### What "page 1, top 5" actually means in 2026 Google
There are two different things to rank:
1. **The Local Pack (Google Maps 3-pack)** — the boxed map result that appears for any query with local intent. **This is where 70%+ of clicks go** for "massage Gatineau" type queries. Ranking factors: GBP completeness, proximity to searcher, reviews, citations, prominence.
2. **The blue links (organic)** — text results below the local pack. Drive longer-tail and informational queries. Ranking factors: content quality/depth, backlinks, on-page SEO, E-E-A-T signals.

**Plan attacks both simultaneously.** Local Pack is the highest-ROI win (faster, more clicks). Organic is the moat (defensible, traffic compounds).

---

## 2. Current State Snapshot

### Already done (from `olha-shelest-seo-plan.md` and `README.md`)
- Bilingual EN/FR website with hreflang, canonical URLs, and proper next-intl routing
- Per-page metadata (title, description, OG, Twitter cards)
- JSON-LD: HealthAndBeautyBusiness, Person, Service (ItemList), Offer, BreadcrumbList, AggregateRating with Reviews
- Sitemap, robots.txt
- Google Search Console verified, sitemap submitted, key pages requested for indexing
- Google Business Profile **verified** with Place ID, linked in JSON-LD `sameAs`
- AMQ member listing (highest-value backlink) — NAP verified
- Yelp Canada, RateMDs, Cylex Canada, Setmore — all live with consistent NAP
- 819 Fongo phone (local geo signal correct)
- Google Analytics 4 installed
- Client testimonials in JSON-LD (eligible for star ratings in search results)
- `/reviews` redirect live (`next.config.ts`) — `shelestwellness.ca/reviews` permanently redirects to GBP review URL (`g.page/r/CbPuh1aQPQQdEAI/review`)

### Gaps to close (the remainder of this document)
1. **Reviews velocity** — testimonials are on the site, but Google reviews on the GBP listing are what move the local pack. Need a deliberate review-collection engine.
2. **Missing free citations** — PagesJaunes/YellowPages, Canada411, GoRendezvous (highest-priority misses for Quebec local SEO)
3. **No content/blog** — currently zero pages targeting informational long-tail queries. This is the biggest organic gap.
4. **No location-specific landing pages** — one page about Gatineau is not the same as dedicated pages for Hull, Aylmer, Ottawa-side, etc.
5. **GBP not used as a publishing surface** — Posts, Q&A, weekly photos, attributes are mostly empty
6. **No FAQ schema** — easy win for "People also ask" boxes
7. **No local partnerships / outreach links** — the citations done so far are passive directories. Editorial / partnership links are the next tier of authority.

---

## 3. The Local SEO Ranking Model — How Google Decides

Google uses **three factors** to rank local businesses:

### Proximity
How close the searcher is to the business. You can't change this — but you can reduce its weight by being **strong on the other two factors**, which lets you rank further out.

### Prominence
How well-known the business is online. Built from:
- **Reviews** (number, recency, rating, response rate, keywords in reviews)
- **Citations** (consistent NAP across many trusted directories)
- **Backlinks** (especially from local + industry-relevant sites)
- **Brand searches** (people typing "Olha Shelest Gatineau" directly)
- **GBP engagement** (clicks to call/website/directions, photo views, post views)

### Relevance
How well your listing matches the query. Built from:
- **GBP categories** (primary + up to 9 additional)
- **Service list with descriptions** on the GBP
- **Website content** matching the query intent
- **Reviews mentioning the service** ("She did a great deep tissue massage" tells Google you do deep tissue)

**Key insight:** After GBP basics are set (which they are), **reviews + content** are the only levers you can actively pull. Everything else is downstream of those two.

---

## 4. Phase 1 — Foundation Completion (Weeks 1–4)

These are the highest-ROI, lowest-effort actions. Complete all of these before moving on.

### 4.1 Complete the missing free citations (~2 hours total)

| # | Platform | URL | Effort | Why it matters |
|---|----------|-----|--------|----------------|
| 1 | **PagesJaunes / YellowPages Canada** | solutions.yp.ca/free-online-listing | 30 min | One listing covers both. **Highest-authority Quebec-French citation** Google trusts. Critical for "massothérapie" queries |
| 2 | **Canada411** | canada411.ca → Advertisers → Free Business Profile | 15 min | Pure citation/NAP signal. Indexed by Google as authoritative phone directory |
| 3 | **GoRendezvous** | gorendezvous.com/pro/fr | 30 min | Quebec-specific wellness platform. Strong Outaouais signal. Free profile is enough — don't pay for booking software |
| 4 | **Reseau-Sante.ca** | reseau-sante.ca | 15 min | Quebec health practitioner directory. Niche but trusted in QC market |
| 5 | **Annuaire-Sante.ca** | annuaire-sante.ca | 15 min | Same category as above |
| 6 | **Soins.ca** | soins.ca | 15 min | Lower priority but adds citation consistency |

**Critical:** Use the **exact** NAP every time:
> Olha Shelest · 148 Rue Eddy Unit 2, Gatineau QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca

After each listing is created, log it in `README.md` under "Backlinks & Directory Listings" with the date and login email.

### 4.2 GBP deep optimization (~3 hours, then ongoing)

The GBP is verified but is probably running at ~40% of its potential. Spend one focused session getting it to 100%:

**Categories**
- Primary: `Massage therapist`
- Secondary (add only what matches services in config.ts): `Sports massage therapist` (deep tissue is offered; closest GBP match), `Lymphatic drainage` (direct service match)
- Do NOT add: `Massage spa`, `Reflexologist`, `Aromatherapy service`, `Wellness center`, `Pregnancy care center` — none of these match the actual services offered

**Services list** (mirror the website's `SERVICES` config exactly)
- For each service: name, price (CAD), duration, **200-character description in both languages**. Reviews mentioning these service names will index against the listing.

**Attributes** — turn on every accurate one:
- `Identifies as women-owned`
- `Wheelchair accessible entrance` (if true)
- `Online appointments` (if Setmore link is live)
- `LGBTQ+ friendly`
- `Languages spoken: French, English` (and Ukrainian/Russian if applicable)
- `Accepts new patients`
- `Appointment required`

**Photos**
- Upload 15–25 photos at minimum: exterior, signage, treatment room, hands at work (no faces of clients), products used, neighborhood landmarks (Place du Portage, Rue Eddy streetscape), Olha headshot
- Going forward: 2–4 new photos per month (Google rewards freshness)

**Q&A seeding** — pre-populate the public Q&A panel with answers (you can ask and answer your own questions; this is allowed):
1. Quels services offrez-vous ? / What services do you offer?
2. Quel est le tarif d'une séance ? / What's the rate for a session?
3. Y a-t-il du stationnement ? / Is there parking nearby?
4. Acceptez-vous les reçus pour assurances ? / Do you provide insurance receipts? (yes — AMQ #M-24-4471)
5. Parlez-vous français et anglais ? / Do you speak French and English?
6. Faut-il prendre rendez-vous ? / Do I need to book in advance?
7. Quel type de massage est recommandé pour une première visite ?
8. Faites-vous des massages pour femmes enceintes ?
9. À quoi dois-je m'attendre lors de ma première séance ?
10. Acceptez-vous les paiements par Interac / carte / comptant ?

**GBP Posts — weekly cadence** (this is the biggest underused signal)
- 1 post per week, rotating through these types:
  - **Update** — seasonal tip, business news, new service
  - **Offer** — *not* a discount (avoid undercutting); use "Now booking [Month] appointments" or "Limited availability for [service]"
  - **Event** — open house, wellness fair, new client special
- Each post: 100–300 words, 1 image, link to relevant page on the website
- Posts auto-expire after 7 days from the main view but **remain indexed** — they accumulate as ranking signal

**Booking link**
- Set the GBP "Book" / "Appointments" URL to the Setmore booking page (`shelestwellness.setmore.com`)

**Time investment:** ~3 hours one-time setup + 30 min/week ongoing for Posts.

### 4.3 Review collection system (~1 hour setup, ongoing thereafter)

This is **the single highest-ROI activity for local pack ranking.** Reviews are weighted by:
- Total count
- Recency (a 5-star review from last week is worth more than one from 18 months ago)
- Rating (4.7+ is the sweet spot — 5.0 with few reviews looks suspicious to Google)
- Response rate (reply to 100% of them)
- Keywords in the text ("deep tissue massage", "massage en profondeur", "Gatineau", "drainage lymphatique", "massage en duo" etc.)

**Setup steps:**

1. **Get the direct review URL from GBP**
   - In GBP dashboard: Home → "Get more reviews" → copy the short URL (looks like `g.page/r/...`)

2. ✅ **Set up `shelestwellness.ca/reviews` redirect** — DONE
   - `next.config.ts` `redirects()` permanently redirects `/reviews` → `https://g.page/r/CbPuh1aQPQQdEAI/review`
   - Use this URL on all printed cards and post-session messages

3. **Print QR code cards** (~$15 at any local print shop, or free via Vistaprint trial)
   - Front: "Aimé votre séance ? Laissez un avis ✦ Loved your session? Leave a review"
   - Back: QR code → `shelestwellness.ca/reviews`
   - Place: counter, treatment room, give one to every client at end of session

4. **In-session ask script** (the most important — 80% of reviews come from a personal ask)
   - **EN:** "If you enjoyed today's session, the single best thing you can do for me is leave a quick Google review — even one sentence helps. The QR code on this card takes you straight there. Thank you so much."
   - **FR:** "Si la séance d'aujourd'hui vous a plu, la meilleure chose que vous puissiez faire pour moi est de laisser un avis Google — même une phrase aide énormément. Le code QR sur cette carte vous y amène directement. Merci beaucoup."
   - Hand the card while the client is paying or putting on shoes — that's the moment they're most receptive.

5. **Post-session text via Setmore**
   - Setmore allows a custom thank-you message after appointment completion. Add: "Merci d'être venue aujourd'hui! / Thanks for coming in today! If you have a minute, a Google review would mean the world: shelestwellness.ca/reviews"

6. **Respond to every review within 48 hours**
   - Positive reviews: 1–2 sentences, use the client's name, mention the service they had ("Si contente que le drainage lymphatique vous ait aidée, Marie!"). This injects keywords into the review thread.
   - Negative reviews: stay calm, never argue, offer to follow up offline. Google rewards engagement on negative reviews almost as much as positive ones.

**Targets:**
- Month 1: 5–10 reviews
- Month 3: 20+ reviews
- Month 6: 35+ reviews
- Year 1: 50+ reviews
- Maintain ≥4.7 average

**Hard rules:**
- Never offer discounts/free sessions for reviews — Google can detect and will suspend the listing
- Never copy/paste your own reviews — Google detects duplicate phrasing
- Never have family/friends review — Google flags reviews from accounts with no other activity

### 4.4 Internal linking audit (~30 min)

The site has good internal linking already (Services ↔ Fees ↔ Contact). One quick check:
- Every service description on the home page should link to the corresponding section on `/services`
- Every service section on `/services` should link to its row in `/fees` (anchor link)

---

## 5. Phase 2 — Content & Authority (Months 2–4)

This phase adds the **single biggest organic-ranking lever currently missing: a blog.**

### 5.1 Add a bilingual blog/articles section

**Why this matters more than anything else in this phase:**
Google rewards sites that demonstrate **expertise (E-E-A-T)** with depth of content on their topic. A 5-page brochure site ranks for ~10 keywords. A 5-page site **plus** 12 high-quality articles ranks for hundreds of long-tail keywords — many of which are pre-purchase research queries by people about to book.

**Implementation:** Add a new route `/[locale]/articles/[slug]` using next-intl. Posts can live as MDX or as JSON in `messages/`. Add Article JSON-LD schema. Add a `/articles` index page. Link prominently from footer and home page CTA section.

**Target list (write in this order — French first, EN translation second):**

| # | Topic (FR) | Topic (EN) | Target keywords |
|---|------------|------------|-----------------|
| 1 | Comment choisir un massothérapeute à Gatineau | How to choose a massage therapist in Gatineau | massothérapeute Gatineau, choisir massothérapeute |
| 2 | Massage thérapeutique vs massage de détente | Therapeutic vs relaxation massage — which to choose | massage thérapeutique Gatineau, différence massage |
| 3 | Reçus AMQ : votre massage couvert par les assurances | AMQ receipts: getting your massage covered by insurance | reçu massage assurance, AMQ Gatineau |
| 4 | Drainage lymphatique : à quoi s'attendre | Lymphatic drainage: what to expect | drainage lymphatique Gatineau |
| 5 | Massage pour femmes enceintes à Gatineau | Prenatal massage in Gatineau | massage femme enceinte Gatineau, prenatal massage Gatineau |
| 6 | Massage en profondeur pour la récupération sportive (Parc de la Gatineau) | Deep tissue massage for runners and athletes (Gatineau Park) | massage en profondeur Gatineau, deep tissue Gatineau, récupération sportive |
| 7 | Massage en profondeur : à qui s'adresse-t-il ? | Deep tissue massage: when it's right for you | deep tissue Gatineau, massage en profondeur Gatineau |
| 8 | Préparer sa première séance | Preparing for your first session | first massage what to expect |
| 9 | Massage pour enfants : guide pour parents | Massage for children: a parent's guide | massage enfant Gatineau |
| 10 | Massage en duo : pourquoi le vivre ensemble | Couples massage: why share the experience | massage en duo Gatineau, couples massage Gatineau |
| 11 | Stress, sommeil et massage : la science | Stress, sleep, and massage: the science | bienfaits massage stress |
| 12 | Massage à Gatineau pour les employés fédéraux d'Ottawa | Massage in Gatineau for Ottawa federal workers (cross-river) | massage Ottawa Gatineau, downtown Ottawa massage |

**Article structure (every post follows this template):**
- 800–1500 words
- 1 hero image (own photo where possible, alt text in correct language)
- H1 with primary keyword
- 3–5 H2 sections
- Internal links to `/services` and `/fees` (at least 2 per article)
- Geographic anchors woven in naturally (Gatineau, Hull, Aylmer, Outaouais, Ottawa-Gatineau)
- AMQ membership reference where credible
- Article JSON-LD schema (`@type: Article`, with `author: Olha Shelest`, `publisher`, `datePublished`)
- FAQ JSON-LD if the article has 3+ Q/A blocks
- CTA at end: "Prête à réserver une séance? / Ready to book?" → `/contact`

**Cadence:** 1 article every 2 weeks = 12 articles in 6 months. Don't try to do all 12 at once — Google notices a sudden flood and may sandbox.

**Critical: French is primary, English is the translation.** The Outaouais market is ~80% French-speaking. French keywords have lower competition than English ones in this region.

### 5.2 Local landing pages (separate from blog)

These are not blog posts — they're permanent service-area pages designed to rank for `[service] [neighborhood]` queries.

| URL | Content focus |
|-----|---------------|
| `/fr/massotherapie-hull` + `/en/massage-hull` | Hull-specific: walking distance from Place du Portage, Maison du Citoyen area. Federal employees from downtown Ottawa walk over the Portage bridge in 10 min. |
| `/fr/massotherapie-aylmer` + `/en/massage-aylmer` | Aylmer/West Gatineau — emphasize easy access via Boulevard des Allumettières |
| `/fr/massotherapie-buckingham` (optional) | East Gatineau coverage |
| `/fr/massage-ottawa` + `/en/massage-ottawa` | **Critical for Ottawa-side capture.** Frame as: "Bilingual registered massage therapist 5 minutes from downtown Ottawa via Portage bridge. Ideal for federal workers, Byward Market residents, downtown professionals." Mention specific bridges, parking, transit (STO #11, OC Transpo crossings). |
| `/fr/massotherapie-outaouais` | Catch-all regional page for Outaouais queries |

**Each landing page:**
- 600–1000 words (lighter than a blog post)
- Mention specific neighborhoods, transit lines, bridges, parking landmarks
- Embed the same Google Map but with directions text from that area
- LocalBusiness JSON-LD with `areaServed` field including the specific city
- Internal link to all services + booking
- Hreflang to the corresponding French/English version

### 5.3 FAQ section with FAQPage JSON-LD

Add an FAQ section to:
- Home page (5–7 most common questions)
- `/services` page (service-specific FAQs)
- Each blog article that fits

Wrap with `FAQPage` JSON-LD. This is what powers "People also ask" results in Google. Easy win — adds a structured-data eligibility signal that you're currently missing.

### 5.4 Service area page

Add a `/service-area` page (or section on `/contact`) showing the catchment with:
- A list of cities/neighborhoods served
- Approximate travel time from each (Hull 5 min, Aylmer 15 min, Ottawa downtown 10 min, Orléans 25 min, Kanata 30 min)
- A wider Google Map showing the region
- Service-area JSON-LD `areaServed` with all cities listed

This signals to Google's local algorithm that the business serves a wider geographic area, which can help rank for queries from those areas.

---

## 6. Phase 3 — Backlinks & Local Partnerships (Months 3–6)

This is the longest-effort phase but produces the highest-quality ranking signals.

### 6.1 Local partnership backlinks (highest ROI of this phase)

These require outreach but produce **editorial** links — the kind Google actually values. Realistic target: **3–5 of these in the first year.**

| Partner type | Approach |
|--------------|----------|
| **Yoga studios in Gatineau/Hull** (Studio Wim Hof, Yoga Sangha, Studio Yoga Hull) | Offer to be a "recommended wellness partner" on their website. Reciprocate by listing them on a future "Partners" page. Studios love post-class soreness referrals. |
| **Physiotherapy clinics** (Clinique Physio Gatineau, ProAction Physio) | Massage and physio are complementary. Offer a referral relationship — they refer clients who'd benefit from massage between physio sessions, you refer clients with injuries needing physio first. Many clinics maintain a "trusted referral network" page. |
| **Running clubs** (Les Coureurs de l'Outaouais, Run Ottawa) | Offer a member discount or write a short guest article about post-run recovery massage. Their newsletter or website often features wellness partners. |
| **Doula and prenatal networks** (Naissance Heureuse Outaouais, AAPSQ Outaouais doulas) | Most doulas maintain a "trusted providers" list. Reach out, offer to meet, exchange referral info. |
| **Hair salons / aestheticians in your building or block** | The Rue Eddy / Place du Portage area has many. Drop off business cards. Cross-referrals (clients getting their hair done often book massage same day). |
| **Personal trainers / yoga teachers in Gatineau gyms** | Same model — they refer post-workout clients, you refer clients needing more strength/mobility work. |

**Outreach template (FR):**
> "Bonjour [Nom], je suis Olha Shelest, massothérapeute agréée membre de l'AMQ, située au 148 Rue Eddy à Gatineau. J'ai remarqué que [studio/clinique] a une approche [bien-être/santé] qui complémente bien la massothérapie. Je serais intéressée à explorer une relation de référencement mutuel — vos clients qui ont besoin de massothérapie après [classe/traitement], et inversement. Auriez-vous 15 minutes pour en discuter? Je peux passer en personne. Cordialement, Olha"

### 6.2 Editorial / PR links (highest authority, hardest to get)

These are the rare home-run backlinks. **Realistic target: 1–2 in year 1.**

| Target | Pitch angle |
|--------|-------------|
| **Le Droit (Outaouais newspaper)** | Pitch a "new local business" feature. Angle: bilingual immigrant business owner / new wellness practice on Rue Eddy / women in small business. Email business desk. Best after you have 20+ reviews so the credibility is established. |
| **104,7 FM Outaouais** | They have community segments and small business spotlights. Email or call station. |
| **Ottawa Citizen / Ottawa Magazine** | Pitch from a "best cross-river wellness in NCR" angle. Lower hit rate but high reward. |
| **Tourisme Outaouais** | Smaller but listed Outaouais wellness providers can sometimes be added to wellness/tourism guides. |
| **Local Facebook groups** | Not backlinks, but discovery: "Gatineau infos", "Babillard Outaouais", "Ottawa-Gatineau Moms", "Federal employees Gatineau". Don't spam — answer wellness questions when they come up, mention the practice naturally. |

### 6.3 Niche / industry directories

| Directory | Why |
|-----------|-----|
| **AMQ public directory** | ✅ Already done — make sure the listing has the website URL and is up to date |
| **Reseau-Sante.ca** | Quebec health practitioner directory |
| **Annuaire-Sante.ca** | Same niche |
| **Soins.ca** | Quebec health/wellness directory |
| **MassageBook.com** (international) | Free profile, English-language traffic, lower QC relevance |
| **Wellness.com** | Free profile, US-centric but indexed |

### 6.4 Chamber of Commerce de Gatineau (paid — re-evaluate)

**Skip for now** (per $0 budget constraint). Re-evaluate in Year 2 once practice is established. Free directory inclusion vs paid membership ROI is borderline for solo practitioners.

---

## 7. Reviews Engine — The #1 Ongoing Lever

(Setup covered in §4.3 above. This section is the discipline of running it long-term.)

### Monthly review cadence checklist
- [ ] Did every client this month receive an in-person ask?
- [ ] Did every client receive the post-session SMS?
- [ ] Did I respond to every new review within 48 hours?
- [ ] Did I include the service name in my response (for keyword indexing)?
- [ ] Did I report any obvious fake/spam reviews?

### Why response language matters
Every reply is more text Google indexes against your listing. **Use it deliberately.**

Bad reply: "Thank you so much!"
Good reply: "Thank you Marie — so glad the therapeutic massage helped with your lower back pain. See you at your next session in Gatineau!"

The good reply quietly indexes the listing for "therapeutic massage Gatineau", "lower back pain", and reinforces the location.

### Review keyword targets
Try to encourage (organically — never script) reviews that mention:
- The specific service used
- The city ("Gatineau", "Hull", "Aylmer")
- The benefit ("relieved my back pain", "helped with stress")
- Bilingual mentions (some in French, some in English — great signal for bilingual practice)

---

## 8. Light Social Presence (per $0/minimal-effort preference)

**Goal:** Discoverability and trust signal, not a growth channel.

### Setup (one-time, ~1 hour)
- **Instagram:** claim `@shelestwellness` (or `@olhashelest` if taken). Bio: "Massothérapeute agréée • Registered Massage Therapist • Gatineau, QC • AMQ" + website link
- **Facebook business page:** create at facebook.com/shelestwellness, link to GBP, mirror Instagram bio
- **LinkedIn personal profile** (optional but free): list AMQ membership and practice — adds entity-disambiguation signal

### Maintenance (very light)
- 1–2 photos per month posted to both Instagram and Facebook
- Subjects: treatment room, products used, neighborhood (Place du Portage, Rue Eddy), seasonal wellness tips
- Always include location tag: "Gatineau, Québec"
- Cross-post the same photo to GBP

### Why even this minimal version helps
- **Entity disambiguation:** Google's Knowledge Graph cross-references social profiles to confirm you're a real, single entity. Even dormant profiles help.
- **Brand searches:** People who hear about you via word-of-mouth often check Instagram before booking. A barren profile loses bookings.
- **Reviews can come from FB:** Facebook reviews count as a citation signal too.

### What NOT to do (per minimal commitment)
- Don't promise a content calendar you can't keep
- Don't run paid ads
- Don't post personal content — keep professional
- Don't engage in back-and-forth DM conversations that drain time

---

## 9. On-Site Improvements (Code Changes Required)

These are technical changes that need code work. Each can be a separate task/PR in the future.

| # | Improvement | Effort | Impact | Status |
|---|-------------|--------|--------|--------|
| 1 | Add `/reviews` redirect → GBP review URL (one line in `next.config.ts`) | — | High (powers QR card) | ✅ Done |
| 2 | Add FAQPage JSON-LD to home + services pages | 1 hour | High (PAA snippets) | ⬜ Todo |
| 3 | Add bilingual blog/articles section (`/[locale]/articles/[slug]` route + MDX or JSON content) | 4–6 hours | Very high (long-tail organic) | ⬜ Todo |
| 4 | Add Article JSON-LD schema for blog posts | 30 min | Medium | ⬜ Todo |
| 5 | Add local landing pages: `/massotherapie-hull`, `/massage-ottawa`, etc. | 4 hours | High (location queries) | ⬜ Todo |
| 6 | Add `/service-area` page with regional map and `areaServed` JSON-LD | 2 hours | Medium | ⬜ Todo |
| 7 | French URL slugs audit — ensure FR routes use French words (`/fr/services/massage-therapeutique` not `/fr/services/therapeutic-massage`) | 2 hours | Medium | ⬜ Todo |
| 8 | Verify `aggregateRating` and review markup in Search Console "Enhancements" panel | — | High (star ratings) | ✅ Done — markup valid; Google may withhold star display for self-published testimonials (no penalty) |
| 9 | Image alt text audit — every image has bilingual descriptive alt with location keyword where natural | 1 hour | Low-medium | ⬜ Todo |
| 10 | Add a "From Ottawa?" small callout block on home page with bridge / parking info | 30 min | Medium (Ottawa capture) | ⬜ Todo |

---

## 10. Tracking & Metrics

### Weekly (5 min)
- **Search Console** → Performance → top queries, average position, CTR. Watch for the 10 target keywords entering top 20, then top 10, then top 5.
- **Search Console** → Coverage / Indexing — any errors?

### Monthly (30 min)
- **GBP Insights** → Discovery vs Direct searches ratio, calls, direction requests, website clicks, photo views
- **GA4** → Top landing pages, sources (organic/direct/referral), goal completions (contact form submits)
- **Reviews count delta** — how many added this month?
- **Position tracking** for the 10 target keywords (manual check or free Ubersuggest 3 queries/day)

### Quarterly (1 hour)
- Compare position trajectory vs. plan
- Re-evaluate which articles are bringing traffic (drop topics that aren't working, double down on those that are)
- Audit citations (NAP consistency check across all listings)
- Assess whether to add paid ads (Google Ads can cost ~$3–5/click in Gatineau; budget $50–100/mo could test it)

### Conversion tracking setup needed (one-time)
- GA4 → mark `contact form submit` as a conversion event
- GA4 → mark `phone click` from website as a conversion event (use `tel:` link tracking)
- GA4 → mark `Setmore booking link click` as a conversion event

---

## 11. Realistic Timeline

| Month | Expected outcome |
|-------|------------------|
| **1** | All free citations live (PagesJaunes, Canada411, GoRendezvous, Quebec health directories). GBP fully optimized, weekly Posts running, Q&A seeded, attributes complete. Review system in place. First 5–10 reviews coming in. First 1–2 blog articles published. |
| **2** | 10–15 reviews. 3–4 blog articles indexed. First long-tail queries showing up in Search Console. GBP appearing in 3-pack for narrow neighborhood queries (e.g., "massage Hull"). |
| **3** | 15–20 reviews. 6 articles published. Local landing pages (Hull, Aylmer, Ottawa) live. First partnership outreach attempts. |
| **4** | 20–25 reviews. 8 articles. **Top 10** for "massage Gatineau" and "massothérapie Gatineau". First specialty queries (drainage lymphatique, massage femme enceinte) starting to rank. |
| **5–6** | 30+ reviews. 12 articles. **Top 5** for "massage Gatineau" / "massothérapie Gatineau" — primary goal achieved. Top 10 for English equivalents. First partnership backlinks live. |
| **7–9** | 40+ reviews. Defending top 5. Ranking for "massage Hull", "massage Aylmer". Some Ottawa-side queries showing up via cross-river content. First editorial pitch (Le Droit etc.) |
| **10–12** | 50+ reviews. Stable top 3 for primary queries. Specialty rankings (drainage lymphatique Gatineau, massage en profondeur Outaouais, massage en duo Gatineau). Potentially top 10 for "massage Ottawa" cross-river queries. |

**Caveats:**
- Reviews are the swing factor. If you hit 30+ reviews by month 4, top 5 happens earlier. If you stall at 10, it pushes everything 2–3 months later.
- Google occasionally rolls out core updates that reshuffle local rankings. Don't panic on month-to-month moves; trend is what matters.
- Competitor activity matters. If a Gatineau competitor launches a similar push, both rise; if they drop the ball, you rise faster.

---

## 12. What NOT to Do

These can actively damage rankings or get the listing suspended.

- **Do not buy backlinks** or use "submit to 500 directories" services. Google has been penalizing this since 2012. Either useless or actively harmful.
- **Do not stuff keywords** in alt tags, headings, body text, or meta descriptions. Modern Google detects unnatural keyword density and demotes.
- **Do not duplicate content** between EN/FR (use proper translations + hreflang already in place) or between the home page and a landing page.
- **Do not offer review incentives** — discounts, free sessions, etc. Strictly violates Google's TOS. Listing can be suspended.
- **Do not write or solicit fake reviews** — Google detects accounts with no other activity, location mismatches, similar phrasing patterns.
- **Do not use a different phone number** on any listing. NAP consistency is sacred. Even formatting differences ((819) 815-5603 vs 819-815-5603) can cause issues — pick one format and use it everywhere.
- **Do not change the GBP business name** to add keywords ("Olha Shelest Massage Therapy Gatineau"). Google will suspend the listing for keyword stuffing the name field. Use the legal name only.
- **Do not over-rotate to social media** when the bigger ROI is GBP + reviews + content. Solo wellness practices burn out trying to be Instagram influencers; that energy belongs in client work and review collection.
- **Do not change the website URL or break links** without 301 redirects. Existing backlinks lose value if URLs change.
- **Do not delete blog articles** that aren't performing — leave them. They build topical authority over time even if individual traffic is low.

---

## 13. Quick Wins — Do These in Week 1 (~5 hours total)

The highest-ROI actions if you only have one focused day:

1. **(30 min)** Create PagesJaunes/YellowPages free listing
2. **(15 min)** Create Canada411 free listing
3. **(30 min)** Create GoRendezvous profile
4. **(1 hour)** GBP: add 15 photos, fill all attributes, seed 10 Q&A, list every service with bilingual descriptions
5. ✅ **(20 min)** Get GBP review short URL and set up `shelestwellness.ca/reviews` redirect — **DONE** (`next.config.ts`)
6. **(30 min)** Print or order QR code business cards pointing to `shelestwellness.ca/reviews`
7. **(1 hour)** Write and publish first GBP Post — set a recurring 30-min calendar reminder for every Monday morning to publish a new one

These 7 actions alone — done in week 1 — typically move a verified GBP from page 2 to page 1 of the local pack within 30–60 days.

---

## 14. The Compound Effect

The single most important thing to understand about local SEO:

**Nothing in this plan works on its own.** Citations alone won't get top 5. Reviews alone won't get top 5. Content alone won't get top 5. The interaction of all three — consistent NAP across ~15 trusted directories + 30+ recent reviews + 10+ articles of genuine content + active GBP — is what compounds into a defensible top-5 position.

The competitor analysis for "massage Gatineau" today shows businesses with 3–7 years of accumulated reviews, citations, and content. Olha's practice is new. The catchup play is **execute consistently for 6 months**, not "do everything at once and stop."

The plan above is designed to be sustainable: ~3–5 hours per week of effort split between Olha (reviews, GBP photos, in-session asks) and Roman (content, technical). At that pace, top 5 by month 6 is the realistic outcome.

---

## 15. Reference Files

- [`olha-shelest-seo-plan.md`](olha-shelest-seo-plan.md) — Phases 0–6 setup history (already complete)
- [`README.md`](README.md) — Site structure, completed listings, NAP reference
- [`TODO.md`](TODO.md) — Outstanding directory listings (overlaps with §4.1 of this plan)
- [`src/lib/config.ts`](src/lib/config.ts) — Single source of truth for BUSINESS NAP — must match every external listing exactly

---

*Plan prepared for Olha Shelest, Massothérapeute, Gatineau QC.*
*Strategy: $0 budget, organic-only, Gatineau-first.*
*Expected outcome: top 5 for "massage Gatineau" / "massothérapie Gatineau" within 4–8 months of consistent execution.*
