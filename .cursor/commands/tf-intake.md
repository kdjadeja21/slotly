---
description: Ticketflow Step 01 Intake. Publishes the five-step todo list on the first prompt, then classifies the Jira ticket.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-intake

Ticketflow Step 01 Intake only: fetch the Jira ticket, classify it, and create `RUN.md`. The work runs in a Task sub-agent named `01 Intake`. You write `RUN.md`.

## Arguments

`/tf-intake <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` `in_progress` and the other four steps `pending` (`step02` content `02 Step`). Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-intake"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: true`, same five ids) from `RUN.md` (or keep the first-prompt list). Set `intake` to `in_progress`. Do not use `merge: false` again — that hides the card on desktop.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false, description exactly `01 Intake`). Prompt: follow `.cursor/skills/ticketflow-intake/SKILL.md` for `<TICKET>`; call TodoWrite in that sub-agent (`merge: false` first, then `merge: true`); return the `RUN.md` updates; do not commit.
4. Prerequisites: none.
5. Write `RUN.md` from the result. Run only this step. When done, call TodoWrite (`merge: true`) with `intake` `completed` and `step02` content `02 Investigate` or `02 Blueprint`, and print the classification and the next command (`/tf-investigate <TICKET>` for bugs, `/tf-blueprint <TICKET>` otherwise). Do not start the next step.
