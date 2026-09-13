# Changelog

All notable changes to **supabase-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `supabase_project_hint` for top-level `project_id` / `api.port` / `studio.port` → `{projectId?, apiPort?, studioPort?}`.
- Add `supabase_db_keys` for `[db]` keys; password-like keys flagged `redacted: true` (values never echoed).
- Add `supabase_auth_hint` for `[auth]` `enable_signup` / `site_url` / `additional_redirect_urls` count → `{enableSignup?, siteUrl?, redirectCount?}`.
- Add `supabase_lint_lite` for missing `project_id`, auth `site_url` missing, `db.major_version` present (info), and storage enabled note.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Supabase CLI/API. Lite TOML scanner; ~1MB input cap. Document TOML lite limits. FREE MIT.
