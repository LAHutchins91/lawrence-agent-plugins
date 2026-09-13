import { listHandlers } from "../lib/msw_handlers.js";
export function mswHandlersList(input) {
    return listHandlers(input.text ?? "");
}
