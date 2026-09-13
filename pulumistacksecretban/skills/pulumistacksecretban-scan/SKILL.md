---
name: pulumistacksecretban-scan
description: Use when scanning for pulumistacksecretban issues in repos or CI configs.
---
# pulumistacksecretban scan

1. Locate relevant configs/manifests/source.
2. Apply heuristics for: Flag Pulumi stack configs that may leak secrets in plaintext.
3. Return a concise findings list (severity, path, fix). Marketplace plugin is free; Pro tooling lives outside.
