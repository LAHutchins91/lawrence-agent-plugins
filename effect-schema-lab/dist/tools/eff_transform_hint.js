import { listTransforms } from "../lib/effect_schema.js";
export function effTransformHint(input) {
    return listTransforms(input.text ?? "");
}
