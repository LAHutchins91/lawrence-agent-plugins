import { listScalars } from "../lib/gqlc_heuristics.js";
export function gqlcScalarsHint(input) {
    return listScalars(input.text ?? "");
}
