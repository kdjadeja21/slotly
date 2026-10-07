# /tf-investigate

Ticketflow Step 02a Investigate only (bugs): read-only root-cause analysis with a confidence score and a fix plan. Start this in Plan mode (Shift+Tab). Runs in this agent so the agent-window todo list stays visible.

## Arguments

`/tf-investigate <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Call **TodoWrite** first (`merge: false`, all five todos) from `RUN.md`. Set `step02` to `in_progress` with content `02 Investigate`, and set `02-investigate: in-progress` in `RUN.md`.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type: bug`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is not `bug`, refuse and tell the user to run `/tf-blueprint <TICKET>`.
4. If you are not in Plan mode, tell the user once to switch (Shift+Tab).
5. Follow `.cursor/skills/ticketflow-investigate/SKILL.md` in this agent. Stay read-only. Write `RUN.md` yourself. Do not launch a Task sub-agent.
6. Run only this step. When done, call TodoWrite with `step02` `completed`, and print the confidence, the gate decision, and the next command (`/tf-build <TICKET>`). If the result is `waiting-for-user`, call TodoWrite with `step02` still `in_progress` and stop. Do not start the next step.
