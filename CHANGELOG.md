# Portfolio Repositioning Changelog

## Why this update happened

The site was repositioned to support product job search more directly with a
broad-market default narrative:

- Senior Product Manager
- Builder PM
- Product Leader

The new hierarchy makes Senior Product Manager the primary framing, keeps Builder
PM and Product Leader visible as alternate lenses, and preserves music as a
secondary differentiator instead of the top-of-funnel message.

## What changed

- Rewrote the homepage hero around Senior Product Manager positioning.
- Added a "Choose the lens" section for Senior Product Manager, Builder PM, and
  Product Leader.
- Replaced rolled-up or vague metrics with explicit approved proof points.
- Added a recruiter-friendly explanation of when to think about each narrative.
- Added visible resume access points for all three resume tracks.
- Reorganized featured work and the main work page around hiring intent instead
  of topic alone.
- Added teaser cards for capability stories that do not yet have full case
  studies.
- Added Immiatrics as emerging AI + science work with modest language.
- Rewrote the About page to lead with broad-market Senior Product Manager
  positioning and moved music lower in the hierarchy.
- Updated shared navigation, footer, and metadata to reinforce the new hiring
  path.

## Key files updated

- `app/page.tsx`
- `app/work/page.tsx`
- `app/about/page.tsx`
- `app/resume/page.tsx`
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/CaseCard.tsx`
- `components/CaseGridFilter.tsx`
- `components/ImpactAtScale.tsx`
- `data/positioning.ts`
- `data/cases.ts`
- `data/featuredWork.ts`
- `data/impact.ts`
- `sections/HomeHero.tsx`
- `sections/WhatIBuild.tsx`
- `sections/NarrativeBridge.tsx`
- `sections/FeaturedWork.tsx`
- `sections/ResumeAccess.tsx`
- `sections/AboutInline.tsx`

## Guidance for future edits

- Keep Senior Product Manager as the default homepage and metadata framing.
- Treat Builder PM and Product Leader as alternate lenses, not competing
  headline brands.
- Use only approved or clearly validated metrics on hiring-facing surfaces.
- Keep music on the site as a differentiator, but below work, resume, about,
  and contact in the recruiter path.
- Keep Immiatrics modest and early-stage unless stronger public proof exists.
