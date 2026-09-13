import { extractRewrites, parseVercelJsonText, } from "../lib/vercel_json.js";
export function vercelRewritesList(input) {
    const doc = parseVercelJsonText(input.text ?? "");
    return extractRewrites(doc.raw);
}
