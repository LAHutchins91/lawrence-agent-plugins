import { listHooks } from "../lib/wrk_heuristics.js";
export function wrkScriptsList(input) {
    return listHooks(input.text ?? "");
}
