---
name: compose-risk-scan
description: "Scan docker-compose YAML for high-risk local settings: privileged containers, host networking, floating :latest images, and publishing sensitive ports (22/3306/5432/6379/27017) on 0.0.0.0 — via zero-auth compose_service_scan MCP."
version: 1.0.0
tags: [docker-compose, compose, privileged, network-mode, ports, security]
---

# Compose risk scan

When the user pastes `docker-compose.yml` / `compose.yaml` text:

1. Call **`compose_service_scan`** with `composeYaml`.
2. Lead with **privileged** and **host-network** errors, then **sensitive-port-public**, then **image-latest** warnings.
3. Recommend binding DB/admin ports to `127.0.0.1` (or removing publish), pinning image digests/tags, and dropping `privileged` / `network_mode: host` unless strictly required.
4. Optionally pair with **dockerfile-review** if service build contexts include Dockerfiles.

## Example prompts

- "Scan this compose file for risky publishes and privileged mode"
- "Is Redis/Postgres exposed on 0.0.0.0?"
- "Flag latest tags and host networking in compose"
