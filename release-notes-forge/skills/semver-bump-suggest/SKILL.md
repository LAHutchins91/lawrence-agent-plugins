---
name: semver-bump-suggest
description: "Suggest the next semver bump (major/minor/patch) from conventional-commit text and currentVersion, with rationale and breaking-change risk — local, zero-auth, no release SaaS."
version: 1.0.0
tags: [semver, version-bump, conventional-commits, release, major-minor-patch]
---

# Semver bump suggest

When the user asks what version to cut next:

1. Call **`breaking_change_scan`** on the commits since last release.
2. Call **`semver_suggest`** with `commitsText` + `currentVersion` (e.g. `1.2.3` or `v1.2.3`).
3. Report suggested version, bump kind, and rationale; escalate to MAJOR when breaking candidates are confirmed.
4. Optionally call **`release_notes_draft`** with the suggested version as `versionLabel`.

## Example prompts

- "Given commits since 1.3.0, what should the next version be?"
- "Is this a major or minor bump?"
- "Suggest semver and draft notes together"
