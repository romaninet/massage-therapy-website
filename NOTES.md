# Project Notes

## Initial Promt
Build a high-end, fully responsive website for “Olha Shelest - Professional Massage Therapist".
Use the following technologies: Next.js, Tailwind CSS, and shadcn/ui. 

Use https://www.promassotherapie_com/ and alignyourbody_com/home and natalimosh_com as design inspiration, emulating its modern aesthetic, elegant serif headings, with clean sans-serif body text, and open layout with generous whitespaces.
Colour palette: deep forest green #2D6A4F as the primary brand color (navbars, buttons, headings, fills), sage green #52B788 for links and hover states, pale sage #F0F7F4 for light section backgrounds, and warm off-white #FAF9F5 as the base page background.
If design permits, use some elements from business card for general vibe reference when building the website (Business-card-front.jpg is a screenshot of the front of the business card)

Below are some mandatory requirements:
Website must support two languages for all pages and sections: English and French
Use logo from provided logo.png file
Must have a privacy policy page that is not part of the main menu (probably a half transparent link in the footer) (example is in following link  https://www.promassotherapie_com/general-5 and https://www.promassotherapie_com/fr/general-5 )
Website should have the following sections (pages):
Home - do not use Olha picture on the main page (maybe something simple like https://alignyourbody_com/home )
About Olha - picture of Olha (Olya-pic.jpg), with some background information (for beginning just come up with some random text)
Fees
Contact - should have both text with phone, email and address, as well as a contact form with input fields that will be send an email

About the massage therapist this website is for (can be used on about Olha page):
Name of the massage therapist: Olha Shelest
Olha is registered with AMQ https://membres.rmqmasso.ca/en/find-member/details/M-24-4471
Olha is professional massage therapist

For contact page, use the following:
Phone: 11111111
Email: mmmmm@gmail.com
Address: 9999999 Rue Eddy, Gatineau, QC 111 222

Keep the code clean and well structured

## General prompt
ROLE:
You are an expert website developer with excellent knowledge in following fields:
 - UI expert, knowledgable in latest design and UX fileds for website development, spesifically in massage, beauty and spa industry
 - Expert in SEO (Search engine optimization) for self employed people with a small business
 - technical expert in technologies: Next.js, Tailwind CSS, and shadcn/ui

CONTEXT:
The following code is a website for Olha Shelest.

Here are some details about Olha and her self employment business:
 - full name: Olha Shelest
 - Olha is self employed Professional Massage Therapist. She is operating in Gatineau, QC (doesn't have a registerred business)
 - Olha is registered with AMQ https://membres.rmqmasso.ca/en/find-member/details/M-24-4471

Here are some details about the website:
 - Supports two languages (mandatory): English and French. 
 - Useing the following technologies: Next.js, Tailwind CSS, and shadcn/ui
 - All personal or sherable data across website and languages should avoid duplications and kept in config.ts
 - Initially it used the following websites for design inspiration: https://www.promassotherapie_com/ and https://alignyourbody_com/home and natalimosh_com and https://www.ommassage_net
 - contact form is sent using resend.com
 - deployed to Vercel
 - using a dedicated logo
 - privacy policy page is not part of the main menu of the site
 - code should be clean, well structured and use design patterns where applicable, avoid duplications, support two languages

RULES:
When in doubt or when you need an additional context for better results, 
state it clearly and ask relevant questions that will help you to get the best results before you continue.

Take all the time that you need. The priority is always for correct response, rather than quick results.

TASK:

## Images resource
 Here are 10 free massage image resources:

https://www.pexels.com/search/massage/
https://www.freepik.com/free-photos-vectors/massage
https://pixabay.com/images/search/massage/
https://www.freeimages.com/search/massage
https://unsplash.com/s/photos/massage
https://www.vecteezy.com/free-photos/massage
https://stocksnap.io/search/massage
https://www.gettyimages.com/photos/free-massage-images
https://burst.shopify.com/ (search "massage" on site)
https://www.kaboompics.com/ (search "massage" on site)




# REF to claude.md version 1

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color


# REF to claude.md version 2
# Agent Instructions

You're working inside the **WAT framework** (Workflows, Agents, Tools). This architecture separates concerns so that probabilistic AI handles reasoning while deterministic code handles execution. That separation is what makes this system reliable.

## The WAT Architecture

**Layer 1: Workflows (The Instructions)**
- Markdown SOPs stored in `workflows/`
- Each workflow defines the objective, required inputs, which tools to use, expected outputs, and how to handle edge cases
- Written in plain language, the same way you'd brief someone on your team

**Layer 2: Agents (The Decision-Maker)**
- This is your role. You're responsible for intelligent coordination.
- Read the relevant workflow, run tools in the correct sequence, handle failures gracefully, and ask clarifying questions when needed
- You connect intent to execution without trying to do everything yourself
- Example: If you need to pull data from a website, don't attempt it directly. Read `workflows/scrape_website.md`, figure out the required inputs, then execute `tools/scrape_single_site.py`

**Layer 3: Tools (The Execution)**
- Python scripts in `tools/` that do the actual work
- API calls, data transformations, file operations, database queries
- Credentials and API keys are stored in `.env`
- These scripts are consistent, testable, and fast

**Why this matters:** When AI tries to handle every step directly, accuracy drops fast. If each step is 90% accurate, you're down to 59% success after just five steps. By offloading execution to deterministic scripts, you stay focused on orchestration and decision-making where you excel.

## How to Operate

**1. Look for existing tools first**
Before building anything new, check `tools/` based on what your workflow requires. Only create new scripts when nothing exists for that task.

**2. Learn and adapt when things fail**
When you hit an error:
- Read the full error message and trace
- Fix the script and retest (if it uses paid API calls or credits, check with me before running again)
- Document what you learned in the workflow (rate limits, timing quirks, unexpected behavior)
- Example: You get rate-limited on an API, so you dig into the docs, discover a batch endpoint, refactor the tool to use it, verify it works, then update the workflow so this never happens again

**3. Keep workflows current**
Workflows should evolve as you learn. When you find better methods, discover constraints, or encounter recurring issues, update the workflow. That said, don't create or overwrite workflows without asking unless I explicitly tell you to. These are your instructions and need to be preserved and refined, not tossed after one use.

## The Self-Improvement Loop

Every failure is a chance to make the system stronger:
1. Identify what broke
2. Fix the tool
3. Verify the fix works
4. Update the workflow with the new approach
5. Move on with a more robust system

This loop is how the framework improves over time.

## File Structure

**What goes where:**
- **Deliverables**: Final outputs go to cloud services (Google Sheets, Slides, etc.) where I can access them directly
- **Intermediates**: Temporary processing files that can be regenerated

**Directory layout:**
```
.tmp/           # Temporary files (scraped data, intermediate exports). Regenerated as needed.
tools/          # Python scripts for deterministic execution
workflows/      # Markdown SOPs defining what to do and how
.env            # API keys and environment variables (NEVER store secrets anywhere else)
credentials.json, token.json  # Google OAuth (gitignored)
```

**Core principle:** Local files are just for processing. Anything I need to see or use lives in cloud services. Everything in `.tmp/` is disposable.

## Bottom Line

You sit between what I want (workflows) and what actually gets done (tools). Your job is to read instructions, make smart decisions, call the right tools, recover from errors, and keep improving the system as you go.

Stay pragmatic. Stay reliable. Keep learning.




====================
How to do it in GBP
Go to business.google.com → your listing
Find the Q&A section (usually on the public profile view)
Click "Ask a question" — type the question, submit
Switch to the business owner view, find your question, click "Answer"
Repeat for all 20 (10 FR + 10 EN — do both languages separately)
Tip: Do FR and EN as separate Q&A pairs. GBP has no language filter — both will be visible and indexed by Google.

The 10 questions — French then English
1. Services offered
FR Question: Quels services offrez-vous ?

FR Answer:

Massage thérapeutique, en profondeur, de relaxation, drainage lymphatique, massage pour enfants et massage en duo. Séances de 60 ou 90 min. Membre AMQ #M-24-4471 — reçus pour assurances fournis. 148 Rue Eddy Unit 2, Gatineau.

EN Question: What services do you offer?

EN Answer:

Therapeutic, deep tissue, relaxation, lymphatic drainage, children's massage, and couples massage. Sessions 60 or 90 min. AMQ member #M-24-4471 — official insurance receipts provided. 148 Rue Eddy Unit 2, Gatineau.

2. Rates
FR Question: Quel est le tarif d'une séance ?

FR Answer:

Massage thérapeutique / relaxation / drainage : 110 $ (60 min) ou 150 $ (90 min). Massage en profondeur : 120 $ / 165 $. Massage enfant : 50 $ (30 min) ou 80 $ (60 min). Massage en duo : 220 $ / 300 $. Reçus AMQ fournis.

EN Question: What are your rates?

EN Answer:

Therapeutic / relaxation / lymphatic: $110 (60 min) or $150 (90 min). Deep tissue: $120 / $165. Children's: $50 (30 min) or $80 (60 min). Couples: $220 / $300. AMQ insurance receipts provided for all sessions.

3. Parking
FR Question: Y a-t-il du stationnement à proximité ?

FR Answer:

Oui — stationnement gratuit sur rue Eddy et les rues avoisinantes (rue Laurier, rue Laval). Aucun stationnement payant requis. À 5 min à pied du pont Portage pour les clients d'Ottawa.

EN Question: Is there parking near your location?

EN Answer:

Yes — free street parking on Rue Eddy and nearby streets (rue Laurier, rue Laval). No paid lot needed. A 5-minute walk from the Portage bridge for Ottawa-side clients.

4. Insurance receipts
FR Question: Acceptez-vous les reçus pour assurances ?

FR Answer:

Oui. À titre de massothérapeute membre de l'AMQ (#M-24-4471), je fournis des reçus officiels acceptés par la plupart des régimes d'assurance collective canadiens. Aucune référence médicale requise.

EN Question: Do you provide receipts for insurance?

EN Answer:

Yes. As an AMQ-registered massage therapist (member #M-24-4471), I provide official receipts accepted by most Canadian group insurance and employee benefit plans. No doctor's referral required.

5. Languages
FR Question: Parlez-vous français et anglais ?

FR Answer:

Oui — les séances sont offertes en français et en anglais.

EN Question: Do you offer sessions in French and English?

EN Answer:

Yes — sessions are available in both French and English.

6. Booking
FR Question: Faut-il prendre rendez-vous à l'avance ?

FR Answer:

Oui, un rendez-vous est requis. Réservez en ligne via shelestwellness.ca ou par courriel à massage@shelestwellness.ca. Disponibilités du lundi au vendredi 15h–20h et le dimanche 10h–16h.

EN Question: Do I need to book in advance?

EN Answer:

Yes, appointment required. Book online at shelestwellness.ca or email massage@shelestwellness.ca. Available Mon–Fri 3–8 PM and Sunday 10 AM–4 PM.

7. First visit recommendation
FR Question: Quel type de massage recommandez-vous pour une première visite ?

FR Answer:

Le massage thérapeutique est un excellent point de départ — il peut être adapté à vos besoins. Nous discutons de vos objectifs en début de séance pour choisir la meilleure approche ensemble.

EN Question: What massage do you recommend for a first visit?

EN Answer:

Therapeutic massage is a great starting point — it's adapted to your specific needs and goals. We discuss your concerns at the start of every session to choose the best approach together.

8. Prenatal massage
Before adding this one: confirm with Olha whether she offers prenatal / pregnancy massage. It's not listed as a named service in the config — if she does offer it as a variation of therapeutic massage, use the answer below. If not, skip this question entirely.

FR Question: Faites-vous des massages pour femmes enceintes ?

FR Answer (if yes):

Oui — le massage prénatal est offert et adapté à chaque trimestre. Veuillez le mentionner lors de votre réservation afin de personnaliser la séance selon vos besoins.

EN Question: Do you offer prenatal massage?

EN Answer (if yes):

Yes — prenatal massage is available and adapted to each trimester. Please mention your pregnancy when booking so the session can be tailored to your needs.

9. First session — what to expect
FR Question: À quoi dois-je m'attendre lors de ma première séance ?

FR Answer:

Une courte discussion sur vos objectifs et votre historique de santé, suivie d'un massage complet avec drapage maintenu en tout temps. Prévoyez quelques minutes supplémentaires pour l'accueil.

EN Question: What should I expect during my first massage session?

EN Answer:

A short intake conversation about your goals and health history, then a full massage with draping maintained throughout. Allow a few extra minutes for the intake at the start of your first visit.

10. Payment methods
FR Question: Acceptez-vous les paiements par Interac, carte ou comptant ?

FR Answer:

Nous acceptons le comptant et le virement Interac. Les cartes de crédit ne sont pas acceptées pour le moment.

EN Question: What payment methods do you accept?

EN Answer:

Cash and Interac e-Transfer accepted. Credit cards are not currently accepted.