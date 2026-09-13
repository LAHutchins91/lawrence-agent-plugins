import { listTargets } from "../lib/bb_heuristics.js";
export function bbTargetsList(input) {
    return listTargets(input.text ?? "");
}
