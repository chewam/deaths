# CLAUDE.md — chewam/mortality

This file is the canonical reference for any Claude session working on this repo. Read it before doing anything substantial.

## What this app is

A web page showing French mortality statistics from 2000 onward (INSEE data). Production: https://deaths.chewam.com.

Repo: https://github.com/chewam/mortality (transferred from `goldlescred/deaths` in April 2026).

## Current state: refactor v2 in progress

The app is being rewritten on the `alpha` branch. The work is tracked on the **[Mortality Project Board](https://github.com/orgs/chewam/projects/1)** as 8 parent Feature issues (one per "Lot") with sub-issues underneath.

**Goal**: ship `chewam/mortality` v2.0.0 — modern stack + new design — with **ISO functional behavior** vs current master.

### Branch strategy

- `master` — current 1.x, untouched during refactor.
- `alpha` — refactor target. Each sub-issue is one PR onto `alpha`.
- semantic-release publishes `2.0.0-alpha.N` from `alpha` (default config, no explicit `branches` in `.releaserc.json`).
- Final merge `alpha` → `master` ships `2.0.0` (Lot 7).

### Stack target

Decided and validated by the user — do not relitigate.

| | Current | Target |
|---|---|---|
| Framework | Next 14 (Pages) | Next 15 (Pages Router kept) |
| React | 18.2 | 19 |
| TypeScript | 4.7 | 5.x |
| Styling | SCSS + Tailwind 3 | Tailwind 4 only (purge SCSS) |
| Tests | Jest 29 | Vitest |
| E2E | none | Playwright (behavior + visual) |
| i18n | react-intl 6 | **kept** |
| Charts | chart.js + react-chartjs-2 | **SVG inline custom** (port of `NEW_VERSION/charts-*.jsx`) |
| Sentry | 7.8 | latest |

### Test strategy — three nets

These exist to guarantee no regression and to track pixel-perfect adherence.

1. **`yarn test`** — Vitest unit on business logic (`__tests__/utils/*`, calculations, gender/age filters). Frozen against snapshots of computed values from real data.
2. **`yarn e2e`** — Playwright behavior. Golden paths written against current master in Lot 0; **must pass identically on the new version** (= ISO contract).
3. **`yarn e2e:visual`** — Playwright screenshots compared to `NEW_VERSION/screenshots/*.png` (pixel-perfect target).

CI must run all three on every PR onto `alpha`.

## Pixel-perfect spec: `NEW_VERSION/`

The `NEW_VERSION/` directory is the **design reference** (a Babel-standalone HTML prototype produced by the design tool). When implementing a view, port the structure and styling from there.

| File | Purpose |
|---|---|
| `Mortality in France.html` | Entry point, fonts loaded |
| `app.jsx` | App shell, header, global filters |
| `views.jsx` | OverviewView (year detail), ComparisonView, DistributionView |
| `view-overview-grid.jsx` | OverviewGridView (years grid) |
| `charts-trend.jsx` | TrendChart (multi-year line/area) |
| `charts-monthly.jsx` | MonthlyChart (single + compare modes) |
| `charts-distribution.jsx` | DistributionChart (deaths by age) |
| `data.js` | Fake data — **DO NOT PORT**, use real services |
| `i18n.js` | Translations — port to `src/lang/{en,fr}.json` |
| `tweaks-panel.jsx` | Design exploration tool — **DO NOT PORT** |
| `screenshots/01-09*.png` | Pixel-perfect reference for visual regression |
| `uploads/` | Source/inspiration images, ignore |

### Mapping screens

| Route | NEW_VERSION view | Reference screenshot |
|---|---|---|
| `/` | overview (years grid) | `03-overview.png` |
| `/overview` | year (stats + trend + monthly + events) | `04` to `07-trend.png` |
| `/comparison` | comparison | `08-comparison.png` |
| `/distribution` | distribution | `09-distribution.png` |

## Starting and finishing a task — RUN THESE

When picking up any sub-issue, **invoke `/start-task <issue-number>` before doing anything else**. When you're done, **invoke `/finish-task <issue-number>` before declaring it done**. These are the contract for parallel sessions — every session starts and ends from the same baseline.

The skills live in `.claude/skills/`. The `SessionStart` hook in `.claude/settings.json` injects a one-line reminder of these commands into the model's context when a session opens this repo.

**`/start-task <num>`** — pre-flight checklist:

1. Loads CLAUDE.md + the issue + its parent.
2. Validates scope, deliverable, test strategy, referenced files, upstream dependencies.
3. Proposes (and applies, with your confirmation) ticket improvements if anything is fuzzy.
4. Marks the board status `In progress`.
5. Plans the implementation with TodoWrite.

**`/finish-task <num>`** — post-flight checklist:

1. Runs the test net specified in the issue, fails loudly if anything is red.
2. Checks the diff stays in scope.
3. Self-reviews against the conventions below.
4. Opens a PR onto `alpha` with `Closes #<num>`.
5. Moves the board status to `In review`.

## How to navigate work

- 8 parent issues #217–#224, one per Lot. Each is type `Feature`, labeled `lot-N`.
- 29 sub-issues #225–#253, each linked to its parent (native GitHub sub-issues), type `Task`, same label.
- Don't pick a sub-issue without checking its parent's body — the parent has the lot's overall scope and acceptance criteria.

### Lots (chronological order)

| # | Lot | Window | Note |
|---|---|---|---|
| #217 | Lot 0 — Filet de sécurité (tests before refactor) | 28/04 → 05/05 | Foundation: Playwright + golden paths + frozen calc snapshots. Everything else relies on this. |
| #218 | Lot 1 — Modernisation stack | 06/05 → 12/05 | Net 0 must keep passing. |
| #219 | Lot 2 — Fondations design (tokens, atoms, layout) | 13/05 → 18/05 | |
| #220 | Lot 3 — Charts SVG (Trend, Monthly, Distribution) | 19/05 → 25/05 | Port from `NEW_VERSION/charts-*.jsx`. |
| #221 | Lot 4 — Vues (4 routes pixel-perfect) | 26/05 → 02/06 | Visual regression vs `NEW_VERSION/screenshots/`. |
| #222 | Lot 5 — Wiring real data, filters, i18n | 03/06 → 08/06 | Plug `services/*` into new views. ISO contract verified here. |
| #223 | Lot 6 — Finitions (cleanup, a11y, perf, docs) | 09/06 → 11/06 | |
| #224 | Lot 7 — Release (alpha → master) | 12/06 | semantic-release publishes 2.0.0. |

Dates are indicative — adjust on the board (`Start date` / `Target date` fields) as work progresses.

### Parallel work

Multiple sessions can work in parallel as long as they pick **different lots** (or different sub-issues with no shared files). Coordination rules:

- One PR per sub-issue, onto `alpha`.
- PR description must include `Closes #<sub-issue>` (auto-links the PR to the issue + closes on merge).
- Before starting, set the sub-issue's `Status` to `In progress` on the board (or assign it to yourself).
- Lots have hard dependencies: **0 → {1, 2, 3} → 4 → 5 → 6 → 7**. Lots 1, 2, 3 can run in parallel after Lot 0 lands.

## Conventions

- **No Co-Authored-By Claude** in any commit, PR, or doc. Same for any other Claude attribution.
- **Comments**: write them only when the WHY is non-obvious. Don't narrate the WHAT.
- **No bypassing hooks** (`--no-verify`, `--no-gpg-sign`).
- **i18n**: every user-facing string goes through `react-intl` (`<Trans id="…">`), keys in `src/lang/{en,fr}.json`.
- **Branding/lib choices are decided** (see Stack target). Don't re-propose Recharts, Vitest alternatives, App Router, etc.

## External services — pending decisions

Don't touch unless told otherwise:

- **Sonar**: `sonar-project.properties` still references `chewam_deaths` (project key + name). Changing it breaks CI until the SonarCloud project is migrated by the user.
- **Sentry**: `sentry.properties` still references `defaults.project=chewam`. Same story.
- **Sentry token leak (URGENT)**: `sentry.properties` contains `auth.token=…` in cleartext, committed to a public repo. Awaiting user action to revoke + move to GitHub Actions secret. If you're touching that file, flag it again.

## Useful commands

```bash
# Branch
git fetch origin
git checkout alpha

# Issues
gh issue view 225 --repo chewam/mortality
gh issue list --repo chewam/mortality --label lot-0

# Project board (org chewam, project number 1)
gh project view 1 --owner chewam
```

GraphQL IDs (stable):
- Project: `PVT_kwDOEK53uc4BV7t2`
- Repo: `MDEwOlJlcG9zaXRvcnkzOTM4MDkxMjc=`
- Issue Types: Feature `IT_kwDOEK53uc4B-aD3`, Task `IT_kwDOEK53uc4B-aD1`, Bug `IT_kwDOEK53uc4B-aD2`
