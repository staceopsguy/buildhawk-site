# BuildHawk Website

Production website for BuildHawk Pty Ltd · `buildhawk.com.au`.

Brand: **Precision Estimating. Disciplined Delivery.**
Office: Geelong, VIC · Australia.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19.2
- Tailwind CSS v4
- React Three Fiber + drei + Three.js (3D scenes)
- Lenis (smooth scroll)
- TypeScript

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
npm run start
```

## Deployment

Designed for Vercel. Push to GitHub, import the repo at vercel.com, deploy.

## Intake form (email delivery)

The contact form at `#intake` posts to `/api/intake`, which sends an email
via [Resend](https://resend.com) (free tier: 100 emails/day, 3,000/month).

To enable delivery in production:

1. Create a free account at https://resend.com
2. Verify a sending domain (or use the default `onboarding@resend.dev` for
   testing — notes below)
3. Generate an API key
4. In Vercel: **Project → Settings → Environment Variables**, add:
   - `RESEND_API_KEY` = your Resend API key
   - `INTAKE_TO_EMAIL` = `info@buildhawk.com.au` (already the default)
   - `INTAKE_FROM_EMAIL` = `BuildHawk <hello@buildhawk.com.au>`
     (use a verified sending domain you control; otherwise leave unset and
     the form will send from `onboarding@resend.dev` which works for testing
     but may land in spam)
5. Redeploy.

Until `RESEND_API_KEY` is set, the form returns a 503 with a graceful
"please email us directly" message and the submission is logged to the
Vercel function logs so nothing is lost.

## Brand assets

`/public/brand/` holds the emblem, wordmark, graphic patterns, and favicon.
Source design files live in `BuildHawk Brand Ecosystem/` (not in this repo).

## Contact

- info@buildhawk.com.au
- +61 433 366 607
- buildhawk.com.au/contact-us
