# Changelog

All notable changes to **pom-xml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `pom_coords` for pom.xml text → `{groupId?, artifactId?, version?, packaging?, parent?}`.
- Add `pom_deps_list` for project `<dependencies>` → `{groupId, artifactId, version?, scope?, optional?}`.
- Add `pom_plugins_list` for build `<plugins>` → `{groupId?, artifactId, version?}`.
- Add `pom_lint_lite` for missing coords, SNAPSHOT version notes, duplicate deps, and missing version on non-managed deps (heuristic vs pasted dependencyManagement).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Maven CLI. Lite XML tag extractor (not a full XML parser / not Maven); ~1MB input cap. Document limits.
