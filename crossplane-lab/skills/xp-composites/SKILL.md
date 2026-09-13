---
name: xp-composites
description: "List Composition / CompositeResourceDefinition (XRD) names and Provider hints (Provider / ProviderConfig / ControllerConfig / DeploymentRuntimeConfig / package: / pkg.crossplane.io) from pasted Crossplane YAML. Local only — never runs crossplane or kubectl, never fetches remote packages, no fetch."
version: 1.0.0
tags: [crossplane, xrd, composition, yaml, providers, local]
---

# Crossplane composites & Providers

Use these tools when the user pastes Crossplane YAML text (never fetch a remote file, never run crossplane/kubectl):

1. **`xp_composites_list`** with `source` — → `{composites: [{kind?, name?}], count}`.
2. **`xp_providers_hint`** with `source` — → `{providers: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not crossplane CLI; no kubectl; no network).

## Example prompts

- "Which Compositions and XRDs are defined in this YAML?"
- "What Provider packages are referenced?"
- "List ProviderConfigs and ControllerConfigs from this paste."
