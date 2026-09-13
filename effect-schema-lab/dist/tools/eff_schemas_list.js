import { listSchemas } from "../lib/effect_schema.js";
export function effSchemasList(input) {
    return listSchemas(input.text ?? "");
}
