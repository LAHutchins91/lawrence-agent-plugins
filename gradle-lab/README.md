# Gradle Lab

Zero-auth **local** MCP tools for scanning pasted Gradle `build.gradle` / `build.gradle.kts` text: plugins, dependencies, task hints, and lite lint. Lite Groovy/Kotlin DSL line scanner only — no Gradle daemon, no `gradle`/`gradlew` CLI, no network.

This is **not** Gradle and **not** a full Groovy/Kotlin parser: common `plugins { }`, `apply plugin`, dependency configurations, and `tasks.register` / legacy `task` lines are supported. Version catalogs (`libs.*`), included builds, multi-project `subprojects` evaluation, and property interpolation are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `gradle_plugins_list` | → `{plugins: [{id, version?}]}` from `plugins { id(...) }` / `apply plugin` |
| `gradle_deps_list` | → `{dependencies: [{configuration, notation}]}` from implementation/api/testImplementation/compileOnly/… |
| `gradle_tasks_hint` | → `{tasks: [{name, type?}]}` from `tasks.register` / `task foo` / common aliases |
| `gradle_lint_lite` | missing plugins block, deprecated `compile`, dynamic `+` versions, duplicate deps → `{findings[]}` |

## Limits

- Pasted `build.gradle` / `build.gradle.kts` text you already have. No sockets, DNS, remote fetches, or Gradle CLI (`gradle`, `gradlew`, daemon).
- Input capped at ~1MB (`1048576` characters).
- **Lite DSL line scanner**: `#` / `//` comments stripped loosely; block comments `/* */` skipped naively; single/double-quoted strings; common Groovy and Kotlin DSL call shapes. Not a full language parser — no AST, no Groovy GString interpolation eval, no Kotlin type resolution.
- `buildscript { }` classpath deps are listed when configuration is `classpath`; repositories / settings.gradle / version catalogs (`libs.xxx`) are not resolved.
- Multi-line chained calls with unusual formatting may be missed. Documented heuristics only — not `gradle tasks` / not the configuration cache.

## Start

```bash
node /workspace/gradle-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/gradle-lab`

## Skills

- **gradle-deps** — list plugins, dependencies, and task hints from pasted Gradle DSL
- **gradle-lint** — lite heuristic findings on pasted Gradle DSL

## License

MIT © Lawrence Hutchins — FREE
