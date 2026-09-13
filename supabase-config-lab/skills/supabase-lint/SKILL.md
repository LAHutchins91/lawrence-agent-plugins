---
name: supabase-lint
description: "Lite-lint pasted supabase/config.toml for missing project_id, missing auth site_url, db.major_version present (info), and storage enabled note. Local only, no supabase CLI for tool logic, no fetch."
version: 1.0.0
tags: [supabase, config-toml, lint, auth, db, storage, local]
---

# Supabase config lint

Use **`supabase_lint_lite`** with `toml` on pasted supabase/config.toml (do not fetch URLs or run `supabase` CLI for analysis):

- Missing top-level `project_id` (error)
- `[auth]` present but `site_url` missing/empty (warning)
- `db.major_version` present (info)
- `[storage]` / `storage.enabled` note (info)

Heuristic only — not supabase CLI / not schema validation. Lite TOML scanner.

## Example prompts

- "Lint this supabase config.toml for missing project_id."
- "Is auth site_url set?"
- "Does this config enable storage?"
