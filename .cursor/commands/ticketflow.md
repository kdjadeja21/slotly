# /ticketflow

Run the full Ticketflow workflow for a Jira ticket, from intake to a raised pull request.

## Arguments

`/ticketflow <TICKET> [--from <step>] [--status]`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.
- `--from intake|investigate|blueprint|build|audit|ship`: restart from that step.
- `--status`: print the run summary and the resume hint, and do no work.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules, run-file schema, thresholds, and resume rule throughout.
2. If `--status` is given: read `.cursor/ticketflow/<TICKET>/RUN.md` and print the ticket, type, status, each step's state, confidence, audit round and scores, open questions, and the resume hint. Stop.
3. If `--from <step>` is given: apply the `--from` reset described in `ticketflow-shared`, then continue from that step.
4. Otherwise create or resume the run:
   - No `RUN.md`: start at Step 01.
   - `RUN.md` exists: apply the resume rule from `ticketflow-shared`. If `status` is `waiting-for-user` or `blocked`, show what is pending and wait.
5. Execute the steps in order. For each step, follow its skill:

| Step | Skill |
|------|-------|
| 01 Intake | `.cursor/skills/ticketflow-intake/SKILL.md` |
| 02a Investigate (bug) | `.cursor/skills/ticketflow-investigate/SKILL.md` |
| 02b Blueprint (improvement, new-requirement) | `.cursor/skills/ticketflow-blueprint/SKILL.md` |
| 03 Build | `.cursor/skills/ticketflow-build/SKILL.md` |
| 04 Audit | `.cursor/skills/ticketflow-audit/SKILL.md` |
| 05 Ship | `.cursor/skills/ticketflow-ship/SKILL.md` |

6. Routing:
   - After Intake: `bug` goes to Investigate; `improvement` or `new-requirement` goes to Blueprint.
   - After Investigate: confidence above `CONFIDENCE_GATE` goes to Build; otherwise wait for the user's approval, then Build.
   - After Blueprint: Build.
   - After Build: Audit.
   - After Audit: pass goes to Ship; fail goes back to Build in fix mode, then Audit again, up to `MAX_AUDIT_ROUNDS` rounds, then `blocked` and ask the user.
7. Update `RUN.md` at the end of each step, before starting the next one.
8. Between steps, print one progress line, for example `Step 03 Build complete → starting Step 04 Audit`.
9. Steps 02a and 02b are designed for Plan mode. If you reach one and are not in Plan mode, tell the user once to switch (Shift+Tab), and stay read-only in that step either way.
10. Stop whenever a step sets `status` to `waiting-for-user` or `blocked`, and show the pending question or approval.
