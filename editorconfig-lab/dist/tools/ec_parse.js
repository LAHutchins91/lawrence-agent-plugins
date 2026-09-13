import { parseEditorConfigText } from "../lib/editorconfig.js";
export function ecParse(input) {
    return parseEditorConfigText(input.text ?? "");
}
