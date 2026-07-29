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

The Portfolio Guide is a compact inline `Ask about this work` feature for canonical project-detail pages, extended with homepage role intent and one anonymous site-wide conversation. With durable conversations enabled, Neon restores the thread in the same browser for 90 days after the last turn.

## Architecture Summary

- The site is a Next.js 14 App Router app with mixed content systems, so the guide uses a normalization layer instead of refactoring page architecture first.
- Canonical guide data comes from existing `content/portfolio.ts`, `data/positioning.ts`, `data/cases.ts`, and `data/caseStudies.ts`.
- A thin overlay in `content/projects/portfolio-guide.ts` fills guide-specific gaps such as ownership wording, related project slugs, artifact labels, and interest tags.
- A shared `lib/portfolio-guide` module owns types, context building, session storage helpers, intent parsing, guided recommendation ranking, tag inference, prompt scaffolding, and response normalization.
- A single API route at `/api/portfolio-copilot` sends only structured context to OpenAI and never scrapes raw page HTML.
- The live guide now defaults to `gpt-5.4` on the API path, with `OPENAI_MODEL` kept as an override.

## Data Flow

1. The client sends only `clientTurnId`, `pageSlug`, the message/source, bounded session signals, and a degraded-mode dialogue fallback.
2. The route resolves `pageContext` and `portfolioContext` from canonical server-side content; client-supplied page facts cannot enter grounding.
3. The opaque cookie resolves one active conversation, and Neon restores the site-wide transcript and role/navigation memory.
4. The route reserves an idempotent turn, applies per-conversation/IP/global limits, and constructs a bounded 24k-token prompt context.
5. The Responses API can use the allowlisted career-evidence and user-history tools. Every model call, tool result, and deterministic guardrail change is recorded in a redacted trace.
6. The answer and trace complete the pending turn. If persistence fails, the same grounded model path runs without blocking the visitor.

## Storage Approach

- `sessionStorage` is only a temporary UI/degraded-mode cache for:
  - `visitedPages`
  - `clickedPrompts`
  - `askedQuestions`
  - `inferredInterestTags`
  - `visitorIntent`
  - `recommendedPath`
  - `lastVisitedAt`
  - `tagSignals`
  - the current site-wide transcript cache
- Anonymous conversations use an opaque 256-bit `HttpOnly` cookie; only its SHA-256 hash is stored in Neon.
- Neon stores the full user/assistant transcript, validated prompt snapshot, model response IDs and usage, evidence metadata, and redacted model/tool/guardrail trace events.
- Conversation memory is deliberately narrow: role intent, visited pages, inferred interest tags, recent user questions, and only the immediately previous assistant answer when a follow-up is explicitly referential.
- When persistence is disabled or unavailable, the model path still works and the current browser tab keeps a temporary `sessionStorage` copy.

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

- The first time a visitor lands on a canonical project page, that slug is added to `visitedPages` and later merged into the durable conversation memory.
- If the visitor declares a hiring role from the homepage, that role is normalized into `visitorIntent` and reused throughout the browsing session.
- Chip clicks and typed questions are tracked in the active anonymous conversation and expire after 90 days of inactivity.
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

## Local And Production Environments

- Local development should point `DATABASE_URL` and `DATABASE_URL_UNPOOLED` at the Neon `development` branch, with `APP_ENV=local` and `DATABASE_BRANCH_NAME=development`.
- Production should point the same variables at the Neon `production` branch, with `APP_ENV=production` and `DATABASE_BRANCH_NAME=production`.
- Runtime app traffic should use the pooled URL. Migrations and reporting should use the unpooled URL when available.

## Local Setup

1. Add `OPENAI_API_KEY` to your local environment.
2. Optionally add `OPENAI_MODEL` to override the default `gpt-5.4` fallback.
3. Set `PORTFOLIO_GUIDE_DURABLE_CONVERSATIONS=true` and a long random `PORTFOLIO_GUIDE_PRIVACY_SALT`.
4. Set `CRON_SECRET` for the protected retention cleanup route.
5. Run `npm run db:migrate`, then start the app with `npm run dev`.
6. Inspect conversations with `npm run report:portfolio-guide-conversations -- --since 30d`; add `--conversation <id-prefix>` for full turn and trace details.
7. Validate with `npm run lint`, `npm run typecheck`, `npm run test:portfolio-guide`, `npm run eval:portfolio-guide:local -- --smoke`, and `npm run build`.

## Eval Coverage

- A dedicated page-grounded eval suite now lives alongside the guide implementation.
- The runner exercises the same structured request contract as the product route rather than a parallel mock benchmark.
- `gpt-oss:20b` is the preferred fast local eval harness; it is not the intended live route model.
- Seed cases cover answerable, partially answerable, unanswerable, contaminated-history, and cross-page-memory behavior.
- See `docs/portfolio-guide-evals.md` for commands, output structure, and how to add new cases.

## Grounding Hardening Note

- Root cause: the guide already used structured site content instead of DOM scraping, but the prompt also included recent conversation with assistant replies. That let earlier model-written answers influence later ones, especially when the current-page context was condensed and left room for synthesis.
- What changed: the prompt separates `currentPage.authoredContent`, `currentPage.structuredMetadata`, `siteMemory`, `siteCatalog`, and conversation context. Non-referential turns exclude assistant history; referential follow-ups receive only the immediately previous assistant answer, labeled as untrusted dialogue context. A separate tool can search older user messages but never assistant claims.
- Tradeoffs: the guide is intentionally more willing to say that a detail is not explicit on the page. That reduces speculative answers, but it also means some follow-up questions now produce a narrower answer unless the current page or broader site context clearly supports the claim.
