import { listOptions } from "../lib/wrk_heuristics.js";
export function wrkOptionsHint(input) {
    return listOptions(input.text ?? "");
}
