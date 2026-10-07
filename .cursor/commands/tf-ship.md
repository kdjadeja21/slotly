# /tf-ship

Ticketflow Step 05 Ship only: create the branch, commit, push, and raise the pull request.

## Arguments

`/tf-ship <TICKET>`

- `<TICKET>`: Jira key, for example `PROJ-123`. If omitted, use the most recently updated run in `.cursor/ticketflow/`; if there is none, ask.

## Instructions

1. Read `.cursor/skills/ticketflow-shared/SKILL.md` and follow its global rules.
2. Follow `.cursor/skills/ticketflow-ship/SKILL.md`.
3. Prerequisites: `04-audit: done` with a passing result, or an explicit user override recorded in `RUN.md`. If not, refuse and tell the user to run `/tf-audit <TICKET>` first.
4. Run only this step. Never force-push and never merge. When done, print the PR link.
