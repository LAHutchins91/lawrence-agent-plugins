import { listMethods } from "../lib/gc_heuristics.js";
export function gcMethodsHint(input) {
    return listMethods(input.text ?? "");
}
