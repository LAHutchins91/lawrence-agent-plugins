import { listFields } from "../lib/effect_schema.js";
export function effFieldsHint(input) {
    return listFields(input.text ?? "");
}
