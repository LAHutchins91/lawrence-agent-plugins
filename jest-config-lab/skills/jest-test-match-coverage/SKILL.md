---
name: jest-test-match-coverage
description: >
  Extract Jest testMatch/testRegex/roots and coverage options from Jest config
  text with the local zero-auth jest-config-lab MCP. JSONC preferred;
  JS heuristics; no jest binary or network.
version: 1.0.0
tags: [jest, jest-config, testMatch, coverage, developer-tools]
---

# Jest testMatch & coverage

When the user pastes **Jest config** (`jest.config.*`, JSONC, or `package.json` jest key) and needs matcher or coverage inventory:

1. **`jest_test_match`** — `{ text }` → `{ testMatch?, testRegex?, testPathIgnorePatterns?, roots? }`.
2. **`jest_coverage_summary`** — `{ text }` → `{ collectCoverage?, coverageDirectory?, coverageThreshold?, collectCoverageFrom?, coverageReporters? }`.

## Example prompts

- "What testMatch patterns are in this Jest config?"
- "Summarize coverage options from this jest.config.json"
- "Does this config set coverageThreshold?"
