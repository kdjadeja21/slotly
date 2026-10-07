# /tf-investigate

Ticketflow Step 02a Investigate only (bugs): read-only root-cause analysis with a confidence score and a fix plan. Start this in Plan mode (Shift+Tab). The work runs in a sub-agent. You write `RUN.md`.

## Arguments

`/tf-investigate <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
2. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type: bug`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is not `bug`, refuse and tell the user to run `/tf-blueprint <TICKET>`.
3. Call **TodoWrite** (`merge: false`, all five todos) from `RUN.md`. Set `step02` to `in_progress` with content `02 Investigate`, and set `02-investigate: in-progress` in `RUN.md`. Do this before the sub-agent.
4. If you are not in Plan mode, tell the user once to switch (Shift+Tab).
5. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false). Prompt: follow `.cursor/skills/ticketflow-investigate/SKILL.md` for `<TICKET>`; stay read-only; return the `RUN.md` updates; do not edit `.cursor/ticketflow/`; do not call TodoWrite.
6. Write `RUN.md` from the result. Run only this step. When done, call TodoWrite with `step02` `completed`, and print the confidence, the gate decision, and the next command (`/tf-build <TICKET>`). If the result is `waiting-for-user`, call TodoWrite with `step02` still `in_progress` and stop. Do not start the next step.
