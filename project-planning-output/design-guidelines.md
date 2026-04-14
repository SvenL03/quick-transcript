# quick-transcript — Design Guidelines

## Emotional Tone

**Fast, quiet, and trustworthy** — like a tool that's already done its job before you notice it working.

---

## Core Principle

The UI should disappear when the transcript arrives. Everything exists to serve the text.

---

## Typography

| Role | Style | Size |
|---|---|---|
| App name | Semibold, tracking-tight | 18px |
| Body / transcript text | Regular, leading-relaxed | 16px |
| Timestamps | Monospace, muted color | 13px |
| Labels / toggles | Medium | 14px |
| Error / hint text | Regular, muted | 13px |

- **Font family:** System font stack (`font-sans`) — no custom fonts. Fast and familiar.
- **Transcript font:** `font-mono` or `font-sans` — keep readable at any length.
- **Line height:** 1.6–1.75 for transcript text. Breathing room matters.

---

## Color System

Neutral palette. One accent. High contrast for text.

| Token | Hex | Usage |
|---|---|---|
| Background | `#FAFAFA` | Page background |
| Surface | `#FFFFFF` | Cards, transcript area |
| Border | `#E5E7EB` | Dividers, dropzone outline |
| Text primary | `#111827` | All body text |
| Text muted | `#6B7280` | Timestamps, labels, hints |
| Accent | `#2563EB` | Buttons, active toggles, links |
| Accent hover | `#1D4ED8` | Button hover state |
| Success | `#16A34A` | Copy confirmation ("Copied!") |
| Error | `#DC2626` | Error messages |
| Dropzone hover | `#EFF6FF` | Blue tint when dragging over |

Dark mode: not in MVP. Add later if needed.

---

## Spacing System (8pt Grid)

| Token | Value | Usage |
|---|---|---|
| xs | 4px | Icon gaps, tight spacing |
| sm | 8px | Between toggle label and input |
| md | 16px | Component internal padding |
| lg | 24px | Between sections |
| xl | 32px | Page-level padding |
| 2xl | 48px | Top/bottom page margin |

---

## Layout

- Max content width: `640px` — centered, no wider.
- Single column always. No sidebars. No nav.
- Vertically centered on desktop when in upload state.
- Transcript fills the full content width.

---

## Component Patterns

### Dropzone
- Dashed border, rounded corners (`rounded-xl`)
- Hover/drag state: light blue fill, solid border
- Icon: upload arrow, centered
- Text: "Drop audio here" / "Click to select"
- Active file: show filename + size, with a clear (×) button

### Toggle
- Pill-style switch (Tailwind `toggle` or custom)
- Label on the left, toggle on the right
- No icon — label text is enough

### Transcribe Button
- Full width in upload state
- Solid accent color
- Text: "Transcribe"
- Disabled when no file selected

### Copy Button
- Top-right of transcript area
- Outline style (not filled) — secondary action
- Text: "Copy" → changes to "Copied ✓" for 2s after click

### Loading State
- Simple spinner (CSS, no library)
- Text below: "Transcribing…" — no time estimate

### Error State
- Red border on the relevant area
- One-line human message: "Transcription failed — please try again."
- Retry button

---

## Motion & Interaction

- **No animations for animations' sake.** Only functional motion.
- Transcript fades in (`opacity-0 → opacity-100`, 200ms) when result arrives.
- Copy confirmation ("Copied!") fades out after 2s.
- Loading spinner: simple CSS rotate, no bounce.
- No page transitions — states change in place.

---

## Voice & Tone

**Short. Direct. Human.**

| Situation | Copy |
|---|---|
| Dropzone | "Drop audio here, or click to browse" |
| File selected | "Ready to transcribe" |
| Processing | "Transcribing…" |
| Success | (nothing — just show the transcript) |
| Copy success | "Copied" |
| Error (generic) | "Something went wrong. Try again." |
| Error (file size) | "File is too large. Try under 500MB." |
| Error (format) | "Unsupported format. Use mp3, m4a, or wav." |

Never: "Processing your audio file through our transcription pipeline…"
Always: "Transcribing…"

---

## System Consistency Rules

- Every interactive element has a visible hover state.
- Focus rings are visible (accessibility — never `outline: none` without a replacement).
- Disabled states are visually distinct (50% opacity minimum).
- Error messages appear inline near the source, not in a toast.
- One primary action per state — never two competing CTAs.

---

## Accessibility

- All form inputs have associated labels.
- Dropzone is keyboard accessible (Enter/Space to open file picker).
- Color contrast ratio ≥ 4.5:1 for all text.
- Copy button announces "Copied to clipboard" to screen readers via `aria-live`.
- Spinner has `aria-label="Transcribing audio"` and `role="status"`.
