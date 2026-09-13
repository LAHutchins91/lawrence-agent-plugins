import { listIndexes } from "../lib/mongoose_schema.js";
export function mongooseIndexesHint(input) {
    return listIndexes(input.text ?? "");
}
