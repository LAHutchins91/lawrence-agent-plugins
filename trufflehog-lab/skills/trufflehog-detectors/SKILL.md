---
name: trufflehog-detectors
description: >
  List detector names and filter / config method counts
  (exclude-paths / exclude-detectors / filter-entropy / include-paths /
  --exclude-paths; --json / --only-verified / --results / git / github /
  filesystem / s3 / --concurrency) from pasted TruffleHog config/CI.
  Local only — never runs trufflehog CLI, never returns secret values,
  no fetch.
version: 1.0.0
tags: [trufflehog, secrets, detectors, filters, config, local]
---

# TruffleHog detectors, filters & config

Use these tools when the user pastes TruffleHog config or CI (never fetch a remote file, never run trufflehog CLI, never echo secret values):

1. **`trufflehog_detectors_list`** with `source` — → `{detectors: [{name?}], count}`.
2. **`trufflehog_filters_hint`** with `source` — → `{filters: [{method, count}], count}`.
3. **`trufflehog_config_hint`** with `source` — → `{config: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Never returns secret values. Documented limitations apply (not trufflehog CLI; no network).

## Example prompts

- "Which detector names are in this TruffleHog CI config?"
- "Does this config use exclude-paths / exclude-detectors / filter-entropy?"
- "What --json / --only-verified / git / filesystem / s3 flags appear here?"
