---
name: ticketflow-build-deps
description: Ticketflow Step 03 Build, deps sub-step. Use when running /tf-build or /ticketflow before the Build sub-agent writes code. Installs shadcn/ui, motion, gsap, and the emilkowalski skills when the plan has UI work, and reports what was installed.
---

# Ticketflow Step 03: Build deps

Read `../ticketflow-shared/SKILL.md` first. This sub-step runs as its own Task sub-agent (description `03 Build deps`) **before** `03 Build`. It only installs dependencies and skills. It does not write application code and does not commit.

When you are the **sub-agent**: call TodoWrite first (`merge: false`, the five Ticketflow todos, `build` `in_progress`) and again with `merge: true` when you finish. The parent writes `RUN.md`.

## Pre-approved installs

No approval is needed for these when the plan has UI work (shared Global rule 5):

- shadcn/ui (`npx shadcn@latest init`, `npx shadcn@latest add <name>`) and its supporting packages (`lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`)
- `motion` and `gsap` (with `@gsap/react`) only when the plan needs motion that CSS cannot do, per section 6 of `../ticketflow-design-system/SKILL.md`
- the `emilkowalski/skills` skills

Any other new dependency is not pre-approved. Do not install it. Return it as an open question so the parent asks with the AskQuestion tool.

## Procedure

1. Read the plan in `RUN.md` (Intake and the Build task list). Decide **UI work: yes or no**. UI work means the plan touches components, pages, styles, or layouts.
2. If no UI work, install nothing. Return `Deps notes: skipped, no UI work`.
3. Detect the design system following section 1 of `../ticketflow-design-system/SKILL.md` (`components.json`, `components/ui/`, `lib/utils.ts`, `@theme` in the global CSS, UI libraries in `package.json`).
   - Existing design system that is not shadcn: install nothing for it. Record `Design system: existing <X>`.
   - None exists: bootstrap with section 2 of the design-system skill. Read the Next.js guide in `node_modules/next/dist/docs/` first (see `AGENTS.md`), confirm Tailwind v4 via `@tailwindcss/postcss`, run `npx shadcn@latest init`, then `npx shadcn@latest add <name>` for only the components the plan needs.
   - shadcn already present: add only the missing components the plan needs.
4. Motion: if the plan needs enter/exit, layout, or gesture animation, install `motion`; for complex timelines, install `gsap` and `@gsap/react`. Otherwise skip.
5. Skills: if `emil-design-eng` and `animate` are not installed (check `.agents/skills/`, `.cursor/skills/`, and `~/.cursor/skills*`), run `npx skills@latest add emilkowalski/skills`. If it fails, record the failure and continue.
6. Verify: `components.json` and the added `components/ui/*` files exist, `package.json` lists the new packages, and the lint and typecheck commands from `package.json` still run. Fix breakage caused by the install.
7. Idempotent: skip anything already installed. Re-running changes nothing.

## Output

Return this block for the parent to write under `## 03 Build` in `RUN.md`:

```markdown
### Deps notes
- UI work: yes | no
- Design system: <existing X | bootstrapped shadcn/ui | none needed>
- Installed: <packages, shadcn components, skills; or "None">
- Skipped: <what and why; or "None">
- Failed: <command and error; or "None">
- Open questions: <non-pre-approved dependencies needed; or "None">
```

## Failure handling

- An install command fails: record it under Failed, leave the repo in a working state (revert partial edits you caused), and return. Do not block the whole run unless the plan cannot be built without it. In that case say so in Open questions.
- Network unavailable: record it and return.
