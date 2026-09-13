---
name: veg-targets
description: >
  List Vegeta GET/POST/PUT/DELETE target lines / NewStaticTargeter Method/URL
  values, plus rate/pacer hints (Rate / ConstantPacer / ConstantArrivalRate /
  -rate / -duration / -connections / -workers / -timeout / attack) from pasted
  Vegeta shell/Go/targets source. Local only — never runs Vegeta or load tests,
  no fetch.
version: 1.0.0
tags: [vegeta, load-testing, targets, local]
---

# Vegeta targets & rates

Use these tools when the user pastes Vegeta shell/Go/targets text (never fetch a remote file, never run Vegeta/load tests):

1. **`veg_targets_list`** with `source` — → `{targets: [{method?, url?}], count}`.
2. **`veg_rates_hint`** with `source` — → `{rates: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Vegeta runtime; no load tests; no network).

## Example prompts

- "Which targets / URLs does this Vegeta script define?"
- "What -rate / -duration options are in this file?"
- "List Method/URL targets from this Vegeta Go snippet."
