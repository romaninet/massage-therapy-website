# TODO

## [HIGH PRIORITY] Booking: Rate Limiting (Priority 2) ✅ Done

`POST /api/booking/request` now has IP-based rate limiting (max 5/hour, sliding window) via Upstash Redis + `@upstash/ratelimit`. The per-email pending cap (max 3) was also moved to `RATE_LIMITING` config. Both limits respect a `bypassEmails` whitelist and are disabled when `RATE_LIMITING_ENABLED=false`. Upstash Redis database created and env vars added to Vercel.

**Still to do (optional):** rate limiting on `GET /api/booking/slots` (lower priority — slots endpoint is read-only and doesn't trigger email/calendar writes).

---

## Blog / Articles Section

### Infrastructure ✅ Done

- Route `/[locale]/articles/[slug]` — dynamic, bilingual, next-intl
- Articles index at `/[locale]/articles`
- Article content stored as JSON in `messages/en.json` and `messages/fr.json` under `articles.*`
- `articleJsonLd()` in `src/lib/jsonld.ts` — `@type: Article` with `author`, `publisher`, `datePublished`, `inLanguage`
- `sitemap.ts` includes all article routes dynamically from `ARTICLES` config
- Articles linked from main nav and footer

### Articles published

| # | Slug | Published |
|---|------|-----------|
| ✅ 1 | `how-to-choose-massage-therapist-gatineau` | 2026-04-15 |
| ✅ 2 | `deep-tissue-massage-runners-athletes-gatineau` | 2026-04-30 |
| ✅ 3 | `therapeutic-vs-relaxation-massage-gatineau` | 2026-05-10 |
| ✅ 4 | `amq-receipts-massage-insurance-coverage-gatineau` | 2026-05-20 |
| ✅ 5 | `lymphatic-drainage-massage-gatineau` | 2026-05-01 |

**Hero images** ✅ All present in `public/images/`.

### Articles still to write (cadence: 1 every 2 weeks)

| # | FR title | EN title | Primary keywords |
|---|----------|----------|-----------------|
| 6 | Massage pour femmes enceintes à Gatineau | Prenatal massage in Gatineau | massage femme enceinte Gatineau |
| 7 | Massage en profondeur : à qui s'adresse-t-il ? | Deep tissue massage: when it's right for you | deep tissue Gatineau |
| 8 | Préparer sa première séance | Preparing for your first massage session | first massage what to expect |
| 9 | Massage pour enfants : guide pour parents | Massage for children: a parent's guide | massage enfant Gatineau |
| 10 | Massage en duo : pourquoi le vivre ensemble | Couples massage: why share the experience | massage en duo Gatineau |
| 11 | Stress, sommeil et massage : la science | Stress, sleep, and massage: the science | bienfaits massage stress |
| 12 | Massage à Gatineau pour les employés fédéraux d'Ottawa | Massage in Gatineau for Ottawa federal workers | massage Ottawa Gatineau |

---

## SEO — Dofollow Backlinks (High Priority)

Most existing directories (Yelp, Yellow Pages, RateMDs, Cylex) are **nofollow** — they help with NAP consistency but don't pass link equity to Google. Dofollow links are harder to get but move rankings more.

### Best sources for dofollow backlinks

- [ ] **Chambre de commerce de Gatineau** — ccgatineau.ca — member directory links tend to be dofollow, carry local authority. Paid membership required.
- [ ] **GoRendezvous** — gorendezvous.com — Quebec wellness booking platform, verify if dofollow
- [ ] **Local media mention** — Le Droit, CBC Ottawa, local wellness blogs — a single mention with a link outweighs dozens of directory listings
- [ ] **Cross-referral with local businesses** — yoga studio, physiotherapist, chiropractor in Gatineau linking to each other's sites

---

## SEO — Additional Directory Listings

Already done: GBP, Bing Places, Apple Business Connect, Yelp, Yellow Pages, RateMDs, Cylex, Setmore, AMQ. The following are still worth adding:

- [ ] **Clinicin.ca** — Canadian health practitioners directory
- [ ] **Wellness.com** — health/wellness directory
- [ ] **NaturalHealthPractitioners.ca** — complementary health focused
- [ ] **Chambre de commerce de Gatineau** — local business association (adds local authority)
- [ ] **Canada411.ca** — basic Canadian business directory

Keep NAP consistent everywhere: `Olha Shelest · 148 Rue Eddy, Unit 2, Gatineau, QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca`

---

## AEO (Answer Engine Optimization)

See full plan in `AEO_optimization_plan.md`.

### Phase 1 — Zero-Risk Wins ✅ Done

- ✅ `public/llms.txt` — AI crawler entity file (entity, services, pages, articles)
- ✅ `src/app/robots.ts` — explicit opt-in for GPTBot, Claude-Web, PerplexityBot
- ⏭️ `src/lib/jsonld.ts` — add Bing Places + Apple Business Connect to `DIRECTORY_URLS` (skipped — URLs needed)

### Phase 2 — Schema Enhancements ✅ Done

- ✅ 2.1 Speakable schema on article pages — targets `h1`, `.article-excerpt`, `.article-quick-answer` (last two activate after Phase 3)
- ✅ 2.2 HowTo schema — `howToJsonLd()` added; steps in en/fr for `how-to-choose` and `amq-receipts` articles
- ✅ 2.3 Article E-E-A-T — `amqCredential()` + `articleAuthorPerson()` helpers; `author.sameAs`, `author.hasCredential`, `publisher.logo`, `keywords`, `about: MedicalTherapy` on all articles
- ✅ 2.4 SearchAction / WebSite schema — `websiteSearchJsonLd()` emitted in locale layout

### Phase 3 — Content Additions

- [ ] 3.1 Quick Answer box on every article
- [ ] 3.2 Visible author bio block on articles
- [ ] 3.3 Comparison table in therapeutic-vs-relaxation article
- [ ] 3.4 FAQ answer quality pass

---






Activating reminder emails in production — step by step
Step 1 — Generate the secret
Run this in your terminal (Git Bash, WSL, or PowerShell with OpenSSL installed):


openssl rand -base64 32
Copy the output. It will look like: k8Fz3mQ+...==

PowerShell alternative if you don't have openssl:


[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
Step 2 — Add it to Vercel
Go to vercel.com → your project → Settings → Environment Variables
Click Add New
Fill in:
Key: CRON_SECRET
Value: the string you generated
Environments: check Production only (Preview/Development don't need it)
Click Save
Step 3 — Deploy
Push your current branch to main (or merge the PR). Vercel redeploys automatically.

After the deploy completes, go to Settings → Cron Jobs in your Vercel dashboard — the job should appear there:


GET /api/cron/reminder   0 14 * * *
Step 4 — Test it manually from the dashboard
In Settings → Cron Jobs, there's a Run button next to the job. Click it — Vercel will fire the request immediately (with the secret injected). Then check:

Functions tab in Vercel → find the /api/cron/reminder invocation → view logs
You should see the [cron/reminder] triggered log line, plus either sent: 0 (no confirmed bookings tomorrow) or actual emails sent
Step 5 — Test locally (optional)
Add CRON_SECRET=anything to your .env.local, start the dev server, then:


curl -H "Authorization: Bearer anything" http://localhost:3000/api/cron/reminder
Expected response when no bookings tomorrow:


{ "date": "2026-05-13", "sent": 0, "errors": [] }
One thing to note about "automatic injection"
Vercel does not auto-generate the secret — you must provide it (step 1–2). What Vercel does automatically is inject it as Authorization: Bearer {CRON_SECRET} on every scheduled cron request to your route. That's why the route checks that header — it's how you know the request genuinely came from Vercel's scheduler and not someone who guessed the URL.

