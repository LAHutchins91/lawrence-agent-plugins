# Changelog

All notable changes to **heroku-app-json-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `heroku_addons_list` for addons string/object → `{planOrName}`.
- Add `heroku_env_keys` for env keys with `required?` / `redacted` (never echoes values).
- Add `heroku_formation_hint` for formation `{process, quantity?, size?}`.
- Add `heroku_lint_lite` for missing name/description, empty scripts, buildpacks present (info), and success_url missing note.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Heroku API/CLI. JSON-only app.json scanner (loose JSONC); ~1MB input cap. Document limits. FREE MIT.
