---
name: ticketflow-audit
description: Ticketflow Step 04 Audit. Use when running /tf-audit, or when a Ticketflow build needs to be reviewed and scored for functionality (0-10) and UI/UX (0-10) and checked with the thermo-nuclear code quality review before shipping. Contains the scoring rubric and the fix-loop rules.
---

# Ticketflow Step 04: Audit

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, thresholds, and resume rule apply here.

## Purpose

Review the change against the base branch with three independent checks, decide pass or fail, and either hand off to Ship or send prioritized findings back to Build.

## Inputs

- `<TICKET>`: Jira key. Resolved per shared Global rule 1.

## Prerequisites

- `steps.03-build: done`. Otherwise tell the user to run `/tf-build <TICKET>` first.
- If `audit_round` already equals `MAX_AUDIT_ROUNDS` and the last round failed, do not start another round. Set `status: blocked` and ask the user (see Failure handling).

## Procedure

1. Increment `audit_round` and write the file.
2. Collect the diff against `base_branch`: `git diff <base_branch>` plus untracked files from `git status --porcelain` (excluding `.cursor/ticketflow/`).
3. Run the three checks below independently. Score each check on its own evidence; do not let one check influence another.

### Check 1: Functionality score (0 to 10)

| Criterion | Weight |
|-----------|--------|
| Acceptance-criteria coverage (every AC from Intake, mapped to evidence) | 40% |
| Edge cases and error handling | 20% |
| Tests added and passing | 20% |
| Regression risk and live verification | 20% |

- For backend and other non-UI code, also check **performance** against [../ticketflow-build/performance.md](../ticketflow-build/performance.md): latency, query count and N+1, blocking calls, memory. A clear violation without a reason recorded in the Performance notes is a deduction.
- Verify live using the Cursor browser tool or Grok Bot where the change is runnable (start the dev server and exercise each AC). Otherwise run the tests and state exactly what could not be verified live.

### Check 2: UI/UX score (0 to 10)

Score these areas:

- Visual consistency with the design system (the repo's own, or shadcn + Tailwind tokens).
- Loading, empty, and error states.
- Responsive behavior (at least mobile and desktop widths).
- Accessibility: focus, contrast, labels, keyboard.
- Motion quality.
- Frontend **performance**, checked against [../ticketflow-build/performance.md](../ticketflow-build/performance.md) for the project's stack: Core Web Vitals targets, unnecessary re-renders, request waterfalls, bundle growth, and correct use of the stack's own idioms. A clear violation without a recorded reason is a deduction.

Method:

- Take screenshots with the browser tool for every affected screen and state.
- Apply `break-ui` (worst-case data: long strings, empty lists, many items, slow network, errors) and `review-animations` from `emilkowalski/skills`. If they are not installed, say so and run the same checks manually.
- If the change has **no UI surface**, record `uiux: "n/a"`. It then does not block.

### Check 3: Thermo-nuclear code quality review (pass/fail)

- Explicitly invoke the `thermo-nuclear-code-quality-review` skill from the `cursor-team-kit` plugin on the branch's changes. It is manual-invoke only, so call it by name (for example through the subagent of the same name, giving it the diff and the changed files).
- `pass` means no presumptive blockers under that skill's Approval Bar. Otherwise `fail`, with its findings.
- If the plugin is not installed, record `thermo_nuclear: fail` with the reason "review not available", and tell the user to install `cursor-team-kit`. Do not mark it as passed.

### Scoring discipline

- Functionality and UI/UX are equally important.
- Every deduction cites evidence: `file:line` or a screenshot.
- Do not inflate scores. If something could not be verified, it cannot earn full marks for that criterion.

### Pass condition

Using thresholds from `ticketflow-shared`:

`functionality ≥ AUDIT_PASS_SCORE` AND (`uiux ≥ AUDIT_PASS_SCORE` OR `uiux = "n/a"`) AND `thermo_nuclear = pass`.

4. **Pass:** record scores, mark the step done, clear "Open findings", and proceed to Step 05.
5. **Fail:** write a prioritized "Open findings" list (highest impact first; each item has the check it came from, evidence, and the expected fix), set `steps.03-build: pending` and `steps.04-audit: pending`, and re-run Step 03 in fix mode, then Audit again.
6. **Round cap:** if the round that just failed is round `MAX_AUDIT_ROUNDS`, do not loop again. Set `status: blocked`, summarize what is left, and ask the user how to proceed.

## Outputs

- Three check results with evidence, and a pass or fail decision.
- "Open findings" when failing.

## Run-file updates

- Front matter: `audit_round`, `scores.functionality`, `scores.uiux`, `scores.thermo_nuclear`, `steps.04-audit` (`done` on pass), `current_step: 04-audit`, `status`, `updated_at`.
- Add one row to the Audit table: `| <round> | <n>/10 | <n>/10 or n/a | pass/fail | PASS/FAIL |`.
- Rewrite "Open findings" with the latest audit's list.
- Resume hint: for example `Run /tf-ship PROJ-123.` or `Run /tf-build PROJ-123 (fix mode, round 2).`

## Failure handling

- Dev environment cannot start: verify with tests only, state what was not verified live, and deduct under "regression risk and live verification".
- Browser tool unavailable: say so, and score UI/UX only from code and whatever screenshots can be taken; do not award full marks for unverified areas.
- Blocked after the round cap: the user may override and ship anyway; record the override explicitly in `RUN.md` before Ship.
