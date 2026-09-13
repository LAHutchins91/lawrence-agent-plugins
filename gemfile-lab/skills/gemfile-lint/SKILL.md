---
name: gemfile-lint
description: "Lite-lint pasted Gemfile for missing source, git/github gems without ref/tag/branch, duplicate gem names, and ruby version directive presence info. Local only, no bundler, no fetch."
version: 1.0.0
tags: [ruby, gemfile, bundler, lint, local]
---

# Gemfile lint

Use **`gemfile_lint_lite`** with `gemfile` on pasted Gemfile (do not fetch URLs or run bundler / ruby):

- Missing `source` directive (error)
- Duplicate gem names (warning)
- git / github gems without `ref` / `tag` / `branch` (warning)
- `ruby` version directive presence info (info — present or absent)

Heuristic only — not `bundle install` / `bundle check`. Lite Ruby DSL line scanner.

## Example prompts

- "Lint this Gemfile for a missing source."
- "Are there duplicate gems or unpinned git gems in this pasted Gemfile?"
- "Does this Gemfile declare a ruby version?"
