import { extractFutureFlags, parseRemixConfigText, } from "../lib/remix_config.js";
export function remixFutureFlags(input) {
    const doc = parseRemixConfigText(input.text ?? "");
    return extractFutureFlags(doc.raw, doc.source);
}
