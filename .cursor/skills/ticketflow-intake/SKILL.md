---
name: ticketflow-intake
description: Ticketflow Step 01 Intake. Use when starting a Ticketflow run, when running /tf-intake, or when asked to fetch a Jira ticket and classify it as bug, improvement, or new requirement and create its RUN.md.
---

# Ticketflow Step 01: Intake

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, resume rule, and agent-panel rules apply here. Run this step in this agent. Call TodoWrite yourself. Do not launch a sub-agent.

## Purpose

Fetch the Jira ticket, classify it, create the run file, and route to the right Step 02.

## Inputs

- `<TICKET>`: Jira key, for example `PROJ-123`.

## Prerequisites

- Jira/Atlassian tools are available (shared Global rule 7). If none are found, stop and tell the user.
- No prerequisite step. If `RUN.md` already exists with `01-intake: done`, ask whether to re-run intake (overwriting the Intake section) or resume with `/ticketflow <TICKET>`.

## Procedure

1. Discover the Jira tools at runtime and fetch the ticket: key, summary, description, acceptance criteria, comments, attachments, linked issues, priority, labels, reporter, and assignee. Read only; do not write to Jira.
2. Classify the ticket as `bug`, `improvement`, or `new-requirement`, with a one-sentence reason grounded in the ticket text (issue type, wording, acceptance criteria).
   - `bug`: existing behavior is wrong compared with what is expected.
   - `improvement`: existing behavior works but should change or get better.
   - `new-requirement`: a capability that does not exist yet.
   - If the ticket is too thin or ambiguous to classify confidently, ask the user before continuing. Set `status: waiting-for-user` and write the question to the run file.
3. Record the base branch with `git branch --show-current`.
4. Create `.cursor/ticketflow/<TICKET>/RUN.md` using the schema in `ticketflow-shared`, and fill in the Intake section: summary, type, reason, and acceptance criteria as a numbered list (AC1, AC2, ...). If the ticket has no explicit acceptance criteria, write "None stated in ticket" and list them as an open question for Step 02. Do not invent them.
5. Route: `bug` goes to Step 02a (`ticketflow-investigate`). `improvement` or `new-requirement` goes to Step 02b (`ticketflow-blueprint`).

## Outputs

- `RUN.md` with the front matter and the Intake section filled in.
- A one-line classification shown to the user, with the next step.

## Run-file updates

- Front matter: `ticket`, `title`, `type`, `status: in-progress`, `current_step: 01-intake`, `steps.01-intake: done`, set the non-matching Step 02 to `skipped`, `audit_round: 0`, `base_branch`, `updated_at`.
- Intake section: 5 to 15 lines.
- Resume hint: for example `Run /tf-investigate PROJ-123 in Plan mode.`

## Failure handling

- Ticket not found or no permission: stop, report the exact error, and do not create `RUN.md`.
- Jira tools need authentication: tell the user to authenticate the Atlassian plugin, then re-run.
- Not in a git repository, or `git branch --show-current` returns nothing (detached HEAD): ask the user which base branch to use.
