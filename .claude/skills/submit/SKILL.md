---
name: submit
description: >
  Generate the submission pack for an IDBI hackathon track: long-form project
  report, slide-by-slide PPT content matching the official Hack2Skill template,
  and the pre-submission checklist. Invoke as /submit <track> when a track is
  demo-ready, or when the user asks for the report/presentation/submission.
---

# /submit — build the submission pack

Inputs to read first: `docs/tracks/<track>.md`, the app's CLAUDE.md/README,
`TEAM.md`, `docs/submissions/README.md`, and the app's actual state (what is
REALLY built and verified — never describe features that don't run).

## Step 1 — Template check

Look for `docs/submissions/TEMPLATE.pptx` (or a template outline noted in
that folder). If absent: **STOP** and ask the user to download the official
template from the portal (Submission tab) — the deck MUST match it exactly
(same slides, same format; H2S rejects modified templates). Offer to proceed
with the report only while waiting.

## Step 2 — Project report

Write `docs/submissions/<track>-report.md`:

1. **Executive summary** — problem in IDBI's numbers, our result on synthetic
   data, one-line architecture.
2. **Problem statement** — from the track brief, in the bank's framing.
3. **Solution** — what it does, the demo storyline, screenshots list.
4. **Architecture** — components, data flow, and the AWS production mapping
   (prototype hosting ≠ production story; show both).
5. **Data** — synthetic generation approach, volumes, why it's realistic;
   explicit "no real PII" statement.
6. **Results & metrics** — only measured numbers from the actual app/model;
   mark projections clearly as projections.
7. **Compliance posture** — SEBI/RBI/DPDP touchpoints implemented (consent
   screens, RM escalation, explainability/reason codes).
8. **Scalability & pilot path** — 90-day pilot plan, sandbox-integration plan
   (their APIs post-shortlisting).
9. **Team** — the four roles from TEAM.md, one line each on contribution.
10. **Roadmap** — refinement-stage plan (Jul 22–31) if shortlisted.

Header block: track, team name, date, sign-off lines for Shristi (domain) and
Pavan (final). **The report is DRAFT until both sign-offs are recorded.**

## Step 3 — Slide-by-slide deck content

For each slide in the official template, produce: slide number/name → title
line → body bullets (max 5, banker language, numbers first) → visual to place
(which screenshot/diagram/chart) → speaker note (2–3 sentences). Pull from
the report; never introduce claims that aren't in it. Deck principles:
`docs/submissions/README.md` ("judges are bankers" section).

## Step 4 — Pre-submission checklist (print it filled-in)

```
[ ] Deployment link opens in incognito, demo path clicks through end-to-end
[ ] GitHub repo: public/access OK, README complete, no secrets in history,
    fresh clone runs with documented steps
[ ] Deck uses the EXACT official template — slide count unchanged
[ ] Every number in the deck traces to the report; projections labeled
[ ] Synthetic-data statement present (no real PII anywhere, incl. repo)
[ ] Shristi sign-off recorded   [ ] Pavan sign-off recorded
[ ] Correct ONE problem statement selected on the portal
[ ] Submitted before the deadline in HACKATHON.md — screenshot the confirmation
```

Unchecked boxes = not ready; say so plainly and list what's missing.
