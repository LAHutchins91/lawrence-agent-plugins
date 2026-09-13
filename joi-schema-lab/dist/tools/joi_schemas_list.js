import { listSchemas } from "../lib/joi_schema.js";
export function joiSchemasList(input) {
    return listSchemas(input.text ?? "");
}
