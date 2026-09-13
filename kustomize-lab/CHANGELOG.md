# Changelog

All notable changes to **kustomize-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `kust_resources_list` for resources: / bases: / components: entries → `[{path?}]`.
- Add `kust_overlays_hint` for namespace / namePrefix / nameSuffix / commonLabels / commonAnnotations / images / configMapGenerator / secretGenerator / replicas → `[{method, count}]`.
- Add `kust_patches_hint` for patches / patchesStrategicMerge / patchesJson6902 / replacements / transformers / crds → `[{method, count}]`.
- Add `kust_lint_lite` for missing_resources, secret_generator_plaintext, deprecated_bases, empty_file, and remote_resource.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs kustomize or kubectl, never fetches remote resources. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
