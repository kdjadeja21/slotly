---
description: Ticketflow Step 05 Ship. Publishes todos on the first prompt, then opens the pull request.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-ship

Ticketflow Step 05 Ship only: create the branch, commit, push, and raise the pull request. Runs in this agent.

## Arguments

`/tf-ship <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake`/`step02`/`build`/`audit` `completed` and `ship` `in_progress`. Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-ship"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: false`, all five todos) from `RUN.md`. Set `ship` to `in_progress` and set `05-ship: in-progress` in `RUN.md`.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: `04-audit: done` with a passing result, or an explicit user override recorded in `RUN.md`. If not, refuse and tell the user to run `/tf-audit <TICKET>` first.
4. Follow `.cursor/skills/ticketflow-ship/SKILL.md` in this agent. Do not launch a sub-agent. You write `RUN.md`.
5. Run only this step. Never force-push and never merge. When done, call TodoWrite with `ship` `completed` and print the PR link. If you stop blocked, call TodoWrite with `ship` still `in_progress`.
