---
name: og-lint
description: "List openapi-generator template/package keys (-t / --template-dir / templateDir / supportingFiles / apiPackage / modelPackage / invokerPackage / packageName) and lite-lint for generate without -g, without -i/--input-spec, --skip-validate-spec, empty file, and -o . / output: . Local only, never runs openapi-generator, no fetch."
version: 1.0.0
tags: [openapi-generator, openapi, lint, templates, local]
---

# openapi-generator templates & lite lint

Use these tools on pasted openapi-generator CLI/config source (do not fetch URLs or run openapi-generator):

1. **`og_templates_hint`** with `source` — → `{templates: [{method, count}], count}`.
2. **`og_lint_lite`** with `source` — findings:
   - generate without -g / --generator-name / generatorName: (warning)
   - without -i / --input-spec / inputSpec: (warning)
   - --skip-validate-spec (warning)
   - Empty file (warning)
   - -o . or output: . (info)

Disclaimer only — not the openapi-generator CLI. Lite scanner.

## Example prompts

- "Any missing -g generator?"
- "Is --skip-validate-spec used here?"
- "Lint this openapi-generator command for -o ."
