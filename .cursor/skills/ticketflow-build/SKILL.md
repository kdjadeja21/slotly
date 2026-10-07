---
name: ticketflow-build
description: Ticketflow Step 03 Build. Use when running /tf-build, when executing a Ticketflow fix plan or implementation plan task by task, or when re-running Build in fix mode to address open Audit findings. Detects the project's stack and enforces the performance checklist.
---

# Ticketflow Step 03: Build

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, thresholds, resume rule, and agent-panel rules apply here.

When you are the **sub-agent** for this step: do the procedure, including code and test changes, and return the `RUN.md` updates (ticked tasks, notes, Performance notes, check results, resume hint). Do not create or edit `.cursor/ticketflow/`. Do not commit. The parent writes `RUN.md` and calls TodoWrite for the agent-window todo list when you return. Do not call TodoWrite. If you must stop, return `status: blocked` or `waiting-for-user` and the reason.

## Purpose

Implement the plan from Step 02, with tests, good performance for the project's own stack, and passing checks. Do not commit.

## Inputs

- `<TICKET>`: Jira key. Resolved per shared Global rule 1.
- Mode: **normal** (from the plan) or **fix mode** (from a failed Audit). It is fix mode when `audit_round` is at least 1 and "Open findings" in `RUN.md` is not empty.

## Prerequisites

- The Step 02 that matches `type` is `done`. Otherwise tell the user to run `/tf-investigate <TICKET>` or `/tf-blueprint <TICKET>` first.
- For bugs with confidence at or below `CONFIDENCE_GATE`: the user's approval is recorded in `RUN.md`. If not, stop and show the pending approval.

## Procedure

1. Set `steps.03-build: in-progress`. If resuming, start from the first unticked task.
2. **Detect the stack** following section 0 of [performance.md](performance.md): language, framework and version, rendering model, data layer and caching, build tool, and platform (web, mobile, backend, CLI). Write it in the Performance notes block of `RUN.md` before writing code. Never assume React; use what the repo actually contains.
3. **Execute the plan task by task.** After each task: tick it in `RUN.md` (`- [x]`), add a one-line note if you deviated from the plan, and write the file.
4. **UI work:**
   - Follow the repo's existing UI stack. If there is none, use the shadcn/ui + Tailwind default (shared Global rule 5).
   - Apply the `emil-design-eng` skill, and `animate` for motion work, from `emilkowalski/skills`. If those skills are not installed, say so once, suggest `npx skills@latest add emilkowalski/skills`, and continue with the shadcn + Tailwind guidance.
   - Handle loading, empty, and error states, responsiveness, and accessibility (focus, contrast, labels, keyboard).
5. **Tests:** add or update tests as the plan says. If the repo has no test setup, say so in the notes; do not add a test framework unless the plan says to.
6. **Performance (mandatory for every change):**
   - Apply [performance.md](performance.md): the universal principles plus the profile for the detected stack. Use only features the installed versions support, and prefer what the repo already uses.
   - If a technique needs a newer version than the project has (for example a React 19 API on a React 18 project), do not introduce it. Use the repo's existing equivalent and tell the user.
   - If the stack is not covered by the profiles, look up that stack's official performance guidance and apply it. Never carry over habits from a different stack.
7. **Checks:** discover the lint, typecheck, and test commands from `package.json` scripts (or the stack's equivalent, or the repo docs) and run them. Then run a production build where the stack has one. Fix failures before finishing. If a command does not exist, record that rather than inventing one.
8. **Compare against the base branch** using section 3 of [performance.md](performance.md), for example bundle size per route for frontends, or query count and latency for backends. To measure the base, use a temporary worktree (`git worktree add /tmp/tf-base <base_branch>`) so the working tree is not touched, and remove it afterwards.
9. **Fix mode:** read "Open findings" in `RUN.md` and address **only those findings**, in priority order. Tick each finding as it is resolved, then re-run step 7 and step 8.
10. Write the **Performance notes** block (see Run-file updates).
11. Do not commit. Committing happens in Step 05.

## Outputs

- Working tree changes that implement the plan, with tests.
- Check results (lint, typecheck, tests, production build) and the performance comparison.

## Run-file updates

- After each task: tick it, write the file, and update `updated_at`.
- At the end: `steps.03-build: done`, `current_step: 03-build`, `status: in-progress`, `updated_at`.
- Build section notes: deviations from plan, check results, and this block:

```markdown
### Performance notes
- Stack: <language, framework and version, rendering model, data layer, build tool, platform>
- Applied: <practices from performance.md that were used>
- Measured: <numbers vs base branch, for example route size gzipped, query count, latency>
- Deviations: <checklist items not followed, with the reason; or "None">
- Not measurable: <what could not be measured and why; or "None">
```

- Resume hint: for example `Run /tf-audit PROJ-123.`

## Failure handling

- A check fails and cannot be fixed within the plan's scope: leave `03-build: in-progress`, record the failure output, set `status: blocked`, and ask the user.
- The plan turns out to be wrong or incomplete: stop, write the gap under "Open questions / waiting on user", set `waiting-for-user`, and do not improvise new scope.
- A dependency is needed that the plan did not list: ask before adding it.
