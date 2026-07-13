# IDBI Innovate 2026 — Event Brief

Source: hack2skill.com/event/idbinnovate + official orientation (video) +
problem-statement explainer & AMA session (video). Distilled Q&A facts live in
[docs/reference/orientation-notes.md](docs/reference/orientation-notes.md).

## What IDBI wants

Production-ready, scalable prototypes it can pilot inside the bank. They are
explicitly looking for long-term association with winners (pilot deployment),
not throwaway demos. Judged on: feasibility at bank scale, scalable
architecture, and a working prototype — not just an idea deck.

## Timeline (2026)

| Date | Milestone |
|---|---|
| **Jul 13 (EXTENDED from Jul 9)** | Registration + team formation + prototype submission CLOSE |
| Jul 21 | Shortlisting announced |
| Jul 22 – 31 | Refined prototype submissions (shortlisted teams; sandbox access begins) |
| Aug 13 | Finalists announced |
| Aug 21 | Demo day + winners announced |

## Prizes

Total pool ₹15,00,000. Per track: Winner ₹2,00,000 · Runner-up ₹1,00,000.
Open track winner: ₹1,00,000. Plus sandbox access and potential pilot
deployment with IDBI.

## The five tracks

| # | Track | One-liner | Our app folder |
|---|---|---|---|
| 1 | Digital Wealth Management | Avatar-based AI wealth advisor inside the bank's mobile app | `apps/wealth-avatar` |
| 2 | Prospect Assist AI | Behavioural lead-gen + repayment-capacity scoring for retail loans (>30% conversion target) | `apps/prospect-assist` |
| 3 | Financial Health Score | MSME financial health card from alternate data (GST/UPI/AA/EPFO), ULI/OCEN integration | `apps/health-score` |
| 4 | Default Prediction Model | Predict loan default 12 months ahead (~90% target vs 16–22% today) | `apps/default-predict` |
| 5 | Open Track | Novel banking innovation — must NOT overlap tracks 1–4 | `apps/open-track` |

Full briefs with IDBI's own commentary: [docs/tracks/](docs/tracks/).

## Submission requirements (stage 1)

Per team, on the hack2skill portal → Submission tab → Prototype submission:

1. **PPT in the EXACT official template** — same template, same number of
   slides, no modifications to the format. Template + rules:
   [docs/submissions/](docs/submissions/).
2. **Deployment link** — working prototype, publicly reachable.
3. **GitHub repo link**.
4. Select exactly ONE problem statement.

## Hard constraints (from the AMA — do not violate)

- **One team = one track.** A team cannot submit to multiple tracks. To cover
  multiple tracks, form multiple teams (solo is allowed; max 4 per team;
  members may be from different companies/cities).
- Stage 1 uses **your own/synthetic data** — sandbox APIs (internal IDBI APIs
  + synthetic datasets via ACC on AWS) arrive only AFTER shortlisting.
- **AWS-first architecture.** AWS is the cloud + knowledge partner; the
  sandbox runs on AWS. GCP/other tools only if callable via API; don't build
  around them.
- **Regulatory guardrails:** SEBI (wealth/investment advice), RBI (lending,
  KYC/Aadhaar norms), DPDP Act (consent for personal data). Regulated advice
  in Track 1 must escalate to a human relationship manager (hybrid model).
- Track 4 metric choice is OURS to define (raw accuracy is misleading on
  imbalanced defaults) — but justify it in the submission.

## Partners

- **AWS** — cloud infrastructure + knowledge partner.
- **Hack2Skill (H2S)** — platform, submissions, comms (support@hack2skill.com).
- **ACC (Applied Cloud Computing)** — sandbox provider from stage 2.

## Team strategy note (decide before submitting)

We are 4 people and 5 tracks, but one team can only submit one track. Options:
split into multiple registered teams (e.g. two teams of two, or solo entries)
to cover 2–4 tracks, or concentrate everyone on the 1–2 strongest tracks.
Pavan owns this call. Record the final team-to-track mapping in TEAM.md.
