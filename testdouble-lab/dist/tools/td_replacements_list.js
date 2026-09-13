import { listReplacements } from "../lib/testdouble_heuristics.js";
export function tdReplacementsList(input) {
    return listReplacements(input.text ?? "");
}
