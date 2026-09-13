---
name: shebang-parse-detect
description: "Parse #! shebang lines and detect interpreter family (node, python, bash, sh, ruby, perl, php, other, none) with the local zero-auth shebang-lab MCP. First-line string analysis only — no exec, no FS."
version: 1.0.0
tags: [shebang, interpreter, parse, detect, developer-tools]
---

# Shebang parse & detect

When the user needs to inspect a script’s interpreter line:

1. **`parse_shebang`** — `{ text }` → `{ shebang, interpreterPath?, args, line }`.
   - Only the first line; null shebang if it does not start with `#!`.
2. **`detect_interpreter`** — `{ text }` → `{ family, detail }`.
   - Handles `env` wrappers (`#!/usr/bin/env python3`) and aliases (`nodejs`→node).

## Example prompts

- "What interpreter does this shebang use?"
- "Parse `#!/usr/bin/env node --experimental-vm-modules`"
- "Is this a Python or Node script from the shebang alone?"
