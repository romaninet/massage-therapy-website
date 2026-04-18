# Olha Shelest — Massage Therapy Website

Bilingual (EN/FR) website for Olha Shelest, Registered Massage Therapist, Gatineau QC.
Built with Next.js, Tailwind CSS, next-intl, and Resend.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

Create a `.env.local` file in the project root (never commit this file — it's in `.gitignore`):

```
RESEND_API_KEY=re_your_api_key_here
```

**How to get your Resend API key:**
1. Go to [resend.com](https://resend.com) and sign in
2. Navigate to **API Keys** in the dashboard
3. Create a new key and copy it
4. Paste it into `.env.local` as shown above

The key is used by the contact form (`/api/contact`) to send emails to the business address.

**When deploying** (e.g. Vercel): add `RESEND_API_KEY` as an environment variable in your hosting platform's settings — do not rely on `.env.local` in production.

## Business Details

All contact info, phone, email, address, and AMQ details are centralized in:

```
src/lib/config.ts
```

Update that single file to change any business details site-wide.

## Languages

Translation strings are in `messages/en.json` and `messages/fr.json`.
