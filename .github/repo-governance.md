# Repository governance

The merge policy is: **PRs only, linear history, and a green `PR checks` gate**,
with **auto-merge** so an approved PR merges itself once CI is green.

These are GitHub *server* settings, not repo files, so they must be applied once
by a repo admin. Two equivalent routes are below — the `gh` script (fastest) and
the UI (no CLI needed). The workflow side (`ci.yml`) is already in the repo.

## What gets enforced

| Requirement            | How                                                            |
| ---------------------- | ------------------------------------------------------------- |
| Linear history         | Ruleset `required_linear_history` + squash/rebase-only merges |
| PRs required           | Ruleset `pull_request` rule (0 approvals — solo-friendly)     |
| CI must pass           | Ruleset `required_status_checks` → **`PR checks`** context    |
| Branch up to date      | `strict_required_status_checks_policy: true`                  |
| Auto-merge available   | Repo setting `allow_auto_merge`                               |
| Tidy branches          | `delete_branch_on_merge`                                      |

`PR checks` is a single aggregation job (see `ci.yml`) that depends on the
lint/test/build matrix, the consumer usage check, and benchmarks. Requiring that
one context means adding or dropping a Node version never needs a rule edit.

## Option A — apply with `gh` (run from a machine with admin + network)

```bash
gh auth status   # must be an admin of rtkelly13/mermaid-toolkit

# 1. Repo merge settings: enable auto-merge, keep history linear (no merge commits).
gh api -X PATCH repos/rtkelly13/mermaid-toolkit \
  -F allow_auto_merge=true \
  -F allow_squash_merge=true \
  -F allow_rebase_merge=true \
  -F allow_merge_commit=false \
  -F delete_branch_on_merge=true

# 2. Branch ruleset (linear history + required PR + required "PR checks").
gh api -X POST repos/rtkelly13/mermaid-toolkit/rulesets \
  --input .github/rulesets/main.json
```

To update the ruleset later, find its id with
`gh api repos/rtkelly13/mermaid-toolkit/rulesets` and
`PUT .../rulesets/<id> --input .github/rulesets/main.json`.

## Option B — apply in the UI

1. **Settings → General → Pull Requests**: tick *Allow squash merging* and
   *Allow rebase merging*, untick *Allow merge commits*, tick *Allow auto-merge*
   and *Automatically delete head branches*.
2. **Settings → Rules → Rulesets → New ruleset → Import a ruleset** → choose
   `.github/rulesets/main.json` → set enforcement to *Active* → **Create**.

## Using auto-merge

Once the repo setting is on, enable it per PR:

```bash
gh pr merge <number> --squash --auto
```

The PR then merges automatically the moment `PR checks` is green and the branch
is up to date — no manual button press.
