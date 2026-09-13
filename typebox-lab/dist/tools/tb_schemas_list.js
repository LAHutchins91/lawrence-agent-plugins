import { listSchemas } from "../lib/typebox_schema.js";
export function tbSchemasList(input) {
    return listSchemas(input.text ?? "");
}
