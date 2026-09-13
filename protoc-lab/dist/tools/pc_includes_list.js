import { listIncludes } from "../lib/pc_heuristics.js";
export function pcIncludesList(input) {
    return listIncludes(input.text ?? "");
}
