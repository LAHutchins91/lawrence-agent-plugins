import { listFixtures } from "../lib/msw_handlers.js";
export function mswFixturesHint(input) {
    return listFixtures(input.text ?? "");
}
