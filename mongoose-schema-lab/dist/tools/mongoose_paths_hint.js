import { listPaths } from "../lib/mongoose_schema.js";
export function mongoosePathsHint(input) {
    return listPaths(input.text ?? "");
}
