import { listCommands } from "../lib/wdio_heuristics.js";
export function wdioCommandsHint(input) {
    return listCommands(input.text ?? "");
}
