# Wealth Avatar — APP RULES (Track 1, Digital Wealth Management)

Avatar-based AI wealth advisor for the IDBI mobile app. This file governs all
work inside `apps/wealth-avatar/`. Rules are copied in (not just referenced) so
this folder works standalone if transferred alone. Workspace root rules
(`../../CLAUDE.md`) still apply where not overridden here.

- **Track brief (canonical):** `../../docs/tracks/track-1-digital-wealth-management.md`
- **Event facts & deadlines:** `../../HACKATHON.md`
- **Design tokens:** `design-system.json` + `src/app/globals.css` (CSS variables)

## STATUS: KICKED OFF — scaffolded & demo-verified (2026-07-13)

Full functional prototype built and verified end-to-end in a browser (dashboard,
spend intelligence, goals, avatar chat, alerts, RM console). All further changes
go through `/ship`.

## Approved stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript strict | route groups: `(mobile)` phone shell, `(desktop)` RM console |
| Styling | TailwindCSS + CSS-variable tokens | shadcn CLI intentionally skipped; hand-built token-driven primitives in `src/components/ui/` |
| State | React Context + `useReducer` (`src/lib/store.tsx`) | in-memory; resets on hard reload (by design — see `Reset demo`) |
| Data | Synthetic, deterministic seed (`src/lib/data/seed.ts`) | seeded PRNG → identical every load |
| AI | Deterministic rules engine (`src/lib/rules/`) + templated avatar phrasing (`src/lib/avatar/respond.ts`) | **rules decide, avatar phrases** — Claude swaps into the phrasing seam in prod |
| Charts | Recharts | donut in `src/components/spend/SpendDonut.tsx` |
| i18n | English + Hindi (`src/lib/i18n.ts`) | toggle in the header |

## Architecture principle — auditable advice

The nudge/advisory math is deterministic and lives in `src/lib/rules/`
(`spend.ts`, `advisory.ts`, `nudges.ts`). These pure functions decide **what**
the advice is. `src/lib/avatar/respond.ts` only decides **how** it is phrased
(en/hi). A banker can trace every figure to a rule — never to an LLM. Keep this
separation: new advice = a new rule + a phrasing template, never LLM-invented
numbers.

Domain constants worth reviewing with Shristi live in `ADVISORY_CONFIG`
(`src/lib/rules/advisory.ts`): emergency-fund target months, recovery top-up,
minimum food budget.

## Demo storyline (build to tell this)

Ravi (synthetic, 6 months of txns) → salary auto-detected → categorized-spend
dashboard → **Demo control: Buy iPhone (₹1,20,000)** → emergency-fund nudge
flips (7 → 4.7 months, below the 6-month target) with a recovery plan → he asks
about the Europe-trip goal → avatar shows the recomputed food-budget plan → he
asks "which stocks should I buy?" → avatar refuses (SEBI), shows a suitability
allocation, offers an RM callback → **lead created, visible in the RM console
(`/rm`)**.

The floating **Demo controls** panel (bottom-right of the phone) drives this:
Buy iPhone · Log ₹10,000 dining · Open RM Console · Reset demo.

## Coding rules (inherited from Spontom standards — do not violate)

- TypeScript strict; **no `any`**; named exports only; props interface per
  component; components under ~200 lines; business logic in `src/lib/`, not in
  page components.
- **Design tokens only** — never hardcode hex. Colours/radii/shadows/fonts via
  CSS variables / Tailwind semantic classes (`bg-primary`, `text-text-muted`).
  Colours are stored as RGB channels so opacity modifiers (`bg-success/10`)
  work; use `rgb(var(--color-x))` in raw CSS/inline styles.
- Every data read handles loading, error, and empty states (empty states are
  present on nudges, leads, transactions, chat).
- Filter/aggregate in the rules layer, not scattered in components.

## Data & compliance (HARD rules)

- **Synthetic data ONLY.** Never real customer data, PII, or financials. The
  seed generator is the only data source.
- **SEBI:** no direct stock/security recommendations in-app — regulated
  requests escalate to a human RM (hybrid model, implemented in `respond.ts`
  `stocks` intent → lead).
- **DPDP:** consent gate (`ConsentGate`) shows before personal data is revealed.
- **RBI/KYC:** customer shown as KYC-verified; no real Aadhaar/PAN handling.

## AWS production mapping (mandatory in the deck)

Prototype hosted on Netlify/Vercel for the link, but the architecture slide must
map: Next.js → **Amplify Hosting / ECS Fargate**; data → **Aurora PostgreSQL**;
avatar phrasing → **Amazon Bedrock (Claude)**; transaction stream → **S3 + API
Gateway + Lambda**; async nudges → **EventBridge**. The rules engine runs as a
stateless service (Lambda/ECS) so advice stays auditable at scale.

## Process

- **Every change goes through `/ship <task>`** — no ad-hoc edits.
- Submission artifacts go through `/submit wealth-avatar`.
- Shristi signs off domain/financial claims; Pavan approves & submits.
