import { extractRedirects, parseVercelJsonText, } from "../lib/vercel_json.js";
export function vercelRedirectsList(input) {
    const doc = parseVercelJsonText(input.text ?? "");
    return extractRedirects(doc.raw);
}
