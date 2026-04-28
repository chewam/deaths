---
name: finish-task
description: Post-flight checklist when wrapping up a chewam/mortality refactor v2 sub-issue. Verifies the relevant test net is green, the diff stays in scope, opens a PR onto alpha with proper description (Closes #N), moves the board status to In review. Triggers when the user invokes /finish-task <issue-number> OR signals work is done on a sub-issue ("the task is done", "I'm finishing #225", "ready to PR", "let's open the PR for #225").
---

# /finish-task

You're wrapping up a sub-issue from the **chewam/mortality refactor v2** board. Run this checklist before declaring it done.

## Argument

The user invoked `/finish-task <num>`. If missing, infer from recent context (which sub-issue you just worked on). If still unclear, ask.

## Steps

### 1. Verify the test net is green

- Re-read the sub-issue body to find which net validates this work: `yarn test` (Vitest unit), `yarn e2e` (Playwright behavior), or `yarn e2e:visual` (Playwright screenshots).
- If the body is fuzzy on the test command: this is a `/start-task` failure — fix the issue body now, then continue.
- Run the relevant command(s). If a test fails, **fix or report** — don't proceed to PR.
- Also run `yarn type-check` and `yarn lint` if they're not already part of CI.

### 2. Verify diff scope

```bash
git status
git diff --stat origin/alpha...HEAD
```

All modified files should be plausibly related to the sub-issue's scope. If unrelated changes are staged:

- **Stash them** (`git stash push -m "out-of-scope-…"`) and surface them as separate work — either a follow-up PR or a `mcp__ccd_session__spawn_task`.
- **Don't bundle** unrelated cleanups into this PR.

### 3. Self-review the diff

Re-read what you wrote. Apply the conventions in CLAUDE.md and global instructions:

- No comments that narrate WHAT (the code already says it). Comments only when WHY is non-obvious.
- No half-finished implementations.
- No defensive error handling for scenarios that can't happen.
- No premature abstractions ("3 similar lines is better").
- No `Co-Authored-By: Claude` anywhere.

### 4. Open the PR onto `alpha`

Branch naming: `<lot>/<short-slug>`, e.g. `lot-0/setup-playwright`, `lot-3/trend-chart`.

```bash
git push -u origin <branch>
gh pr create --repo chewam/mortality \
  --base alpha --head <branch> \
  --title "<concise title under 70 chars>" \
  --body "$(cat <<'EOF'
## Summary
<1-2 sentences on what changed and why>

## Test plan
- [ ] <test command from step 1> — passing locally
- [ ] CI green on alpha

## Notes
<anything reviewer should know — tradeoffs, follow-ups>

Closes #<num>
EOF
)"
```

The `Closes #<num>` line is mandatory — it auto-closes the sub-issue on merge and links the PR in the project board.

### 5. Move the board status to `In review`

```bash
# Status field id: PVTSSF_lADOEK53uc4BV7t2zhRT0Qk on project PVT_kwDOEK53uc4BV7t2
# Fetch In review option id and item id, then update.
gh api graphql -f query='query {
  node(id: "PVT_kwDOEK53uc4BV7t2") {
    ... on ProjectV2 {
      items(first: 100) { nodes { id content { ... on Issue { number } } } }
      field(name: "Status") {
        ... on ProjectV2SingleSelectField { options { id name } }
      }
    }
  }
}'
```

Then `updateProjectV2ItemFieldValue` with the `In review` option id. If marking fails, surface as a warning, don't block.

## Don't

- **Don't merge** — the user reviews and merges.
- **Don't push to `alpha` directly** — always via PR.
- **Don't close the sub-issue manually** — it'll auto-close when the PR merges (thanks to `Closes #N`).
- **Don't add `Co-Authored-By: Claude`** anywhere.
