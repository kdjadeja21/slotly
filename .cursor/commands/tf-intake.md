# /tf-intake

Ticketflow Step 01 Intake only: fetch the Jira ticket, classify it, and create `RUN.md`. Runs in the parent agent.

## Arguments

`/tf-intake <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
2. Create the five agent-panel todos from `RUN.md` (or all `pending` if there is no run yet). Mark `intake` `in_progress`.
3. Follow `.cursor/skills/ticketflow-intake/SKILL.md` in this agent. Do not launch a sub-agent.
4. Prerequisites: none.
5. Run only this step. Write `RUN.md` yourself. When done, mark `intake` `completed`, rename `step02` to "02 Investigate" or "02 Blueprint", and print the classification and the next command (`/tf-investigate <TICKET>` for bugs, `/tf-blueprint <TICKET>` otherwise). Do not start the next step.
