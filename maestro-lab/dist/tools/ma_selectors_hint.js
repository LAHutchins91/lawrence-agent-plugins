import { listSelectors } from "../lib/maestro_heuristics.js";
export function maSelectorsHint(input) {
    return listSelectors(input.text ?? "");
}
