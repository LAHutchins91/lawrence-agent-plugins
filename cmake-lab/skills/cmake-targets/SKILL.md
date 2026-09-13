---
name: cmake-targets
description: "Parse pasted CMakeLists.txt text locally with zero-auth MCP tools: list targets (add_executable / add_library), find_package calls, and option() declarations. Lite CMake command scanner — not cmake. No network, no cmake binary."
version: 1.0.0
tags: [cmake, CMakeLists.txt, targets, find_package, options, parse, local]
---

# CMake targets

Use these tools when the user pastes CMakeLists.txt text (never fetch a remote script, never run cmake):

1. **`cmake_targets_list`** with `cmake` — → `{targets: [{name, kind}]}` from `add_executable` / `add_library` (kinds: executable, library, static, shared, interface, object, …).
2. **`cmake_find_package_list`** with `cmake` — → `{packages: [{name, version?, required?, components?}]}`.
3. **`cmake_options_list`** with `cmake` — → `{options: [{name, description?, default?}]}` from `option(...)`.

Lite CMake command scanner. Input cap ~1MB. Documented limitations apply (not cmake(1), no `${var}` expansion).

## Example prompts

- "Which targets does this CMakeLists.txt declare?"
- "List every find_package call and components in this pasted CMake file."
- "What option() cache variables are defined here?"
