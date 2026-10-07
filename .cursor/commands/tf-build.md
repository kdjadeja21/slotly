---
description: Ticketflow Step 03 Build. Publishes todos on the first prompt, then implements the plan as a sub-task.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-build

Ticketflow Step 03 Build only: implement the plan task by task, with tests, performance checks, and a production build. Runs in fix mode automatically after a failed Audit. Dependencies (shadcn, skills) are installed first by a Task sub-agent named `03 Build deps`; the work then runs in a Task sub-agent named `03 Build`. You write `RUN.md`.

## Arguments

`/tf-build <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask with the AskQuestion tool.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` and `step02` `completed`, `build` `in_progress`, and `audit`/`ship` `pending`. Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-build"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: true`, same five ids) from `RUN.md`. Set `build` to `in_progress` and set `03-build: in-progress` in `RUN.md`. Do not use `merge: false` again in this parent chat.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: the Step 02 matching the ticket type is `done` (and, for low-confidence bugs, the user's approval is recorded). If not, refuse and tell the user to run `/tf-investigate <TICKET>` or `/tf-blueprint <TICKET>` first.
4. Unless `RUN.md` already has a "Deps notes" block (fix mode), first launch a Task sub-agent (`generalPurpose`, `run_in_background` false, description exactly `03 Build deps`). Prompt: follow `.cursor/skills/ticketflow-build-deps/SKILL.md` for `<TICKET>`; call TodoWrite in that sub-agent (`merge: false` first, then `merge: true`); install only; return the Deps notes block; do not commit. Write the Deps notes into `RUN.md` under `## 03 Build`. If its Open questions are not "None", ask them with the AskQuestion tool and record the answers.
5. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false, description exactly `03 Build`). Prompt: follow `.cursor/skills/ticketflow-build/SKILL.md` and `performance.md` for `<TICKET>`; say when it is fix mode; call TodoWrite in that sub-agent (`merge: false` first, then `merge: true`); return the `RUN.md` updates, including ticked tasks and Performance notes; do not commit.
6. Write `RUN.md` from the result. Run only this step. When done, call TodoWrite (`merge: true`) with `build` `completed`, and print the check results and the next command (`/tf-audit <TICKET>`). If the result is `blocked` or `waiting-for-user`, call TodoWrite with `build` still `in_progress` and stop. Do not start the next step.
