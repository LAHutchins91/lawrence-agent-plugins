# Changelog

All notable changes to **fly-toml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `fly_app_name` for top-level `app` / `primary_region` → `{app?, primaryRegion?}`.
- Add `fly_services_ports` for `[[services]]` / `[http_service]` / `[[http_service]]` ports → `[{kind, ports[]}]`.
- Add `fly_env_keys` for `[env]` keys; secret-like values returned as `***REDACTED***` only (never echoed).
- Add `fly_lint_lite` for missing `app`, missing services/http_service, `force_https = false` note, and VM size present (info).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no flyctl. Lite TOML scanner; ~1MB input cap. Document TOML lite limits. FREE MIT.
