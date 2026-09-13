# Changelog

All notable changes to **serverless-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sls_functions_list` for functions → `[{name?, handler?}]`.
- Add `sls_events_hint` for http / httpApi / schedule / sns / sqs / stream / s3 / websocket / alb / eventBridge → `[{method, count}]`.
- Add `sls_resources_hint` for resources.Resources / provider.iam / layers / plugins / custom / package / vpc → `[{method, count}]`.
- Add `sls_lint_lite` for missing_service, missing_provider, wildcard_iam, empty_file, and runtime_nodejs_eol.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Serverless Framework CLI or AWS deploy. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
