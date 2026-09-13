import { extractHeadersHint, parseVercelJsonText, } from "../lib/vercel_json.js";
export function vercelHeadersHint(input) {
    const doc = parseVercelJsonText(input.text ?? "");
    return extractHeadersHint(doc.raw);
}
