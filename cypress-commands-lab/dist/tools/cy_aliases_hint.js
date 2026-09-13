import { listAliases } from "../lib/cypress_commands.js";
export function cyAliasesHint(input) {
    return listAliases(input.text ?? "");
}
