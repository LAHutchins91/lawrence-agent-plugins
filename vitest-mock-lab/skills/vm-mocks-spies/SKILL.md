---
name: vm-mocks-spies
description: >
  Extract Vitest vi.mock / jest.mock mocks and vi.spyOn / vi.fn spies from
  JS/TS text with the local zero-auth vitest-mock-lab MCP. No vitest runtime,
  no network.
version: 1.0.0
tags: [vitest, mock, spy, developer-tools]
---

# Vitest mocks & spies

When the user pastes **Vitest** test source and needs mock/spy inventory:

1. **`vm_mocks_list`** — `{ text }` → `{ mocks: [{module?, factory?}], count }` from `vi.mock(` / `jest.mock(`.
2. **`vm_spies_hint`** — `{ text }` → `{ spies: [{target?, method?}], count }` from `vi.spyOn(` / `vi.fn(`.

## Example prompts

- "List vi.mock calls in this test"
- "Any vi.spyOn / vi.fn here?"
- "What modules are mocked?"
