import { listWrkUses } from "../lib/wrk_heuristics.js";
export function wrkLuaHint(input) {
    return listWrkUses(input.text ?? "");
}
