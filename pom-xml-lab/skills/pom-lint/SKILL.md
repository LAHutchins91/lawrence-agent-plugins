---
name: pom-lint
description: >
  Lite-lint pasted Maven pom.xml for missing project coords, SNAPSHOT
  versions, duplicate dependencies, and missing version on deps not
  listed in pasted dependencyManagement. Local only, no mvn, no fetch.
version: 1.0.0
tags: [maven, pom, xml, lint, local]
---

# POM lint

Use **`pom_lint_lite`** with `pom` on pasted pom.xml (do not fetch URLs or run mvn):

- Missing `artifactId` / `groupId` / `version` when no parent (error); inherited notes when parent present (info)
- SNAPSHOT versions on project, parent, or deps (info)
- Duplicate `groupId:artifactId` dependencies (warning)
- Missing dep `<version>` not covered by pasted `dependencyManagement` (warning heuristic)

Heuristic only — not `mvn validate` / not effective POM. Lite XML tag extractor.

## Example prompts

- "Lint this pom.xml for missing coordinates."
- "Are there duplicate deps or SNAPSHOT versions in this pasted POM?"
- "Which dependencies are missing versions and not managed locally?"
