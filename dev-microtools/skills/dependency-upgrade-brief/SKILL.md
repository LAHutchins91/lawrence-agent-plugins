---
name: dependency-upgrade-brief
description: >
  Produce a concise upgrade brief when the user wants to bump an npm package.
  Use npm_changelog_brief and semver_compare; cite breaking changes and risk.
version: 1.0.0
tags: [npm, semver, dependencies, upgrade]
---

# Dependency upgrade brief

When the user asks to bump, upgrade, or evaluate a package version change:

1. Identify `packageName`, current version (`fromVersion`), and target (`toVersion`, or latest).
2. Call **`semver_compare`** with `a=from`, `b=to` and note the difference type + risk note.
3. Call **`npm_changelog_brief`** with the same span.
4. Summarize for the user:
   - Risk level (major/minor/patch)
   - Notable breaking changes (if any)
   - Links (npm, compare, releases)
   - Suggested follow-ups (tests to run, call sites to grep)
5. Do **not** apply the upgrade unless the user asks; this skill is advisory.

## Example prompts

- "Should I upgrade lodash from 4.17.20 to 4.17.21?"
- "Brief me on express 4 → 5"
