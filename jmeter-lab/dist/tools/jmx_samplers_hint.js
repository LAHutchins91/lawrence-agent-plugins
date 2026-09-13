import { listSamplers } from "../lib/jmeter_heuristics.js";
export function jmxSamplersHint(input) {
    return listSamplers(input.text ?? "");
}
