import { listActions } from "../lib/espresso_heuristics.js";
export function esActionsHint(input) {
    return listActions(input.text ?? "");
}
