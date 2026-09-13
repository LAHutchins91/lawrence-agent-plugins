# Changelog

All notable changes to **ghz-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ghz_targets_list` for ghz --insecure host:port, --call / -n package.Service/Method → `[{host?, call?}]`.
- Add `ghz_proto_hint` for proto/data flags (`-proto` / `--protoset` / `--proto` / `-i` / `--import-paths` / `-d` / `--data` / `-D` / `--data-file` / `-m` / `--metadata`) → `[{method, count}]`.
- Add `ghz_concurrency_hint` for concurrency/load flags (`-c` / `--concurrency` / `-n` / `--total` / `-t` / `--duration` / `-q` / `--rps` / `-z` / `--connections` / `--cpus`) → `[{method, count}]`.
- Add `ghz_lint_lite` for missing_call, missing_proto, insecure_plaintext, empty_file, and high_c_no_n.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs ghz or executes gRPC load tests. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
