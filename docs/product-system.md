# Product Operating System

Source: Daniel's September 29, 2026 conversation, “Define Your Prototyping Method.”
This section describes the method and provides training starters. It does not
claim adoption, results, or implementation history for a new pod.

## Hosted suggestion limits, October 8, 2026

Production suggestion requests use the existing Postgres/Neon connection. Apply
the additive `migrations/006_product_workspace_suggestion_limits.sql` migration
before enabling the helper. A transaction-scoped advisory lock serializes quota
admission across instances: at most eight calls per client and 40 overall in a
rolling ten-minute window. The quota check and admission happen in the same
transaction; creating another server instance does not reset the counters.

Only a namespaced HMAC client identifier and admission time are stored. Draft
notes, source excerpts, provider responses, and raw IP addresses are excluded.
Expired admissions are removed when the next request checks quota. Production
requires `DATABASE_URL` and a persistent privacy secret. It uses
`PRODUCT_WORKSPACE_PRIVACY_SALT`, falling back to the existing
`PORTFOLIO_GUIDE_PRIVACY_SALT` or `FEEDBACK_RATE_LIMIT_SECRET`. `OPENAI_API_KEY`
remains the server-only provider credential. No new secret is required when an
existing privacy secret is configured.

Missing configuration, schema, a database failure, or an unverifiable admission
result returns 503 before any paid provider call. Production never falls back to
in-memory limits; manual editing and exports remain available. Development uses
the existing process-local limiter. An optimized local production preview uses
the durable limiter too.

Offline tests cover HMAC separation, database failures, invalid results, and the
API's fail-closed response. To exercise real shared admission, set
`PRODUCT_WORKSPACE_LIMIT_TEST_DATABASE_URL` to an isolated nonproduction Neon
branch where migration 006 is already applied, then run:

```bash
npx tsx --test __tests__/product-workspace/suggestion-limits.test.ts
```

The opt-in tests issue concurrent admissions through independent clients, check
the exact per-client and global caps, and verify expired quota is released. They
require an empty quota table and remove only their own HMAC rows afterward. They
do not apply migrations or call OpenAI. Without this explicit test URL, the
three database tests are skipped rather than reported as verified.

## Current experience

The shared layout renders the same sticky navigation on every route: **Watch /
Workspace / Field guide**, with one role panel alongside it. The current page or
reference section is always indicated. Menus close on selection, outside click,
and Escape; Escape returns focus to the triggering button.

- `/product-system`: the only Gravity conversation demo. The bottom composer
  advances its steps and finally opens the workspace.
- `/product-system/playbook`: a shared home for two editable workspaces. Develop
  an idea retains the existing tree, definition, learning, context, and AI helper.
  Start a project uses `?workspace=project` and has its own brief, MVP scope,
  context map, and first-cycle prompts. Each has a separate local draft and its
  own relevant exports. All inputs remain optional.
- The seven remaining chapter routes are optional reference. Each uses the same
  illustrated heading and field-note format. Intake, lifecycle, and evidence
  retain their focused teaching tools. Development Loop and AI-Native Building
  use reference diagrams instead of repeating the main demo or PRD animation.
  Each ends with a prominent next-chapter link, chapter progress, and a quieter
  previous link. The final chapter opens the workspace.
- Role selection is explicit, deterministic, and encoded as `?role=engineering`
  (or product, ai-engineering, design, business, leadership). It carries through
  navigation. No profile is inferred or sent to a model.
- “Share this perspective” points to the same role panel on any route. A
  selectable URL appears if clipboard access fails. Existing `#your-perspective`
  links open the panel; former `#your-idea` links open the canonical workspace.
- The shared provider remembers demo progress and the workspace's current step
  and view while navigating within this section. Refreshing resets that UI
  position; the saved draft remains. No demo content is copied into the draft.
- `Method` in the site navigation and the Thinking index link to Watch. The
  practice page links to existing authored stories without new outcome claims.

The later sections record earlier design iterations; this current experience
supersedes their duplicated demos, inline workspaces, and per-page navigation.

