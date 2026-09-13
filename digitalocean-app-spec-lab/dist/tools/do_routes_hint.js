import { extractRoutesHint, parseAppSpecText } from "../lib/app_spec.js";
export function doRoutesHint(input) {
    const doc = parseAppSpecText(input.text ?? "");
    return extractRoutesHint(doc);
}
