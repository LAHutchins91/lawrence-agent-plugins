---
name: art-scenarios
description: >
  List Artillery scenarios: / scenario: names and flow: step counts, plus
  phase hints (duration / arrivalRate / arrivalCount / rampTo / maxVusers /
  pause) from pasted Artillery YAML/JS source. Local only — never runs
  Artillery or load tests, no fetch.
version: 1.0.0
tags: [artillery, load-testing, scenarios, local]
---

# Artillery scenarios & phases

Use these tools when the user pastes Artillery YAML/JS text (never fetch a remote file, never run Artillery/load tests):

1. **`art_scenarios_list`** with `source` — → `{scenarios: [{name?, flowSteps?}], count}`.
2. **`art_phases_hint`** with `source` — → `{phases: [{kind?, detail?}], count}`.

Lite YAML/JS scanner. Input cap ~1MB. Documented limitations apply (not Artillery runtime; no load tests; no network).

## Example prompts

- "Which scenarios / flows does this Artillery script define?"
- "What phases (arrivalRate / duration) are in this file?"
- "List scenario definitions from this Artillery YAML."
