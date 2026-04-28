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
- **Always run `yarn test` and `yarn type-check` and `yarn lint`** in addition to the issue's nominated net. These are the CI gates — running them locally is the only way to avoid round-tripping a red CI.
- **If the diff touches test infrastructure** (jest/vitest/playwright config, anything under `e2e/`, new test files, test deps), run **all three nets** (`yarn test`, `yarn e2e`, `yarn e2e:visual`). A new file in one runner can break the discovery rules of another — e.g. PR #259 added `e2e/smoke.spec.ts`, which Jest's default `**/*.spec.ts` greedily picked up and ran with the wrong runner.
- If a test fails, **fix or report** — don't proceed to PR.

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
Closes #<num>

## Summary
<1-2 sentences on what changed and why>

## Test plan
- [ ] <test command from step 1> — passing locally
- [ ] CI green on alpha

## Notes
<anything reviewer should know — tradeoffs, follow-ups>
EOF
)"
```

**Put `Closes #<num>` on the very first line of the body, above any heading.**

### Force the formal PR ↔ issue link to register

GitHub's auto-linker (the one that populates `closingIssuesReferences` and creates the `ConnectedEvent` so the PR shows up properly under the issue's *Development* section, like #259 ↔ #225) **only fires when the PR base is the repository's default branch** (`master`). Our PRs target `alpha`, so opening them with `--base alpha` leaves the keyword in the body but never creates the formal link.

The workaround: after the PR is created, flip the base to `master` and back. The linker fires on the `master` flip, and the link **persists** when you switch back to `alpha`. This is the only known way to create the link programmatically — there is no public GraphQL/REST mutation for it (the web UI's *"Link an issue"* button uses a private mutation).

```bash
# Right after gh pr create
gh pr edit <pr_num> --repo chewam/mortality --base master
sleep 3
gh pr edit <pr_num> --repo chewam/mortality --base alpha
sleep 2

# Verify — should print 1
gh api graphql -f query='query($num: Int!) { repository(owner:"chewam", name:"mortality") { pullRequest(number: $num) { closingIssuesReferences(first:1) { nodes { number } } } } }' -F num=<pr_num> --jq '.data.repository.pullRequest.closingIssuesReferences.nodes | length'
```

If the verification returns `0`, the flip didn't take — usually means GitHub didn't see the keyword. Confirm `Closes #<num>` is on the first line of the body and re-run the flip.

The branch ↔ issue link from `gh issue develop` (in `/start-task` step 6) is a *separate* artifact (the branch row in the *Development* section). Both are needed for a fully wired sub-issue.

### 5. Move the sub-issue to `In review` on the board

The PR will appear automatically in the project board's *Linked pull requests* column for this sub-issue (provided the branch was created via `gh issue develop`). Don't add the PR as a separate board item — that creates duplication.

```bash
# Cached IDs (stable for this project):
#   Project:        PVT_kwDOEK53uc4BV7t2
#   Status field:   PVTSSF_lADOEK53uc4BV7t2zhRT0Qk
#   Status options: Backlog f75ad846, Ready 08afe404, In progress 47fc9ee4,
#                   In review 4cc61d42, Done 98236657

gh api graphql -f query='
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId, itemId: $itemId, fieldId: $fieldId,
    value: { singleSelectOptionId: $optionId }
  }) { projectV2Item { id } }
}' -f projectId=PVT_kwDOEK53uc4BV7t2 \
   -f itemId="<issue_item_id>" \
   -f fieldId=PVTSSF_lADOEK53uc4BV7t2zhRT0Qk \
   -f optionId=4cc61d42
```

The sub-issue's item id is cached during `/start-task` step 5; if not, look it up via:

```bash
gh api graphql -f query='query { node(id: "PVT_kwDOEK53uc4BV7t2") {
  ... on ProjectV2 { items(first:100) { nodes { id content { ... on Issue { number } } } } }
}}'
```

If the board update fails, surface as a warning — don't block the PR from existing.

## Don't

- **Don't merge** — the user reviews and merges.
- **Don't push to `alpha` directly** — always via PR.
- **Don't close the sub-issue manually** — it'll auto-close when the PR merges (thanks to `Closes #N`).
- **Don't add `Co-Authored-By: Claude`** anywhere.