## Field-guide continuation, October 7, 2026

The seven reference chapters now end with a green continuation band, a visible
chapter position, the next title and question, and a secondary previous link.
The sequence excludes the workspace, so progress is 1–7 rather than the legacy
chapter numbers. The last chapter opens the workspace to apply the method.
All links use the shared role-aware navigation.

Field-guide pages have a compact Daniel Nash / Portfolio signoff and an explicit
Back to portfolio link. Their ending no longer shows the large site marketing
footer. Watch, Workspace, and the rest of the portfolio retain that footer.

Browser checks covered next and previous navigation, scroll to the top of the
destination, role retention, first and last chapter boundaries, and the final
handoff to Workspace. Phone widths of 390px and 320px had no horizontal overflow.
TypeScript, ESLint, formatting, and the production build passed. Portfolio-guide
prompts, grounding, and metadata were unchanged.

## Workspace refinement, October 7, 2026

The workspace starts with one heading, two compact choices, and four steps.
Optionality is stated once per workspace and retained in accessible fieldset
legends. Short field labels and concrete placeholders replace repeated setup
copy; all stored fields, storage keys, validators, and exported prompts remain.
The original idea appears above the live tree without creating unsupported
opportunities or solutions.

Both workspaces use Back / Continue and share a source-and-reading-checkpoint
context map. Full agent instructions are expandable; definitions render as
readable documents. These scrollable documents are labelled keyboard regions.
On phones, Preview and Back to notes connect the stacked panes. Step changes
focus the new heading after React commits it, with room below the sticky nav.
The selected workspace button avoids redundant history entries.

Validation: 20 workspace tests, TypeScript, ESLint, formatting, whitespace, and
the 52-page production build passed. Browser checks covered independent saved
drafts, restoration after refresh, history navigation, project clear/undo,
explicit approval wording, prompt copying, generated download contents, and
phone preview focus. Phone widths of 390px and 320px had no horizontal overflow;
no duplicate IDs were present. Portfolio-guide prompts and grounding metadata
were not changed. Synthetic test notes were removed after verification.

## Two workspaces, October 1, 2026

The workspace now has two explicit starting points within the same navigation
and route. The warm clay idea path develops a thought into a tree and learning
plan. The green project path prepares a new project for the method. Its four
steps are Frame, First MVP, Context, and First cycle. The live panel shows a
readable brief, a visual source-and-checkpoint map, or a copyable conversation
prompt. The three prompt choices cover brainstorming, requesting a PRD, and
building after the user has reviewed and approved that PRD.

The project form creates no repo, configuration, or running build. It generates
working notes and setup instructions for use in the visitor's chosen assistant.
All fields are optional and blank inputs remain open. It makes no model requests;
the existing optional AI helper remains in the idea workspace.

`daniel-nash:product-playbook:v1` remains unchanged. Project drafts use the separate
`daniel-nash:project-workspace:v1` key and validator. Clearing one does not alter
the other. Both editors stay mounted during mode switches, preserving in-memory
edits even when storage is unavailable. Back/forward and direct project links
select the matching workspace; the role query parameter is preserved. Within
the Product System, each workspace remembers its step and output view. Refresh
resets the workflow position while preserving saved field content.

The project exports are `project-brief.md`, `project-agent-context.md`, and the
selected `project-conversation-prompt.md`. Copying has a select-text fallback
for environments such as a phone visiting a local HTTP address.

Validation: 20 workspace tests, TypeScript, ESLint, formatting, diff whitespace,
and the 52-page production build passed. Local guide smoke evals passed 14/14
before and after. Browser checks covered independent edits, switching, project
clear/undo without changing the idea, reload restoration, back/forward, role
retention, prompt contents and successful clipboard copying, and export links.
Test draft content was removed afterward. Phone layouts at 390px and 320px had
no horizontal overflow; no duplicate element IDs were present. The production
preview reported no console errors and both workspace URLs returned HTTP 200
through the LAN address. Clipboard fallback is implemented; the in-app browser
granted clipboard access on the LAN URL, so that failure path was not exercised.
Screenshots are `output/product-system-review/two-workspaces-desktop.png` and
`output/product-system-review/two-workspaces-phone.png`.

