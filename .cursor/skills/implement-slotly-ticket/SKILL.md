---
name: implement-slotly-ticket
description: Implement a SLOTLY Jira ticket exactly as written. Use when the task is a SLOTLY ticket, a kdjadeja.atlassian.net issue, or a request to build only what a Slotly ticket specifies.
---

# Implement a SLOTLY ticket

Slotly is a scheduling product: a host shares a link, someone books a time, and the booking lands on the host calendar. That sentence is context. Product behavior comes from the ticket.

## Steps

1. Read the ticket at `https://kdjadeja.atlassian.net/browse/SLOTLY-<number>` (summary, description, and acceptance criteria). If a detail is missing, ask. Do not fill the gap.
2. Implement only what that ticket says. Do not invent product behavior, logos, counts, or quotes.
3. Do not pull scope from other SLOTLY tickets, from Cal.com, or from a guessed MVP.
4. Use one branch for this ticket. Follow `.cursor/rules/branching.mdc`.
5. Open the pull request into `main` and link `https://kdjadeja.atlassian.net/browse/SLOTLY-<number>`.
