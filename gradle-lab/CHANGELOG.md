# Changelog

All notable changes to **gradle-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `gradle_plugins_list` for `plugins { id("...") }` / `apply plugin` → `{id, version?}`.
- Add `gradle_deps_list` for `implementation` / `api` / `testImplementation` / `compileOnly` etc. → `{configuration, notation}`.
- Add `gradle_tasks_hint` for `tasks.register` / `task foo` / common aliases → `{name, type?}`.
- Add `gradle_lint_lite` for missing plugins block, deprecated `compile`/`runtime`, dynamic versions (`+`), and duplicate deps heuristic.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Gradle daemon / CLI. Lite Groovy/Kotlin DSL line scanner; ~1MB input cap. Document limits.
