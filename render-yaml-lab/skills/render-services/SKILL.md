---
name: render-services
description: >
  Parse pasted render.yaml text locally with zero-auth MCP tools:
  services list (name/type/env/plan), envVars keys (secret values redacted),
  and healthCheckPath hints. YAML via `yaml` package — not Render API.
  No network, no Render CLI for tool logic.
version: 1.0.0
tags: [render, render-yaml, services, envVars, healthcheck, parse, local]
---

# Render services / env / healthcheck

Use these tools when the user pastes `render.yaml` Blueprint text (never fetch a remote config, never call the Render API):

1. **`render_services_list`** with `yaml` — → `{services: [{name, type?, env?, plan?}]}`.
2. **`render_env_keys`** with `yaml` — → `{keys: [{key, redacted?, service?}]}`. Secret-like plaintext values are never echoed — `redacted: true` only.
3. **`render_healthcheck_hint`** with `yaml` — → `{healthchecks: [{service, path?}]}`.

Input cap ~1MB. Documented limitations apply (not Render CLI; no deploy).

## Example prompts

- "List services in this render.yaml."
- "Which envVars keys are set — redact secrets."
- "What healthCheckPath does each service declare?"
