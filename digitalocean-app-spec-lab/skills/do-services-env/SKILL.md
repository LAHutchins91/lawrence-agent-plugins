---
name: do-services-env
description: Extract DigitalOcean App Spec services/workers/jobs/static_sites and env keys from .do/app.yaml text with the local zero-auth digitalocean-app-spec-lab MCP. No DigitalOcean API or network.
version: 1.0.0
tags: [digitalocean, app-spec, app.yaml, services, env, developer-tools]
---

# DigitalOcean services & env keys

When the user pastes **.do/app.yaml** / App Spec YAML and needs component or env inventory:

1. **`do_services_list`** — `{ text }` → `{ services: [{name?, http_port?, instance_count?, instance_size_slug?}], workers?, jobs?, static_sites?, count }`.
2. **`do_env_keys`** — `{ text }` → `{ keys: string[], count, scopes?: string[], redacted?: string[] }` (keys only; secret-looking values never echoed).

## Example prompts

- "List services from this .do/app.yaml"
- "What env keys / scopes are in this App Spec?"
- "Any secret-looking env keys?"
