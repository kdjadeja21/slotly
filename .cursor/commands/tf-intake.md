---
description: Ticketflow Step 01 Intake. Publishes the five-step todo list on the first prompt, then classifies the Jira ticket.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-intake

Ticketflow Step 01 Intake only: fetch the Jira ticket, classify it, and create `RUN.md`. Runs in this agent.

## Arguments

`/tf-intake <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` `in_progress` and the other four steps `pending` (`step02` content `02 Step`). Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-intake"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: true`, same five ids) from `RUN.md` (or keep the first-prompt list). Set `intake` to `in_progress`. Do not use `merge: false` again — that hides the card on desktop.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Follow `.cursor/skills/ticketflow-intake/SKILL.md` in this agent. Do not launch a sub-agent.
4. Prerequisites: none.
5. Run only this step. Write `RUN.md` yourself. When done, call TodoWrite again with `intake` `completed` and `step02` content `02 Investigate` or `02 Blueprint`, and print the classification and the next command (`/tf-investigate <TICKET>` for bugs, `/tf-blueprint <TICKET>` otherwise). Do not start the next step.
