---
description: Ticketflow Step 02b Blueprint. Publishes todos on the first prompt, then writes the implementation plan.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-blueprint

Ticketflow Step 02b Blueprint only (improvements and new requirements): read-only implementation plan. Start this in Plan mode (Shift+Tab). Runs in this agent so the agent-window todo list stays visible.

## Arguments

`/tf-blueprint <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` `completed`, `step02` `in_progress` content `02 Blueprint`, and the other three `pending`. Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-blueprint"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: false`, all five todos) from `RUN.md`. Set `step02` to `in_progress` with content `02 Blueprint`, and set `02-blueprint: in-progress` in `RUN.md`.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type` is `improvement` or `new-requirement`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is `bug`, refuse and tell the user to run `/tf-investigate <TICKET>`.
4. If you are not in Plan mode, tell the user once to switch (Shift+Tab).
5. Follow `.cursor/skills/ticketflow-blueprint/SKILL.md` in this agent. Stay read-only. Write `RUN.md` yourself. Do not launch a Task sub-agent.
6. Run only this step. When done, call TodoWrite with `step02` `completed`, and print a short plan summary and the next command (`/tf-build <TICKET>`). If the result is `waiting-for-user`, call TodoWrite with `step02` still `in_progress` and stop. Do not start the next step.
