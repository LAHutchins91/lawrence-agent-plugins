---
name: hey-targets
description: >
  List hey target URLs (hey ... https://..., -m METHOD, trailing URL args),
  plus option hints (-n / -c / -q / -z / -t / -m / -H / -D / -d / -T / -a /
  -x / -h2 / -disable-keepalive) from pasted hey shell/script source. Local
  only — never runs hey or load tests, no fetch.
version: 1.0.0
tags: [hey, load-testing, targets, local]
---

# hey targets & options

Use these tools when the user pastes hey shell/script text (never fetch a remote file, never run hey/load tests):

1. **`hey_targets_list`** with `source` — → `{targets: [{url?, method?}], count}`.
2. **`hey_options_hint`** with `source` — → `{options: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not hey runtime; no load tests; no network).

## Example prompts

- "Which target URLs does this hey script hit?"
- "What -n / -c / -z options are in this file?"
- "List hey URLs and -m methods from this shell snippet."
