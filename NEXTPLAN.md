# NEXTPLAN.md — Forward Improvement Plan

## Context

This is the next-iteration improvement plan for [shelestwellness.ca](https://www.shelestwellness.ca), a recently-launched bilingual (EN/FR) Next.js 15 site for Olha Shelest, a self-employed massage therapist registered with AMQ serving Gatineau and Ottawa. The site is SEO-optimized (phase 1–5 of the SEO plan complete), deployed on Vercel, and linked to Google Business Profile.

The current codebase is in good shape: centralized config ([src/lib/config.ts](src/lib/config.ts)), solid bilingual support via next-intl, 4 JSON-LD schemas, proper hreflang/canonical/OG tags, and mobile-tuned spacing. This plan targets the next round of polish: reducing duplication introduced during the services-page expansion, filling remaining SEO gaps (FAQPage, BreadcrumbList, GBP linkage), tightening accessibility, and closing small bilingual leaks.

Tasks are grouped by **priority** (High / Medium / Low) and tagged with **effort** (Easy / Medium / Hard).

---

## HIGH IMPORTANCE

### H1. Add FAQPage JSON-LD schema — [Easy]
**Why:** Biggest local-SEO gap. FAQ snippets are the highest-yield SERP feature for small service businesses and unlock long-tail queries ("does massage help back pain?", "how do I book?", "insurance billing?").
**Where:** Create `faqPageJsonLd(locale)` in [src/lib/jsonld.ts](src/lib/jsonld.ts). Inject on home + services pages.
**Content:** 6–10 Q&A items in both locales in [messages/en.json](messages/en.json) / [messages/fr.json](messages/fr.json) under `faq` namespace. Topics: booking, what to bring/wear, direct insurance billing, receipt for claims, difference between Swedish vs deep tissue, cancellation policy, conditions treated (back pain, tension headaches, sports recovery), service area (Hull / Gatineau / Ottawa / Outaouais).
**Bonus:** Render a visible FAQ section on the services page driven by the same translation data — schema mirrors visible content (Google requirement).

### H2. Add BreadcrumbList JSON-LD schema — [Easy]
**Why:** Breadcrumbs appear directly in SERPs and improve crawl hierarchy. Particularly useful for the anchor-linked service sections.
**Where:** New `breadcrumbJsonLd(locale, trail)` helper in [src/lib/jsonld.ts](src/lib/jsonld.ts). Apply on about, services, fees, contact, privacy-policy.

### H3. Complete Google Business Profile linkage — [Easy]
**Why:** TODO.md phase 5 item. Missing `gbpPlaceId` weakens the NAP (Name/Address/Phone) association between site and GBP, which is the single strongest local-pack ranking signal.
**Where:** Add `gbpPlaceId` + `gbpUrl` fields to `BUSINESS` in [src/lib/config.ts](src/lib/config.ts). Append `gbpUrl` to the `sameAs` array in [src/lib/jsonld.ts](src/lib/jsonld.ts) for both `localBusinessJsonLd` and `personJsonLd`. Verify GBP listing links back to `https://www.shelestwellness.ca`.

### H4. Extract `generatePageMetadata()` helper — [Medium]
**Why:** The `generateMetadata` block is duplicated near-verbatim across 7 pages (locale detection, title, description, canonical, alternates, OG, Twitter). A one-line bug fix today requires editing 7 files.
**Where:** Create [src/lib/metadata.ts](src/lib/metadata.ts) exporting `generatePageMetadata({ locale, path, titles: {en, fr}, descriptions: {en, fr}, ogImage? })`. Replace `generateMetadata` in all `page.tsx` files under [src/app/[locale]/](src/app/[locale]/).
**Win:** ~40 lines removed per page, single source of truth for canonical/hreflang rules.

### H5. Extract `<PageHeaderSection>` component — [Easy]
**Why:** The dark compact header is duplicated across about, services, fees, contact, privacy-policy pages with the same markup (botanical decor, pre-title, title, divider). Already 4–5 copies.
**Where:** New [src/components/sections/PageHeaderSection.tsx](src/components/sections/PageHeaderSection.tsx) with props `{ preTitle, title, subtitle? }`. Replace inline headers in all `[locale]/*/page.tsx`.

### H6. Refactor [ContactForm.tsx](src/components/ContactForm.tsx) (255 lines) — [Medium]
**Why:** Hardest file in the repo to maintain — mixes validation, state, honeypot, inquiry-type logic, fetch, toast, and markup in one client component. Recent changes (type dropdown) stacked complexity.
**How:** Extract `<FormField>` (label + input + error), `<TextareaField>`, move validation to `src/lib/validation.ts`, move `type` options computation to a `useInquiryTypes(locale)` hook.

### H7. Move API error messages to i18n — [Easy]
**Why:** Bilingual leak. The contact API returns English-only error strings that get surfaced in toasts on the FR locale.
**Where:** [src/app/api/contact/route.ts:22,35,36,41](src/app/api/contact/route.ts#L22). Either return error *codes* and translate client-side, or accept `locale` in the request body and look up strings from `messages/{locale}.json` server-side.

### H8. Add Google Maps iframe `title` attribute — [Easy]
**Why:** WCAG A violation — iframes require a `title` for screen readers. A `mapTitle` key already exists in messages; it's just not wired through.
**Where:** [src/app/[locale]/contact/page.tsx](src/app/[locale]/contact/page.tsx) — add `title={t('mapTitle')}` to the Google Maps `<iframe>`.

---

## MEDIUM IMPORTANCE

### M1. Enrich `personJsonLd` with E-E-A-T signals — [Easy]
**Why:** Google's E-E-A-T (Expertise, Experience, Authoritativeness, Trust) weighs heavily for health-adjacent businesses (YMYL). Current Person schema lacks `hasCredential`, `knowsAbout`, `alumniOf` / training institution.
**Where:** [src/lib/jsonld.ts](src/lib/jsonld.ts) `personJsonLd`. Add `hasCredential: { '@type': 'EducationalOccupationalCredential', name: 'Registered Massage Therapist', recognizedBy: AMQ }`, plus `knowsAbout: ['Swedish massage', 'Deep tissue', 'Lymphatic drainage', ...]`.

### M2. Enrich services meta with condition keywords + Hull/Outaouais — [Easy]
**Why:** Current titles/descriptions target Gatineau + Ottawa only. Missing "Hull" (the actual neighborhood), "Outaouais" (regional term), and condition-based long-tail keywords (back pain, tension headaches, sports recovery).
**Where:** [messages/en.json](messages/en.json) / [messages/fr.json](messages/fr.json) — update `meta.*.description` and service-page body copy. Add "insurance billing" keyword to fees meta.

### M3. Extract `<ServiceCard>` component from services page — [Easy]
**Why:** [src/app/[locale]/services/page.tsx](src/app/[locale]/services/page.tsx) is 198 lines, with the per-service section inlined in a `.map()`. Breaking it out makes the alternating-layout logic testable and re-usable on future landing pages.

### M4. Create `formatPrice(service, locale)` utility — [Easy]
**Why:** Price display (`starting from X CAD` / `à partir de X $ CAD`) is computed in two places (services page, fees page) with slightly different string construction.
**Where:** Add to [src/lib/config.ts](src/lib/config.ts) or new `src/lib/format.ts`.

### M5. Add a `<VisualFAQ>` section tied to H1 schema — [Medium]
**Why:** Visible FAQ content both (a) satisfies Google's requirement that FAQPage schema mirror on-page content and (b) answers customer questions that otherwise land in the contact form, reducing support load.
**Where:** New `src/components/sections/FAQSection.tsx` rendered on `/services` and `/contact`, driven by the same `faq` messages namespace as H1.

### M6. Image audit — convert to WebP/AVIF + explicit dimensions — [Medium]
**Why:** Current JPEGs in `public/images/` are likely unoptimized. Next.js `<Image>` will serve modern formats if the source exists, but re-exporting at the correct dimensions shaves meaningful LCP time on mobile — a Core Web Vitals signal.
**How:** Identify all files in [public/images/](public/images/), check file sizes, re-export service + hero + portrait images as optimized WebP at 2× the largest rendered size. Keep JPEG fallbacks only if needed.

### M7. Update [README.md](README.md) — [Easy]
**Why:** README lists JSON-LD schemas but omits `personJsonLd` and `servicesPageJsonLd` (both added in recent sessions), plus it won't reflect FAQ/Breadcrumb once H1/H2 land. Pages table will also need FAQ section notes.
**Where:** Update schemas list, pages table (already updated for /services), add section on `generatePageMetadata` helper if H4 lands.

### M8. Add `<nav aria-label>` to breadcrumb & footer nav — [Easy]
**Why:** Accessibility polish — multiple `<nav>` elements without labels are flagged by axe/Lighthouse.
**Where:** [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx), Header, future Breadcrumb component.

### M9. Scheduled-tour / opening-hours schema per service — [Medium]
**Why:** If service-specific hours ever differ (e.g., children's massage weekdays-only), encode per-service `openingHoursSpecification` on each `Service` in schema.
**Where:** [src/lib/jsonld.ts](src/lib/jsonld.ts) `servicesPageJsonLd` — optional, only if hours differ.

### M10. Set up Google Analytics 4 + Search Console verification — [Easy]
**Why:** TODO item. Without GA4 there's no data for iteration; without Search Console you can't see index coverage or submit sitemap.
**How:** Add `NEXT_PUBLIC_GA_ID` env var, conditional `<Script>` in [src/app/layout.tsx](src/app/layout.tsx). Add Search Console verification meta tag via `verification.google` in root metadata.

---

## LOW IMPORTANCE

### L1. `React.memo()` on `BotanicalDecor` + `ServiceIcon` — [Easy]
**Why:** Each is rendered 4–8 times per page with static props. Memoization is essentially free and avoids re-render churn. Measurable only in scenarios with lots of client state, but cheap.

### L2. Parametrize hardcoded URL in `personJsonLd` — [Easy]
**Why:** [src/lib/jsonld.ts](src/lib/jsonld.ts) hardcodes `/about` — should use `absoluteUrl(locale, '/about')` to match other schemas.

### L3. Consider `<picture>` + `priority` audit on hero — [Easy]
**Why:** Hero is the LCP element; verify `priority` is set and `sizes` covers all breakpoints. Probably already fine.

### L4. Typed nav links + service keys with TS literal unions — [Easy]
**Why:** `NAV_LINKS[].key` and `SERVICES[].key` are typed as `string`. Promoting to literal unions would catch typos in `/contact?type=swedish` linking code at compile time.
**Where:** [src/lib/config.ts](src/lib/config.ts) — use `as const` + derive `ServiceKey = typeof SERVICES[number]['key']`.

### L5. Add a Review / AggregateRating schema stub (disabled) — [Easy]
**Why:** Pre-wiring the schema now (commented-out or gated on `BUSINESS.reviewCount > 0`) means the moment real reviews exist on GBP, flipping one flag exposes star ratings in SERPs.

### L6. Explore static FAQ page `/faq` or `/en/faq` — [Medium]
**Why:** If the FAQ body grows past 10 items, a dedicated page outranks embedded FAQ snippets. Hold off until content exists.

### L7. Preload key fonts explicitly — [Easy]
**Why:** Next.js font loader handles most of this, but a `<link rel="preload">` for the display font (Playfair) can shave a small chunk off CLS on first paint.

### L8. Add a very light test harness for validation logic — [Medium]
**Why:** No tests exist. Highest-value first test is `src/lib/validation.ts` (after H6 refactor) — email validation, honeypot detection, required-field matrix. Vitest is the lowest-friction choice with Next.js 15.

### L9. Consider `@next/bundle-analyzer` run — [Easy]
**Why:** Quick sanity check that no heavy client libraries snuck in; useful before next major deploy.

### L10. Privacy policy last-updated date wired from config — [Easy]
**Why:** `SITE.lastUpdated` exists but the privacy page likely hardcodes "April 2026" in two translation files. If the date is centralised in config the translations interpolate it.

---

## Suggested Execution Order

1. **Sprint 1 (SEO quick wins, ~1 evening):** H3, H8, M2, M7, M10, L2 — immediate search-visibility and compliance wins, near-zero refactor risk.
2. **Sprint 2 (duplication cleanup, ~1 evening):** H4, H5, M3, M4 — the refactors that make every future change cheaper.
3. **Sprint 3 (FAQ/schema push):** H1, H2, M1, M5, L5 — biggest long-term SEO lift.
4. **Sprint 4 (form hardening):** H6, H7, L8 — stabilize the most-used user-facing code path.
5. **Polish backlog:** remaining M/L items as time permits.

## Verification

After each sprint:
- `npm run build` — must pass with zero type errors.
- Visit both locales (`/en/*` and `/fr/*`) for each modified route in a local dev server; confirm no hardcoded English text leaks on `/fr/*`.
- Run [Rich Results Test](https://search.google.com/test/rich-results) on every page where JSON-LD changed.
- Lighthouse (mobile) — target: Performance ≥ 90, Accessibility = 100, SEO = 100, Best Practices ≥ 95.
- Submit updated sitemap to Search Console; request re-indexing of modified pages.
- For H6 (ContactForm refactor): send a real test submission in each locale, confirm honeypot still rejects, confirm preselect-by-`?type=` still works.