## Persistent product context, October 1, 2026

The experience previously mentioned a repo PRD mainly at handoff. The current
version shows repeated consultation and maintenance throughout implementation.
It addresses the product-method concerns in the referenced discussion without
publishing its private interpersonal details or treating a suspected cause as
established fact.

Visual direction: keep the existing cream, moss, and pine surfaces; use the same
conversation and artifact panel to make context visible as the work changes.
The overview remains the short entry; the reference diagram explains the
mechanism; the existing workspace applies it. Stage changes update the context
cue, typed conversation, and artifact together; existing reduced-motion and
Continue behavior remain intact. No new routes or competing demos.

| Concern                                               | Where the experience addresses it                                                                                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial prompt loses influence during implementation  | Watch has a persistent-context cue at every stage; Build revisits the PRD at decisions and checks the complete flow.                                                            |
| Functional tasks can pass while the product drifts    | The PRD artifact shows the whole listener journey and preserved behavior. The guide's hypothetical “start all” example shows a working control violating independent timelines. |
| A new session lacks the earlier conversation          | Refine explicitly re-reads current context; the guide provides a fresh-session exercise that compares the agent's account with the actual source and result.                    |
| Agent instructions become another giant specification | The guide and exports separate entry pointers and checkpoints, product definition, bounded tickets, and repeatable skills.                                                      |
| Repo versus Jira becomes a false choice               | The guide makes accessibility and a current authoritative source the requirement; repo placement is the preferred example.                                                      |
| Inconsistent or stale team context                    | Optional owner and reviewed/revision fields; common source/flow/behavior standard; joint review and conflict-resolution guidance.                                               |
| Claimed benefits exceed the evidence                  | Proposed comparison includes drift, requirement misses, rework, time, and upkeep. No measured benefit or guarantee is claimed.                                                  |

The demo remains a condensed reenactment grounded in Gravity's product story.
The new context checkpoints illustrate the method; they are not claimed as a
historical tool log. Merely storing a document or linking it does not establish
that an agent consulted it or that its implementation is correct.

Workspace v1 drafts migrate missing `mustPreserve`, `contextOwner`, and
`contextReviewed` fields to empty strings. Present malformed values are rejected;
existing content, nodes, states, and links are preserved. All fields remain
optional. The new fields stay out of the optional model helper's payload.
Exports are setup drafts; they do not configure agents or synchronize repos.

Validation for this update:

- 15 workspace tests passed, including old-draft migration, context exports,
  blank-node preservation, and exclusion of the new fields from AI requests.
- TypeScript, ESLint, diff whitespace checks, and the 52-page production build
  passed. Local guide smoke evals passed 14/14 before and after (deterministic
  local-answer mode; these are regression checks, not evidence for the method's
  effectiveness).
- Browser checks covered PRD review → approved build, the recurring context cue,
  fresh-session refinement, four updated audience responsibilities, shared
  navigation, and a saved workspace draft surviving reload. Synthetic test
  entries were then removed, restoring the original blank draft.
- Desktop at 1280px and phones at 390px and 320px rendered without horizontal
  page overflow. The final production preview logged no browser console errors.
- The overview, AI building guide, workspace, and both revised download files
  returned HTTP 200 through `192.168.4.26:3001`.
- Screenshots: `output/product-system-review/persistent-context-desktop.png`
  and `output/product-system-review/persistent-context-phone.png`.

The updated build is served locally on port 3001; it has not been published.

## Boundaries to preserve

Ideas are unclassified opportunities or solutions, not a mandatory first stage.
An opportunity can persist through multiple solutions. Lifecycle states describe
individual items; Build and Test are activities. A POC can be in Discovery or
Ready for Delivery depending on its purpose. An MVP is built in Delivery and
moves into Impact once used. New evidence can reopen Discovery.

Product context lives in or alongside the repo. PMs maintain intent; developers
challenge and refine it as implementation reveals constraints. AI assists across
the loop, while people remain accountable for decisions and evidence.

