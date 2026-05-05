# AEO (Answer Engine Optimization) Plan — shelestwellness.ca

## Context

SEO is complete (all 16 phases done). The next frontier is AEO — optimizing content so AI-powered answer engines (ChatGPT, Perplexity, Google AI Overviews, Bing Copilot) can discover, extract, and **cite** this site's content when answering user queries like "best massage therapist in Gatineau" or "is massage therapy covered by insurance in Quebec?"

AEO differs from SEO: AI systems need **directly extractable answers**, **entity clarity**, **structured procedural content**, and **explicit AI crawler guidance** — not just keywords and backlinks.

**Foundation is strong:** comprehensive JSON-LD schemas, 30+ FAQs, bilingual content, GBP verified, AMQ credential. These are being built upon, not replaced.

---

## Implementation Phases

### Phase 1 — Zero-Risk Wins (no schema/UI changes, ~1–2 hours total)

#### 1.1 `public/llms.txt`
**New file.** The emerging AI crawler standard — a plain-text "README for AI" served at `https://www.shelestwellness.ca/llms.txt`. AI crawlers (GPTBot, Claude-Web, PerplexityBot) read this to understand who the site entity is and what pages to prioritize.

Content structure (Markdown-style):
```
# Olha Shelest — Massage Therapist, Gatineau QC

[Brief entity description: who, what, where, credential]

## Key Facts
- AMQ Member: M-24-4471 (verifiable at membres.rmqmasso.ca/...)
- Address, phone, email, languages
- Services list with prices
- Hours

## Pages
- / : Homepage
- /about : Therapist bio and credentials
- /services : All massage services
- /fees : Pricing
- /contact : Booking
- /articles : Educational articles

## Articles
[List all 5 articles with title + URL]
```

**File:** `public/llms.txt` (static, no build step, served directly)

#### 1.2 `robots.ts` — explicit AI crawler opt-in
Add named rules for known AI crawler user agents alongside the existing wildcard. This signals explicit opt-in to AI indexing.

**File:** `src/app/robots.ts`
```typescript
rules: [
  { userAgent: '*', allow: '/', disallow: '/api/' },
  { userAgent: 'GPTBot', allow: '/' },
  { userAgent: 'Claude-Web', allow: '/' },
  { userAgent: 'PerplexityBot', allow: '/' },
],
```

#### 1.3 `sameAs` — add Bing Places + Apple Business Connect
`DIRECTORY_URLS` in `src/lib/jsonld.ts` (lines 25–33) is missing 2 completed listings.

**File:** `src/lib/jsonld.ts` — append to `DIRECTORY_URLS` array:
- Bing Places URL (from Bing Places dashboard — confirmed completed 2026-04-29)
- Apple Business Connect URL (confirmed completed 2026-04-29)

---

### Phase 2 — Schema Enhancements (no visual changes, ~4–6 hours)

#### 2.1 Speakable schema on article pages
`SpeakableSpecification` marks which HTML sections AI assistants and voice engines should read as primary content. Google Assistant and similar engines weight speakable-marked content higher when extracting quotable answers.

**`src/lib/jsonld.ts`** — extend `articleJsonLd()` to include a `speakable` property:
```typescript
speakable: {
  "@type": "SpeakableSpecification",
  "cssSelector": [".article-excerpt", ".article-quick-answer", "h1"]
}
```

**`src/components/sections/ArticleTemplate.tsx`** — add classNames:
- `article-excerpt` on the existing `border-l-2 border-sage pl-5` excerpt paragraph
- `article-quick-answer` on the new Quick Answer box (Phase 3.1 below)

#### 2.2 HowTo schema for procedural articles
Two articles qualify: `how-to-choose-massage-therapist-gatineau` and `amq-receipts-massage-insurance-coverage-gatineau`. `HowTo` schema is high-signal for AI engines answering "how to" queries.

**`src/lib/jsonld.ts`** — add `howToJsonLd(params: { name, description, steps: {name, text}[], url })` function.

**`messages/en.json` and `messages/fr.json`** — add optional `howToSteps` array under each eligible article's key.

**`src/app/[locale]/articles/[slug]/page.tsx`** — conditionally emit `<script type="application/ld+json">` with `howToJsonLd` if `howToSteps` is defined.

#### 2.3 Article E-E-A-T schema fields
Strengthen `articleJsonLd()` with fields AI engines use to assess credibility. Currently missing:

