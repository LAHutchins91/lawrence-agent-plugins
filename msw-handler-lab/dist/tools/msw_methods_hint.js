import { listMethods } from "../lib/msw_handlers.js";
export function mswMethodsHint(input) {
    return listMethods(input.text ?? "");
}
