# Resume Generator Local Testing

Run the two services on separate local ports so the browser only talks to the
portfolio and the portfolio proxies server-to-server to ResumeCustomizer.

## 1. Start ResumeCustomizer on port 3001

From `/Users/danielnash/Code/DanielNash/ResumeCustomizer`:

```bash
cat >> .env.local <<'EOF'
RESUME_CUSTOMIZER_API_TOKEN=dev-token
RESUME_GENERATOR_ENGINE=stub
# Optional for the real hosted workflow:
# OPENAI_API_KEY=sk-...
EOF

npm run dev:ui -- -p 3001
```

Use `RESUME_GENERATOR_ENGINE=stub` for local contract testing without OpenAI.
Use `RESUME_GENERATOR_ENGINE=real` plus `OPENAI_API_KEY` to run the hosted
non-Codex workflow.

## 2. Start portfolio on port 3000

From `/Users/danielnash/Code/DanielNash/Portfolio/portfolio`:

```bash
cat >> .env.local <<'EOF'
RESUME_CUSTOMIZER_API_BASE_URL=http://127.0.0.1:3001
RESUME_CUSTOMIZER_API_TOKEN=dev-token
# Optional only for local portfolio-only UI checks when ResumeCustomizer is not running:
# RESUME_GENERATOR_ENABLE_MOCK=true

RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL="Portfolio <resume@yourdomain.com>"
CONTACT_TO_EMAIL=daniel@example.com
SITE_BASE_URL=http://localhost:3000
EOF

npm run dev
```

`RESUME_CUSTOMIZER_API_TOKEN` is server-side in both apps. It must never be
referenced from browser code or `NEXT_PUBLIC_*` env vars. In production,
portfolio requires `RESUME_CUSTOMIZER_API_BASE_URL` and
`RESUME_CUSTOMIZER_API_TOKEN`; it will not fall back to mock generation.

## Manual checklist

1. Open `http://localhost:3000/resume/generate`.
2. Paste a JD and choose `Download here`; generate, wait for `Ready`, and
   download the PDF.
3. Paste a JD and choose `Email me when ready`; confirm the PDF still downloads
   and the email sends after the job reaches `Ready`.
4. Repeat email delivery with `Include Daniel on the email thread` unchecked;
   verify Daniel is not CC'd and the email body includes `/contact` and
   `mailto:` contact links.
5. Repeat email delivery with `Include Daniel on the email thread` checked;
   verify `CONTACT_TO_EMAIL` is CC'd.
6. Stop ResumeCustomizer and submit another JD; portfolio should show a
   retryable service-unavailable error.
7. Confirm browser devtools only show calls to `/api/resume-generator/*`, never
   `http://127.0.0.1:3001` or `/api/v1/*`.
8. Unset `RESUME_CUSTOMIZER_API_BASE_URL` or `RESUME_CUSTOMIZER_API_TOKEN` and
   confirm portfolio returns a service-unavailable error instead of a mock PDF.

## Verifying mock vs real output

Any non-production mock/stub output is labeled in several places, all driven by
server/result metadata (never by user input or a query param):

1. **UI** — the Ready panel shows an amber banner reading
   `Mock / Test Output — Not for External Use`.
2. **Result metadata** — the public status envelope's `result.mock` is `true`
   and `result.fitSummary` is prefixed with the label. Check directly with:
   ```bash
   curl -s http://localhost:3000/api/resume-generator/jobs/<jobId> | jq '.result.mock, .result.fitSummary'
   ```
3. **PDF + email** — the downloaded PDF's first line carries the label, and if
   the resume is emailed the subject is prefixed
   `[Mock / Test Output — Not for External Use]` and the body opens with the same
   banner.

A real result has `result.mock === false`, no banner, and no label anywhere.
Because the mock flag is derived from the engine that ran the job, production
(which forbids the mock/stub engine) can only ever produce `mock: false` real
output — there is no silent fallback to mock.

## What happens if real mode is misconfigured

- **Portfolio** missing `RESUME_CUSTOMIZER_API_BASE_URL` or
  `RESUME_CUSTOMIZER_API_TOKEN` (and not in explicit local mock mode): the public
  API returns `503 { error.code: "unavailable" }` instead of a mock PDF.
- **ResumeCustomizer** real engine missing `OPENAI_API_KEY`: `POST
  /api/v1/resume-jobs` returns `503 unavailable` rather than creating a stub job.
- In **production** (`NODE_ENV=production`) the mock/stub engines are disabled
  even if `RESUME_GENERATOR_ENABLE_MOCK` / `RESUME_GENERATOR_ALLOW_STUB` are set.

## Useful commands

Portfolio:

```bash
npm run typecheck
npm run build
npx tsx --test __tests__/resume-generator.test.ts
```

ResumeCustomizer:

```bash
npm run typecheck
npm run build:ui
npx tsx --test tests/hosted-resume-jobs.test.ts
```
