import { listHoisted } from "../lib/vitest_mocks.js";
export function vmHoistHint(input) {
    return listHoisted(input.text ?? "");
}
