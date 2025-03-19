# Changelog Guide

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs in our monorepo.

## Adding a Changeset

When you make a change that should be included in the changelog, you need to create a changeset. This should be done for:

- New features
- Bug fixes
- Breaking changes
- Significant refactors or improvements

To create a changeset:

```bash
pnpm changeset
```

This will prompt you to:

1. Select the packages that have been changed
2. Choose the type of version bump for each package:
   - `major` for breaking changes
   - `minor` for new features
   - `patch` for bug fixes
3. Write a description of the changes

Your description should be clear and concise, explaining what changed and why.

## Versioning Workflow

Our versioning workflow is as follows:

1. When PRs with changesets are merged to `main`, a "Version Packages" PR is automatically created
2. This PR updates package versions according to the changesets and updates the changelogs
3. When this PR is merged, the updated packages will be published to npm

## Changeset Examples

### New Feature

```md
---
"@oraichain/oraidex-evm-sdk": minor
---

Added support for limit orders in the SDK
```

### Bug Fix

```md
---
"@oraichain/oraidex-evm-widget": patch
---

Fixed token balance display issue in the swap widget
```

### Breaking Change

```md
---
"@oraichain/oraidex-evm-sdk": major
---

Refactored transaction functions to use async/await instead of callbacks
```

## Skipping Changeset Checks

In rare cases, you may need to skip the changeset check:

```bash
git commit --no-verify
```

However, this should be avoided for any meaningful changes that affect users of the packages. 