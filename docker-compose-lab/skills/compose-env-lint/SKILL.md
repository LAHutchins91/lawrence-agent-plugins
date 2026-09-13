---
name: compose-env-lint
description: >
  Extract environment keys (values redacted; env_file paths as references only)
  and run heuristic compose lite lint with the local zero-auth docker-compose-lab
  MCP. YAML text only — no docker daemon or FS reads.
version: 1.0.0
tags: [docker-compose, env, lint, yaml, developer-tools]
---

# Compose env keys & lite lint

When the user wants env key inventory or quick compose smells from **YAML text**:

1. **`compose_env_keys`** — `{ text }` → `{ services: [{name, envKeys}] }`.
   - Keys only from `environment`; `env_file:` path strings as references — never invent file contents or return values.
2. **`compose_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Rules: missing_image_or_build, host_network, privileged_true,
     duplicate_service_names, invalid_ports_format, docker_sock_mount, etc.

## Example prompts

- "Which env keys are set in this compose YAML?"
- "Lint this docker-compose for privileged / host network / missing image"
- "Redact secrets but list environment key names"
