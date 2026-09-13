import { listOps } from "../lib/openapi_zod.js";
export function ozOpsHint(input) {
    return listOps(input.text ?? "");
}
