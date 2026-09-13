import { extractExtensions } from "../lib/tilt_heuristics.js";
export function tiltExtensionsHint(input) {
    const text = input.text ?? "";
    if (!text.trim()) {
        return { extensions: [], count: 0 };
    }
    const extensions = extractExtensions(text);
    return { extensions, count: extensions.length };
}
