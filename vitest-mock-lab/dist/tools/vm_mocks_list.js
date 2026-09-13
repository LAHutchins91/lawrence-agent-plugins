import { listMocks } from "../lib/vitest_mocks.js";
export function vmMocksList(input) {
    return listMocks(input.text ?? "");
}