**`src/lib/jsonld.ts`** — modify `articleJsonLd()`:
- `author.sameAs` — same array as `DIRECTORY_URLS` (extract shared `articleAuthorPerson()` helper to avoid duplicating from `personJsonLd()`)
- `author.hasCredential` — AMQ credential object (already in `personJsonLd`, share it)
- `publisher.logo` — `{ "@type": "ImageObject", "url": "${SITE.url}/images/logo.png" }`
- `keywords` — per-article keyword array (add to each article's translation data)
- `about` — `{ "@type": "MedicalTherapy", "name": "Massage Therapy" }`

#### 2.4 SearchAction / WebSite schema
Tells AI engines the site supports in-site search, used by Google SiteLinks and AI assistants for contextual querying.

**`src/lib/jsonld.ts`** — add `websiteSearchJsonLd()` function returning a `WebSite` schema with `potentialAction: SearchAction` targeting `/en/articles?q={search_term_string}`.

**`src/app/[locale]/layout.tsx`** — emit `websiteSearchJsonLd()` once in the layout (not per-page, since it's site-level).

---

### Phase 3 — Content Additions (translation + UI work, ~6–8 hours)

#### 3.1 Quick Answer box on every article
AI engines prefer a clearly extractable direct answer in the first screenful. A dedicated "Quick Answer" / "En bref" card before the body signals to AI: *extract this first*.

**`messages/en.json` and `messages/fr.json`** — add `quickAnswer` string to each of the 5 article slugs. Example for therapeutic-vs-relaxation: "Therapeutic massage targets specific pain or dysfunction with clinical techniques; relaxation massage calms the nervous system with flowing strokes — choose therapeutic for a specific complaint, relaxation for stress relief."

**`src/components/sections/ArticleTemplate.tsx`** — add optional `quickAnswer?: string` prop; render as a sage-bordered card with "Quick Answer" / "En bref" label, before the BotanicalDivider. Add class `article-quick-answer` for Speakable targeting.

**`src/app/[locale]/articles/[slug]/page.tsx`** — pass `t(`${slug}.quickAnswer`)` to `ArticleTemplate`.

#### 3.2 Visible author bio block on articles
AI engines parse visible E-E-A-T signals from rendered HTML, not just schema. Currently articles only show `· Olha Shelest` as plain text.

**`src/components/sections/ArticleTemplate.tsx`** — add an author card section between the internal links row and the FAQ section:
- Olha's portrait (`SITE.portraitImage`)
- Name + job title (bilingual)
- AMQ membership badge with link to verification URL (`BUSINESS.amqUrl`)
- Link to the about page

**`messages/en.json` and `messages/fr.json`** — add `articleAuthor` namespace:
- `name`, `title`, `credential`, `credentialLabel`, `aboutLink`

#### 3.3 Comparison table in therapeutic-vs-relaxation article
AI engines cite structured comparative data frequently in AI Overviews. The `therapeutic-vs-relaxation-massage-gatineau` article is the natural home.

**`messages/en.json` and `messages/fr.json`** — add `comparisonTable: { headers: string[], rows: string[][] }` to that article's data.

**`src/components/sections/ArticleTemplate.tsx`** — add optional `comparisonTable` prop; render as semantic `<table>` with `<thead>` / `<tbody>` for proper AI table extraction.

#### 3.4 FAQ answer quality pass
Several existing FAQ answers bury the answer or use first-person "I/We". AI systems prefer third-person, direct-first answers. Target edits:
- Home FAQ: "How often should I get a massage?" — open with a direct frequency recommendation, not "It depends"
- Area FAQs: Include entity name "Olha Shelest" in 1–2 answers so AI can attribute when citing

**Files:** `messages/en.json` and `messages/fr.json` — targeted string edits only

---

## Critical Files

| File | Changes |
|------|---------|
| `public/llms.txt` | New static file |
| `src/app/robots.ts` | Add AI crawler user agent rules |
| `src/lib/jsonld.ts` | `DIRECTORY_URLS` expansion; `articleJsonLd()` E-E-A-T; add `howToJsonLd()`, `websiteSearchJsonLd()`, speakable property |
| `src/components/sections/ArticleTemplate.tsx` | Quick Answer box, author bio card, comparison table, CSS class additions |
| `src/app/[locale]/articles/[slug]/page.tsx` | Wire new props + conditional schema script blocks |
| `src/app/[locale]/layout.tsx` | Emit `websiteSearchJsonLd()` once |
| `messages/en.json` | `quickAnswer`, `howToSteps`, `comparisonTable`, `articleAuthor`, FAQ edits |
| `messages/fr.json` | Same as en.json — bilingual parity required |

---

## Verification

1. **Schema validity** — Google Rich Results Test after deploy: confirm FAQPage, Article, HowTo, BreadcrumbList all show as eligible
2. **Speakable** — test article URLs in Rich Results Test; speakable section should appear
3. **llms.txt** — confirm accessible at `https://www.shelestwellness.ca/llms.txt` in browser
4. **AI citation test** — prompt Perplexity: "Who is a massage therapist in Gatineau?" and "Is massage therapy covered by insurance in Quebec?" — check for site citation after 1–2 weeks
5. **Search Console** — monitor "People Also Ask" appearances as proxy for FAQ schema use in AI Overviews

---

## Recommended Order

1. Phase 1 (all 3 items) — no risk, deploy immediately
2. Phase 2.3 (E-E-A-T article schema fields) — pure `jsonld.ts` change
3. Phase 2.2 (HowTo schema) — requires translation keys but no UI
4. Phase 2.1 (Speakable) — requires CSS class additions
5. Phase 2.4 (SearchAction) — one new function + layout wire-up
6. Phase 3.1 (Quick Answer boxes) — highest content impact
7. Phase 3.2 (Author bio) — new UI component
8. Phase 3.3 (Comparison table) — article-specific
9. Phase 3.4 (FAQ quality pass) — polish last, lowest risk
