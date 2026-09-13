---
name: ac-targets
description: >
  List autocannon( / autocannon.track( target url: / title: values, plus
  options hints (connections / duration / amount / pipelining / workers /
  timeout / headers / method / body / bailout / overallRate) from pasted
  autocannon JS source. Local only — never runs autocannon or load tests,
  no fetch.
version: 1.0.0
tags: [autocannon, load-testing, targets, local]
---

# Autocannon targets & options

Use these tools when the user pastes autocannon JS text (never fetch a remote file, never run autocannon/load tests):

1. **`ac_targets_list`** with `source` — → `{targets: [{url?, title?}], count}`.
2. **`ac_options_hint`** with `source` — → `{options: [{method, count}], count}`.

Lite JS scanner. Input cap ~1MB. Documented limitations apply (not autocannon runtime; no load tests; no network).

## Example prompts

- "Which targets / titles does this autocannon script define?"
- "What connections / duration options are in this file?"
- "List URL targets from this autocannon JS."
