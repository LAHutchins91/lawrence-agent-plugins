import { listActions } from "../lib/valibot_schema.js";
export function vbActionsHint(input) {
    return listActions(input.text ?? "");
}
