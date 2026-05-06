---
title: Concerns & Tech Debt
focus: concerns
last_mapped: 2026-05-05
---

# Concerns & Technical Debt

## Security

### No Rate Limiting on Contact API
- **File:** `src/app/api/contact/route.ts`
- **Risk:** Contact form endpoint has only honeypot protection — no rate limiting, no CAPTCHA
- **Impact:** Susceptible to automated spam or abuse beyond honeypot bypass
- **Recommendation:** Add server-side rate limiting (e.g., Upstash Redis rate limiter, or Vercel Edge middleware)

### Unsafe Resend Instantiation
- **File:** `src/app/api/contact/route.ts`
- **Risk:** Resend client instantiated without null-checking `RESEND_API_KEY`
- **Impact:** Cryptic runtime error if env var missing (deployment misconfiguration)
- **Recommendation:** Add startup check: `if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')`

### Email Address in JSON-LD
- **File:** `src/lib/jsonld.ts`
- **Risk:** Business email (`massage@shelestwellness.ca`) is exposed in machine-readable JSON-LD on every page
- **Impact:** Slightly higher risk of email harvesting by bots
- **Recommendation:** Acceptable tradeoff for SEO; monitor spam levels

### No Content Security Policy (CSP)
- **File:** `next.config.ts`
- **Risk:** No CSP headers configured
- **Impact:** XSS vulnerability surface not minimized
- **Recommendation:** Add CSP via `next.config.ts` headers (especially for inline scripts from GA)

## Tech Debt

### Unsafe `t.raw()` Translation Casts
- **Pattern:** ~15 instances across pages using `t.raw('key') as SomeType`
- **Risk:** No runtime validation of translation shape — type cast bypasses type safety
- **Impact:** If translation key shape changes, runtime errors occur silently
- **Recommendation:** Use typed translation helpers or zod validation for complex translation shapes

### Static `lastModified` in Sitemap
- **File:** `src/app/sitemap.ts`
- **Risk:** `lastModified` dates are hardcoded, not derived from actual file modification times
- **Impact:** Google may not re-crawl updated pages promptly
- **Recommendation:** Use `fs.statSync` or git log to derive actual modification dates

### Fragile Saturday Hours in Config
- **File:** `src/lib/config.ts`
- **Risk:** Saturday hours use a null/conditional pattern that is not obviously i18n-safe
- **Impact:** Hours display could break if config shape changes
- **Recommendation:** Normalize hours config to a consistent shape

## Performance

### Google Maps iframe Load
- **File:** `src/app/[locale]/contact/page.tsx`
- **Risk:** Maps iframe loads eagerly, adding ~100ms to page load and contributing to CLS
- **Recommendation:** Lazy-load iframe with `loading="lazy"` and IntersectionObserver

### Orphaned Images in `public/`
- **Risk:** Possible unused images in `public/images/` increasing deployment bundle
- **Recommendation:** Audit `public/images/` against all `src=` references in the codebase

### lucide-react Version Discrepancy
- **File:** `package.json`
- **Risk:** Possible version specifier inconsistency (reported as potential typo by static analysis)
- **Recommendation:** Verify `lucide-react` version is pinned correctly

## Fragile Areas

### `t.raw()` as Single Point of Failure
- Translation objects cast via `t.raw()` are not validated — any translation key restructuring silently breaks pages at runtime rather than at build time.

### ARTICLES Config as Single Source of Truth
- **File:** `src/lib/config.ts`
- Article metadata (slug, title, date) defined in config; if article file is added without updating config (or vice versa), the article page will 404 or show stale data.

### Untested Geo Area Pages
- **Files:** `src/app/[locale]/massage-*/page.tsx`
- These pages use `AreaPageTemplate` with data from config. No tests or visual regression checks. Template changes could silently break all 4 pages.

## Scaling Limits

### Vercel Hobby Tier
- **Limit:** Hobby tier has cold start latency, limited serverless function execution time, and no SLA
- **Impact:** Contact form API may timeout under cold start conditions
- **Recommendation:** Upgrade to Vercel Pro if response time becomes an issue

### Resend Free Tier
- **Limit:** 100 emails/day on free tier
- **Impact:** If contact form is abused (spam), daily email quota can be exhausted
- **Recommendation:** Combine with rate limiting (see Security section)

## Known Issues (from TODO.md)

See `TODO.md` for the current outstanding task list. Key open items at time of mapping:
- Google Business Profile URL not yet added to JSON-LD `sameAs` array
- Articles backlog still being populated
- Testimonials section uses placeholder/static content

## Test Coverage Gaps

- **Zero API tests** — `src/app/api/contact/route.ts` is completely untested
- **No bilingual smoke tests** — no automated check that all pages render in both EN and FR without errors
- **JSON-LD not validated** — Schema.org structured data is not tested against Google's Rich Results schema

## SEO Gaps (from seo-plan.md)

- Google Business Profile URL (`BUSINESS.googleBusinessUrl`) not yet set — placeholder in config
- Missing from key local directories (Yellow Pages, Yelp Canada, etc.)
- AEO (Answer Engine Optimization) plan in `AEO_optimization_plan.md` not yet implemented
