# Changelog

All notable changes to **etag-cache-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `etag_normalize` for raw ETag → `{raw, weak, value, quoted}`.
- Add `if_none_match_check` for resource ETag vs If-None-Match (`*` / multi-etag, weak comparison → would304).
- Add `cache_freshness_hint` heuristic from Date/Age/max-age/Expires (not a full cache simulator).
- Add `weak_etag_compare` for RFC 9110 strong vs weak opaque-tag comparison.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network. Document limits.
