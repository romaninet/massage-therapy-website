# TODO

## Blog / Articles Section

**Priority: High — the single biggest organic ranking lever currently missing.**

Without blog content, the site competes only via the Google Maps 3-pack. Every informational long-tail query ("massage pour le dos Gatineau", "drainage lymphatique à quoi s'attendre", "massothérapeute vs physiothérapeute") returns zero content from this site. Competitors with 10+ articles rank for hundreds of keyword variations.

### What to build (code — 4–6 hours)

1. Add route `/[locale]/articles/[slug]` — dynamic, bilingual, uses next-intl
2. Add articles index page at `/[locale]/articles`
3. Store article content as JSON files in `messages/articles/` (JSON preferred over MDX for easier bilingual i18n)
4. Add `articleJsonLd()` to `src/lib/jsonld.ts` — `@type: Article` with `author`, `publisher`, `datePublished`, `inLanguage`
5. Update `src/app/sitemap.ts` to include all `/articles/*` routes dynamically
6. Link the articles index from the footer and from the home page CTA section

### Article template (every post must follow this)

- **Length:** 800–1500 words
- **H1** with primary keyword
- **3–5 H2 sections**
- At least **2 internal links** to `/services` and `/fees`
- Geographic keywords woven in naturally (Gatineau, Hull, Outaouais, Ottawa)
- AMQ membership reference where credible
- **Article JSON-LD** (`@type: Article`, author: Olha Shelest, publisher: shelestwellness.ca, datePublished)
- **FAQ JSON-LD** if the article has 3+ question/answer blocks
- CTA at end: "Prête à réserver une séance ? / Ready to book?" → `/contact`
- 1 hero image with bilingual alt text

### Articles to write — in this order (FR first, EN translation second)

| # | FR title | EN title | Primary keywords |
|---|----------|----------|-----------------|
| 1 | Comment choisir un massothérapeute à Gatineau | How to choose a massage therapist in Gatineau | massothérapeute Gatineau, choisir massothérapeute |
| 2 | Massage thérapeutique vs massage de détente | Therapeutic vs relaxation massage — which to choose | massage thérapeutique Gatineau, différence massage |
| 3 | Reçus AMQ : votre massage couvert par les assurances | AMQ receipts: getting your massage covered by insurance | reçu massage assurance, AMQ Gatineau |
| 4 | Drainage lymphatique : à quoi s'attendre | Lymphatic drainage: what to expect | drainage lymphatique Gatineau |
| 5 | Massage pour femmes enceintes à Gatineau | Prenatal massage in Gatineau | massage femme enceinte Gatineau, prenatal massage Gatineau |
| 6 | Massage en profondeur pour la récupération sportive (Parc de la Gatineau) | Deep tissue massage for runners and athletes | massage en profondeur Gatineau, deep tissue Gatineau |
| 7 | Massage en profondeur : à qui s'adresse-t-il ? | Deep tissue massage: when it's right for you | deep tissue Gatineau, massage en profondeur |
| 8 | Préparer sa première séance | Preparing for your first massage session | first massage what to expect |
| 9 | Massage pour enfants : guide pour parents | Massage for children: a parent's guide | massage enfant Gatineau |
| 10 | Massage en duo : pourquoi le vivre ensemble | Couples massage: why share the experience | massage en duo Gatineau, couples massage Gatineau |
| 11 | Stress, sommeil et massage : la science | Stress, sleep, and massage: the science | bienfaits massage stress |
| 12 | Massage à Gatineau pour les employés fédéraux d'Ottawa | Massage in Gatineau for Ottawa federal workers | massage Ottawa Gatineau, cross-river massage |

**Cadence:** 1 article every 2 weeks. Do NOT publish all at once — Google may sandbox a sudden content flood.

See full implementation guidance in [SITE-PROMOTION-PLAN.md §5.1](SITE-PROMOTION-PLAN.md).

---

## GBP — Improve Q&A Section

**Priority: High — GBP Q&A is indexed by Google and is an underused local ranking signal.**

Pre-populate the public Q&A panel on Google Business Profile. You are allowed to ask AND answer your own questions (this is Google's recommended practice for businesses).

### How to do it

1. Open [Google Business Profile](https://business.google.com) and go to your listing
2. Click **"Ask a question"** — ask the question from your account
3. Then switch to the business owner view and **answer** it
4. Repeat for all 10 questions below

### Questions to add (ask and answer in both FR and EN)

1. Quels services offrez-vous ? / What services do you offer?
2. Quel est le tarif d'une séance ? / What's the rate for a session?
3. Y a-t-il du stationnement à proximité ? / Is there parking nearby?
4. Acceptez-vous les reçus pour assurances ? / Do you provide insurance receipts? *(yes — AMQ member #M-24-4471)*
5. Parlez-vous français et anglais ? / Do you speak French and English?
6. Faut-il prendre rendez-vous ? / Do I need to book in advance?
7. Quel type de massage est recommandé pour une première visite ? / What massage is recommended for a first visit?
8. Faites-vous des massages pour femmes enceintes ? / Do you offer prenatal massage?
9. À quoi dois-je m'attendre lors de ma première séance ? / What should I expect during my first session?
10. Acceptez-vous les paiements par Interac / carte / comptant ? / Do you accept Interac / card / cash?

### Tips for maximum SEO value

- Keep answers concise (under 200 characters each)
- Include service keywords naturally: "massage thérapeutique", "drainage lymphatique", "Gatineau", etc.
- Check the Q&A panel weekly — anyone can ask a question and you must respond promptly
- Google indexes the full text of Q&A answers — treat them like mini-descriptions of your services

---

## Near Future: Additional Directory Listings

The following directories are worth creating when time allows. Use the canonical NAP exactly:
> Olha Shelest · 148 Rue Eddy, Unit 2, Gatineau, QC J8X 2W8 · (819) 815-5603 · https://www.shelestwellness.ca

| Platform | URL | Priority | Notes |
|----------|-----|----------|-------|
| Répertoire des ressources en santé et services sociaux | sante.gouv.qc.ca | Medium | Quebec government health directory — strong trust signal for QC market |
| Medimap.ca | medimap.ca | Medium | Canadian healthcare directory used by patients to find practitioners |
| Annuaire-Sante.ca | annuaire-sante.ca | Lower | Quebec health practitioner directory |

After creating each, log it in [README.md](README.md) under "Backlinks & Directory Listings" with the date.
