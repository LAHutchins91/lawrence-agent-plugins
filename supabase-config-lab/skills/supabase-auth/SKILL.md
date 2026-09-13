---
name: supabase-auth
description: >
  Summarize pasted supabase/config.toml Auth settings: enable_signup,
  site_url, and additional_redirect_urls count. Also project/api/studio
  ports and [db] key names (password-like redacted). Local only — no
  Supabase CLI/API, no fetch.
version: 1.0.0
tags: [supabase, config-toml, auth, signup, redirects, local]
---

# Supabase Auth / project hint

Use these tools when the user pastes `supabase/config.toml` text (never fetch a remote config, never run `supabase` CLI or call Supabase API for analysis):

1. **`supabase_project_hint`** with `toml` — → `{projectId?, apiPort?, studioPort?}`.
2. **`supabase_db_keys`** with `toml` — → `{keys: [{key, redacted?}]}`. Password-like keys are flagged; values are never echoed.
3. **`supabase_auth_hint`** with `toml` — → `{enableSignup?, siteUrl?, redirectCount?}`.

Lite TOML scanner. Input cap ~1MB. Documented limitations apply (not Supabase CLI; no network).

## Example prompts

- "What is the Supabase project_id and API port?"
- "Is signup enabled and what is site_url?"
- "List [db] keys — redact passwords."
