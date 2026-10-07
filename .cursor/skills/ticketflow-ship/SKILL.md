---
name: ticketflow-ship
description: Ticketflow Step 05 Ship. Use when running /tf-ship, or when an audited Ticketflow change needs a branch, commits, a push, and a raised pull request that follows the repo's branching rules. Never force-pushes or merges.
---

# Ticketflow Step 05: Ship

Read `../ticketflow-shared/SKILL.md` first. Its global rules, run-file schema, resume rule, and agent-panel rules apply here. Run this step in this agent. Call TodoWrite yourself. Do not launch a sub-agent.

## Purpose

Put the audited change on a correctly named branch, commit it, push it, and raise the pull request.

## Inputs

- `<TICKET>`: Jira key. Resolved per shared Global rule 1.

## Prerequisites

- `steps.04-audit: done` with a passing result, or an explicit user override recorded in `RUN.md`. Otherwise tell the user to run `/tf-audit <TICKET>` first.
- `git` is available, and either `gh` is authenticated (`gh auth status`) or the GitHub MCP is available.

## Procedure

1. **Discover the branching strategy.** Look, in this order, at: `CONTRIBUTING.md`, `README*`, `docs/`, `.cursor/rules/`, `.github/PULL_REQUEST_TEMPLATE*` (and `.github/PULL_REQUEST_TEMPLATE/`), commitlint and husky configs (`commitlint.config.*`, `.commitlintrc*`, `.husky/`), and the naming pattern of existing remote branches (`git branch -r`). If a rule is found, follow it exactly, including branch name format, commit format, and any required PR body content (for example model-attribution lines). If the rule's types do not match Ticketflow's types, map to the closest allowed type and say which mapping you used (for example a rule allowing only `feature|fix|chore` maps `bug` to `fix` and both `improvement` and `new-requirement` to `feature`).
2. **If no rule exists,** use this default and note in the PR body that it was applied:
   - Branch: `<prefix>/<TICKET>-<kebab-case-summary>`, at most about 60 characters, where the prefix is `bugfix/` for `bug`, `improvement/` for `improvement`, and `feature/` for `new-requirement`.
   - Commits: Conventional Commits with the ticket, for example `fix(PROJ-123): handle empty session redirect`.
3. **Sync with the latest base:**
   - The base is `base_branch` from `RUN.md`. Confirm `git branch --show-current` equals it; if not, stop and ask the user with the AskQuestion tool.
   - Run `git fetch --all --prune`.
   - If the base is behind its remote: `git stash -u`, `git pull --ff-only`, `git stash pop`. If the pull is not fast-forward or the pop conflicts, **stop and ask the user with the AskQuestion tool**. Do not resolve it yourself.
4. **Branch, commit, push:**
   - `git checkout -b <branch>` from the synced base.
   - Stage changes explicitly, excluding `.cursor/ticketflow/` (for example `git add -A -- . ':!.cursor/ticketflow'`). Check `git status` and `git diff --cached` for secrets (`.env*`, keys, tokens) before committing; if any are staged, unstage them and tell the user.
   - Commit in logical units using the discovered or default commit format.
   - `git push -u origin <branch>`. Never force-push.
5. **Raise the PR:** `gh pr create --base <base_branch>` (or the GitHub MCP if `gh` is unavailable). Use the repo's PR template if one exists. Otherwise include: ticket link, summary, root cause (bugs), what changed, how it was tested, audit scores, and screenshots if there is UI. Add any content required by the discovered rules.
6. Record the branch, commit hashes, and `pr_url` in `RUN.md`, set `status: done`, and print the PR link.

Never merge the PR and never enable auto-merge.

## Outputs

- A pushed branch and an open pull request into `base_branch`.
- The PR link, printed to the user.

## Run-file updates

- Front matter: `work_branch`, `pr_url`, `steps.05-ship: done`, `current_step: 05-ship`, `status: done`, `updated_at`.
- Ship section: branch name, which branching rule was applied (discovered rule with source, or the default), commit hashes, PR link.
- Resume hint: `Done. PR: <url>`.

## Failure handling

- Pull not fast-forward, or stash pop conflicts: stop, set `status: blocked`, explain the state (including that the stash may still hold the changes), and ask the user with the AskQuestion tool.
- Push rejected: report the error. Do not force-push.
- `gh` not authenticated and no GitHub MCP: the branch is pushed; tell the user to run `gh auth login`, then re-run `/tf-ship <TICKET>` to raise the PR.
- Branch name already exists on the remote: ask the user with the AskQuestion tool whether to reuse it or choose a new name.
