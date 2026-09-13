import { listMatchers } from "../lib/espresso_heuristics.js";
export function esMatchersList(input) {
    return listMatchers(input.text ?? "");
}
