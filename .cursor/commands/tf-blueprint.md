---
description: Ticketflow Step 02b Blueprint. Publishes todos on the first prompt, then writes the implementation plan as a sub-task.
argument-hint: "[TICKET]"
disable-model-invocation: true
---

# /tf-blueprint

Ticketflow Step 02b Blueprint only (improvements and new requirements): read-only implementation plan. Start this in Plan mode (Shift+Tab). The work runs in a Task sub-agent named `02 Blueprint`. You write `RUN.md`.

## Arguments

`/tf-blueprint <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

If this is the first user message in the conversation: call TodoWrite first (`merge: false`) with `intake` `completed`, `step02` `in_progress` content `02 Blueprint`, and the other three `pending`. Do not read files first. Write `.cursor/ticketflow/_bootstrap.json` as `{"ticket":"<TICKET>","command":"tf-blueprint"}`. Print `Ticketflow todos published for <TICKET>.` and **stop**.

On a later prompt, do not bootstrap. Then:

1. Call **TodoWrite** (`merge: true`, same five ids) from `RUN.md`. Set `step02` to `in_progress` with content `02 Blueprint`, and set `02-blueprint: in-progress` in `RUN.md`. Do not use `merge: false` again in this parent chat.
2. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules and Agent panel section.
3. Prerequisites: `RUN.md` exists, `01-intake: done`, and `type` is `improvement` or `new-requirement`. If intake is not done, refuse and tell the user to run `/tf-intake <TICKET>` first. If the type is `bug`, refuse and tell the user to run `/tf-investigate <TICKET>`.
4. If you are not in Plan mode, tell the user once to switch (Shift+Tab).
5. Launch a Task sub-agent (`generalPurpose`, `run_in_background` false, description exactly `02 Blueprint`). Prompt: follow `.cursor/skills/ticketflow-blueprint/SKILL.md` for `<TICKET>`; stay read-only; call TodoWrite in that sub-agent (`merge: false` first, then `merge: true`); return the `RUN.md` updates; do not commit.
6. Write `RUN.md` from the result. Run only this step. When done, call TodoWrite (`merge: true`) with `step02` `completed`, and print a short plan summary and the next command (`/tf-build <TICKET>`). If the result is `waiting-for-user`, call TodoWrite with `step02` still `in_progress` and stop. Do not start the next step.
