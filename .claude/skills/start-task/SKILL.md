---
name: start-task
description: Pre-flight checklist before working on a chewam/mortality refactor v2 sub-issue. Loads the global plan, fetches the issue + its parent, validates that scope/test-strategy/files are clear, proposes ticket improvements if needed, marks the board status In progress, then plans implementation. Triggers when the user invokes /start-task <issue-number> OR mentions starting work on a specific sub-issue from the refactor (e.g. "do #225", "let's start the Playwright setup", "pick up [LOT-X] …").
---

# /start-task

You're picking up a sub-issue from the **chewam/mortality refactor v2** board. Run this checklist **before writing any code**.

## Argument

The user invoked `/start-task <num>` (or implied a sub-issue). If `<num>` is missing, ask which sub-issue.

## Steps

### 1. Load the plan

- Read `CLAUDE.md` at the repo root if not already in context.
- Confirm you understand the **global goal**: ship `chewam/mortality` v2.0.0 with modern stack + new design, ISO functional behavior vs current `master`.
- Confirm the **branch**: work happens on `alpha`. If your local branch is wrong, switch (`git checkout alpha && git pull`).

### 2. Fetch the sub-issue and its parent

```bash
gh issue view <num> --repo chewam/mortality \
  --json number,title,body,labels,state,parent,url
```

If the issue has a `parent.number`, fetch the parent too — its body has the lot's overall scope and acceptance criteria, which constrain this sub-issue.

```bash
gh issue view <parent_num> --repo chewam/mortality
```

### 3. Validate the ticket has enough info

Score the sub-issue against this rubric. **Every item must be a YES**:

| Check | Pass criterion |
|---|---|
| **Concrete deliverable** | The body names a file/feature/behavior, not just a topic |
| **Test strategy specified** | The body says which of the 3 nets validates this work (`yarn test` / `yarn e2e` / `yarn e2e:visual`) AND what command/path will be added or modified |
| **Acceptance criterion** | A binary "this is done when X" — observable, not subjective |
| **Referenced files exist** | If the body references files (e.g. `NEW_VERSION/screenshots/03-overview.png`, `src/services/deaths.tsx`), they're actually present on `alpha` |
| **No upstream blocker** | Dependencies in CLAUDE.md (Lot 0 → others, etc.) are satisfied |

If any check fails → **don't start coding**. Go to step 4.

### 4. Improve the ticket if needed

If the rubric flagged gaps, propose a **rewrite of the issue body** that closes them. Keep the existing structure (Objectif / Sous-tâches / Critères d'acceptation), only add what's missing. Show the diff to the user and ask for confirmation before:

```bash
gh issue edit <num> --repo chewam/mortality --body-file -
```

For trivial gaps (typo, missing link), just propose and apply. For substantive scope changes, ask first.

### 5. Mark board status In progress

```bash
# Get item id for this issue in project #1, then update Status field
gh api graphql -f query='
mutation {
  updateProjectV2ItemFieldValue(input: {
    projectId: "PVT_kwDOEK53uc4BV7t2",
    itemId: "<item_id>",
    fieldId: "PVTSSF_lADOEK53uc4BV7t2zhRT0Qk",
    value: { singleSelectOptionId: "<In_progress_option_id>" }
  }) { projectV2Item { id } }
}'
```

If you don't have the item id or option id cached, fetch them first via:

```bash
gh api graphql -f query='query { node(id: "PVT_kwDOEK53uc4BV7t2") {
  ... on ProjectV2 {
    items(first:100) { nodes { id content { ... on Issue { number } } } }
    field(name: "Status") { ... on ProjectV2SingleSelectField { id options { id name } } }
  }
}}'
```

If marking the status fails, surface it as a warning but **don't block the work**.

### 6. Plan with TodoWrite

Create a TodoWrite list with the implementation steps. Start with **the test step** (write the test first when applicable — TDD is the default for this refactor).

### 7. Then start coding

Open the relevant files, implement, run the test net specified in step 3.

## When done with the task

- Open a PR onto `alpha` with `Closes #<num>` in the description.
- Don't add `Co-Authored-By: Claude` (see global instructions + `MEMORY.md`).
- Make sure the test net specified in step 3 is green.
- Move the board status to `In review` (or let GitHub auto-move it via PR linking — check the project workflow).

## Don't relitigate

Stack and design choices are settled (Pages Router, Tailwind 4, Vitest, Playwright, SVG inline charts, react-intl kept, etc.). See `feedback_refactor_decisions.md` in auto-memory or the "Stack target" section of CLAUDE.md.
