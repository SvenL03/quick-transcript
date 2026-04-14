# quick-transcript — Implementation Plan

## Build Sequence

Small steps. Each step is shippable or testable in isolation.

---

## Phase 1 — Project Scaffold (Day 1)

- [ ] `npx create-next-app@latest quick-transcript --typescript --tailwind --app`
- [ ] Install dependencies: `@supabase/ssr`, `@supabase/supabase-js`, `assemblyai`
- [ ] Create `.env.local` with placeholder keys
- [ ] Push to GitHub repo
- [ ] Connect repo to Vercel project (deploy empty shell)

**Checkpoint:** Blank Next.js app live on Vercel URL.

---

## Phase 2 — Auth (Day 1–2)

- [ ] Create Supabase project
- [ ] Enable Google OAuth provider in Supabase dashboard
- [ ] Enable email magic link in Supabase dashboard
- [ ] Add `lib/supabase-client.ts` (browser client)
- [ ] Add `lib/supabase-server.ts` (server client using `@supabase/ssr`)
- [ ] Add `middleware.ts` — redirect `/transcribe` to `/login` if no session
- [ ] Build `/login` page — "Continue with Google" button + email input
- [ ] Handle auth callback route (`/auth/callback`)
- [ ] Test: unauthenticated visit to `/transcribe` → redirected to `/login`
- [ ] Test: sign in with Google → lands on `/transcribe`

**Checkpoint:** Auth working end-to-end in local dev.

---

## Phase 3 — File Drop UI (Day 2)

- [ ] Build `AudioDropzone` component
  - Accepts drag-and-drop
  - Accepts click-to-browse (file input, accept `.mp3,.m4a,.wav`)
  - Shows selected filename and file size
  - Clear/reset button
- [ ] Build `TranscriptSettings` component
  - Toggle: Paragraph breaks (default ON)
  - Toggle: Timestamps (default ON)
- [ ] Wire both into `/transcribe` page
- [ ] Test: file selection, drag-and-drop, settings toggles

**Checkpoint:** Upload UI is functional — no backend yet.

---

## Phase 4 — Transcription API (Day 2–3)

- [ ] Create `app/api/transcribe/route.ts`
  - Accept `multipart/form-data` (audio file + settings)
  - Verify session (reject unauthenticated requests)
  - Upload audio to AssemblyAI upload endpoint
  - Request transcription (`punctuate: true`, `format_text: true`)
  - Poll every 3s until `status === "completed"` or `"error"`
  - If paragraphs setting: fetch `/v2/transcript/{id}/paragraphs`
  - Return `{ text, paragraphs }` JSON
- [ ] Test with Postman or curl before wiring to UI

**Checkpoint:** API route returns transcript JSON for a test audio file.

---

## Phase 5 — Transcript UI (Day 3)

- [ ] Build `TranscriptView` component
  - Renders paragraphs with optional `[M:SS]` timestamps
  - Falls back to single text block if paragraphs off
  - "Copy all" button (uses `navigator.clipboard.writeText`)
  - "Transcribe another" / reset button
- [ ] Wire loading state — spinner with "Transcribing…" message
- [ ] Wire error state — friendly message + retry option
- [ ] Test full flow: drop file → loading → transcript → copy

**Checkpoint:** Full happy path works locally.

---

## Phase 6 — Polish & Deploy (Day 3–4)

- [ ] Mobile layout check — ensure usable on phone
- [ ] Error handling: file too large, unsupported format, API timeout
- [ ] Add Vercel environment variables (Supabase + AssemblyAI keys)
- [ ] Test full flow on Vercel production URL
- [ ] Add `NEXT_PUBLIC_SITE_URL` for Supabase auth redirect

**Checkpoint:** App fully working on production Vercel URL.

---

## Timeline

| Day | Focus |
|---|---|
| Day 1 | Scaffold + Auth |
| Day 2 | Drop UI + API route |
| Day 3 | Transcript UI + full flow |
| Day 4 | Polish, error handling, production deploy |

---

## Team

- Solo build — one developer
- No design handoff needed — Tailwind handles styling inline

---

## Recommended Rituals

- **Test with real audio** — Use an actual voice memo at each phase, not a synthetic test file.
- **Test on mobile** — After Phase 5, test the full flow on a phone browser.
- **Check AssemblyAI dashboard** — Confirm transcripts are appearing in their console after first successful call.

---

## Optional Integrations (V1+)

- Vercel Analytics — understand usage without storing transcripts
- Sentry — catch API errors in production silently
- Resend — for email magic link customization (optional Supabase replacement)
