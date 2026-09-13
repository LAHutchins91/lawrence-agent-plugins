import { listPlugins } from "../lib/kb_heuristics.js";
export function kbPluginsHint(input) {
    return listPlugins(input.text ?? "");
}
