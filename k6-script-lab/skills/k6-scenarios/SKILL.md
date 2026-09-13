---
name: k6-scenarios
description: >
  List k6 scenarios{} keys and executor types (constant-vus /
  ramping-vus / per-vu-iterations / shared-iterations /
  constant-arrival-rate / ramping-arrival-rate /
  externally-controlled) and check / group / fail / http.get /
  http.post / http.put / http.del / http.request counts from pasted
  k6 JS source. Local only — never runs k6 or load tests, no fetch.
version: 1.0.0
tags: [k6, load-testing, scenarios, local]
---

# k6 scenarios & checks

Use these tools when the user pastes k6 JS text (never fetch a remote file, never run k6/load tests):

1. **`k6_scenarios_list`** with `source` — → `{scenarios: [{name?, executor?}], count}`.
2. **`k6_checks_hint`** with `source` — → `{checks: [{method, count}], count}`.

Lite JS scanner. Input cap ~1MB. Documented limitations apply (not k6 runtime; no load tests; no network).

## Example prompts

- "Which scenarios / executors does this k6 script define?"
- "How many check vs http.get calls are in this file?"
- "List scenario definitions from this k6 script."
