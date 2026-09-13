# Changelog

All notable changes to **flux-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `flux_sources_list` for GitRepository / HelmRepository / OCIRepository / Bucket → `[{kind?, name?}]`.
- Add `flux_kustomizations_hint` for Kustomization / path / sourceRef / prune / interval / healthChecks / dependsOn → `[{method, count}]`.
- Add `flux_helmreleases_hint` for HelmRelease / chart / values / valuesFrom / chartRef / install / upgrade / rollback / test → `[{method, count}]`.
- Add `flux_lint_lite` for missing_interval, missing_source_ref, prune_disabled, empty_file, and insecure_http_url.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs flux or kubectl, never fetches remote repos. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
