# quick-transcript — Master Plan

## Elevator Pitch

Drop an audio file. Get a clean, copyable transcript in under a minute. No clutter. No history. Just text.

---

## Problem & Mission

- Voice memos and audio recordings pile up fast.
- Copying text out of transcription tools is always one step too many.
- **Mission:** Make audio-to-text feel instant — like pasting text, not running a job.

---

## Target Audience

- Primary: Personal use — someone who records voice memos and receives audio files daily.
- Secondary: Small teams who share voice notes and need quick written versions.
- Context: User keeps the app open as a pinned browser tab.

---

## Core Features (MVP)

- **Auth** — Google OAuth or email magic link. Gate access. Nothing else.
- **Audio drop** — Drag-and-drop or file picker. Accepts mp3, m4a, wav.
- **Transcription** — AssemblyAI processes the file. Returns in ~15–60 seconds.
- **Copy transcript** — One button. Copies everything to clipboard.
- **Settings (inline)** — Two toggles: paragraph breaks and timestamps.
- **Ephemeral** — Nothing stored. Page resets when you start over.

---

## High-Level Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Vercel-native, API routes built in |
| Hosting | Vercel free tier | Zero config deploy, instant CDN |
| Auth | Supabase Auth | Google OAuth + email, free tier, easy setup |
| Transcription | AssemblyAI | Native paragraphs + timestamps, 100hr free tier |
| Styling | Tailwind CSS | Fast to build, no design system overhead |

---

## Conceptual Data Model

No persistent data. The app has no database writes.

- **Session** — Supabase cookie-based auth. Kept in browser only.
- **Audio file** — Lives in memory during upload. Forwarded to AssemblyAI. Never stored locally.
- **Transcript** — Returned from AssemblyAI. Lives in React state. Gone on page refresh.

---

## UI Design Principles

- One thing on screen at a time — upload state, loading state, or result state.
- No navigation. No sidebar. No dashboard.
- Transcript area looks like a document, not a data table.
- Copy button is always visible and obvious.
- Settings are present but not in the way.

---

## Security Considerations

- AssemblyAI API key is server-side only (never exposed to the browser).
- Auth gates the transcription endpoint — unauthenticated requests are rejected.
- Audio files are not stored — they are streamed to AssemblyAI and discarded.
- Supabase handles all credential management.

---

## Phased Roadmap

### MVP
- Auth (Google + email)
- File drop + transcription
- Paragraph + timestamp toggles
- Copy button
- Vercel deploy

### V1
- Keyboard shortcut to copy (Cmd+C after result)
- File name shown during processing
- Better error messages (file too large, unsupported format, API timeout)
- Mobile-friendly layout

### V2
- Optional: transcript history (opt-in, stored in Supabase)
- Speaker labels toggle (AssemblyAI diarization)
- Export as .txt or .md download

---

## Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Large files time out | 3-minute polling cap with clear error message |
| AssemblyAI API down | Show friendly error, suggest retry |
| Free tier exhausted | Show cost estimate in settings, link to AssemblyAI billing |
| Auth friction discourages use | Magic link email is fast — no password needed |

---

## Future Ideas

- Browser extension for transcribing audio directly from any tab
- Webhook endpoint for receiving audio from Zapier / Make
- Summarization toggle (one-sentence summary above transcript)
- Slack integration — paste transcript directly to a channel
