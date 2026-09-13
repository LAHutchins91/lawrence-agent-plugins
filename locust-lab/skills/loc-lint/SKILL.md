---
name: loc-lint
description: "List Locust events / sleep APIs (events.request / events.test_start / events.test_stop / events.quitting / environment.events / gevent.sleep / time.sleep) and lite-lint for missing wait_time, hard sleep, User without @task, empty file, and client without catch_response. Local only, never runs Locust/load tests, no fetch."
version: 1.0.0
tags: [locust, load-testing, lint, local]
---

# Locust events & lite lint

Use these tools on pasted Locust Python source (do not fetch URLs or run Locust/load tests):

1. **`loc_events_hint`** with `source` — → `{events: [{method, count}], count}`.
2. **`loc_lint_lite`** with `source` — findings:
   - User without wait_time (warning)
   - time.sleep / gevent.sleep (warning)
   - User without @task (warning)
   - Empty file (warning)
   - client.get/post without catch_response (info)

Heuristic only — not the Locust CLI or a load-test runtime. Lite Python scanner.

## Example prompts

- "Any missing wait_time?"
- "Does this script use hard sleeps?"
- "Lint this Locust file for tasks and catch_response usage."