## Imagery

Both assets were generated with the built-in image generation tool, then
encoded as optimized WebP files with Sharp. Original generated files remain in
Codex's generated-images directory. Diagrams use HTML so their text stays
accessible and their meaning is independent of the illustrative photography.

### Hero

Saved asset: `public/images/product-system/iterative-paper-study.webp`

Final prompt:

> Use case: photorealistic-natural. Asset type: refined editorial hero photograph for Daniel Nash's Product Operating System, a portfolio and educational field guide about turning unstructured ideas into coherent products through repeated learning. Primary request: a meticulously art-directed, photorealistic studio still life of an architect's iterative paper study. Wide landscape 3:2 composition. On a deep almost-black pine teal tabletop, several beautifully crafted ivory paper ribbons evolve from loose exploratory curls into one elegant open circular helix and a precisely aligned architectural paper structure. A single thin warm terracotta thread gently traces a path through the forms. Tangible thick paper edges, tiny real imperfections, sculptural shadows, precise physical construction, restrained editorial craft. Main sculptural composition occupies the right 60 percent; left third is calm dark teal negative space for a website title added separately. Soft directional late-afternoon studio light from upper right, atmospheric shadows, warm cream highlights, rich tonal depth, quiet confidence. Large scale objects, low camera angle, medium-format photography, refined architectural magazine quality. No people, no screens, no text, no letters, no logos, no UI, no boxes, no split panels, no charts, no sparkles. This is a real-looking physical studio study, not a synthetic glowing technology render.

### Shared understanding

Saved asset: `public/images/product-system/shared-understanding.webp`

Final prompt:

> Use case: photorealistic-natural. Asset type: companion editorial photograph for a warm cream and deep pine-teal product development field guide. Primary request: a refined architectural studio still life showing shared context and collective iteration without people. An overhead oblique close photograph of a cream paper model of a simple open circular pavilion being studied on a warm ivory worktable: on the table are three alternative folded paper studies, a precise translucent tracing-paper plan, a plain closed deep pine-green notebook, and a single fine terracotta cord connecting the work. The coherent pavilion model is the focal point. Sparse arrangement, generous negative space, museum-quality editorial composition, real tactile paper and wood grain, afternoon window light, long soft shadows, sophisticated architectural photography. Wide landscape 3:2. Palette only warm ivory, tan, deep pine teal and tiny terracotta accent. No readable text anywhere, no letters, no labels, no hands, no people, no computer screens, no UI panels, no logos, no watermark. The image communicates that many small studies inform one shared understanding. Grounded in real materials, not a futuristic render.

## Validation, September 29, 2026

- TypeScript, ESLint, `git diff --check`, and the production build passed.
- Local `gpt-oss:20b` guide smoke evals: 14/14 passed before and after.
- All nine routes returned 200; an unknown chapter returned 404.
- All four Markdown download targets returned 200 with their template content.
- Browser checks covered all six audience roles plus Everyone, retained role
  query parameters through navigation, mobile layout for all nine pages,
  and keyboard selection in both the development loop and lifecycle controls.
- Generated images total approximately 284 KB as WebP assets.

This is a local implementation; it has not been published to production.

- Final production-preview checks also covered 320px and 1024px layouts,
  role selection across navigation/reload/back, and no new browser console errors.
  Screenshots are in `output/product-system-review/`.

## Visual learning update

The follow-up replaces long default explanations with interactive examples:

- Opportunity–solution tree: select any node and change its state independently.
  Solutions offer Parking Lot, Discovery, Ready for Delivery, Delivery, Impact,
  and Done. Opportunities use the separate lifecycle recommended in the source
  chat: Parking Lot, Discovery, Validated, Prioritized, Addressed, and Monitor.
  Each state has a type-specific explanation, and either type can return to
  Discovery. Delivery stays attached to solutions. Reset restores the
  illustrative example. These sandbox changes are not saved or sent anywhere.
- Development loop: Imagine, Define, Build, Test, and Refine each open a visual
  example. The overview now provides a shorter introduction (see below).
