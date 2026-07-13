# Wealth Avatar — APP RULES (PRE-KICKOFF SEED)

> ⛔ **STATUS: NOT KICKED OFF.** This is a seed file. Kickoff will **replace this
> file** with the full app rules (design system, stack, data plan, scaffold).
> Until then, treat the workspace `../../CLAUDE.md` as the governing rules.

## Track brief (condensed)

- **Problem:** wealth advisory is fragmented and inaccessible at scale; the bank
  lacks a 360° view of customer investment behaviour and spending to give
  timely, personalized, data-driven guidance.
- **IDBI expects:** an avatar-based AI wealth manager inside the mobile app;
  360° view (savings/investments/spend); a **hybrid model** (AI handles
  vanilla/non-regulated products, SEBI-governed cases → lead to a human RM);
  suitability-driven suggestions; multi-language; market-linked updates; serves
  mass → HNI at bank scale.
- **Our concept (Shristi's canonical spec):** ingest the transaction stream →
  spend intelligence (auto-categorize, detect salary rhythm) → **proactive
  event-tied nudges** (emergency-fund guard, goal tracking) → advisory not
  tipping (stock-level advice routes to RM) → avatar chat UI, multi-language.
- **Success metrics (deck):** advisory coverage at scale, lead quality to RMs,
  engagement (nudges acted on), goal completion rate, cost per advisory
  interaction vs human-only.

## Hard rules (apply even before kickoff)

- **Synthetic data ONLY** — never real customer data, PII, or financials.
- **NO UI code yet** — the design system is undefined; kickoff writes the tokens
  before any component is written. No hardcoded hex, ever (CSS vars only later).
- **Every change goes through `/ship`** — no ad-hoc edits, even pre-scaffold.
- **The deck must map the architecture to AWS services** (Amplify/ECS,
  RDS/Aurora, Bedrock, S3, API Gateway) — mandatory in every submission.
- Nudge engine stays auditable: deterministic rules decide, Claude only phrases.

## Pointers

- Track brief: `docs/track-1-digital-wealth-management.md`
- Event facts & deadlines: `docs/HACKATHON.md`
