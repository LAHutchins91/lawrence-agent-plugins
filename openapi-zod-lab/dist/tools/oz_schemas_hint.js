import { listSchemaHints } from "../lib/openapi_zod.js";
export function ozSchemasHint(input) {
    return listSchemaHints(input.text ?? "");
}
