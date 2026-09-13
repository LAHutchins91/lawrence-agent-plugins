import { listCommands } from "../lib/maestro_heuristics.js";
export function maCommandsHint(input) {
    return listCommands(input.text ?? "");
}
