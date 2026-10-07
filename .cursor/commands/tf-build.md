---
description: Ticketflow Step 03 Build. Publishes todos on the first prompt, then implements the plan.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-build

Ticketflow Step 03 Build only: implement the plan task by task, with tests, performance checks, and a production build. Runs in fix mode automatically after a failed Audit. Runs in this agent so the agent-window todo list stays visible.

## Arguments

`/tf-build <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` and `step02` `completed`, `build` `in_progress`, and `audit`/`ship` `pending`. Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-build"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: false`, all five todos) from `RUN.md`. Set `build` to `in_progress` and set `03-build: in-progress` in `RUN.md`.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: the Step 02 matching the ticket type is `done` (and, for low-confidence bugs, the user's approval is recorded). If not, refuse and tell the user to run `/tf-investigate <TICKET>` or `/tf-blueprint <TICKET>` first.
4. Follow `.cursor/skills/ticketflow-build/SKILL.md` and `performance.md` in this agent. Write `RUN.md` yourself, including ticked tasks and Performance notes. Do not commit. Do not launch a Task sub-agent.
5. Run only this step. When done, call TodoWrite with `build` `completed`, and print the check results and the next command (`/tf-audit <TICKET>`). If the result is `blocked` or `waiting-for-user`, call TodoWrite with `build` still `in_progress` and stop. Do not start the next step.
