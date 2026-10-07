---
description: Run Ticketflow from intake to a raised PR. Publishes the five-step todo list on the first prompt, then continues.
argument-hint: "[TICKET] [--from step] [--status]"
disable-model-invocation: true
---

# /ticketflow

Run the full Ticketflow workflow for a Jira ticket, from intake to a raised pull request. You are the parent. Intake, Investigate, Blueprint, and Build run as Task sub-agents (`01 Intake`, `02 Investigate`, `02 Blueprint`, `03 Build`) so desktop shows those sub-tasks. You still call TodoWrite here, and you write `RUN.md`.

## Arguments

`/ticketflow <TICKET> [--from <step>] [--status]`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.
- `--from intake|investigate|blueprint|build|audit|ship`: restart from that step.
- `--status`: print the run summary and the resume hint, and do no work. Do not call TodoWrite.

## First prompt

If this is the first user message in the conversation (and not `--status`):

1. Call **TodoWrite** as the first tool (`merge: false`) with hardcoded todos. Do not read `RUN.md` or any other file first:

   - `intake` / `01 Intake` / `in_progress`
   - `step02` / `02 Step` / `pending`
   - `build` / `03 Build` / `pending`
   - `audit` / `04 Audit` / `pending`
   - `ship` / `05 Ship` / `pending`

   Cursor does not attach the todo card to the prompt that created it. A markdown list is not this call.
2. Write `.cursor/ticketflow/_bootstrap.json` with `{"ticket":"<TICKET>","command":"ticketflow"}`.
3. Print `Ticketflow todos published for <TICKET>.` and **stop**. The project stop hook sends the continue prompt.

## Later prompts

On the continue prompt or any later message, do not write `_bootstrap.json` and do not stop after TodoWrite.

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules, run-file schema, thresholds, resume rule, and **Agent panel** section throughout.
2. If `--status` is given: read `.cursor/ticketflow/<TICKET>/RUN.md` and print the ticket, type, status, each step's state, confidence, audit round and scores, open questions, and the resume hint. Stop.
3. Call **TodoWrite** (`merge: true`, same five ids) from `RUN.md` if it exists; otherwise keep the hardcoded list. Then continue. Do not use `merge: false` again — that hides the card on desktop.
4. If `--from <step>` is given: apply the `--from` reset described in `ticketflow-shared`, call TodoWrite again from the reset file, then continue from that step.
5. Otherwise create or resume the run:
   - No `RUN.md`: start at Step 01.
   - `RUN.md` exists: apply the resume rule from `ticketflow-shared`. If `status` is `waiting-for-user` or `blocked`, show what is pending, call TodoWrite with that step's todo `in_progress`, and wait.
6. You write `RUN.md`. Before each step, call TodoWrite with that todo `in_progress` (all five, `merge: true`) and set that step to `in-progress` in `RUN.md`.

| Step | Where it runs | Skill |
|------|----------------|-------|
| 01 Intake | Task sub-agent, description `01 Intake` | `.cursor/skills/ticketflow-intake/SKILL.md` |
| 02a Investigate (bug) | Task sub-agent, description `02 Investigate` | `.cursor/skills/ticketflow-investigate/SKILL.md` |
| 02b Blueprint (improvement, new-requirement) | Task sub-agent, description `02 Blueprint` | `.cursor/skills/ticketflow-blueprint/SKILL.md` |
| 03 Build | Task sub-agent, description `03 Build` | `.cursor/skills/ticketflow-build/SKILL.md` |
| 04 Audit | This agent, plus the thermo-nuclear nested agent for check 3 | `.cursor/skills/ticketflow-audit/SKILL.md` |
| 05 Ship | This agent | `.cursor/skills/ticketflow-ship/SKILL.md` |

7. Launch Intake, Investigate, Blueprint, and Build with the Task tool (`generalPurpose`, `run_in_background` false). The Task `description` must be the step title (`01 Intake`, `02 Investigate`, `02 Blueprint`, `03 Build`) — desktop shows those as sub-tasks. Prompt: follow the step skill for `<TICKET>`; call TodoWrite in the sub-agent (`merge: false` on its first call, then `merge: true`); return the `RUN.md` updates; do not commit. You still call TodoWrite in this parent (`merge: true`) before launching the Task. The parent writes `RUN.md` when the Task returns.
8. After Intake, call TodoWrite with `step02` content `02 Investigate` or `02 Blueprint`.
9. Routing:
   - After Intake: `bug` goes to Investigate; `improvement` or `new-requirement` goes to Blueprint.
   - After Investigate: confidence above `CONFIDENCE_GATE` goes to Build; otherwise wait for the user's approval, then Build.
   - After Blueprint: Build.
   - After Build: Audit.
   - After Audit: pass goes to Ship; fail goes back to Build in fix mode, then Audit again, up to `MAX_AUDIT_ROUNDS` rounds, then `blocked` and ask the user. Call TodoWrite with the Build todo `pending`, then again `in_progress`, for each fix round.
10. When a step finishes, call TodoWrite with its todo `completed` (or `cancelled` if `skipped`), then print one progress line, for example `Step 03 Build complete → starting Step 04 Audit`.
11. Steps 02a and 02b are designed for Plan mode. If you are not in Plan mode, tell the user once to switch (Shift+Tab), and stay read-only in that step either way.
12. Stop whenever a step sets `status` to `waiting-for-user` or `blocked`, call TodoWrite with that todo `in_progress`, and show the pending question or approval.
13. Audit's thermo-nuclear review is an additional nested agent. Call TodoWrite in this parent before launching it. That nested agent must not call TodoWrite. Intake, Investigate, Blueprint, and Build stay Task sub-agents as above.
