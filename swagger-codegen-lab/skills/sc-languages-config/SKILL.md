---
name: sc-languages-config
description: "Extract swagger-codegen / openapi-generator -l/--lang/-g/--generator-name languages and -c/--config/-p/--additional-properties with the local zero-auth swagger-codegen-lab MCP. No codegen runtime, no network."
version: 1.0.0
tags: [swagger-codegen, openapi-generator, languages, config, cli, developer-tools]
---

# Swagger/OpenAPI languages & config

When the user pastes **swagger-codegen** / **openapi-generator** CLI text and needs language / config inventory:

1. **`sc_languages_list`** — `{ text }` → `{ languages: string[], generators?: string[], count }` from `-l` / `--lang` / `-g` / `--generator-name`.
2. **`sc_config_hint`** — `{ text }` → `{ configs: [{path?, keys?}], additionalProperties?, count }` for `-c` / `--config` and `-p` / `--additional-properties` (optional light JSON/YAML key parse).

## Example prompts

- "Which generator/language does this openapi-generator line use?"
- "What -c config path and -p additionalProperties are set here?"
- "Parse -l java and --generator-name from this paste"
