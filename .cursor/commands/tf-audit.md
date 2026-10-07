# /tf-audit

Ticketflow Step 04 Audit only: score functionality and UI/UX out of 10 in this agent, and run the thermo-nuclear review as its own sub-agent.

## Arguments

`/tf-audit <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
2. Prerequisites: `03-build: done`. If not, refuse and tell the user to run `/tf-build <TICKET>` first.
3. Call **TodoWrite** (`merge: false`, all five todos) from `RUN.md`. Set `audit` to `in_progress` and set `04-audit: in-progress` in `RUN.md`. Do this before the thermo-nuclear sub-agent.
4. Follow `.cursor/skills/ticketflow-audit/SKILL.md` in this agent. Check 3 must be the `thermo-nuclear-code-quality-review` sub-agent, as that skill describes. You write `RUN.md`.
5. Run only this round of this step. When done, call TodoWrite with `audit` `completed` on pass, or `pending` on fail (Build will run again). Print the scores and the result. On pass, print the next command (`/tf-ship <TICKET>`). On fail, print the open findings and the next command (`/tf-build <TICKET>`, fix mode). Do not start the next step. If the round cap blocks the run, call TodoWrite with `audit` still `in_progress`. The thermo-nuclear sub-agent must not call TodoWrite.
