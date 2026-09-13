---
name: fly-services
description: "Parse pasted fly.toml text locally with zero-auth MCP tools: app / primary_region, [[services]] / [http_service] ports, and [env] keys (secret-like values redacted). Lite TOML — not flyctl. No network, no fly binary for tool logic."
version: 1.0.0
tags: [fly, fly-toml, flyio, services, ports, env, parse, local]
---

# Fly services / app / env

Use these tools when the user pastes `fly.toml` text (never fetch a remote config, never run `flyctl` / `fly` for analysis):

1. **`fly_app_name`** with `toml` — → `{app?, primaryRegion?}`.
2. **`fly_services_ports`** with `toml` — → `{services: [{kind, ports[]}]}` (`kind` is `services` or `http_service`).
3. **`fly_env_keys`** with `toml` — → `{keys[], values{}, redactedKeys[]}`. Secret-like values are `***REDACTED***` and never echoed.

Lite TOML scanner. Input cap ~1MB. Documented limitations apply (not flyctl; no deploy).

## Example prompts

- "What is the Fly app name and primary region?"
- "Which ports does this fly.toml expose?"
- "List [env] keys — redact secrets."
