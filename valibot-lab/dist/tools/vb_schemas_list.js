import { listSchemas } from "../lib/valibot_schema.js";
export function vbSchemasList(input) {
    return listSchemas(input.text ?? "");
}
