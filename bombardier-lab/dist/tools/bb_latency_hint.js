import { listLatency } from "../lib/bb_heuristics.js";
export function bbLatencyHint(input) {
    return listLatency(input.text ?? "");
}