- Brainstorm: a finite, controllable Gather → Connect → Classify sequence.
- PRD: a scripted context → draft → human review → revision animation with
  typewriter text. It makes no AI requests and never presents example content
  as a real generated deliverable. Reduced-motion users can show the result
  immediately or choose any step.
- Evidence explorer: select feasibility, usability, or value to see the suitable
  artifact, method, and limits of the claim.
- Playbook: select Capture, Define, Learn, or Carry forward to preview and
  download the appropriate existing Markdown template.

The explanatory body text across 29 sections was reduced from roughly 1,150
words to 618 words. Field notes expand on demand; chapter role reminders are
compact. Longer role guidance remains on the overview and Working Together.

Browser checks covered independent node changes, opportunity state choices,
reset, playback completion, pause stability, manual steps, all five loop
activities, every download target, and keyboard-operated field notes. All eight
chapters fit at 320px, 768px, and 1280px without horizontal page overflow.

## Overview comprehension pass

The first visit now leads with what the method does: help product teams decide
what to build and learn as they go. The page order is promise → compact visual
loop → role-specific next step → optional full chapter index → starter templates.

`SystemOverview.tsx` provides an approximately 100-word default walkthrough.
All five activities are visible together, with a selectable illustrative example
and a relevant chapter link. It explicitly allows revisiting activities, and
keeps shared repo context and individual lifecycle states visible. The larger
interactive labs remain in their chapters. The full chapter index expands on
demand instead of presenting eight choices before the method is explained.

The overview's role selector offers one recommended entry point with a concrete
reason to open it. Chapter role guidance and the Working Together page retain
their existing behavior. No portfolio-guide prompts, grounding, page metadata,
or evidence claims changed in this pass.

The 30-second label is a reading target, not a measured user-research result.
A first-time reader should be able to explain what this is, why it helps their
team, and where to go next. Actual comprehension and interest require feedback
from first-time readers; browser checks establish layout and interaction only.

Validation: production build (including lint and types) and diff checks passed.
Browser checks covered all five example states, all seven audience options,
role retention into the recommended chapter, expansion of all eight chapter
links, and 320/390/768/1280px layouts. The primary hero action fits within the
tested first viewports. The production preview reported no console errors.
Visual proof: `output/product-system-review/overview-30-second.png`.

## Section color and imagery pass

Full-width pine sections separate interactive labs and role guidance from cream
reading sections. Warm clay marks exercises and the final overview action,
using the homepage's existing pine and ochre palette. The concise overview stays
ahead of the new discovery image, preserving the short first-read path.

Three new editorial illustrations show discovery, shared product context, and
prototype testing. They are clearly labeled as AI-generated; the case-study
chapter instead uses an existing actual Gravity app capture. Topic-based chapter
images replace the repeated abstract studio treatment. The existing overview
hero remains intact.

The built-in image generation tool produced the three illustrations, saved as
WebP assets in `public/images/product-system/` (approximately 361 KB combined).
Exact prompts and filenames are in `product-system-image-prompts.md`.

Browser layout checks passed for all nine routes at 320px and 1280px. Reviewed
role-section contrast, image loading, and the PRD and development-loop controls.

## Interactive local playbook

The Playbook now opens a working form instead of a template preview. Capture,
Define, Learn, and Carry forward can be visited in any order with no required
fields. The tree, product definition, and repository context reflect the same
local draft. Every node starts empty, including its lifecycle state; no
opportunity, solution, connection, evidence, or readiness is inferred from an
idea. Opportunity and solution states use their separate existing vocabularies.

Users can edit, connect, add, and remove nodes directly. Removing an opportunity
preserves its solutions with an open connection. Clear/remove actions offer undo
until the next edit. The learning step opens the definition; Carry forward opens
repo context. Markdown exports include entered text and explicitly open sections.
Blank downloads remain in a secondary disclosure and also mark fields optional.

