# Portfolio Guide

## Implementation Status

- [x] Confirm canonical scope: `/work/chatgpt-enterprise`, `/work/ai-platform-mcp`, `/work/checkout-redesign`, `/products/launchmuse`, `/products/immunology-scout`, `/products/oms-chatgpt-app`, `/case-studies/jira-product-discovery`
- [x] Define guide types, page adapters, portfolio context, session helpers, and recommendation logic
- [x] Build the API route and model prompt scaffolding
- [x] Build the compact inline UI and mount it on canonical project pages
- [x] Extend the experience with homepage role intent, guided recommendations, and shared session-aware role context
- [x] Add focused tests for session state, tag inference, related-page ranking, and response normalization
- [x] Run lint, typecheck, tests, and build

## What Was Built

The Portfolio Guide is a compact inline `Ask about this work` feature for canonical project-detail pages, now extended with a homepage role-intent entry point. Visitors can optionally declare the role they are hiring for, get a deterministic reading path, and carry that context through later project-page guide conversations without adding a database.

## Architecture Summary

- The site is a Next.js 14 App Router app with mixed content systems, so the guide uses a normalization layer instead of refactoring page architecture first.
- Canonical guide data comes from existing `content/portfolio.ts`, `data/positioning.ts`, `data/cases.ts`, and `data/caseStudies.ts`.
- A thin overlay in `content/projects/portfolio-guide.ts` fills guide-specific gaps such as ownership wording, related project slugs, artifact labels, and interest tags.
- A shared `lib/portfolio-guide` module owns types, context building, session storage helpers, intent parsing, guided recommendation ranking, tag inference, prompt scaffolding, and response normalization.
- A single API route at `/api/portfolio-copilot` sends only structured context to OpenAI and never scrapes raw page HTML.
- The live guide now defaults to `gpt-5.4` on the API path, with `OPENAI_MODEL` kept as an override.

## Data Flow

1. The server page builds `pageContext` from the canonical route and `portfolioContext` from shared site content.
2. The homepage role-intent module can normalize a title/brief/JD into `visitorIntent`, rank a deterministic `recommendedPath`, and persist both to `sessionStorage`.
3. The client guide records session behavior in the same shared browser session: visited pages, clicked prompts, asked questions, inferred tags, visitor intent, recommended path, and per-page transcripts.
4. On interaction, the client sends `message`, `pageContext`, `portfolioContext`, `sessionContext`, and a trimmed recent conversation to `/api/portfolio-copilot`.
5. The route computes related-page candidates with both page similarity and role-intent weighting, calls the model with a grounded system prompt, validates the JSON response, and filters any invalid tags or page suggestions.
6. The client stores the answer in the current page’s session transcript and updates the subtle session-aware extra chip.

## Storage Approach

- MVP storage is browser-only with `sessionStorage`.
- The stored state contains:
  - `visitedPages`
  - `clickedPrompts`
  - `askedQuestions`
  - `inferredInterestTags`
  - `visitorIntent`
  - `recommendedPath`
  - `lastVisitedAt`
  - `tagSignals`
  - `conversationsBySlug`
- If `sessionStorage` is unavailable, the guide falls back to in-memory state for the current tab so the page still works.

## How Page Metadata Works

- Existing portfolio entries stay the source of truth.
- `workEntries` and `productEntries` supply most `PageContext` fields for the canonical work and product pages.
- The Jira case study uses the existing `cases` and `CASE_STUDIES` data plus the guide overlay.
- The overlay file adds only guide-safe metadata that is hard to derive cleanly from existing content:
  - `category`
  - `oneLiner`
  - `leadershipSignals`
  - `tools`
  - `artifacts`
  - `relatedProjectSlugs`
  - `interestTags`
  - `roleLens`
  - `domains`
  - `strengths`
  - `senioritySignals`
  - `projectType`

## How Session Awareness Works

- The first time a visitor lands on a canonical project page, that slug is added to `visitedPages`.
- If the visitor declares a hiring role from the homepage, that role is normalized into `visitorIntent` and reused throughout the browsing session.
- Chip clicks and typed questions are tracked in-session only.
- Interest tags are inferred from page metadata, chip text, and typed questions using a fixed allowlist:
  - `ai-builder`
  - `pm-leadership`
  - `platform`
  - `healthtech`
  - `0-to-1`
  - `technical-depth`
- After at least two distinct project-page visits, the guide can surface one subtle extra prompt. When `visitorIntent` exists, that prompt becomes role-aware and nudges the visitor toward the remaining strongest evidence or a concise fit summary.

## How To Add Metadata For A New Project

1. Make the project a canonical detail route with a stable slug and href.
2. Add or reuse its structured content in `content/portfolio.ts` or the existing case-study data files.
3. Add a keyed guide overlay entry in `content/projects/portfolio-guide.ts` with any guide-only fields that are missing.
4. Mount the guide on the page and pass the route path into `getPageContextByPath`.

## Future Persistent Storage

If this moves to Neon or another database later, keep the current `PageContext`, `PortfolioContext`, and `/api/portfolio-copilot` contract intact. Replace only the browser session helpers with a server-backed session store keyed by an anonymous session identifier, and continue treating the page/portfolio metadata as the grounding source of truth.

## Local Setup

1. Add `OPENAI_API_KEY` to your local environment.
2. Optionally add `OPENAI_MODEL` to override the default `gpt-5.4` fallback.
3. Run `npm install` if dependencies are not already present.
4. Start the app with `npm run dev`.
5. Validate the feature with `npm run lint`, `npm run typecheck`, `npm run test:portfolio-guide`, `npm run eval:portfolio-guide`, and `npm run build`.

## Eval Coverage

- A dedicated page-grounded eval suite now lives alongside the guide implementation.
- The runner exercises the same structured request contract as the product route rather than a parallel mock benchmark.
- `gpt-oss:20b` is the preferred fast local eval harness; it is not the intended live route model.
- Seed cases cover answerable, partially answerable, unanswerable, contaminated-history, and cross-page-memory behavior.
- See `docs/portfolio-guide-evals.md` for commands, output structure, and how to add new cases.

## Validation Notes

- Code-level validation is complete: focused tests, typecheck, lint, and production build all passed.
- In this sandbox, interactive local-server verification was limited by watcher and runtime artifact issues (`EMFILE` during `next dev`, then missing `.next/BUILD_ID` when trying `next start` despite a successful build). Re-run the normal browser pass on a typical local machine after pulling the changes.

## Grounding Hardening Note

- Root cause: the guide already used structured site content instead of DOM scraping, but the prompt also included recent conversation with assistant replies. That let earlier model-written answers influence later ones, especially when the current-page context was condensed and left room for synthesis.
- What changed: the prompt now separates `currentPage.authoredContent`, `currentPage.structuredMetadata`, `siteMemory`, `siteCatalog`, and user-only conversation context. Assistant replies are excluded from grounding, richer authored page sections are passed from structured content, and prompt rules now explicitly block unsupported rankings, ownership claims, and invented causality.
- Tradeoffs: the guide is intentionally more willing to say that a detail is not explicit on the page. That reduces speculative answers, but it also means some follow-up questions now produce a narrower answer unless the current page or broader site context clearly supports the claim.
