---
name: hadolint-lint
description: >
  Lite-lint pasted Dockerfile / Hadolint config for FROM :latest
  (warning), apt install without --no-install-recommends (info),
  ignore without reason comment (info), empty file, and broad DL*
  ignores (warning). Local only, never runs hadolint CLI, no fetch.
version: 1.0.0
tags: [hadolint, dockerfile, lint, local]
---

# Hadolint lite lint

Use this tool on pasted Dockerfile / Hadolint config (do not fetch URLs or run hadolint CLI):

1. **`hadolint_lint_lite`** with `source` — findings:
   - latest_tag (warning)
   - apt_without_no_install_recommends (info)
   - ignore_without_reason (info)
   - empty_file (warning)
   - broad_ignore (warning)

Disclaimer only — not the hadolint CLI. Lite scanner.

## Example prompts

- "Is this Dockerfile using FROM :latest?"
- "Is apt-get install missing --no-install-recommends?"
- "Lint this Dockerfile for broad hadolint ignores"