Persistence uses a versioned localStorage draft on the current browser origin.
It does not sync across devices, browsers, or localhost versus the LAN URL.
Storage failures are surfaced with an instruction to download before leaving;
a malformed saved draft is not silently overwritten. Fields are bounded to
2,400 characters and the tree to eight opportunities and eight solutions.
Manual editing and document updates make no model requests. The optional AI
helper below sends only its disclosed context after an explicit visitor action.

Validation for this pass:

- Five model tests cover blank drafts, independent node types, restore
  validation, invalid data, and exports that retain uncertainty.
- Browser checks confirm unrestricted steps, direct edits/connections,
  independent lifecycle states, automatic document updates, reload persistence,
  preservation of solutions on opportunity removal, and clear/remove undo.
- The draft fits 320, 390, 768, and 1280px widths without horizontal overflow.
- Exported Markdown URLs match the visible document. The in-app browser download
  completion event timed out, so final file transfer remains unverified here.
- Typecheck and lint pass. Guide smoke evals scored 13/14 before and after,
  with different checkout grounding failures: `checkout-multiturn-current-page-primary`
  before and `checkout-mentions-mcp` after. These guide failures remain unresolved;
  no guide prompt or grounding code was changed in this pass.
- Optimized production build passes (52 pages). The production preview responds
  with HTTP 200 on the LAN address, binds all interfaces on port 3001, and
  restores the saved draft without browser console errors.
- Visual proof: `output/product-system-review/interactive-workspace.png` uses
  synthetic sample content entered through the form, not AI-generated output.

## Optional AI suggestions

The site owner authorized reusing the existing server-side OpenAI key. No key
was created, moved, or exposed to client code. The playbook's "Suggest from my
notes" action posts to `/api/product-workspace/suggest` only when clicked. The
disclosure lists exactly what is shared: idea, audience, outcome, intended
experience, open questions, and existing tree titles. Evidence, repo location,
and agent notes are excluded.

The fixed model is `gpt-5.4-nano-2026-03-17` with low reasoning, a 1,600-token
output ceiling, no automatic retries or tools, `store: false`, and a 20-second
provider timeout. Context is limited to 6,000 characters. The original local
preview used process-local quotas. Hosted requests now use the shared durable
limits documented above; development retains the local limiter. Drafts and
provider errors are not logged by this route. OpenAI's service-level data
policies still apply.

