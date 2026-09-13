---
name: loc-tasks
description: >
  List Locust @task / TaskSet / SequentialTaskSet methods and user / wait_time
  hints (HttpUser / FastHttpUser / User / between / constant /
  constant_pacing / constant_throughput) from pasted Locust Python source.
  Local only — never runs Locust or load tests, no fetch.
version: 1.0.0
tags: [locust, load-testing, tasks, local]
---

# Locust tasks & users

Use these tools when the user pastes Locust Python text (never fetch a remote file, never run Locust/load tests):

1. **`loc_tasks_list`** with `source` — → `{tasks: [{name?, weight?}], count}`.
2. **`loc_users_hint`** with `source` — → `{users: [{method, count}], count}`.

Lite Python scanner. Input cap ~1MB. Documented limitations apply (not Locust runtime; no load tests; no network).

## Example prompts

- "Which @task methods does this Locust file define?"
- "What HttpUser / wait_time patterns are in this script?"
- "List TaskSet tasks from this Locust Python."
