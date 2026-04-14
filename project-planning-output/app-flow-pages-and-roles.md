# quick-transcript — App Flow, Pages & Roles

## Site Map

```
/                   → Redirect (auth check)
/login              → Sign in
/auth/callback      → Supabase auth handler (no UI)
/transcribe         → Main app (protected)
```

Four routes. That's it.

---

## Page Purposes

| Route | Purpose |
|---|---|
| `/` | Checks auth. Redirects to `/transcribe` if logged in, `/login` if not. |
| `/login` | Single sign-in page. Google OAuth button + email magic link input. |
| `/auth/callback` | Supabase handles the OAuth/magic-link redirect. No visible UI. |
| `/transcribe` | Everything happens here. Drop file → transcribe → copy result. |

---

## User Roles

There is one role: **authenticated user**.

- No admin panel.
- No user management.
- No tiers.
- Access = you have a valid Supabase session.

---

## Auth Flow

```
Visit any URL
     ↓
Middleware checks session
     ↓
No session → /login
     ↓
Sign in (Google or email)
     ↓
/auth/callback (Supabase sets cookie)
     ↓
Redirect → /transcribe
```

---

## Primary User Journey: Transcribe a File

**3 steps.**

```
1. Drop or select an audio file
        ↓
2. (Optional) adjust settings, then click Transcribe
        ↓
3. Copy the transcript
```

That's the whole product.

---

## Secondary Journey: Sign In (First Time)

```
1. Visit /transcribe (or /)
        ↓
2. Redirected to /login
        ↓
3a. Click "Continue with Google" → OAuth flow → back to /transcribe
        OR
3b. Enter email → receive magic link → click link → /transcribe
```

---

## Secondary Journey: Transcribe Another File

```
From result state:
1. Click "Transcribe another"
        ↓
2. Page resets to upload state (no reload)
        ↓
3. Drop new file
```

---

## State Machine: /transcribe page

```
[UPLOAD]
  File selected + Transcribe clicked
        ↓
[LOADING]
  AssemblyAI processing
        ↓ (success)            ↓ (error)
[RESULT]                  [ERROR]
  Transcript shown           Error message shown
  Copy button active         Retry button shown
        ↓                          ↓
  "Transcribe another"       Back to [UPLOAD]
        ↓
  Back to [UPLOAD]
```

---

## Settings Location

Settings live inline on the `/transcribe` page above the Transcribe button.

- They are always visible (not hidden in a modal or separate page).
- They persist in component state during the session.
- They reset on page refresh (intentional — no storage).

| Setting | Default | Type |
|---|---|---|
| Paragraph breaks | ON | Toggle |
| Timestamps | ON | Toggle |

---

## What This App Intentionally Does NOT Have

- Dashboard or home screen
- Transcript history or saved files
- Account settings page
- Notification system
- Onboarding flow
- Help/documentation page
