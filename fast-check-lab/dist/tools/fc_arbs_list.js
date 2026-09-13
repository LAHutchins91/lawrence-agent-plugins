import { listArbs } from "../lib/fast_check.js";
export function fcArbsList(input) {
    return listArbs(input.text ?? "");
}
