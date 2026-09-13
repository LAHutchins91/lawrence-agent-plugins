# Changelog

All notable changes to **argocd-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `argo_apps_list` for Application / AppProject / ApplicationSet → `[{kind?, name?}]`.
- Add `argo_sources_hint` for repoURL / path / chart / targetRevision / helm / kustomize / directory / sources: → `[{method, count}]`.
- Add `argo_sync_hint` for syncPolicy / automated / prune / selfHeal / syncOptions / CreateNamespace / ServerSideApply / retry → `[{method, count}]`.
- Add `argo_lint_lite` for missing_destination, missing_source, automated_without_prune, empty_file, and insecure_http_repo.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs argocd or kubectl, never fetches remote repos. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
