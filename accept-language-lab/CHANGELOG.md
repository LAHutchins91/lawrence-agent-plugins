# Changelog

All notable changes to **accept-language-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `al_parse` for Accept-Language header → `[{tag, q}]` sorted by quality then order.
- Add `al_negotiate` for basic prefix matching against available language tags.
- Add `bcp47_validate` lite heuristic (language[-script][-region][-variants]; not full IANA).
- Add `al_quality_sort` for `{tag,q?}` lists sorted by q desc.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network. Document BCP47 lite limits.
