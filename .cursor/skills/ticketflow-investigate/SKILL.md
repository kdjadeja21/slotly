---
name: ticketflow-investigate
description: Ticketflow Step 02a Investigate, for bugs only. Use when running /tf-investigate, or when a Ticketflow bug ticket needs a read-only root-cause investigation with a confidence score out of 100 and a fix plan. Designed for Cursor Plan mode.
---

# Ticketflow Step 02a: Investigate (bugs)

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, thresholds, resume rule, and agent-panel rules apply here.

When you are the **sub-agent** for this step: call TodoWrite first (`merge: false`, the five Ticketflow todos, `step02` `in_progress` with content `02 Investigate`). Do the procedure, stay read-only, and return the `RUN.md` updates. Do not commit. Call TodoWrite again with `merge: true` when you finish. The parent writes `RUN.md` and also calls TodoWrite.

## Purpose

Find the root cause of a bug, with evidence and a confidence score, and produce a fix plan for Build. This step is **read-only**.

## Inputs

- `<TICKET>`: Jira key. Resolved per shared Global rule 1.

## Prerequisites

- `RUN.md` exists, `01-intake: done`, and `type: bug`. Otherwise stop: if intake is missing, tell the user to run `/tf-intake <TICKET>`; if the type is not `bug`, tell them to run `/tf-blueprint <TICKET>`.
- Designed for Cursor Plan mode. If you are not in Plan mode, tell the user once to switch (Shift+Tab). Behave read-only either way.

## Procedure

1. **Read-only.** Do not edit, create, or delete any file except `RUN.md`. Do not run commands that change state (no installs, no migrations, no git writes). Reading files, searching, `git log`, `git blame`, `git diff`, and running existing tests are allowed.
2. **Ask first.** List any questions about missing repro steps, environment, expected behavior, or scope. Write them under "Open questions / waiting on user", set `status: waiting-for-user`, and wait for the answers before investigating further. If nothing is unclear, say so and continue.
3. **Explore the codebase:**
   - Find the entry point for the failing behavior (route, handler, component, command).
   - Trace the failing path through the code.
   - Check recent changes to the suspect files with `git log -p --follow -- <file>` and `git blame -L <range> <file>`.
   - Look at existing tests for the area, and run them if that is safe and read-only.
4. **Produce:**
   - **Root cause**: plain language, with `file:line` evidence.
   - **Confidence: N/100**: short justification, and what would raise it (for example a repro, a log, a failing test).
   - **Alternative hypotheses**: each one considered and why it was rejected, with evidence.
   - **Fix plan**: ordered tasks as a checklist, files to change, tests to add, and risks.
5. Write all of it to `RUN.md` and set `confidence`. Copy the fix-plan tasks into the Build section as unticked `- [ ]` items.
6. **Gate** (thresholds from `ticketflow-shared`):
   - Confidence above `CONFIDENCE_GATE`: mark the step done and proceed to Step 03.
   - Confidence at or below `CONFIDENCE_GATE`: set `status: waiting-for-user`, present the findings, and wait for the user's approval or direction before Step 03. Record the approval in `RUN.md` when given.

## Outputs

- Root cause, confidence, alternatives, and fix plan in `RUN.md`.
- A short summary to the user that ends with the gate decision.

## Run-file updates

- Front matter: `current_step: 02-investigate`, `steps.02-investigate: done` once the findings are written, `confidence`, `status` (`in-progress` or `waiting-for-user`), `updated_at`.
- Section "02 Investigate / Blueprint": root cause, confidence, alternatives, fix plan.
- Section "03 Build": the task checklist.
- Resume hint: for example `Waiting for approval of fix plan (confidence 62/100).` or `Run /tf-build PROJ-123.`

## Failure handling

- Cannot reproduce or locate the cause: report what was checked, set a low confidence, and let the gate send it to the user. Do not guess a cause.
- Questions unanswered: stay in `waiting-for-user`; do not continue.
- Accidental edit outside `RUN.md`: revert it immediately and tell the user.
