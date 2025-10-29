# Daniel Nash Portfolio

Next.js 14 + TailwindCSS portfolio showcasing product work, music, and LaunchMuse early access.

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and provide values:

- `HUBSPOT_PRIVATE_APP_TOKEN` - Private app token with **forms** scope.
- `HUBSPOT_FORM_ID` - HubSpot form ID that receives LaunchMuse waitlist submissions.
- `SITE_BASE_URL` - Deployed site URL (e.g., `https://danielnash.com`).

## HubSpot Setup

1. Create or identify a Marketing form and grab its ID.
2. Ensure these properties exist on the contact object:
   - `firstname` (default)
   - `lm_role` (single-line text or dropdown) - used to store the LaunchMuse role selection.
   - `consent_to_communicate` (single checkbox) - set to `"true"` or `"false"` from the waitlist form.
3. Confirm the private app token has permission to submit to Marketing Forms API (`marketing` scope).

## Scripts

- `npm run dev` - Start the local development server.
- `npm run build` - Production build (runs type check & lint).
- `npm run start` - Start the production server after build.
- `npm run lint` - Lint the project.
- `npm run images:meta` - Rebuild portrait metadata (width/height/alt) from source photos.
- `npm run images:build` - Generate AVIF/WebP portrait derivatives and avatar thumbs.

## Portrait System

Portrait assets live in `/public/portraits`. Photo metadata is generated via `npm run images:meta`, which inspects each `_photo` file for width, height, roles, and alt text. Each entry drives both the `Portrait` component and the derivative build script. After swapping or adding portraits, run `npm run images:meta` followed by `npm run images:build` (or the `pnpm` equivalents) to refresh metadata, AVIF/WebP variants, and 256px/512px avatar thumbnails. The component uses metadata roles to pick the best asset per variant, so ensure new files list the roles they should satisfy (e.g., `"hero"`, `"inline"`, `"card-left"`).

## LaunchMuse Waitlist

The LaunchMuse product page lives at `/products/launchmuse` and posts to `/api/launchmuse/subscribe`, which forwards submissions to the HubSpot Forms API with honeypot protection and toast-driven feedback.
