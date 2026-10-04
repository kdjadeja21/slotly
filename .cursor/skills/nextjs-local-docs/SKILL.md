---
name: nextjs-local-docs
description: Read this repo's installed Next.js docs before changing App Router code, config, or data fetching. Use when editing app/, next.config.ts, or any Next.js API.
paths:
  - "app/**"
  - "next.config.ts"
---

# Next.js in this repo

This app is the create-next-app boilerplate. The Next.js version in `package.json` has breaking changes from older releases. `AGENTS.md` states the same constraint.

Before writing or changing Next.js code:

1. Read the matching guide in `node_modules/next/dist/docs/` (install dependencies first if that folder is missing).
2. Follow deprecation notices in those guides.
3. Keep routes in `app/`. The `@/*` path alias maps to the repo root.

Do not add pages or routes the current ticket does not ask for.
