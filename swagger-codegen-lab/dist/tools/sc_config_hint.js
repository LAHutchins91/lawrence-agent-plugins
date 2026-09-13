import { listConfigs } from "../lib/sc_heuristics.js";
export function scConfigHint(input) {
    return listConfigs(input.text ?? "");
}
