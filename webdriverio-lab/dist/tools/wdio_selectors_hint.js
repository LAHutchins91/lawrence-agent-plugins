import { listSelectors } from "../lib/wdio_heuristics.js";
export function wdioSelectorsHint(input) {
    return listSelectors(input.text ?? "");
}
