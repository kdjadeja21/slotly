# /tf-blueprint

Ticketflow Step 02b Blueprint only (improvements and new requirements): read-only implementation plan. Start this in Plan mode (Shift+Tab). The work runs in a sub-agent. You write `RUN.md`.

## Arguments

`/tf-blueprint <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
2. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type` is `improvement` or `new-requirement`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is `bug`, refuse and tell the user to run `/tf-investigate <TICKET>`.
3. Create the five agent-panel todos from `RUN.md`. Mark `step02` `in_progress` (label "02 Blueprint") and set `02-blueprint: in-progress` in `RUN.md`.
4. If you are not in Plan mode, tell the user once to switch (Shift+Tab).
5. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false). Prompt: follow `.cursor/skills/ticketflow-blueprint/SKILL.md` for `<TICKET>`; stay read-only; return the `RUN.md` updates; do not edit `.cursor/ticketflow/`.
6. Write `RUN.md` from the result. Run only this step. When done, mark `step02` `completed`, and print a short plan summary and the next command (`/tf-build <TICKET>`). If the result is `waiting-for-user`, leave `step02` `in_progress` and stop. Do not start the next step.
