# /ticketflow

Run the full Ticketflow workflow for a Jira ticket, from intake to a raised pull request. You are the parent agent. The user watches the agent-panel checklist, not only `RUN.md`.

## Arguments

`/ticketflow <TICKET> [--from <step>] [--status]`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.
- `--from intake|investigate|blueprint|build|audit|ship`: restart from that step.
- `--status`: print the run summary and the resume hint, and do no work. Do not create the agent-panel checklist.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules, run-file schema, thresholds, resume rule, and **Agent panel** section throughout.
2. If `--status` is given: read `.cursor/ticketflow/<TICKET>/RUN.md` and print the ticket, type, status, each step's state, confidence, audit round and scores, open questions, and the resume hint. Stop.
3. Create the five agent-panel todos (`intake`, `step02`, `build`, `audit`, `ship`) from `RUN.md`, using the mapping in the Agent panel section. On a new run, all five start `pending` and `step02` is labeled "02 Step".
4. If `--from <step>` is given: apply the `--from` reset described in `ticketflow-shared`, refresh the todos from the reset file, then continue from that step.
5. Otherwise create or resume the run:
   - No `RUN.md`: start at Step 01.
   - `RUN.md` exists: apply the resume rule from `ticketflow-shared`. If `status` is `waiting-for-user` or `blocked`, show what is pending, leave that step's todo `in_progress`, and wait.
6. You write `RUN.md`. Sub-agents do not. Before each step, mark its todo `in_progress` and set that step to `in-progress` in `RUN.md`.

| Step | Where it runs | Skill |
|------|----------------|-------|
| 01 Intake | Parent | `.cursor/skills/ticketflow-intake/SKILL.md` |
| 02a Investigate (bug) | Sub-agent | `.cursor/skills/ticketflow-investigate/SKILL.md` |
| 02b Blueprint (improvement, new-requirement) | Sub-agent | `.cursor/skills/ticketflow-blueprint/SKILL.md` |
| 03 Build | Sub-agent | `.cursor/skills/ticketflow-build/SKILL.md` |
| 04 Audit | Parent, plus the thermo-nuclear sub-agent for check 3 | `.cursor/skills/ticketflow-audit/SKILL.md` |
| 05 Ship | Parent | `.cursor/skills/ticketflow-ship/SKILL.md` |

7. **Sub-agent call** (Investigate, Blueprint, Build): use the Task tool with `subagent_type` `generalPurpose` and `run_in_background` false. The prompt must include the ticket key, the absolute path of the skill, `read-only` for Investigate and Blueprint, fix mode when Build is a re-run, and this rule: do the work, return the `RUN.md` updates, do not edit `.cursor/ticketflow/`, do not commit. When it returns, write `RUN.md` from that result before the next step. If it returns `waiting-for-user` or `blocked`, write that, leave the todo `in_progress`, and stop.
8. After Intake, rename `step02` to "02 Investigate" or "02 Blueprint".
9. Routing:
   - After Intake: `bug` goes to Investigate; `improvement` or `new-requirement` goes to Blueprint.
   - After Investigate: confidence above `CONFIDENCE_GATE` goes to Build; otherwise wait for the user's approval, then Build.
   - After Blueprint: Build.
   - After Build: Audit.
   - After Audit: pass goes to Ship; fail goes back to Build in fix mode, then Audit again, up to `MAX_AUDIT_ROUNDS` rounds, then `blocked` and ask the user. Set the Build todo back to `pending` and then `in_progress` for each fix round.
10. When a step finishes, mark its todo `completed` (or `cancelled` if `skipped`), then print one progress line, for example `Step 03 Build complete → starting Step 04 Audit`.
11. Steps 02a and 02b are designed for Plan mode. If you are not in Plan mode, tell the user once to switch (Shift+Tab). The sub-agent stays read-only either way.
12. Stop whenever a step sets `status` to `waiting-for-user` or `blocked`, leave that todo `in_progress`, and show the pending question or approval.
