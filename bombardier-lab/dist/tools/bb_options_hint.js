import { listOptions } from "../lib/bb_heuristics.js";
export function bbOptionsHint(input) {
    return listOptions(input.text ?? "");
}
