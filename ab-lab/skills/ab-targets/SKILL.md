---
name: ab-targets
description: "List ApacheBench (ab) target URLs (ab ... http(s)://..., -p POST body file implying POST), plus option hints (-n / -c / -t / -p / -T / -H / -A / -P / -X / -k / -g / -e / -r / -s / -w) from pasted ab shell/script source. Local only — never runs ab or load tests, no fetch."
version: 1.0.0
tags: [apachebench, ab, load-testing, targets, local]
---

# ab targets & options

Use these tools when the user pastes ab shell/script text (never fetch a remote file, never run ab/load tests):

1. **`ab_targets_list`** with `source` — → `{targets: [{url?, method?}], count}`.
2. **`ab_options_hint`** with `source` — → `{options: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not ab runtime; no load tests; no network).

## Example prompts

- "Which target URLs does this ab script hit?"
- "What -n / -c / -t options are in this file?"
- "List ab URLs and POST (-p) methods from this shell snippet."
