import { listSpecs } from "../lib/wdio_heuristics.js";
export function wdioSpecsList(input) {
    return listSpecs(input.text ?? "");
}
