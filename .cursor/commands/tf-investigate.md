# /tf-investigate

Ticketflow Step 02a Investigate only (bugs): read-only root-cause analysis with a confidence score and a fix plan. Start this in Plan mode (Shift+Tab).

## Arguments

`/tf-investigate <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-investigate/SKILL.md`.
3. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type: bug`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is not `bug`, refuse and tell the user to run `/tf-blueprint <TICKET>`.
4. Run only this step. Do not edit any file other than `RUN.md`. When done, print the confidence, the gate decision, and the next command (`/tf-build <TICKET>`). Do not start the next step.
