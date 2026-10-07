---
name: ticketflow-blueprint
description: Ticketflow Step 02b Blueprint, for improvements and new requirements. Use when running /tf-blueprint, or when a Ticketflow improvement or new-requirement ticket needs a read-only, well-structured implementation plan. Designed for Cursor Plan mode.
---

# Ticketflow Step 02b: Blueprint (improvements and new requirements)

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, resume rule, and agent-panel rules apply here.

When you are the **sub-agent** for this step: call TodoWrite first (`merge: false`, the five Ticketflow todos, `step02` `in_progress` with content `02 Blueprint`). Do the procedure, stay read-only, and return the `RUN.md` updates. Do not commit. Call TodoWrite again with `merge: true` when you finish. The parent writes `RUN.md` and also calls TodoWrite.

## Purpose

Write a well-structured implementation plan that Build can execute task by task. This step is **read-only**.

## Inputs

- `<TICKET>`: Jira key. Resolved per shared Global rule 1.

## Prerequisites

- `RUN.md` exists, `01-intake: done`, and `type` is `improvement` or `new-requirement`. Otherwise stop: if intake is missing, tell the user to run `/tf-intake <TICKET>`; if the type is `bug`, tell them to run `/tf-investigate <TICKET>`.
- Designed for Cursor Plan mode. If you are not in Plan mode, tell the user once to switch (Shift+Tab). Behave read-only either way.

## Procedure

1. **Read-only.** Do not edit, create, or delete any file except `RUN.md`. Do not run commands that change state.
2. **Ask first.** List anything unclear about scope, edge cases, design, data, or dependencies. Write the questions under "Open questions / waiting on user", set `status: waiting-for-user`, and wait for the answers. Do not fill gaps with guesses. If nothing is unclear, say so and continue.
3. Explore the codebase to ground the plan: existing modules, patterns, design system, data layer, and tests. Cite `file:line` for every claim about existing code.
4. Write the plan with these sections, in this order:
   1. **Goal**
   2. **Scope**
   3. **Out of scope**
   4. **Affected files and modules**
   5. **Data/API changes** (write "None" if there are none)
   6. **UI spec**: follow the repo's existing UI stack; if none exists, use the shadcn/ui + Tailwind default (shared Global rule 5). Cover layout, components, loading, empty, and error states, responsiveness, and accessibility. Write "No UI surface" if there is none.
   7. **Ordered implementation tasks** as a `- [ ]` checklist
   8. **Test plan**
   9. **Risks and mitigations**
   10. **Acceptance-criteria → task mapping** table: every AC from Intake maps to at least one task. Flag any AC that has no task.
5. Write the plan to `RUN.md`, and copy the tasks into the Build section as unticked items.
6. When the plan is complete and every question is answered, mark the step done and proceed to Step 03.

## Outputs

- The implementation plan in `RUN.md`.
- A short summary to the user.

## Run-file updates

- Front matter: `current_step: 02-blueprint`, `steps.02-blueprint: done`, `status`, `updated_at`.
- Section "02 Investigate / Blueprint": the plan.
- Section "03 Build": the task checklist.
- Resume hint: for example `Run /tf-build PROJ-123.`

## Failure handling

- Ticket conflicts with the codebase or with itself: write the conflict as an open question, set `waiting-for-user`, and stop.
- An AC cannot be mapped to any feasible task: flag it in the mapping table and ask the user.
- Accidental edit outside `RUN.md`: revert it immediately and tell the user.
