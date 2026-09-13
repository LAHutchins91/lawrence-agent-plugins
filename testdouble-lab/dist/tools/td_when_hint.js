import { listWhens } from "../lib/testdouble_heuristics.js";
export function tdWhenHint(input) {
    return listWhens(input.text ?? "");
}
