---
name: tailwind-v4
description: Style UI with this repo's Tailwind CSS v4 setup. Use when editing app CSS, component classes, or PostCSS config.
paths:
  - "app/**/*.css"
  - "app/**/*.tsx"
  - "postcss.config.mjs"
---

# Tailwind CSS v4

Styling uses Tailwind v4 through `@tailwindcss/postcss` in `postcss.config.mjs`. Global CSS is `app/globals.css` (`@import "tailwindcss"` and `@theme inline`). There is no `tailwind.config.js`.

- Put design tokens in `@theme` in `app/globals.css`.
- Use utility classes in components.
- Do not add a Tailwind v3 config or `@tailwind` directives.
