---
name: hostpathmountban-scan
description: Use when scanning for hostpathmountban issues in repos or CI configs.
---
# hostpathmountban scan

1. Locate relevant configs/manifests/source.
2. Apply heuristics for: Ban hostPath volume mounts in Kubernetes manifests.
3. Return a concise findings list (severity, path, fix). Marketplace plugin is free; Pro tooling lives outside.
