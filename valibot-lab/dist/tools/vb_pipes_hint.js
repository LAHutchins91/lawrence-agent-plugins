import { listPipes } from "../lib/valibot_schema.js";
export function vbPipesHint(input) {
    return listPipes(input.text ?? "");
}
