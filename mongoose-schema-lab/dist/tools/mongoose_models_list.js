import { listModels } from "../lib/mongoose_schema.js";
export function mongooseModelsList(input) {
    return listModels(input.text ?? "");
}
