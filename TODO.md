# TODO

## Fix / polish
- protect main branch
- update business card with new data

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

## Booking system
- check how to book online: https://jane.app OR https://www.setmore.com/


==================

ok, I have updated the business name at GPB to "Olha Shelest, Massothérapeute"
I also updated yelp, yellow pages, cylex and setmore

do we need to update or change anything?

=====

Two things to address — one in code, a few external.

In code (one line):

BUSINESS.name in src/lib/config.ts:155 is still 'Olha Shelest'. It flows into all 5 JSON-LD schema name fields in src/lib/jsonld.ts and the web app manifest. The JSON-LD name should match GBP exactly — Google uses that match to confirm the website and GBP listing are the same entity.

Change it to 'Olha Shelest, Massothérapeute'.

One caveat: manifest.ts uses BUSINESS.name for both name and short_name. Short names are used as app labels on phones, so 'Olha Shelest, Massothérapeute' is too long for short_name. That field should be hardcoded separately to 'Olha Shelest'.

External listings you haven't updated yet:

Listing	Status	Why it matters
AMQ (membres.rmqmasso.ca)	⬜ Not mentioned	Highest-priority backlink — NAP mismatch here hurts more than anywhere else
RateMDs	⬜ Not mentioned	Created 2026-04-25, profile name may still say "Olha Shelest"
Canada411 / GoRendezvous	Depends if created	If they're live, update them
Also check GBP dashboard now. A business name change sometimes triggers a re-verification request (video call or postcard). If there's a yellow banner in your GBP dashboard, action it immediately — while waiting, the listing is usually still visible but may be partially suppressed.

Want me to make the config.ts + manifest.ts change? It's two lines.