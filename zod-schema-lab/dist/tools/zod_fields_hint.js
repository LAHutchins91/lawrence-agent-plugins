import { listFields } from "../lib/zod_schema.js";
export function zodFieldsHint(input) {
    return listFields(input.text ?? "");
}
