# Ticketflow performance checklist

Used by `ticketflow-build` (apply) and `ticketflow-audit` (check).

Goal: good performance by default, backed by evidence, in whatever stack the project uses. The stack profiles below are **examples, not a mandatory or exhaustive list**. Use the profile that matches the detected stack, or derive the practices from that stack's official documentation. Existing repo conventions win over anything here.

## 0. Detect first

- Read the project's manifests and config, for example `package.json`, lockfiles, `pyproject.toml`, `go.mod`, `pom.xml` or `build.gradle`, `Cargo.toml`, `pubspec.yaml`, `Package.swift`, `next.config.*`, `nuxt.config.*`, `angular.json`, `svelte.config.*`, and bundler config.
- Record the language, framework and version, rendering model (SSR, SSG, SPA, native), data layer and caching in use, and the build tool.
- Only use APIs and features supported by the installed versions.

## 1. Universal principles (any stack)

- Measure before optimizing. Do not add complexity for a guessed problem, and do not ignore an obvious one.
- Do less work: avoid unnecessary computation, rendering, network calls, queries, and allocations.
- Avoid waterfalls and N+1 patterns: run independent work in parallel and batch repeated lookups.
- Cache and dedupe at the right layer, and invalidate correctly after writes.
- Keep hot paths small. Move heavy work off the main or request thread (workers, queues, background jobs).
- Bound everything: pagination, limits, timeouts, streaming for large payloads, virtualization for long lists.
- Make it feel fast: respond instantly where the outcome is predictable (optimistic updates with rollback on failure), and use skeletons and streaming for slow content.
- Ship less: minimal dependencies, tree-shaking, lazy loading and code splitting, compression, right-sized assets.
- Clean up: release listeners, subscriptions, timers, connections, and file handles.
- Make data access efficient: indexes, select only the fields needed, avoid full scans.

## 2. Stack profiles (examples; pick what matches, combine when several apply)

### React / Next.js

- **Optimistic UI:** `useOptimistic` inside a transition or form Action (React 19+), with automatic revert and a visible error on failure. Never for irreversible, payment-related, or unpredictable-outcome actions. On React 18 or lower, use the data library's optimistic mechanism (for example TanStack Query `onMutate` with rollback).
- **Concurrency:** `useTransition` for non-urgent updates, `useDeferredValue` for expensive renders driven by fast input, `useActionState` and form Actions for mutations.
- **Rendering:** derive state instead of syncing it in effects, colocate state, split contexts by update frequency, use stable keys, and memoize only with evidence (skip hand-memoization if the React Compiler is enabled).
- **Loading:** Server Components by default with `"use client"` only on the smallest leaf, no fetch waterfalls, `Suspense` with skeletons, `next/image`, `next/font`, `next/dynamic` for heavy UI, and virtualized long lists.

### Vue / Nuxt

Prefer `computed` over watchers, use `shallowRef` or `shallowReactive` for large data, `v-memo` or `v-once` for static or expensive subtrees, keyed `v-for`, and `defineAsyncComponent` for heavy components. In Nuxt, use `useAsyncData` or `useFetch` with parallel and lazy fetching, route rules for caching and hybrid rendering, and `<NuxtImg>`.

### Angular

`OnPush` change detection and signals, `@defer` blocks and lazy-loaded routes, `track` or `trackBy` in loops, no heavy functions in templates, `NgOptimizedImage`, and clean RxJS subscriptions (`async` pipe, `takeUntilDestroyed`).

### Svelte / SvelteKit

Fine-grained reactivity (runes), parallel `load` functions, prerender where possible, keyed `{#each}`, and dynamic imports for heavy code.

### Plain web / other frontends

Batch DOM reads and writes, event delegation, passive listeners, `requestAnimationFrame`, `IntersectionObserver` for lazy work, and Web Workers for CPU-heavy tasks.

### All web frontends

Animate only `transform` and `opacity`, respect `prefers-reduced-motion`, reserve space for async content to avoid layout shift, use modern image formats with explicit dimensions, and import precisely (for example named icon imports).

### Node.js backends (Express, Fastify, NestJS)

Never block the event loop (no sync fs or crypto in request paths, use worker threads for CPU work), `Promise.all` for independent I/O, connection pooling, streaming, caching (for example Redis), DataLoader or batching to prevent N+1, compression, and pagination.

### Python (Django, FastAPI, Flask)

`select_related` and `prefetch_related` (or the ORM's equivalent) to prevent N+1, proper indexes, async I/O in async frameworks and no blocking calls inside async handlers, caching, pagination, and background workers for slow tasks.

### JVM (Spring, Kotlin)

Correct JPA fetch strategies and N+1 prevention, connection pooling, caching, no blocking calls in reactive code, pagination, and virtual threads or async where appropriate.

### Go, .NET, Rails, Laravel and others

Follow the framework's own guidance. Examples: Go (limit allocations, context timeouts, no goroutine leaks, pooling), .NET (async all the way, `AsNoTracking`, projections), Rails and Laravel (eager loading, caching, queued jobs).

### Mobile

React Native (FlashList or FlatList, keep work off the JS thread, native-driven animations), Flutter (`const` widgets, `ListView.builder`, avoid unnecessary rebuilds, isolates for heavy work), iOS and Android native (keep the main thread free, lazy lists, image caching, Compose and SwiftUI recomposition and identity rules).

### Databases and APIs

Indexes matched to queries, no `SELECT *` on hot paths, batch writes, paginated responses, and sensible cache headers.

## 3. Verification (adapt to the stack)

- **Frontend:** targets on affected pages are LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, and no long tasks over 50 ms on common interactions. Use a production build with a bundle comparison against the base branch (flag a route growing by more than about 10 KB gzipped without justification), the Cursor browser tool for a Lighthouse or performance check where feasible, and the framework's devtools profiler (React Profiler, Vue devtools, Angular DevTools) to check unnecessary re-renders.
- **Backend:** latency (p95 where measurable) for affected endpoints, query count and query plans (no N+1), memory use, and no blocking calls on hot paths. Use the repo's existing benchmark, test, or profiling tools, or a simple repeatable timed request.
- **Mobile:** frame rate and jank, startup time, and memory using the platform profiler.
- Record the numbers in the `RUN.md` Performance notes and flag any regression against the base branch. If something cannot be measured, say so instead of guessing.
