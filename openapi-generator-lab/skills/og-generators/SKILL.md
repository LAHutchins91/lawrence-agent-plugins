---
name: og-generators
description: >
  List openapi-generator names (-g / --generator-name / generatorName:)
  and config flag hints (-i / --input-spec / -o / --output / -c /
  --config / --additional-properties / --global-property /
  --skip-validate-spec / --enable-post-process-file) from pasted
  openapi-generator CLI/config source. Local only — never runs
  openapi-generator or Java codegen, never fetches specs, no fetch.
version: 1.0.0
tags: [openapi-generator, openapi, generators, config, local]
---

# openapi-generator generators & config

Use these tools when the user pastes openapi-generator CLI/config text (never fetch a remote file, never run openapi-generator):

1. **`og_generators_list`** with `source` — → `{generators: [{name?}], count}`.
2. **`og_config_hint`** with `source` — → `{config: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not openapi-generator CLI; no codegen; no network).

## Example prompts

- "Which generators does this openapi-generator command use?"
- "What -i/-o/--config flags are in this script?"
- "List generatorName: from this config."
