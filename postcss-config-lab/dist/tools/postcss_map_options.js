import { extractMapOptions, parsePostcssConfigText, } from "../lib/postcss_config.js";
export function postcssMapOptions(input) {
    const doc = parsePostcssConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractMapOptions(doc.raw, doc.source);
}
