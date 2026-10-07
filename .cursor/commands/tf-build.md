# /tf-build

Ticketflow Step 03 Build only: implement the plan task by task, with tests, performance checks, and a production build. Runs in fix mode automatically after a failed Audit. The work runs in a sub-agent. You write `RUN.md`.

## Arguments

`/tf-build <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
2. Prerequisites: the Step 02 matching the ticket type is `done` (and, for low-confidence bugs, the user's approval is recorded). If not, refuse and tell the user to run `/tf-investigate <TICKET>` or `/tf-blueprint <TICKET>` first.
3. Create the five agent-panel todos from `RUN.md`. Mark `build` `in_progress` and set `03-build: in-progress` in `RUN.md`.
4. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false). Prompt: follow `.cursor/skills/ticketflow-build/SKILL.md` and `performance.md` for `<TICKET>`; say when it is fix mode; return the `RUN.md` updates, including ticked tasks and Performance notes; do not edit `.cursor/ticketflow/`; do not commit.
5. Write `RUN.md` from the result. Run only this step. When done, mark `build` `completed`, and print the check results and the next command (`/tf-audit <TICKET>`). If the result is `blocked` or `waiting-for-user`, leave `build` `in_progress` and stop. Do not start the next step.
