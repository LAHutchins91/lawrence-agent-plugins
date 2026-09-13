import { listConstraints } from "../lib/fast_check.js";
export function fcConstraintsHint(input) {
    return listConstraints(input.text ?? "");
}
