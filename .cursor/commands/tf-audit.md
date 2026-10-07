# /tf-audit

Ticketflow Step 04 Audit only: score functionality and UI/UX out of 10 and run the thermo-nuclear code quality review.

## Arguments

`/tf-audit <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-audit/SKILL.md`.
3. Prerequisites: `03-build: done`. If not, refuse and tell the user to run `/tf-build <TICKET>` first.
4. Run only this round of this step. When done, print the scores and the result. On pass, print the next command (`/tf-ship <TICKET>`). On fail, print the open findings and the next command (`/tf-build <TICKET>`, fix mode). Do not start the next step.
