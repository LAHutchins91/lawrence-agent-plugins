---
name: privilegedcontainerban-scan
description: Use when scanning for privilegedcontainerban issues in repos or CI configs.
---
# privilegedcontainerban scan

1. Locate relevant configs/manifests/source.
2. Apply heuristics for: Ban privileged containers and dangerous securityContext flags.
3. Return a concise findings list (severity, path, fix). Marketplace plugin is free; Pro tooling lives outside.
