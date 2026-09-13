import { listFlows } from "../lib/maestro_heuristics.js";
export function maFlowsList(input) {
    return listFlows(input.text ?? "");
}
