# CMake Lab

Zero-auth **local** MCP tools for scanning pasted `CMakeLists.txt` text: targets, `find_package`, options, and lite lint. Lite CMake command scanner only — no `cmake` binary, no configure/generate, no network.

This is **not** cmake(1) and **not** a full CMake language interpreter: common `add_executable` / `add_library`, `find_package(...)`, `option(...)`, `cmake_minimum_required`, and `project(...)` are supported. Variable expansion (`${…}`), generator expressions, `include()` / `add_subdirectory()` following, and macros/functions as first-class are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `cmake_targets_list` | → `{targets: [{name, kind}]}` from `add_executable` / `add_library` (executable\|library\|static\|shared\|interface\|object\|…) |
| `cmake_find_package_list` | → `{packages: [{name, version?, required?, components?}]}` from `find_package(...)` |
| `cmake_options_list` | → `{options: [{name, description?, default?}]}` from `option(...)` |
| `cmake_lint_lite` | missing `cmake_minimum_required`, missing `project()`, duplicate targets, outdated minimum &lt; 3.10 → `{findings[]}` |

## Limits

- Pasted `CMakeLists.txt` text you already have. No sockets, DNS, remote fetches, or cmake CLI (`cmake`, `ctest`, `cpack`).
- Input capped at ~1MB (`1048576` characters).
- **Lite CMake command scanner**: `#` comments stripped loosely; bracket comments `#[[ ]]` skipped naively; simple quoted args; common command shapes. Not a full language parser — no AST, no `${var}` expansion, no generator expressions.
- Does not follow `include()` / `add_subdirectory()` / `FetchContent`. Multi-line unusual formatting may be missed. Documented heuristics only — not `cmake -P` / not configure.
- FREE MIT.

## Start

```bash
node /workspace/cmake-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cmake-lab`

## Skills

- **cmake-targets** — list targets, find_package, and options from pasted CMakeLists.txt
- **cmake-lint** — lite heuristic findings on pasted CMakeLists.txt

## License

MIT © Lawrence Hutchins — FREE
