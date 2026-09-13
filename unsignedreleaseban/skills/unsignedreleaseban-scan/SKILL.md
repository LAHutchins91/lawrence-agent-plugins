---
name: unsignedreleaseban-scan
description: Use when scanning for unsignedreleaseban issues in repos or CI configs.
---
# unsignedreleaseban scan

1. Locate relevant configs/manifests/source.
2. Apply heuristics for: Flag unsigned release artifacts and missing sigstore/cosign evidence in CI.
3. Return a concise findings list (severity, path, fix). Marketplace plugin is free; Pro tooling lives outside.
