# Locust Lab

Zero-auth **local** MCP tools for scanning pasted **Locust** Python scripts: `@task` / TaskSet listings, HttpUser / wait_time hints, events / sleep counts, and lite lint. Lite Python scanner (same family as artillery-lab / k6-script-lab) — **never runs Locust or executes load tests**, no network.

This is **not** the Locust CLI or a load-test runtime. Documented heuristics only. Users may paste source that references `locust` — this plugin does not depend on or execute that package.

## Tools

| Tool | Purpose |
|------|---------|
| `loc_tasks_list` | `@task` / `@task(weight)` (+ TaskSet / SequentialTaskSet) → `[{name?, weight?}]` |
| `loc_users_hint` | `HttpUser` / `FastHttpUser` / `User` / `wait_time` / `between` / `constant` / `constant_pacing` / `constant_throughput` → `[{method, count}]` |
| `loc_events_hint` | `events.request` / `events.test_start` / `events.test_stop` / `events.quitting` / `environment.events` / `gevent.sleep` / `time.sleep` → `[{method, count}]` |
| `loc_lint_lite` | missing wait_time, hard sleep, User without @task, empty file, client without catch_response → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Locust execution, or load-test runs for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite Python only** — not a full AST. Supported loosely: `#` comments and triple-quoted strings stripped; simple `'/"/` string literals; common `@task` / User / wait_time / events usage. Not supported / incomplete: full decorator resolution, imported helpers expanded, dynamic `getattr`.
- Does not run Locust or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/locust-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/locust-lab`

## Skills

- **loc-tasks** — list @task / TaskSet methods and user / wait_time hints from pasted Locust source
- **loc-lint** — events / sleep listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
