import { listCommands } from "../lib/cypress_commands.js";
export function cyCommandsList(input) {
    return listCommands(input.text ?? "");
}
