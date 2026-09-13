import { listFields } from "../lib/joi_schema.js";
export function joiFieldsHint(input) {
    return listFields(input.text ?? "");
}
