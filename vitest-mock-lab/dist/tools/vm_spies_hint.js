import { listSpies } from "../lib/vitest_mocks.js";
export function vmSpiesHint(input) {
    return listSpies(input.text ?? "");
}
