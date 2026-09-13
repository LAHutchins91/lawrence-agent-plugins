import { concurrencyHint } from "../lib/sg_heuristics.js";
export function sgConcurrencyHint(input) {
    return concurrencyHint(input.text ?? "");
}
