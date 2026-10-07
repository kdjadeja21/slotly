---
name: ticketflow-shared
description: Shared rules for every Ticketflow step. Use whenever you run /ticketflow, any /tf-* command, or any ticketflow-* skill. Defines the RUN.md schema, the resume rule, the step prerequisites, and the thresholds (confidence gate, audit pass score, audit round cap).
---

# Ticketflow shared rules

## Purpose

Ticketflow takes a Jira ticket from intake to a raised pull request in six steps. This skill is the single source of truth for the run file, resume behavior, step prerequisites, thresholds, and global rules. Every other `ticketflow-*` skill reads this one first.

## Inputs

- `<TICKET>`: a Jira key such as `PROJ-123`. It is the only required input.

## Prerequisites

- A git repository with a clean understanding of the current branch.
- Jira/Atlassian tools available in Cursor (see Global rule 7).

## Thresholds

These values are defined here only. Other files refer to them by name.

| Name | Value | Used by |
|------|-------|---------|
| `CONFIDENCE_GATE` | 70 | Investigate: confidence strictly above this proceeds to Build automatically; at or below it waits for the user. |
| `AUDIT_PASS_SCORE` | 8 | Audit: minimum functionality score, and minimum UI/UX score unless UI/UX is `n/a`. |
| `MAX_AUDIT_ROUNDS` | 3 | Audit: maximum number of audit rounds before the run is set to `blocked`. |

To change a threshold, edit this table only.

## Global rules

1. **Ticket key.** The ticket key is the only required input. If a command is run without one, use the most recently updated run in `.cursor/ticketflow/` (compare `updated_at` in each `RUN.md`). If there is none, ask the user for the key.
2. **Run file.** The run file is `.cursor/ticketflow/<TICKET>/RUN.md`. Read it at the start of every step. Update it at the end of every step and after each milestone inside long steps (for example each Build task). Update it **before** moving to the next step.
3. **Ask before acting.** In Step 02, if anything is unclear, ask questions first and make no changes. Do not guess.
4. **Evidence over assertion.** Every claim in a root cause, plan, or review cites `file:line`, test output, or a screenshot.
5. **UI default.** If neither the ticket nor the repo specifies a UI stack, use **shadcn/ui + Tailwind CSS**. Existing repo conventions always win over this default.
6. **Safety.** Never force-push. Never merge a PR. Never commit secrets. Never commit `.cursor/ticketflow/`. Never write to Jira unless the user explicitly asks.
7. **Jira access.** Use the Jira/Atlassian tools already available in Cursor through the installed plugin. Discover them at runtime (for example search the dynamic tool catalog for `Atlassian` or `Jira`). If none are available, stop and tell the user.
8. **Short summaries.** Keep each step's summary in `RUN.md` to 5 to 15 lines, factual.

## Run file schema

Create `RUN.md` with exactly this structure:

```markdown
---
ticket: PROJ-123
title: <ticket summary>
type: bug | improvement | new-requirement
status: in-progress | waiting-for-user | blocked | done
current_step: 01-intake | 02-investigate | 02-blueprint | 03-build | 04-audit | 05-ship
steps:
  01-intake: pending | done
  02-investigate: pending | done | skipped
  02-blueprint: pending | done | skipped
  03-build: pending | in-progress | done
  04-audit: pending | done
  05-ship: pending | done
confidence: <0-100, bugs only>
audit_round: 0
scores:
  functionality: <0-10 or null>
  uiux: <0-10, null, or "n/a">
  thermo_nuclear: pass | fail | null
base_branch: <branch the run started from>
work_branch: <created in Step 05>
pr_url: <set in Step 05>
updated_at: <ISO timestamp>
---

# Ticketflow run: PROJ-123

## 01 Intake
<ticket summary, type, reason for classification, acceptance criteria>

## 02 Investigate / Blueprint
<root cause + confidence + fix plan, OR the implementation plan>

## 03 Build
- [ ] Task 1 ...
- [ ] Task 2 ...
<notes, deviations from plan>

## 04 Audit
| Round | Functionality | UI/UX | Thermo-nuclear | Result |
|-------|---------------|-------|----------------|--------|

### Open findings
<prioritized list from the latest audit>

## 05 Ship
<branch name, commit(s), PR link>

## Open questions / waiting on user
<anything blocking>

## Resume hint
<one line: exactly what to do next>
```

Field rules:

- Set `updated_at` to the current ISO timestamp on every write.
- For a `bug`, set `02-blueprint: skipped`. For `improvement` or `new-requirement`, set `02-investigate: skipped`.
- Always rewrite `Resume hint` when you update the file.

## Step names and prerequisites

| Step | `--from` value | Command | Skill | Requires `done` (or `skipped`) |
|------|----------------|---------|-------|--------------------------------|
| `01-intake` | `intake` | `/tf-intake` | `ticketflow-intake` | nothing |
| `02-investigate` | `investigate` | `/tf-investigate` | `ticketflow-investigate` | `01-intake`, and `type: bug` |
| `02-blueprint` | `blueprint` | `/tf-blueprint` | `ticketflow-blueprint` | `01-intake`, and `type` is `improvement` or `new-requirement` |
| `03-build` | `build` | `/tf-build` | `ticketflow-build` | the Step 02 that matches `type`; for bugs, also user approval if confidence is at or below `CONFIDENCE_GATE` |
| `04-audit` | `audit` | `/tf-audit` | `ticketflow-audit` | `03-build` |
| `05-ship` | `ship` | `/tf-ship` | `ticketflow-ship` | `04-audit` passed, or an explicit user override |

If a prerequisite is not met, do not start. Tell the user which command to run first.

## Resume rule

1. Read `RUN.md`.
2. If `status` is `waiting-for-user`, show the item under "Open questions / waiting on user" and wait. Do not run any step.
3. If `status` is `blocked`, show the summary and the open findings, and ask the user how to proceed.
4. Otherwise, find the first step in the order above that is not `done` or `skipped`, and continue from it. A step marked `in-progress` resumes from its first unticked task.

`--from <step>` restarts from that step: set that step and every later step back to `pending` (keep `skipped` steps skipped), set `current_step`, and continue. When restarting from `build` or earlier, reset `audit_round` to 0 and clear `scores`.

## Procedure (for every step)

1. Resolve the ticket key (Global rule 1).
2. Read `RUN.md` and check the step's prerequisites.
3. Set `current_step` and `status: in-progress`, and write the file.
4. Run the step's skill.
5. Write the step's section, the front-matter changes, and the resume hint.
6. Only then move on.

## Outputs

- A consistent `RUN.md` after every step.

## Run-file updates

Every step updates: `current_step`, its own entry in `steps`, `status`, `updated_at`, its own section, and `Resume hint`.

## Failure handling

- `RUN.md` missing for a step other than Intake: tell the user to run `/tf-intake <TICKET>` first.
- `RUN.md` front matter is malformed: show the problem and ask before rewriting it.
- Any unexpected error: set `status: blocked`, write the error under "Open questions / waiting on user", write a resume hint, and stop.
