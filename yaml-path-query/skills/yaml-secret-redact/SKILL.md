---
name: yaml-secret-redact
description: Redact values under password/secret/token/key/credential YAML keys — return masked YAML only; never echo original secret values.
version: 1.0.0
tags: [yaml, secrets, redact, password, token, privacy]
---

# YAML secret redact

When the user wants secrets stripped from a YAML paste before sharing or logging:

1. Call **`yaml_redact_secrets`** with `yamlText`.
2. Report `redactedYaml` and `redactedPaths[]` / `redactedCount`.
3. **Never** repeat original secret values from the paste in your reply — only the tool’s masked values (`***` or partial like `ab***`).

Optional: run **`yaml_parse_check`** first if the paste may be invalid.

## Example prompts

- "Redact secrets in this YAML before I paste it in Slack"
- "Mask password and token fields in this config"
