# Performance baseline

This page captures the Lighthouse scores and bundle sizes the v2 must hold.
Updated when a change touches anything that could move these numbers (deps,
charts, data layer, layout).

## Reproduction

```bash
yarn install
yarn lhci          # runs `next build && lhci autorun` against the 4 routes
yarn build         # First Load JS table appears in the build output
```

`yarn lhci` builds for production, starts the server on port 3000, runs
Lighthouse 3× per route in **desktop emulation**, and asserts each route
scores ≥ 0.9 on the four categories. CI runs the same configuration against
the Vercel deployment URL ([.github/workflows/lighthouse.yml](../.github/workflows/lighthouse.yml)).

## Baseline — 2026-05-09 (alpha @ Lot 6.3)

Median of 3 runs, desktop preset, simulated throttling.

| Route            | Perf | A11y | Best Practices | SEO  | LCP    | CLS    | TBT   |
| ---------------- | ---- | ---- | -------------- | ---- | ------ | ------ | ----- |
| `/`              | 1.00 | 1.00 | 1.00           | 1.00 | 659 ms | 0.000  | 11 ms |
| `/overview`      | 1.00 | 0.96 | 1.00           | 1.00 | 684 ms | 0.047  | 0 ms  |
| `/comparison`    | 1.00 | 0.96 | 1.00           | 1.00 | 657 ms | 0.050  | 0 ms  |
| `/distribution`  | 1.00 | 0.96 | 1.00           | 1.00 | 659 ms | 0.042  | 20 ms |

A11y ceiling at 0.96 on `/overview`, `/comparison`, `/distribution` comes from
the `target-size` audit on the dual-range Age slider (WCAG 2.2 AA — tracked
separately). All other audits clean.

### First Load JS (gzipped, from `next build`)

| Route            | Page chunk | First Load JS |
| ---------------- | ---------- | ------------- |
| `/`              | 3.62 kB    | 176 kB        |
| `/overview`      | 2.76 kB    | 180 kB        |
| `/comparison`    | 5.03 kB    | 178 kB        |
| `/distribution`  | 4.05 kB    | 177 kB        |

Shared chunks (counted once per session):

| Chunk        | Size     |
| ------------ | -------- |
| `framework`  | 59.8 kB  |
| `main`       | 85.7 kB  |
| `_app`       | 26.2 kB  |
| CSS          | 19.7 kB  |
| other shared | 0.9 kB   |
| **total**    | 192 kB   |

**Budget: ≤ 200 kB First Load JS per route.** The current ~145 kB shared
floor is inherent to Next 15 + React 19 + Sentry SDK + react-intl runtime —
further reduction would require splitting Sentry behind a dynamic import or
swapping react-intl for a lighter messageformat library, both out of scope
for this lot.

## Bundle analyzer

```bash
yarn analyze       # opens an interactive treemap in the browser
```

Use this to spot regressions when adding dependencies or before a release.
