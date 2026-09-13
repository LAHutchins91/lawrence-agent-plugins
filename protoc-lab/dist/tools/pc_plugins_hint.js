import { listPlugins } from "../lib/pc_heuristics.js";
export function pcPluginsHint(input) {
    return listPlugins(input.text ?? "");
}
