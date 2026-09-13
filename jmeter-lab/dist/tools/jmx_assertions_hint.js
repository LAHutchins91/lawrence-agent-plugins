import { listAssertions } from "../lib/jmeter_heuristics.js";
export function jmxAssertionsHint(input) {
    return listAssertions(input.text ?? "");
}
