# /tf-blueprint

Ticketflow Step 02b Blueprint only (improvements and new requirements): read-only implementation plan. Start this in Plan mode (Shift+Tab).

## Arguments

`/tf-blueprint <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-blueprint/SKILL.md`.
3. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type` is `improvement` or `new-requirement`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is `bug`, refuse and tell the user to run `/tf-investigate <TICKET>`.
4. Run only this step. Do not edit any file other than `RUN.md`. When done, print a short plan summary and the next command (`/tf-build <TICKET>`). Do not start the next step.
