---
name: ft-targets
description: >
  List Fortio load/echo/curl target URLs (fortio load, fortio curl, fortio echo,
  -url, http(s)://), plus QPS hints (-qps / -c / -t / -n / -r / -p / -H /
  -payload / -keepalive / -a) from pasted Fortio shell/script source. Local
  only — never runs Fortio or load tests, no fetch.
version: 1.0.0
tags: [fortio, load-testing, targets, local]
---

# Fortio targets & QPS

Use these tools when the user pastes Fortio shell/script text (never fetch a remote file, never run Fortio/load tests):

1. **`ft_targets_list`** with `source` — → `{targets: [{url?, mode?}], count}`.
2. **`ft_qps_hint`** with `source` — → `{qps: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Fortio runtime; no load tests; no network).

## Example prompts

- "Which target URLs does this Fortio script hit?"
- "What -qps / -c / -t options are in this file?"
- "List fortio load vs curl targets from this shell snippet."
