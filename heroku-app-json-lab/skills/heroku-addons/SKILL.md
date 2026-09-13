---
name: heroku-addons
description: >
  Parse pasted Heroku app.json text locally with zero-auth MCP tools:
  list addons (planOrName), env keys with required/redacted (never echo
  values), and formation process quantity/size. JSON-only — not Heroku
  API/CLI. No network, no heroku binary for tool logic.
version: 1.0.0
tags: [heroku, app-json, addons, env, formation, parse, local]
---

# Heroku addons / env / formation

Use these tools when the user pastes `app.json` text (never fetch a remote config, never call Heroku API or run `heroku` for analysis):

1. **`heroku_addons_list`** with `configText` — → `{addons: [{planOrName}]}` (string plans or `{plan}` objects).
2. **`heroku_env_keys`** with `configText` — → `{keys: [{key, required?, redacted}]}` — **never echo env values**.
3. **`heroku_formation_hint`** with `configText` — → `{formation: [{process, quantity?, size?}]}`.

JSON-only scanner. Input cap ~1MB. Documented limitations apply (not Heroku API; no deploy).

## Example prompts

- "What addons does this app.json declare?"
- "List env keys from this app.json (do not show values)."
- "What formation / dyno sizes are configured?"
