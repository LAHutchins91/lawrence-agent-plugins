import { listCompose } from "../lib/typebox_schema.js";
export function tbComposeHint(input) {
    return listCompose(input.text ?? "");
}
