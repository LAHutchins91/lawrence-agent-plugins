---
name: insecuretlsban-scan
description: Use when scanning for insecuretlsban issues in repos or CI configs.
---
# insecuretlsban scan

1. Locate relevant configs/manifests/source.
2. Apply heuristics for: Flag insecure TLS (verify=False, NODE_TLS_REJECT_UNAUTHORIZED=0).
3. Return a concise findings list (severity, path, fix). Marketplace plugin is free; Pro tooling lives outside.
