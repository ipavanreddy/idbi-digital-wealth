# Wealth Avatar — IDBI Innovate 2026, Track 1

An avatar-based AI wealth advisor that plugs into the bank's mobile app. It
ingests a customer's transaction stream to become a proactive financial coach:
it categorizes spend, detects the salary rhythm, tracks goals, and fires
event-driven nudges — with a **hybrid escalation** that hands SEBI-regulated
requests to a human relationship manager as a qualified lead. The app is both
an advisor and a lead generator.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (dev)
# or, for the stable production server:
npm run build && npm run start
```

No API key or database required — the demo runs fully offline on deterministic
synthetic data.

## The 90-second demo

The customer app renders inside a phone frame. Tap the floating **Demo controls**
(bottom-right ✨) to drive the story:

1. **Consent** — a DPDP consent gate appears first (tap *I agree*).
2. **360° dashboard** — net worth, auto-detected salary (day 1, ₹1,20,000/mo),
   emergency-fund health, spending donut.
3. **Buy iPhone (₹1,20,000)** — watch the emergency-fund nudge flip from
   "secured (7 months)" to **"at 4.7 months"** with a concrete recovery plan.
4. **Avatar chat** (`/avatar`) — try the quick prompts. Ask *"Which stocks
   should I buy?"* → the avatar refuses (SEBI-regulated), shows a suitable
   allocation instead, and offers an **RM callback**.
5. **RM Console** (`/rm`, or via Demo controls) — the escalated lead appears on
   the bank side, routed to the right RM.
6. **Language toggle** (header EN / हिं) — the shell and avatar switch to Hindi.

## What's real vs. synthetic

- **Rules decide, the avatar phrases.** All financial math is deterministic and
  auditable (`src/lib/rules/`); the avatar's words (`src/lib/avatar/respond.ts`)
  are the only "AI" layer, and swap to Claude in production.
- **Data is synthetic and seeded** (`src/lib/data/seed.ts`) — identical on every
  load so the figures the avatar quotes always match the charts. No real PII.

## Structure

```
src/
  app/
    (mobile)/        # phone-framed customer app: home, spend, goals, avatar, alerts
    (desktop)/rm/    # bank-side RM console
    globals.css      # design tokens (CSS variables)
  components/        # ui primitives, layout, feature components
  lib/
    data/            # synthetic seed + category taxonomy
    rules/           # deterministic advisory engine (the auditable core)
    avatar/          # intent routing + bilingual phrasing
    store.tsx        # app state (React Context + useReducer)
    i18n.ts          # English + Hindi strings
```

## Placeholders (flagged for follow-up)

- **Avatar visual** is a lightweight CSS glyph (`AvatarFace`) — swap for a real
  animated/branded avatar asset when available.
- **App icon** (`src/app/icon.svg`) is a generated placeholder.
- Real IDBI brand assets (logo, exact brand hex) can replace the derived tokens
  in `design-system.json` + `globals.css`.

## Design system

IDBI brand: deep teal-green primary (`#0B6E5A`) + warm orange accent
(`#F57C1F`), light theme, Inter (Latin) + Noto Sans Devanagari (Hindi). Tokens
in `design-system.json`; never hardcode hex — see `CLAUDE.md`.

## Driver

Kushvanth (frontend) with Aman (data/AI). Domain sign-off: Shristi. See
`../../TEAM.md`. Every change goes through `/ship`.
