import { listAssertions } from "../lib/gatling_heuristics.js";
export function gatAssertionsHint(input) {
    return listAssertions(input.text ?? "");
}
