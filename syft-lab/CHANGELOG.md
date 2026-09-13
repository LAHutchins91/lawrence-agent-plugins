# Changelog

All notable changes to **syft-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `syft_scans_list` for dir / image / file / oci-dir / singularity scans from pasted config/CI → `[{kind?, target?}]`.
- Add `syft_formats_hint` for spdx_json / cyclonedx_json / syft_json / table / text / output / o_flag → `[{method, count}]`.
- Add `syft_scope_hint` for squashed / all_layers / scope / scope_flag / catalogers / package → `[{method, count}]`.
- Add `syft_lint_lite` for missing_output_format, table_only_ci, empty_file, all_layers_heavy, and no_file_output.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs syft CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
