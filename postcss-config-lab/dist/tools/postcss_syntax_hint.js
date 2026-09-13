import { extractSyntaxHint, parsePostcssConfigText, } from "../lib/postcss_config.js";
export function postcssSyntaxHint(input) {
    const doc = parsePostcssConfigText(input.text ?? "");
    if (doc.parseError && !doc.raw) {
        throw new Error(doc.parseError);
    }
    return extractSyntaxHint(doc.raw, doc.source);
}
