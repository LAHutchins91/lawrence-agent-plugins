---
name: cv-dtos-decorators
description: "Extract class-validator DTO classes and per-property decorator hints from TypeScript text with the local zero-auth class-validator-lab MCP. No class-validator runtime, no network."
version: 1.0.0
tags: [class-validator, dto, decorators, validation, developer-tools]
---

# Class-validator DTOs & decorators

When the user pastes **class-validator DTO** TypeScript and needs DTO inventory or decorator mapping:

1. **`cv_dtos_list`** — `{ text }` → `{ dtos: [{name, properties: string[]}], count }` classes with `@IsString` / `@IsEmail` / `@IsOptional` etc.
2. **`cv_decorators_hint`** — `{ text }` → `{ decorators: [{dto?, property?, name}], count }` CV/CT decorator usages per property.

## Example prompts

- "List DTO classes in this NestJS file"
- "Which decorators are on CreateUserDto.email?"
- "What properties does AddressDto declare?"
