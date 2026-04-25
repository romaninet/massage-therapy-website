# TODO

## Fix / polish
- fix prices and massage types
- protect main branch
- update business card with new data

## AMQ listing (do this first — highest-value backlink)
- update AMQ profile: add website link (https://www.shelestwellness.ca), confirm 819 phone number and current address match GBP exactly
  - AMQ member page: https://membres.rmqmasso.ca/en/find-member/details/M-24-4471

## Backlinks & directories

Do free ones first. NAP must match GBP exactly on every listing:
**Olha Shelest · 148 Rue Eddy Unit 2, Gatineau QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca**

| # | Platform | Cost | SEO Value | Notes |
|---|----------|------|-----------|-------|
| 1 | **Yellow Pages / PagesJaunes** (yellowpages.ca) | Free | High | PagesJaunes and Yellow Pages Canada are the same company (YP Canada) — one listing covers both. Free listing at solutions.yp.ca/free-online-listing |
| 2 | **Yelp Canada** (yelp.ca) | Free | High | Free basic listing; paid advertising optional. High domain authority, trusted by Google |
| 3 | **RateMDs** (ratemds.com) | Free | High | Free basic practitioner profile. Ranks well in Google name searches. Paid plan ($179/mo) not needed |
| 4 | **Canada411** (canada411.ca) | Free | Medium | Free profile. Pure citation/NAP signal. Go to homepage → Advertisers → "Free Business Profile" |
| 5 | **Cylex Canada** (cylex-canada.ca) | Free | Medium | Free listing. Citation signal only |
| 6 | **GoRendezvous** (gorendezvous.com/pro/fr) | Free profile / $59/mo for software | High (Quebec) | Quebec-specific wellness platform, French-language, strong local signal for Gatineau/Ottawa. Creating a free public profile page is enough for the backlink — no need to pay for the booking software unless you want to use it |
| 7 | **Setmore** (setmore.com) | Free plan available | Low | Free plan: up to 200 appts/month, 4 users. Low local SEO value as a backlink (generic US tool). Only worth creating if you plan to actually use it for online booking |
| 8 | **Chambre de commerce de Gatineau** (ccgatineau.ca) | Paid membership (fee unknown) | Medium | Local authority signal. Check ccgatineau.ca for current membership pricing before committing |
| 9 | **Jane App** (jane.app) | Paid (~$39–79+/mo) | High | High-authority Canadian health domain but no free tier — confirmed requires paid subscription. Only worth it if using for practice management/booking |

## Google Reviews (ongoing)
- Once GBP is verified, get shareable review link from GBP dashboard
- Ask first clients personally to leave a review — even 3–5 reviews significantly boosts local map ranking
- When reviews exist: update BUSINESS.reviewCount and BUSINESS.ratingValue in src/lib/config.ts to activate star ratings in SERPs

## Booking system
- check how to book online: https://jane.app OR https://www.setmore.com/

## Done (suggest removing)
- ~~create google business profile for SEO~~ DONE — Place ID ChIJdWEcfCQFzkwRs-6HVpA9BB0 added to config.ts
- ~~Set up Google Analytics 4~~ DONE — NEXT_PUBLIC_GA_ID env var, conditional Script in layout.tsx
- ~~SEO phase 5 (GBP)~~ DONE — GBP created, verified, Place ID in code
- ~~ask AI where to create backlinks~~ DONE — see backlinks section above and olha-shelest-seo-plan.md
