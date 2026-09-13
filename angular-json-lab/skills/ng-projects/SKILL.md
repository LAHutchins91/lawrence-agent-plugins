---
name: ng-projects
description: "Parse pasted angular.json text locally with zero-auth MCP tools: list projects (name, projectType, root, sourceRoot), architect targets with builders, and build options styles/scripts arrays. JSON-only — not Angular CLI. No network, no ng binary for tool logic."
version: 1.0.0
tags: [angular, angular-json, projects, architect, styles, scripts, parse, local]
---

# Angular projects / architect / styles

Use these tools when the user pastes `angular.json` (or same-shape workspace / single-project JSON) text (never fetch a remote config, never run `ng` for analysis):

1. **`ng_projects_list`** with `configText` — → `{projects: [{name, projectType?, root?, sourceRoot?}]}`.
2. **`ng_architect_targets`** with `configText` (optional `project`) — → `{targets: [{project, target, builder?}]}`.
3. **`ng_styles_scripts`** with `configText` (optional `project`) — → `{entries: [{project, styles[], scripts[]}]}` from build options.

JSON-only scanner. Input cap ~1MB. Documented limitations apply (not Angular CLI; project.json alone only if same shape).

## Example prompts

- "What projects does this angular.json declare?"
- "List architect targets and builders for the app project."
- "Which styles and scripts are in the build options?"
