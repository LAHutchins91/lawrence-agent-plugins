import { listPaths } from "../lib/openapi_zod.js";
export function ozPathsList(input) {
    return listPaths(input.text ?? "");
}
