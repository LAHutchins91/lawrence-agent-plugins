import { listIntercepts } from "../lib/cypress_commands.js";
export function cyInterceptsHint(input) {
    return listIntercepts(input.text ?? "");
}
