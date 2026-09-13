import { listHooks } from "../lib/kb_heuristics.js";
export function kbHooksHint(input) {
    return listHooks(input.text ?? "");
}
