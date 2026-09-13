# POM XML Lab

Zero-auth **local** MCP tools for scanning pasted Maven `pom.xml` text: project coords, dependencies, build plugins, and lite lint. Lite XML tag extractor only — no Maven CLI (`mvn`), no network, no effective-POM resolution.

This is **not** Maven and **not** a full XML parser: common `project` / `parent` / `dependencies` / `build/plugins` tags are supported. Property interpolation, parent POM fetch, BOM import scope resolution, and profiles activation are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `pom_coords` | pom.xml text → `{groupId?, artifactId?, version?, packaging?, parent?}` |
| `pom_deps_list` | → `{dependencies: [{groupId, artifactId, version?, scope?, optional?}]}` from project `<dependencies>` (not dependencyManagement) |
| `pom_plugins_list` | → `{plugins: [{groupId?, artifactId, version?}]}` from build `<plugins>` (not pluginManagement) |
| `pom_lint_lite` | missing coords, SNAPSHOT notes, duplicate deps, missing version on non-managed deps heuristic → `{findings[]}` |

## Limits

- Pasted `pom.xml` text you already have. No sockets, DNS, remote fetches, or Maven CLI (`mvn`, `mvnw`, …).
- Input capped at ~1MB (`1048576` characters).
- **Lite XML tag extractor**: CDATA unwrapped naively, namespace prefixes stripped, entities limited to amp/lt/gt/quot/apos plus numeric; comments/DOCTYPE skipped loosely. Nested containers are stripped when extracting project-level coords so parent/dep/plugin tags are not mistaken for project GAV.
- Not a schema / XSD validator. Not effective POM. Parent BOM / `import` scope / property `${…}` substitution are not resolved.
- `dependencyManagement` is used only as a local heuristic for “managed version” notes in lint — not inherited from a remote parent.
- Profiles, reporting plugins, and multi-module reactor aggregation are out of scope.

## Start

```bash
node /workspace/pom-xml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/pom-xml-lab`

## Skills

- **pom-deps** — list coords, dependencies, and build plugins from pasted pom.xml
- **pom-lint** — lite heuristic findings on pasted pom.xml

## License

MIT © Lawrence Hutchins — FREE
