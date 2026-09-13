import { listNested } from "../lib/cv_schema.js";
export function cvNestedHint(input) {
    return listNested(input.text ?? "");
}
