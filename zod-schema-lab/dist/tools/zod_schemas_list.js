import { listSchemas } from "../lib/zod_schema.js";
export function zodSchemasList(input) {
    return listSchemas(input.text ?? "");
}
