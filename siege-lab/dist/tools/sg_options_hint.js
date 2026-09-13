import { listOptions } from "../lib/sg_heuristics.js";
export function sgOptionsHint(input) {
    return listOptions(input.text ?? "");
}
