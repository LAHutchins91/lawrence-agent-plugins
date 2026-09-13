---
name: trufflehog-lint
description: >
  Lite-lint pasted TruffleHog config/CI for scans without --only-verified
  (info), overly broad exclude-detectors * / all (warning), empty file,
  JSON output without fail/exit handling, and filesystem scans without
  exclude-paths. Local only, never runs trufflehog CLI, never returns
  secret values, no fetch.
version: 1.0.0
tags: [trufflehog, secrets, lint, local]
---

# TruffleHog lite lint

Use this tool on pasted TruffleHog config/CI (do not fetch URLs, run trufflehog CLI, or echo secrets):

1. **`trufflehog_lint_lite`** with `source` — findings:
   - no_verified_flag (info)
   - exclude_all_detectors (warning)
   - empty_file (warning)
   - json_without_fail (info)
   - filesystem_without_exclude (info)

Disclaimer only — not the trufflehog CLI. Never returns secret values. Lite scanner.

## Example prompts

- "Is --only-verified missing from this TruffleHog scan?"
- "Is exclude-detectors too broad (* or all)?"
- "Lint this TruffleHog CI for filesystem without exclude-paths"
