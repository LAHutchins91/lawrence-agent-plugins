import { listPlugins } from "../lib/gqlc_heuristics.js";
export function gqlcPluginsList(input) {
    return listPlugins(input.text ?? "");
}
