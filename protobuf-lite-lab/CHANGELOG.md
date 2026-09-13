# Changelog

All notable changes to **protobuf-lite-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `proto_list_messages` for `.proto` text → `{name, fieldsCount?}` including nested message names.
- Add `proto_list_services` for services and RPCs with request/response/streaming.
- Add `proto_field_lookup` for message field lists with number, type, and label.
- Add `proto_lint_lite` for missing syntax/package, duplicate field numbers, reserved names, empty services.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no protoc, no codegen. Lite proto3 scanner (not a full protobuf compiler); ~1MB input cap. Document limits.
