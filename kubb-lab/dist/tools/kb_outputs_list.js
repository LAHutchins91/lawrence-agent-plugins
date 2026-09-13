import { listOutputs } from "../lib/kb_heuristics.js";
export function kbOutputsList(input) {
    return listOutputs(input.text ?? "");
}
