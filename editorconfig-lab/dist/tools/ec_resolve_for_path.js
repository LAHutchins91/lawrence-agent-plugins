import { resolveForPath } from "../lib/editorconfig.js";
export function ecResolveForPath(input) {
    return resolveForPath(input.text ?? "", input.path ?? "");
}
