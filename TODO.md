# TODO

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

**Hero images still needed** — drop these into `public/images/` before deploying:
- `article-choose-therapist.jpg`
- `article-deep-tissue-runners.jpg`
- `article-therapeutic-vs-relaxation.jpg`
- `article-amq-insurance.jpg`

### Articles still to write (cadence: 1 every 2 weeks)

| # | FR title | EN title | Primary keywords |
|---|----------|----------|-----------------|
| 5 | Drainage lymphatique : à quoi s'attendre | Lymphatic drainage: what to expect | drainage lymphatique Gatineau |
| 6 | Massage pour femmes enceintes à Gatineau | Prenatal massage in Gatineau | massage femme enceinte Gatineau |
| 7 | Massage en profondeur : à qui s'adresse-t-il ? | Deep tissue massage: when it's right for you | deep tissue Gatineau |
| 8 | Préparer sa première séance | Preparing for your first massage session | first massage what to expect |
| 9 | Massage pour enfants : guide pour parents | Massage for children: a parent's guide | massage enfant Gatineau |
| 10 | Massage en duo : pourquoi le vivre ensemble | Couples massage: why share the experience | massage en duo Gatineau |
| 11 | Stress, sommeil et massage : la science | Stress, sleep, and massage: the science | bienfaits massage stress |
| 12 | Massage à Gatineau pour les employés fédéraux d'Ottawa | Massage in Gatineau for Ottawa federal workers | massage Ottawa Gatineau |

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
