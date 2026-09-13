# Changelog

All notable changes to **jest-mock-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `jm_mocks_list` for `jest.mock(` / `jest.doMock(` / `jest.unstable_mockModule(` heuristics → `[{module?, kind}]`.
- Add `jm_spies_hint` for `jest.spyOn(` / `jest.fn(` usage counts → `[{method, count}]`.
- Add `jm_timers_hint` for `jest.useFakeTimers(` / `advanceTimersByTime(` / `runAllTimers(` usage counts → `[{method, count}]`.
- Add `jm_lint_lite` for mock without clearAllMocks/restoreAllMocks, spy without mockRestore, empty file, and requireActual missing when partial mock.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Jest. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
