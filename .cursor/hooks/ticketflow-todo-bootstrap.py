#!/usr/bin/env python3
"""Continue Ticketflow after the first-prompt TodoWrite turn.

Cursor does not attach the todo card to the request that created it. The
first /ticketflow turn publishes todos and stops; this hook submits the
next user message so the card can appear and the workflow can resume.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

MARKER = Path(".cursor/ticketflow/_bootstrap.json")


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("{}")
        return

    if payload.get("status") != "completed":
        print("{}")
        return

    if int(payload.get("loop_count") or 0) != 0:
        print("{}")
        return

    if not MARKER.is_file():
        print("{}")
        return

    try:
        data = json.loads(MARKER.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        print("{}")
        return

    try:
        MARKER.unlink()
    except OSError:
        pass

    ticket = str(data.get("ticket") or "").strip() or "the current ticket"
    command = str(data.get("command") or "ticketflow").strip() or "ticketflow"
    message = (
        f"Continue /{command} {ticket}. "
        "The five agent-window todos are already published. "
        "Do not stop after TodoWrite. Resume from RUN.md and run the next "
        "Ticketflow step in this same agent. Call TodoWrite when a step "
        "starts or finishes."
    )
    print(json.dumps({"followup_message": message}))


if __name__ == "__main__":
    main()