The [model card](https://developers.openai.com/api/docs/models/gpt-5.4-nano)
supports this small classification/extraction use case. Published
[standard token prices](https://developers.openai.com/api/docs/pricing) checked
2026-09-29 were $0.20 per million input tokens and $1.25 per million output
tokens. For example, 1,500 input plus 500 output tokens is about $0.000925;
actual cost depends on usage, including reasoning tokens.

Suggestions classify exact excerpts rather than writing new facts. The server
and client both verify each quote against the submitted source and each
suggestion against that quote. Unverifiable text is dropped. Opportunities,
solutions, audience, and outcomes may independently remain null. A suggested
connection additionally needs a quote supporting both nodes; absent that,
the connection remains open for manual editing. This lexical validation does
not establish semantic truth: visitors review each classification before use.

Checkboxes let visitors choose suggestions. Apply fills only empty fields or
nodes, preserves lifecycle states and existing links, and supports undo. The
definition updates from the same local draft. Any draft edit cancels an active
request and discards a prior review; a second snapshot check prevents stale
results from applying. Errors leave local work intact.

`npm run test:product-workspace` tests source filtering, grounding, stale
snapshots, selective application, preserved state, payload bounds, API origin
checks, and request limits alongside the local draft tests. The explicit paid
runner `npm run eval:product-workspace:live` uses six synthetic cases: vague
ideas, solutions without needs, needs without solutions, an explicit pair,
uncertainty, and instructions embedded in input. The final run passed 6/6;
report: `artifacts/product-workspace-evals/2026-09-30T02-08-28.994Z.json`.

Final validation: all 13 workspace tests and the optimized production build
(including types/lint) pass. The subsequent guide smoke run passed 14/14:
`artifacts/portfolio-guide-evals/2026-09-30T02-11-32-623Z-local-answer-no-judge-gpt-oss-20b`.
Browser checks covered solution-only suggestions, empty nodes for vague input,
selective application, undo, cancelled/stale requests, and 320/390/768/1280px
layouts. Production requests through the LAN address were verified end to end.
An exact Origin/HTTP Host check handles Next's internal bind-address rewrite
without accepting unrelated origins; this is covered by a regression test.
Visual proof: `output/product-system-review/ai-suggestion-review.png`.

## Teach from the first screen

The overview and direct Ideas & Strategy entry now open with raw incoming notes
instead of an abstract hero or a completed tree. Three illustrative inputs show
what intake can look like: a feature request, an onboarding frustration, and a
support observation. Selecting a note immediately shows the supported
opportunity or solution and leaves missing context explicitly open.

A visitor can unfold one continuous example: ask a clarifying question → shape
an opportunity with alternative solutions → write a small shared definition and
test → use hypothetical feedback to refine. Each action reveals the next section
in place and focuses its heading. Earlier sections remain visible. Reveal and
scroll motion respect reduced-motion preferences. The example is scripted and
clearly labeled; it makes no model calls or claims of observed results.

"Try my own idea" opens the existing local workspace inline at any point.
It loads the same saved draft as the standalone Playbook, without copying the
example into it. The heavy workspace bundle loads on demand. A direct
`#your-idea` link also opens it. Optional fields, open tree nodes, AI review,
exports, and the separate opportunity/solution lifecycles retain their behavior.

Chapter navigation is now Follow an idea / Your workspace / a collapsible Field
guide. Detailed pages remain available as optional references, with related
field notes replacing the suggestion of a required sequential reading course.
Role selection and shareable role links remain available.

Browser checks covered all three intake types, the complete keyboard-operated
inline sequence, heading focus, role retention into Ideas & Strategy, the field
guide menu and its closure after navigation, shared draft restoration, and
isolation between example changes and the saved draft. The complete unfolded
story and embedded workspace fit 320, 390, 768, and 1280px widths without
horizontal overflow or duplicate IDs. No fields are required. The synthetic
validation draft was cleared afterward. All 13 workspace tests pass.

This makes the first learning moment visible immediately; actual comprehension
speed still needs feedback from first-time visitors. No portfolio-guide prompt,
grounding, page metadata, related-page logic, or AI suggestion behavior changed.

The optimized production build (including lint and types) and diff check pass.
The production preview serves both entry routes over the LAN on port 3001.
Production browser verification also passed the direct workspace anchor,
role restoration, and inline discovery reveal without console errors.
Visual proof: `output/product-system-review/learn-by-doing-overview.png` and
`output/product-system-review/learn-by-doing-phone.png`.

## Conversation-to-MVP replay

The main overview and Development Loop entry now demonstrate the build cycle in
one chat-style walkthrough. Each selected step plays automatically when visible,
then waits for the visitor to continue: brainstorm → request a PRD → review and
revise → approve and authorize the build → let the coding agent implement the
first MVP → try it → refine. The explicit approval prompt waits in the composer
until the visitor continues into Build MVP, before any depicted implementation.

The story uses Gravity's documented development as a concrete example. Sources:
`app/creative/gravity/page.tsx` (brainstorm, PRD, design, MVP, visual refinement)
and `/Users/danielnash/Documents/Gravity/docs/PRD.md` (experience, musical
independence, listener perspective, scope, and acceptance criteria). Dialogue in
`content/product-build-demo.ts` is a condensed reenactment, not recovered or
verbatim chat history. Existing Gravity screenshots are labeled as actual app
captures including later refinements; they are not presented as exact captures
of the first build. The live-product link and actual process story offer deeper
inspection.

The adjacent output changes from idea/scope notes to a draft PRD, highlighted
review changes, approval, an illustrative build checklist, and a product
preview. Audience/cello controls compare real screenshots. Build tasks and
checks are scripted teaching content, not live tool execution or new claims of
validation. Playback makes no model calls, builds, or changes to saved drafts.

The input-style bar starts typing the next prompt as soon as the last message
in the step finishes typing, with no additional reading delay. For an already
visible user message, it starts immediately. It then becomes a Continue button: activating it sends that prompt into the chat
and automatically runs the next step. There are no play, pause, speed, restart,
or next-message controls. The six stage buttons remain shortcuts and restart
the chosen step. The final composer opens the visitor’s own local workspace.

The conversation scrolls internally without moving the page. Reading earlier
messages stops automatic scrolling while the current step continues. Offscreen
and hidden-tab animation is suspended; opening the full transcript also holds
it until closed. Reduced-motion visitors see the selected step and next prompt
immediately, with the same Continue action. Detailed activity labs remain in an
optional disclosure on Development Loop; Ideas & Strategy retains the earlier
raw-note classification example.

Initial replay validation: verified automatic completion, PRD draft/revision/approval states,
approval before implementation, manual stage selection, actual screenshot
switching, and the workspace handoff. Player layouts fit 320, 390, 768, and
1280px widths without horizontal overflow or duplicate IDs.

Final production build, TypeScript, lint, formatting, and diff checks pass.
Overview, Ideas & Strategy, and Development Loop return HTTP 200 over the LAN.
The original continuous replay and its pause control were verified;
no browser console errors were reported. Role context and the inline local
workspace remain intact. Screenshots: `output/product-system-review/chat-build-cycle.png`
and `output/product-system-review/chat-build-cycle-phone.png`.

Step-by-step follow-up validation: walked all six steps using the bottom composer,
verified each stops before the next prompt is sent, and confirmed the approval
message only enters the chat after Continue to Build MVP. Stage navigation starts
the selected step automatically. The final composer opens the existing optional
workspace and focuses its heading. Desktop, 390px, and 320px browser checks passed;
the composer keeps a stable width as its prompt types. TypeScript, lint, formatting,
diff checks, and the 52-page production build pass. The optimized server remains
available over the LAN on port 3001. Production verification confirmed the Review
step waits with its complete approval prompt, with no playback controls.
Visual proof: `output/product-system-review/step-continue-desktop.png`.

## Navigation consolidation

Removed the overview's second field-guide index, role-specific reading paths,
chapter pagination, repeated workspace invitations, and repeated chat players.
Role guidance has one shared location. Field-note exercises now sit with the
notes instead of becoming another workspace CTA. The Workspace page contains
only the live draft; its export controls are grouped in one place.

Validation: all nine routes share exactly one Product System navigation. The
seven reference pages contain neither a chat replay nor an editable workspace.
Browser checks covered menu navigation and dismissal, role retention, legacy
workspace and perspective links, demo progress restoration, workspace step and
view restoration, saved draft restoration, and the final demo-to-workspace
handoff. A temporary test idea was restored to its original blank value. All
fields remain optional. Narrow 320px and 390px layouts fit without horizontal
overflow or duplicate IDs. TypeScript, ESLint, and all 13 workspace tests pass;
the local portfolio-guide smoke eval passes all 14 cases. No guide prompts or
model context changed.

The final 52-page production build passes. All nine Product System routes return
HTTP 200 on the local LAN server. Production browser checks confirm the shared
navigation, a single workspace, preserved demo progress, optional fields, and no
new console errors. Proof images: `unified-watch.png`, `unified-workspace.png`,
and `unified-navigation-phone.png` in `output/product-system-review/`.

## Production release validation — October 8, 2026

Integrated onto the currently live portfolio version, preserving its Next.js 16,
React 19, analytics, and feedback changes. Chapter routes await Next.js params;
journey position updates remain inside the shared provider.

The final build generates 54 pages. The offline regression suite passes 213 tests
with four opt-in integration cases skipped. All six dedicated limiter checks pass
against the development database, including concurrent requests across independent
clients: 8 per client and 40 globally per 10 minutes. Guide smoke evals pass 14/14.
TypeScript and lint pass (existing framework advisory warnings remain). Built-site
checks cover all nine Product System routes, four Markdown templates, existing work
and case-study routes, and resume downloads. Browser navigation preserves demo and
workspace position across routes.
