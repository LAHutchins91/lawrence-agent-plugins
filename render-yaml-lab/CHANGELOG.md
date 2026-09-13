# Changelog

All notable changes to **render-yaml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `render_services_list` for `services:` → `[{name, type?, env?, plan?}]`.
- Add `render_env_keys` for `envVars` keys; secret-like plaintext values never echoed (`redacted: true` only).
- Add `render_healthcheck_hint` for `healthCheckPath` / `healthcheck` → `[{service, path?}]`.
- Add `render_lint_lite` for missing services, web without healthCheckPath, missing buildCommand, and autoDeploy false (info).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Render API. Uses `yaml` package; ~1MB input cap. FREE MIT.
