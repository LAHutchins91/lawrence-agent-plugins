---
name: env-example-sync
description: "Keep .env.example (or compose environment placeholders) in sync with an env contract — render safe placeholders, no real secrets, dotenv or docker-compose style."
version: 1.0.0
tags: [env, dotenv, example, placeholders, compose, secrets]
---

# Env example sync

When the user wants a safe `.env.example` or compose `environment:` stubs:

1. Obtain a contract via **`env_schema_infer`** (from a real `.env`) or accept a hand-written contract JSON.
2. Call **`env_example_render`** with `style: "dotenv"` or `"docker-compose-env"`.
3. Present the rendered text for the user to save — never copy production secret values into examples.
4. Optionally re-check with **`env_contract_check`** that the example keys cover required contract entries.

## Example prompts

- "Generate .env.example from this .env (redacted)"
- "Render docker-compose environment placeholders from our contract"
