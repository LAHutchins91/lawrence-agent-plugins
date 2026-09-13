# Changelog

All notable changes to **nock-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `nock_scopes_list` for `nock('https://…')` / `nock("http://…")` base URL scopes → `[{baseUrl}]`.
- Add `nock_intercepts_hint` for `.get` / `.post` / `.put` / `.delete` / `.patch` / `.head` / `.options` heuristics → `[{method, count}]`.
- Add `nock_persist_hint` for `.persist` / `.times` / `.once` / `.twice` usage counts → `[{method, count}]`.
- Add `nock_lint_lite` for missing `nock.cleanAll`/`restore`, persist without times caution, empty intercepts, and reply without status.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never activates nock interceptors. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
