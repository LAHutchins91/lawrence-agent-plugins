---
name: gradle-deps
description: >
  Parse pasted Gradle build.gradle / build.gradle.kts text locally with
  zero-auth MCP tools: list plugins, dependencies, and task hints.
  Lite Groovy/Kotlin DSL line scanner — not Gradle. No network, no gradle/gradlew.
version: 1.0.0
tags: [gradle, build.gradle, dependencies, plugins, parse, local]
---

# Gradle deps

Use these tools when the user pastes build.gradle / build.gradle.kts text (never fetch a remote script, never run gradle/gradlew):

1. **`gradle_plugins_list`** with `gradle` — → `{plugins: [{id, version?}]}` from `plugins { id("…") }` / `apply plugin`.
2. **`gradle_deps_list`** with `gradle` — → `{dependencies: [{configuration, notation}]}` (implementation/api/testImplementation/compileOnly/…).
3. **`gradle_tasks_hint`** with `gradle` — → `{tasks: [{name, type?}]}` from `tasks.register` / `task foo` / common lifecycle aliases.

Lite DSL line scanner. Input cap ~1MB. Documented limitations apply (not Gradle, not full Groovy/Kotlin).

## Example prompts

- "Which plugins does this build.gradle declare?"
- "List every dependency configuration and notation in this pasted Gradle script."
- "What custom tasks are registered in this build.gradle.kts?"
