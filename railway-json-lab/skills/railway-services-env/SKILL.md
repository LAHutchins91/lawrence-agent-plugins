---
name: railway-services-env
description: Extract Railway services and env/variable keys from railway.json or railway.toml text with the local zero-auth railway-json-lab MCP. No Railway API or network.
version: 1.0.0
tags: [railway, railway.json, railway.toml, services, env, developer-tools]
---

# Railway services & env keys

When the user pastes **railway.json** / **railway.toml** and needs service or env inventory:

1. **`railway_services_list`** — `{ text }` → `{ services: [{name?, build?, deploy?}], count }`.
2. **`railway_env_keys`** — `{ text }` → `{ keys: string[], count, redacted?: string[] }` (keys only; secret-looking values never echoed).

## Example prompts

- "List services from this railway.json"
- "What env keys are in this railway.toml?"
- "Any secret-looking variable keys?"
