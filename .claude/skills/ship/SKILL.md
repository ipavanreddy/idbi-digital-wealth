---
name: ship
description: >
  The Spontom engineering delivery loop. Use for ANY code change in ANY project —
  feature, bugfix, refactor, migration, or data script — in SaaS, enterprise, or
  government work. Encodes the full senior-engineer thought process as explicit
  phases with hard gates, so the output quality is the same regardless of which
  model runs it (Haiku, Sonnet, Opus). Invoke as /ship <task description>.
---

# /ship — the engineering delivery loop

**The process IS the quality bar.** A stronger model following this loop and a
weaker model following this loop produce the same artifacts, because every phase
has a required written output and a binary gate. Do not skip a phase because the
task "looks simple" — every production incident in past projects came from a
change someone was confident about. Do not summarize phases away; produce each
phase's output template verbatim.

If at any gate you cannot honestly check every box, STOP and either gather the
missing information yourself or ask the user — do not proceed on hope.

---

## Phase 0 — FRAME (before reading any code)

Write this block, filled in:

```
TASK: <one sentence, in your own words — not a copy of the user's words>
ACCEPTANCE CRITERIA:            # 3–7 bullets, each binary pass/fail
- [ ] <observable behavior, not implementation: "user sees X when Y">
- [ ] ...
ASSUMPTIONS:                    # decisions you made where the request was ambiguous
- <assumption> (would change if: <what the user could say>)
OUT OF SCOPE: <what you are deliberately NOT doing>
```

**Gate 0:** If any assumption would change the database schema, a public API
contract, or user-visible copy, ask the user before continuing. Anything else:
decide, record it, move on.

---

## Phase 1 — RECON (read before you write)

1. Read the project's `CLAUDE.md` / `AGENTS.md` sections relevant to the areas
   you will touch (design system, data rules, RBAC, copy rules). Project rules
   OVERRIDE this skill where they conflict.
2. Find the **nearest existing pattern**: the file in this codebase that already
   does something most similar to the task. Name it. Your change must look like
   it was written by the same person who wrote that file.
3. Check for landmines: known data quirks, empty legacy tables, generated
   columns, sync-owned tables, deploy-coupling (does this repo deploy together
   with another service?).

Write this block:

```
NEAREST PATTERN: <file path> — <what it demonstrates>
FILES TO TOUCH:  <every file you expect to create/edit, one line each, with why>
LANDMINES:       <quirks/constraints that apply, or "none found">
```

**Gate 1:** No file edits before FILES TO TOUCH is written. If mid-implementation
you need a file not on the list, add it to the list with a reason first.

---

## Phase 2 — PLAN (bottom-up: data → contract → UI)

Design in this order, because mistakes at lower layers are the expensive ones:

1. **Data**: schema/migration changes. Migrations must be idempotent
   (`if not exists`, `create or replace`, `drop policy if exists` before create).
   Never touch generated columns. Never write to tables owned by a sync process.
2. **Contract**: API route shapes, validation (Zod or equivalent at every
   boundary), auth/RBAC check per route, error shape.
3. **UI**: every data fetch gets loading, error, and empty states — enumerate
   them now, not after.

Then answer the **scale questions** — in writing, yes/no, for every query you
will add or modify. Assume production has 10–100× your dev data:

```
SCALE CHECK:
- Filtering done in SQL (not JS .filter on fetched rows)?        yes/no/n-a
- List queries paginated at the SQL level with a hard cap?       yes/no/n-a
- Joins bounded (inner-filtered or second query keyed by page)?  yes/no/n-a
- Zero awaits inside loops (batched with .in() + Map instead)?   yes/no/n-a
- Images rendered with loading="lazy" decoding="async"?          yes/no/n-a
- Sort columns backed by an index?                               yes/no/n-a
```

**Gate 2:** Any "no" above must be converted to "yes" in the plan, or explicitly
approved by the user as accepted debt. "It's fine at current size" is not an
answer — data only grows.

---

## Phase 3 — IMPLEMENT

Rules, non-negotiable:

- **Match the nearest pattern.** Same naming, same file layout, same idioms,
  same comment density. Novelty in style is a defect.
- **Root cause, not symptom.** If you find yourself special-casing around a bug,
  stop and fix the bug. A senior reviewer would reject the workaround.
- **Types are strict.** No `any`, no `as` casts to silence errors, interfaces
  for every component's props.
- **Design system only.** Colors/radii/shadows/fonts via the project's CSS
  variables or tokens — never hardcoded values.
- **Secrets stay server-side.** Service-role keys and API secrets never reach
  client code; sensitive operations go through server routes.
- **No new dependencies** without stating why an existing one can't do it.
- **Destructive data operations** (delete, bulk update, wipe) require a backup
  step in the same script, written and verified BEFORE the destructive step.
- Components stay small (split near ~200 lines); business logic lives in
  hooks/services, not page components.

---

## Phase 4 — VERIFY (observed, not assumed)

"It should work" is banned. Produce evidence:

1. Build/typecheck passes (`npm run build` or project equivalent).
2. Lint passes on touched files.
3. Run tests if the project has them; add/adjust tests for changed logic.
4. **Exercise the actual flow**: start the app or call the endpoint and observe
   the new behavior with real(istic) data — including one error path and one
   empty-state path from Phase 2's enumeration.
5. If a migration is involved: run it twice — the second run must succeed
   silently (proves idempotency).

Write this block:

```
VERIFIED:
- <acceptance criterion> → <what you ran / clicked / queried> → <what you observed>
NOT VERIFIED: <anything you could not exercise, and why>
```

**Gate 4:** Every acceptance criterion from Phase 0 appears in VERIFIED, or is
listed in NOT VERIFIED with an honest reason. A criterion silently dropped is a
failed gate.

---

## Phase 5 — SELF-REVIEW (as a hostile senior reviewer)

Re-read the full diff, pretending someone else wrote it and your job is to
reject it. Answer each in writing, one line:

```
REVIEW:
- What breaks at 10× data volume?
- What breaks for a user with the LEAST privileged role?
- What breaks on slow network / double-click / stale tab?
- Which error is swallowed silently anywhere in this diff?
- What did I change that I wasn't asked to change?
- If this deploys but the paired service/repo doesn't, what breaks?
- What would I flag in this diff if a junior sent it to me?
```

Fix everything you flagged. Then re-run the parts of Phase 4 the fixes touched.

---

## Phase 6 — REPORT

End with exactly this structure (this is what the user reads):

```
## What changed
<plain-language summary, file links>

## How it was verified
<the VERIFIED block, cleaned up>

## Risks & follow-ups
<accepted debt, NOT VERIFIED items, anything the user should decide>
```

Never claim something works that appears in NOT VERIFIED. Never omit a failure.

---

## Anti-patterns (each of these caused a real production incident)

- Fetching thousands of rows to filter down to a handful in JS → timeout at scale.
- `.limit(N)` then JS-side slicing → silently truncated real results.
- Unbounded joins on parent×children → response explosion past row caps.
- Await-in-loop against the database → 25-second endpoints.
- Fixing a bug by adding a special case on top of a wrong cursor/offset → the
  real bug kept corrupting data underneath.
- Shipping repo A's change while forgetting repo B renders its output → broken
  in production despite both changes being individually correct.
- Re-adding a field that already existed under a different slug → duplicate,
  conflicting data in exports and UI.
