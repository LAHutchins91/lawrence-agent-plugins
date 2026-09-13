import { listVerifies } from "../lib/testdouble_heuristics.js";
export function tdVerifyHint(input) {
    return listVerifies(input.text ?? "");
}
