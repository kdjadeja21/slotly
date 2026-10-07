---
name: ticketflow-shared
description: Shared rules for every Ticketflow step. Use whenever you run /ticketflow, any /tf-* command, or any ticketflow-* skill. Defines the RUN.md schema, the resume rule, the agent-panel checklist, the step prerequisites, and the thresholds (confidence gate, audit pass score, audit round cap).
---

# Ticketflow shared rules

## Purpose

Ticketflow takes a Jira ticket from intake to a raised pull request in six steps. This skill is the single source of truth for the run file, resume behavior, step prerequisites, thresholds, and global rules. Every other `ticketflow-*` skill reads this one first.

## Inputs

- `<TICKET>`: a Jira key such as `PROJ-123`. It is the only required input.

## Prerequisites

- A git repository, with the run started from the branch the PR should target.
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
2. **Run file.** The run file is `.cursor/ticketflow/<TICKET>/RUN.md`. Read it at the start of every step. Write it in this agent at the end of every step, **before** moving to the next step. Do not send a nested agent to write it.
3. **Ask before acting.** In Step 02, if anything is unclear, ask questions first and make no changes. Do not guess.
4. **Evidence over assertion.** Every claim in a root cause, plan, or review cites `file:line`, test output, or a screenshot.
5. **UI default.** If neither the ticket nor the repo specifies a UI stack, use **shadcn/ui + Tailwind CSS**. Existing repo conventions always win over this default.
6. **Safety.** Never force-push. Never merge a PR. Never commit secrets. Never commit `.cursor/ticketflow/`. Never write to Jira unless the user explicitly asks.
7. **Jira access.** Use the Jira/Atlassian tools already available in Cursor through the installed plugin. Discover them at runtime (for example search the dynamic tool catalog for `Atlassian` or `Jira`). If none are available, stop and tell the user.
8. **Short summaries.** Keep each step's summary in `RUN.md` to 5 to 15 lines, factual.
9. **Agent-window todos.** Call TodoWrite in this conversation (all five todos, `merge: false`) at the start of `/ticketflow` or `/tf-*`, before each step, and when a step finishes or waits. On the **first user prompt** of a new chat, call TodoWrite with the hardcoded five todos, write `.cursor/ticketflow/_bootstrap.json`, and stop — Cursor does not attach the todo card to the prompt that created it; the stop hook sends the continue prompt. Do not hand Investigate, Blueprint, or Build to a nested agent.

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
  01-intake: pending | in-progress | done
  02-investigate: pending | in-progress | done | skipped
  02-blueprint: pending | in-progress | done | skipped
  03-build: pending | in-progress | done
  04-audit: pending | in-progress | done
  05-ship: pending | in-progress | done
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

## Agent panel

The todo list in the Cursor agent window is filled only by the **TodoWrite** tool in **this** conversation (the one the user has open). A checklist in chat, in a plan, or in `RUN.md` does not appear there. A nested Task agent's TodoWrite fills that nested window, not this one. Do not call TodoWrite for `--status`.

Cursor does not attach the todo card to the **first** user prompt that created it. The list appears on the **next** prompt. So the first `/ticketflow` or `/tf-*` prompt in a new chat must: (1) call TodoWrite with the hardcoded five todos, without reading files; (2) write `.cursor/ticketflow/_bootstrap.json`; (3) stop. The project `stop` hook then submits a continue prompt. Later prompts resume from `RUN.md` and must not bootstrap-stop.

Do not send Investigate, Blueprint, or Build to a nested agent. Those steps are long. Cursor shows the nested run, and if that agent is told not to call TodoWrite the list the user is watching stays empty.

Every call sends **all five** todos and `merge: false`. A one-item call is rejected, and the window stays empty. Do not print the list as a substitute for the tool call.

| id | content |
|----|---------|
| `intake` | `01 Intake` |
| `step02` | `02 Investigate`, `02 Blueprint`, or `02 Step` until Intake sets the type |
| `build` | `03 Build` |
| `audit` | `04 Audit` |
| `ship` | `05 Ship` |

Each todo has `id`, `content`, and `status`. `status` is `pending`, `in_progress`, `completed`, or `cancelled`.

Map `RUN.md` step values to todo status: `done` → `completed`, `skipped` → `cancelled`, `in-progress` → `in_progress`, `pending` → `pending`. The unused Step 02 (`skipped`) is not its own todo; `step02` is only the step that will run. If that step is `skipped`, cancel `step02`.

When to call TodoWrite:

1. On the first user prompt of a new `/ticketflow` or `/tf-*` chat: hardcoded five todos, then bootstrap-stop (see above). On later prompts: after reading `RUN.md` if it exists. On resume, finished steps are already `completed`. If there is no `RUN.md` yet, all five are `pending` and `step02` content is `02 Step`.
2. Before a step starts, call it again with that todo `in_progress`, and set that step in `RUN.md` to `in-progress`.
3. After Intake classifies the ticket, call it again with `step02` content `02 Investigate` or `02 Blueprint`, and `cancelled` if that path is `skipped`.
4. When the step finishes, write `RUN.md`, call TodoWrite with that todo `completed` (or `cancelled` if `skipped`), then print one line: `Step 03 Build complete → starting Step 04 Audit`.
5. On `waiting-for-user` or `blocked`, call TodoWrite with the current todo still `in_progress`, and stop.
6. A standalone `/tf-*` command marks earlier steps from `RUN.md` and sets only its own step to `in_progress`. It does not start the next step.

Only one todo is `in_progress` at a time. Resend the other four with their current statuses on every call.

## Procedure

Every step follows this sequence in this agent.

1. Resolve the ticket key (Global rule 1).
2. Read `RUN.md` and check the step's prerequisites.
3. Call TodoWrite with that step's todo `in_progress` (all five todos, `merge: false`). Set `current_step`, that step to `in-progress`, and `status: in-progress`, and write the file.
4. Run the step in this agent and write `RUN.md` yourself. The only nested agent is the thermo-nuclear review inside Audit. Launch it only after this agent's TodoWrite list is already showing. That nested agent must not call TodoWrite.
5. Write the step's section, the front-matter changes, and the resume hint. Call TodoWrite with that todo `completed`.
6. Print the one-line handoff. Only then move on.

## Outputs

- A consistent `RUN.md` after every step.

## Run-file updates

Every step updates: `current_step`, its own entry in `steps` (`in-progress` while running, then `done` or `skipped`), `status`, `updated_at`, its own section, and `Resume hint`. This agent writes these.

## Failure handling

- `RUN.md` missing for a step other than Intake: tell the user to run `/tf-intake <TICKET>` first.
- `RUN.md` front matter is malformed: show the problem and ask before rewriting it.
- Any unexpected error: set `status: blocked`, write the error under "Open questions / waiting on user", write a resume hint, and stop.
