---
name: kickoff
description: >
  Project onboarding for the IDBI hackathon workspace. Invoke whenever the user
  greets with a track/project name ("hi wealth avatar", "hi track 3", "hello
  prospect assist") or asks to start/set up one of the five track apps. Walks
  step-by-step: track briefing → design references → define the design system →
  confirm stack & data plan → scaffold the app. Also invocable as /kickoff <name>.
---

# /kickoff — start a track app the same way every time

Run the steps IN ORDER. Each step ends with a written output and, where marked,
a STOP for user input. Never skip ahead to writing code — kickoff's job ends at
a scaffolded app with a build plan; building happens through /ship.

## Step 1 — Identify the track

Map the user's words to a track via the alias table in CLAUDE.md §1. If
ambiguous, ask ("Did you mean Track 2 Prospect Assist or Track 3 Health
Score?"). If `apps/<slug>/` already exists with a scaffold, say so and offer
to resume its build plan instead of re-kicking off.

## Step 2 — Brief the user (before asking them anything)

Read `HACKATHON.md` and `docs/tracks/<track>.md`, then present, in under a
page: the problem in IDBI's words · what they explicitly asked for · our
solution concept · the demo storyline · target metrics · the next deadline
from HACKATHON.md. End with: "Confirm this is the plan of record, or tell me
what changed." **STOP for confirmation.**

## Step 3 — Collect design references

Ask for, explicitly and in one message:

1. Brand assets: logo files, existing brand colors, fonts.
2. 2–3 products whose look they admire (names, URLs, or screenshots).
3. Mood words (e.g. "trustworthy banking blue" vs "modern fintech dark").
4. Light, dark, or both.
5. Any client/bank constraints (IDBI green/orange accents? accessibility?).

**STOP and wait.** If the user says "no references, you choose": propose ONE
banking-appropriate default direction (palette swatches described in words +
font pairing + radius/shadow character) and get a yes before proceeding —
never silently invent the brand.

## Step 4 — Define the design system

From the references, write BOTH:

1. `apps/<slug>/design-system.json` — following the `token_schema` in the
   root `design-system.json` (fill `meta.references` honestly).
2. A summary back to the user: each color with its role, the font, the radius/
   shadow character, one sample component description ("primary button:
   pill, --color-primary, white text").

Rules: WCAG AA contrast for text colors; success/warning/error/info must be
distinguishable from the primary; tokens named exactly per schema so the
CSS-variable conventions in CLAUDE.md §3 hold. **STOP for sign-off.**

## Step 5 — Confirm stack, data, architecture

Present the defaults from CLAUDE.md §4 with any track-specific deviations
(e.g. Track 4 adds a Python model-training script; Track 1 adds Claude API
for the avatar). Cover: framework · DB · AI components · synthetic-data
generator plan (what entities, how many, what story it must support) · auth
(demo login is fine) · deployment target for the prototype link · the AWS
production mapping for the deck. One decision per line, defaults pre-filled.
**STOP: user approves or amends.**

## Step 6 — Scaffold

1. Create the app (Next.js + TypeScript + Tailwind + shadcn) in `apps/<slug>/`.
2. Write the tokens into `globals.css` as CSS variables matching
   design-system.json.
3. Copy the workspace skills into the app: `.claude/skills/ship/` (and
   `submit/`) so the app folder works standalone if opened directly.
4. Write `apps/<slug>/CLAUDE.md` containing: link to the track brief · the
   design tokens location · the approved stack · the demo storyline · the
   coding + data rules inherited from the root CLAUDE.md (copy the rules in,
   don't just reference — the folder may be transferred alone).
5. Write `apps/<slug>/README.md`: what it is, how to run, who's driving.
6. `git init` the app folder with an initial commit (each app is its own
   repo — a GitHub link is a submission requirement).
7. Verify: `npm run dev` starts and the styled shell renders with the new
   tokens (a colored header + font proves the design system is live).

## Step 7 — Hand over the build plan

Produce a milestone list from the demo storyline (each milestone = one
demoable slice, ordered so the app is always demo-ready), sized for the
deadline in HACKATHON.md. Format each as a ready-to-run command:
`/ship <first task>` … Present the plan and end with:
"Scaffold verified. Start with: /ship <milestone 1>".
