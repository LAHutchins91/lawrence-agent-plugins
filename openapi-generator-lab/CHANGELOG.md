# Changelog

All notable changes to **openapi-generator-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `og_generators_list` for -g / --generator-name / generatorName: → `[{name?}]`.
- Add `og_config_hint` for -i / --input-spec / -o / --output / -c / --config / --additional-properties / --global-property / --skip-validate-spec / --enable-post-process-file → `[{method, count}]`.
- Add `og_templates_hint` for -t / --template-dir / templateDir / supportingFiles / apiPackage / modelPackage / invokerPackage / packageName → `[{method, count}]`.
- Add `og_lint_lite` for missing_generator, missing_input_spec, skip_validate, empty_file, and output_into_src_root.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs openapi-generator or Java codegen, never fetches specs. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
