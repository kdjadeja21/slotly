---
name: ticketflow-design-system
description: Design system standard for Ticketflow Build. Use for any UI work in /tf-build. Detects an existing design system, bootstraps shadcn/ui + Tailwind CSS v4 when there is none, and sets the quality bar for tokens, components, states, accessibility, and motion (CSS, Motion, GSAP).
---

# Ticketflow Design System

Used by `ticketflow-build` step 4 for every UI change. Read `../ticketflow-shared/SKILL.md` first. Also follow `../tailwind-v4/SKILL.md`. Scope rules still apply: implement only what the ticket says, and never invent copy, logos, counts, or quotes.

## 1. Detect

Check for `components.json`, `components/ui/`, `lib/utils.ts`, a `@theme` block with semantic tokens in the global CSS, and any UI library in `package.json`.

- **Design system exists:** follow it. Reuse its components and tokens. Skip sections 2 and 3. Still apply sections 4 to 6.
- **None exists:** bootstrap (section 2).
- Record the decision in the Build notes of `RUN.md`: `Design system: <existing X | bootstrapped shadcn/ui>`.

## 2. Bootstrap shadcn/ui + Tailwind v4

1. Read the relevant guide in `node_modules/next/dist/docs/` (see `AGENTS.md`). This Next.js version differs from older ones.
2. Confirm Tailwind v4 is set up through `@tailwindcss/postcss`. Do not add a `tailwind.config.js` or `@tailwind` directives.
3. Run `npx shadcn@latest init` (CSS variables on, `cn` helper, `lucide-react` icons). Use the shadcn MCP or `npx shadcn@latest docs <component>` for current APIs.
4. Add only the components the plan needs: `npx shadcn@latest add <name>`. Do not bulk-add the registry.
5. If the plan did not list a dependency (shadcn itself, `motion`, `gsap`), ask before adding it, per the Build failure-handling rule.
6. Keep the changes small. Do not restyle pages the ticket does not touch.

## 3. Tokens

Define tokens once in the global CSS (`app/globals.css`):

- Semantic variables in `:root` and `.dark`: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius`.
- Expose them with `@theme inline` so utilities like `bg-primary` and `text-muted-foreground` work.
- Use OKLCH colors. Choose a restrained palette: one brand hue, neutral surfaces, one accent.
- Load fonts with `next/font` and set `--font-sans` and `--font-mono`. Replace any leftover `Arial` body font.
- Use one radius scale, one spacing rhythm (4px base), and a type scale of about 5 sizes.
- Support light and dark. Only add a theme toggle if the ticket asks for one.

## 4. Quality bar

- **Hierarchy:** one clear primary action per view. Size, weight, and color carry the order. Do not rely on borders alone.
- **Layout:** consistent spacing, a max content width, aligned baselines. Responsive from 320px up. Mobile first.
- **States:** every interactive element has default, hover, focus-visible, active, disabled. Every data view has loading (skeleton), empty, and error states.
- **Accessibility:** text contrast at least 4.5:1 (3:1 for large text and UI). Visible focus rings via `ring` token. Touch targets at least 44px. Labels on inputs, correct semantics, full keyboard use, `aria-*` only where native HTML is not enough.
- **Craft:** consistent icon size and stroke, no layout shift, tabular numbers for numeric data, balanced text wrapping on headings (`text-balance`).

## 5. shadcn + Tailwind rules

- Use shadcn components as the base. Extend variants with `cva` and merge classes with `cn`.
- Use semantic tokens (`bg-background`, `text-foreground`, `border-border`). Do not use raw hex or palette colors in components.
- Edit the component file in `components/ui` for shared changes. Do not duplicate a component under another name.
- Avoid arbitrary values (`w-[213px]`) unless there is no token. Prefer `gap` and `grid` over margin hacks.
- Server Components by default. Add `"use client"` only to the smallest component that needs it.

## 6. Motion

Motion must clarify, not decorate. It is optional; add it only where it helps and the ticket or plan allows it.

| Need | Tool |
|------|------|
| Hover, focus, simple state changes | CSS transitions (`transition-colors`, `transition-transform`) |
| Enter/exit, layout changes, gestures, shared-element transitions | `motion` (Framer Motion, `motion/react`) |
| Complex timelines, scroll choreography, SVG sequencing | GSAP (`gsap`, `@gsap/react` `useGSAP`) |

Rules:

- Animate only `transform` and `opacity`. Never animate width, height, top, or left.
- Durations 150 to 300ms for UI, up to 500ms for larger transitions. Use ease-out for entering, ease-in-out for moving.
- Respect `prefers-reduced-motion` (`motion-reduce:` utilities or `useReducedMotion`). Disable non-essential movement.
- Keep animated components client-side and small. Import `motion` with `LazyMotion` and `domAnimation` and the `m` component to cut bundle size. Load GSAP only on routes that need it, and clean up with `useGSAP`.
- Never use both libraries for the same element. Check the bundle impact with `../ticketflow-build/performance.md` section 3.
- If `emil-design-eng` or `animate` skills are installed, apply them as well.

## Checklist

- [ ] Existing design system detected, or shadcn/ui bootstrapped and recorded
- [ ] Semantic tokens only, light and dark correct
- [ ] All states present: hover, focus, disabled, loading, empty, error
- [ ] Contrast, focus, labels, keyboard, touch targets verified
- [ ] Responsive at 320px, 768px, 1280px
- [ ] Motion limited to transform and opacity, reduced motion respected
- [ ] No invented content; no dependencies added without approval
