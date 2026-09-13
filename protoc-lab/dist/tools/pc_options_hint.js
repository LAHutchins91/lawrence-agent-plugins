import { listOptions } from "../lib/pc_heuristics.js";
export function pcOptionsHint(input) {
    return listOptions(input.text ?? "");
}
