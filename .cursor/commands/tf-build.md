# /tf-build

Ticketflow Step 03 Build only: implement the plan task by task, with tests, performance checks, and a production build. Runs in fix mode automatically after a failed Audit.

## Arguments

`/tf-build <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-build/SKILL.md`, including `.cursor/skills/ticketflow-build/performance.md`.
3. Prerequisites: the Step 02 matching the ticket type is `done` (and, for low-confidence bugs, the user's approval is recorded). If not, refuse and tell the user to run `/tf-investigate <TICKET>` or `/tf-blueprint <TICKET>` first.
4. Run only this step. Do not commit. When done, print the check results and the next command (`/tf-audit <TICKET>`). Do not start the next step.
