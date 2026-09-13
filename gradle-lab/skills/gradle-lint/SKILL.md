---
name: gradle-lint
description: >
  Lite-lint pasted Gradle build.gradle / build.gradle.kts for missing
  plugins block, deprecated compile/runtime configurations, dynamic
  versions (+), and duplicate dependencies. Local only, no gradle, no fetch.
version: 1.0.0
tags: [gradle, build.gradle, lint, local]
---

# Gradle lint

Use **`gradle_lint_lite`** with `gradle` on pasted build.gradle / .kts (do not fetch URLs or run gradle):

- Missing `plugins { }` / `apply plugin` (warning)
- Deprecated `compile` / `runtime` / `testCompile` / `testRuntime` configurations (warning)
- Dynamic versions containing `+` or `latest.*` (warning)
- Duplicate deps by configuration + group:name (warning heuristic)

Heuristic only — not `gradle` validation / not the configuration cache. Lite DSL line scanner.

## Example prompts

- "Lint this build.gradle for deprecated compile and dynamic versions."
- "Are there duplicate dependencies in this pasted Gradle script?"
- "Does this build.gradle.kts declare a plugins block?"
