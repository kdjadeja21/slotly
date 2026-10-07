# /tf-intake

Ticketflow Step 01 Intake only: fetch the Jira ticket, classify it, and create `RUN.md`.

## Arguments

`/tf-intake <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-intake/SKILL.md`.
3. Prerequisites: none.
4. Run only this step. When done, print the classification and the next command (`/tf-investigate <TICKET>` for bugs, `/tf-blueprint <TICKET>` otherwise). Do not start the next step.
