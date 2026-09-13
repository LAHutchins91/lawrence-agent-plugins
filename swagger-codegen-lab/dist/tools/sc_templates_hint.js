import { listTemplates } from "../lib/sc_heuristics.js";
export function scTemplatesHint(input) {
    return listTemplates(input.text ?? "");
}
