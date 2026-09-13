# Changelog

All notable changes to **supertest-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `st_requests_list` for `request(app).get` / `.post` / `.put` / `.delete` / `.patch` heuristics → `[{method, count}]`.
- Add `st_expects_hint` for `.expect(status)` / `.expect('Content-Type'…)` / other string or regex expects → `[{kind, count}]`.
- Add `st_auth_hint` for `.set('Authorization'…)` / `.auth(` usage counts → `[{method, count}]` (never echoes bearer token values).
- Add `st_lint_lite` for request without expect, missing await on supertest, hard-coded bearer tokens caution (redacted), and empty file.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never sends HTTP. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
