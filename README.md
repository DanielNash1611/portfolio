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

## Portfolio Content Model

The recruiter-facing portfolio is now driven from [`content/portfolio.ts`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/content/portfolio.ts).

Update content there when you want to change:

- Homepage hero copy, proof metrics, featured sections, and CTA content
- Work case studies and their page sections
- Product pages and live-product links
- Thinking essays
- Creative pages
- Testimonials / LinkedIn recommendations
- Resume metadata and placeholder filenames

### Add or update case studies

1. Open [`content/portfolio.ts`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/content/portfolio.ts).
2. Find the `workEntries` array.
3. Edit an existing entry or add a new object with:
   - `slug`
   - `title`, `summary`, `description`
   - `featuredMetrics`
   - `context`, `problem`, `strategicInsight`, `optionsAndTradeoffs`, `execution`, `impact`, `reflection`
   - `visuals`
   - `testimonialIds`
4. Create a matching route at `app/work/<slug>/page.tsx` that reads the entry through `getWorkEntry(...)` and renders `CaseStudyTemplate`.

### Add or update products

1. Open [`content/portfolio.ts`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/content/portfolio.ts).
2. Find the `productEntries` array.
3. Add or edit an entry with:
   - `status`
   - `problem`
   - `solution`
   - `productExperience`
   - `learnings`
   - `visuals`
   - optional `actions`
4. Create a matching route at `app/products/<slug>/page.tsx` that renders `ProductTemplate`.

### Add or update LinkedIn recommendations / testimonials

1. Open [`content/portfolio.ts`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/content/portfolio.ts).
2. Find the `testimonials` array.
3. Replace any `source: "Placeholder"` entry with the real:
   - `quote`
   - `name`
   - `title`
   - `company`
   - optional `relationship`
   - optional `context`
4. Add the testimonial `id` to any work entry's `testimonialIds` array if you want it surfaced on a case study page.
5. Set `featured: true` if you want it eligible for the homepage testimonial section.

### Resume files

Drop resume PDFs into [`public/resumes`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/public/resumes) using the filenames listed in `resumeVariants` inside [`content/portfolio.ts`](/Users/danielnash/Code/DanielNash/Portfolio/portfolio/content/portfolio.ts).
