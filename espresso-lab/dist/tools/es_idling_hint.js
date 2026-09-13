import { listIdling } from "../lib/espresso_heuristics.js";
export function esIdlingHint(input) {
    return listIdling(input.text ?? "");
}
