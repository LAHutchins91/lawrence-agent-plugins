# Changelog

All notable changes to **locust-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `loc_tasks_list` for `@task` / `@task(weight)` / TaskSet / SequentialTaskSet → `[{name?, weight?}]`.
- Add `loc_users_hint` for HttpUser / FastHttpUser / User, wait_time / between / constant / constant_pacing / constant_throughput → `[{method, count}]`.
- Add `loc_events_hint` for events.request / events.test_start / events.test_stop / events.quitting / environment.events / gevent.sleep / time.sleep → `[{method, count}]`.
- Add `loc_lint_lite` for missing_wait_time, hard_sleep, no_tasks, empty_file, and catch_response_unused.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Locust or executes load tests. Lite Python scanner; ~1MB input cap. Document scanner limits. FREE MIT.
