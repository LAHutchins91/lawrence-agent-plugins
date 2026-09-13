import { listDecorators } from "../lib/cv_schema.js";
export function cvDecoratorsHint(input) {
    return listDecorators(input.text ?? "");
}
